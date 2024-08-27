import type { GetProfessorByIdUseCaseResponse } from '@/application/dtos/professors/get-by-id-dtos.ts'
import type { ProfessorsRepository } from '@/application/repositories/professors-repository.ts'
import { left, right } from '@/domain/core/logic/either.ts'
import { ProfessorNotFoundError } from './errors/professor-not-found.error.ts'

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
