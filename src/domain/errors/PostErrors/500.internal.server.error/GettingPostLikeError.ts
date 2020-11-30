import { InternalServerError } from '../../CommonErrors'

export class GettingPostLikeError extends InternalServerError {
  constructor (description?: string) {
    super()
  }
}
