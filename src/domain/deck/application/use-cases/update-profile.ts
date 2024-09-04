import { type Either, left, right } from '@/core/either.ts'
import { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import type { InvalidCredentialsError } from '@/core/errors/invalid-credentials.error.ts'
import type { ResourceAlreadyExistsError } from '@/core/errors/resource-already-exists.ts'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.ts'
import { StudentTrailList } from '../../enterprise/entities/student-trail-list.entity.ts'
import { StudentTrail } from '../../enterprise/entities/student-trail.entity.ts'
import type { Student } from '../../enterprise/entities/student.entity.ts'
import type { StudentTrailsRepository } from '../repositories/student-trails-repository.ts'
import type { StudentsRepository } from '../repositories/students-repository.ts'
import type { TrailsRepository } from '../repositories/trails-repository.ts'

interface UpdateProfileUseCaseRequest {
  studentId: string
  name?: string
  about?: string
  semester?: number
  profileUrl?: string
  trailsIds?: string[]
}

type UpdateProfileUseCaseResponse = Either<
  InvalidCredentialsError | ResourceNotFoundError | ResourceAlreadyExistsError,
  Student
>

export class UpdateProfileUseCase {
  constructor(
    private readonly studentRepository: StudentsRepository,
    private readonly trailsRepository: TrailsRepository,
    private readonly studentTrailsRepository: StudentTrailsRepository,
  ) {}

  async execute({
    studentId,
    name,
    about,
    semester,
    profileUrl,
    trailsIds,
  }: UpdateProfileUseCaseRequest): Promise<UpdateProfileUseCaseResponse> {
    const student = await this.studentRepository.findById(studentId)

    if (!student) {
      return left(new ResourceNotFoundError('Student not found.'))
    }

    if (trailsIds) {
      for (const trailId of trailsIds) {
        const trail = await this.trailsRepository.findById(trailId)

        if (!trail) {
          return left(new ResourceNotFoundError('Trail not found.'))
        }
      }
    }

    const currentTrails =
      await this.studentTrailsRepository.findManyByStudentId(studentId)

    const studentTrailsList = new StudentTrailList(currentTrails)

    if (trailsIds) {
      const studentTrails = trailsIds?.map(trailId =>
        StudentTrail.create({
          studentId: student.id,
          trailId: new UniqueEntityID(trailId),
        }),
      )

      studentTrailsList.update(studentTrails)
    }

    student.name = name ?? student.name
    student.about = about ?? student.about
    student.semester = semester ?? student.semester
    student.profileUrl = profileUrl ?? student.profileUrl
    student.trails = studentTrailsList

    await this.studentRepository.save(student)

    return right(student)
  }
}
