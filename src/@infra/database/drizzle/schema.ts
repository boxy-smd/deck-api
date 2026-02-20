import { relations } from 'drizzle-orm'
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

// Enums
export const userRoleEnum = pgEnum('UserRole', [
  'STUDENT',
  'CURATOR',
  'MODERATOR',
  'ADMIN',
])

export const userStatusEnum = pgEnum('UserStatus', [
  'ACTIVE',
  'INACTIVE',
  'BANNED',
])

export const subjectTypeEnum = pgEnum('SubjectType', [
  'OBLIGATORY',
  'ELECTIVE',
  'OPTIONAL',
])

export const projectStatusEnum = pgEnum('ProjectStatus', [
  'DRAFT',
  'PUBLISHED',
  'ARCHIVED',
])

// Tables

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  name: text('name').notNull(),
  username: text('username').unique().notNull(),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  about: text('about'),
  profileUrl: text('profile_url'),
  passwordResetToken: text('password_reset_token'),
  passwordResetExpires: timestamp('password_reset_expires'),
  role: userRoleEnum('role').notNull(),
  status: userStatusEnum('status').notNull(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at'),
})

export const studentProfiles = pgTable('student_profiles', {
  studentId: uuid('student_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  semester: integer('semester').notNull(),
})

export const trails = pgTable('trails', {
  id: uuid('id').primaryKey(),
  name: text('name').notNull(),
  color: text('color').notNull(),
  lightColor: text('light_color').notNull(),
  darkColor: text('dark_color').notNull(),
  icon: text('icon').notNull(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at'),
})

export const studentHasTrail = pgTable(
  'student_has_trail',
  {
    studentId: uuid('student_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    trailId: uuid('trail_id')
      .references(() => trails.id)
      .notNull(),
  },
  t => ({
    pk: primaryKey({ columns: [t.studentId, t.trailId] }),
  }),
)

export const subjects = pgTable('subjects', {
  id: uuid('id').primaryKey(),
  code: text('code').unique().notNull(),
  name: text('name').notNull(),
  workload: integer('workload').notNull(),
  semester: integer('semester').notNull(),
  type: subjectTypeEnum('type').notNull(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at'),
})

export const professors = pgTable('professors', {
  id: uuid('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at'),
})

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  content: text('content'),
  semester: integer('semester'),
  publishedYear: integer('published_year'),
  status: projectStatusEnum('status').notNull(),
  allowComments: boolean('allow_comments').notNull(),
  bannerUrl: text('banner_url'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at'),
  authorId: uuid('author_id')
    .references(() => users.id)
    .notNull(),
  subjectId: uuid('subject_id').references(() => subjects.id),
})

export const projectProfessors = pgTable(
  'project_professors',
  {
    projectId: uuid('project_id')
      .references(() => projects.id, { onDelete: 'cascade' })
      .notNull(),
    professorId: uuid('professor_id')
      .references(() => professors.id)
      .notNull(),
  },
  t => ({
    pk: primaryKey({ columns: [t.projectId, t.professorId] }),
  }),
)

export const projectTrails = pgTable(
  'project_trails',
  {
    projectId: uuid('project_id')
      .references(() => projects.id, { onDelete: 'cascade' })
      .notNull(),
    trailId: uuid('trail_id')
      .references(() => trails.id)
      .notNull(),
  },
  t => ({
    pk: primaryKey({ columns: [t.projectId, t.trailId] }),
  }),
)

export const comments = pgTable('comments', {
  id: uuid('id').primaryKey(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at'),
  authorId: uuid('author_id')
    .references(() => users.id)
    .notNull(),
  projectId: uuid('project_id')
    .references(() => projects.id, { onDelete: 'cascade' })
    .notNull(),
})

export const reports = pgTable('reports', {
  id: uuid('id').primaryKey(),
  content: text('content').notNull(),
  isResolved: boolean('is_resolved').notNull(),
  resolvedAt: timestamp('resolved_at'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at'),
  authorId: uuid('author_id')
    .references(() => users.id)
    .notNull(),
  commentId: uuid('comment_id')
    .references(() => comments.id, { onDelete: 'cascade' })
    .notNull(),
  resolvedBy: uuid('resolved_by').references(() => users.id),
})

// Relations

export const usersRelations = relations(users, ({ one, many }) => ({
  projects: many(projects),
  comments: many(comments),
  reports: many(reports, { relationName: 'ReportAuthor' }),
  resolvedReports: many(reports, { relationName: 'ReportResolver' }),
  studentProfile: one(studentProfiles, {
    fields: [users.id],
    references: [studentProfiles.studentId],
  }),
  trails: many(studentHasTrail),
}))

export const studentProfilesRelations = relations(
  studentProfiles,
  ({ one }) => ({
    user: one(users, {
      fields: [studentProfiles.studentId],
      references: [users.id],
    }),
  }),
)

export const trailsRelations = relations(trails, ({ many }) => ({
  students: many(studentHasTrail),
  projects: many(projectTrails),
}))

export const studentHasTrailRelations = relations(
  studentHasTrail,
  ({ one }) => ({
    user: one(users, {
      fields: [studentHasTrail.studentId],
      references: [users.id],
    }),
    trail: one(trails, {
      fields: [studentHasTrail.trailId],
      references: [trails.id],
    }),
  }),
)

export const subjectsRelations = relations(subjects, ({ many }) => ({
  projects: many(projects),
}))

export const professorsRelations = relations(professors, ({ many }) => ({
  projects: many(projectProfessors),
}))

export const projectsRelations = relations(projects, ({ one, many }) => ({
  author: one(users, {
    fields: [projects.authorId],
    references: [users.id],
  }),
  subject: one(subjects, {
    fields: [projects.subjectId],
    references: [subjects.id],
  }),
  professors: many(projectProfessors),
  trails: many(projectTrails),
  comments: many(comments),
}))

export const projectProfessorsRelations = relations(
  projectProfessors,
  ({ one }) => ({
    project: one(projects, {
      fields: [projectProfessors.projectId],
      references: [projects.id],
    }),
    professor: one(professors, {
      fields: [projectProfessors.professorId],
      references: [professors.id],
    }),
  }),
)

export const projectTrailsRelations = relations(projectTrails, ({ one }) => ({
  project: one(projects, {
    fields: [projectTrails.projectId],
    references: [projects.id],
  }),
  trail: one(trails, {
    fields: [projectTrails.trailId],
    references: [trails.id],
  }),
}))

export const commentsRelations = relations(comments, ({ one, many }) => ({
  author: one(users, {
    fields: [comments.authorId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [comments.projectId],
    references: [projects.id],
  }),
  reports: many(reports),
}))

export const reportsRelations = relations(reports, ({ one }) => ({
  author: one(users, {
    fields: [reports.authorId],
    references: [users.id],
    relationName: 'ReportAuthor',
  }),
  comment: one(comments, {
    fields: [reports.commentId],
    references: [comments.id],
  }),
  resolver: one(users, {
    fields: [reports.resolvedBy],
    references: [users.id],
    relationName: 'ReportResolver',
  }),
}))
