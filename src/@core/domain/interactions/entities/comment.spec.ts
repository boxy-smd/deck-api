import { describe, expect, it } from 'vitest'
import { UniqueEntityID } from '@/@shared/kernel/kernel/unique-entity-id'
import { Comment } from './comment'

describe('Comment Entity', () => {
  const makeValidComment = () => {
    return Comment.create({
      content: 'Great project!',
      authorId: new UniqueEntityID(),
      projectId: new UniqueEntityID(),
    })
  }

  describe('create', () => {
    it('should create a comment with valid props', () => {
      const authorId = new UniqueEntityID()
      const projectId = new UniqueEntityID()

      const comment = Comment.create({
        content: 'Nice work!',
        authorId,
        projectId,
      })

      expect(comment).toBeInstanceOf(Comment)
      expect(comment.content).toBe('Nice work!')
      expect(comment.authorId).toBe(authorId)
      expect(comment.projectId).toBe(projectId)
    })

    it('should initialize reports as empty array', () => {
      const comment = makeValidComment()

      expect(comment.reports).toBeInstanceOf(Array)
      expect(comment.reports.length).toBe(0)
    })

    it('should generate an ID if not provided', () => {
      const comment = makeValidComment()

      expect(comment.id).toBeDefined()
      expect(comment.id.toString()).toBeTruthy()
    })

    it('should use provided ID when specified', () => {
      const customId = new UniqueEntityID()

      const comment = Comment.create(
        {
          content: 'Test comment',
          authorId: new UniqueEntityID(),
          projectId: new UniqueEntityID(),
        },
        customId,
      )

      expect(comment.id).toBe(customId)
    })
  })

  describe('reconstitute', () => {
    it('should reconstitute a comment with timestamps', () => {
      const id = new UniqueEntityID()
      const authorId = new UniqueEntityID()
      const projectId = new UniqueEntityID()
      const createdAt = new Date('2024-01-01')
      const updatedAt = new Date('2024-01-02')

      const comment = Comment.reconstitute(
        {
          content: 'Reconstituted comment',
          authorId,
          projectId,
          reports: new Set(),
        },
        id,
        createdAt,
        updatedAt,
      )

      expect(comment.id).toBe(id)
      expect(comment.createdAt).toBe(createdAt)
      expect(comment.updatedAt).toBe(updatedAt)
      expect(comment.content).toBe('Reconstituted comment')
    })
  })

  describe('updateContent', () => {
    it('should update comment content', () => {
      const comment = makeValidComment()

      comment.updateContent('Updated content here')

      expect(comment.content).toBe('Updated content here')
    })

    it('should allow updating to empty string', () => {
      const comment = makeValidComment()

      comment.updateContent('')

      expect(comment.content).toBe('')
    })
  })

  describe('report', () => {
    it('should add a report to comment', () => {
      const comment = makeValidComment()
      const reportAuthorId = new UniqueEntityID()

      comment.report('This comment is inappropriate', reportAuthorId)

      expect(comment.reports.length).toBe(1)
      expect(comment.reports[0].content).toBe('This comment is inappropriate')
      expect(comment.reports[0].authorId).toBe(reportAuthorId)
      expect(comment.reports[0].commentId).toBe(comment.id)
    })

    it('should allow multiple reports on same comment', () => {
      const comment = makeValidComment()
      const reporter1 = new UniqueEntityID()
      const reporter2 = new UniqueEntityID()

      comment.report('Inappropriate', reporter1)
      comment.report('Spam', reporter2)

      expect(comment.reports.length).toBe(2)
    })

    it('should update timestamp when reporting', () => {
      const comment = makeValidComment()
      const beforeReport = comment.updatedAt
      const reportAuthorId = new UniqueEntityID()

      comment.report('Report reason', reportAuthorId)

      expect(comment.updatedAt).not.toBe(beforeReport)
    })
  })

  describe('getters', () => {
    it('should access all comment properties via getters', () => {
      const authorId = new UniqueEntityID()
      const projectId = new UniqueEntityID()

      const comment = Comment.create({
        content: 'Test content',
        authorId,
        projectId,
      })

      expect(comment.content).toBe('Test content')
      expect(comment.authorId).toBe(authorId)
      expect(comment.projectId).toBe(projectId)
      expect(comment.reports).toBeInstanceOf(Array)
    })

    it('should return a copy of reports (immutable)', () => {
      const comment = makeValidComment()
      const reportAuthorId = new UniqueEntityID()
      comment.report('Report', reportAuthorId)

      const reports1 = comment.reports
      const reports2 = comment.reports

      expect(reports1).not.toBe(reports2) // Different array instances
      expect(reports1.length).toBe(reports2.length) // But same content
    })
  })
})
