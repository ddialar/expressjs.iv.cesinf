import { InternalServerError } from '../../CommonErrors'

export class DeletingPostLikeError extends InternalServerError {
  constructor (description?: string) {
    super()
  }
}
