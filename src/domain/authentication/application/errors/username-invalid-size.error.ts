interface UsernameInvalidSizeErrorProps {
  message: string
  statusCode: number
}

export class UsernameInvalidSizeError extends Error {
  private props: UsernameInvalidSizeErrorProps

  constructor(
    message = 'Nome de usuário deve ter entre 3 e 20 caracteres.',
    statusCode = 400,
  ) {
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
