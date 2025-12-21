import { Injectable } from '@nestjs/common'
import {
  EmailService,
  SendEmailParams,
} from '@/@core/application/services/email-service'

@Injectable()
export class ConsoleEmailService implements EmailService {
  send({ to, subject, body }: SendEmailParams): Promise<void> {
    console.log('--- EMAIL SENT ---')
    console.log(`To: ${to}`)
    console.log(`Subject: ${subject}`)
    console.log(`Body: ${body}`)
    console.log('------------------')
    return Promise.resolve()
  }
}
