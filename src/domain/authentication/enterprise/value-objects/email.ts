import { ValueObject } from '@/shared/kernel/value-object.ts'
import { EmailBadFormattedError } from '../../application/errors/email-bad-formatted.error.ts'

interface EmailProps {
  value: string
}

export class Email extends ValueObject<EmailProps> {
  get value() {
    return this.props.value
  }

  public static validate(email: string) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    const institutionEmailRegex = /@alu.ufc.br$/

    return [!emailRegex.test(email), !institutionEmailRegex.test(email)]
  }

  public static create(email: string) {
    const [isEmailBadFormatted, isNotInstitutionEmail] = Email.validate(email)

    if (isEmailBadFormatted)
      throw new EmailBadFormattedError('O e-mail é inválido.')

    if (isNotInstitutionEmail)
      throw new EmailBadFormattedError('O e-mail deve ser institucional.')

    return new Email({ value: email })
  }
}
