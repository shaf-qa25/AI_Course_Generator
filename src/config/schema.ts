import { pgTable, text, varchar, timestamp, jsonb, serial } from "drizzle-orm/pg-core";

// 1. User Table (Clerk sync ke liye)
export const usersTable = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    imageUrl: text('imageUrl'), // Optional: Clerk ki profile pic save karne ke liye
    createdAt: timestamp('createdAt').defaultNow(),
});

// 2. Courses Table (Tera existing wala, bas isse export kar rahe hain)
export const Courses = pgTable('courses', {
    id: serial('id').primaryKey(),
    courseId: varchar('courseId').notNull(),
    userId: varchar('userId').notNull(), // Isme hum user ka email store karenge
    prompt: text('prompt').notNull(),
    type: varchar('type').notNull(),
    content: jsonb('content').notNull(),
    createdAt: timestamp('createdAt').defaultNow(),
});