import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

export class PrismaErrorHandler {
  static handle(error: unknown): Error {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          return new Error('Record already exists with unique constraint')
        case 'P2025':
          return new Error('Record not found')
        case 'P2003':
          return new Error('Foreign key constraint failed')
        case 'P2021':
          return new Error('Table does not exist')
        case 'P2024':
          return new Error('Connection timeout')
        default:
          return new Error(`Database error: ${error.message}`)
      }
    }

    if (error instanceof Error) {
      return error
    }

    return new Error('Unknown database error')
  }

  static async execute<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation()
    } catch (error) {
      throw this.handle(error)
    }
  }
}
