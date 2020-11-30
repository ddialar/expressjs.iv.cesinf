import { InternalServerError } from '../../CommonErrors'

export class GettingTokenError extends InternalServerError {
  constructor (description?: string) {
    super()
  }
}
