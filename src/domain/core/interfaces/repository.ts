export interface Repository<T, U> {
  create(entity: T): Promise<T>
  findById(id: string): Promise<T | null>
  update(id: string, request: U): Promise<T | null>
  delete(id: string): Promise<void>
}
