import { type Either, left, right } from '@/core/either.ts'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.ts'
import { ProjectDetails } from '../../enterprise/entities/value-objects/project-details.ts'
import type { ProjectsRepository } from '../repositories/projects-repository.ts'

interface GetProjectUseCaseRequest {
  projectId: string
}

type GetProjectUseCaseResponse = Either<ResourceNotFoundError, ProjectDetails>

export class GetProjectUseCase {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async execute({
    projectId,
  }: GetProjectUseCaseRequest): Promise<GetProjectUseCaseResponse> {
    const project = await this.projectsRepository.findDetailsById(projectId)

    if (!project) {
      return left(new ResourceNotFoundError('Project not found.'))
    }
    return right(
      ProjectDetails.create({
        id: project.id,
        title: project.title,
        description: project.description,
        bannerUrl: project.bannerUrl,
        content: project.content,
        publishedYear: project.publishedYear,
        status: project.status,
        semester: project.semester,
        allowComments: project.allowComments,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt || undefined,
        authorId: project.authorId,
        author: {
          name: project.author.name,
          username: project.author.username,
          profileUrl: project.author.profileUrl,
        },
        subjectId: project.subjectId || undefined,
        subject: project.subject || undefined,
        trails: project.trails,
        professors: project.professors,
      }),
    )
  }
}
