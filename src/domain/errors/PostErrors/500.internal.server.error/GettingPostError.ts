import { InternalServerError } from '../../CommonErrors'

export class GettingPostError extends InternalServerError {
  constructor (description?: string) {
    super()
  }
}
