import { randomUUID } from 'node:crypto'
import { relations, sql } from 'drizzle-orm'
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id')
    .$defaultFn(() => randomUUID())
    .primaryKey(),
  name: text('name').notNull(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  about: text('about'),
  profileUrl: text('profile_url'),
  semester: integer('semester').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => sql`now()`),
})

export const projectStatusEnum = pgEnum('project_status', [
  'draft',
  'published',
])

export const projects = pgTable('projects', {
  id: uuid('id')
    .$defaultFn(() => randomUUID())
    .primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  bannerUrl: text('banner_url').notNull(),
  content: text('content'),
  publishedYear: integer('published_year').notNull(),
  status: projectStatusEnum('status').default('draft').notNull(),
  semester: integer('semester').notNull(),
  allowComments: boolean('allow_comments').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => sql`now()`),
  authorId: uuid('author_id')
    .references(() => users.id)
    .notNull(),
  subjectId: uuid('subject_id')
    .references(() => subjects.id)
    .notNull(),
})

export const subjects = pgTable('subjects', {
  id: uuid('id')
    .$defaultFn(() => randomUUID())
    .primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => sql`now()`),
})

export const professors = pgTable('professors', {
  id: uuid('id')
    .$defaultFn(() => randomUUID())
    .primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => sql`now()`),
})

export const projectProfessors = pgTable(
  'project_professors',
  {
    projectId: uuid('project_id')
      .references(() => projects.id)
      .notNull(),
    professorId: uuid('professor_id')
      .references(() => professors.id)
      .notNull(),
  },
  ({ professorId, projectId }) => ({
    fk: primaryKey({ columns: [projectId, professorId] }),
  }),
)

export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
}))

export const projectRelations = relations(projects, ({ one, many }) => ({
  author: one(users),
  subject: one(subjects),
  professors: many(projectProfessors),
}))

export const subjectRelations = relations(subjects, ({ many }) => ({
  projects: many(projects),
}))

export const professorRelations = relations(professors, ({ many }) => ({
  projects: many(projectProfessors),
}))

export const schema = {
  users,
  projects,
  subjects,
  professors,
  projectProfessors,
  usersRelations,
  projectRelations,
  subjectRelations,
  professorRelations,
}

export type NewUser = typeof users.$inferInsert
export type User = typeof users.$inferSelect
export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
export type Subject = typeof subjects.$inferSelect
export type NewSubject = typeof subjects.$inferInsert
export type Professor = typeof professors.$inferSelect
export type NewProfessor = typeof professors.$inferInsert
