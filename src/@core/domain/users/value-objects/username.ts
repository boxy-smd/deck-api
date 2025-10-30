import { type Either, left, right } from '@/@shared/kernel/either'
import { ValueObject } from '@/@shared/kernel/kernel/value-object'
import { UsernameBadFormattedError } from '../../../application/users/errors/username-bad-formatted.error'
import { UsernameInvalidSizeError } from '../../../application/users/errors/username-invalid-size.error'

interface UsernameProps {
  value: string
}

export class Username extends ValueObject<UsernameProps> {
  get value() {
    return this.props.value
  }

  public static validate(username: string) {
    const MIN_LENGTH = 3
    const MAX_LENGTH = 20
    const regex = /^[a-zA-Z0-9._-]{3,20}$/ // Alphanumeric, underscore, hyphen, and dot

    const isTooShort = username.length < MIN_LENGTH
    const isTooLong = username.length > MAX_LENGTH
    const isBadFormatted = !regex.test(username)

    return [isBadFormatted, isTooShort, isTooLong]
  }

  public static create(
    username: string,
  ): Either<UsernameBadFormattedError | UsernameInvalidSizeError, Username> {
    const [isBadFormatted, isTooShort, isTooLong] = Username.validate(username)

    if (isBadFormatted) {
      return left(
        new UsernameBadFormattedError(
          'O nome de usuário deve conter apenas letras, números, sublinhados, hifens e pontos.',
        ),
      )
    }

    if (isTooShort) {
      return left(
        new UsernameInvalidSizeError(
          'O nome de usuário deve ter pelo menos 3 caracteres.',
        ),
      )
    }

    if (isTooLong) {
      return left(
        new UsernameInvalidSizeError(
          'O nome de usuário deve ter no máximo 20 caracteres.',
        ),
      )
    }

    return right(new Username({ value: username }))
  }
}
