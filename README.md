# Training

Una bitácora personal de entrenamiento en una sola página web (HTML, CSS y
JavaScript, sin frameworks ni backend). Todo se guarda en el navegador con
`localStorage`, así que corre igual abriendo el archivo directo o publicada
en GitHub Pages.

## Qué hace

- Permite crear, editar y eliminar rutinas semanales propias (nombre y
  grupos musculares por día) desde un selector con botones `+`/`✎`.
- Marca los días de entrenamiento completados.
- Muestra los grupos musculares y ejercicios de cada día, con un campo de
  peso (kg) por ejercicio que se conserva de una semana a la otra para ver
  si subes, bajas o mantienes.
- Deja agregar tus propios ejercicios a cada grupo muscular (además de los
  ejercicios base que trae el catálogo).
- Archiva las semanas cerradas en un historial con CRUD básico (crear al
  finalizar, editar días completados, eliminar), incluyendo una foto de los
  pesos usados esa semana.
- Muestra una gráfica simple (sparkline) de progreso por ejercicio, con la
  diferencia entre el primer y el último peso registrado.

## Uso

1. Abre `index.html` directo en el navegador, o publícalo con GitHub Pages
   (Settings → Pages → Deploy from a branch → `main` / `/root`).
2. La primera vez se crea sola una rutina de ejemplo ("Mi rutina") y su
   catálogo de ejercicios; puedes editarla o crear una nueva con `+`.
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

- `index.html` - toda la aplicación: HTML, CSS y JavaScript en un solo
  archivo, sin dependencias externas (salvo la tipografía de Google Fonts).

## Mejoras sugeridas

- Añadir import/export JSON para respaldos manuales (por si limpias el
  navegador o cambias de equipo).
- Permitir sincronización entre dispositivos, si algún día hace falta usar
  la app desde más de un navegador.

## Notas

- Todo (rutinas, ejercicios, historial y la semana en curso) vive en
  `localStorage`, por navegador y por equipo: si abres la app en otro
  navegador o limpias los datos del sitio, empieza de cero.
- No hay servidor ni base de datos real: es la opción más simple para uso
  personal y para poder alojarlo gratis en GitHub Pages.
