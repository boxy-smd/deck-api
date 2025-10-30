interface SemesterOutOfBoundsErrorProps {
  message: string
  statusCode: number
}

export class SemesterOutOfBoundsError extends Error {
  private props: SemesterOutOfBoundsErrorProps

  constructor(
    message = 'O semestre deve ser um número entre 1 e 12.',
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
