import type { Trail } from '@/@core/domain/projects/entities/trail'
import type { UserRole } from '@/@core/domain/users/value-objects/user-role'
import type { User } from '../../../domain/users/entities/user'

export interface UserSummaryDTO {
  id: string
  name: string
  username: string
  about: string | null
  profileUrl: string | null
  semester: number
  trails: string[]
  role: UserRole
}

export class UserSummaryDTOMapper {
  static toDTO(user: User, trails?: Trail[]): UserSummaryDTO {
    return {
      id: user.id.toString(),
      name: user.name,
      username: user.username.value,
      about: user.about,
      profileUrl: user.profileUrl,
      semester: user.profile.semester.value,
      trails: trails?.map(trail => trail.id.toString()) || [],
      role: user.role,
    }
  }
}
