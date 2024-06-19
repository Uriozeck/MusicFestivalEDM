/*El gulpfile.js es el archivo donde se van a generar todas las tareas de automatización así no sobrecargando el archivo package.json con tareas
Además para poder usarlo se necesita usar la palabra export
Para no seguir marcando errores se tiene que indicar a las funciones un callback, que es un parametro y este se llama dentro de la función antes de terminar esta 
*/

/// Funcion de prueba

// export function hola( done ) { //done es un callback 
//     console.log('Hola desde gulp file');
//     done(); //le indica a la función que ya terminó
// }


///Extrayendo funciones de node.js
/**Para usar las dependencias se tene que descrgar la de sharp */
import path from 'path'; //ubicacion
import fs from 'fs'; //file system
import { glob } from 'glob'; //dependencia para webp

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
import terser from 'gulp-terser'; //extraemos la dependencia para minificar el archivo js
import sharp from 'sharp';

/// Combinar gulpSass indicandole que usará dartSass

/**Se indica que se va a compilar sass usando la dependencia de gulpsass diciendole donde está la dependencia de sass */
const sass = gulpSass(dartSass);

/*Funcion para crear un compilador se le indica un destino, un origen, sele agregan funcionalidades para que nos indiquen errores y crea un mapa de sass*/
export function css( done ) {
    src('src/scss/app.scss', {sourcemaps: true}) // es la función que se importó desde gulp y se le indica la ruta del archivo que se va a compilar, {sourcemaps: true} va a generar el mapa para saber las lineas de codigo en el navegador de sass
    //.pipe( sass()) // los pipes son los que dan la instruccion de compilación, este pipe hace un llamado a la tarea sass
    .pipe( sass({
        outputStyle: 'compressed' //En la función de sass se agrega el outputstyle que va a comprimir el archivo css
    }).on('error', sass.logError)) // Estamos agregando un on que es un listener, dentro de el se esperan argumentos, el evento se indica en string y el nombre de la tarea y el metodo en este caso es un logError porque si hay errores no sabemoms cuales son y con esto ya nos dice que está pasando
    .pipe( dest('build/css', {sourcemaps: '.'})) //este pipe indica la ruta en la que se va a compilar el archivo css de esta función, {sourcemaps: '.'} si se le agrega un punto en ves de true crea el archivo app.scss.map
    done();
}

///
/**Codigo de node.js */
//Generar imagenes en thumbnails
export async function crop(done) {
    const inputFolder = 'src/img/gallery/full'
    const outputFolder = 'src/img/gallery/thumb';
    const width = 250;
    const height = 180;
    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true })
    }
    const images = fs.readdirSync(inputFolder).filter(file => {
        return /\.(jpg)$/i.test(path.extname(file));
    });
    try {
        images.forEach(file => {
            const inputFile = path.join(inputFolder, file)
            const outputFile = path.join(outputFolder, file)
            sharp(inputFile) 
                .resize(width, height, {
                    position: 'centre'
                })
                .toFile(outputFile)
        });

        done()
    } catch (error) {
        console.log(error)
    }
}


//Convertir en webp
export async function imagenes(done) {
    const srcDir = './src/img';
    const buildDir = './build/img';
    const images =  await glob('./src/img/**/*{jpg,png}')

    images.forEach(file => {
        const relativePath = path.relative(srcDir, path.dirname(file));
        const outputSubDir = path.join(buildDir, relativePath);
        procesarImagenes(file, outputSubDir);
    });
    done();
}

function procesarImagenes(file, outputSubDir) {
    if (!fs.existsSync(outputSubDir)) {
        fs.mkdirSync(outputSubDir, { recursive: true })
    }
    const baseName = path.basename(file, path.extname(file))
    const extName = path.extname(file)
    const outputFile = path.join(outputSubDir, `${baseName}${extName}`)
    const outputFileWebp = path.join(outputSubDir, `${baseName}.webp`)
    const outputFileAvif = path.join(outputSubDir, `${baseName}.avif`)

    const options = { quality: 80 }
    sharp(file).jpeg(options).toFile(outputFile)
    sharp(file).webp(options).toFile(outputFileWebp)
    sharp(file).avif().toFile(outputFileAvif)
}
///

/**Funcion que va a ejecutarse cada que se realicen cambios en la ruta indicada */
export function dev() {
    //watch('src/scss/app.scss', css); // se llama a la función watch, como "paramteros" para que revise los cambios que se realicen, se le dá el nombre de la ruta del archivo que tendrá dichos cambios y le decimos que va a observar la función css que es la que mostrará los cambios
    watch('src/scss/**/*.scss', css); // modificamos la ruta para indicar que lea todas las carpetas y todos los archivos con extension .scss
    watch('src/js/**/*.js', js);
    watch('src/img/**/*.{png,jpg}', imagenes); //Indicamos que formatos va a converti
}

/**Funcion que compila un archivo y lo comvierte en el destino */
export function js( done ){
    src('src/js/app.js')
    .pipe(terser())//se llama a terser que va a funcionar para minificar el archivo de JavaScript
    .pipe( dest('build/js'))
    done();
}

export default series(crop, js, css, imagenes, dev); // series toma las diferentes tareas creadas en este archivo y las ejecuta siempre que estas se nombren como parametros
// export default parallel( js, css, dev); // parallel toma las diferentes tareas creadas en este archivo y las ejecuta todas al mismo tiempo