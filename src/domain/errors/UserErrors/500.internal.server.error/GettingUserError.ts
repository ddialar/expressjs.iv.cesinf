import { InternalServerError } from '../../CommonErrors'

export class GettingUserError extends InternalServerError {
  constructor (description?: string) {
    super()
  }
}
