let practicaSeleccionada = null;

const botones = document.querySelectorAll(".boton-practica");
const subContenedores = document.querySelectorAll("[id^='sub-']");
const partes = document.querySelectorAll('.boton-parte');

botones.forEach((boton) => {
    
    boton.addEventListener('click', () => {
        // guardamos la práctica seleccionada
        practicaSeleccionada = boton.dataset.id;

        // ocultar todos los sub-botones
        subContenedores.forEach(div => div.style.display = 'none');

        // mostrar los sub-botones correspondientes
        const sub = document.getElementById('sub-' + practicaSeleccionada);
        if (sub) sub.style.display = "block";

    });
});

// al hacer clic en algun boton "boton-parte"
partes.forEach((botonParte) => {
    botonParte.addEventListener('click', () => {
        const parteSeleccionada = botonParte.dataset.parte;

        if (practicaSeleccionada !== null) {
            ejercicio(practicaSeleccionada, parteSeleccionada);
        } else {
            console.log("Primero seleccioná una práctica.");
        }
    });
});


function ejercicio(id, parte) {

    let practica = `practica${id}`;

    if (parte === '3') practica += '/adicionales';
    else if (parte !== '0') practica += `/parte${parte}`;


    const opciones = document.getElementById("contenedor-opciones");
    opciones.innerHTML = ""; // limpiar radios anteriores
    
    const url = `https://api.github.com/repos/EzeFacultad/practicas-CADP/contents/${practica}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) {
                for (let i=0; i < data.length; i++) {
                    // crear el label
                    const label = document.createElement("label");
                    // agregar clases al label
                    label.classList.add("d-flex", "flex-column", "align-items-center");

                    // configurar el inpunt
                    const radio = document.createElement("input");
                    radio.type = "radio";
                    radio.name = "opcion";
                    radio.value = i + 1;

                    // se agrega el input dentro del label
                    label.append(radio);
                    // le agregamos un "texto" al label
                    label.append(`${radio.value}`);
                    // insertamos el label en el div
                    opciones.appendChild(label);
                };
                
                // para verificar si existe ya un boton
                const botonBuscar = document.querySelector(".boton-buscar");
                // si no existe, se crea
                if (!botonBuscar) {
                    const boton = document.createElement("button");
                    boton.className = "boton-buscar";
                    boton.textContent = "Buscar";
                    boton.onclick = function () {
                        const ejer = document.querySelector(`input[name="opcion"]:checked`);
                        if (ejer) {
                            
                            let ejercicio = '';
                            let numEjercicio = Number(ejer.value);
                            if (numEjercicio < 10) ejercicio = `e0${ejer.value}.pas`;
                            else ejercicio = `e${ejer.value}.pas`;
                            
                            fetch(`${url}/${ejercicio}`)
                                .then(res => res.json())
                                .then(data => {
                                    
                                    // traemos el código codificado
                                    const base64Content = data.content;
                                    // decodificamos
                                    const decodedContent = atob(base64Content); // atob = ASCII to binary (decodifica base64)
                                    
                                    const codigo = document.getElementById("codigo");
                                    codigo.textContent = decodedContent;
                                    const mostrar = document.querySelector(".container")
                                    mostrar.style.display = "flex";
                                    
                                    // resaltar el código con Prism
                                    Prism.highlightElement(codigo);
                                    
                                    console.log(decodedContent);
                                });
                            
                        } else {
                            console.log("hola");
                        }
                        
                    }
                    // Agregar botón al div padre de `opciones` (el que tiene clase "opciones")
                    opciones.parentElement.appendChild(boton);
                }
                

            } else {
                console.error("Error en la respuesta:", data);
            }
        });
}

function buscar() {
    console.log("Hola");
}