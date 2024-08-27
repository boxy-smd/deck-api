interface TrailNotFoundErrorProps {
  message: string
  statusCode: number
}

export class TrailNotFoundError extends Error {
  private props: TrailNotFoundErrorProps

  constructor(message = 'Trail not found.', statusCode = 404) {
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
