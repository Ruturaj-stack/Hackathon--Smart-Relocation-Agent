import type { VercelRequest, VercelResponse } from '@vercel/node';
import CHICAGO_HOUSING_DATA from '../src/data/chicago-housing.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    return res.status(200).json(CHICAGO_HOUSING_DATA);
  } catch (error) {
    console.error("Neighborhoods endpoint error:", error);
    return res.status(200).json(CHICAGO_HOUSING_DATA);
  }
}
