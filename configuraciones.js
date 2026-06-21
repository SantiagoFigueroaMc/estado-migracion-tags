
        var settings = {
            mode: {
                normal: "Normal mode selected",
                pro: "Pro mode selected"
            }
        }
        let userSettings = {}
        function formFromJson(obj, currentPath = "") {
            var form = document.createElement("form");

            function createFields(currentObj, container, pathPrefix) {
                for (var key in currentObj) {
                    if (currentObj.hasOwnProperty(key)) {
                        var value = currentObj[key];
                        // Construir el camino completo (ej: "mode.normal")
                        var fullPath = pathPrefix ? `${pathPrefix}.${key}` : key;

                        // Si el valor es un objeto y no es nulo, creamos un <details>
                        if (typeof value === 'object' && value !== null) {
                            var details = document.createElement("details");
                            var summary = document.createElement("summary");

                            summary.textContent = key;
                            details.appendChild(summary);

                            createFields(value, details, fullPath);
                            container.appendChild(details);
                        } else {
                            // Contenedor del campo
                            var fieldWrapper = document.createElement("div");

                            var label = document.createElement("label");
                            label.textContent = key + ": ";

                            var input = document.createElement("input");
                            input.name = fullPath; // Guardamos el path en el atributo name

                            // Verificar si ya existe un valor modificado por el usuario
                            var savedValue = fullPath.split('.').reduce((o, i) => o?.[i], userSettings);
                            var displayValue = savedValue !== undefined ? savedValue : value;

                            // Configurar tipos de input
                            if (typeof value === "number") {
                                input.type = "number";
                                input.value = displayValue;
                            } else if (typeof value === "boolean") {
                                input.type = "checkbox";
                                input.checked = displayValue;
                            } else {
                                input.type = "text";
                                input.value = displayValue;
                            }

                            // Evento para guardar cambios en userSettings sólo si difieren del original
                            input.addEventListener("input", function (e) {
                                var targetPath = e.target.name;
                                var originalVal = targetPath.split('.').reduce((o, i) => o?.[i], settings);
                                var currentVal = e.target.type === "checkbox" ? e.target.checked : e.target.value;
                                if (e.target.type === "number") currentVal = Number(currentVal);

                                if (currentVal === originalVal) {
                                    // Si vuelve al valor original, se elimina de userSettings
                                    deleteFromSettings(userSettings, targetPath.split('.'));
                                } else {
                                    // Si cambia, se guarda en userSettings
                                    setToSettings(userSettings, targetPath.split('.'), currentVal);
                                }

                                saveUserSettingsToLocalStorage();
                            });

                            // Botón para resetear este campo individual
                            var resetButton = document.createElement("button");
                            resetButton.type = "button";
                            resetButton.textContent = "Reset";

                            // Al hacer click, vuelve al valor por defecto de 'settings'
                            resetButton.addEventListener("click", (function (inp, path, origVal) {
                                return function () {
                                    if (inp.type === "checkbox") {
                                        inp.checked = origVal;
                                    } else {
                                        inp.value = origVal;
                                    }
                                    deleteFromSettings(userSettings, path.split('.'));
                                    
                                    saveUserSettingsToLocalStorage();
                                };
                            })(input, fullPath, value));

                            label.appendChild(input);
                            fieldWrapper.appendChild(label);
                            fieldWrapper.appendChild(resetButton);
                            container.appendChild(fieldWrapper);
                        }
                    }
                }
            }

            // Funciones auxiliares para manipular objetos mediante arrays de claves (paths)
            function setToSettings(obj, pathArray, value) {
                var current = obj;
                for (var i = 0; i < pathArray.length - 1; i++) {
                    var key = pathArray[i];
                    if (!current[key]) current[key] = {};
                    current = current[key];
                }
                current[pathArray[pathArray.length - 1]] = value;
            }

            function deleteFromSettings(obj, pathArray) {
                var current = obj;
                var stack = [];

                for (var i = 0; i < pathArray.length - 1; i++) {
                    var key = pathArray[i];
                    if (!current[key]) return;
                    stack.push({ obj: current, key: key });
                    current = current[key];
                }

                delete current[pathArray[pathArray.length - 1]];

                // Limpiar objetos padres si quedaron vacíos
                for (var i = stack.length - 1; i >= 0; i--) {
                    var parent = stack[i].obj;
                    var parentKey = stack[i].key;
                    if (Object.keys(parent[parentKey]).length === 0) {
                        delete parent[parentKey];
                    } else {
                        break;
                    }
                }
            }

            createFields(obj, form, currentPath);
            return form;
        }

        function showSetting(path) {
            const value = path.split('.').reduce((obj, key) => obj?.[key], settings);
            const container = document.querySelector("article");

            if (value === undefined || value === null) {
                container.innerHTML = "Not found";
                return;
            }

            container.innerHTML = ""; // Limpiar panel principal
            let form;

            if (typeof value !== "object") {
                // --- SOLUCIÓN A CONFIGURACIONES INDIVIDUALES ---
                // Separamos la última propiedad del path padre (ej: "mode.normal" -> "mode" y "normal")
                const pathParts = path.split('.');
                const lastKey = pathParts.pop();
                const parentPath = pathParts.join('.');

                // Creamos un objeto ficticio temporal con el elemento individual
                const wrapperObj = { [lastKey]: value };

                // Llamamos a formFromJson pasándole el path padre para que construya bien las rutas de guardado
                form = formFromJson(wrapperObj, parentPath);
            } else {
                // Caso normal: es un objeto completo
                form = formFromJson(value, path);
            }

            container.appendChild(form);
        }

        function buildAside() {
            const aside = document.querySelector("aside");
            aside.innerHTML = ""; // Limpiar menú anterior si existiera

            function createMenu(currentObj, container, pathPrefix = "") {
                for (const key in currentObj) {
                    if (currentObj.hasOwnProperty(key)) {
                        const value = currentObj[key];
                        const fullPath = pathPrefix ? `${pathPrefix}.${key}` : key;

                        // Si es un objeto, creamos un submenú desplegable
                        if (typeof value === 'object' && value !== null) {
                            const details = document.createElement("details");
                            const summary = document.createElement("summary");

                            // Botón del nodo padre
                            const btn = document.createElement("button");
                            btn.textContent = key;
                            btn.addEventListener("click", (e) => {
                                e.preventDefault(); // Evita que el click cierre/abra el details bruscamente
                                showSetting(fullPath);
                            });

                            summary.appendChild(btn);
                            details.appendChild(summary);

                            // Llamada recursiva para los hijos
                            createMenu(value, details, fullPath);
                            container.appendChild(details);
                        } else {
                            // Si es un valor final (string, number, bool), creamos un botón simple
                            const btn = document.createElement("button");
                            btn.textContent = key;
                            btn.addEventListener("click", () => showSetting(fullPath));

                            container.appendChild(btn);
                        }
                    }
                }
            }

            createMenu(settings, aside);
        }

        // Guarda el estado actual de userSettings en LocalStorage
        function saveUserSettingsToLocalStorage() {
            try {
                localStorage.setItem("userSettings", JSON.stringify(userSettings));
            } catch (error) {
                console.error("Error al guardar en LocalStorage:", error);
            }
        }

        // Recupera los datos de LocalStorage y los asigna a userSettings
        function getUserSettingsFromLocalStorage() {
            try {
                const saved = localStorage.getItem("userSettings");
                if (saved) {
                    userSettings = JSON.parse(saved);
                } else {
                    userSettings = {}; // Si no hay nada, inicializa vacío
                }
            } catch (error) {
                console.error("Error al leer de LocalStorage, inicializando vacío:", error);
                userSettings = {};
            }
        }

        document.addEventListener("DOMContentLoaded", () => {
            getUserSettingsFromLocalStorage();
            buildAside();
        });
