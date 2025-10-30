import type { Trail } from '@/@core/domain/projects/entities/trail'
import type { UserRole } from '@/@core/domain/users/value-objects/user-role'
import type { UserStatus } from '@/@core/domain/users/value-objects/user-status'
import type { User } from '../../../domain/users/entities/user'

export interface UserDTO {
  id: string
  name: string
  username: string
  email: string
  about: string | null
  profileUrl: string | null
  semester: number
  trails: string[]
  role: UserRole
  status: UserStatus
}

export class UserDTOMapper {
  static toDTO(user: User, trails?: Trail[]): UserDTO {
    return {
      id: user.id.toString(),
      name: user.name,
      username: user.username.value,
      email: user.email.value,
      about: user.about,
      profileUrl: user.profileUrl,
      semester: user.profile.semester.value,
      trails: trails?.map(trail => trail.id.toString()) || [],
      role: user.role,
      status: user.status,
    }
  }
}
