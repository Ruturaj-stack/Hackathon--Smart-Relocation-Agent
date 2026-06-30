import { db } from './index.ts';
import { neighborhoods } from './schema.ts';

const chicagoNeighborhoods = [
  {
    name: "Logan Square",
    avgRent: 1800,
    crimeRate: "Medium",
    transitScore: 85,
    livabilityScore: 88,
    description: "Trendy, historic, and known for its vibrant arts scene and great food.",
    lat: 41.9231,
    lng: -87.7093,
  },
  {
    name: "Hyde Park",
    avgRent: 1600,
    crimeRate: "Medium",
    transitScore: 78,
    livabilityScore: 85,
    description: "Home to the University of Chicago, with rich history and lakefront access.",
    lat: 41.7943,
    lng: -87.5907,
  },
  {
    name: "Lincoln Park",
    avgRent: 2400,
    crimeRate: "Low",
    transitScore: 92,
    livabilityScore: 94,
    description: "Upscale, beautiful parks, and proximity to the lake and zoo.",
    lat: 41.9214,
    lng: -87.6513,
  },
  {
    name: "Rogers Park",
    avgRent: 1400,
    crimeRate: "Medium",
    transitScore: 82,
    livabilityScore: 80,
    description: "Diverse, affordable, and right on the lake at the northern edge of the city.",
    lat: 42.0094,
    lng: -87.6755,
  },
  {
    name: "Wicker Park",
    avgRent: 2100,
    crimeRate: "Medium",
    transitScore: 90,
    livabilityScore: 89,
    description: "Nightlife hub with boutiques, coffee shops, and easy Blue Line access.",
    lat: 41.9108,
    lng: -87.6778,
  },
  {
    name: "Avondale",
    avgRent: 1550,
    crimeRate: "Low",
    transitScore: 75,
    livabilityScore: 82,
    description: "Up-and-coming neighborhood with a mix of industrial and residential charm.",
    lat: 41.9415,
    lng: -87.7025,
  },
  {
    name: "Bridgeport",
    avgRent: 1300,
    crimeRate: "Low",
    transitScore: 70,
    livabilityScore: 78,
    description: "Historic south side neighborhood with a strong community feel.",
    lat: 41.8364,
    lng: -87.6485,
  },
  {
    name: "Albany Park",
    avgRent: 1450,
    crimeRate: "Medium",
    transitScore: 80,
    livabilityScore: 81,
    description: "One of the most diverse neighborhoods in the US, known for its global cuisine.",
    lat: 41.9683,
    lng: -87.7233,
  }
];

async function seed() {
  console.log('Seeding neighborhoods...');
  await db.insert(neighborhoods).values(chicagoNeighborhoods).onConflictDoNothing();
  console.log('Seeding completed!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
