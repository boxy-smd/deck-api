import { type Either, left, right } from '@/core/either.ts'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.ts'
import type { Comment } from '../../enterprise/entities/comment.ts'
import type { CommentsRepository } from '../repositories/comments-repository.ts'
import type { ProjectsRepository } from '../repositories/projects-repository.ts'
import type { StudentsRepository } from '../repositories/students-repository.ts'

interface EditCommentUseCaseRequest {
  content: string
  authorId: string
  projectId: string
  commentId: string
}

type EditCommentUseCaseResponse = Either<ResourceNotFoundError, Comment>

export class EditCommentUseCase {
  constructor(
    private readonly projectRepository: ProjectsRepository,
    private readonly studentRepository: StudentsRepository,
    private readonly commentsRepository: CommentsRepository,
  ) {}

  async execute({
    content,
    commentId,
    authorId,
    projectId,
  }: EditCommentUseCaseRequest): Promise<EditCommentUseCaseResponse> {
    const project = await this.projectRepository.findById(projectId)

    if (!project) {
      return left(new ResourceNotFoundError('Project not found.'))
    }

    const author = await this.studentRepository.findById(authorId)

    if (!author) {
      return left(new ResourceNotFoundError('Author not found.'))
    }

    const comment = await this.commentsRepository.findById(commentId)

    if (!comment) {
      return left(new ResourceNotFoundError('Comment not found.'))
    }

    comment.content = content

    await this.commentsRepository.save(comment)

    return right(comment)
  }
}
