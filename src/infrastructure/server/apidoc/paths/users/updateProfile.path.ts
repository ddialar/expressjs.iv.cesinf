export const updateProfile = {
  tags: ['Users'],
  descriptions: 'Update the user\'s profile.',
  operationId: 'updateProfile',
  // TODO Require authentication for this action
  // security: [
  //   {
  //     Bearer: []
  //   }
  // ],
  // TODO Require new profile data defined by the 'NewUserProfileDataInput' component
  requestBody: {
    description: 'New user\'s profile content.',
    // required: true,
    // // content: {
    // //   'application/json': {
    // //     // schema: {
    // //     //   // $ref: '#/components/schemas/NewUserProfileDataInput' // We have to implement this new component
    // //     // }
    // //   }
    // // }
  },
  responses: {
    // TODO Define the response when everything is fine (200 OK). It must return a response defined by 'UserProfile' component
    // 200: {
    //   description: 'New user\'s profile data successfully updated',
    //   content: {
    //     'application/json': {
    //       schema: {
    //         // $ref: '#/components/schemas/UserProfile'
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
