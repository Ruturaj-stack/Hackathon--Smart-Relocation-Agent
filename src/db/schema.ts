import { relations } from 'drizzle-orm';
import { doublePrecision, integer, pgTable, serial, text, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const neighborhoods = pgTable('neighborhoods', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  avgRent: integer('avg_rent').notNull(),
  crimeRate: text('crime_rate').notNull(), // e.g., Low, Medium, High
  transitScore: integer('transit_score').notNull(),
  livabilityScore: integer('livability_score').notNull(),
  description: text('description'),
  lat: doublePrecision('lat').notNull(),
  lng: doublePrecision('lng').notNull(),
});

export const userSearches = pgTable('user_searches', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  budget: integer('budget').notNull(),
  preferences: jsonb('preferences').notNull(), // { train: boolean, grocery: boolean, etc. }
  recommendations: jsonb('recommendations'), // Array of neighborhood results
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  searches: many(userSearches),
}));

export const userSearchesRelations = relations(userSearches, ({ one }) => ({
  user: one(users, {
    fields: [userSearches.userId],
    references: [users.id],
  }),
}));
