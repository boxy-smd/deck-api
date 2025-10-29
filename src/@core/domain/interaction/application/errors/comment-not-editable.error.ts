export class CommentNotEditableError extends Error {
  constructor() {
    super('Este comentário não pode ser editado.')
    this.name = 'CommentNotEditableError'
  }

  get statusCode() {
    return 403
  }
}
