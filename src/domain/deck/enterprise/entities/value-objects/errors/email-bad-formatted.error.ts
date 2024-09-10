interface EmailBadFormattedErrorProps {
  message: string
  statusCode: number
}

export class EmailBadFormattedError extends Error {
  private props: EmailBadFormattedErrorProps

  constructor(message = 'Email bad formatted.', statusCode = 400) {
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
