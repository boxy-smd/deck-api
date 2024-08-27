import type { ProfessorsRepository } from '@/application/repositories/professors-repository.ts'
import { type Either, left, right } from '@/domain/core/logic/either.ts'
import { Professor } from '@/domain/entities/professor.entity.ts'
import { InvalidCredentialsError } from '../errors/invalid-credentials.error.ts'

interface CreateProfessorUseCaseRequest {
  name: string
}

type CreateProfessorUseCaseResponse = Either<InvalidCredentialsError, Professor>

export class CreateProfessorUseCase {
  constructor(private professorsRepository: ProfessorsRepository) {}

  async execute({
    name,
  }: CreateProfessorUseCaseRequest): Promise<CreateProfessorUseCaseResponse> {
    const isNameEmpty = !name

    if (isNameEmpty) {
      return left(new InvalidCredentialsError())
    }

    const professor = Professor.create({
      name,
    })

    await this.professorsRepository.create(professor)

    return right(professor)
  }
}
