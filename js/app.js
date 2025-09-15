const titoContenedorDialogo = document.querySelector('.tito__contenedor__dialogo');
const titoDialogoParrafo = document.querySelector('.tito__dialogo__parrafo');
const titoImagen = document.querySelector('.tito__imagen');
const titoContenedor = document.querySelector('.tito__contenedor');
const contenedorBotonContinuar = document.querySelector('.contenedor_boton_continuar');
const contenedorImagenes = document.querySelector('.contenedor__imagenes');

const buttonSonido = document.querySelector('.btn-sonido');
const buttonDialogo = document.querySelector('.btn-dialogo');

const escenario = document.querySelector('.escenario__contenedor');
const imagenes = document.querySelectorAll('.contenedor__imagenes__elements img');
const imagenCerrarDialogo = document.querySelector('.imagen_cerrar_dialogo');
const audioLobby = document.querySelector('.audio_lobby');

const btnSonidoImagen = document.querySelector('.btn-sonido img');

const IMAGENES_BTN_SONIDO = {
    sonido_on: 'src/img/sound_on_3d.png',
    sonido_off: 'src/img/sound_off_3d.png'
}

const dialogos = [
    {
        personaje: 'Tito',
        texto: 'Vamos a ayudar a Itzel y a la psicóloga a hacer que su espacio sea más cómodo!'
    },
    {
        personaje: 'Tito',
        texto: 'Puedes mover los objetos y ponerlos donde quieras. ¡Hazlo a tu gusto!'
    },
    {
        personaje: 'Tito', 
        texto: '¡Qué bonito quedó todo! Itzel y la psicóloga estará muy contentas en este espacio. ¡Todo está listo para comenzar!'
    }
];

const IMAGENES_TITO = {
    hablando: 'src/img/Titto-hablando.png',
    normal: 'src/img/Tito.png'
};

let isTyping = false;
let dialogoIndice = 0; 
let elementoArrastrado = null; 
let btnDialogoActivated = false;   


document.addEventListener('DOMContentLoaded', () => {
    addAnimation();
    ocultarBotonDialogo();
})

imagenCerrarDialogo.addEventListener('click', () => {
    if(isTyping) return
    btnDialogoActivated = true; 
    ocultarElemento(titoContenedorDialogo); 
    mostarBotonDialogo();
})

buttonDialogo.addEventListener('click', () => {
    ocultarBotonDialogo();
    mostrarElemento(titoContenedorDialogo);
})

titoImagen.addEventListener('click', handleClickInTitoImage)

buttonSonido.addEventListener('click', ()=>{
    //proxima funcionalidad, después de dar click
    audioLobby.loop = true; 
    if(audioLobby.paused){
        btnSonidoImagen.src =IMAGENES_BTN_SONIDO.sonido_on;
        audioLobby.play();
    }else{
        btnSonidoImagen.src = IMAGENES_BTN_SONIDO.sonido_off;
        audioLobby.pause();
    }
})

async function handleClickInTitoImage(){
    if (dialogoIndice < dialogos.length && !isTyping) {

        if(btnDialogoActivated){
            btnDialogoActivated = false;
            ocultarBotonDialogo();
        }

        removeAnimation();
        await mostrarDialogo();
        dialogoIndice++;
        addAnimation();

        if (dialogoIndice === 2) {
            removeAnimation();
            setTimeout( () => {
                ocultarElemento(titoContenedor);
                ocultarElemento(titoContenedorDialogo);
                mostrarImagenesArrastrables();
                activarDragAndDrop();
            }, 1000)
        }

    }
}

function ocultarElemento(elemento) {
    elemento.classList.remove('flex');
    elemento.classList.add('oculto');
}

function addAnimation(){
    titoContenedor.classList.add('animate-clickable');
}

function removeAnimation(){
    titoContenedor.classList.remove('animate-clickable');
}

async function mostrarDialogo() {
    if (isTyping) return;
    isTyping = true;
    
    const dialogo = dialogos[dialogoIndice];

    await mostrarDialogoTito(dialogo)

    isTyping = false;
}

async function mostrarDialogoTito(dialogo) {
    // Actualizar imágenes
    titoImagen.src = IMAGENES_TITO.hablando;

    // Mostrar/ocultar contenedores de diálogo
    mostrarElemento(titoContenedorDialogo);

    // Generar efecto typing
    const titoParrafo = titoContenedorDialogo.querySelector('.tito__dialogo__parrafo');
    await generarEfectoTyping(dialogo.texto, titoParrafo);
}

function mostrarElemento(elemento) {
    elemento.classList.remove('oculto');
    elemento.classList.add('flex');
}

function mostrarImagenesArrastrables(){
    contenedorImagenes.classList.remove('oculto');
    contenedorImagenes.classList.add('flex');
}

function ocultarBotonDialogo(){
    buttonDialogo.style.display = 'none';
}

function mostarBotonDialogo(){
    buttonDialogo.style.display = 'inline-block';
}


function crearBotonContinuar(){
    const continuarButton = document.createElement('button');
    // continuarButton.classList.add('boton__continuar');
    continuarButton.textContent = 'Finalizar';
    continuarButton.classList.add('boton_continuar')
    continuarButton.addEventListener('click', async() => {

        titoImagen.removeEventListener('click', handleClickInTitoImage);
        desactivarDraggable();
        mostrarElemento(titoContenedor);
        mostrarElemento(titoContenedorDialogo)
        eliminarTextoAnterior(titoDialogoParrafo)
        await generarEfectoTyping(dialogos[dialogoIndice].texto, titoDialogoParrafo)
    })
    contenedorBotonContinuar.appendChild(continuarButton)

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
        nuevaImg.classList.add('elemento-arrastrable');
        nuevaImg.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('movible', 'true');
            elementoArrastrado = nuevaImg;
        });

        escenario.appendChild(nuevaImg);

        // Verificar si ya no quedan imágenes en el contenedor
        if (contenedorImagenes.querySelectorAll('img').length === 0) {
            crearBotonContinuar();
        }
    });

}

async function generarEfectoTyping(texto, elemento, velocidad = 50) {
    elemento.textContent = ""; // limpiar antes
    for (let i = 0; i < texto.length; i++) {
        elemento.textContent += texto[i];
        await new Promise(resolve => setTimeout(resolve, velocidad));
    }
}

function eliminarTextoAnterior(elemento){
    elemento.textContent = ''
}

function desactivarDraggable(){
    const imagenesArrastables = document.querySelectorAll('.elemento-arrastrable');
    console.log(imagenesArrastables)
    imagenesArrastables.forEach(imagen => {
        imagen.setAttribute('draggable', false);
    })
}

