# Training

Una bitácora personal de entrenamiento basada en una sola página web, con un
pequeño servidor Node.js (sin dependencias) que guarda el historial de
semanas completadas como documentos JSON en disco.

## Qué hace

- Permite crear, editar y eliminar rutinas semanales propias (nombre y
  grupos musculares por día) desde un selector con botones `+`/`✎`.
- Marca los días de entrenamiento completados.
- Muestra los grupos musculares y ejercicios de cada día, con un campo de
  peso (kg) por ejercicio que se conserva de una semana a la otra para ver
  si subes, bajas o mantienes.
- Guarda la semana en curso en el navegador (`localStorage`).
- Archiva las semanas cerradas en un historial persistido en el servidor,
  con CRUD básico (crear al finalizar, editar días completados, eliminar),
  incluyendo una foto de los pesos usados esa semana para ver el progreso.

## Uso

1. Instala Node.js (no requiere dependencias externas).
2. Ejecuta `node server.js` (o `npm start`) desde la carpeta del proyecto.
3. Abre `http://localhost:3000` en el navegador.
4. Elige una rutina en el selector, o usa `+` para crear una nueva: ponle
   nombre y toca los grupos musculares de cada día (sin ninguno marcado,
   el día queda como descanso). Usa `✎` para editar la rutina activa, y
   dentro del formulario de edición el botón `Eliminar rutina` la borra
   (siempre debe quedar al menos una).
5. Haz clic en el checkbox de cada día para marcarlo como completado.
6. Usa el botón `Finalizar semana` para archivar la semana y reiniciar el contador.
7. En el historial puedes tocar el marcador (ej. `3/5`) para editar los días
   completados, o el botón `✕` para eliminar esa entrada.

## Estructura

- `index.html` - interfaz completa con HTML, CSS y JavaScript.
- `server.js` - servidor HTTP plano en Node.js: sirve `index.html` y expone
  las APIs `/api/historial` y `/api/rutinas` (GET, POST, PUT/:id, DELETE/:id).
- `data/historial/` y `data/rutinas/` - un archivo `.json` por documento
  (se crean automáticamente al iniciar el servidor, con una rutina
  "Mi rutina" de ejemplo la primera vez; no se versionan en git).

## Mejoras sugeridas

- Permitir sincronización entre dispositivos usando una base de datos en la nube.
- Añadir import/export JSON para respaldos manuales del historial.
- Mover también la semana en curso al servidor, si se quiere usar desde
  varios dispositivos.

## Notas

- La semana en curso vive en `localStorage`; si abres la app desde otro
  navegador o equipo no la verás, pero el historial sí es compartido porque
  vive en el servidor.
- El historial y las rutinas son archivos JSON planos en `data/historial/`
  y `data/rutinas/`; puedes inspeccionarlos o respaldarlos copiando esa carpeta.

