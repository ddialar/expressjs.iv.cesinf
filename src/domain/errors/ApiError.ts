interface IApiError {
  status: number
  message: string
  description?: string
}

export class ApiError extends Error implements IApiError {
  constructor (public status: number, public message: string, public description?: string) {
    super()
  }
}

/**
 * Implmementar un mapa de errorCodes para enviar al cliente de manera que
 * aunque podamos tener n>=2 401 (x ejemplo) le asociemos diferentes errorCode
 * en base a cada circunstancia.
 *
 * Esto códigos los tendrá mapeados el cliente y en función del locale del navegador
 * mostrará la consecuente traducción
 */
