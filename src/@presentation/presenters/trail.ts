import type { Trail } from '@/@core/domain/projects/enterprise/entities/trail'

// biome-ignore lint/complexity/noStaticOnlyClass: This class is a presenter and should be static
export class TrailPresenter {
  static toHTTP(trail: Trail) {
    return {
      id: trail.id.toString(),
      name: trail.name,
    }
  }
}
