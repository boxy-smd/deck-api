import { sql } from 'drizzle-orm'
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').notNull().primaryKey().default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  about: text('about'),
  profileUrl: text('profile_url'),
  semester: integer('semester').notNull(),
  createdAt: timestamp('created_at').notNull().default(sql`now()`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`now()`)
    .$onUpdate(() => sql`now()`),
})

export const projects = pgTable('projects', {
  id: uuid('id').notNull().primaryKey().default(sql`gen_random_uuid()`),
  title: text('title').notNull(),
  description: text('description').notNull(),
  bannerUrl: text('banner_url').notNull(),
  content: text('content'),
  semester: integer('semester').notNull(),
  allowComments: boolean('allow_comments').notNull(),
  createdAt: timestamp('created_at').notNull().default(sql`now()`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`now()`)
    .$onUpdate(() => sql`now()`),
  authorId: uuid('author_id')
    .references(() => users.id)
    .notNull(),
  subjectId: uuid('subject_id').references(() => subjects.id),
  professors: uuid('professors')
    .references(() => professors.id)
    .array(),
})

export const subjects = pgTable('subjects', {
  id: uuid('id').notNull().primaryKey().default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  code: text('code').notNull().unique(),
  createdAt: timestamp('created_at').notNull().default(sql`now()`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`now()`)
    .$onUpdate(() => sql`now()`),
})

export const professors = pgTable('professors', {
  id: uuid('id').notNull().primaryKey().default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').notNull().default(sql`now()`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`now()`)
    .$onUpdate(() => sql`now()`),
})

export const schema = {
  users,
  projects,
  subjects,
  professors,
}

export type NewUser = typeof users.$inferInsert
export type User = typeof users.$inferSelect
export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
export type Subject = typeof subjects.$inferSelect
export type NewSubject = typeof subjects.$inferInsert
export type Professor = typeof professors.$inferSelect
export type NewProfessor = typeof professors.$inferInsert
