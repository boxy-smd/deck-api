interface ProjectNotFoundErrorProps {
  message: string
  statusCode: number
}

export class ProjectNotFoundError extends Error {
  private props: ProjectNotFoundErrorProps

  constructor(message = 'Project not found.', statusCode = 404) {
    super(message)

    this.props = {
      message,
      statusCode,
    }
  }

  get message(): string {
    return this.props.message
  }

  get statusCode(): number {
    return this.props.statusCode
  }
}
