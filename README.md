# **Proyecto de Monitoreo de Temperatura en Tiempo Real**

Este proyecto consiste en una aplicación de monitoreo de temperatura en tiempo real, que utiliza Node.js, Express, WebSocket (ws), MySQL y otras librerías. El sistema está compuesto por un backend (servidor) y un frontend (cliente).

Componentes del Proyecto
## Backend
El backend está desarrollado con Node.js y Express, y utiliza WebSocket para la comunicación en tiempo real. Además, se integra con una base de datos MySQL para almacenar y recuperar los datos de temperatura.

Dependencias
Node.js
Express
WebSocket (ws)
MySQL
Nodemon
Jsonwebtoken
Morgan
Dotenv

Configuración
Instalar las dependencias:
npm install

Configurar la conexión a la base de datos en el archivo '.env'. Ejemplo:
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_DATABASE=


Iniciar el servidor:
nodemon

El servidor estará escuchando en el puerto especificado en el archivo de configuración.


## Frontend
El frontend está desarrollado con Angular, Angular Material y utiliza AntV para la visualización de gráficos.

Dependencias
Angular
Angular Material
AntV
Otros módulos de Angular según sea necesario
Configuración
Asegúrese de tener Angular instalado:
npm install -g @angular/cli

Navegue al directorio frontend:
cd frontend

Instale las dependencias:
npm install

Inicie la aplicación Angular:
ng serve

La aplicación estará disponible en http://localhost:4200/.

## Uso del Frontend
Abra un navegador web y vaya a http://localhost:4200/.

El frontend se conectará automáticamente al servidor WebSocket y mostrará los datos de temperatura en tiempo real en un gráfico utilizando AntV.

Utilice la interfaz de Angular Material para seleccionar un rango de fechas y realizar consultas a la base de datos.
