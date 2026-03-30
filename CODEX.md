# CODEX

Memoria viva del proyecto `dashboard-operativo`.

Este archivo debe leerse al inicio de cada nueva sesion de trabajo para recuperar el contexto funcional, visual y operativo del proyecto. Tambien debe actualizarse cada vez que cambien reglas, estructura, pantallas o decisiones importantes.

## Objetivo del proyecto

Construir un dashboard operativo en GitHub Pages para visualizar embarques del equipo de Miguel a partir de archivos Excel que se cargan manualmente.

El dashboard debe:

- leer un Excel de embarques
- filtrar solo registros del equipo definido
- usar `Codigo de Embarque` como identificador unico
- actualizar automaticamente el estatus cuando se suba un Excel nuevo
- conservar registros historicos aunque ya no aparezcan en la ultima carga
- marcar esos casos como `Ya no viene en archivo`
- separar la vista en una pestaña `General` y pestañas por mes
- calcular el mes a partir del codigo del embarque
- clasificar el servicio a partir del prefijo del codigo

## Preferencias del usuario

Preferencias explicitadas por Miguel hasta ahora:

- El repo debe vivir en GitHub y publicarse por GitHub Pages.
- El dashboard sera de uso interno desde navegador.
- La fuente principal de datos sera un archivo Excel real que se subira dia a dia o cada cierto tiempo.
- Solo deben mostrarse embarques del equipo, definidos por la columna `Creado por`.
- El equipo visible actual es:
  - `Joselyn Valdez`
  - `Rodrigo Alanis`
  - `Luz Adriana Calatrava`
  - `Brenda Rodriguez`
- El identificador unico de cada embarque es la columna `A`: `Codigo de Embarque`.
- Solo interesa mostrar el estatus mas reciente; por ahora no se guarda historial de cambios por evento.
- Si un embarque ya no aparece en un Excel nuevo, no debe borrarse; debe marcarse como `Ya no viene en archivo`.
- El mes del embarque se obtiene del codigo, por ejemplo `AA-202512-0096` se interpreta como `2025-12`.
- Debe existir una vista `General` y vistas por mes.
- Se quieren metricas utiles por tipo de servicio y por operacion, pero conviene implementarlas por fases.
- El trabajo debe hacerse paso a paso para no saturar el desarrollo ni mezclar demasiadas decisiones a la vez.

## Reglas de negocio definidas

### Identificacion de embarques

- Campo llave: `Codigo de Embarque`
- Ejemplo de estructura del codigo: `AA-202512-0096`
- Formato esperado:
  - prefijo de clasificacion
  - anio y mes
  - consecutivo

### Filtro de equipo

Se usan solo filas cuyo valor en `Creado por` sea exactamente uno de estos nombres:

- `Joselyn Valdez`
- `Rodrigo Alanis`
- `Luz Adriana Calatrava`
- `Brenda Rodriguez`

### Regla de persistencia

- Si el embarque ya existe y vuelve a llegar en un Excel nuevo, se actualiza con la informacion mas reciente.
- Si el embarque existia antes y no llega en el nuevo Excel, se conserva en almacenamiento local y se marca con `missingInLatestUpload = true`.
- En interfaz, esa condicion se muestra como `Ya no viene en archivo`.

### Regla de embarques vivos

Actualmente se consideran cerrados estos estatus:

- `Embarque Finalizado`
- `Entregado`
- `Embarque Cancelado`

Todo lo demas se trata como vivo en esta primera version.

Nota: esta regla probablemente debera afinarse mas adelante con operacion real.

## Estructura actual del proyecto

Raiz del proyecto:

- [README.md](C:\Users\Miguel Lomeli\OneDrive - Multitraslados Internacionales SA de CV\Documentos\New project\README.md)
- [index.html](C:\Users\Miguel Lomeli\OneDrive - Multitraslados Internacionales SA de CV\Documentos\New project\index.html)
- [styles.css](C:\Users\Miguel Lomeli\OneDrive - Multitraslados Internacionales SA de CV\Documentos\New project\styles.css)
- [app.js](C:\Users\Miguel Lomeli\OneDrive - Multitraslados Internacionales SA de CV\Documentos\New project\app.js)
- [CODEX.md](C:\Users\Miguel Lomeli\OneDrive - Multitraslados Internacionales SA de CV\Documentos\New project\CODEX.md)
- [.gitignore](C:\Users\Miguel Lomeli\OneDrive - Multitraslados Internacionales SA de CV\Documentos\New project\.gitignore)

No existen subcarpetas de aplicacion todavia. Por ahora es una app estatica simple pensada para GitHub Pages.

## Que hace cada archivo

### [index.html](C:\Users\Miguel Lomeli\OneDrive - Multitraslados Internacionales SA de CV\Documentos\New project\index.html)

Es la unica pagina de la app actualmente. Define:

- encabezado principal
- tarjeta para cargar archivo Excel
- panel lateral de filtros
- pestañas de navegacion por mes
- tarjetas de metricas
- secciones de desglose por estatus y por servicio
- tabla principal de embarques
- ayuda contextual para explicar que cada carga nueva se mezcla con la base actual

Tambien carga:

- `styles.css`
- `app.js`
- la libreria SheetJS desde CDN para leer archivos Excel en navegador

### [styles.css](C:\Users\Miguel Lomeli\OneDrive - Multitraslados Internacionales SA de CV\Documentos\New project\styles.css)

Contiene toda la presentacion visual de la primera version del dashboard:

- variables CSS de color
- layout principal
- hero
- panel lateral
- cards de metricas
- estilos de tabla
- barras de desglose
- responsive basico para pantallas angostas

### [app.js](C:\Users\Miguel Lomeli\OneDrive - Multitraslados Internacionales SA de CV\Documentos\New project\app.js)

Contiene toda la logica cliente del dashboard:

- definicion del equipo permitido
- catalogo de nomenclaturas por prefijo
- definicion inicial de estatus cerrados
- lectura del Excel via SheetJS
- normalizacion de encabezados del Excel
- filtrado por equipo
- merge por `Codigo de Embarque`
- persistencia en `localStorage`
- calculo de mes desde el codigo
- clasificacion por tipo de servicio
- render de metricas
- render de pestañas `General` y por mes
- render de tabla y filtros

### [README.md](C:\Users\Miguel Lomeli\OneDrive - Multitraslados Internacionales SA de CV\Documentos\New project\README.md)

Documentacion corta de uso y despliegue:

- objetivo del dashboard
- reglas actuales
- publicacion en GitHub Pages
- siguiente etapa sugerida

### [.gitignore](C:\Users\Miguel Lomeli\OneDrive - Multitraslados Internacionales SA de CV\Documentos\New project\.gitignore)

Ignora archivos comunes de Node, logs, builds, entornos y configuraciones locales de editor.

### [CODEX.md](C:\Users\Miguel Lomeli\OneDrive - Multitraslados Internacionales SA de CV\Documentos\New project\CODEX.md)

Memoria operativa del proyecto para futuras sesiones.

## Secciones y pantallas actuales

Actualmente existe una sola pagina principal:

### Dashboard principal

Secciones visibles:

- Hero superior con descripcion del objetivo
- Tarjeta de carga de Excel
- Boton para limpiar almacenamiento local
- Pestañas:
  - `General`
  - meses detectados dinamicamente desde el codigo de embarque
- Filtros:
  - busqueda libre
  - estatus
  - creado por
  - tipo de servicio
  - solo vivos
  - solo `Ya no viene en archivo`
- Metricas:
  - total visibles
  - vivos
  - no vienen en ultima carga
  - meses activos
- Desgloses:
  - por estatus
  - por servicio
- Tabla principal de embarques

No hay rutas multiples, login, backend, API ni base de datos externa en esta version.

## Decisiones de diseño visual

### Enfoque general

Se eligio una interfaz estatica con personalidad visual clara, no generica, apta para GitHub Pages y para carga local de archivos.

### Tipografias

- Titulares: `Space Grotesk`
- Texto general: `IBM Plex Sans`

Razon:

- dar un tono moderno y operativo
- evitar apariencia demasiado generica
- mantener buena legibilidad en escritorio

### Colores

Paleta principal definida en CSS:

- fondo calido claro
- acento terracota (`--accent`)
- verde olivo (`--olive`)
- tinta azul oscuro (`--ink`)
- superficies claras semitransparentes con blur

Intencion:

- sentirse mas editorial y menos plantilla corporativa generica
- mantener contraste suficiente para trabajo operativo
- diferenciar metricas, estados y barras visuales sin cargar demasiado la pantalla

### Layout

Estructura actual:

- hero superior en dos columnas
- hero mas compacto para no consumir demasiado espacio vertical
- panel lateral izquierdo sticky con filtros y tabs
- contenido principal a la derecha
- tarjetas para metricas y desgloses
- tabla como area principal de trabajo

### Estilo visual

- tarjetas con efecto glass suave
- esquinas redondeadas
- sombras amplias
- fondo con gradientes y manchas sutiles
- barras simples para desgloses
- pills para estatus y estados especiales

## Datos y nomenclaturas aprendidas

### Columnas relevantes del Excel validadas

Del archivo real revisado:

- `Codigo de Embarque`
- `AWB`
- `Numero PRO`
- `Codigo de Cotización`
- `Estatus`
- `Creado por`
- `Ejecutivo de Operaciones`
- `Ejecutivo de Ventas`
- `Ejecutivo de Pricing`

Nota tecnica:

En `app.js` los encabezados se normalizan para tolerar acentos y diferencias menores de formato.

### Clasificacion por prefijo

El prefijo del `Codigo de Embarque` se usa para mapear descripcion y tipo de servicio.

Servicios actuales contemplados:

- `Aereo`
- `Maritimo`
- `Terrestre`
- `Proyecto`
- `Sin clasificar`

Hay claves activas e inactivas segun la tabla de nomenclaturas que proporciono Miguel.

## Estado actual de implementacion

La app ya fue creada y subida al repositorio en GitHub en la rama `main`.

Implementado:

- estructura base para GitHub Pages
- importacion de Excel desde navegador
- persistencia local
- actualizacion por codigo unico
- tabs por mes
- vista general
- filtros base
- metricas base
- clasificacion por servicio

Decision posterior:

- Se elimino el boton para borrar datos locales.
- La intencion del producto es conservar la base acumulada en navegador y seguir subiendo Excels encima de ese estado para observar cambios de estatus a lo largo del tiempo.

Pendiente o siguiente etapa probable:

- activar GitHub Pages en settings si aun no se ha hecho
- probar la carga real con archivos operativos
- ajustar mejor la definicion de embarques vivos
- agregar metricas mas ricas por servicio y clasificacion
- mostrar diferencias entre cargas
- mejorar UX con mensajes de exito, errores y ultimas actualizaciones

## Instruccion para futuras sesiones

Antes de empezar trabajo nuevo en este proyecto:

1. Leer este archivo completo.
2. Confirmar si cambiaron reglas de negocio o nuevos estatus.
3. Revisar si se agregaron nuevas pantallas o archivos.
4. Actualizar este documento al terminar cualquier cambio importante.

## Actualizacion reciente

Cambios funcionales agregados despues de la primera version:

- Se agrego una pestaña `Clientes`.
- La vista `Clientes` resume operaciones por cuenta sin reemplazar la vista por embarque.
- En esta primera entrega, `Clientes` incluye:
  - ranking de clientes por embarques vivos
  - ranking de clientes por prioridad alta
  - tabla resumen por cliente con total, vivos, prioridad alta, edad promedio y servicio dominante
- La tabla de `Clientes` ya permite hacer clic sobre un cliente para abrir abajo el detalle de sus embarques dentro de los filtros actuales.
- El detalle del cliente ahora se abre en formato acordeon debajo de la fila seleccionada, para evitar scroll largo hasta el final de la tabla.
- El listado de embarques dentro del detalle de cliente ya no usa una tabla larga; se rediseño como tarjetas compactas en grid para verse mas simetrico y legible.
- Las tarjetas del detalle de cliente ahora usan acentos visuales por prioridad y por estatus para identificar mas rapido urgencia y etapa operativa.
- El detalle de cliente ya incluye metricas rapidas propias:
  - embarques vivos
  - prioridad alta
  - edad promedio
  - servicio dominante
- El detalle de cliente tambien incluye un desglose por mes para ver en que periodos se concentra la carga del cliente.
- El detalle de cliente tambien incluye un desglose por estatus para ver en que etapa operativa esta su carga.
- La tabla principal ya no muestra `PRO` ni `AWB`.
- Ahora el `Cliente` debe verse junto al `Codigo de Embarque`.
- Se agrego una pestaña `Prioridad`.
- La pestaña `Prioridad` muestra solo embarques vivos y los ordena por una combinacion de:
  - antiguedad del mes del embarque
  - dias transcurridos desde la `Fecha Creación`
- El mes del embarque en `Prioridad` sigue saliendo del codigo del embarque, no de la fecha de creacion.
- Para soportar otras vistas, la app aun conserva `statusLastChangedAt`, pero `Prioridad` ya no depende de ese dato.
- La pestaña `Prioridad` ahora incluye una explicacion visual arriba de la tabla.
- La prioridad ya no se muestra solo como numero; tambien usa niveles `Alta`, `Media` y `Baja`.
- La tabla fue rediseñada para que la informacion respire mas:
  - primera columna mas ancha
  - cliente debajo del codigo
  - celdas secundarias con texto auxiliar
  - encabezado sticky
  - filas alternadas para facilitar lectura
- La disposicion general cambio para dar mas orden:
  - primero metricas y desgloses
  - despues vista, pestañas y filtros
  - al final la tabla
- Las metricas superiores se refinaron para verse mas ejecutivas:
  - color sutil por tipo de dato
  - etiqueta secundaria por tarjeta
  - acentos visuales circulares suaves
- El encabezado principal se simplifico a `Loadboard Multi / agentes`.
- El bloque superior se compacto para reducir espacio en blanco: titulo mas controlado, tarjeta de carga mas corta y sin alturas estiradas innecesarias.
- El bloque superior ahora reparte mejor el ancho: la marca vive en una columna angosta y `Actualizar base` gana mas presencia para verse mas simetrico con el titulo.
- Los desgloses del detalle de cliente ahora muestran conteo y porcentaje para comparar mas rapido.

Recordatorio de criterio actual:

- Un embarque de febrero que siga vivo debe aparecer con mayor prioridad que uno equivalente de marzo.
- Un embarque de inicios de marzo sigue contando como viejo, aunque menos que uno de febrero o enero.
