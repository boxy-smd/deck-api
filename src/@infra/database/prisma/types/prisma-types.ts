import type { Prisma } from '@prisma/client'
import type { PrismaQueryBuilder } from '../query-builder'

// Project types using Prisma's generated types
export type PrismaProjectForDTO = Prisma.ProjectGetPayload<{
  include: ReturnType<typeof PrismaQueryBuilder.getProjectDTOIncludes>
}>

export type PrismaProjectForFull = Prisma.ProjectGetPayload<{
  include: ReturnType<typeof PrismaQueryBuilder.getProjectFullIncludes>
}>

export type PrismaProjectWithTrailsAndProfessors = Prisma.ProjectGetPayload<{
  include: {
    trails: true
    professors: true
  }
}>

// Comment types
export type PrismaCommentWithAuthor = Prisma.CommentGetPayload<{
  include: {
    author: {
      select: {
        name: true
        username: true
        profileUrl: true
      }
    }
  }
}>

// User types
export type PrismaUserWithProfile = Prisma.UserGetPayload<{
  include: {
    trail: {
      include: {
        trail: true
      }
    }
    studentProfile: true
  }
}>
