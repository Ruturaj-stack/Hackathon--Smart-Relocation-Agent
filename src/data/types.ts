/**
 * Shared TypeScript interfaces for HomeWise AI
 * Defines contracts for housing data, OSM data, search preferences, and recommendations.
 */

/** A single Chicago neighborhood from the static housing dataset */
export interface Neighborhood {
  id: number;
  name: string;
  avgRent: number;
  minRent: number;
  maxRent: number;
  crimeRate: 'Low' | 'Medium' | 'High';
  crimeIndex: number;        // 0–100 (lower is safer)
  transitScore: number;      // 0–100
  livabilityScore: number;   // 0–100
  walkScore: number;         // 0–100
  bikeScore: number;         // 0–100
  lat: number;
  lng: number;
  description: string;
  population: number;
  communityArea: string;
  medianIncome: number;
}

/** User search preferences */
export interface SearchPrefs {
  budget: number;
  radius: number;          // metres
  maxCrimeLevel: 'Any' | 'Low' | 'Medium';
  amenities: {
    train: boolean;
    grocery: boolean;
    hospital: boolean;
    pharmacy: boolean;
    school: boolean;
  };
}

/** A single OSM element node (amenity) */
export interface OSMElement {
  id: number;
  lat: number;
  lon: number;
  tags: {
    amenity?: string;
    name?: string;
    operator?: string;
    [key: string]: string | undefined;
  };
}

/** Grouped OSM amenity counts per neighborhood */
export interface NeighborhoodAmenities {
  neighborhoodId: number;
  neighborhoodName: string;
  trainStations: OSMElement[];
  groceries: OSMElement[];
  hospitals: OSMElement[];
  pharmacies: OSMElement[];
  schools: OSMElement[];
  osmSource: 'live' | 'fallback';
}

/** Full grounded recommendation from Gemini */
export interface Recommendation {
  name: string;
  avgRent: number;
  livabilityScore: number;
  crimeRate: string;
  crimeIndex: number;
  transitScore: number;
  walkScore: number;
  
  // OSM-grounded amenity availability
  hasGrocery: boolean;
  hasTransit: boolean;
  hasHospital: boolean;
  hasPharmacy: boolean;
  hasSchool: boolean;
  
  // AI reasoning fields
  reasoning: string;
  pros: string[];
  cons: string[];
  whySelected: string;
  confidenceScore: number;   // 0–100
  
  // Grounding evidence
  housingEvidence: string;   // Evidence from static dataset
  osmEvidence: string;       // Evidence from OSM data
}
