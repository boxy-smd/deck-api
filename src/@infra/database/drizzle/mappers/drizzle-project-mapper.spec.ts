import { describe, expect, it } from 'vitest'
import { ProjectStatus } from '@/@core/domain/projects/value-objects/project-status'
import type { DrizzleProjectWithDetails } from './drizzle-project-mapper'
import { DrizzleProjectMapper } from './drizzle-project-mapper'

describe('DrizzleProjectMapper', () => {
  describe('toEntity()', () => {
    it('should map project without relationships to entity', () => {
      const raw: DrizzleProjectWithDetails = {
        id: 'project-1',
        title: 'Meu Projeto',
        description: 'Descrição do projeto',
        content: 'Conteúdo detalhado',
        semester: 5,
        publishedYear: 2024,
        status: 'PUBLISHED',
        allowComments: true,
        bannerUrl: 'https://example.com/banner.jpg',
        authorId: 'user-1',
        subjectId: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        author: {
          id: 'user-1',
          name: 'João Silva',
          username: 'joaosilva',
          email: 'joao@alu.ufc.br',
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
        subject: null,
        trails: [],
        professors: [],
      }

      const project = DrizzleProjectMapper.toEntity(raw)

      expect(project.id.toString()).toBe('project-1')
      expect(project.title).toBe('Meu Projeto')
      expect(project.description).toBe('Descrição do projeto')
      expect(project.content).toBe('Conteúdo detalhado')
      expect(project.semester).toBe(5)
      expect(project.publishedYear).toBe(2024)
      expect(project.status).toBe(ProjectStatus.PUBLISHED)
      expect(project.allowComments).toBe(true)
      expect(project.bannerUrl).toBe('https://example.com/banner.jpg')
      expect(project.authorId.toString()).toBe('user-1')
      expect(project.subjectId).toBeUndefined()
      expect(Array.from(project.trails).length).toBe(0)
      expect(Array.from(project.professors).length).toBe(0)
    })

    it('should map project with all relationships to entity', () => {
      const raw: DrizzleProjectWithDetails = {
        id: 'project-2',
        title: 'Projeto Completo',
        description: 'Projeto com todas as relações',
        content: null,
        semester: 7,
        publishedYear: 2024,
        status: 'PUBLISHED',
        allowComments: false,
        bannerUrl: null,
        authorId: 'user-2',
        subjectId: 'subject-1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
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
        subject: {
          id: 'subject-1',
          code: 'SMD001',
          name: 'Programação Web',
          workload: 64,
          semester: 1,
          type: 'OBLIGATORY',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
        trails: [
          {
            trail: {
              id: 'trail-1',
              name: 'Desenvolvimento de Sistemas',
              createdAt: new Date('2024-01-01'),
              updatedAt: new Date('2024-01-01'),
            },
          },
          {
            trail: {
              id: 'trail-2',
              name: 'Design Digital',
              createdAt: new Date('2024-01-01'),
              updatedAt: new Date('2024-01-01'),
            },
          },
        ],
        professors: [
          {
            professor: {
              id: 'prof-1',
              name: 'Prof. Carlos',
              createdAt: new Date('2024-01-01'),
              updatedAt: new Date('2024-01-01'),
            },
          },
          {
            professor: {
              id: 'prof-2',
              name: 'Prof. Ana',
              createdAt: new Date('2024-01-01'),
              updatedAt: new Date('2024-01-01'),
            },
          },
        ],
      }

      const project = DrizzleProjectMapper.toEntity(raw)

      expect(project.id.toString()).toBe('project-2')
      expect(project.subjectId?.toString()).toBe('subject-1')
      expect(Array.from(project.trails).length).toBe(2)
      expect(Array.from(project.professors).length).toBe(2)
      const trailIds = Array.from(project.trails).map(id => id.toString())
      const professorIds = Array.from(project.professors).map(id =>
        id.toString(),
      )
      expect(trailIds).toContain('trail-1')
      expect(trailIds).toContain('trail-2')
      expect(professorIds).toContain('prof-1')
      expect(professorIds).toContain('prof-2')
    })

    it('should map project with DRAFT status', () => {
      const raw: DrizzleProjectWithDetails = {
        id: 'project-3',
        title: 'Rascunho',
        description: 'Projeto em rascunho',
        content: null,
        semester: null,
        publishedYear: null,
        status: 'DRAFT',
        allowComments: true,
        bannerUrl: null,
        authorId: 'user-1',
        subjectId: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        author: {
          id: 'user-1',
          name: 'João Silva',
          username: 'joaosilva',
          email: 'joao@alu.ufc.br',
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
        subject: null,
        trails: [],
        professors: [],
      }

      const project = DrizzleProjectMapper.toEntity(raw)

      expect(project.status).toBe(ProjectStatus.DRAFT)
      expect(project.semester).toBe(0)
      expect(project.publishedYear).toBe(0)
    })

    it('should map project with ARCHIVED status', () => {
      const raw: DrizzleProjectWithDetails = {
        id: 'project-4',
        title: 'Projeto Arquivado',
        description: 'Projeto arquivado',
        content: 'Conteúdo',
        semester: 8,
        publishedYear: 2023,
        status: 'ARCHIVED',
        allowComments: false,
        bannerUrl: null,
        authorId: 'user-1',
        subjectId: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        author: {
          id: 'user-1',
          name: 'João Silva',
          username: 'joaosilva',
          email: 'joao@alu.ufc.br',
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
        subject: null,
        trails: [],
        professors: [],
      }

      const project = DrizzleProjectMapper.toEntity(raw)

      expect(project.status).toBe(ProjectStatus.ARCHIVED)
    })

    it('should handle null description and content', () => {
      const raw: DrizzleProjectWithDetails = {
        id: 'project-5',
        title: 'Projeto Mínimo',
        description: null,
        content: null,
        semester: 1,
        publishedYear: 2024,
        status: 'PUBLISHED',
        allowComments: true,
        bannerUrl: null,
        authorId: 'user-1',
        subjectId: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        author: {
          id: 'user-1',
          name: 'João Silva',
          username: 'joaosilva',
          email: 'joao@alu.ufc.br',
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
        subject: null,
        trails: [],
        professors: [],
      }

      const project = DrizzleProjectMapper.toEntity(raw)

      expect(project.description).toBe('')
      expect(project.content).toBe('')
    })
  })

  describe('toDTO()', () => {
    it('should map project to DTO', () => {
      const raw: DrizzleProjectWithDetails = {
        id: 'project-1',
        title: 'Meu Projeto',
        description: 'Descrição do projeto',
        content: 'Conteúdo detalhado',
        semester: 5,
        publishedYear: 2024,
        status: 'PUBLISHED',
        allowComments: true,
        bannerUrl: 'https://example.com/banner.jpg',
        authorId: 'user-1',
        subjectId: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        author: {
          id: 'user-1',
          name: 'João Silva',
          username: 'joaosilva',
          email: 'joao@alu.ufc.br',
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
        subject: null,
        trails: [],
        professors: [],
      }

      const dto = DrizzleProjectMapper.toDTO(raw)

      expect(dto.id).toBe('project-1')
      expect(dto.title).toBe('Meu Projeto')
      expect(dto.description).toBe('Descrição do projeto')
      expect(dto.semester).toBe(5)
      expect(dto.publishedYear).toBe(2024)
      expect(dto.status).toBe(ProjectStatus.PUBLISHED)
    })
  })
})
