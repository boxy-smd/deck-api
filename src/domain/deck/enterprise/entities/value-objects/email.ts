import { ValueObject } from '@/core/entities/value-object.ts'
import { EmailBadFormattedError } from './errors/email-bad-formatted.error.ts'

interface EmailProps {
  value: string
}

export class Email extends ValueObject<EmailProps> {
  get value() {
    return this.props.value
  }

  static validate(email: string) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    const institutionEmailRegex = /@alu.ufc.br$/

    return [!emailRegex.test(email), !institutionEmailRegex.test(email)]
  }

  static create(email: string) {
    const [isEmailBadFormatted, isNotInstitutionEmail] = Email.validate(email)

    if (isEmailBadFormatted)
      throw new EmailBadFormattedError('Email bad formatted.')

    if (isNotInstitutionEmail)
      throw new EmailBadFormattedError('Email must be from UFC.')

    return new Email({ value: email })
  }
}
