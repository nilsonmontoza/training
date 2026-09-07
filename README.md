# Training

Una bitácora personal de entrenamiento en una sola página web (HTML, CSS y
JavaScript, sin frameworks ni backend). Todo se guarda en el navegador con
`localStorage`, así que corre igual abriendo el archivo directo o publicada
en GitHub Pages. Es también una PWA instalable: desde el celular puedes
agregarla a la pantalla de inicio y queda como una app normal, con ícono
propio y funcionando offline.

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
   (Settings → Pages → Deploy from a branch → `main` / `/root`). El service
   worker (`sw.js`) solo se registra cuando la app corre por `http(s)://`,
   no al abrir el archivo directo con `file://` (limitación normal del
   navegador, la app funciona igual sin él).
2. Desde el celular, con la app abierta en Chrome/Safari vía GitHub Pages,
   usa "Agregar a pantalla de inicio" para instalarla como una app: queda
   con su propio ícono y abre en modo standalone (sin la barra del navegador).
3. La primera vez se crea sola una rutina de ejemplo ("Mi rutina") y su
   catálogo de ejercicios; puedes editarla o crear una nueva con `+`.
4. Elige una rutina en el selector, o usa `+` para crear una nueva: ponle
   nombre y toca los grupos musculares de cada día (sin ninguno marcado,
   el día queda como descanso). Usa `✎` para editar la rutina activa, y
   dentro del formulario de edición el botón `Eliminar rutina` la borra
   (siempre debe quedar al menos una).
5. Haz clic en el checkbox de cada día para marcarlo como completado.
6. Al abrir un día puedes anotar el peso (kg) usado en cada ejercicio, y
   agregar un ejercicio propio al grupo muscular con el campo `+` al final
   de la lista.
7. Usa el botón `Finalizar semana` para archivar la semana y reiniciar el contador.
8. En el historial puedes tocar el marcador (ej. `3/5`) para editar los días
   completados, o el botón `✕` para eliminar esa entrada. Debajo, en
   "Progreso por ejercicio", ves la tendencia de peso de cada ejercicio con
   al menos dos registros.

## Estructura

- `index.html` - toda la aplicación: HTML, CSS y JavaScript en un solo
  archivo, sin dependencias externas (salvo la tipografía de Google Fonts).
- `manifest.json` - metadata de la PWA (nombre, íconos, colores, modo standalone).
- `sw.js` - service worker que cachea el shell de la app para que abra offline.
- `icons/` - íconos de la app (192, 512 y una variante "maskable" para Android).

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
