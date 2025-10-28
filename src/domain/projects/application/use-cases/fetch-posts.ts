import type { Post } from '@/domain/projects/enterprise/entities/project.ts'
import type { ProjectsRepository } from '../repositories/projects-repository.ts'

type FetchPostsUseCaseResponse = Post[]

export class FetchPostsUseCase {
  constructor(private projectsRepository: ProjectsRepository) {}

  async execute(): Promise<FetchPostsUseCaseResponse> {
    return await this.projectsRepository.findAllPosts()
  }
}
