import type { Post } from '@/@core/domain/projects/enterprise/entities/project'
import type { ProjectsRepository } from '../repositories/projects-repository'

type FetchPostsUseCaseResponse = Post[]

export class FetchPostsUseCase {
  constructor(private projectsRepository: ProjectsRepository) {}

  async execute(): Promise<FetchPostsUseCaseResponse> {
    return await this.projectsRepository.findAllPosts()
  }
}
