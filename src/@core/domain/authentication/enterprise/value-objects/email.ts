import { type Either, left, right } from '@/@shared/kernel/either'
import { ValueObject } from '@/@shared/kernel/kernel/value-object'
import { EmailBadFormattedError } from '../../application/errors/email-bad-formatted.error'

interface EmailProps {
  value: string
}

export class Email extends ValueObject<EmailProps> {
  private static readonly EMAIL_REGEX =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  private static readonly INSTITUTION_REGEX = /@alu\.ufc\.br$/

  get value(): string {
    return this.props.value
  }

  private static isValidFormat(email: string): boolean {
    return Email.EMAIL_REGEX.test(email)
  }

  private static isInstitutional(email: string): boolean {
    return Email.INSTITUTION_REGEX.test(email)
  }

  public static create(email: string): Either<EmailBadFormattedError, Email> {
    if (!Email.isValidFormat(email)) {
      return left(new EmailBadFormattedError('O e-mail é inválido.'))
    }

    if (!Email.isInstitutional(email)) {
      return left(
        new EmailBadFormattedError('O e-mail deve ser institucional.'),
      )
    }

    return right(new Email({ value: email }))
  }
}
