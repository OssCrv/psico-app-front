# FrontendPsicoApp

Este proyecto fue generado con [Angular CLI](https://github.com/angular/angular-cli) versión 20.3.7 y ofrece un panel administrativo para gestionar la información del backend `psico-app`.

## Características principales

- Inicio de sesión con las credenciales del backend y almacenamiento automático del token JWT.
- Panel resumen con métricas rápidas de edificios, consultorios, terapeutas y reservas.
- CRUD completo para edificios, consultorios, terapeutas y reservas.
- Formularios reactivos con validaciones y mensajes de retroalimentación.
- Interceptor HTTP que adjunta el token JWT a todas las peticiones autenticadas.

La URL base de las peticiones apunta a `http://localhost:8090/api`. Ajusta este valor en `src/app/core/constants/api.constants.ts` si tu backend corre en otra ruta.

## Puesta en marcha

Instala las dependencias y levanta el servidor de desarrollo:

```bash
npm install
ng serve
```

El panel quedará disponible en `http://localhost:4200/`.

## Flujo de autenticación

1. Registra un usuario administrador en el backend con contraseña encriptada.
2. Inicia sesión desde `/login` con esas credenciales; el token se guardará automáticamente.
3. Una vez autenticado podrás acceder al panel y gestionar todos los recursos.
4. Usa el botón "Cerrar sesión" del encabezado para limpiar el token almacenado.

## Ejecución de pruebas unitarias

```bash
npm test -- --watch=false
```

> **Nota:** En este entorno no hay un binario de Chrome instalado, por lo que las pruebas unitarias mediante Karma pueden fallar al intentar abrir el navegador.

## Generación de build de producción

```bash
ng build
```

Los artefactos quedarán disponibles en el directorio `dist/`.

## Recursos adicionales

Consulta la [documentación oficial de Angular CLI](https://angular.dev/tools/cli) para profundizar en los comandos disponibles.
