const history = [];
const config = {
    weekdays_only: false
}
const form = document.getElementById('compare-form');
const inputInicio = document.getElementById('fechaInicio');
const inputFin = document.getElementById('fechaFin');
const inputDias = document.getElementById('diasDiferencia');

// Establece la fecha de hoy por defecto en el inicio
const hoy = new Date().toISOString().split('T')[0];
inputInicio.value = hoy;

// Establece la diferencia por default en 1
inputDias.value = 1;

function calcularDiferencia() {
    const inicio = new Date(inputInicio.value + 'T00:00:00');
    const fin = new Date(inputFin.value + 'T00:00:00');

    // Valida que ambas fechas existan y sean correctas
    if (!isNaN(inicio) && !isNaN(fin)) {
        if (config.weekdays_only) {
            // Cuenta solo días de semana entre las dos fechas
            let diasHabiles = 0;
            let actual = new Date(inicio);
            const paso = fin >= inicio ? 1 : -1;

            while (actual.getTime() !== fin.getTime()) {
                actual.setDate(actual.getDate() + paso);
                const diaSemana = actual.getDay();
                if (diaSemana !== 0 && diaSemana !== 6) { // Evita Domingo (0) y Sábado (6)
                    diasHabiles += paso;
                }
            }
            inputDias.value = diasHabiles;
        } else {
            const diferenciaTiempo = fin - inicio;
            // Convierte milisegundos a días enteros
            const diferenciaDias = Math.floor(diferenciaTiempo / (1000 * 60 * 60 * 24));
            inputDias.value = diferenciaDias;
        }
    } else {
        inputDias.value = '';
    }
}

function calcularFechaFin() {
    const inicio = new Date(inputInicio.value + 'T00:00:00');
    let dias = parseInt(inputDias.value, 10);

    // Valida que la fecha de inicio sea válida y los días sean un número
    if (!isNaN(inicio) && !isNaN(dias)) {
        if (config.weekdays_only) {
            // Suma o resta días saltando los fines de semana
            const paso = dias >= 0 ? 1 : -1;
            let diasPorSumar = Math.abs(dias);

            while (diasPorSumar > 0) {
                inicio.setDate(inicio.getDate() + paso);
                const diaSemana = inicio.getDay();
                if (diaSemana !== 0 && diaSemana !== 6) { // No es sábado ni domingo
                    diasPorSumar--;
                }
            }
        } else {
            // Añade los días a la fecha de inicio directamente
            inicio.setDate(inicio.getDate() + dias);
        }
        // Formatea el resultado a YYYY-MM-DD local
        const year = inicio.getFullYear();
        const month = String(inicio.getMonth() + 1).padStart(2, '0');
        const day = String(inicio.getDate()).padStart(2, '0');
        inputFin.value = `${year}-${month}-${day}`;
    } else {
        inputFin.value = '';
    }
}

function loadHistoryFromSessionStorage(){
    // Obtiene el historial desde session storage
    const storedHistory = sessionStorage.getItem('dateHistory');
    if (storedHistory) {
        // Convierte el string JSON de vuelta a un array
        const parsedHistory = JSON.parse(storedHistory);
        // Vacía el array actual y añade los elementos cargados
        history.length = 0;
        history.push(...parsedHistory);
    }
}

function saveCompareToSessionStorage(){
    // Solo guarda si los inputs de fecha tienen valores válidos
    if (!inputInicio.value || !inputFin.value) return;

    const data = {
        from: inputInicio.value,
        to: inputFin.value
    }
    
    // Agrega el nuevo registro al inicio del historial
    history.unshift(data);
    
    // Limita el historial a un máximo de 20 elementos
    if (history.length > 20) {
        history.pop();
    }
    
    // Guarda el historial serializado en session storage
    sessionStorage.setItem('dateHistory', JSON.stringify(history));
}

// read config from localstorage
function getConfigFromLocalStorage(){
    const storedConfig = localStorage.getItem('dateConfig');
    if (storedConfig) {
        try {
            const parsedConfig = JSON.parse(storedConfig);
            if (typeof parsedConfig.weekdays_only === 'boolean') {
                config.weekdays_only = parsedConfig.weekdays_only;
            }
        } catch (e) {
            console.error("Error leyendo la configuración de localStorage", e);
        }
    }
}

function onFormSubmit(e){
    // Evita el comportamiento por defecto si no quieres recargar la página inmediatamente
    e.preventDefault(); 
    
    // Guarda la comparación actual
    saveCompareToSessionStorage();
}

// Carga la configuración inicial antes de realizar cálculos
getConfigFromLocalStorage();

// Carga el historial existente al iniciar el script
loadHistoryFromSessionStorage();

// Inicializa la fecha de fin basada en el inputDias por defecto (1)
calcularFechaFin();

// Escucha cambios en ambos inputs de fecha
inputInicio.addEventListener('change', calcularDiferencia);
inputFin.addEventListener('change', calcularDiferencia);

// Escucha cambios en el input de diferencia
inputDias.addEventListener('input', calcularFechaFin);

// Escucha el evento de envío del formulario
if (form) {
    form.addEventListener('submit', onFormSubmit);
}
