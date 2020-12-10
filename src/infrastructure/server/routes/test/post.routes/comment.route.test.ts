import supertest, { SuperTest, Test } from 'supertest'
import { lorem } from 'faker'

import { server } from '../../../server'
import { mongodb } from '../../../../orm'

import { BAD_REQUEST, OK, FORBIDDEN, UNAUTHORIZED, INTERNAL_SERVER_ERROR, NOT_FOUND } from '../../../../../domain/errors'
import { PostCommentOwnerDomainModel, PostDomainModel, UserDomainModel } from '../../../../../domain/models'
import { postDataSource } from '../../../../dataSources'
import { PostDto, UserDto, UserProfileDto } from '../../../../dtos'

import { testingLikedAndCommentedPersistedDtoPosts, testingLikedAndCommentedPersistedDomainModelPosts, testingDomainModelFreeUsers, testingUsers, testingValidJwtTokenForNonPersistedUser, testingExpiredJwtToken, cleanUsersCollection, saveUser, cleanPostsCollection, savePosts } from '../../../../../test/fixtures'

describe('[API] - Posts endpoints', () => {
  describe('[POST] /posts/comment', () => {
    interface TestingProfileDto extends UserProfileDto {
      _id: string
      password: string
    }

    const { connect, disconnect } = mongodb

    const mockedPosts = testingLikedAndCommentedPersistedDomainModelPosts as PostDomainModel[]
    const originalPost = mockedPosts[0]
    const testingFreeUser = testingDomainModelFreeUsers[0] as PostCommentOwnerDomainModel
    const { id, username, password, email, avatar, name, surname, token: validToken } = testingUsers.find(({ id }) => id === testingFreeUser.id) as UserDomainModel

    const mockedUserDataToBePersisted: TestingProfileDto = {
      _id: id,
      username,
      password,
      email,
      avatar,
      name,
      surname
    }
    let persistedUser: UserDto

    let request: SuperTest<Test>

    beforeAll(async () => {
      request = supertest(server)
      await connect()
      await cleanUsersCollection()
      persistedUser = await saveUser(mockedUserDataToBePersisted)
    })

    beforeEach(async () => {
      await cleanPostsCollection()
      await savePosts(testingLikedAndCommentedPersistedDtoPosts)
    })

    afterAll(async () => {
      await cleanUsersCollection()
      await cleanPostsCollection()
      await disconnect()
    })

    it('must return OK (200) and the updated post with the new comment', async (done) => {
      const token = `bearer ${validToken}`
      const { id: postId } = originalPost
      const commentBody = lorem.paragraph()

      await request
        .post('/posts/comment')
        .set('Authorization', token)
        .send({ postId, commentBody })
        .expect(OK)
        .then(async ({ body }) => {
          const updatedPost = body as PostDomainModel

          const expectedPostFields = ['id', 'body', 'owner', 'comments', 'likes', 'createdAt', 'updatedAt']
          const updatedPostFields = Object.keys(updatedPost).sort()
          expect(updatedPostFields.sort()).toEqual(expectedPostFields.sort())

          expect(updatedPost.id).toBe(originalPost.id)
          expect(updatedPost.body).toBe(originalPost.body)

          const expectedPostOwnerFields = ['id', 'name', 'surname', 'avatar']
          const createPostCommentdOwnerPostFields = Object.keys(updatedPost.owner).sort()
          expect(createPostCommentdOwnerPostFields.sort()).toEqual(expectedPostOwnerFields.sort())
          expect(updatedPost.owner).toStrictEqual(originalPost.owner)

          expect(updatedPost.comments).toHaveLength(originalPost.comments.length + 1)
          const originalCommentsIds = originalPost.comments.map(({ id }) => id as string)
          const updatedCommentsIds = updatedPost.comments.map(({ id }) => id as string)
          const newPostId = updatedCommentsIds.find((updatedId) => !originalCommentsIds.includes(updatedId))
          const newPersistedComment = updatedPost.comments.find((comment) => comment.id === newPostId) as PostDomainModel
          expect(newPersistedComment.body).toBe(commentBody)
          expect(newPersistedComment.owner.id).toBe(persistedUser._id.toString())
          expect(newPersistedComment.owner.name).toBe(persistedUser.name)
          expect(newPersistedComment.owner.surname).toBe(persistedUser.surname)
          expect(newPersistedComment.owner.avatar).toBe(persistedUser.avatar)

          expect(updatedPost.likes).toStrictEqual(originalPost.likes)

          expect(updatedPost.createdAt).toBe(originalPost.createdAt)
          expect(updatedPost.updatedAt).not.toBe(originalPost.updatedAt)
        })

      done()
    })

    it('must return FORBIDDEN (403) when we send an empty token', async (done) => {
      const token = ''
      const { id: postId } = originalPost
      const commentBody = lorem.paragraph()
      const errorMessage = 'Required token was not provided'

      await request
        .post('/posts/comment')
        .set('Authorization', token)
        .send({ postId, commentBody })
        .expect(FORBIDDEN)
        .then(async ({ text }) => {
          expect(text).toBe(errorMessage)
        })

      done()
    })

    it('must return UNAUTHORIZED (401) error when we send an expired token', async (done) => {
      const token = `bearer ${testingExpiredJwtToken}`
      const { id: postId } = originalPost
      const commentBody = lorem.paragraph()
      const errorMessage = 'Token expired'

      await request
        .post('/posts/comment')
        .set('Authorization', token)
        .send({ postId, commentBody })
        .expect(UNAUTHORIZED)
        .then(async ({ text }) => {
          expect(text).toBe(errorMessage)
        })

      done()
    })

    it('must return BAD_REQUEST (400) error when we send a token that belongs to a non registered user', async (done) => {
      const token = `bearer ${testingValidJwtTokenForNonPersistedUser}`
      const { id: postId } = originalPost
      const commentBody = lorem.paragraph()
      const errorMessage = 'User does not exist'

      await request
        .post('/posts/comment')
        .set('Authorization', token)
        .send({ postId, commentBody })
        .expect(BAD_REQUEST)
        .then(async ({ text }) => {
          expect(text).toBe(errorMessage)
        })

      done()
    })

    it('must return INTERNAL_SERVER_ERROR (500) when the persistance process returns a NULL value', async (done) => {
      jest.spyOn(postDataSource, 'createPostComment').mockImplementation(() => Promise.resolve(null))

      const token = `bearer ${validToken}`
      const { id: postId } = originalPost
      const commentBody = lorem.paragraph()
      const errorMessage = 'Internal Server Error'

      await request
        .post('/posts/comment')
        .set('Authorization', token)
        .send({ postId, commentBody })
        .expect(INTERNAL_SERVER_ERROR)
        .then(async ({ text }) => {
          expect(text).toBe(errorMessage)
        })

      jest.spyOn(postDataSource, 'createPostComment').mockRestore()

      done()
    })

    it('must return INTERNAL_SERVER_ERROR (500) when the persistance throws an exception', async (done) => {
      jest.spyOn(postDataSource, 'createPostComment').mockImplementation(() => {
        throw new Error('Testing error')
      })

      const token = `bearer ${validToken}`
      const { id: postId } = originalPost
      const commentBody = lorem.paragraph()
      const errorMessage = 'Internal Server Error'

      await request
        .post('/posts/comment')
        .set('Authorization', token)
        .send({ postId, commentBody })
        .expect(INTERNAL_SERVER_ERROR)
        .then(async ({ text }) => {
          expect(text).toBe(errorMessage)
        })

      jest.spyOn(postDataSource, 'createPostComment').mockRestore()

      done()
    })
  })

  describe('[DELETE] /posts/comment', () => {
    const { connect, disconnect, models: { User, Post } } = mongodb

    const mockedPosts = testingLikedAndCommentedPersistedDomainModelPosts as PostDomainModel[]

    const selectedPost = mockedPosts[0]
    const selectedComment = selectedPost.comments[0]

    const nonValidPost = mockedPosts[1]
    const nonValidPostComment = mockedPosts[1].comments[0]

    const {
      id: ownerId,
      username: ownerUsername,
      password: ownerPassword,
      email: ownerEmail,
      token: ownerValidToken
    } = testingUsers.find(({ id }) => id === selectedComment.owner.id) as UserDomainModel
    const mockedPostCommentOwner = {
      _id: ownerId,
      username: ownerUsername,
      password: ownerPassword,
      email: ownerEmail
    }

    const {
      id: unauthorizedId,
      username: unauthorizedUsername,
      password: unauthorizedPassword,
      email: unauthorizedEmail,
      token: unauthorizedValidToken
    } = testingUsers.find(({ id }) => id === testingDomainModelFreeUsers[0].id) as UserDomainModel
    const mockedUnauthorizedUserToBePersisted = {
      _id: unauthorizedId,
      username: unauthorizedUsername,
      password: unauthorizedPassword,
      email: unauthorizedEmail
    }

    let request: SuperTest<Test>

    beforeAll(async () => {
      request = supertest(server)
      await connect()
      await cleanUsersCollection()
      await User.insertMany([mockedPostCommentOwner, mockedUnauthorizedUserToBePersisted])
    })

    beforeEach(async () => {
      await cleanPostsCollection()
      await Post.insertMany(testingLikedAndCommentedPersistedDtoPosts)
    })

    afterAll(async () => {
      await cleanUsersCollection()
      await cleanPostsCollection()
      await disconnect()
    })

    it('must return OK (200) and delete the provided comment', async (done) => {
      const token = `bearer ${ownerValidToken}`
      const postId = selectedPost.id as string
      const commentId = selectedComment.id as string

      await request
        .delete('/posts/comment')
        .set('Authorization', token)
        .send({ postId, commentId })
        .expect(OK)
        .then(async () => {
          const { comments: updatedDtoComments } = (await Post.findById(postId))?.toJSON() as PostDto

          expect(updatedDtoComments).toHaveLength(selectedPost.comments.length - 1)
          expect(updatedDtoComments.map(({ _id }) => _id).includes(commentId)).toBeFalsy()
        })

      done()
    })

    it('must return NOT_FOUND (404) when we select a post which doesn\'t contain the provided comment', async (done) => {
      const token = `bearer ${ownerValidToken}`
      const postId = nonValidPost.id as string
      const commentId = selectedComment.id as string
      const errorMessage = 'Post comment not found'

      await request
        .delete('/posts/comment')
        .set('Authorization', token)
        .send({ postId, commentId })
        .expect(NOT_FOUND)
        .then(async ({ text }) => {
          expect(text).toBe(errorMessage)
        })

      done()
    })

    it('must return NOT_FOUND (404) when provide a comment which is not contained into the selected post', async (done) => {
      const token = `bearer ${ownerValidToken}`
      const postId = selectedPost.id as string
      const commentId = nonValidPostComment.id as string
      const errorMessage = 'Post comment not found'

      await request
        .delete('/posts/comment')
        .set('Authorization', token)
        .send({ postId, commentId })
        .expect(NOT_FOUND)
        .then(async ({ text }) => {
          expect(text).toBe(errorMessage)
        })

      done()
    })

    it('must return UNAUTHORIZED (401) when the action is performed by an user who is not the owner of the comment', async (done) => {
      const token = `bearer ${unauthorizedValidToken}`
      const postId = selectedPost.id as string
      const commentId = selectedComment.id as string
      const errorMessage = 'User not authorized to delete this comment'

      await request
        .delete('/posts/comment')
        .set('Authorization', token)
        .send({ postId, commentId })
        .expect(UNAUTHORIZED)
        .then(async ({ text }) => {
          expect(text).toBe(errorMessage)
        })

      done()
    })

    it('must return INTERNAL_SERVER_ERROR (500) when the datasource throws an unexpected error', async (done) => {
      jest.spyOn(postDataSource, 'getPostComment').mockImplementation(() => {
        throw new Error('Testing error')
      })

      const token = `bearer ${ownerValidToken}`
      const postId = selectedPost.id as string
      const commentId = selectedComment.id as string
      const errorMessage = 'Internal Server Error'

      await request
        .delete('/posts/comment')
        .set('Authorization', token)
        .send({ postId, commentId })
        .expect(INTERNAL_SERVER_ERROR)
        .then(async ({ text }) => {
          expect(text).toBe(errorMessage)
        })

      jest.spyOn(postDataSource, 'getPostComment').mockRestore()

      done()
    })

    it('must return INTERNAL_SERVER_ERROR (500) when the deleting process throws an unexpected error', async (done) => {
      jest.spyOn(postDataSource, 'deletePostComment').mockImplementation(() => {
        throw new Error('Testing error')
      })

      const token = `bearer ${ownerValidToken}`
      const postId = selectedPost.id as string
      const commentId = selectedComment.id as string
      const errorMessage = 'Internal Server Error'

      await request
        .delete('/posts/comment')
        .set('Authorization', token)
        .send({ postId, commentId })
        .expect(INTERNAL_SERVER_ERROR)
        .then(async ({ text }) => {
          expect(text).toBe(errorMessage)
        })

      jest.spyOn(postDataSource, 'deletePostComment').mockRestore()

      done()
    })
  })
})
