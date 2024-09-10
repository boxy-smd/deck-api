import type { Trail } from '@/domain/deck/enterprise/entities/trail.ts'

// biome-ignore lint/complexity/noStaticOnlyClass: This class is a presenter and should be static
export class TrailPresenter {
  static toHTTP(trail: Trail) {
    return {
      id: trail.id.toString(),
      name: trail.name,
    }
  }
}
