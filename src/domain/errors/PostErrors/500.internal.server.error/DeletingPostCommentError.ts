import { InternalServerError } from '../../CommonErrors'

export class DeletingPostCommentError extends InternalServerError {
  constructor (description?: string) {
    super()
  }
}
