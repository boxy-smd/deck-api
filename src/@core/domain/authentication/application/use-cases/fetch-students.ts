import { Injectable } from '@nestjs/common'
import type { User } from '../../enterprise/entities/user'
import type { UsersRepository } from '../repositories/users-repository'

interface FetchStudentsUseCaseRequest {
  name?: string
}

type FetchStudentsUseCaseResponse = User[]

@Injectable()
export class FetchStudentsUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    name,
  }: FetchStudentsUseCaseRequest): Promise<FetchStudentsUseCaseResponse> {
    if (name) {
      return (await this.usersRepository.findManyByName(name)).filter(
        user => user.profile,
      )
    }

    return (await this.usersRepository.findAll()).filter(user => user.profile)
  }
}
