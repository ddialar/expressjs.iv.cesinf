import { Request } from 'express'
import { UserDomainModel } from '../../../domain/models'

export interface RequestDto extends Request {
    user?: UserDomainModel | null
}
