import { EmailService } from '@/@core/application/services/email-service'
import { Module } from '@nestjs/common'
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
