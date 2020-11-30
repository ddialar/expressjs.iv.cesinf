import { InternalServerError } from '../../CommonErrors'

export class CreatingPostCommentError extends InternalServerError {
  constructor (description?: string) {
    super()
  }
}
