import { type Either, left, right } from '@/core/either.ts'
import { InvalidCredentialsError } from '@/core/errors/invalid-credentials.error.ts'
import { ResourceAlreadyExistsError } from '@/core/errors/resource-already-exists.ts'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.ts'
import type { Trail } from '@/domain/entities/trail.entity.ts'
import type { TrailsRepository } from '@/domain/repositories/trails-repository.ts'
import { Student } from '../../enterprise/student.entity.ts'
import { Email } from '../../enterprise/value-objects/email.ts'
import type { EmailBadFormattedError } from '../../enterprise/value-objects/errors/email-bad-formatted.error.ts'
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

    const trails: Trail[] = []

    if (trailsIds) {
      for (const trailId of trailsIds) {
        const trail = await this.trailsRepository.findById(trailId)
        if (!trail) {
          return left(new ResourceNotFoundError('Trail not found.'))
        }
        trails.push(trail)
      }
    }

    const emailOrError = Email.create(email)

    if (emailOrError.isLeft()) {
      return left(emailOrError.value)
    }

    const validatedEmail = emailOrError.value

    const user = Student.create({
      name,
      username,
      email: validatedEmail,
      passwordHash,
      semester,
      about,
      profileUrl,
      trails,
    })

    await this.usersRepository.create(user)

    return right(user)
  }
}
