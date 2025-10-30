import type { Trail } from '@/@core/domain/projects/enterprise/entities/trail'

export class TrailPresenter {
  static toHTTP(trail: Trail) {
    return {
      id: trail.id.toString(),
      name: trail.name,
    }
  }
}
