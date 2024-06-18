/*El gulpfile.js es el archivo donde se van a generar todas las tareas de automatización así no sobrecargando el archivo package.json con tareas
Además para poder usarlo se necesita usar la palabra export
Para no seguir marcando errores se tiene que indicar a las funciones un callback, que es un parametro y este se llama dentro de la función antes de terminar esta 
*/

/// Funcion de prueba

// export function hola( done ) { //done es un callback 
//     console.log('Hola desde gulp file');
//     done(); //le indica a la función que ya terminó
// }

/// Extrayendo funciones de gulp
/**src es una función que tiene que contener el archivo que se va a compilar
 * dest es la funcion que se le indica el destino donde el archivo se va a transfomar y va a compilar
 * watch es la función que visualizará los cambios realizados
 * series es la función que se exporta por default y que va a ejecutar todas las tareas creadas
 * parallel es la función que se exporta por default y que va a ejecutar todas las tareas creadas al mismo tiempo
 */
import { src, dest, watch, series, parallel } from 'gulp';

/// Importando las dependencias de sass, tanto el lenguaje dartsass como la dependencia para automatizar tareas gulp-sass

import * as dartSass from 'sass'; // esta es una consulta para extraer todo como dartSass desde sasss, Dart es un lenguaje creado por google para mejorar el performance de las webs
import gulpSass from 'gulp-sass'; // extraemos la dependencia de gulp-sass desde el node_modules

/// Combinar gulpSass indicandole que usará dartSass

/**Se indica que se va a compilar sass usando la dependencia de gulpsass diciendole donde está la dependencia de sass */
const sass = gulpSass(dartSass);

/*Funcion para crear un compilador se le indica un destino, un origen, sele agregan funcionalidades para que nos indiquen errores y crea un mapa de sass*/
export function css( done ) {
    src('src/scss/app.scss', {sourcemaps: true}) // es la función que se importó desde gulp y se le indica la ruta del archivo que se va a compilar, {sourcemaps: true} va a generar el mapa para saber las lineas de codigo en el navegador de sass
    //.pipe( sass()) // los pipes son los que dan la instruccion de compilación, este pipe hace un llamado a la tarea sass
    .pipe( sass().on('error', sass.logError)) // Estamos agregando un on que es un listener, dentro de el se esperan argumentos, el evento se indica en string y el nombre de la tarea y el metodo en este caso es un logError porque si hay errores no sabemoms cuales son y con esto ya nos dice que está pasando
    .pipe( dest('build/css', {sourcemaps: '.'})) //este pipe indica la ruta en la que se va a compilar el archivo css de esta función, {sourcemaps: '.'} si se le agrega un punto en ves de true crea el archivo app.scss.map
    done();
}

/**Funcion que va a ejecutarse cada que se realicen cambios en la ruta indicada */
export function dev() {
    //watch('src/scss/app.scss', css); // se llama a la función watch, como "paramteros" para que revise los cambios que se realicen, se le dá el nombre de la ruta del archivo que tendrá dichos cambios y le decimos que va a observar la función css que es la que mostrará los cambios
    watch('src/scss/**/*.scss', css); // modificamos la ruta para indicar que lea todas las carpetas y todos los archivos con extension .scss
    watch('src/js/**/*.js', js);
}

/**Funcion que compila un archivo y lo comvierte en el destino */
export function js( done ){
    src('src/js/app.js')
    .pipe( dest('build/js'))
    done();
}

export default series( js, css, dev); // series toma las diferentes tareas creadas en este archivo y las ejecuta siempre que estas se nombren como parametros
// export default parallel( js, css, dev); // parallel toma las diferentes tareas creadas en este archivo y las ejecuta todas al mismo tiempo