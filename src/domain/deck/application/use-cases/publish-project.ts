import { type Either, left, right } from '@/core/either.ts'
import { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.ts'
import { ProjectProfessorList } from '../../enterprise/entities/project-professor-list.ts'
import { ProjectProfessor } from '../../enterprise/entities/project-professor.ts'
import { ProjectTrailList } from '../../enterprise/entities/project-trail-list.ts'
import { ProjectTrail } from '../../enterprise/entities/project-trail.ts'
import {
  Project,
  type ProjectStatusEnum,
} from '../../enterprise/entities/project.ts'
import type { Subject } from '../../enterprise/entities/subject.ts'
import type { ProjectsRepository } from '../repositories/projects-repository.ts'
import type { StudentsRepository } from '../repositories/students-repository.ts'
import type { SubjectsRepository } from '../repositories/subjects-repository.ts'

interface PublishProjectUseCaseRequest {
  title: string
  description: string
  bannerUrl: string
  content?: string
  publishedYear: number
  status: ProjectStatusEnum
  semester: number
  allowComments: boolean
  authorId: string
  subjectId?: string
  trailsIds?: string[]
  professorsIds?: string[]
}

type PublishProjectUseCaseResponse = Either<ResourceNotFoundError, Project>

export class PublishProjectUseCase {
  constructor(
    private readonly projectsRepository: ProjectsRepository,
    private readonly studentsRepository: StudentsRepository,
    private readonly subjectsRepository: SubjectsRepository,
  ) {}

  async execute({
    title,
    description,
    bannerUrl,
    content,
    publishedYear,
    status,
    semester,
    allowComments,
    authorId,
    subjectId,
    trailsIds,
    professorsIds,
  }: PublishProjectUseCaseRequest): Promise<PublishProjectUseCaseResponse> {
    const student = await this.studentsRepository.findById(authorId)

    if (!student) {
      return left(new ResourceNotFoundError('Student not found.'))
    }

    let subject: Subject | null = null

    if (subjectId) {
      subject = await this.subjectsRepository.findById(subjectId)

      if (!subject) {
        return left(new ResourceNotFoundError('Subject not found.'))
      }
    }

    const project = Project.create({
      title,
      description,
      bannerUrl,
      content,
      publishedYear,
      status,
      semester,
      allowComments,
      authorId: student.id,
      subjectId: subject?.id,
    })

    const trails = trailsIds?.map(trailId => {
      return ProjectTrail.create({
        projectId: project.id,
        trailId: new UniqueEntityID(trailId),
      })
    })

    project.trails = new ProjectTrailList(trails)

    const professors = professorsIds?.map(professorId => {
      return ProjectProfessor.create({
        projectId: project.id,
        professorId: new UniqueEntityID(professorId),
      })
    })

    project.professors = new ProjectProfessorList(professors)

    await this.projectsRepository.create(project)

    return right(project)
  }
}
