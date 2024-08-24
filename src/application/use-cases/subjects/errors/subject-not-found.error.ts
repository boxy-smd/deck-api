interface SubjectNotFoundErrorProps {
  message: string
  statusCode: number
}

export class SubjectNotFoundError extends Error {
  private props: SubjectNotFoundErrorProps

  constructor(message = 'Subject not found.', statusCode = 404) {
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
