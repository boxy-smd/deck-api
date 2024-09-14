import { type Either, left, right } from '@/core/either.ts'
import { ResourceAlreadyExistsError } from '@/core/errors/resource-already-exists.error.ts'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error.ts'
import type { TrailsRepository } from '@/domain/deck/application/repositories/trails-repository.ts'
import { Student } from '../../enterprise/entities/student.ts'
import type { Trail } from '../../enterprise/entities/trail.ts'
import { Email } from '../../enterprise/entities/value-objects/email.ts'
import { EmailBadFormattedError } from '../../enterprise/entities/value-objects/errors/email-bad-formatted.error.ts'
import type { StudentsRepository } from '../repositories/students-repository.ts'
import type { HashGenerator } from './cryptography/hash-generator.ts'

interface RegisterUseCaseRequest {
  name: string
  username: string
  email: string
  password: string
  semester: number
  trailsIds: string[]
  about?: string
  profileUrl?: string
}

type RegisterUseCaseResponse = Either<
  ResourceNotFoundError | ResourceAlreadyExistsError | EmailBadFormattedError,
  Student
>

export class RegisterUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private trailsRepository: TrailsRepository,
    private hasher: HashGenerator,
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
    const isUsernameTaken =
      await this.studentsRepository.findByUsername(username)

    if (isUsernameTaken) {
      return left(
        new ResourceAlreadyExistsError('This username is already taken.'),
      )
    }

    const isEmailTaken = await this.studentsRepository.findByEmail(email)

    if (isEmailTaken) {
      return left(
        new ResourceAlreadyExistsError('This email is already taken.'),
      )
    }

    const passwordHash = await this.hasher.hash(password)

    let validatedEmail: Email

    try {
      validatedEmail = Email.create(email)
    } catch (error) {
      if (error instanceof EmailBadFormattedError) {
        return left(error)
      }

      return left(new EmailBadFormattedError())
    }

    const trails = await Promise.all(
      trailsIds.map(async trailId => {
        const trail = await this.trailsRepository.findById(trailId)

        return trail
      }),
    )

    if (trails.some(trail => !trail)) {
      return left(new ResourceNotFoundError('Some trails were not found.'))
    }

    const user = Student.create({
      name,
      username,
      email: validatedEmail,
      passwordHash,
      semester,
      about,
      profileUrl,
      trails: trails as Trail[],
    })

    await this.studentsRepository.create(user)

    return right(user)
  }
}
