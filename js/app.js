document.addEventListener('DOMContentLoaded', () => {
    const titoContedorDialogo = document.querySelector('.tito__contenedor__dialogo');
    const titoDialogoParrafo = document.querySelector('.tito__dialogo__parrafo');
    const titoImagen = document.querySelector('.tito__imagen');
    const titoContenedor = document.querySelector('.tito__contenedor');
    const contenedorBotones = document.querySelector('.contenedor__botones');
    const contenedorImagenes = document.querySelector('.contenedor__imagenes');
    const siguienteButton = document.querySelector('.boton__siguiente');
    const anteriorButton = document.querySelector('.boton__anterior');
    const escenario = document.querySelector('.escenario__contenedor');
    const imagenes = document.querySelectorAll('.contenedor__imagenes__elements img');

    const dialogos = [
        {
            personaje: 'Tito',
            dialogo: 'Vamos a ayudar a Itzel y a la psicóloga a hacer que su espacio sea más cómodo!'
        },
        {
            personaje: 'Tito',
            dialogo: 'Puedes mover los objetos y ponerlos donde quieras. ¡Hazlo a tu gusto!'
        },
        {
            personaje: 'Tito', 
            dialogo: '¡Qué bonito quedó todo! Itzel y la psicóloga estará muy contentas en este espacio. ¡Todo está listo para comenzar!'
        }
    ];

    contenedorBotones.classList.add('flex')

    let dialogoIndice = -1; 
    let elementoArrastrado = null; 


    anteriorButton.addEventListener('click', () => {
        dialogoIndice--;

        if (dialogoIndice < 0) {
            dialogoIndice = 0; // Evita que el índice sea menor que 0
        }
        mostrarDialogo(dialogoIndice);
    })

    siguienteButton.addEventListener('click', () => {
        dialogoIndice++;
        if (dialogoIndice >= dialogos.length) {
            dialogoIndice = dialogos.length - 1; // Evita que el índice sea mayor que el número de diálogos
        }
        mostrarDialogo(dialogoIndice);
    })

    function mostrarDialogo(indice){

        if(indice !== dialogos.length -1){
            const dialogo = dialogos[indice];
            titoContedorDialogo.classList.remove('oculto');
            titoContedorDialogo.classList.add('flex');
            eliminarTextoAnterior(titoDialogoParrafo)
            generarEfectoTyping(dialogo.dialogo, titoDialogoParrafo)
            titoImagen.src = 'src/img/Titto-hablando.png'
        }else{
            titoContedorDialogo.classList.remove('flex')
            titoContedorDialogo.classList.add('oculto');
            titoContenedor.classList.add('oculto')

            ocultarBotones();
            mostrarImagenesArrastrables();
            activarDragAndDrop();
        }

        
    }

    function ocultarBotones(){
        contenedorBotones.classList.remove('flex');
        contenedorBotones.classList.add('oculto');
    }

    function mostrarImagenesArrastrables(){
        contenedorImagenes.classList.remove('oculto');
        contenedorImagenes.classList.add('flex');
    }

    function eliminarBotones(){
        while(contenedorBotones.firstChild){
            contenedorBotones.removeChild(contenedorBotones.firstChild);
        }
    }

    function crearBotonContinuar(){
        const continuarButton = document.createElement('button');
        // continuarButton.classList.add('boton__continuar');
        continuarButton.textContent = 'Continuar';
        continuarButton.addEventListener('click', () => {
            titoContenedor.classList.remove('oculto');
            titoContenedor.classList.add('flex');
            titoContedorDialogo.classList.remove('oculto')
            titoContedorDialogo.classList.add('flex');
            console.log(titoDialogoParrafo)
            eliminarTextoAnterior(titoDialogoParrafo)
            generarEfectoTyping(dialogos[dialogoIndice].dialogo, titoDialogoParrafo)
        })
        contenedorBotones.appendChild(continuarButton);
    }

    function activarDragAndDrop() {
        // 1. Hacer las imágenes arrastrables
        imagenes.forEach((img, index) => {
            img.setAttribute('draggable', true);
            if(!img.dataset.id){
                img.dataset.id = `imagen-${index}`; // Asignar un ID único si no tiene uno
            }

            img.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('src', e.target.src);
                e.dataTransfer.setData('element-id', e.target.dataset.id);
                e.target.classList.add('arrastrando');
            });
        });

        // 2. Permitir soltar en el escenario
        escenario.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        escenario.addEventListener('drop', (e) => {
            e.preventDefault();

            const src = e.dataTransfer.getData('src');
            const id = e.dataTransfer.getData('element-id');
            const isMovible = e.dataTransfer.getData('movible');

            const rect = escenario.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Mover imagen si ya estaba en el escenario
            if (isMovible === 'true' && elementoArrastrado) {
                elementoArrastrado.style.left = `${x - elementoArrastrado.width / 2}px`;
                elementoArrastrado.style.top = `${y - elementoArrastrado.height / 2}px`;
                return;
            }

            // Eliminar imagen original del contenedor
            const imagenOriginal = document.querySelector(`[data-id="${id}"]`);
            if (imagenOriginal) {
                imagenOriginal.remove();
            }


            const nuevaImg = document.createElement('img');
            nuevaImg.src = src;
            nuevaImg.dataset.id = `instancia-${id}`;
            nuevaImg.style.position = 'absolute';
            nuevaImg.style.height = '50%'

            nuevaImg.onload = () => {
                const offsetX = nuevaImg.width / 2;
                const offsetY = nuevaImg.height / 2;

                if (src.includes('sillon.png')) {
                    nuevaImg.style.transform = 'scale(1.3)';
                } else if (src.includes('bear_3d.png') || src.includes('plant_3d.png') || src.includes('lapiz.png') || src.includes('libro.png')) {
                    nuevaImg.style.transform = 'scale(0.4)';
                } else {
                    nuevaImg.style.transform = 'scale(1)';
                }

                nuevaImg.style.left = `${x - offsetX}px`;
                nuevaImg.style.top = `${y - offsetY}px`;
            }

                // Hacer la imagen movible nuevamente
            nuevaImg.setAttribute('draggable', true);
            nuevaImg.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('movible', 'true');
                elementoArrastrado = nuevaImg;
            });

            escenario.appendChild(nuevaImg);

            // Verificar si ya no quedan imágenes en el contenedor
            if (contenedorImagenes.querySelectorAll('img').length === 0) {
                eliminarBotones();
                crearBotonContinuar();
                contenedorBotones.classList.remove('oculto'); // asegúrate de tener oculto al inicio con CSS
                contenedorBotones.classList.add('flex');
            }
        });

    }

    function generarEfectoTyping(texto, elemento, indice = 0){

        elemento.textContent += texto[indice];
        
        if(indice == texto.length -1 ) return

        setTimeout(() => {
            generarEfectoTyping(texto, elemento, indice + 1 )
        }, 50);

    }

    function eliminarTextoAnterior(elemento){
        elemento.textContent = ''
    }

    

})

