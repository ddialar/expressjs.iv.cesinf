import { InternalServerError } from '../../CommonErrors'

export class CreatingUserError extends InternalServerError {
  constructor (description?: string) {
    super()
  }
}
