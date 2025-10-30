import type { Trail } from '@/@core/domain/projects/entities/trail'

export class TrailPresenter {
  static toHTTP(trail: Trail) {
    return {
      id: trail.id.toString(),
      name: trail.name,
    }
  }
}
