import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import { db } from "../src/db/index.ts";
import { users, userSearches } from "../src/db/schema.ts";
import { optionalAuth } from "../src/middleware/auth.ts";
import CHICAGO_HOUSING_DATA from "../src/data/chicago-housing.ts";
import { getNeighborhoodAmenitiesFromFallback } from "../src/data/osm-fallback.ts";
import type { SearchPrefs, NeighborhoodAmenities } from "../src/data/types.ts";

const apiKey = process.env.GEMINI_API_KEY;
let ai: any = null;
if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  ai = new GoogleGenAI({ apiKey });
  console.log("✅ Gemini AI initialized successfully.");
} else {
  console.warn("⚠️  GEMINI_API_KEY not set — recommendations will use mock fallback data.");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Execute optionalAuth middleware
  await new Promise<void>((resolve) => {
    optionalAuth(req as any, res as any, () => {
      resolve();
    });
  });

  const authReq = req as any; // Has optional user field after middleware runs

  try {
    const prefs: SearchPrefs = authReq.body;
    const { budget, radius = 2000, maxCrimeLevel = "Any", amenities } = prefs;

    if (!budget || budget < 500) {
      return res.status(400).json({ error: "Invalid budget. Must be at least $500/month." });
    }

    // ─── STEP 1: Filter by budget and crime level ─────────────────
    let filtered = CHICAGO_HOUSING_DATA.filter((n) => n.avgRent <= budget);

    if (maxCrimeLevel === "Low") {
      filtered = filtered.filter((n) => n.crimeRate === "Low");
    } else if (maxCrimeLevel === "Medium") {
      filtered = filtered.filter((n) => n.crimeRate !== "High");
    }

    if (filtered.length === 0) {
      return res.status(200).json({
        recommendations: [],
        message: "No neighborhoods found matching your criteria. Try increasing your budget or relaxing the crime filter.",
      });
    }

    // Sort by livability score descending, take top 8 for analysis
    const candidates = filtered
      .sort((a, b) => b.livabilityScore - a.livabilityScore)
      .slice(0, 8);

    // ─── STEP 2: Fetch OSM amenity data ──────────────────────────
    const amenityData: Record<number, NeighborhoodAmenities> = {};

    for (const neighborhood of candidates) {
      let osmResult: NeighborhoodAmenities | null = null;

      // Try live Overpass API first
      if (amenities && (amenities.train || amenities.grocery || amenities.hospital || amenities.pharmacy || amenities.school)) {
        try {
          const amenityTypes = [];
          if (amenities.train) amenityTypes.push("subway_entrance");
          if (amenities.grocery) amenityTypes.push("supermarket");
          if (amenities.hospital) amenityTypes.push("hospital");
          if (amenities.pharmacy) amenityTypes.push("pharmacy");
          if (amenities.school) amenityTypes.push("school");

          const overpassQuery = `
            [out:json][timeout:10];
            (
              ${amenityTypes.map(t => `node["amenity"="${t}"](around:${radius},${neighborhood.lat},${neighborhood.lng});`).join("\n")}
            );
            out body;
          `;

          const response = await axios.post(
            "https://overpass-api.de/api/interpreter",
            overpassQuery,
            { timeout: 10000, headers: { "Content-Type": "text/plain" } }
          );

          const elements = response.data?.elements || [];
          osmResult = {
            neighborhoodId: neighborhood.id,
            neighborhoodName: neighborhood.name,
            trainStations: elements.filter((e: any) => e.tags?.amenity === "subway_entrance"),
            groceries: elements.filter((e: any) => e.tags?.amenity === "supermarket" || e.tags?.amenity === "grocery"),
            hospitals: elements.filter((e: any) => e.tags?.amenity === "hospital"),
            pharmacies: elements.filter((e: any) => e.tags?.amenity === "pharmacy"),
            schools: elements.filter((e: any) => e.tags?.amenity === "school"),
            osmSource: "live",
          };
        } catch (osmErr: any) {
          console.warn(`⚠️  Overpass API unavailable for ${neighborhood.name}, using fallback. (${osmErr.message})`);
        }
      }

      // ─── STEP 3: Fall back to embedded OSM data ──────────────
      if (!osmResult) {
        const fallback = getNeighborhoodAmenitiesFromFallback(neighborhood.id);
        osmResult = {
          neighborhoodId: neighborhood.id,
          neighborhoodName: neighborhood.name,
          ...fallback,
        };
      }

      amenityData[neighborhood.id] = osmResult;
    }

    // ─── STEP 4: Combine housing + OSM data ──────────────────────
    const combinedContext = candidates.map((n) => {
      const osm = amenityData[n.id] || {};
      return {
        ...n,
        osm: {
          trainCount: (osm as any).trainStations?.length || 0,
          trainNames: ((osm as any).trainStations || []).map((s: any) => s.tags?.name).filter(Boolean).slice(0, 2),
          groceryCount: (osm as any).groceries?.length || 0,
          groceryNames: ((osm as any).groceries || []).map((s: any) => s.tags?.name).filter(Boolean).slice(0, 2),
          hospitalCount: (osm as any).hospitals?.length || 0,
          pharmacyCount: (osm as any).pharmacies?.length || 0,
          schoolCount: (osm as any).schools?.length || 0,
          source: (osm as any).osmSource || "fallback",
        },
      };
    });

    // ─── STEP 5: Gemini grounded reasoning ───────────────────────
    let recommendations: any[] = [];

    if (ai) {
      const userPrefsText = `
Monthly Budget: $${budget}/month
Search Radius: ${radius}m
Maximum Crime Level: ${maxCrimeLevel}
Requested Amenities: ${Object.entries(amenities || {}).filter(([, v]) => v).map(([k]) => k).join(", ") || "None specified"}
`;

      const neighborhoodContext = combinedContext
        .map(
          (n, i) => `
[${i + 1}] ${n.name}
  Housing Data (Static Dataset):
    - Avg Rent: $${n.avgRent}/mo (Range: $${n.minRent}–$${n.maxRent})
    - Crime Rate: ${n.crimeRate} (Index: ${n.crimeIndex}/100, lower = safer)
    - Transit Score: ${n.transitScore}/100
    - Livability Score: ${n.livabilityScore}/100
    - Walk Score: ${n.walkScore}/100
    - Bike Score: ${n.bikeScore}/100
    - Median Household Income: $${n.medianIncome?.toLocaleString()}/yr
    - Population: ${n.population?.toLocaleString()}
    - Description: ${n.description}
  OpenStreetMap Data (${n.osm.source} data, radius: ${radius}m):
    - Transit Stations: ${n.osm.trainCount} (${n.osm.trainNames?.join(", ") || "none named"})
    - Grocery Stores: ${n.osm.groceryCount} (${n.osm.groceryNames?.join(", ") || "none named"})
    - Hospitals: ${n.osm.hospitalCount}
    - Pharmacies: ${n.osm.pharmacyCount}
    - Schools: ${n.osm.schoolCount}
`
        )
        .join("\n");

      const prompt = `
You are an expert Chicago relocation agent with deep knowledge of Chicago neighborhoods.
You MUST base your recommendations ONLY on the data provided below. Do NOT invent or hallucinate any data points.

User Preferences:
${userPrefsText}

Available Chicago Neighborhoods (Combined Housing + OpenStreetMap Data):
${neighborhoodContext}

Instructions:
1. Analyze all neighborhoods above using ONLY the provided data.
2. Select the TOP 3 neighborhoods that best match the user's budget and preferences.
3. For each recommendation, cite specific data points as evidence.
4. Provide a confidence score (0–100) based on data completeness and match quality.
5. Include realistic pros and cons based solely on the data provided.

Return a valid JSON array (no markdown, no extra text) with exactly 3 objects, each having these fields:
{
  "name": "Neighborhood Name",
  "avgRent": 0,
  "livabilityScore": 0,
  "crimeRate": "Low|Medium|High",
  "crimeIndex": 0,
  "transitScore": 0,
  "walkScore": 0,
  "hasGrocery": true,
  "hasTransit": true,
  "hasHospital": true,
  "hasPharmacy": true,
  "hasSchool": true,
  "reasoning": "2-3 sentence explanation of why this neighborhood was recommended",
  "pros": ["pro1", "pro2", "pro3"],
  "cons": ["con1", "con2"],
  "whySelected": "One sentence summary of the key reason this neighborhood was selected",
  "confidenceScore": 85,
  "housingEvidence": "Specific evidence from the static dataset (rent, crime index, scores)",
  "osmEvidence": "Specific evidence from OpenStreetMap data (transit stations, grocery count, etc.)"
}
`;

      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: prompt,
          config: { temperature: 0.3 }, // Low temperature for grounded responses
        });

        const rawText = response.text || "";
        const jsonMatch = rawText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          recommendations = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Gemini did not return valid JSON array");
        }
      } catch (geminiErr: any) {
        console.error("Gemini error, using smart fallback:", geminiErr.message);
        recommendations = generateSmartFallback(combinedContext, prefs);
      }
    } else {
      // No API key — use smart fallback
      recommendations = generateSmartFallback(combinedContext, prefs);
    }

    // Save search history if user is authenticated
    if (authReq.user) {
      try {
        const [dbUser] = await db
          .insert(users)
          .values({ uid: authReq.user.uid, email: authReq.user.email! })
          .onConflictDoUpdate({ target: users.uid, set: { email: authReq.user.email! } })
          .returning();

        await db.insert(userSearches).values({
          userId: dbUser.id,
          budget,
          preferences: amenities || {},
          recommendations,
        });
      } catch (dbErr) {
        console.warn("Could not save search history (non-critical):", dbErr);
      }
    }

    const osmSources = Object.values(amenityData).map((d) => (d as any).osmSource || "fallback");
    const usingFallback = osmSources.every((s) => s === "fallback");

    return res.status(200).json({
      recommendations,
      metadata: {
        totalCandidates: filtered.length,
        analyzedNeighborhoods: candidates.length,
        osmSource: usingFallback ? "fallback" : "live",
        aiPowered: !!ai,
        datasetVersion: "Chicago Housing Metrics v1.0 (22 neighborhoods)",
      },
    });
  } catch (error: any) {
    console.error("Search endpoint error:", error);
    return res.status(500).json({ error: "Search failed: " + (error.message || "Unknown error") });
  }
}

/**
 * Smart fallback recommendation generator used when Gemini is unavailable.
 * Scores neighborhoods based on user preferences without AI.
 */
function generateSmartFallback(candidates: any[], prefs: SearchPrefs): any[] {
  const scored = candidates.map((n) => {
    let score = n.livabilityScore;

    // Amenity preference scoring
    if (prefs.amenities?.train && n.osm.trainCount > 0) score += 15;
    if (prefs.amenities?.grocery && n.osm.groceryCount > 0) score += 12;
    if (prefs.amenities?.hospital && n.osm.hospitalCount > 0) score += 10;
    if (prefs.amenities?.pharmacy && n.osm.pharmacyCount > 0) score += 8;
    if (prefs.amenities?.school && n.osm.schoolCount > 0) score += 8;

    // Budget fit bonus
    const budgetFit = (prefs.budget - n.avgRent) / prefs.budget;
    score += budgetFit * 10;

    // Crime penalty
    if (n.crimeRate === "High") score -= 20;
    else if (n.crimeRate === "Low") score += 10;

    return { ...n, _score: score };
  });

  return scored
    .sort((a, b) => b._score - a._score)
    .slice(0, 3)
    .map((n, idx) => ({
      name: n.name,
      avgRent: n.avgRent,
      livabilityScore: n.livabilityScore,
      crimeRate: n.crimeRate,
      crimeIndex: n.crimeIndex,
      transitScore: n.transitScore,
      walkScore: n.walkScore,
      hasGrocery: n.osm.groceryCount > 0,
      hasTransit: n.osm.trainCount > 0,
      hasHospital: n.osm.hospitalCount > 0,
      hasPharmacy: n.osm.pharmacyCount > 0,
      hasSchool: n.osm.schoolCount > 0,
      reasoning: `${n.name} is a strong match for your $${prefs.budget}/month budget. With a livability score of ${n.livabilityScore}/100 and ${n.crimeRate.toLowerCase()} crime, it offers a quality urban lifestyle. The neighborhood's transit score of ${n.transitScore}/100 ensures good connectivity.`,
      pros: [
        `Average rent of $${n.avgRent}/mo fits your budget`,
        `Livability score: ${n.livabilityScore}/100`,
        n.crimeRate === "Low" ? "Low crime rate — very safe area" : `${n.crimeRate} crime level`,
        n.osm.trainCount > 0 ? `${n.osm.trainCount} nearby transit station(s)` : "Accessible by bus",
        n.walkScore >= 80 ? `Highly walkable (${n.walkScore}/100)` : `Walk score: ${n.walkScore}/100`,
      ].filter(Boolean),
      cons: [
        n.avgRent > prefs.budget * 0.85 ? "Near the top of your budget range" : null,
        n.crimeRate === "High" ? "Higher crime index — research specific blocks" : null,
        n.osm.groceryCount === 0 ? "Limited grocery stores in immediate radius" : null,
        n.transitScore < 75 ? "Moderate transit access — may need a car" : null,
      ].filter(Boolean).slice(0, 3),
      whySelected: `Best ${idx === 0 ? "overall" : idx === 1 ? "value" : "alternative"} match combining budget fit and livability in your price range.`,
      confidenceScore: Math.min(95, 60 + (3 - idx) * 8),
      housingEvidence: `Avg rent $${n.avgRent}/mo (range $${n.minRent}–$${n.maxRent}), crime index ${n.crimeIndex}/100, transit score ${n.transitScore}/100, livability ${n.livabilityScore}/100, median income $${n.medianIncome?.toLocaleString()}/yr.`,
      osmEvidence: `Within ${prefs.radius}m radius (${n.osm.source} data): ${n.osm.trainCount} subway stations, ${n.osm.groceryCount} grocery stores, ${n.osm.hospitalCount} hospitals, ${n.osm.pharmacyCount} pharmacies, ${n.osm.schoolCount} schools.`,
    }));
}
