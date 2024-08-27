interface ProfessorNotFoundErrorProps {
  message: string
  statusCode: number
}

export class ProfessorNotFoundError extends Error {
  private props: ProfessorNotFoundErrorProps

  constructor(message = 'Professor not found.', statusCode = 404) {
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
