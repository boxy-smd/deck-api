import { Injectable } from '@nestjs/common'
import { TrailsRepository } from '../../projects/repositories/trails-repository'
import {
  type UserSummaryDTO,
  UserSummaryDTOMapper,
} from '../dtos/user.summary.dto'
import { UsersRepository } from '../repositories/users-repository'

interface FetchUsersUseCaseRequest {
  name?: string
}

type FetchUsersUseCaseResponse = UserSummaryDTO[]

@Injectable()
export class FetchUsersUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly trailsRepository: TrailsRepository,
  ) {}

  async execute({
    name,
  }: FetchUsersUseCaseRequest): Promise<FetchUsersUseCaseResponse> {
    const users = name
      ? await this.usersRepository.findManyByName(name)
      : await this.usersRepository.findAll()

    const usersSummaries: UserSummaryDTO[] = []

    for (const user of users) {
      if (!user.profile) {
        continue
      }

      const trails = []

      for (const trailId of user.profile.trailsIds) {
        const trail = await this.trailsRepository.findById(trailId.toString())

        if (trail) {
          trails.push(trail)
        }
      }

      const userSummary = UserSummaryDTOMapper.toDTO(user, trails)

      usersSummaries.push(userSummary)
    }

    return usersSummaries
  }
}
