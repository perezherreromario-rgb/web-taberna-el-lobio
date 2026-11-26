# Taberna El Lobio · web

Web estática (HTML, CSS y JS sin dependencias) para Taberna El Lobio, Tanos y Torrelavega.
Concepto: «Dos barras, la misma casa».

## Publicar en Vercel
1. Sube esta carpeta a un repositorio de GitHub (por ejemplo `web-taberna-el-lobio`).
2. En Vercel: Add New → Project → importa el repositorio.
3. Framework preset: **Other**. Sin comando de build. Output directory: la raíz.
4. Deploy. Después, en Settings → Domains, añade el dominio (p. ej. tabernaellobio.com).

## Qué editar y dónde
- **Carta y precios:** `main.js`, constante `CARTA`. Cada plato es `[nombre, precio, descripción, etiqueta]`.
  Etiquetas: `'top'` (lo más pedido) y `'veg'` (vegano).
- **Horarios:** `main.js`, constante `LOCALES`. El "Abierto ahora" se calcula solo con la hora de Cantabria.
- **Teléfonos y direcciones:** `index.html` (portada, sección «Dónde estamos», pie y datos para Google) y `main.js`.
- **Fotos:** carpeta `img/`.

## Pendiente de confirmar con el cliente
- Precios: tomados de Glovo el 26-11-2026. En sala pueden ser más bajos.
- Horario de Tanos: Google muestra también un horario de pedidos con descanso el miércoles.
- Platos de sala que no salen en Glovo (p. ej. tarta pasiega en Torrelavega).
- Permiso para citar opiniones de Google.
- Más fotos: interior, fachadas y equipo (ahora solo hay una foto buena del bocadillo).
- Dominio definitivo (en el marcado para Google figura `tabernaellobio.com` como provisional).
