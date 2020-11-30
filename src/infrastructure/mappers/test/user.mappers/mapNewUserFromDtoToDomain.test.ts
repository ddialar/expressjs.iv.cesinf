import { NewUserInputDto } from '../../../dtos'
import { NewUserDomainModel } from '../../../../domain/models'

import { testingUsers } from '../../../../test/fixtures'

import { mapNewUserFromDtoToDomainModel } from '../../user.mappers'

const { email, password } = testingUsers[0]

describe('[MAPPERS] User mapper - mapNewUserFromDtoToDomainModel', () => {
  it('maps successfully from DTO to Domain', () => {
    const originData: NewUserInputDto = {
      email,
      password
    }
    const expectedData: NewUserDomainModel = {
      email,
      username: email,
      password
    }
    const mappedData = mapNewUserFromDtoToDomainModel(originData)

    expect(mappedData).toEqual(expectedData)
  })
})
