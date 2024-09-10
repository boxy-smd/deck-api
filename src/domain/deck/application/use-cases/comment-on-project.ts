import { type Either, left, right } from '@/core/either.ts'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.ts'
import { Comment } from '../../enterprise/entities/comment.ts'
import type { CommentsRepository } from '../repositories/comments-repository.ts'
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
    private readonly commentsRepository: CommentsRepository,
    private readonly projectsRepository: ProjectsRepository,
    private readonly subjectsRepository: StudentsRepository,
  ) {}

  async execute(
    request: CommentOnProjectUseCaseRequest,
  ): Promise<CommentOnProjectUseCaseResponse> {
    const project = await this.projectsRepository.findById(request.projectId)

    if (!project) {
      return left(new ResourceNotFoundError('Project not found.'))
    }

    const author = await this.subjectsRepository.findById(request.authorId)

    if (!author) {
      return left(new ResourceNotFoundError('Author not found.'))
    }

    const comment = Comment.create({
      content: request.content,
      authorId: author.id,
      projectId: project.id,
    })

    await this.commentsRepository.create(comment)

    return right({
      commentId: comment.id.toString(),
    })
  }
}
