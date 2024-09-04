import { type Either, left, right } from '@/core/either.ts'
import { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import { InvalidCredentialsError } from '@/core/errors/invalid-credentials.error.ts'
import { ResourceAlreadyExistsError } from '@/core/errors/resource-already-exists.ts'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.ts'
import type { TrailsRepository } from '@/domain/deck/application/repositories/trails-repository.ts'
import { StudentTrailList } from '../../enterprise/entities/student-trail-list.entity.ts'
import { StudentTrail } from '../../enterprise/entities/student-trail.entity.ts'
import { Student } from '../../enterprise/entities/student.entity.ts'
import { Email } from '../../enterprise/entities/value-objects/email.ts'
import type { EmailBadFormattedError } from '../../enterprise/entities/value-objects/errors/email-bad-formatted.error.ts'
import type { StudentsRepository } from '../repositories/students-repository.ts'
import type { Encrypter } from './cryptography/encrypter.ts'

interface RegisterUseCaseRequest {
  name: string
  username: string
  email: string
  password: string
  semester: number
  trailsIds?: string[]
  about?: string
  profileUrl?: string
}

type RegisterUseCaseResponse = Either<
  | InvalidCredentialsError
  | ResourceNotFoundError
  | ResourceAlreadyExistsError
  | EmailBadFormattedError,
  Student
>

export class RegisterUseCase {
  constructor(
    private usersRepository: StudentsRepository,
    private trailsRepository: TrailsRepository,
    private encrypter: Encrypter,
  ) {}

  public async execute({
    name,
    username,
    email,
    password,
    semester,
    about,
    profileUrl,
    trailsIds,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    if (!(name && username && email && password && semester)) {
      return left(
        new InvalidCredentialsError('Required fields must be provided.'),
      )
    }

    const isUsernameTaken = await this.usersRepository.findByUsername(username)

    if (isUsernameTaken) {
      return left(
        new ResourceAlreadyExistsError('This username is already taken.'),
      )
    }

    const isEmailTaken = await this.usersRepository.findByEmail(email)

    if (isEmailTaken) {
      return left(
        new ResourceAlreadyExistsError('This email is already taken.'),
      )
    }

    const passwordHash = await Student.hashPassword(password, this.encrypter)

    const emailOrError = Email.create(email)

    if (emailOrError.isLeft()) {
      return left(emailOrError.value)
    }

    const validatedEmail = emailOrError.value

    if (trailsIds) {
      for (const trailId of trailsIds) {
        const trail = await this.trailsRepository.findById(trailId)

        if (!trail) {
          return left(
            new ResourceNotFoundError(`Trail with id ${trailId} not found.`),
          )
        }
      }
    }

    const user = Student.create({
      name,
      username,
      email: validatedEmail,
      passwordHash,
      semester,
      about,
      profileUrl,
    })

    const trails = trailsIds?.map(trailId => {
      return StudentTrail.create({
        trailId: new UniqueEntityID(trailId),
        studentId: user.id,
      })
    })

    user.trails = new StudentTrailList(trails)

    await this.usersRepository.create(user)

    return right(user)
  }
}
