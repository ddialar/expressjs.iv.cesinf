export const errorComponent = {
  Error400: {
    type: 'object',
    required: ['status', 'message'],
    properties: {
      status: {
        type: 'integer',
        format: 'int32',
        description: 'HTTP code that provide standarized information about the error',
        example: 400
      },
      message: {
        type: 'string',
        description: 'Expanded information about the error.',
        example: 'You have sent someting that is now allowed :('
      }
    }
  },
  Error401: {
    type: 'object',
    required: ['status', 'message'],
    properties: {
      status: {
        type: 'integer',
        format: 'int32',
        description: 'HTTP code that provide standarized information about the error',
        example: 401
      },
      message: {
        type: 'string',
        description: 'Expanded information about the error',
        example: 'You shall not pass <Gandalf style>'
      }
    }
  },
  Error403: {
    type: 'object',
    required: ['status', 'message'],
    properties: {
      status: {
        type: 'integer',
        format: 'int32',
        description: 'HTTP code that provide standarized information about the error',
        example: 403
      },
      message: {
        type: 'string',
        description: 'Expanded information about the error.',
        example: 'You forgot to send something important'
      }
    }
  },
  Error404: {
    type: 'object',
    required: ['status', 'message'],
    properties: {
      status: {
        type: 'integer',
        format: 'int32',
        description: 'HTTP code that provide standarized information about the error',
        example: 404
      },
      message: {
        type: 'string',
        description: 'Expanded information about the error.',
        example: 'You are asking for something that is not here'
      }
    }
  },
  Error500: {
    type: 'object',
    required: ['status', 'message'],
    properties: {
      status: {
        type: 'integer',
        format: 'int32',
        description: 'HTTP code that provide standarized information about the error',
        example: 500
      },
      message: {
        type: 'string',
        description: 'Expanded information about the error',
        example: 'Internal Server Error'
      }
    }
  }
}
