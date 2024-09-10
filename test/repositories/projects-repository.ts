import type {
  ProjectQuery,
  ProjectsRepository,
} from '@/domain/deck/application/repositories/projects-repository.ts'
import type { Project } from '@/domain/deck/enterprise/entities/project.ts'
import type { Subject } from '@/domain/deck/enterprise/entities/subject.ts'
import { Post } from '@/domain/deck/enterprise/entities/value-objects/post.ts'
import { ProjectDetails } from '@/domain/deck/enterprise/entities/value-objects/project-details.ts'
import type { InMemoryCommentsRepository } from './comments-repository.ts'
import type { InMemoryStudentsRepository } from './students-repository.ts'
import type { InMemorySubjectsRepository } from './subjects-repository.ts'

export class InMemoryProjectsRepository implements ProjectsRepository {
  public items: Project[] = []

  constructor(
    private studentsRepository: InMemoryStudentsRepository,
    private subjectsRepository: InMemorySubjectsRepository,
    private commentsRepository: InMemoryCommentsRepository,
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

    const comments =
      await this.commentsRepository.findManyByProjectIdWithAuthors(id)

    return ProjectDetails.create({
      id: project.id,
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
        profileUrl: author.profileUrl,
      },
      authorId: project.authorId,
      subject: subject?.name,
      subjectId: project.subjectId,
      trails: project.trails.map(trail => trail.name),
      professors: project.professors?.map(professor => professor.name),
      comments,
    })
  }

  async findManyPostsByQuery({
    title,
    semester,
    publishedYear,
    authorId,
    subjectId,
    trailsIds,
  }: ProjectQuery): Promise<Post[]> {
    const projects = this.items.filter(
      item =>
        (!title || item.title.includes(title)) &&
        (!semester || item.semester === semester) &&
        (!publishedYear || item.publishedYear === publishedYear) &&
        (!authorId || item.authorId.toString() === authorId) &&
        (!subjectId || item.subjectId?.toString() === subjectId) &&
        (!trailsIds ||
          item.trails.some(trail => trailsIds.includes(trail.id.toString()))),
    )

    const posts = projects.map(async post => {
      const author = await this.studentsRepository.findById(
        post.authorId.toString(),
      )

      if (!author) {
        throw new Error('Author not found.')
      }

      const subject = post.subjectId
        ? await this.subjectsRepository.findById(post.subjectId.toString())
        : null

      return Post.create({
        id: post.id,
        title: post.title,
        description: post.description,
        bannerUrl: post.bannerUrl,
        content: post.content,
        publishedYear: post.publishedYear,
        status: post.status,
        semester: post.semester,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        author: {
          name: author.name,
          username: author.username,
          profileUrl: author.profileUrl,
        },
        authorId: post.authorId,
        subject: subject?.name,
        subjectId: post.subjectId,
        trails: post.trails.map(trail => trail.name),
        professors: post.professors?.map(professor => professor.name),
      })
    })

    return await Promise.all(posts)
  }

  async findAll(): Promise<Project[]> {
    return await Promise.resolve(this.items)
  }

  async findAllPosts(): Promise<Post[]> {
    const posts = this.items.map(async post => {
      const author = await this.studentsRepository.findById(
        post.authorId.toString(),
      )

      if (!author) {
        throw new Error('Author not found.')
      }

      const subject = post.subjectId
        ? await this.subjectsRepository.findById(post.subjectId.toString())
        : null

      return Post.create({
        id: post.id,
        title: post.title,
        description: post.description,
        bannerUrl: post.bannerUrl,
        content: post.content,
        publishedYear: post.publishedYear,
        status: post.status,
        semester: post.semester,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        author: {
          name: author.name,
          username: author.username,
          profileUrl: author.profileUrl,
        },
        authorId: post.authorId,
        subject: subject?.name,
        subjectId: post.subjectId,
        trails: post.trails.map(trail => trail.name),
        professors: post.professors?.map(professor => professor.name),
      })
    })

    return await Promise.all(posts)
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
