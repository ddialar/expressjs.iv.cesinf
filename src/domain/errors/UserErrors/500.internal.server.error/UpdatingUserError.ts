import { InternalServerError } from '../../CommonErrors'

export class UpdatingUserError extends InternalServerError {
  constructor (description?: string) {
    super()
  }
}
