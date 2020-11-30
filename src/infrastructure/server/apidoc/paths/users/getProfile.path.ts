export const getProfile = {
  tags: ['Users'],
  descriptions: 'Retrieves the user\'s profile.',
  operationId: 'getProfile',
  // TODO Require authentication for this action
  // security: [
  //   {
  //     Bearer: []
  //   }
  // ],
  responses: {
    // TODO Define the response when everything is fine (201 CREATED). It must return a response defined by 'UserProfile' component
    // 201: {
    //   description: 'Selected user\'s profile',
    //   content: {
    //     'application/json': {
    //       schema: {
    //         $ref: '#/components/schemas/UserProfile' // We have to create this new component
    //       }
    //     }
    //   }
    // },
    // TODO Define the response when the token is expired (400 BAD REQUEST). Its response must be defined by the 'Error400' coponent.
    // 400: {
    //   description: 'Bad request when the provided token is expired',
    //   content: {
    //     'application/json': {
    //       schema: {
    //         $ref: '#/components/schemas/Error400'
    //       }
    //     }
    //   }
    // },
    // TODO Define the response when the token is not valid (401 UNAUTHORIZED). Its response must be defined by the 'Error401' coponent.
    // 401: {
    //   description: 'Unauthorized user error when the provided token is not valid',
    //   content: {
    //     'application/json': {
    //       schema: {
    //         $ref: '#/components/schemas/Error401'
    //       }
    //     }
    //   }
    // },
    // TODO Define the response when the token is empty (403 FORBIDDEN). Its response must be defined by the 'Error403' coponent.
    // 403: {
    //   description: 'Bad request when the provided token is empty',
    //   content: {
    //     'application/json': {
    //       schema: {
    //         $ref: '#/components/schemas/Error403'
    //       }
    //     }
    //   }
    // },
    // TODO Define the response for any other unhandled situation (500 INTERNAL SERVER ERROR). Its response must be defined by the 'Error500' coponent.
    // 500: {
    //   description: 'API Error',
    //   content: {
    //     'application/json': {
    //       schema: {
    //         $ref: '#/components/schemas/Error500'
    //       }
    //     }
    //   }
    // }
  }
}
