import { InternalServerError } from '../../CommonErrors'

export class GettingPostCommentError extends InternalServerError {
  constructor (description?: string) {
    super()
  }
}
