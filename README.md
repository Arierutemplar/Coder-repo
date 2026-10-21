# Tumoto Store MX

Aplicación web de comercio electrónico para explorar motocicletas, refacciones y accesorios. El proyecto está construido con React y Vite, obtiene el catálogo público desde Cloud Firestore y contempla el procesamiento de pedidos en Firebase Cloud Functions del lado del servidor.

> **Estado del proyecto:** catálogo, detalle de producto, carrito y base del checkout están implementados. Las reglas de Firestore ya están desplegadas en `tumoto-store`. El procesamiento de pedidos y la expiración automática están implementados en código, pero requieren desplegar Cloud Functions; Firebase bloqueó ese despliegue porque el proyecto está en el plan Spark. No se cobran pagos.

## Funcionalidades

### Catálogo y navegación

- Lectura de productos desde la colección `items` de Cloud Firestore.
- Búsqueda por nombre, descripción o categoría.
- Filtro por categoría y disponibilidad.
- Orden por precio ascendente/descendente y nombre.
- Conteo de resultados y estados diferenciados de carga, error y catálogo vacío.
- Vista de detalle por producto con precio, descripción, categoría y stock observado.
- Imágenes con carga diferida y una imagen alternativa si falla la URL de origen.
- Navegación SPA con React Router, páginas informativas y una vista para rutas inexistentes.

### Carrito y checkout

- Carrito global de React persistido en `localStorage`.
- Validación de datos persistidos para descartar entradas mal formadas o cantidades no válidas.
- Restricción de cantidades al stock observado y controles para modificar o quitar artículos.
- Validación del formulario de contacto y confirmación del correo.
- El cliente envía al servidor únicamente los identificadores de producto y las cantidades solicitadas; no es autoridad para fijar el precio final.

### Procesamiento de pedidos previsto

La Cloud Function `createOrder`:

- exige un token de Firebase App Check;
- valida los datos del comprador, identificadores y cantidades;
- consulta nuevamente precio y stock en Firestore;
- calcula el total en el servidor;
- crea el pedido y descuenta existencias dentro de una transacción;
- usa un identificador de solicitud para evitar duplicar pedidos ante reintentos.

La función programada `expirePendingOrders` revisa periódicamente pedidos pendientes, los marca como expirados después de 24 horas y devuelve las unidades reservadas al inventario.

> Estas funciones no están activas en el proyecto remoto hasta completar el despliegue. Los pedidos son solicitudes pendientes, no pagos confirmados. No hay integración con una pasarela de pago.

## Tecnologías

- **Interfaz:** React, React Router, React Bootstrap y Bootstrap.
- **Iconografía:** Lucide React.
- **Herramientas de desarrollo:** Vite, ESLint y Node.js.
- **Backend como servicio:** Firebase Web SDK, Cloud Firestore, Firebase App Check y Cloud Functions de segunda generación.
- **Pruebas:** pruebas unitarias con el runner integrado de Node.js.
- **Integración continua:** GitHub Actions ejecuta lint, pruebas, auditorías de dependencias, build y comprobación de sintaxis de la función.

## Requisitos

- Node.js y npm para el cliente; Node.js 20 para las Cloud Functions.
- Una app web registrada en el proyecto Firebase `tumoto-store`, o la configuración de otro proyecto compatible.
- Firebase CLI para desplegar recursos.
- Para desplegar Cloud Functions se requiere el plan Firebase Blaze y la facturación correspondiente.

## Instalación y ejecución local

Desde la raíz de `Coder-repo`:

```bash
npm install
npm run dev
```

En Windows PowerShell, si la política local bloquea `npm.ps1`, usa `npm.cmd` en lugar de `npm`.

### Variables de entorno

Crea `.env.local` en la raíz del proyecto. El archivo debe contener la configuración de la app web de Firebase:

```dotenv
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_APPCHECK_SITE_KEY=...
```

La clave de App Check debe ser la **clave pública del sitio** registrada para el proveedor Enterprise. La clave secreta no debe estar en el cliente, en `.env.local`, en Git ni en documentación. Vite solo carga los cambios de entorno al iniciar; reinicia el servidor de desarrollo después de modificar el archivo. `.env.local` está excluido por Git.

## Modelo de datos de Firestore

### Colección `items`

Cada documento representa un producto y debe incluir:

| Campo | Tipo esperado | Uso |
|---|---|---|
| `title` | string | Nombre del artículo |
| `price` | number | Precio en MXN |
| `img` | string | URL de imagen |
| `category` | string | Categoría usada por los filtros |
| `description` | string | Descripción y búsqueda |
| `stock` | integer | Unidades disponibles |

El catálogo permite lecturas públicas. La edición de productos debe realizarse mediante un entorno administrativo confiable; las escrituras directas desde el navegador están bloqueadas.

### Colección `orders`

La función de servidor genera documentos con comprador, artículos, precios vigentes, subtotales, total, estado y marcas de tiempo. Los estados contemplados son `pending` y `expired`. El acceso de clientes a esta colección está bloqueado por las reglas actuales.

## Firebase y despliegue

La configuración de recursos está en `firebase.json`, las reglas en `firestore.rules` y el código de servidor en `functions/`. El alias local `default` apunta a `tumoto-store`.

Las reglas de Firestore para el catálogo y los pedidos ya fueron publicadas en el proyecto. Para publicar o actualizar las funciones:

```bash
firebase login
firebase use tumoto-store
npm --prefix functions ci
firebase deploy --only functions
```

Para publicar también las reglas:

```bash
firebase deploy --only firestore:rules
```

El despliegue de funciones fallará mientras el proyecto permanezca en Spark. Antes de desplegarlas, confirma que App Check Enterprise esté registrado para la app web y que la variable `VITE_FIREBASE_APPCHECK_SITE_KEY` contenga la clave de sitio correspondiente. La función Callable exige App Check y se ejecuta en `us-central1`.

## Comandos de calidad

```bash
npm run lint
npm test
npm run build
npm audit
```

Las pruebas actuales cubren validación del carrito persistido, límites de stock, edición de cantidades y cálculo de totales. La integración con Firestore, las reglas y las Cloud Functions todavía requiere pruebas de integración en emuladores o en un proyecto de pruebas.

## Seguridad y alcance pendiente

- Las reglas actuales permiten leer `items` y deniegan escrituras de clientes tanto en `items` como en `orders`. El Admin SDK de Cloud Functions aplica las operaciones privilegiadas del servidor.
- App Check reduce solicitudes no verificadas, pero no reemplaza autenticación, autorización, validación, controles antiabuso ni reglas de acceso.
- La clave Firebase de una app web no equivale a una credencial de servidor. Nunca incluyas credenciales de Admin SDK o claves secretas en el bundle del cliente.
- No se han implementado registro/inicio de sesión, perfiles de usuario, historial de pedidos, panel administrativo, carga de imágenes a Firebase Storage ni pagos.
- Antes de operar una tienda real, se debe integrar una pasarela de pago con confirmación en el servidor, definir el ciclo de vida del pedido y probar de extremo a extremo errores, concurrencia, permisos y expiración de reservas.
- Las imágenes del catálogo dependen de las URL guardadas en Firestore; para producción conviene administrarlas en un almacenamiento propio.
