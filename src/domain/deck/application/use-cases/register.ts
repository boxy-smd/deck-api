import { type Either, left, right } from '@/core/either.ts'
import { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import { ResourceAlreadyExistsError } from '@/core/errors/resource-already-exists.ts'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.ts'
import type { TrailsRepository } from '@/domain/deck/application/repositories/trails-repository.ts'
import { StudentTrailList } from '../../enterprise/entities/student-trail-list.ts'
import { StudentTrail } from '../../enterprise/entities/student-trail.ts'
import { Student } from '../../enterprise/entities/student.ts'
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
  trailsIds?: string[]
  about?: string
  profileUrl?: string
}

type RegisterUseCaseResponse = Either<
  ResourceNotFoundError | ResourceAlreadyExistsError | EmailBadFormattedError,
  Student
>

export class RegisterUseCase {
  constructor(
    private usersRepository: StudentsRepository,
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
