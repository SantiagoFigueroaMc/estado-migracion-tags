## 📌 Contexto del Proyecto: Plantilla Base Multi-página
Estamos desarrollando un sitio web multi-página que utiliza componentes desacoplados e inyectados dinámicamente mediante JavaScript. Cada nuevo archivo HTML que se genere debe ser estrictamente compatible con esta arquitectura, incluyendo las hojas de estilo y los scripts globales en su estructura.
## 1. Requisitos Obligatorios del <head>
Todo archivo HTML debe incluir las siguientes llamadas en el orden exacto para evitar parpadeos visuales (FOUC):

* Hoja de estilos global: <link rel="stylesheet" href="/styles/styles.css">
* Script de tema: <script src="/scripts/theme.js"></script> (Invocado sin defer ni async para procesar el modo de color antes del renderizado). [1] 

## 2. Componentes Automatizados por Script
No se deben crear estructuras HTML manuales para los siguientes elementos, ya que sus respectivos scripts se encargan de inyectarlos y estilizarlos dinámicamente en el DOM:

* Botón de Tema: Controlado por theme.js. Genera un botón flotante en la esquina inferior derecha que alterna cíclicamente entre los modos Claro, Oscuro y Auto, leyendo y guardando la configuración en localStorage.
* Navegación: Controlada por un script global de navegación (ej. navigation.js). Inyecta el menú de forma automática en todas las páginas.

## 3. Instrucción para Nuevas Páginas HTML
Cuando te pida crear una nueva interfaz o archivo HTML, debes estructurarlo siguiendo este esquema base:

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Título de la Página]</title>
  <link rel="stylesheet" href="/styles/styles.css">
  <script src="/scripts/theme.js"></script>
  <script src="/scripts/navigation.js"></script>
</head>
<body>
  <main>
    <!-- Contenido específico de la página -->
  </main>
</body>
</html>

