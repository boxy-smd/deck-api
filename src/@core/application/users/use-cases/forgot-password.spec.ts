import { EmailService } from '@/@core/application/services/email-service'
import { ForgotPasswordUseCase } from '@/@core/application/users/use-cases/forgot-password'
import { ResourceNotFoundError } from '@/@shared/kernel/errors/resource-not-found.error'
import { makeUser } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/users-repository'

class FakeEmailService implements EmailService {
  // biome-ignore lint/suspicious/noExplicitAny: This is a test file
  public sentEmails: any[] = []

  async send(params: {
    to: string
    subject: string
    body: string
  }): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100))
    this.sentEmails.push(params)
  }
}

let usersRepository: InMemoryUsersRepository
let emailService: FakeEmailService
let sut: ForgotPasswordUseCase

describe('ForgotPasswordUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    emailService = new FakeEmailService()
    sut = new ForgotPasswordUseCase(usersRepository, emailService)
  })

  it('should be able to generate a password reset token', async () => {
    const user = await makeUser()
    await usersRepository.create(user)

    const result = await sut.execute({
      email: user.email.value,
    })

    expect(result.isRight()).toBe(true)
    expect(user.passwordResetToken).toEqual(expect.any(String))
    expect(user.passwordResetExpires).toEqual(expect.any(Date))
    expect(emailService.sentEmails).toHaveLength(1)
    expect(emailService.sentEmails[0].to).toEqual(user.email.value)
  })

  it('should not be able to generate a password reset token with invalid email', async () => {
    const result = await sut.execute({
      email: 'invalid-email@example.com',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
