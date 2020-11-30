import { InternalServerError } from '../../CommonErrors'

export class LikingPostError extends InternalServerError {
  constructor (description?: string) {
    super()
  }
}
