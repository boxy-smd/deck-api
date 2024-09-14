interface ForbiddenErrorProps {
  message: string
  statusCode: number
}

export class ForbiddenError extends Error {
  private props: ForbiddenErrorProps

  constructor(message = 'Forbidden.', statusCode = 403) {
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
