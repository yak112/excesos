# Calculadora de excesos

## DESCRIPCIÓN
Este proyecto consiste en una página web que calcula los excesos de jornada generados conforme a lo estipulado en el Acuerdo de Desarrollo Profesional.
Está pensada para servirse a través de Node.js. Se usan varios paquetes que se pueden obtener a través de NPM. Además la página web usa Bootstrap.


## ESTRUCTURA y FUNCIONAMIENTO
```
index.js -> Lógica creada para el servidor Node.js. Procesa las peticiones y genera las respuestas del servidor.
| /web -> En este directorio se encuentran los archivos estáticos.
 | /css -> Directorio de las hojas de estilo CSS.
 | /js -> Directorio para archivar los scripts JS.
 | /files -> Directorio donde se encuentra la plantilla PDF.
 | /tmp -> Directorio en el que se generan temporalmente los archivos PDF a servir.
 index.html -> Página HTML con la lógica de la calculadora programada en Javascript.
 ```
 
 
## DEPENDENCIAS
- Bootstrap para la página web.
- Paquetes NPM:
  - Express
  - Formidable
  - pdfFiller
  - @supercharge/strings
  
  
### Proyecto publicado bajo licencia GPLv3
