import { InternalServerError } from '../../CommonErrors'

export class GettingUserProfileError extends InternalServerError {
  constructor (description?: string) {
    super()
  }
}
