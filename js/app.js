import { dialogos } from "./dialogos.js";

/** @type {HTMLElement} Contenedor principal del diálogo de Tito */
const titoContenedorDialogo = document.querySelector('.tito__contenedor__dialogo');

/** @type {HTMLElement} Contenedor del párrafo de Tito */
const titoDialogo = document.querySelector('.tito_contenedor_parrafo');

/** @type {HTMLParagraphElement} Elemento párrafo donde se muestra el texto del diálogo */
const titoDialogoParrafo = document.querySelector('.tito__dialogo__parrafo');

/** @type {HTMLImageElement} Imagen del personaje Tito */
const titoImagen = document.querySelector('.tito__imagen');

/** @type {HTMLElement} Contenedor principal del personaje Tito */
const titoContenedor = document.querySelector('.tito__contenedor');

/** @type {HTMLElement} Contenedor del botón continuar */
const contenedorBotonContinuar = document.querySelector('.contenedor_boton_continuar');

/** @type {HTMLElement} Contenedor de imágenes arrastrables */
const contenedorImagenes = document.querySelector('.contenedor__imagenes');

/** @type {HTMLButtonElement} Botón para controlar el audio */
const buttonSonido = document.querySelector('.btn-sonido');

/** @type {HTMLButtonElement} Botón para mostrar/ocultar diálogos */
const buttonDialogo = document.querySelector('.btn-dialogo');

/** @type {HTMLElement} Contenedor del escenario donde se sueltan elementos */
const escenario = document.querySelector('.escenario__contenedor');

/** @type {NodeListOf<HTMLImageElement>} Colección de imágenes arrastrables */
const imagenes = document.querySelectorAll('.contenedor__imagenes__elements img');

/** @type {HTMLImageElement} Botón para cerrar el diálogo */
const imagenCerrarDialogo = document.querySelector('.imagen_cerrar_dialogo');

/** @type {HTMLAudioElement} Audio de fondo del lobby */
const audioLobby = document.querySelector('.audio_lobby');

/** @type {HTMLElement} Contenedor principal de escenarios */
const contenedorEscenarios = document.querySelector('.contenedor-escenarios');

/** @type {HTMLElement} Contenedor flex de escenarios */
const contenedorEscenariosFlex = document.querySelector('.contenedor-escenarios-flex');

/** @type {HTMLImageElement} Imagen del escenario actual */
const escenarioImagen = document.querySelector('.escenario__imagen');

/** @type {HTMLImageElement} Imagen del botón de sonido */
const btnSonidoImagen = document.querySelector('.btn-sonido img');

/** @type {HTMLElement} Elemento modal principal */
const modal = document.getElementById('modal'); 

/** @type {HTMLVideoElement} Video tutorial del modal */
const modalContenidoVideo = document.querySelector('.video__tutorial');

/** @type {HTMLElement} Contenedor del contenido visual del modal */
const modalContenedorContenidoVisual = document.querySelector('.modal__contenido-visual');

/** @type {HTMLButtonElement} Botón para cerrar el modal */
const btnCerrarModal = document.querySelector('.modal__contenido__cerrar');

/** @type {HTMLButtonElement} Botón para abrir la galería */
const btnGaleria = document.querySelector('.btn-galeria');

/**
 * Rutas de las imágenes para el botón de sonido
 * @constant {Object}
 * @property {string} sonido_on - Imagen cuando el sonido está activado
 * @property {string} sonido_off - Imagen cuando el sonido está desactivado
 */
const IMAGENES_BTN_SONIDO = {
    sonido_on: 'src/img/sound_on_3d.png',
    sonido_off: 'src/img/sound_off_3d.png'
}

/**
 * Rutas de las imágenes del personaje Tito
 * @constant {Object}
 * @property {string} hablando - Imagen de Tito cuando está hablando
 * @property {string} normal - Imagen de Tito en estado normal
 */
const IMAGENES_TITO = {
    hablando: 'src/img/Titto-hablando.png',
    normal: 'src/img/Tito.png'
};

/**
 * Ruta de la imagen de la sala de psicología
 * @constant {string}
 */
const IMAGEN_SALA_PSICOLOGIA = 'src/img/psicologia.jpeg'


/** @type {boolean} Indica si se está ejecutando el efecto de escritura */
let isTyping = false;

/** @type {number} Índice actual del diálogo en reproducción */
let dialogoIndice = 0; 

/** @type {HTMLElement|null} Referencia al elemento que está siendo arrastrado */
let elementoArrastrado = null; 

/** @type {boolean} Indica si el botón de diálogo está activado */
let btnDialogoActivated = false; 

/** @type {boolean} Indica si el modal de galería está abierto */
let isGaleriaModalOpen = false; 

document.addEventListener('DOMContentLoaded', () => {
    reproducirVideoTutorial();
    ocultarBotonDialogo();
})

btnCerrarModal.addEventListener('click', () => {
    if(!isGaleriaModalOpen){
        addAnimation();
        reproducirAudioLobby();
    }
    modal.style.display = 'none';
    isGaleriaModalOpen = false;
})

btnGaleria.addEventListener('click', () => {
    isGaleriaModalOpen = true; 
    const contenidoVisual = modalContenedorContenidoVisual.firstElementChild;
    if(contenidoVisual.tagName === 'VIDEO'){
        cambiarContenidoModal();
    }
    modal.style.display = 'flex';
})

/**
 * Cambia el contenido del modal de video a la imagen de la sala de psicología
 * Actualiza el título, descripción y texto del botón de cerrar
 */
function cambiarContenidoModal(){
    const modalContenidoHeading = document.querySelector('.modal__contenido h4');
    const modalContenidoParrafo = document.querySelector('.modal__contenido p'); 

    modalContenedorContenidoVisual.removeChild(modalContenedorContenidoVisual.firstElementChild); 
    
    const nuevaImagen = document.createElement('img'); 
    nuevaImagen.src = IMAGEN_SALA_PSICOLOGIA;
    modalContenedorContenidoVisual.appendChild(nuevaImagen);
    modalContenidoHeading.textContent = 'Sala de Psicología';
    modalContenidoParrafo.textContent = 'Esta es una imagen real de cómo se ve este lugar en la vida real. De esta manera, si un día llegas a ir, ¡ya sabrás cómo es!'
    btnCerrarModal.textContent = 'Cerrar'; 
}

contenedorEscenariosFlex.addEventListener('click', (e) => {
    if(e.target.tagName !== 'IMG') return;
    const escenarioImagenActual = escenarioImagen.getAttribute('src');
    const escenarioImagenSeleccionado = e.target.getAttribute('src'); 
    escenarioImagen.setAttribute('src', escenarioImagenSeleccionado)
    e.target.setAttribute('src', escenarioImagenActual);
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
    reproducirAudioLobby()
})

/**
 * Reproduce o pausa el audio del lobby y actualiza el icono del botón
 * El audio se reproduce en loop cuando está activo
 */
function reproducirAudioLobby(){
    //proxima funcionalidad, después de dar click
    audioLobby.loop = true; 
    if(audioLobby.paused){
        btnSonidoImagen.src =IMAGENES_BTN_SONIDO.sonido_on;
        audioLobby.play();
    }else{
        btnSonidoImagen.src = IMAGENES_BTN_SONIDO.sonido_off;
        audioLobby.pause();
    }
}

/**
 * Reproduce el video tutorial en loop automáticamente
 * @async
 * @throws {Error} Si la reproducción automática es bloqueada por el navegador
 */
async function reproducirVideoTutorial(){
    modalContenidoVideo.loop = true;
    try {
        await modalContenidoVideo.play();
    } catch (err) {
        console.error("La reproducción automática del video fue bloqueada por el navegador.", err);
    }
}

/**
 * Maneja el evento de clic en la imagen de Tito
 * Controla el flujo de diálogos y activa el modo drag and drop cuando es necesario
 * @async
 */
async function handleClickInTitoImage(){
    if (dialogoIndice < dialogos.length && !isTyping) {

        if(btnDialogoActivated){
            btnDialogoActivated = false;
            ocultarBotonDialogo();
        }

        removeAnimation();
        titoContenedor.classList.add('animate-talking');
        await mostrarDialogo();
        titoContenedor.classList.remove('animate-talking')
        dialogoIndice++;
        addAnimation();

        if (dialogoIndice === 2) {
            removeAnimation();
            titoImagen.removeEventListener('click', handleClickInTitoImage);
            const continuarButton = crearButonContinuar();
            titoDialogo.appendChild(continuarButton);
            continuarButton.addEventListener('click', prepararEscenarioParaDragAndDrop);
        }

    }
}

/**
 * Crea y retorna un botón de continuar con estilos y clases predefinidas
 * @returns {HTMLButtonElement} Botón de continuar creado
 */
function crearButonContinuar(){
    const continuarButton = document.createElement('button'); 
    continuarButton.classList.add('boton_continuar', 'animate-clickable')
    continuarButton.style.marginTop = '10px'
    continuarButton.textContent = 'Continuar';
    return continuarButton;
}

/**
 * Prepara el escenario para la funcionalidad de arrastrar y soltar
 * Oculta los elementos de Tito y muestra las imágenes arrastrables
 */
function prepararEscenarioParaDragAndDrop(){
    ocultarElementosTito();
    contenedorEscenarios.classList.remove('oculto');
    mostrarImagenesArrastrables();
    activarDragAndDrop();
    titoDialogo.removeChild(titoDialogo.querySelector('button'));
}

function ocultarElementosTito(){
    ocultarElemento(titoContenedor);
    ocultarElemento(titoContenedorDialogo);
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

/**
 * Muestra el diálogo actual de Tito
 * @async
 */
async function mostrarDialogo() {
    if (isTyping) return;
    isTyping = true;
    
    const dialogo = dialogos[dialogoIndice];

    await mostrarDialogoTito(dialogo)

    isTyping = false;
}

/**
 * Muestra el diálogo específico de Tito con animaciones
 * @async
 * @param {Object} dialogo - Objeto con la información del diálogo
 * @param {string} dialogo.texto - Texto del diálogo a mostrar
 */
async function mostrarDialogoTito(dialogo) {
    // Actualizar imágenes
    titoImagen.src = IMAGENES_TITO.hablando;

    // Mostrar/ocultar contenedores de diálogo
    mostrarElemento(titoContenedorDialogo);

    // Generar efecto typing
    const titoParrafo = titoContenedorDialogo.querySelector('.tito__dialogo__parrafo');
    const titoHeadImagen = titoContenedorDialogo.querySelector('.tito__head__imagen');
    titoHeadImagen.classList.add('animate-talking-minihead');
    await generarEfectoTyping(dialogo.texto, titoParrafo);
    titoHeadImagen.classList.remove('animate-talking-minihead');
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

/**
 * Crea un botón de finalizar que termina la sesión de drag and drop
 * y continúa con el siguiente diálogo
 */
function crearBotonFinalizar(){
    const finalizarButton = document.createElement('button');
    // finalizarButton.classList.add('boton__continuar');
    finalizarButton.textContent = 'Finalizar';
    finalizarButton.classList.add('boton_continuar', 'animate-clickable')
    finalizarButton.addEventListener('click', async() => {

        titoImagen.removeEventListener('click', handleClickInTitoImage);
        desactivarDraggable();
        contenedorEscenarios.classList.add('oculto');
        mostrarElemento(titoContenedor);
        mostrarElemento(titoContenedorDialogo)
        eliminarTextoAnterior(titoDialogoParrafo)
        contenedorBotonContinuar.removeChild(finalizarButton);
        titoContenedor.classList.add('animate-talking');
        await generarEfectoTyping(dialogos[dialogoIndice].texto, titoDialogoParrafo)
        titoContenedor.classList.remove('animate-talking')
    })
    contenedorBotonContinuar.appendChild(finalizarButton)

}

/**
 * Activa la funcionalidad de drag and drop para las imágenes
 * Configura los event listeners necesarios para arrastrar y soltar elementos
 */
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
            crearBotonFinalizar();
        }
    });

}


function eliminarTextoAnterior(elemento){
    elemento.textContent = ''
}

/**
 * Desactiva la capacidad de arrastrar de todos los elementos arrastrables
 */
function desactivarDraggable(){
    const imagenesArrastables = document.querySelectorAll('.elemento-arrastrable');
    imagenesArrastables.forEach(imagen => {
        imagen.setAttribute('draggable', false);
    })
}


/**
 * Genera un efecto de escritura tipo máquina de escribir con audio sincronizado
 * @async
 * @param {string} texto - Texto a mostrar con el efecto
 * @param {HTMLElement} elemento - Elemento donde se mostrará el texto
 * @param {number} [velocidad=30] - Velocidad de escritura en milisegundos por carácter
*/
async function generarEfectoTyping(texto, elemento, velocidad = 30) {
    elemento.textContent = ""; 

    let wordCounter = 0; 
    const WORDS_PER_SOUND = 3; 

    for (let i = 0; i < texto.length; i++) {
        elemento.textContent += texto[i];
        const prevChar = i > 0 ? texto[i - 1] : ' ';
        const isWordBoundary = prevChar === ' ' || /[.!?;:]/.test(prevChar);

        if (isWordBoundary && texto[i] !== ' ') {
            wordCounter++;
            if (wordCounter % WORDS_PER_SOUND === 0) {
                playFluentSound();
            }
        }

        await new Promise(resolve => setTimeout(resolve, velocidad));
    }
}

/**
 * Reproduce un sonido de voz con variación de tono aleatoria
 * para simular una conversación más natural
 */

function playFluentSound() {

    const VOLUME = 0.7; 
    const AUDIO_TITO_SRC = 'src/tito_voice.mp3';

    const audio = new Audio(AUDIO_TITO_SRC); 

    const randomPitch = 0.8 + Math.random() * 0.4;
    
    audio.playbackRate = randomPitch; 
    audio.preservesPitch = false; 

    audio.volume = VOLUME;

    audio.currentTime = 0;
    
    audio.play().catch(e => {
        console.error("Error al reproducir sonido fluido:", e);
    });
}
