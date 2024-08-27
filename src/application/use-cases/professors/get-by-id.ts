import type { ProfessorsRepository } from '@/application/repositories/professors-repository.ts'
import { type Either, left, right } from '@/domain/core/logic/either.ts'
import type { Professor } from '@/domain/entities/professor.entity.ts'
import { ProfessorNotFoundError } from './errors/professor-not-found.error.ts'

type GetProfessorByIdUseCaseResponse = Either<ProfessorNotFoundError, Professor>

export class GetProfessorByIdUseCase {
  constructor(private professorsRepository: ProfessorsRepository) {}

  async execute(id: string): Promise<GetProfessorByIdUseCaseResponse> {
    const professor = await this.professorsRepository.findById(id)
    const isProfessorNotFound = !professor

    if (isProfessorNotFound) {
      return left(new ProfessorNotFoundError())
    }

    return right(professor)
  }
}
