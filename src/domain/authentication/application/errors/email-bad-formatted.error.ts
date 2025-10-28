interface EmailBadFormattedErrorProps {
  message: string
  statusCode: number
}

export class EmailBadFormattedError extends Error {
  private props: EmailBadFormattedErrorProps

  constructor(message = 'E-mail inválido.', statusCode = 400) {
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
