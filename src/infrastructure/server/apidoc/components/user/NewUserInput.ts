export const newUserInputComponent = {
  NewUserInput: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: {
        type: 'string',
        description: 'New user contact email that will be turned into its username.',
        example: 'trenton.kutch@mail.com'
      },
      password: {
        type: 'string',
        example: '123456'
      }
    }
  }
}
