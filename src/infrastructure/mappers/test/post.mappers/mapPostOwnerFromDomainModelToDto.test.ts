import { PostOwnerDomainModel } from '../../../../domain/models'
import { testingDomainModelPostOwners } from '../../../../test/fixtures'

import { mapPostOwnerFromDomainModelToDto } from '../../post.mappers'

describe('[MAPPERS] Post mapper - mapPostOwnerFromDomainModelToDto', () => {
  it('maps successfully from Domain to DTO', () => {
    const originalPostOwner = JSON.parse(JSON.stringify(testingDomainModelPostOwners[0])) as PostOwnerDomainModel
    const { id, ...otherOriginalPostOwnerFields } = originalPostOwner
    const expectedPostOwner = {
      ...otherOriginalPostOwnerFields,
      userId: id
    }

    const mappedData = mapPostOwnerFromDomainModelToDto(originalPostOwner)
    expect(mappedData).toStrictEqual(expectedPostOwner)
  })
})
