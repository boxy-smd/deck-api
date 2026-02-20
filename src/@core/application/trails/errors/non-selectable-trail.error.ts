interface NonSelectableTrailErrorProps {
  message: string
  statusCode: number
}

export class NonSelectableTrailError extends Error {
  private props: NonSelectableTrailErrorProps

  constructor(
    message = 'A trilha SMD e composta e nao pode ser selecionada diretamente.',
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
