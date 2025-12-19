import { UniqueEntityID } from '@/@shared/kernel/kernel/unique-entity-id'
import { describe, expect, it } from 'vitest'
import { ProjectStatus } from '../value-objects/project-status'
import { Project } from './project'

describe('Project Entity', () => {
  const makeValidProject = () => {
    return Project.create({
      title: 'My Amazing Project',
      description: 'A great project description',
      status: ProjectStatus.DRAFT,
      allowComments: true,
      authorId: new UniqueEntityID(),
    })
  }

  describe('create', () => {
    it('should create a project with required props', () => {
      const authorId = new UniqueEntityID()
      const project = Project.create({
        title: 'Test Project',
        status: ProjectStatus.DRAFT,
        allowComments: true,
        authorId,
      })

      expect(project).toBeInstanceOf(Project)
      expect(project.title).toBe('Test Project')
      expect(project.status).toBe(ProjectStatus.DRAFT)
      expect(project.allowComments).toBe(true)
      expect(project.authorId).toBe(authorId)
    })

    it('should create a project with optional props', () => {
      const authorId = new UniqueEntityID()
      const subjectId = new UniqueEntityID()
      const project = Project.create({
        title: 'Complete Project',
        description: 'Full description',
        bannerUrl: 'https://example.com/banner.jpg',
        content: 'Detailed content',
        publishedYear: 2024,
        semester: 5,
        status: ProjectStatus.PUBLISHED,
        allowComments: false,
        authorId,
        subjectId,
      })

      expect(project.description).toBe('Full description')
      expect(project.bannerUrl).toBe('https://example.com/banner.jpg')
      expect(project.content).toBe('Detailed content')
      expect(project.publishedYear).toBe(2024)
      expect(project.semester).toBe(5)
      expect(project.subjectId).toBe(subjectId)
    })

    it('should initialize trails, professors and comments as empty sets', () => {
      const project = makeValidProject()

      expect(project.trails).toBeInstanceOf(Set)
      expect(project.trails.size).toBe(0)
      expect(project.professors).toBeInstanceOf(Set)
      expect(project.professors.size).toBe(0)
      expect(project.comments).toBeInstanceOf(Set)
      expect(project.comments.size).toBe(0)
    })
  })

  describe('reconstitute', () => {
    it('should reconstitute a project with timestamps', () => {
      const id = new UniqueEntityID()
      const authorId = new UniqueEntityID()
      const createdAt = new Date('2024-01-01')
      const updatedAt = new Date('2024-01-02')

      const project = Project.reconstitute(
        {
          title: 'Reconstituted Project',
          status: ProjectStatus.PUBLISHED,
          allowComments: true,
          authorId,
          trails: new Set(),
          professors: new Set(),
          comments: new Set(),
        },
        id,
        createdAt,
        updatedAt,
      )

      expect(project.id).toBe(id)
      expect(project.createdAt).toBe(createdAt)
      expect(project.updatedAt).toBe(updatedAt)
    })
  })

  describe('status management', () => {
    it('should move project to drafts', () => {
      const project = makeValidProject()
      project.post()

      project.addToDrafts()

      expect(project.status).toBe(ProjectStatus.DRAFT)
    })

    it('should publish a draft project', () => {
      const project = makeValidProject()

      project.post()

      expect(project.status).toBe(ProjectStatus.PUBLISHED)
    })

    it('should archive a project', () => {
      const project = makeValidProject()
      project.post()

      project.archive()

      expect(project.status).toBe(ProjectStatus.ARCHIVED)
    })

    it('should unarchive a project (sets to PUBLISHED)', () => {
      const project = makeValidProject()
      project.archive()

      project.unarchive()

      expect(project.status).toBe(ProjectStatus.PUBLISHED)
    })
  })

  describe('editInfo', () => {
    it('should edit project title', () => {
      const project = makeValidProject()

      project.editInfo({ title: 'Updated Title' })

      expect(project.title).toBe('Updated Title')
    })

    it('should edit project description', () => {
      const project = makeValidProject()

      project.editInfo({ description: 'New description' })

      expect(project.description).toBe('New description')
    })

    it('should edit project banner URL', () => {
      const project = makeValidProject()

      project.editInfo({ bannerUrl: 'https://new-banner.com/image.jpg' })

      expect(project.bannerUrl).toBe('https://new-banner.com/image.jpg')
    })

    it('should edit project content', () => {
      const project = makeValidProject()

      project.editInfo({ content: 'Updated detailed content' })

      expect(project.content).toBe('Updated detailed content')
    })

    it('should edit published year and semester', () => {
      const project = makeValidProject()

      project.editInfo({ publishedYear: 2025, semester: 8 })

      expect(project.publishedYear).toBe(2025)
      expect(project.semester).toBe(8)
    })

    it('should toggle allow comments', () => {
      const project = makeValidProject()

      project.editInfo({ allowComments: false })

      expect(project.allowComments).toBe(false)
    })

    it('should edit subject', () => {
      const project = makeValidProject()
      const newSubjectId = new UniqueEntityID()

      project.editInfo({ subjectId: newSubjectId })

      expect(project.subjectId).toBe(newSubjectId)
    })

    it('should edit multiple fields at once', () => {
      const project = makeValidProject()

      project.editInfo({
        title: 'Multi Edit',
        description: 'Multi Description',
        publishedYear: 2024,
      })

      expect(project.title).toBe('Multi Edit')
      expect(project.description).toBe('Multi Description')
      expect(project.publishedYear).toBe(2024)
    })

    it('should update timestamp when editing', () => {
      const project = makeValidProject()
      const beforeUpdate = project.updatedAt

      project.editInfo({ title: 'New Title' })

      expect(project.updatedAt).not.toBe(beforeUpdate)
    })
  })

  describe('trails management', () => {
    it('should define trails for project', () => {
      const project = makeValidProject()
      const trail1 = new UniqueEntityID()
      const trail2 = new UniqueEntityID()

      project.defineTrails([trail1, trail2])

      expect(project.trails.size).toBe(2)
      expect(project.trails.has(trail1)).toBe(true)
      expect(project.trails.has(trail2)).toBe(true)
    })

    it('should replace existing trails when defining new ones', () => {
      const project = makeValidProject()
      const trail1 = new UniqueEntityID()
      const trail2 = new UniqueEntityID()
      const trail3 = new UniqueEntityID()

      project.defineTrails([trail1, trail2])
      project.defineTrails([trail3])

      expect(project.trails.size).toBe(1)
      expect(project.trails.has(trail1)).toBe(false)
      expect(project.trails.has(trail3)).toBe(true)
    })
  })

  describe('professors management', () => {
    it('should define professors for project', () => {
      const project = makeValidProject()
      const prof1 = new UniqueEntityID()
      const prof2 = new UniqueEntityID()

      project.defineProfessors([prof1, prof2])

      expect(project.professors.size).toBe(2)
      expect(project.professors.has(prof1)).toBe(true)
      expect(project.professors.has(prof2)).toBe(true)
    })

    it('should replace existing professors when defining new ones', () => {
      const project = makeValidProject()
      const prof1 = new UniqueEntityID()
      const prof2 = new UniqueEntityID()

      project.defineProfessors([prof1])
      project.defineProfessors([prof2])

      expect(project.professors.size).toBe(1)
      expect(project.professors.has(prof1)).toBe(false)
      expect(project.professors.has(prof2)).toBe(true)
    })
  })

  describe('comments management', () => {
    it('should add a comment to project', () => {
      const project = makeValidProject()
      const authorId = new UniqueEntityID()

      const comment = project.comment('Great project!', authorId)

      expect(comment).toBeDefined()
      expect(comment.content).toBe('Great project!')
      expect(comment.authorId).toBe(authorId)
      expect(project.comments.size).toBe(1)
      expect(project.comments.has(comment)).toBe(true)
    })

    it('should add multiple comments', () => {
      const project = makeValidProject()
      const author1 = new UniqueEntityID()
      const author2 = new UniqueEntityID()

      project.comment('First comment', author1)
      project.comment('Second comment', author2)

      expect(project.comments.size).toBe(2)
    })

    it('should remove a comment from project', () => {
      const project = makeValidProject()
      const authorId = new UniqueEntityID()
      const comment = project.comment('To be deleted', authorId)

      project.removeComment(comment)

      expect(project.comments.size).toBe(0)
      expect(project.comments.has(comment)).toBe(false)
    })
  })

  describe('getters', () => {
    it('should access all project properties via getters', () => {
      const authorId = new UniqueEntityID()
      const subjectId = new UniqueEntityID()
      const project = Project.create({
        title: 'Test Project',
        description: 'Description',
        bannerUrl: 'https://banner.com/img.jpg',
        content: 'Content',
        publishedYear: 2024,
        semester: 5,
        status: ProjectStatus.PUBLISHED,
        allowComments: true,
        authorId,
        subjectId,
      })

      expect(project.title).toBe('Test Project')
      expect(project.description).toBe('Description')
      expect(project.bannerUrl).toBe('https://banner.com/img.jpg')
      expect(project.content).toBe('Content')
      expect(project.publishedYear).toBe(2024)
      expect(project.semester).toBe(5)
      expect(project.status).toBe(ProjectStatus.PUBLISHED)
      expect(project.allowComments).toBe(true)
      expect(project.authorId).toBe(authorId)
      expect(project.subjectId).toBe(subjectId)
      expect(project.trails).toBeInstanceOf(Set)
      expect(project.professors).toBeInstanceOf(Set)
      expect(project.comments).toBeInstanceOf(Set)
    })

    it('should return empty string for undefined content', () => {
      const project = Project.create({
        title: 'No Content Project',
        status: ProjectStatus.DRAFT,
        allowComments: true,
        authorId: new UniqueEntityID(),
      })

      expect(project.content).toBe('')
    })
  })
})
