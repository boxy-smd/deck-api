export interface SendEmailParams {
  to: string
  subject: string
  body: string
}

export abstract class EmailService {
  abstract send(params: SendEmailParams): Promise<void>
}
