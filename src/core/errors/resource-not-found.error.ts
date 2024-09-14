interface ResourceNotFoundErrorProps {
  message: string
  statusCode: number
}

export class ResourceNotFoundError extends Error {
  private props: ResourceNotFoundErrorProps

  constructor(message = 'Resource not found.', statusCode = 404) {
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
