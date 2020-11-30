export const postLogin = {
  tags: ['Authentication'],
  descriptions: 'Returns the authorization parameters that identify the user against the API.',
  operationId: 'login',
  // NOTE To be logged in for this action is not required
  // TODO Require user's authentication data defined by the 'LoginInputParams' component
  requestBody: {
    description: 'User identification parameters'
    // required: true,
    // // content: {
    // //   'application/json': {
    // //     // schema: {
    // //     //   // $ref: '#/components/schemas/LoginInputParams' // We have to create this new component
    // //     // }
    // //   }
    // // }
  },
  responses: {
    // TODO Define the response when everything is fine (200 OK). It must return a response defined by 'AuthenticatedUser' component
    // 200: {
    //   description: 'Authentication success',
    //   content: {
    //     'application/json': {
    //       schema: {
    //         $ref: '#/components/schemas/AuthenticatedUser'  // We have to create this new component
    //       }
    //     }
    //   }
    // },
    // TODO Define the response when username or password are not valid or the don't match (401 UNAUTHORIZED). Its response must be defined by the 'Error401' coponent.
    // 401: {
    //   description: 'Unauthorized user error when the username or password are wrong or they mismatch with the stored information',
    //   content: {
    //     'application/json': {
    //       schema: {
    //         $ref: '#/components/schemas/Error401'
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
