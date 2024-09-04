import type {
  ProjectQuery,
  ProjectsRepository,
} from '@/domain/deck/application/repositories/projects-repository.ts'
import type { Project } from '@/domain/deck/enterprise/entities/project.ts'
import { ProjectDetails } from '@/domain/deck/enterprise/entities/value-objects/project-details.ts'
import type { InMemoryProfessorsRepository } from './professors-repository.ts'
import type { InMemoryProjectProfessorsRepository } from './project-professors-repository.ts'
import type { InMemoryProjectTrailsRepository } from './project-trails-repository.ts'
import type { InMemoryStudentsRepository } from './students-repository.ts'
import type { InMemoryTrailsRepository } from './trails-repository.ts'

export class InMemoryProjectsRepository implements ProjectsRepository {
  public items: Project[] = []

  constructor(
    private projectTrailsRepository: InMemoryProjectTrailsRepository,
    private projectProfessorsRepository: InMemoryProjectProfessorsRepository,
    private studentsRepository: InMemoryStudentsRepository,
    private subjectsRepository: InMemoryStudentsRepository,
    private trailsRepository: InMemoryTrailsRepository,
    private professorsRepository: InMemoryProfessorsRepository,
  ) {}

  async findById(id: string): Promise<Project | null> {
    const project = this.items.find(item => item.id.toString() === id)

    if (!project) {
      return null
    }

    return await Promise.resolve(project)
  }

  async findDetailsById(id: string): Promise<ProjectDetails | null> {
    const project = this.items.find(item => item.id.toString() === id)

    if (!project) {
      return null
    }

    const author = this.studentsRepository.items.find(
      item => item.id === project.authorId,
    )

    if (!author) {
      throw new Error(`Author with ID ${project.authorId} not found.`)
    }

    const subject = this.subjectsRepository.items.find(
      item => item.id === project.subjectId,
    )

    const projectTrails = this.projectTrailsRepository.items.filter(item => {
      return item.projectId.equals(project.id)
    })

    const trails = projectTrails.map(projectTrail => {
      const trail = this.trailsRepository.items.find(item =>
        item.id.equals(projectTrail.trailId),
      )

      if (!trail) {
        throw new Error(`Trail with ID ${projectTrail.trailId} not found.`)
      }

      return trail
    })

    const projectProfessors = this.projectProfessorsRepository.items.filter(
      item => {
        return item.projectId.equals(project.id)
      },
    )

    const professors = projectProfessors.map(projectProfessor => {
      const professor = this.professorsRepository.items.find(
        item => item.id === projectProfessor.id,
      )

      if (!professor) {
        throw new Error(`Professor with ID ${projectProfessor.id} not found.`)
      }

      return professor
    })

    return await Promise.resolve(
      ProjectDetails.create({
        title: project.title,
        description: project.description,
        bannerUrl: project.bannerUrl,
        publishedYear: project.publishedYear,
        status: project.status,
        semester: project.semester,
        allowComments: project.allowComments,
        author: {
          name: author.name,
          username: author.username,
        },
        authorId: project.authorId,
        subject: subject?.name,
        subjectId: project?.subjectId,
        professors,
        trails,
        createdAt: project.createdAt,
      }),
    )
  }

  async fetchAll(): Promise<Project[]> {
    const projects = this.items
    return await Promise.resolve(projects)
  }

  async fetchByQuery({
    title,
    subjectId,
    authorId,
    professorsIds,
    publishedYear,
  }: ProjectQuery): Promise<Project[]> {
    return await Promise.resolve(
      this.items.filter(item => {
        if (title && !item.title.toLowerCase().includes(title.toLowerCase())) {
          return false
        }

        if (subjectId && !(item.subjectId?.toString() === subjectId)) {
          return false
        }

        if (authorId && !(item.authorId.toString() === authorId)) {
          return false
        }

        if (
          professorsIds &&
          item.professors &&
          !item.professors
            .getItems()
            .every(professor =>
              professorsIds.includes(professor.professorId.toString()),
            )
        ) {
          return false
        }

        if (publishedYear && item.publishedYear !== publishedYear) {
          return false
        }

        return true
      }),
    )
  }

  async create(project: Project): Promise<void> {
    await Promise.resolve(this.items.push(project))

    await this.projectTrailsRepository.createMany(project.trails.getItems())

    if (project.professors) {
      await this.projectProfessorsRepository.createMany(
        project.professors.getItems(),
      )
    }

    return await Promise.resolve()
  }

  async save(project: Project): Promise<void> {
    const index = this.items.findIndex(item => item.id.equals(project.id))

    if (index !== -1) {
      this.items[index] = project
    }

    await this.projectTrailsRepository.createMany(project.trails.getItems())

    if (project.professors) {
      await this.projectProfessorsRepository.createMany(
        project.professors.getItems(),
      )
    }

    return await Promise.resolve()
  }

  async delete(project: Project): Promise<void> {
    const index = this.items.findIndex(item => item.id.equals(project.id))

    if (index !== -1) {
      this.items.splice(index, 1)
    }

    await this.projectTrailsRepository.deleteMany(project.trails.getItems())

    if (project.professors) {
      await this.projectProfessorsRepository.deleteMany(
        project.professors.getItems(),
      )
    }

    return await Promise.resolve()
  }
}
