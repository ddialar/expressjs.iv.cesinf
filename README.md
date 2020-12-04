# Taller de introducción a ExpressJS

## Requisitos del código

### Entorno mínimo

- NodeJS 12.19.0
- Docker y docker-compose
- Navegador web
- Editor de código

### Configuraciones adicionales

- nvm
- Postman o Insomnia REST

## Proceso de instalación

En el directorio donde vayamos a trabajar, ejecutamos la siguiente instrucción:

```sh
git clone https://github.com/ddialar/expressjs.iv.cesinf.git
cd expressjs.iv.cesinf
npm i
```

### Advertencia

Si hemos llegado a este punto y al abrir el código, el editor nos marca determinados errores en algunos arcivos de testing, es normal. Se debe a que estas suites de testing requiren de una serie de archivos de datos que no están presentes en el repositorio, sino que se generan automáticamente cada vez que se ejecutan los tests.

Si aún no queremos ejecutar los tests pero sí hacer que desaparezcan los errores, simplemente ejecutamos el siguiente script:

```sh
npm run test_mock:data
```

Esto generará los archivos que los archivos de testing están esperando pero debemos tener en cuenta que el contenido de estos archivos de datos para testing, se regeneran cada vez que lanzamos los tests.

## Proceso de verificación de la instalación

En la rama `master`, ejecutamos la siguiente instrucción:

```sh
# Ejecutamos los tests y todos deberían estar en verde
npm t
```

## Organización del taller

El repositorio está dividido en varias ramas en cada una de las cuales, realizaremos una tarea en específico.

- `master`, contiene todo el código de la API, listo para ejecutarse.
- `step-1-express-first-steps`, aquí emperzaremos desde cero a implementar el servidor basado en ExpressJS, crearemos el primer endpoint así como su test de integración.
- `step-2-express-login`, aquí implementaremos el endpoint que nos permitirá hacer login contra el servidor, así como sus test de integración.
- `step-3-express-get-profile`, aquí implementaremos el endpoint que nos permitirá recuperar los datos de perfil de un determinado usuario que esté autenticado, así como sus test de integración.
- `step-4-express-update-profile`, aquí crearemos un nuevo endpoint actualizar el perfil del usuario, así como sus test de integración.
- `step-5-swagger-configuration`, una vez hemos creado una serie de endpoints, pasaremos a preparar la documentación de la API.
- `step-6-swagger-login`, crearemos la documentación para este endpoint.
- `step-7-swagger-get-profile`, crearemos la documentación para este endpoint.
- `step-8-swagger-update-profile`, finalizaremos creando la documentación para este endpoint.

Si a medida que avancemos ves que te quedas atrás o por lo que sea, no puedes seguir las indicaciones, no te preocupes. En cuanto terminemos cada una de las partes acotadas a cada rama, guardermos los cambios realizados y pasaremos a la siguiente rama, donde todo lo anterior ya estará incluido. Esto te permitirá seguir las indicaciones sin arrastrar bug o errores de tipado.

Recuerda en que cualquier caso, siempre tendrás a tu disposición el código íntegro de la aplicación en la rama `master`.

