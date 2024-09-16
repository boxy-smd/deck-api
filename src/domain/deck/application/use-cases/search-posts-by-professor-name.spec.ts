import { makeProfessor } from 'test/factories/make-professor.ts'
import { makeProject } from 'test/factories/make-project.ts'
import { makeStudent } from 'test/factories/make-student.ts'
import { makeTrail } from 'test/factories/make-trail.ts'
import { InMemoryCommentsRepository } from 'test/repositories/comments-repository.ts'
import { InMemoryProfessorsRepository } from 'test/repositories/professors-repository.ts'
import { InMemoryProjectsRepository } from 'test/repositories/projects-repository.ts'
import { InMemoryStudentsRepository } from 'test/repositories/students-repository.ts'
import { InMemorySubjectsRepository } from 'test/repositories/subjects-repository.ts'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository.ts'
import type { Professor } from '../../enterprise/entities/professor.ts'
import type { Project } from '../../enterprise/entities/project.ts'
import type { Student } from '../../enterprise/entities/student.ts'
import type { Trail } from '../../enterprise/entities/trail.ts'
import { SearchPostsByProfessorUseCase } from './search-posts-by-professor-name.ts'

let projectsRepository: InMemoryProjectsRepository
let studentsRepository: InMemoryStudentsRepository
let subjectsRepository: InMemorySubjectsRepository
let trailsRepository: InMemoryTrailsRepository
let professorsRepository: InMemoryProfessorsRepository
let commentsRepository: InMemoryCommentsRepository

let author: Student
let trail: Trail
let professor: Professor
let project: Project

let sut: SearchPostsByProfessorUseCase

describe('search posts by professor name use case', () => {
  beforeEach(async () => {
    studentsRepository = new InMemoryStudentsRepository()
    subjectsRepository = new InMemorySubjectsRepository()
    trailsRepository = new InMemoryTrailsRepository()
    professorsRepository = new InMemoryProfessorsRepository()
    commentsRepository = new InMemoryCommentsRepository(studentsRepository)

    projectsRepository = new InMemoryProjectsRepository(
      studentsRepository,
      subjectsRepository,
      commentsRepository,
    )

    author = await makeStudent()
    trail = makeTrail()
    professor = makeProfessor({
      name: 'Dio Brando',
    })

    project = makeProject({
      title: 'Awesome project',
      authorId: author.id,
      trails: [trail],
      professors: [professor],
    })

    await studentsRepository.create(author)
    await trailsRepository.create(trail)
    await professorsRepository.create(professor)
    await projectsRepository.create(project)

    sut = new SearchPostsByProfessorUseCase(projectsRepository)
  })

  it('should be able to search posts by title', async () => {
    const result = await sut.execute({
      name: 'Dio',
    })

    expect(result).length(1)
    expect(result[0].title).toBe(project.title)
  })

  it('should be able to search posts by title case insensitive', async () => {
    const result = await sut.execute({
      name: 'dio',
    })

    expect(result).length(1)
    expect(result[0].title).toBe(project.title)
  })

  it('should be able to search posts by title with partial match', async () => {
    const result = await sut.execute({
      name: 'Di',
    })

    expect(result).length(1)
    expect(result[0].title).toBe(project.title)
  })

  it('should not return any post when title does not match', async () => {
    const result = await sut.execute({
      name: 'Not found',
    })

    expect(result).length(0)
  })
})
