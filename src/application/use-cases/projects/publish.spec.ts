import { Professor } from '@/domain/deck/enterprise/entities/professor.ts'
import { Project } from '@/domain/deck/enterprise/entities/project.entity.ts'
import { Subject } from '@/domain/deck/enterprise/entities/subject.ts'
import { Trail } from '@/domain/deck/enterprise/entities/trail.ts'
import { InMemoryProfessorsRepository } from '../../../../test/repositories/professors-repository.ts'
import { InMemoryProjectsRepository } from '../../../../test/repositories/projects-repository.ts'
import { InMemoryUsersRepository } from '../../../../test/repositories/students-repository.ts'
import { InMemorySubjectsRepository } from '../../../../test/repositories/subjects-repository.ts'
import { InMemoryTrailsRepository } from '../../../../test/repositories/trails-repository.ts'
import { InvalidCredentialsError } from '../../../core/errors/invalid-credentials.error.ts'
import { UserNotFoundError } from '../../../domain/students/application/use-cases/errors/user-not-found.error.ts'
import { ProfessorNotFoundError } from '../professors/errors/professor-not-found.error.ts'
import { SubjectNotFoundError } from '../subjects/errors/subject-not-found.error.ts'
import { TrailNotFoundError } from '../trails/errors/trail-not-found.error.ts'
import { PublishProjectUseCase } from './publish.ts'

let projectsRepository: InMemoryProjectsRepository
let professorsRepository: InMemoryProfessorsRepository
let subjectsRepository: InMemorySubjectsRepository
let trailsRepository: InMemoryTrailsRepository
let usersRepository: InMemoryUsersRepository
let sut: PublishProjectUseCase
let author: User
let subject: Subject
let firstTrail: Trail
let secondTrail: Trail
let firstProfessor: Professor
let secondProfessor: Professor

describe('publish project use case', () => {
  beforeEach(() => {
    projectsRepository = new InMemoryProjectsRepository(
      professorsRepository,
      trailsRepository,
    )
    subjectsRepository = new InMemorySubjectsRepository()
    trailsRepository = new InMemoryTrailsRepository()
    professorsRepository = new InMemoryProfessorsRepository()
    usersRepository = new InMemoryUsersRepository()

    sut = new PublishProjectUseCase(
      projectsRepository,
      trailsRepository,
      professorsRepository,
      subjectsRepository,
      usersRepository,
    )

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

    firstTrail = Trail.create({
      name: 'First Trail',
    })

    secondTrail = Trail.create({
      name: 'Second Trail',
    })

    firstProfessor = Professor.create({
      name: 'First Professor',
    })

    secondProfessor = Professor.create({
      name: 'Second Professor',
    })

    subjectsRepository.create(subject)
    trailsRepository.create(firstTrail)
    trailsRepository.create(secondTrail)
    professorsRepository.create(firstProfessor)
    professorsRepository.create(secondProfessor)
    usersRepository.create(author)
  })

  it('should be able to create a project', async () => {
    const result = await sut.execute({
      title: 'Project Title',
      description: 'Project Description',
      bannerUrl: 'https://example.com/banner.png',
      content: 'Project Content',
      publishedYear: 2021,
      status: 'DRAFT',
      semester: 3,
      allowComments: true,
      authorId: author.id,
      trailsIds: [firstTrail.id, secondTrail.id],
      professorsIds: [firstProfessor.id, secondProfessor.id],
      subjectId: subject.id,
    })

    expect(result.isRight()).toBe(true)
    expect(result.isRight() && result.value).toBeInstanceOf(Project)
  })

  it('should not be able to create a project with invalid credentials', async () => {
    const result = await sut.execute({
      title: '',
      description: '',
      bannerUrl: '',
      content: '',
      publishedYear: 0,
      status: 'DRAFT',
      semester: 0,
      allowComments: true,
      authorId: author.id,
      trailsIds: [firstTrail.id, secondTrail.id],
      professorsIds: [firstProfessor.id, secondProfessor.id],
      subjectId: subject.id,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(
      InvalidCredentialsError,
    )
  })

  it('should not be able to create a project with invalid subject', async () => {
    const result = await sut.execute({
      title: 'Project Title',
      description: 'Project Description',
      bannerUrl: 'https://example.com/banner.png',
      content: 'Project Content',
      publishedYear: 2021,
      status: 'DRAFT',
      semester: 3,
      allowComments: true,
      authorId: author.id,
      trailsIds: [firstTrail.id, secondTrail.id],
      professorsIds: [firstProfessor.id, secondProfessor.id],
      subjectId: 'invalid-subject-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(SubjectNotFoundError)
  })

  it('should not be able to create a project with invalid trails', async () => {
    const result = await sut.execute({
      title: 'Project Title',
      description: 'Project Description',
      bannerUrl: 'https://example.com/banner.png',
      content: 'Project Content',
      publishedYear: 2021,
      status: 'DRAFT',
      semester: 3,
      allowComments: true,
      authorId: author.id,
      trailsIds: ['invalid-trail-id'],
      professorsIds: [firstProfessor.id, secondProfessor.id],
      subjectId: subject.id,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(TrailNotFoundError)
  })

  it('should not be able to create a project with invalid professors', async () => {
    const result = await sut.execute({
      title: 'Project Title',
      description: 'Project Description',
      bannerUrl: 'https://example.com/banner.png',
      content: 'Project Content',
      publishedYear: 2021,
      status: 'DRAFT',
      semester: 3,
      allowComments: true,
      authorId: author.id,
      trailsIds: [firstTrail.id, secondTrail.id],
      professorsIds: ['invalid-professor-id'],
      subjectId: subject.id,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(
      ProfessorNotFoundError,
    )
  })

  it('should not be able to create a project with invalid author', async () => {
    const result = await sut.execute({
      title: 'Project Title',
      description: 'Project Description',
      bannerUrl: 'https://example.com/banner.png',
      content: 'Project Content',
      publishedYear: 2021,
      status: 'DRAFT',
      semester: 3,
      allowComments: true,
      authorId: 'invalid-author-id',
      trailsIds: [firstTrail.id, secondTrail.id],
      professorsIds: [firstProfessor.id, secondProfessor.id],
      subjectId: subject.id,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(UserNotFoundError)
  })

  it('should not be able to create a project with invalid semester', async () => {
    const result = await sut.execute({
      title: 'Project Title',
      description: 'Project Description',
      bannerUrl: 'https://example.com/banner.png',
      content: 'Project Content',
      publishedYear: 2021,
      status: 'DRAFT',
      semester: 0,
      allowComments: true,
      authorId: author.id,
      trailsIds: [firstTrail.id, secondTrail.id],
      professorsIds: [firstProfessor.id, secondProfessor.id],
      subjectId: subject.id,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(
      InvalidCredentialsError,
    )
  })
})
