interface ResourceAlreadyExistsErrorProps {
  message: string
  statusCode: number
}

export class ResourceAlreadyExistsError extends Error {
  private props: ResourceAlreadyExistsErrorProps

  constructor(message = 'Resource already exists.', statusCode = 409) {
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
