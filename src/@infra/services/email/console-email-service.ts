import {
  EmailService,
  SendEmailParams,
} from '@/@core/application/services/email-service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ConsoleEmailService implements EmailService {
  async send({ to, subject, body }: SendEmailParams): Promise<void> {
    console.log('--- EMAIL SENT ---')
    console.log(`To: ${to}`)
    console.log(`Subject: ${subject}`)
    console.log(`Body: ${body}`)
    console.log('------------------')
  }
}
