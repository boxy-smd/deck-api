interface UserAlreadyExistsErrorProps {
  message: string
  statusCode: number
}

export class UserAlreadyExistsError extends Error {
  private props: UserAlreadyExistsErrorProps

  constructor(message = 'User already exists.', statusCode = 409) {
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
