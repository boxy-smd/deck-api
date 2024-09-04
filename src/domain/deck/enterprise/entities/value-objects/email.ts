import { type Either, left, right } from '@/core/either.ts'
import { EmailBadFormattedError } from './errors/email-bad-formatted.error.ts'

interface EmailProps {
  value: string
}

export class Email {
  private props: EmailProps

  get value() {
    return this.props.value
  }

  set value(email: string) {
    this.value = email
  }

  protected constructor(props: EmailProps) {
    this.props = props
  }

  static validate(email: string) {
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
