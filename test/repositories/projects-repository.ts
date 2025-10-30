import type { ProjectDTO } from '@/@core/application/projects/application/dtos/project.dto'
import type { ProfessorsRepository } from '@/@core/application/projects/application/repositories/professors-repository'
import type {
  ProjectQuery,
  ProjectsRepository,
} from '@/@core/application/projects/application/repositories/projects-repository'
import type { SubjectsRepository } from '@/@core/application/projects/application/repositories/subjects-repository'
import type { TrailsRepository } from '@/@core/application/projects/application/repositories/trails-repository'
import type { UsersRepository } from '@/@core/application/users/repositories/users-repository'
import type { Professor } from '@/@core/domain/projects/entities/professor'
import { Project } from '@/@core/domain/projects/entities/project'
import type { Subject } from '@/@core/domain/projects/entities/subject'
import type { Trail } from '@/@core/domain/projects/entities/trail'
import { InMemoryProfessorsRepository } from './professors-repository'
import { InMemorySubjectsRepository } from './subjects-repository'
import { InMemoryTrailsRepository } from './trails-repository'
import { InMemoryUsersRepository } from './users-repository'

export class InMemoryProjectsRepository implements ProjectsRepository {
  public items: Project[] = []

  private studentsRepository: UsersRepository
  private subjectsRepository: SubjectsRepository
  private trailsRepository: TrailsRepository
  private professorsRepository: ProfessorsRepository

  constructor(
    studentsRepository?: UsersRepository,
    subjectsRepository?: SubjectsRepository,
    trailsRepository?: TrailsRepository,
    professorsRepository?: ProfessorsRepository,
  ) {
    this.studentsRepository =
      studentsRepository || new InMemoryUsersRepository()
    this.subjectsRepository =
      subjectsRepository || new InMemorySubjectsRepository()
    this.trailsRepository = trailsRepository || new InMemoryTrailsRepository()
    this.professorsRepository =
      professorsRepository || new InMemoryProfessorsRepository()
  }

  async findById(id: string): Promise<Project | null> {
    return Promise.resolve(
      this.items.find(item => item.id.toString() === id) || null,
    )
  }

  private async projectToDTO(project: Project): Promise<ProjectDTO> {
    const author = await this.studentsRepository.findById(
      project.authorId.toString(),
    )

    if (!author) {
      throw new Error('Author not found.')
    }

    const subject: Subject = project.subjectId
      ? await this.subjectsRepository.findById(project.subjectId.toString())
      : null

    const trails: Trail[] = await Promise.all(
      Array.from(project.trails).map(
        async trailId =>
          await this.trailsRepository.findById(trailId.toString()),
      ),
    )

    const professors: Professor[] = await Promise.all(
      Array.from(project.professors).map(
        async professorId =>
          await this.professorsRepository.findById(professorId.toString()),
      ),
    )

    return {
      id: project.id.toString(),
      title: project.title,
      description: project.description || '',
      bannerUrl: project.bannerUrl || null,
      content: project.content,
      allowComments: project.allowComments,
      publishedYear: project.publishedYear || null,
      status: project.status,
      semester: project.semester || null,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      authorId: project.authorId.toString(),
      author: {
        id: author.id.toString(),
        name: author.name,
        username: author.username.value,
        profileUrl: author.profileUrl || null,
      },
      subjectId: project.subjectId?.toString() || null,
      subject: subject
        ? {
            id: subject.id.toString(),
            name: subject.name,
          }
        : null,
      trails: trails
        .filter(trail => trail !== null)
        .map(trail => ({
          id: trail.id.toString(),
          name: trail.name,
        })),
      professors: professors
        .filter(professor => professor !== null)
        .map(professor => ({
          id: professor.id.toString(),
          name: professor.name,
        })),
    }
  }

  async findByIdWithDetails(id: string): Promise<ProjectDTO | null> {
    const project = await this.findById(id)

    if (!project) {
      return null
    }

    return this.projectToDTO(project)
  }

  async findManyByTitle(title: string): Promise<Project[]> {
    const projects = this.items.filter(item =>
      item.title.toLowerCase().includes(title.toLowerCase()),
    )

    return await Promise.all(projects)
  }

  async findManyProjectDTOsByTitle(title: string): Promise<ProjectDTO[]> {
    const projects = await this.findManyByTitle(title)
    return Promise.all(projects.map(project => this.projectToDTO(project)))
  }

  async findManyByProfessorName(name: string): Promise<Project[]> {
    const professors = await this.professorsRepository.findManyByName(name)

    if (professors.length === 0) {
      return []
    }

    const projects = this.items.filter(item =>
      item.professors?.some(professor =>
        professors.some(p => p.id.equals(professor)),
      ),
    )

    return await Promise.all(projects)
  }

  async findManyProjectDTOsByProfessorName(
    name: string,
  ): Promise<ProjectDTO[]> {
    const projects = await this.findManyByProfessorName(name)
    return Promise.all(projects.map(project => this.projectToDTO(project)))
  }

  async findManyByQuery({
    semester,
    publishedYear,
    subjectId,
    trailsIds,
  }: ProjectQuery): Promise<Project[]> {
    const projects = this.items.filter(
      item =>
        (!semester || item.semester === semester) &&
        (!publishedYear || item.publishedYear === publishedYear) &&
        (!subjectId || item.subjectId?.toString() === subjectId) &&
        (!trailsIds ||
          item.trails.some(trail => trailsIds.includes(trail.toValue()))),
    )

    return await Promise.all(projects)
  }

  async findManyProjectDTOsByQuery(query: ProjectQuery): Promise<ProjectDTO[]> {
    const projects = await this.findManyByQuery(query)
    return Promise.all(projects.map(project => this.projectToDTO(project)))
  }

  async findManyByTag(tag: string): Promise<Project[]> {
    const semesterVariants: Record<number, string[]> = {
      1: ['1', 'primeiro', '1º'],
      2: ['2', 'segundo', '2º'],
      3: ['3', 'terceiro', '3º'],
      4: ['4', 'quarto', '4º'],
      5: ['5', 'quinto', '5º'],
      6: ['6', 'sexto', '6º'],
      7: ['7', 'sétimo', 'setimo', '7º'],
      8: ['8', 'oitavo', '8º'],
      9: ['9', 'nono', '9º'],
      10: ['10', 'décimo', 'decimo', '10º'],
      11: [
        '11',
        'décimo primeiro',
        'decimo primeiro',
        'décimo-primeiro',
        'decimo-primeiro',
        '11º',
      ],
      12: [
        '12',
        'décimo segundo',
        'decimo segundo',
        'décimo-segundo',
        'decimo-segundo',
        '12º',
      ],
    }

    let searchedSemester: number | undefined = undefined

    for (const key in semesterVariants) {
      const variants = semesterVariants[key]

      if (variants.includes(tag.toLowerCase())) {
        searchedSemester = Number.parseInt(key)

        break
      }
    }

    const subjects = await this.subjectsRepository.findManyByName(tag)

    const trails = await this.trailsRepository.findManyByName(tag)

    const filteredProjects: Project[] = []

    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: This is fine for now.
    async function filterProjectByTag(item: Project) {
      if (item.title.toLowerCase().includes(tag.toLowerCase())) {
        return filteredProjects.push(item)
      }

      if (item.subjectId) {
        if (
          subjects.some(subject =>
            subject.name.toLowerCase().includes(tag.toLowerCase()),
          )
        ) {
          return filteredProjects.push(item)
        }
      }

      if (item.publishedYear === Number.parseInt(tag)) {
        return filteredProjects.push(item)
      }

      if (searchedSemester && item.semester === searchedSemester) {
        return filteredProjects.push(item)
      }

      if (trails.length > 0) {
        const hasTrail = item.trails.some(trailId =>
          trails.some(trail => trail.id.equals(trailId)),
        )

        if (hasTrail) {
          return filteredProjects.push(item)
        }
      }

      return
    }

    this.items.forEach(filterProjectByTag)

    return await Promise.all(filteredProjects)
  }

  async findManyProjectDTOsByTag(tag: string): Promise<ProjectDTO[]> {
    const projects = await this.findManyByTag(tag)
    return Promise.all(projects.map(project => this.projectToDTO(project)))
  }

  async findManyByStudentId(studentId: string): Promise<Project[]> {
    const projects = this.items.filter(
      item => item.authorId.toString() === studentId,
    )

    const posts = projects.map(async post => {
      const author = await this.studentsRepository.findById(
        post.authorId.toString(),
      )

      if (!author) {
        throw new Error('Author not found.')
      }

      return Project.reconstitute(
        {
          title: post.title,
          description: post.description,
          bannerUrl: post.bannerUrl,
          content: post.content,
          publishedYear: post.publishedYear,
          status: post.status,
          semester: post.semester,
          allowComments: post.allowComments,
          authorId: post.authorId,
          subjectId: post.subjectId,
          trails: new Set(post.trails),
          professors: new Set(post.professors),
          comments: new Set(post.comments),
        },
        post.id,
        post.createdAt,
        post.updatedAt,
      )
    })

    return await Promise.all(posts)
  }

  async findManyProjectDTOsByStudentId(
    studentId: string,
  ): Promise<ProjectDTO[]> {
    const projects = await this.findManyByStudentId(studentId)
    return Promise.all(projects.map(project => this.projectToDTO(project)))
  }

  async findAll(): Promise<Project[]> {
    return await Promise.resolve(this.items)
  }

  async findAllProjectDTOs(): Promise<ProjectDTO[]> {
    return Promise.all(this.items.map(project => this.projectToDTO(project)))
  }

  async create(project: Project): Promise<void> {
    await Promise.resolve(this.items.push(project))
  }

  async save(project: Project): Promise<void> {
    await Promise.resolve(this.items.push(project))
  }

  async delete(project: Project): Promise<void> {
    const index = this.items.findIndex(item => item.id.equals(project.id))

    if (index === -1) {
      throw new Error('Project not found.')
    }

    this.items.splice(index, 1)
  }

  async deleteById(id: string): Promise<void> {
    const index = this.items.findIndex(item => item.id.toString() === id)

    if (index === -1) {
      throw new Error('Project not found.')
    }

    this.items.splice(index, 1)
  }

  async existsById(id: string): Promise<boolean> {
    const index = this.items.findIndex(item => item.id.toString() === id)
    return await Promise.resolve(index !== -1)
  }
}
