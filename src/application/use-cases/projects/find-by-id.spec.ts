import { Professor } from '@/domain/deck/enterprise/entities/professor.ts'
import { Project } from '@/domain/deck/enterprise/entities/project.entity.ts'
import { Subject } from '@/domain/deck/enterprise/entities/subject.ts'
import { Trail } from '@/domain/deck/enterprise/entities/trail.ts'
import { Student } from '@/domain/entities/student.entity.ts'
import { InMemoryProfessorsRepository } from '../../../../test/repositories/professors-repository.ts'
import { InMemoryProjectsRepository } from '../../../../test/repositories/projects-repository.ts'
import { InMemoryUsersRepository } from '../../../../test/repositories/students-repository.ts'
import { InMemorySubjectsRepository } from '../../../../test/repositories/subjects-repository.ts'
import { InMemoryTrailsRepository } from '../../../../test/repositories/trails-repository.ts'
import { ProjectNotFoundError } from './errors/project-not-found.ts'
import { FindProjectByIdUseCase } from './find-by-id.ts'

let projectsRepository: InMemoryProjectsRepository
let professorsRepository: InMemoryProfessorsRepository
let subjectsRepository: InMemorySubjectsRepository
let trailsRepository: InMemoryTrailsRepository
let usersRepository: InMemoryUsersRepository
let sut: FindProjectByIdUseCase
let author: Student
let subject: Subject
let trail: Trail
let professor: Professor

describe('find project by id use case', () => {
  beforeEach(() => {
    projectsRepository = new InMemoryProjectsRepository(
      professorsRepository,
      trailsRepository,
    )
    subjectsRepository = new InMemorySubjectsRepository()
    trailsRepository = new InMemoryTrailsRepository()
    professorsRepository = new InMemoryProfessorsRepository()
    usersRepository = new InMemoryUsersRepository()

    sut = new FindProjectByIdUseCase(projectsRepository)

    const authorOrError = Student.create({
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@alu.ufc.br',
      passwordHash: 'password-hash',
      semester: 3,
    })

    if (authorOrError.isLeft()) {
      throw authorOrError.value
    }

    author = authorOrError.value

    subject = Subject.create({
      name: 'Subject Name',
    })

    trail = Trail.create({
      name: 'Trail',
    })

    professor = Professor.create({
      name: 'Professor',
    })

    subjectsRepository.create(subject)
    trailsRepository.create(trail)
    professorsRepository.create(professor)
    usersRepository.create(author)
  })

  it('should return a project by id', async () => {
    const project = Project.create({
      title: 'Project Title',
      description: 'Project Description',
      publishedYear: 2021,
      authorId: author.id,
      professors: [professor],
      subjectId: subject.id,
      trails: [trail],
      allowComments: true,
      bannerUrl: 'http://banner-url.com',
      semester: 3,
      status: 'DRAFT',
    })

    projectsRepository.create(project)

    const response = await sut.execute({ id: project.id })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual(project)
  })

  it('should return a project not found error', async () => {
    const response = await sut.execute({ id: 'invalid-id' })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ProjectNotFoundError)
  })
})
