document.addEventListener('DOMContentLoaded', function() {
    navegacionFija();
    crearGaleria();
    resaltarEnlace();
    scrollNav();
});

function navegacionFija() {
    const header = document.querySelector('.header');
    const sobreFestival = document.querySelector('.sobre-festival');

    //código para reconocer en que secciones se está haciendo scroll
    window.addEventListener('scroll', function() {
        // console.log(sobreFestival.getBoundingClientRect().bottom); //getBoundingClientRect() trae las cordenadas de cuando se da un scroll cerca de una sección da positivo cunado aun no estamos cerca y da negativo cuando nos pasamos la sección
        if (sobreFestival.getBoundingClientRect().bottom < 1) {
            // console.log('ya te psasaste');
            header.classList.add('fixed');
        } else {
            // console.log('aun no te pasas');
            header.classList.remove('fixed');
        }
    })
}
function crearGaleria() {
    const CANTIDADIMAGENES = 16;
    const galeria = document.querySelector('.galeria-imagenes');
    for (let i = 1; i <= CANTIDADIMAGENES; i++) {
        const imagen = document.createElement('IMG');
        imagen.src = `src/img/gallery/full/${i}.jpg`;
        imagen.alt = 'Imagen galería';

        // event handler
        /**es el proceso de detectar y responder la interaccion del usuario*/
        imagen.onclick = function() {
            mostrarImagen(i);
        }
        galeria.appendChild(imagen);
    }
}

function mostrarImagen(i) {

    const imagen = document.createElement('IMG');
    imagen.src = `src/img/gallery/full/${i}.jpg`;
    imagen.alt = 'Imagen galería';

    // generar modal
    const modal = document.createElement('DIV');
    modal.classList.add('modal');
    modal.onclick = cerrarModal;

    //Boton cerrar modal

    const cerrarModalBtn = document.createElement('BUTTON');
    cerrarModalBtn.textContent = 'X';
    cerrarModalBtn.classList.add('btn-cerrar');
    cerrarModalBtn.onclick = cerrarModal;

    modal.appendChild(imagen);
    modal.appendChild(cerrarModalBtn);

    //Agregar al html
    const body = document.querySelector('body');
    body.classList.add('overflow-hidden');
    body.appendChild(modal);
    // console.log(modal);
}

function cerrarModal() {
    const modal = document.querySelector('.modal');
    modal.classList.add('fade-out');
    setTimeout(() => {
        // modal.classList.remove('modal');
        modal?.remove();

        const body = document.querySelector('body');
        body.classList.remove('overflow-hidden');
    }, 500);
}

function resaltarEnlace() {
    document.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.navegacion-principal a');
        
        let actual = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop; // reconoce cuantos pixeles se encuentra un elemento del top del body
            const sectionHeight = section.clientHeight; //clientHeight dice cuanto mide la altura de un elemento
            //console.log(sectionHeight); 

            if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
                //console.log(section.id);
                actual = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active')
            if (link.getAttribute('href') === '#' + actual) {
                link.classList.add('active');
            }
        });
    })
}

function scrollNav() {
    const navLinks = document.querySelectorAll('.navegacion-principal a');

    navLinks.forEach( link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const sectionScroll = e.target.getAttribute('href');
            const section = document.querySelector(sectionScroll);
            //console.log(e.target.getAttribute('href'));
            // console.log(section);
            section.scrollIntoView({behavior: 'smooth'});
        })
    });
}