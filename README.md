# Presentado por:
- Francisca Abarca
- Fabián Solis
- Claudio Toledo
# LirArt - app de ventas para artistas

##  Índice
1. [Resumen del Proyecto](#resumen-del-proyecto)
2. [Requerimientos](#requerimientos)
3. [Arquitectura de la Información](#arquitectura-de-la-información)
3. [Diseño de prototipos](#prototipo-de-diseño)
4. [Librerías en Angular](#liberías-usadas-con-angular)

## Resumen del Proyecto

LirArt es una aplicación diseñada como una plataforma social y/o marketplace para artistas e ilustradores. Permite a los usuarios registrarse, iniciar sesión, explorar un feed de publicaciones, ver perfiles de artistas (ilustradores), gestionar un carrito de compras y ver su propio perfil de cliente.

---
## Requerimientos

## Roles del Sistema
- **Clientes**: Usuario que navega, sigue artistas, compra productos, etc.
- **Ilustrador/Artista**: Usuario que comparte su portafolio, vende productos, interactúa con la comunidad.

## Requerimientos Funcionales por Rol

### Rol-Clientes e Ilustrador/Artista

- **RF-01 Configurar Cuenta**: Gestionar los ajustes de la Cuenta, incluyendo la modificación de datos personales y configuración general.
- **RF-03 Notificación a Usuarios**: Recibir notificaciones sobre eventos relevantes en la plataforma (nuevos seguidores, mensajes, etc.).
- **RF-04 Gestión de Perfil**: Ver y modificar la información de su propio perfil.
- **RF-05 Visualizar Carrito**: Ver el contenido de su carrito de compras.

### Rol-Ilustrador/Artista (Exclusivamente)

- **RF-02 Gestionar Portafolio**: Crear, modificar y eliminar elementos de su portafolio de trabajos visuales.

## Requerimientos No Funcionales

- **RNF-01 Seguridad del Sistema**: El sistema debe garantizar la protección de los datos de los usuarios, la integridad de la información y la seguridad de las transacciones.

- **RNF-02 Facilidad del uso del sistema**: La interfaz de usuario debe ser intuitiva, fácil de aprender y eficiente de usar para todos los roles de usuario (Ilustrador, Cliente).

---
## Arquitectura de la Información 
[Estructura de Navegación](https://lucid.app/lucidchart/52048c0c-5ebd-45f5-9524-b735edb62719/edit?viewport_loc=1158%2C-2225%2C2977%2C1468%2C0_0&invitationId=inv_65d3d8ff-7e17-477c-a441-e226e5f761ca)

---

## Prototipo de diseño 
[Figma - Prototipo de Gestión de Productos](https://www.figma.com/design/6ZVIfIzemC4NF6AdYI0A09/LIRART?node-id=0-1&t=o8Yzpi7ZE0VagcMH-1)

---
## Liberías usadas con Angular
* @angular/core
* @angular/common
* @angular/forms
* @angular/router
* @angular/platform-browser
* @ionic/angular
* RxJS
* Zone.js

## Tecnologías
- **Ionic Framework** (v7+)
- **Angular** (v19+)
- **TypeScript**
- **SASS** (para estilos (.scss))
- **RxJS** (para manejo reactivo (implícito en Angular))
- **Angular Router** (para navegación entre vistas)