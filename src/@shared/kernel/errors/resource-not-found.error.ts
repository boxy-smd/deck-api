interface ResourceNotFoundErrorProps {
  message: string
  statusCode: number
}

export class ResourceNotFoundError extends Error {
  private props: ResourceNotFoundErrorProps

  constructor(message = 'Recurso não encontrado.', statusCode = 404) {
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
