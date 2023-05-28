# README

Este es el archivo README para el proyecto que utiliza la arquitectura en capas con el framework de Firebase de Google Cloud. El objetivo de este proyecto es procesar y persistir cierta información relacionada con imágenes.

## Configuración de Firebase

Antes de utilizar este proyecto, es necesario configurar Firebase. A continuación, se muestra un ejemplo de cómo configurar Firebase y los comandos necesarios:

1. Crear un proyecto en la [Consola de Firebase](https://console.firebase.google.com/).
2. Configurar las credenciales de autenticación para acceder al proyecto desde el entorno local o la nube.
3. Instalar Firebase CLI (Command Line Interface) si no está instalado:

```bash
npm install -g firebase-tools
```

4. Iniciar sesión en Firebase:

```bash
firebase login
```

5. Asociar el proyecto local con el proyecto en Firebase:

```bash
firebase use --add
```

6. Configurar las variables de entorno necesarias para el proyecto. Puedes crear un archivo `.env` en la raíz del proyecto y agregar las siguientes variables:

```plaintext
COLLECT_DB=<collect_firestore>
PROJECT_ID=<PROJECT_ID>
```

7. Ahora estás listo para ejecutar el proyecto tanto en entorno local como en la nube.

## Tecnologías utilizadas

El proyecto utiliza las siguientes tecnologías y servicios de Firebase:

- Node.js: Lenguaje de programación utilizado para el desarrollo del proyecto.
- Firebase Functions: Framework utilizado para implementar funciones en la nube.
- Firestore: Base de datos NoSQL de Firebase utilizada para almacenar la información.
- Cloud Storage: Servicio de almacenamiento en la nube de Google utilizado para guardar las imágenes procesadas.
- Jest y Supertest: Herramientas utilizadas para realizar pruebas de integración en el proyecto.

## Persistencia de información

La información se guarda en la base de datos de Firestore en el siguiente formato:

```json
{
  "image1024": {
    "fechaCreacion": "2023-05-28T14:39:17.545Z",
    "hash": "ea6f113b78313e980fec6ef809709b6f",
    "size": 1024,
    "urlDescarga": "https://storage.googleapis.com/proyecto-firebase.appspot.com/output/background-capitole/1024/ea6f113b78313e980fec6ef809709b6f.jpeg"
  },
  "image800": {
    "fechaCreacion": "2023-05-28T14:39:17.354Z",
    "hash": "ea5bff9fed8b1f24468c90df743f02ed",
    "size": 800,
    "urlDescarga": "https://storage.googleapis.com/proyecto-firebase.appspot.com/output/background-capitole/800/ea5bff9fed8b1f24468c90df743f02ed.jpeg"
  },
  "path": "/images/background-capitole.jpg",
  "taskId": 1685284754689,
  "timestampFinish": "2023-05-28T14:39:17.545Z",
  "timestampStart": "2023-05-28T14:39:14.689Z"
}
```

## Requisitos

Antes de utilizar este proyecto, asegúrate de cumplir con los siguientes requisitos:

- Descargar las credenciales de Firebase en formato JSON.
- Colocar el archivo de credenciales en la carpeta "-credentials" del proyecto.
- El archivo de credenciales debe tener el nombre "serviceAccountKey.json".

Puedes obtener las credenciales de Firebase siguiendo estos pasos:

1. Accede a la [Consola de Firebase](https://console.firebase.google.com/).
2. Selecciona tu proyecto y ve a la configuración del proyecto.
3. En la pestaña "Service Accounts" o "Cuentas de servicio", haz clic en "Generar nueva clave privada" o "Create new private key".
4. Se descargará un archivo JSON que contiene las credenciales de servicio. Asegúrate de que este archivo tenga el nombre "serviceAccountKey.json".
5. Coloca el archivo "serviceAccountKey.json" en la carpeta ".credentials" del proyecto, dentro de la carpeta "functions".

¡Importante! No compartas ni subas el archivo de credenciales a repositorios públicos. Mantenlo seguro y protegido.

## Configuración del Proyecto

1. Realiza la configuración de Firebase siguiendo las instrucciones mencionadas anteriormente en la sección "Configuración de Firebase".
2. Descarga las credenciales de Firebase en formato JSON y colócalas en la carpeta "-credentials" con el nombre "serviceAccountKey.json".
3. Asegúrate de que todas las dependencias del proyecto estén instaladas correctamente ejecutando `npm install` en la raíz del proyecto.
4. Realiza las pruebas unitarias y de integración ejecutando `npm test`.
5. Inicia el proyecto localmente o despliégalo en la nube utilizando los comandos correspondientes.

## Utilización del Proyecto

A continuación, se describe cómo utilizar el proyecto:

1. Ejecuta el proyecto en el entorno local o en la nube siguiendo las instrucciones proporcionadas en la sección correspondiente.
2. Realiza solicitudes POST para procesar imágenes. Asegúrate de proporcionar los parámetros requeridos, como `path` y, si es necesario, `saveLocal`.
3. Utiliza el método GET para obtener la informacion del procesamiento de una imagen utilizando su ID (taskId).
4. Verifica la persistencia de la información en Firestore y la ubicación de las imágenes en Cloud Storage.

Recuerda seguir las instrucciones de configuración y utilizar las rutas y parámetros adecuados según corresponda a tu entorno local o despliegue en la nube.

Para ejecitarlo en local, puede usar el siguiente comando:

```bash
firebase emulators:start --only functions
```

Para desplegar la funcion en la nube, puede usar el siguiente comando:

```bash
firebase deploy --only functions
```

### Utilización del método "POST"

Para utilizar el método "POST", puedes enviar una solicitud con los siguientes parámetros:

- `path` (obligatorio): Ruta de la imagen en formato "/images/nombre-de-la-imagen.jpg" o una URL desde la cual se puede descargar la imagen.

- `saveLocal` (opcional): Indica si se debe guardar la imagen localmente. Este parámetro solo lo tomara en cuenta cuando se ejecuta localmente.

Ejemplo de solicitud utilizando cURL:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "path": "/images/background-capitole.jpg",
    "saveLocal": true
  }' \
  http://localhost:5000/task
```

Si la función está desplegada en la nube, la URL de la solicitud sería diferente.

### Método "GET" para obtener el procesamiento por ID

El método "GET" se utiliza para obtener el procesamiento de una imagen utilizando su ID. La función consulta la base de datos de Firestore utilizando el documentId (taskId => fecha de creacion de la tarea en formato UNIX) y devuelve un JSON con los datos guardados.

Ejemplo de solicitud utilizando cURL:

```bash
curl -X GET \
  http://localhost:5000/task/{taskId}
```

La URL incluirá el ID del documento que deseas consultar.

Recuerda reemplazar `http://localhost:5000` por la URL correspondiente si la función está desplegada en la nube.

## Estructura de carpetas para las imágenes

Para guardar las imágenes, se mantiene un formato de estructura de carpetas tanto en entorno local como en la nube.

- En entorno local, las imágenes se guardan en la carpeta `/output` en la raíz del proyecto.

- En la nube, las imágenes se guardan en Cloud Storage. El directorio base es el "bucket" de Cloud Storage, y se sigue la misma estructura de carpetas que en entorno local.

## Estructura del Proyecto

El código fuente de las funciones se encuentra en la carpeta "functions". A continuación, se describe la estructura de carpetas relevante para el proyecto:

- `functions/`: Contiene el código fuente de las funciones.
  - `src/`: Carpeta principal que contiene los archivos de código fuente.
    - `index.js`: Archivo principal que define las funciones y la lógica del proyecto.
  - `test/`: Carpeta que contiene las pruebas unitarias y pruebas de integración del proyecto.

## Pruebas Unitarias y de Integración

Se han creado pruebas unitarias utilizando Jest y Supertest para validar la estructura del código y asegurar el correcto funcionamiento de las funciones. Estas pruebas se encuentran en la carpeta "test" dentro de la carpeta "functions". Se han realizado tanto pruebas integrales sin mockear como pruebas con mocks para simular ciertos comportamientos.

## Contacto

Si tienes alguna pregunta o sugerencia sobre este proyecto, no dudes en ponerte en contacto conmigo. Puedes enviar un correo electrónico a [david.culebra1990@gmail.com](david.culebra1990@gmail.com).

