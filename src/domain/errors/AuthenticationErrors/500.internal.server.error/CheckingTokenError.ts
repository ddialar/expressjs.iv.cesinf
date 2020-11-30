import { InternalServerError } from '../../CommonErrors'

export class CheckingTokenError extends InternalServerError {
  constructor (description?: string) {
    super()
  }
}
