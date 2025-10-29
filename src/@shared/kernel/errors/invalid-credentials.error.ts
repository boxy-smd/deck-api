interface InvalidCredentialsErrorProps {
  message: string
  statusCode: number
}

export class InvalidCredentialsError extends Error {
  private props: InvalidCredentialsErrorProps

  constructor(message = 'Credenciais inválidas.', statusCode = 400) {
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
