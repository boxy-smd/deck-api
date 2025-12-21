import { describe, expect, it } from 'vitest'
import type { DrizzleCommentWithAuthor } from './drizzle-comment-mapper'
import { DrizzleCommentMapper } from './drizzle-comment-mapper'

describe('DrizzleCommentMapper', () => {
  describe('toEntity()', () => {
    it('should map comment to entity', () => {
      const raw = {
        id: 'comment-1',
        content: 'Ótimo projeto!',
        authorId: 'user-1',
        projectId: 'project-1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      }

      const comment = DrizzleCommentMapper.toEntity(raw)

      expect(comment.id.toString()).toBe('comment-1')
      expect(comment.content).toBe('Ótimo projeto!')
      expect(comment.authorId.toString()).toBe('user-1')
      expect(comment.projectId.toString()).toBe('project-1')
    })

    it('should handle multiline content', () => {
      const raw = {
        id: 'comment-2',
        content: 'Comentário\ncom\nmúltiplas\nlinhas',
        authorId: 'user-2',
        projectId: 'project-2',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      }

      const comment = DrizzleCommentMapper.toEntity(raw)

      expect(comment.content).toBe('Comentário\ncom\nmúltiplas\nlinhas')
    })
  })

  describe('toEntityWithAuthor()', () => {
    it('should map comment with author to value object', () => {
      const raw: DrizzleCommentWithAuthor = {
        id: 'comment-1',
        content: 'Excelente trabalho!',
        authorId: 'user-1',
        projectId: 'project-1',
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
        author: {
          id: 'user-1',
          name: 'João Silva',
          username: 'joaosilva',
          email: 'joao@alu.ufc.br',
          passwordHash: 'hash',
          about: 'Desenvolvedor',
          profileUrl: 'https://example.com/profile.jpg',
          role: 'STUDENT',
          status: 'ACTIVE',
          passwordResetToken: null,
          passwordResetExpires: null,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
      }

      const commentWithAuthor = DrizzleCommentMapper.toEntityWithAuthor(raw)

      expect(commentWithAuthor.commentId.toString()).toBe('comment-1')
      expect(commentWithAuthor.content).toBe('Excelente trabalho!')
      expect(commentWithAuthor.authorId.toString()).toBe('user-1')
      expect(commentWithAuthor.authorName).toBe('João Silva')
      expect(commentWithAuthor.authorUsername).toBe('joaosilva')
      expect(commentWithAuthor.authorProfileUrl).toBe(
        'https://example.com/profile.jpg',
      )
      expect(commentWithAuthor.projectId.toString()).toBe('project-1')
      expect(commentWithAuthor.createdAt).toEqual(
        new Date('2024-01-01T10:00:00Z'),
      )
      expect(commentWithAuthor.updatedAt).toEqual(
        new Date('2024-01-01T10:00:00Z'),
      )
    })

    it('should handle author without profile picture', () => {
      const raw: DrizzleCommentWithAuthor = {
        id: 'comment-2',
        content: 'Bom projeto',
        authorId: 'user-2',
        projectId: 'project-2',
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
        author: {
          id: 'user-2',
          name: 'Maria Santos',
          username: 'mariasantos',
          email: 'maria@alu.ufc.br',
          passwordHash: 'hash',
          about: null,
          profileUrl: null,
          role: 'STUDENT',
          status: 'ACTIVE',
          passwordResetToken: null,
          passwordResetExpires: null,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
      }

      const commentWithAuthor = DrizzleCommentMapper.toEntityWithAuthor(raw)

      expect(commentWithAuthor.authorProfileUrl).toBeNull()
    })

    it('should preserve all comment metadata', () => {
      const createdDate = new Date('2024-01-15T08:30:00Z')
      const updatedDate = new Date('2024-01-15T09:45:00Z')

      const raw: DrizzleCommentWithAuthor = {
        id: 'comment-3',
        content: 'Comentário editado',
        authorId: 'user-3',
        projectId: 'project-3',
        createdAt: createdDate,
        updatedAt: updatedDate,
        author: {
          id: 'user-3',
          name: 'Pedro Costa',
          username: 'pedrocosta',
          email: 'pedro@alu.ufc.br',
          passwordHash: 'hash',
          about: null,
          profileUrl: null,
          role: 'STUDENT',
          status: 'ACTIVE',
          passwordResetToken: null,
          passwordResetExpires: null,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
      }

      const commentWithAuthor = DrizzleCommentMapper.toEntityWithAuthor(raw)

      expect(commentWithAuthor.createdAt).toEqual(createdDate)
      expect(commentWithAuthor.updatedAt).toEqual(updatedDate)
      expect(commentWithAuthor.updatedAt).not.toEqual(
        commentWithAuthor.createdAt,
      )
    })
  })
})
