import { EmailBadFormattedError } from './errors/email-bad-formatted.error.ts'

import { ValueObject } from '../core/interfaces/value-object.ts'
import { type Either, left, right } from '../core/logic/either.ts'

interface EmailProps {
  value: string
}

export class Email extends ValueObject<EmailProps> {
  get value(): string {
    return this.props.value
  }

  protected constructor(props: EmailProps) {
    super(props)
  }

  static validate(email: string): boolean[] {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    const institutionEmailRegex = /@alu.ufc.br$/

    return [!emailRegex.test(email), !institutionEmailRegex.test(email)]
  }

  static create(email: string): Either<EmailBadFormattedError, Email> {
    const [isEmailBadFormatted, isNotInstitutionEmail] = Email.validate(email)

    if (isEmailBadFormatted)
      return left(new EmailBadFormattedError('Email bad formatted.'))

    if (isNotInstitutionEmail)
      return left(new EmailBadFormattedError('Email must be from UFC.'))

    return right(new Email({ value: email }))
  }
}
