# Training

Una bitácora personal de entrenamiento basada en una sola página web, con un
pequeño servidor Node.js (sin dependencias) que guarda el historial de
semanas completadas como documentos JSON en disco.

## Qué hace

- Muestra la rutina semanal fija (Lunes a Viernes, con Sábado/Domingo de descanso).
- Marca los días de entrenamiento completados.
- Muestra los grupos musculares y ejercicios de cada día.
- Guarda la semana en curso en el navegador (`localStorage`).
- Archiva las semanas cerradas en un historial persistido en el servidor,
  con CRUD básico (crear al finalizar, editar días completados, eliminar).

## Uso

1. Instala Node.js (no requiere dependencias externas).
2. Ejecuta `node server.js` (o `npm start`) desde la carpeta del proyecto.
3. Abre `http://localhost:3000` en el navegador.
4. Haz clic en el checkbox de cada día para marcarlo como completado.
5. Usa el botón `Finalizar semana` para archivar la semana y reiniciar el contador.
6. En el historial puedes tocar el marcador (ej. `3/5`) para editar los días
   completados, o el botón `✕` para eliminar esa entrada.

## Estructura

- `index.html` - interfaz completa con HTML, CSS y JavaScript.
- `server.js` - servidor HTTP plano en Node.js: sirve `index.html` y expone
  la API `/api/historial` (GET, POST, PUT/:id, DELETE/:id).
- `data/historial/` - un archivo `.json` por semana completada (se crea
  automáticamente al iniciar el servidor; no se versiona en git).

## Mejoras sugeridas

- Permitir sincronización entre dispositivos usando una base de datos en la nube.
- Añadir import/export JSON para respaldos manuales del historial.
- Mover también la semana en curso al servidor, si se quiere usar desde
  varios dispositivos.

## Notas

- La semana en curso vive en `localStorage`; si abres la app desde otro
  navegador o equipo no la verás, pero el historial sí es compartido porque
  vive en el servidor.
- El historial son archivos JSON planos en `data/historial/`; puedes
  inspeccionarlos o respaldarlos copiando esa carpeta.

