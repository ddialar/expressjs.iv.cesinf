export const authenticatedUserComponent = {
  AuthenticatedUser: {
    type: 'object',
    required: ['token', 'username', 'avatar'],
    properties: {
      token: {
        type: 'string',
        example: 'JWT string'
      },
      username: {
        type: 'string',
        example: 'jane@doe.com'
      },
      avatar: {
        type: 'string',
        description: 'URL where the image is stored.',
        example: 'https://cdn.icon-icons.com/icons2/1736/PNG/128/4043247-1-avatar-female-portrait-woman_113261.png'
      }
    }
  }
}
