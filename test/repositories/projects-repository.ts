import type {
  ProjectQuery,
  ProjectsRepository,
} from '@/domain/deck/application/repositories/projects-repository.ts'
import type { Project } from '@/domain/deck/enterprise/entities/project.ts'
import type { Subject } from '@/domain/deck/enterprise/entities/subject.ts'
import { ProjectDetails } from '@/domain/deck/enterprise/entities/value-objects/project-details.ts'
import type { InMemoryStudentsRepository } from './students-repository.ts'
import type { InMemorySubjectsRepository } from './subjects-repository.ts'

export class InMemoryProjectsRepository implements ProjectsRepository {
  public items: Project[] = []

  constructor(
    private studentsRepository: InMemoryStudentsRepository,
    private subjectsRepository: InMemorySubjectsRepository,
  ) {}

  async findById(id: string): Promise<Project | null> {
    return Promise.resolve(
      this.items.find(item => item.id.toString() === id) || null,
    )
  }

  async findDetailsById(id: string): Promise<ProjectDetails | null> {
    const project = await this.findById(id)

    if (!project) {
      return null
    }

    const author = await this.studentsRepository.findById(
      project.authorId.toString(),
    )

    if (!author) {
      throw new Error('Author not found.')
    }

    let subject: Subject | null = null

    if (project.subjectId) {
      subject = await this.subjectsRepository.findById(
        project.subjectId?.toString(),
      )

      if (!subject) {
        throw new Error('Subject not found.')
      }
    }

    return ProjectDetails.create({
      title: project.title,
      description: project.description,
      bannerUrl: project.bannerUrl,
      content: project.content,
      publishedYear: project.publishedYear,
      status: project.status,
      semester: project.semester,
      allowComments: project.allowComments,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      author: {
        name: author.name,
        username: author.username,
      },
      authorId: project.authorId,
      subject: subject?.name,
      subjectId: project.subjectId,
      trails: project.trails.map(trail => trail.name),
      professors: project.professors?.map(professor => professor.name),
    })
  }

  async findAll(): Promise<Project[]> {
    return await Promise.resolve(this.items)
  }

  async findAllDetails(): Promise<ProjectDetails[]> {
    const projectsDetails = this.items.map(async project => {
      const author = await this.studentsRepository.findById(
        project.authorId.toString(),
      )

      if (!author) {
        throw new Error('Author not found.')
      }

      const subject = project.subjectId
        ? await this.subjectsRepository.findById(project.subjectId.toString())
        : null

      return ProjectDetails.create({
        title: project.title,
        description: project.description,
        bannerUrl: project.bannerUrl,
        content: project.content,
        publishedYear: project.publishedYear,
        status: project.status,
        semester: project.semester,
        allowComments: project.allowComments,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        author: {
          name: author.name,
          username: author.username,
        },
        authorId: project.authorId,
        subject: subject?.name,
        subjectId: project.subjectId,
        trails: project.trails.map(trail => trail.name),
        professors: project.professors?.map(professor => professor.name),
      })
    })

    return await Promise.all(projectsDetails)
  }

  async findManyDetailsByQuery({
    title,
    publishedYear,
    semester,
    authorId,
    professorsIds,
    subjectId,
  }: ProjectQuery): Promise<ProjectDetails[]> {
    const projects = this.items.filter(
      item =>
        (!authorId || item.authorId.toString() === authorId) &&
        (!professorsIds ||
          item.professors?.some(professor =>
            professorsIds.includes(professor.id.toString()),
          )) &&
        (!publishedYear || item.publishedYear === publishedYear) &&
        (!subjectId || item.subjectId?.toString() === subjectId) &&
        (!title || item.title.includes(title)) &&
        (!semester || item.semester === semester),
    )

    const projectsDetails = projects.map(async project => {
      const author = await this.studentsRepository.findById(
        project.authorId.toString(),
      )

      if (!author) {
        throw new Error('Author not found.')
      }

      const subject = project.subjectId
        ? await this.subjectsRepository.findById(project.subjectId.toString())
        : null

      return ProjectDetails.create({
        title: project.title,
        description: project.description,
        bannerUrl: project.bannerUrl,
        content: project.content,
        publishedYear: project.publishedYear,
        status: project.status,
        semester: project.semester,
        allowComments: project.allowComments,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        author: {
          name: author.name,
          username: author.username,
        },
        authorId: project.authorId,
        subject: subject?.name,
        subjectId: project.subjectId,
        trails: project.trails.map(trail => trail.name),
        professors: project.professors?.map(professor => professor.name),
      })
    })

    return await Promise.all(projectsDetails)
  }

  async create(project: Project): Promise<void> {
    await Promise.resolve(this.items.push(project))
  }

  async save(project: Project): Promise<void> {
    await Promise.resolve(this.items.push(project))
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex(item => item.id.toString() === id)

    if (index === -1) {
      throw new Error('Project not found.')
    }

    this.items.splice(index, 1)
  }
}
