import { Module } from '@nestjs/common'
import { EmailService } from '@/@core/application/services/email-service'
import { ConsoleEmailService } from './email/console-email-service'

@Module({
  providers: [
    {
      provide: EmailService,
      useClass: ConsoleEmailService,
    },
  ],
  exports: [EmailService],
})
export class ServicesModule {}
