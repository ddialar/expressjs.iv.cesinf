import { InternalServerError } from '../../CommonErrors'

export class CreatingPostError extends InternalServerError {
  constructor (description?: string) {
    super()
  }
}
