import type {
  UpdateProfessorUseCaseRequest,
  UpdateProfessorUseCaseResponse,
} from '@/application/dtos/professors/update-dtos.ts'
import type { ProfessorsRepository } from '@/application/repositories/professors-repository.ts'
import { left, right } from '@/domain/core/logic/either.ts'
import { InvalidCredentialsError } from '../errors/invalid-credentials.error.ts'
import { ProfessorNotFoundError } from './errors/professor-not-found.error.ts'

export class UpdateProfessorUseCase {
  constructor(private professorsRepository: ProfessorsRepository) {}

  async execute({
    id,
    name,
  }: UpdateProfessorUseCaseRequest): Promise<UpdateProfessorUseCaseResponse> {
    const isNameEmpty = !name

    if (isNameEmpty) {
      return left(new InvalidCredentialsError())
    }

    const professorNotExists = !(await this.professorsRepository.findById(id))

    if (professorNotExists) {
      return left(new ProfessorNotFoundError())
    }

    const professor = await this.professorsRepository.update(id, {
      name,
    })
    const isProfessorNotFound = !professor

    if (isProfessorNotFound) {
      return left(new ProfessorNotFoundError())
    }

    return right(professor)
  }
}
