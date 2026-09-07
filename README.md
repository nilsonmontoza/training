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
- Deja agregar tus propios ejercicios a cada grupo muscular (además de los
  ejercicios base que trae el catálogo).
- Guarda la semana en curso en el navegador (`localStorage`).
- Archiva las semanas cerradas en un historial persistido en el servidor,
  con CRUD básico (crear al finalizar, editar días completados, eliminar),
  incluyendo una foto de los pesos usados esa semana.
- Muestra una gráfica simple (sparkline) de progreso por ejercicio, con la
  diferencia entre el primer y el último peso registrado.
- Al iniciar el servidor, abre automáticamente el navegador.

## Uso

1. Instala Node.js (no requiere dependencias externas).
2. Ejecuta `node server.js` (o `npm start`) desde la carpeta del proyecto;
   se abre solo el navegador en `http://localhost:3000` (si no, ábrelo a mano).
3. Elige una rutina en el selector, o usa `+` para crear una nueva: ponle
   nombre y toca los grupos musculares de cada día (sin ninguno marcado,
   el día queda como descanso). Usa `✎` para editar la rutina activa, y
   dentro del formulario de edición el botón `Eliminar rutina` la borra
   (siempre debe quedar al menos una).
4. Haz clic en el checkbox de cada día para marcarlo como completado.
5. Al abrir un día puedes anotar el peso (kg) usado en cada ejercicio, y
   agregar un ejercicio propio al grupo muscular con el campo `+` al final
   de la lista.
6. Usa el botón `Finalizar semana` para archivar la semana y reiniciar el contador.
7. En el historial puedes tocar el marcador (ej. `3/5`) para editar los días
   completados, o el botón `✕` para eliminar esa entrada. Debajo, en
   "Progreso por ejercicio", ves la tendencia de peso de cada ejercicio con
   al menos dos registros.

## Estructura

- `index.html` - interfaz completa con HTML, CSS y JavaScript.
- `server.js` - servidor HTTP plano en Node.js: sirve `index.html`, abre el
  navegador al arrancar, y expone las APIs `/api/historial`, `/api/rutinas`
  y `/api/ejercicios` (GET, POST, PUT/:id, DELETE/:id).
- `data/historial/`, `data/rutinas/` y `data/ejercicios/` - un archivo
  `.json` por documento (se crean automáticamente al iniciar el servidor,
  con una rutina "Mi rutina" y un catálogo de ejercicios base la primera
  vez; no se versionan en git).

## Mejoras sugeridas

- Permitir sincronización entre dispositivos usando una base de datos en la nube.
- Añadir import/export JSON para respaldos manuales del historial.
- Mover también la semana en curso al servidor, si se quiere usar desde
  varios dispositivos.

## Notas

- La semana en curso vive en `localStorage`; si abres la app desde otro
  navegador o equipo no la verás, pero el historial, las rutinas y el
  catálogo de ejercicios sí son compartidos porque viven en el servidor.
- El historial, las rutinas y los ejercicios son archivos JSON planos en
  `data/historial/`, `data/rutinas/` y `data/ejercicios/`; puedes
  inspeccionarlos o respaldarlos copiando esa carpeta.

