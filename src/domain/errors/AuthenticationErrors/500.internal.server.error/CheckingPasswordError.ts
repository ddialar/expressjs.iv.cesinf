import { InternalServerError } from '../../CommonErrors'

export class CheckingPasswordError extends InternalServerError {
  constructor (description?: string) {
    super()
  }
}
