export class ProjectNotEditableError extends Error {
  constructor() {
    super('Este projeto não pode ser editado.')
    this.name = 'ProjectNotEditableError'
  }

  get statusCode() {
    return 403
  }
}
