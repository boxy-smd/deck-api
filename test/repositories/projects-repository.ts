import type { ProfessorsRepository } from '@/domain/deck/application/repositories/professors-repository.ts'
import type {
  ProjectQuery,
  ProjectsRepository,
  UpdateProjectRequest,
} from '@/domain/deck/application/repositories/projects-repository.ts'
import type { TrailsRepository } from '@/domain/deck/application/repositories/trails-repository.ts'
import type { Professor } from '@/domain/deck/enterprise/entities/professor.entity.ts'
import type { Project } from '@/domain/deck/enterprise/entities/project.entity.ts'

export class InMemoryProjectsRepository implements ProjectsRepository {
  private projects: Project[] = []

  constructor(
    private professorsRepository: ProfessorsRepository,
    private trailsRepository: TrailsRepository,
  ) {}

  async create(project: Project): Promise<Project> {
    this.projects.push(project)
    return await Promise.resolve(project)
  }

  async fetchByQuery({
    title,
    publishedYear,
    authorId,
    professorsIds,
    subjectId,
  }: ProjectQuery): Promise<Project[]> {
    const professors: Professor[] = []

    if (professorsIds) {
      for (const professorId of professorsIds) {
        const professor = await this.professorsRepository.findById(professorId)
        if (professor) professors.push(professor)
      }
    }

    const projects = this.projects.filter(project => {
      if (title && !project.title.includes(title)) return false
      if (publishedYear && project.publishedYear !== publishedYear) return false
      if (
        professorsIds &&
        !professors.every(professor => project.professors?.includes(professor))
      )
        return false
      if (authorId && project.authorId !== authorId) return false
      if (subjectId && project.subjectId !== subjectId) return false

      return true
    })

    return Promise.resolve(projects)
  }

  async findById(id: string): Promise<Project | null> {
    const project = this.projects.find(project => project.id === id)
    return await Promise.resolve(project ?? null)
  }

  fetch(): Promise<Project[]> {
    const orderedProjectsByCreationDate = this.projects.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    )

    return Promise.resolve(orderedProjectsByCreationDate)
  }

  fetchBySemester(semester: number): Promise<Project[]> {
    const semesters = Array.from({ length: 12 }, (_, i) => (i + 1) % 12)
    const previousSemesters = semesters.slice(semester - 1)
    const nextSemesters = semesters.slice(0, semester - 1)

    const orderedSemesters = [...nextSemesters, ...previousSemesters]

    const projects = this.projects.sort((a, b) => {
      return (
        orderedSemesters.indexOf(a.semester) -
        orderedSemesters.indexOf(b.semester)
      )
    })

    const previousSemesterProjects = projects.filter(
      project => project.semester < semester,
    )

    const nextSemesterProjects = projects.filter(
      project => project.semester > semester,
    )

    return Promise.resolve([
      ...nextSemesterProjects,
      ...previousSemesterProjects,
    ])
  }

  async update(
    id: string,
    request: UpdateProjectRequest,
  ): Promise<Project | null> {
    const projectIndex = this.projects.findIndex(project => project.id === id)
    if (projectIndex === -1) return Promise.resolve(null)

    if (request.title) {
      this.projects[projectIndex].title = request.title
    }

    if (request.bannerUrl) {
      this.projects[projectIndex].bannerUrl = request.bannerUrl
    }

    if (request.description) {
      this.projects[projectIndex].description = request.description
    }

    if (request.publishedYear) {
      this.projects[projectIndex].publishedYear = request.publishedYear
    }

    if (request.semester) {
      this.projects[projectIndex].semester = request.semester
    }

    if (request.status) {
      this.projects[projectIndex].status = request.status
    }

    if (request.subjectId) {
      this.projects[projectIndex].subjectId = request.subjectId
    }

    if (request.professors) {
      this.projects[projectIndex].professors = request.professors

      for (const professor of request.professors) {
        professor.projects = professor.projects.filter(
          project => project.id !== id,
        )
        professor.projects.push(this.projects[projectIndex])

        await this.professorsRepository.update(professor.id, professor)
      }
    }

    if (request.trails) {
      this.projects[projectIndex].trails = request.trails

      for (const trail of request.trails) {
        trail.projects = trail.projects.filter(project => project.id !== id)
        trail.projects.push(this.projects[projectIndex])

        await this.trailsRepository.update(trail.id, trail)
      }
    }

    return await Promise.resolve(
      this.projects.find(project => project.id === id) ?? null,
    )
  }

  async delete(id: string): Promise<void> {
    this.projects = this.projects.filter(project => project.id !== id)
    return await Promise.resolve()
  }
}
