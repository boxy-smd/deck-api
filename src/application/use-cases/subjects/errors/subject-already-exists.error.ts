interface SubjectAlreadyExistsErrorProps {
  message: string
  statusCode: number
}

export class SubjectAlreadyExistsError extends Error {
  private props: SubjectAlreadyExistsErrorProps

  constructor(message = 'Subject already exists.', statusCode = 409) {
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
