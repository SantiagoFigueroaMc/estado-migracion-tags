// 1. INICIALIZACIÓN DE ESTADOS
// Los tres estados posibles en ciclo continuo
const THEMES = ['light', 'dark', 'auto']; 
let currentThemeIndex = 0;

const root = document.documentElement;

// 2. LEER PREFERENCIA GUARDADA
const savedTheme = localStorage.getItem('theme-mode') || 'auto';
currentThemeIndex = THEMES.indexOf(savedTheme);

// Aplicar el tema inmediatamente al cargar para evitar parpadeos
applyTheme(savedTheme);

// 3. CREAR E INYECTAR EL BOTÓN FLOTANTE DINÁMICAMENTE
document.addEventListener('DOMContentLoaded', () => {
  // Crear el contenedor del botón
  const button = document.createElement('button');
  button.id = 'theme-floating-toggle';
  
  // Añadir estilos CSS directamente para que sea 100% independiente
  Object.assign(button.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: '9999',
    padding: '10px 16px',
    borderRadius: '50px',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--bg-surface)',
    color: 'var(--text)',
    cursor: 'pointer',
    fontFamily: 'system-ui, sans-serif',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    transition: 'transform 0.2s, background-color 0.3s, color 0.3s',
  });

  // Efecto hover simple
  button.onmouseenter = () => button.style.transform = 'scale(1.05)';
  button.onmouseleave = () => button.style.transform = 'scale(1)';

  // Actualizar el texto inicial del botón
  updateButtonText(button, savedTheme);

  // Evento de clic para alternar entre: Claro -> Oscuro -> Auto
  button.addEventListener('click', () => {
    currentThemeIndex = (currentThemeIndex + 1) % THEMES.length;
    const nextTheme = THEMES[currentThemeIndex];
    
    applyTheme(nextTheme);
    updateButtonText(button, nextTheme);
    localStorage.setItem('theme-mode', nextTheme);
  });

  // Insertar el botón en el body de la página
  document.body.appendChild(button);
});

// 4. LÓGICA DE APLICACIÓN DE TEMAS
function applyTheme(theme) {
  // Limpiar clases previas
  root.classList.remove('light-mode', 'dark-mode');

  if (theme === 'light') {
    root.classList.add('light-mode');
  } else if (theme === 'dark') {
    root.classList.add('dark-mode');
  } else if (theme === 'auto') {
    // Si es auto, la configuración de tu CSS @media (prefers-color-scheme) toma el control automáticamente
    // Eliminamos las clases manuales para que el navegador decida
  }
}

// 5. ACTUALIZAR EL TEXTO O ICONO DEL BOTÓN
function updateButtonText(btn, theme) {
  if (theme === 'light') btn.innerHTML = '☀️ Claro';
  if (theme === 'dark') btn.innerHTML = '🌙 Oscuro';
  if (theme === 'auto') btn.innerHTML = '⚙️ Auto';
}

// 6. ESCUCHAR CAMBIOS DEL SISTEMA OPERATIVO
// Si el usuario está en "Auto", el tema cambia en tiempo real si el sistema cambia
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  const currentSaved = localStorage.getItem('theme-mode') || 'auto';
  if (currentSaved === 'auto') {
    applyTheme('auto');
  }
});
