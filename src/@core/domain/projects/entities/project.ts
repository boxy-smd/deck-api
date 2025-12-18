import type { StudentProfile } from '@/@core/domain/users/entities/student-profile'
import { AggregateRoot } from '@/@shared/kernel/kernel/aggregate-root'
import type { UniqueEntityID } from '@/@shared/kernel/kernel/unique-entity-id'
import type { Optional } from '@/@shared/kernel/types/optional'
import { Comment } from '../../interactions/entities/comment'
import { ProjectStatus } from '../value-objects/project-status'
import type { Professor } from './professor'
import type { Subject } from './subject'
import type { Trail } from './trail'

export interface ProjectProps {
  title: string
  description?: string
  bannerUrl?: string
  content?: string
  publishedYear?: number
  status: ProjectStatus
  semester?: number
  allowComments: boolean

  authorId: UniqueEntityID<StudentProfile>
  subjectId?: UniqueEntityID<Subject>
  trails: Set<UniqueEntityID<Trail>>
  professors: Set<UniqueEntityID<Professor>>
  comments: Set<Comment>
}

export class Project extends AggregateRoot<ProjectProps> {
  // --- 1. Factory methods ---
  static create(
    props: Optional<ProjectProps, 'trails' | 'professors' | 'comments'>,
    id?: UniqueEntityID,
  ): Project {
    return new Project(
      {
        ...props,
        trails: props.trails ?? new Set<UniqueEntityID<Trail>>(),
        professors: props.professors ?? new Set<UniqueEntityID<Professor>>(),
        comments: props.comments ?? new Set<Comment>(),
      },
      id,
    )
  }

  static reconstitute(
    props: ProjectProps,
    id: UniqueEntityID,
    createdAt: Date,
    updatedAt: Date,
  ): Project {
    return new Project(props, id, createdAt, updatedAt)
  }

  // -- 2. Public methods ---
  public addToDrafts() {
    this.props.status = ProjectStatus.DRAFT
    this.touch()
  }

  public post() {
    this.props.status = ProjectStatus.PUBLISHED
    this.touch()
  }

  public archive() {
    this.props.status = ProjectStatus.ARCHIVED
    this.touch()
  }

  public unarchive() {
    this.props.status = ProjectStatus.PUBLISHED
    this.touch()
  }

  public editInfo({
    title,
    description,
    bannerUrl,
    content,
    publishedYear,
    semester,
    allowComments,
    subjectId,
  }: Partial<
    Pick<
      ProjectProps,
      | 'title'
      | 'description'
      | 'bannerUrl'
      | 'content'
      | 'publishedYear'
      | 'semester'
      | 'allowComments'
      | 'subjectId'
    >
  >) {
    if (title) {
      this.props.title = title
    }

    if (description) {
      this.props.description = description
    }

    if (bannerUrl) {
      this.props.bannerUrl = bannerUrl
    }

    if (content) {
      this.props.content = content
    }

    if (publishedYear) {
      this.props.publishedYear = publishedYear
    }

    if (semester) {
      this.props.semester = semester
    }

    if (allowComments) {
      this.props.allowComments = allowComments
    }

    if (subjectId) {
      this.props.subjectId = subjectId
    }

    this.touch()
  }

  public defineTrails(trails: UniqueEntityID<Trail>[]) {
    this.props.trails = new Set(trails)
    this.touch()
  }

  public defineProfessors(professors: UniqueEntityID<Professor>[]) {
    this.props.professors = new Set(professors)
    this.touch()
  }

  public comment(content: string, authorId: UniqueEntityID<StudentProfile>) {
    const comment = Comment.create({
      content,
      authorId,
      projectId: this.id,
    })

    this.props.comments.add(comment)
    this.touch()

    return comment
  }

  public removeComment(comment: Comment) {
    this.props.comments.delete(comment)
    this.touch()
  }

  // --- 3. Getters ---
  get title() {
    return this.props.title
  }

  get description() {
    return this.props.description
  }

  get bannerUrl() {
    return this.props.bannerUrl
  }

  get content() {
    return this.props.content || ''
  }

  get publishedYear() {
    return this.props.publishedYear
  }

  get status() {
    return this.props.status
  }

  get semester() {
    return this.props.semester
  }

  get allowComments() {
    return this.props.allowComments
  }

  get authorId() {
    return this.props.authorId
  }

  get subjectId() {
    return this.props.subjectId
  }

  get trails() {
    return this.props.trails
  }

  get professors() {
    return this.props.professors
  }

  get comments() {
    return this.props.comments
  }
}
