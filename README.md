# Training

Una bitácora personal de entrenamiento basada en una sola página web.

## Qué hace

- Selecciona una rutina semanal.
- Marca los días de entrenamiento completados.
- Muestra los grupos musculares y ejercicios de cada día.
- Guarda el estado actual en el navegador.
- Archiva las semanas cerradas en un historial.

## Uso

1. Abre `index.html` en el navegador.
2. Elige una rutina en el selector.
3. Haz clic en el checkbox de cada día para marcarlo como completado.
4. Usa el botón `Finalizar semana` para archivar la semana y reiniciar el contador.

## Estructura

- `index.html` - aplicación completa con HTML, CSS y JavaScript.

## Mejoras sugeridas

- Añadir un backend local con Node.js y SQLite para almacenar datos en disco.
- Permitir sincronización entre dispositivos usando una base de datos en la nube.
- Añadir import/export JSON para respaldos manuales.

## Notas

- Actualmente la persistencia se hace con `localStorage` en el navegador.
- Si se cierra el navegador, los datos siguen disponibles en el mismo equipo y navegador.

