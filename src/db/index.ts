import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.ts';
import fs from 'fs';
import path from 'path';

let db: any;

const useLocalJson = !process.env.SQL_HOST;

if (!useLocalJson) {
  const pool = new Pool({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DB_NAME,
    connectionTimeoutMillis: 15000,
  });

  pool.on('error', (err) => {
    console.error('Unexpected error on idle SQL pool client:', err);
  });

  db = drizzle(pool, { schema });
} else {
  console.warn("⚠️ SQL_HOST not set. Falling back to local file-based database (db.json)");

  const DB_FILE = path.join(process.cwd(), 'db.json');

  const initialNeighborhoods = [
    {
      id: 1,
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
      id: 2,
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
      id: 3,
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
      id: 4,
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
      id: 5,
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
      id: 6,
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
      id: 7,
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
      id: 8,
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

  const getDbData = () => {
    try {
      if (!fs.existsSync(DB_FILE)) {
        const initialData = {
          neighborhoods: initialNeighborhoods,
          users: [],
          userSearches: []
        };
        fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
        return initialData;
      }
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    } catch (e) {
      console.error("Error reading db.json, returning empty defaults", e);
      return { neighborhoods: initialNeighborhoods, users: [], userSearches: [] };
    }
  };

  const saveDbData = (data: any) => {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    } catch (e) {
      console.error("Error writing db.json", e);
    }
  };

  db = {
    select: () => ({
      from: (table: any) => {
        const tableName = table[Symbol.for('drizzle:Name')] || (table.config && table.config.name);
        const data = getDbData();
        const records = data[tableName] || [];

        const chain = {
          where: (condition: any) => {
            let filteredRecords = [...records];
            if (condition && condition.queryChunks) {
              let budget: number | null = null;
              for (const chunk of condition.queryChunks) {
                if (chunk && typeof chunk === 'object' && 'value' in chunk && typeof chunk.value === 'number') {
                  budget = chunk.value;
                  break;
                }
              }
              if (budget !== null) {
                filteredRecords = filteredRecords.filter((r: any) => r.avgRent <= budget!);
              }
            }
            const promiseResult = Promise.resolve(filteredRecords);
            return Object.assign(promiseResult, {
              then: promiseResult.then.bind(promiseResult),
              catch: promiseResult.catch.bind(promiseResult)
            });
          },
          then: (onfulfilled: any, onrejected: any) => {
            return Promise.resolve(records).then(onfulfilled, onrejected);
          },
          catch: (onrejected: any) => {
            return Promise.resolve(records).catch(onrejected);
          }
        };
        return chain;
      }
    }),

    insert: (table: any) => {
      const tableName = table[Symbol.for('drizzle:Name')] || (table.config && table.config.name);

      return {
        values: (valueOrValues: any) => {
          const valuesArray = Array.isArray(valueOrValues) ? valueOrValues : [valueOrValues];
          const data = getDbData();
          if (!data[tableName]) data[tableName] = [];

          const insertedRecords: any[] = [];

          for (const val of valuesArray) {
            const newRecord = { ...val };

            if (!newRecord.id) {
              const maxId = data[tableName].reduce((max: number, r: any) => Math.max(max, r.id || 0), 0);
              newRecord.id = maxId + 1;
            }

            if (tableName === 'users') {
              const existingIndex = data.users.findIndex((u: any) => u.uid === newRecord.uid);
              if (existingIndex > -1) {
                data.users[existingIndex] = { ...data.users[existingIndex], ...newRecord };
                insertedRecords.push(data.users[existingIndex]);
              } else {
                data.users.push(newRecord);
                insertedRecords.push(newRecord);
              }
            } else {
              data[tableName].push(newRecord);
              insertedRecords.push(newRecord);
            }
          }

          saveDbData(data);

          const chain = {
            onConflictDoUpdate: () => chain,
            onConflictDoNothing: () => chain,
            returning: () => {
              const promiseResult = Promise.resolve(insertedRecords);
              return Object.assign(promiseResult, {
                then: promiseResult.then.bind(promiseResult),
                catch: promiseResult.catch.bind(promiseResult)
              });
            },
            then: (onfulfilled: any, onrejected: any) => {
              return Promise.resolve(insertedRecords).then(onfulfilled, onrejected);
            },
            catch: (onrejected: any) => {
              return Promise.resolve(insertedRecords).catch(onrejected);
            }
          };
          return chain;
        }
      };
    }
  };
}

export { db };
