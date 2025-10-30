import type { UsersRepository } from '@/@core/application/users/repositories/users-repository'
import type { User } from '@/@core/domain/users/entities/user'

export class InMemoryUsersRepository implements UsersRepository {
  private items: User[] = []

  findByEmail(email: string): Promise<User | null> {
    return Promise.resolve(
      this.items.find(item => item.props.email.value === email) || null,
    )
  }

  findByUsername(username: string): Promise<User | null> {
    return Promise.resolve(
      this.items.find(item => item.props.username.value === username) || null,
    )
  }

  findManyByName(name: string): Promise<User[]> {
    return Promise.resolve(
      this.items.filter(item => {
        if (item.name.toLowerCase().includes(name.toLowerCase())) {
          return true
        }

        if (item.username.value.toLowerCase().includes(name.toLowerCase())) {
          return true
        }

        return false
      }),
    )
  }

  findById(id: string): Promise<User | null> {
    return Promise.resolve(
      this.items.find(item => item.id.toString() === id) || null,
    )
  }

  findAll(): Promise<User[]> {
    return Promise.resolve(this.items)
  }

  create(entity: User): Promise<void> {
    this.items.push(entity)
    return Promise.resolve()
  }

  save(entity: User): Promise<void> {
    const index = this.items.findIndex(item => item.id === entity.id)

    if (index !== -1) {
      this.items[index] = entity
    }

    return Promise.resolve()
  }

  delete(entity: User): Promise<void> {
    const index = this.items.findIndex(item => item.id === entity.id)

    if (index !== -1) {
      this.items.splice(index, 1)
    }

    return Promise.resolve()
  }

  deleteById(id: string): Promise<void> {
    const index = this.items.findIndex(item => item.id.toString() === id)

    if (index !== -1) {
      this.items.splice(index, 1)
    }

    return Promise.resolve()
  }

  existsById(id: string): Promise<boolean> {
    return Promise.resolve(this.items.some(item => item.id.toString() === id))
  }
}
