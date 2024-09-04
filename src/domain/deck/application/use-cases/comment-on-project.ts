import { type Either, left, right } from '@/core/either.ts'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.ts'
import { ProjectComment } from '../../enterprise/entities/project-comment.ts'
import type { ProjectCommentsRepository } from '../repositories/project-comments-repository.ts'
import type { ProjectsRepository } from '../repositories/projects-repository.ts'
import type { StudentsRepository } from '../repositories/students-repository.ts'

interface CommentOnProjectUseCaseRequest {
  content: string
  authorId: string
  projectId: string
}

type CommentOnProjectUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    commentId: string
  }
>

export class CommentOnProjectUseCase {
  constructor(
    private readonly projectRepository: ProjectsRepository,
    private readonly studentRepository: StudentsRepository,
    private readonly projectCommentRepository: ProjectCommentsRepository,
  ) {}

  async execute(
    request: CommentOnProjectUseCaseRequest,
  ): Promise<CommentOnProjectUseCaseResponse> {
    const project = await this.projectRepository.findById(request.projectId)

    if (!project) {
      return left(new ResourceNotFoundError('Project not found.'))
    }

    const author = await this.studentRepository.findById(request.authorId)

    if (!author) {
      return left(new ResourceNotFoundError('Author not found.'))
    }

    const comment = ProjectComment.create({
      content: request.content,
      authorId: author.id,
      projectId: project.id,
    })

    await this.projectCommentRepository.create(comment)

    return right({
      commentId: comment.id.toString(),
    })
  }
}
