import supertest, { SuperTest, Test } from 'supertest'

import { server } from '../../../server'
import { mongodb } from '../../../../orm'

import { OK, INTERNAL_SERVER_ERROR } from '../../../../../domain/errors'
import { PostDomainModel } from '../../../../../domain/models'
import { postDataSource } from '../../../../dataSources'

import { testingLikedAndCommentedPersistedDtoPosts, testingLikedAndCommentedPersistedDomainModelPosts } from '../../../../../test/fixtures'

const mockedPosts = testingLikedAndCommentedPersistedDtoPosts
const resultPosts = testingLikedAndCommentedPersistedDomainModelPosts

describe('[API] - Posts endpoints', () => {
  describe('[GET] /posts', () => {
    const { connect, disconnect, models: { Post } } = mongodb

    let request: SuperTest<Test>

    beforeAll(async () => {
      request = supertest(server)
      await connect()
      await Post.insertMany(mockedPosts)
    })

    afterAll(async () => {
      await Post.deleteMany({})
      await disconnect()
    })

    it('must return OK (200) and the whole persisted post', async (done) => {
      await request
        .get('/posts')
        .expect(OK)
        .then(async ({ body }) => {
          const persistedPosts = body as PostDomainModel[]

          expect(persistedPosts).toHaveLength(persistedPosts.length)

          persistedPosts.forEach((post) => {
            const expectedFields = ['id', 'body', 'owner', 'comments', 'likes', 'createdAt', 'updatedAt']
            const getAlldPostFields = Object.keys(post).sort()
            expect(getAlldPostFields.sort()).toEqual(expectedFields.sort())

            const expectedPost = resultPosts.find((resultPost) => resultPost.id === post.id?.toString()) as PostDomainModel

            expect(post).toStrictEqual<PostDomainModel>(expectedPost)
          })
        })

      done()
    })

    it('must return INTERNAL_SERVER_ERROR (500) when the persistance throws an exception', async (done) => {
      jest.spyOn(postDataSource, 'getPosts').mockImplementation(() => {
        throw new Error('Testing error')
      })

      const errorMessage = 'Internal Server Error'

      await request
        .get('/posts')
        .expect(INTERNAL_SERVER_ERROR)
        .then(async ({ text }) => {
          expect(text).toBe(errorMessage)
        })

      jest.spyOn(postDataSource, 'getPosts').mockRestore()

      done()
    })
  })
})
