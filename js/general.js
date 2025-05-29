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

// al hacer clic en algún botón "boton-parte"
partes.forEach((botonParte) => {
    botonParte.addEventListener('click', () => {
        const parteSeleccionada = botonParte.dataset.parte;

        if (practicaSeleccionada !== null) {
            ejercicio(practicaSeleccionada, parteSeleccionada);
        }
    });
});

async function ejercicio(id, parte) {
    let practica = `practica${id}`;

    if (parte === '3') practica += '/adicionales';
    else if (parte !== '0') practica += `/parte${parte}`;

    console.log("Ruta a buscar:", practica);

    const opciones = document.getElementById("contenedor-opciones");
    opciones.innerHTML = ""; // limpiar radios anteriores

    const url = `https://api.github.com/repos/EzeFacultad/practicas-CADP/contents/${practica}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Práctica incompleta");

        const data = await response.json();

        // filtrar archivos que terminan en .pas
        const pasFiles = data.filter(file => file.name.endsWith('.pas'));

        if (pasFiles.length === 0) {
            opciones.innerHTML = "<p>No se encontraron archivos .pas</p>";
            return;
        }

        pasFiles.forEach((file) => {
            const label = document.createElement("label");
            label.classList.add("d-flex", "flex-column", "align-items-center");

            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = "opcion";
            radio.value = file.name;

            label.append(radio);
            label.append(file.name.replace('.pas', ''));
            opciones.appendChild(label);
        });

        let botonBuscar = document.querySelector(".boton-buscar");

        if (!botonBuscar) {
            botonBuscar = document.createElement("button");
            botonBuscar.className = "boton-buscar";
            botonBuscar.textContent = "Buscar";
            opciones.parentElement.appendChild(botonBuscar);
        }

        // siempre actualizamos el evento onclick por si cambió el contexto
        botonBuscar.onclick = async function () {
            const ejer = document.querySelector(`input[name="opcion"]:checked`);
            if (ejer) {
                const ejercicio = ejer.value;
                const url2 = `${url}/${ejercicio}`;
                console.log("Archivo seleccionado:", url2);

                try {
                    const res = await fetch(url2);
                    const data = await res.json();

                    const base64Content = data.content;
                    const decodedContent = atob(base64Content);

                    const codigo = document.getElementById("codigo");
                    codigo.textContent = decodedContent;

                    const mostrar = document.querySelector(".container");
                    mostrar.style.display = "flex";

                    Prism.highlightElement(codigo);

                    console.log("Contenido del ejercicio:", decodedContent);
                } catch (err) {
                    console.error("Error al obtener el archivo:", err);
                    alert("No se pudo obtener el archivo.");
                }
            } else {
                alert("Seleccioná un ejercicio primero.");
            }
        };
    } catch (err) {
        console.error("Error al obtener el listado de archivos:", err);
        alert("Práctica incompleta.");
    }
}
