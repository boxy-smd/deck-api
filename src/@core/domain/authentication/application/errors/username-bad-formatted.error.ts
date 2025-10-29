interface UsernameBadFormattedErrorProps {
  message: string
  statusCode: number
}

export class UsernameBadFormattedError extends Error {
  private props: UsernameBadFormattedErrorProps

  constructor(message = 'Nome de usuário inválido.', statusCode = 400) {
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
