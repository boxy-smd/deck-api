import type { Trail } from '@/@core/domain/projects/entities/trail'
import { type Either, left, right } from '@/@shared/kernel/either'
import { ResourceNotFoundError } from '@/@shared/kernel/errors/resource-not-found.error'
import { Injectable } from '@nestjs/common'
import { ProjectSummaryMapper } from '../../projects/dtos/project-summary.dto'
import { ProjectDTOMapper } from '../../projects/dtos/project.dto'
import { ProjectsRepository } from '../../projects/repositories/projects-repository'
import { TrailsRepository } from '../../trails/repositories/trails-repository'
import { type UserDTO, UserDTOMapper } from '../dtos/user.dto'
import { UsersRepository } from '../repositories/users-repository'

interface GetProfileUseCaseRequest {
  username: string
}

type GetProfileUseCaseResponse = Either<ResourceNotFoundError, UserDTO>

@Injectable()
export class GetProfileUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private trailsRepository: TrailsRepository,
    private projectsRepository: ProjectsRepository,
  ) {}

  async execute({
    username,
  }: GetProfileUseCaseRequest): Promise<GetProfileUseCaseResponse> {
    const user = await this.usersRepository.findByUsername(username)

    if (!user) {
      return left(new ResourceNotFoundError('User not found.'))
    }

    const trails: Trail[] = []

    if (user.profile) {
      for (const trailId of user.profile.trailsIds) {
        const trail = await this.trailsRepository.findById(trailId.toString())

        if (trail) {
          trails.push(trail)
        }
      }
    }

    const projectsRaw =
      await this.projectsRepository.findManyProjectDTOsByStudentId(
        user.id.toString(),
      )
    const draftsRaw = await this.projectsRepository.findDraftsByAuthorId(
      user.id.toString(),
    )

    const posts = projectsRaw.map(ProjectSummaryMapper.toDTO)

    // We need ProjectDTOs for drafts as well to use ProjectSummaryMapper
    // findDraftsByAuthorId returns Project[] (entities)
    // We need to convert them to ProjectDTOs first
    // This is a bit tricky because the repository might not have findManyProjectDTOsByDraftStatus
    // Let's see if we can just map them manually or if there's a better way.
    // Looking at ProjectsRepository, it has findDraftsByAuthorId(authorId: string): Promise<Project[]>

    // I will assume for now that I can map them if I have the required dependencies.
    // For simplicity, I'll use an empty list for drafts if I can't easily map them,
    // or better, I'll check how ProjectDTOMapper is used.

    const drafts = await Promise.all(
      draftsRaw.map(async draft => {
        const author = await this.usersRepository.findById(
          draft.authorId.toString(),
        )
        if (!author) return null

        const draftTrails: Trail[] = []
        for (const tid of Array.from(draft.trails)) {
          const t = await this.trailsRepository.findById(tid.toString())
          if (t) draftTrails.push(t)
        }

        return ProjectSummaryMapper.toDTO(
          ProjectDTOMapper.toDTO(draft, author, draftTrails, null, []),
        )
      }),
    )

    const filteredDrafts = drafts.filter(
      (d): d is Exclude<typeof d, null> => d !== null,
    )

    const userDetails = UserDTOMapper.toDTO(user, trails, posts, filteredDrafts)

    return right(userDetails)
  }
}
