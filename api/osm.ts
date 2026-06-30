import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { lat, lng, type, radius = "2000" } = req.query;
  if (!lat || !lng || !type) {
    return res.status(400).json({ error: "Missing required params: lat, lng, type" });
  }

  try {
    const query = `
      [out:json][timeout:10];
      node["amenity"="${type}"](around:${radius},${lat},${lng});
      out body;
    `;
    const response = await axios.post("https://overpass-api.de/api/interpreter", query, {
      timeout: 10000,
      headers: { "Content-Type": "text/plain" },
    });
    return res.status(200).json(response.data);
  } catch (error: any) {
    console.warn("Overpass API failed, returning empty fallback:", error.message);
    return res.status(200).json({ elements: [], fallback: true });
  }
}
