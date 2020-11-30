import supertest, { SuperTest, Test } from 'supertest'

import { server } from '../../../server'
import { mongodb } from '../../../../orm'

import { BAD_REQUEST, OK, UNAUTHORIZED, INTERNAL_SERVER_ERROR, NOT_FOUND } from '../../../../../domain/errors'
import { PostCommentOwnerDomainModel, PostDomainModel, PostLikeOwnerDomainModel, UserDomainModel } from '../../../../../domain/models'
import { postDataSource } from '../../../../dataSources'
import { PostDto, UserProfileDto } from '../../../../dtos'

import { testingLikedAndCommentedPersistedDtoPosts, testingLikedAndCommentedPersistedDomainModelPosts, testingDomainModelFreeUsers, testingUsers, testingValidJwtTokenForNonPersistedUser, testingExpiredJwtToken } from '../../../../../test/fixtures'
import { mapPostFromDtoToDomainModel } from '../../../../mappers'

describe('[API] - Posts endpoints', () => {
  describe('[POST] /posts/like', () => {
    interface TestingProfileDto extends UserProfileDto {
      _id: string
      password: string
    }

    const { connect, disconnect, models: { User, Post } } = mongodb

    const mockedPosts = testingLikedAndCommentedPersistedDomainModelPosts as PostDomainModel[]
    const originalPost = mockedPosts[0]
    const nonValidPostId = originalPost.comments[0].id as string
    const testingFreeUser = testingDomainModelFreeUsers[0] as PostCommentOwnerDomainModel
    const { id, username, password, email, avatar, name, surname, token: validToken } = testingUsers.find(({ id }) => id === testingFreeUser.id) as UserDomainModel

    const mockedUserDataToBePersisted: TestingProfileDto = {
      _id: id,
      username,
      password,
      email,
      name,
      surname,
      avatar
    }

    let request: SuperTest<Test>

    beforeAll(async () => {
      request = supertest(server)
      await connect()
      await User.deleteMany({})
      await (new User(mockedUserDataToBePersisted)).save()
    })

    beforeEach(async () => {
      await Post.deleteMany({})
      await Post.insertMany(testingLikedAndCommentedPersistedDtoPosts)
    })

    afterAll(async () => {
      await User.deleteMany({})
      await Post.deleteMany({})
      await disconnect()
    })

    it('must return OK (200) and persist the new like into the selected post', async (done) => {
      const token = `bearer ${validToken}`
      const { id: postId } = originalPost
      const likeOwner = testingFreeUser

      await request
        .post('/posts/like')
        .set('Authorization', token)
        .send({ postId })
        .expect(OK)
        .then(async () => {
          const updatedPost = mapPostFromDtoToDomainModel(JSON.parse(JSON.stringify(await Post.findById(postId).lean()))) as PostDomainModel

          expect(updatedPost.id).not.toBeNull()
          expect(updatedPost.body).toBe(originalPost.body)
          expect(updatedPost.owner).toStrictEqual(originalPost.owner)
          expect(updatedPost.comments).toStrictEqual(originalPost.comments)

          expect(updatedPost.likes).toHaveLength(originalPost.likes.length + 1)
          const originalLikesIds = originalPost.likes.map(({ id }) => id as string)
          const updatedLikesIds = updatedPost.likes.map(({ id }) => id as string)
          const newLikeId = updatedLikesIds.find((updatedId) => !originalLikesIds.includes(updatedId))
          const newPersistedLike = updatedPost.likes.find((like) => like.id === newLikeId) as PostLikeOwnerDomainModel
          expect(newPersistedLike.id).toBe(likeOwner.id)
          expect(newPersistedLike.name).toBe(likeOwner.name)
          expect(newPersistedLike.surname).toBe(likeOwner.surname)
          expect(newPersistedLike.avatar).toBe(likeOwner.avatar)

          expect(updatedPost.createdAt).toBe(originalPost.createdAt)
          expect(updatedPost.updatedAt).not.toBe(originalPost.updatedAt)

          expect(updatedPost.createdAt).toBe(originalPost.createdAt)
          expect(updatedPost.updatedAt).not.toBe(originalPost.updatedAt)
        })

      done()
    })

    it('must return NOT_FOUND (404) when the provided post ID doesn\'t exist', async (done) => {
      const token = `bearer ${validToken}`
      const postId = nonValidPostId
      const errorMessage = 'Post not found'

      await request
        .post('/posts/like')
        .set('Authorization', token)
        .send({ postId })
        .expect(NOT_FOUND)
        .then(async ({ text }) => {
          expect(text).toBe(errorMessage)
        })

      done()
    })

    it('must return UNAUTHORIZED (401) error when we send an expired token', async (done) => {
      const token = `bearer ${testingExpiredJwtToken}`
      const { id: postId } = originalPost
      const errorMessage = 'Token expired'

      await request
        .post('/posts/like')
        .set('Authorization', token)
        .send({ postId })
        .expect(UNAUTHORIZED)
        .then(async ({ text }) => {
          expect(text).toBe(errorMessage)
        })

      done()
    })

    it('must return BAD_REQUEST (400) error when we send a token of non recorded user', async (done) => {
      const token = `bearer ${testingValidJwtTokenForNonPersistedUser}`
      const { id: postId } = originalPost
      const errorMessage = 'User does not exist'

      await request
        .post('/posts/like')
        .set('Authorization', token)
        .send({ postId })
        .expect(BAD_REQUEST)
        .then(async ({ text }) => {
          expect(text).toBe(errorMessage)
        })

      done()
    })

    it('must return INTERNAL_SERVER_ERROR (500) when the retrieving post pocess throws an error', async (done) => {
      jest.spyOn(postDataSource, 'getPostById').mockImplementation(() => {
        throw new Error('Testing error')
      })

      const token = `bearer ${validToken}`
      const { id: postId } = originalPost
      const errorMessage = 'Internal Server Error'

      await request
        .post('/posts/like')
        .set('Authorization', token)
        .send({ postId })
        .expect(INTERNAL_SERVER_ERROR)
        .then(async ({ text }) => {
          expect(text).toBe(errorMessage)
        })

      jest.spyOn(postDataSource, 'getPostById').mockRestore()

      done()
    })

    it('must return INTERNAL_SERVER_ERROR (500) when the liking process throws an exception', async (done) => {
      jest.spyOn(postDataSource, 'likePost').mockImplementation(() => {
        throw new Error('Testing error')
      })

      const token = `bearer ${validToken}`
      const { id: postId } = originalPost
      const errorMessage = 'Internal Server Error'

      await request
        .post('/posts/like')
        .set('Authorization', token)
        .send({ postId })
        .expect(INTERNAL_SERVER_ERROR)
        .then(async ({ text }) => {
          expect(text).toBe(errorMessage)
        })

      jest.spyOn(postDataSource, 'likePost').mockRestore()

      done()
    })
  })

  describe('[DELETE] /posts/like', () => {
    const { connect, disconnect, models: { User, Post } } = mongodb

    const mockedDtoPosts = testingLikedAndCommentedPersistedDtoPosts as PostDto[]
    const mockedCompleteDtoPost = JSON.parse(JSON.stringify(mockedDtoPosts[0]))
    const mockedEmptyLikesDtoPost = JSON.parse(JSON.stringify(mockedDtoPosts[1]))
    mockedEmptyLikesDtoPost.likes = []

    const resultPosts = testingLikedAndCommentedPersistedDomainModelPosts as PostDomainModel[]
    const selectedPost = resultPosts[0]
    const selectedLike = selectedPost.likes[0]
    const selectedLikeOwnerId = selectedLike.id
    const mockedNonValidPostId = resultPosts[1].owner.id as string
    const mockedNoLikerUserId = resultPosts[1].owner.id as string

    const {
      username: ownerUsername,
      password: ownerPassword,
      email: ownerEmail,
      token: ownerValidToken
    } = testingUsers.find(({ id }) => id === selectedLikeOwnerId) as UserDomainModel
    const mockedPostLikeOwner = {
      _id: selectedLikeOwnerId,
      username: ownerUsername,
      password: ownerPassword,
      email: ownerEmail
    }

    const {
      username: noLikerUsername,
      password: noLikerUserPassword,
      email: noLikerUserEmail,
      token: noLikerUserValidToken
    } = testingUsers.find(({ id }) => id === mockedNoLikerUserId) as UserDomainModel
    const mockedUnauthorizedUserToBePersisted = {
      _id: mockedNoLikerUserId,
      username: noLikerUsername,
      password: noLikerUserPassword,
      email: noLikerUserEmail
    }

    let request: SuperTest<Test>

    beforeAll(async () => {
      request = supertest(server)
      await connect()
      await User.deleteMany({})
      await User.insertMany([mockedPostLikeOwner, mockedUnauthorizedUserToBePersisted])
    })

    beforeEach(async () => {
      await Post.deleteMany({})
      await Post.insertMany([mockedCompleteDtoPost, mockedEmptyLikesDtoPost])
    })

    afterAll(async () => {
      await User.deleteMany({})
      await Post.deleteMany({})
      await disconnect()
    })

    it('must return OK (200) and delete the provided comment', async (done) => {
      const token = `bearer ${ownerValidToken}`
      const postId = selectedPost.id as string

      await request
        .delete('/posts/like')
        .set('Authorization', token)
        .send({ postId })
        .expect(OK)
        .then(async () => {
          const { likes: updatedDtoLikes } = (await Post.findById(postId))?.toJSON() as PostDto

          expect(updatedDtoLikes).toHaveLength(selectedPost.likes.length - 1)
          expect(updatedDtoLikes.map(({ userId }) => userId).includes(selectedLikeOwnerId)).toBeFalsy()
        })

      done()
    })

    it('must return OK (200) but not modify the selected post nor throw any error when the provided user has not liked the post', async (done) => {
      const token = `bearer ${noLikerUserValidToken}`
      const postId = selectedPost.id as string

      await request
        .delete('/posts/like')
        .set('Authorization', token)
        .send({ postId })
        .expect(OK)
        .then(async () => {
          const { likes: updatedDtoLikes } = (await Post.findById(postId))?.toJSON() as PostDto

          expect(updatedDtoLikes).toHaveLength(selectedPost.likes.length)
        })

      done()
    })

    it('must return UNAUTHORIZED (401) error when we send an expired token', async (done) => {
      const token = `bearer ${testingExpiredJwtToken}`
      const postId = selectedPost.id as string
      const errorMessage = 'Token expired'

      await request
        .delete('/posts/like')
        .set('Authorization', token)
        .send({ postId })
        .expect(UNAUTHORIZED)
        .then(async ({ text }) => {
          expect(text).toBe(errorMessage)
        })

      done()
    })

    it('must return BAD_REQUEST (400) error when we send a token of non recorded user', async (done) => {
      const token = `bearer ${testingValidJwtTokenForNonPersistedUser}`
      const postId = selectedPost.id as string
      const errorMessage = 'User does not exist'

      await request
        .delete('/posts/like')
        .set('Authorization', token)
        .send({ postId })
        .expect(BAD_REQUEST)
        .then(async ({ text }) => {
          expect(text).toBe(errorMessage)
        })

      done()
    })

    it('must return NOT_FOUND (404) when the provided post ID doesn\'t exist', async (done) => {
      const token = `bearer ${ownerValidToken}`
      const postId = mockedNonValidPostId
      const errorMessage = 'Post not found'

      await request
        .delete('/posts/like')
        .set('Authorization', token)
        .send({ postId })
        .expect(NOT_FOUND)
        .then(async ({ text }) => {
          expect(text).toBe(errorMessage)
        })

      done()
    })

    it('must return INTERNAL_SERVER_ERROR (500) when the datasource retrieving post by ID process throws an unexpected error', async (done) => {
      jest.spyOn(postDataSource, 'getPostById').mockImplementation(() => {
        throw new Error('Testing error')
      })

      const token = `bearer ${ownerValidToken}`
      const postId = selectedPost.id as string
      const errorMessage = 'Internal Server Error'

      await request
        .delete('/posts/like')
        .set('Authorization', token)
        .send({ postId })
        .expect(INTERNAL_SERVER_ERROR)
        .then(async ({ text }) => {
          expect(text).toBe(errorMessage)
        })

      jest.spyOn(postDataSource, 'getPostById').mockRestore()

      done()
    })

    it('must return INTERNAL_SERVER_ERROR (500) when the datasource disliking process throws an unexpected error', async (done) => {
      jest.spyOn(postDataSource, 'dislikePost').mockImplementation(() => {
        throw new Error('Testing error')
      })

      const token = `bearer ${ownerValidToken}`
      const postId = selectedPost.id as string
      const errorMessage = 'Internal Server Error'

      await request
        .delete('/posts/like')
        .set('Authorization', token)
        .send({ postId })
        .expect(INTERNAL_SERVER_ERROR)
        .then(async ({ text }) => {
          expect(text).toBe(errorMessage)
        })

      jest.spyOn(postDataSource, 'dislikePost').mockRestore()

      done()
    })
  })
})
