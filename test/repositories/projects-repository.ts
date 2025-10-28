import type { UsersRepository } from '@/domain/authentication/application/repositories/users-repository.ts'
import type { ProfessorsRepository } from '@/domain/projects/application/repositories/professors-repository.ts'
import type {
  ProjectQuery,
  ProjectsRepository,
} from '@/domain/projects/application/repositories/projects-repository.ts'
import type { SubjectsRepository } from '@/domain/projects/application/repositories/subjects-repository.ts'
import type { TrailsRepository } from '@/domain/projects/application/repositories/trails-repository.ts'
import { Project } from '@/domain/projects/enterprise/entities/project.ts'
import { Post } from '@/domain/projects/enterprise/value-objects/post.ts'
import { InMemoryProfessorsRepository } from './professors-repository.ts'
import { InMemorySubjectsRepository } from './subjects-repository.ts'
import { InMemoryTrailsRepository } from './trails-repository.ts'
import { InMemoryUsersRepository } from './users-repository.ts'

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

  async findManyByTitle(title: string): Promise<Project[]> {
    const projects = this.items.filter(item =>
      item.title.toLowerCase().includes(title.toLowerCase()),
    )

    return await Promise.all(projects)
  }

  async findManyPostsByTitle(title: string): Promise<Post[]> {
    const projects = await this.findManyByTitle(title)

    const posts = await Promise.all(
      projects.map(async project => {
        const author = await this.studentsRepository.findById(
          project.authorId.toString(),
        )

        if (!author) {
          throw new Error('Author not found.')
        }

        const subject = project.subjectId
          ? await this.subjectsRepository.findById(project.subjectId.toString())
          : null

        const trails = await Promise.all(
          Array.from(project.trails).map(async trailId => {
            const trail = await this.trailsRepository.findById(
              trailId.toString(),
            )
            return trail ? { name: trail.name } : null
          }),
        )

        const professors = await Promise.all(
          Array.from(project.professors).map(async professorId => {
            const professor = await this.professorsRepository.findById(
              professorId.toString(),
            )
            return professor ? { name: professor.name } : null
          }),
        )

        return new Post({
          id: project.id.toString(),
          title: project.title,
          description: project.description || '',
          bannerUrl: project.bannerUrl || null,
          content: project.content,
          publishedYear: project.publishedYear || null,
          status: project.status,
          semester: project.semester || null,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
          authorId: project.authorId.toString(),
          author: {
            name: author.name,
            username: author.username.value,
            profileUrl: author.profileUrl || null,
          },
          subjectId: project.subjectId?.toString() || null,
          subject: subject ? { name: subject.name } : null,
          trails: trails.filter(Boolean) as { name: string }[],
          professors: professors.filter(Boolean) as { name: string }[],
        })
      }),
    )

    return posts
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

  async findManyPostsByProfessorName(name: string): Promise<Post[]> {
    const projects = await this.findManyByProfessorName(name)

    const posts = await Promise.all(
      projects.map(async project => {
        const author = await this.studentsRepository.findById(
          project.authorId.toString(),
        )

        if (!author) {
          throw new Error('Author not found.')
        }

        const subject = project.subjectId
          ? await this.subjectsRepository.findById(project.subjectId.toString())
          : null

        const trails = await Promise.all(
          Array.from(project.trails).map(async trailId => {
            const trail = await this.trailsRepository.findById(
              trailId.toString(),
            )
            return trail ? { name: trail.name } : null
          }),
        )

        const professors = await Promise.all(
          Array.from(project.professors).map(async professorId => {
            const professor = await this.professorsRepository.findById(
              professorId.toString(),
            )
            return professor ? { name: professor.name } : null
          }),
        )

        return new Post({
          id: project.id.toString(),
          title: project.title,
          description: project.description || '',
          bannerUrl: project.bannerUrl || null,
          content: project.content,
          publishedYear: project.publishedYear || null,
          status: project.status,
          semester: project.semester || null,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
          authorId: project.authorId.toString(),
          author: {
            name: author.name,
            username: author.username.value,
            profileUrl: author.profileUrl || null,
          },
          subjectId: project.subjectId?.toString() || null,
          subject: subject ? { name: subject.name } : null,
          trails: trails.filter(Boolean) as { name: string }[],
          professors: professors.filter(Boolean) as { name: string }[],
        })
      }),
    )

    return posts
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

  async findManyPostsByQuery({
    semester,
    publishedYear,
    subjectId,
    trailsIds,
  }: ProjectQuery): Promise<Post[]> {
    const projects = await this.findManyByQuery({
      semester,
      publishedYear,
      subjectId,
      trailsIds,
    })

    const posts = await Promise.all(
      projects.map(async project => {
        const author = await this.studentsRepository.findById(
          project.authorId.toString(),
        )

        if (!author) {
          throw new Error('Author not found.')
        }

        const subject = project.subjectId
          ? await this.subjectsRepository.findById(project.subjectId.toString())
          : null

        const trails = await Promise.all(
          Array.from(project.trails).map(async trailId => {
            const trail = await this.trailsRepository.findById(
              trailId.toString(),
            )
            return trail ? { name: trail.name } : null
          }),
        )

        const professors = await Promise.all(
          Array.from(project.professors).map(async professorId => {
            const professor = await this.professorsRepository.findById(
              professorId.toString(),
            )
            return professor ? { name: professor.name } : null
          }),
        )

        return new Post({
          id: project.id.toString(),
          title: project.title,
          description: project.description || '',
          bannerUrl: project.bannerUrl || null,
          content: project.content,
          publishedYear: project.publishedYear || null,
          status: project.status,
          semester: project.semester || null,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
          authorId: project.authorId.toString(),
          author: {
            name: author.name,
            username: author.username.value,
            profileUrl: author.profileUrl || null,
          },
          subjectId: project.subjectId?.toString() || null,
          subject: subject ? { name: subject.name } : null,
          trails: trails.filter(Boolean) as { name: string }[],
          professors: professors.filter(Boolean) as { name: string }[],
        })
      }),
    )

    return posts
  }

  async findManyPostsByTag(tag: string): Promise<Post[]> {
    const projects = await this.findManyByTag(tag)

    const posts = await Promise.all(
      projects.map(async project => {
        const author = await this.studentsRepository.findById(
          project.authorId.toString(),
        )

        if (!author) {
          throw new Error('Author not found.')
        }

        const subject = project.subjectId
          ? await this.subjectsRepository.findById(project.subjectId.toString())
          : null

        const trails = await Promise.all(
          Array.from(project.trails).map(async trailId => {
            const trail = await this.trailsRepository.findById(
              trailId.toString(),
            )
            return trail ? { name: trail.name } : null
          }),
        )

        const professors = await Promise.all(
          Array.from(project.professors).map(async professorId => {
            const professor = await this.professorsRepository.findById(
              professorId.toString(),
            )
            return professor ? { name: professor.name } : null
          }),
        )

        return new Post({
          id: project.id.toString(),
          title: project.title,
          description: project.description || '',
          bannerUrl: project.bannerUrl || null,
          content: project.content,
          publishedYear: project.publishedYear || null,
          status: project.status,
          semester: project.semester || null,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
          authorId: project.authorId.toString(),
          author: {
            name: author.name,
            username: author.username.value,
            profileUrl: author.profileUrl || null,
          },
          subjectId: project.subjectId?.toString() || null,
          subject: subject ? { name: subject.name } : null,
          trails: trails.filter(Boolean) as { name: string }[],
          professors: professors.filter(Boolean) as { name: string }[],
        })
      }),
    )

    return posts
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

  async findAll(): Promise<Project[]> {
    return await Promise.resolve(this.items)
  }

  async findAllPosts(): Promise<Post[]> {
    const projects = this.items

    const posts = await Promise.all(
      projects.map(async project => {
        const author = await this.studentsRepository.findById(
          project.authorId.toString(),
        )

        if (!author) {
          throw new Error('Author not found.')
        }

        const subject = project.subjectId
          ? await this.subjectsRepository.findById(project.subjectId.toString())
          : null

        const trails = await Promise.all(
          Array.from(project.trails).map(async trailId => {
            const trail = await this.trailsRepository.findById(
              trailId.toString(),
            )
            return trail ? { name: trail.name } : null
          }),
        )

        const professors = await Promise.all(
          Array.from(project.professors).map(async professorId => {
            const professor = await this.professorsRepository.findById(
              professorId.toString(),
            )
            return professor ? { name: professor.name } : null
          }),
        )

        return new Post({
          id: project.id.toString(),
          title: project.title,
          description: project.description || '',
          bannerUrl: project.bannerUrl || null,
          content: project.content,
          publishedYear: project.publishedYear || null,
          status: project.status,
          semester: project.semester || null,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
          authorId: project.authorId.toString(),
          author: {
            name: author.name,
            username: author.username.value,
            profileUrl: author.profileUrl || null,
          },
          subjectId: project.subjectId?.toString() || null,
          subject: subject ? { name: subject.name } : null,
          trails: trails.filter(Boolean) as { name: string }[],
          professors: professors.filter(Boolean) as { name: string }[],
        })
      }),
    )

    return posts
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
