import { Component } from '@angular/core';
declare var jQuery: any;
declare var $: any;

let i = 0
let bandera_traduccion = true

var traducir;
var traduccionTexto = ""
var traduccionMorse = ""
var cantidad = 1
let caracteres = 0

// Calculos de porcentajes de aciertos
let aciertos_texto = 0
let cantidad_texto = 0
let resultado_texto = 0

let aciertos_morse = 0
let cantidad_morse = 0
let resultado_morse = 0

// Contador de colores
let color1 = true
let color2 = true
let color3 = true
let color4 = true

// Contador para cambiar traduccion
let contador__traduccion = true

// Contador para abrir y cerrar diccionario
let diccionario = true


let contador_estadisticas = true
let contador_configuracion = true

// Texto
let texto = ""
let texto_total = ""

const alfabeto = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ"
const numeros = "01234567890123456789"
const simbolos = ",.=:!?"

// Morse
let morse = []
let morse_total: any = []
let CodigoMorseParaAudio = ''

const alfabeto_morse = ['.-', '-...', '-.-.', '-..', '.', '..-.', '--.', '....', '..', '.---', '-.-', '.-..', '--', '-.', '--.--', '---', '.--.', '--.-', '.-.', '...', '-', '..-', '...-', '.--', '-..-', '-.--', '--..']
const numeros_morse = ['-----', '.----', '..---', '...--', '....-', '.....', '-....', '--...', '---..', '----.', '-----', '.----', '..---', '...--', '....-', '.....', '-....', '--...', '---..', '----.']
const simbolos_morse = ['--..--', '.-.-.-', '-...-', '---...', '-.-.--', '..--..']

var contador_general = true
var contador__alfabetico = true
var contador__numerico = true
var contador__simbolico = true

// Configuracion pipidos
let pipidoCorto = new Audio()
pipidoCorto.src = "../assets/corto.mp3"
let pipidoLargo = new Audio()
pipidoLargo.src = "../assets/largo.mp3"


var morseCode = {
    'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.', 'g': '--.',
    'h': '....', 'i': '..', 'j': '.---', 'k': '-.-', 'l': '.-..', 'm': '--', 'n': '-.',
    'o': '---', 'p': '.--.', 'q': '--.-', 'r': '.-.', 's': '...', 't': '-', 'u': '..-',
    'v': '...-', 'w': '.--', 'x': '-..-', 'y': '-.--', 'z': '--..', '1': '.----',
    '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
    '8': '---..', '9': '----.', '0': '-----'
  };
  // Define Morse code timing constants
var DOT_TIME = 100; // duration of a dot in milliseconds
var DASH_TIME = DOT_TIME * 3; // duration of a dash in milliseconds
var SPACE_TIME = DOT_TIME; // duration of space between signals in milliseconds
var LETTER_SPACE_TIME = DOT_TIME * 3; // duration of space between letters in milliseconds
var WORD_SPACE_TIME = DOT_TIME * 7; // duration of space between words in milliseconds

// Define audio context and oscillator
var audioContext = new AudioContext();
var oscillator = audioContext.createOscillator();
oscillator.type = 'sine';
oscillator.frequency.value = 600; // frequency of the audio signal in hertz
oscillator.start(0);

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    constructor() {
        $(function () {
            // CONTROL DE CANTIDAD DE CARACTERES A TRADUCIR
            $('.input-cantidad').change(function () {
                // Hago que el input responsive tome el valor del input de escritorio cada vez que el input de escritorio cambie
                $('.input-cantidad-resp').val($('.input-cantidad-esc').val())

                if ($('input-cantidad').val() <= 0) {
                    alert("La cantidad mínima es 1")
                    $('input-cantidad').val(1)
                }
                if ($('input-cantidad').val() >= 21) {
                    alert("La cantidad mínima es 20")
                    $('input-cantidad').val(20)
                }
                generarTexto()
            })

            // BTN ACEPTAR
            $('.btn-aceptar').click(function () {
                // repetitions += 1;
                // if (repetitions < 2) {
                //     audio.addEventListener("ended", ejecutarAudio);
                // }
                var ingreso = $('.traduccion__input').val().toUpperCase()
                var errores = []
                var mostrarerrores = ""
                let traduccionAMorseListo = ""
                let traduccionATextoListo = ""


                if (contador__traduccion == false) { // Traduccion de texto a morse

                    ingreso += ' '
                    for (let i = 0; i < morse_total.length; i++) {
                        traduccionAMorseListo += morse_total[i] + " "
                    }

                    if (traduccionAMorseListo === ingreso) { // Si la traduccion es correcta

                        cantidad_morse += 1
                        aciertos_morse += 1

                        // Seccion para calcular porcentaje texto
                        let porcentaje_texto = 0
                        porcentaje_texto = Math.floor((aciertos_morse * 100) / cantidad_morse)
                        $('.porcentaje_a_morse').text(+ porcentaje_texto + "%") // Calcular texto

                        // Seccion para calcular porcentaje grafico
                        let porcentaje_grafico = 0
                        porcentaje_grafico = ((cantidad_morse - aciertos_morse) * 100) / cantidad_morse // Para calcular inverso del porcentaje_texto (si porcentaje_texto = 1/5 | este seria = 4/5)
                        porcentaje_grafico = ((porcentaje_grafico) * 450) / 100
                        $('.circle-a-morse').css('stroke-dashoffset', porcentaje_grafico) // Calcular grafico


                        animacion_aparecer_alert()
                        animacion_stop()
                        animacion_desaparecer_alert()

                        function animacion_aparecer_alert() {
                            $('.alert-success').animate({
                                top: '20px'
                            }, 500)
                        }

                        function animacion_stop() {
                            $('.alert-success').animate({
                                top: '20px'
                            }, 400)
                        }

                        function animacion_desaparecer_alert() {
                            $('.alert-success').animate({
                                top: '-120px'
                            }, 500)
                        }


                        generarTexto()
                    } else { // Si la traduccion es incorrecta

                        cantidad_morse += 1

                        // Seccion para calcular porcentaje texto
                        let porcentaje_texto = 0
                        porcentaje_texto = Math.floor((aciertos_morse * 100) / cantidad_morse)
                        $('.porcentaje_a_morse').text(+ porcentaje_texto + "%")

                        // Seccion para calcular porcentaje grafico
                        let porcentaje_grafico = 0
                        porcentaje_grafico = ((cantidad_morse - aciertos_morse) * 100) / cantidad_morse // Para calcular inverso del porcentaje_texto (si porcentaje_texto = 1/5 | este seria = 4/5)
                        porcentaje_grafico = ((porcentaje_grafico) * 450) / 100
                        $('.circle-a-morse').css('stroke-dashoffset', porcentaje_grafico) // Calcular grafico


                        $('.lista-errores').text("Traduccion correcta: " + traduccionAMorseListo)
                        animacion_aparecer_error()
                        function animacion_aparecer_error() {
                            $('.alert-danger').animate({
                                top: '20px'
                            }, 500)
                        }


                    }
                } else { // Traduccion de morse a texto
                    for (let i = 0; i < texto_total.length; i++) {
                        traduccionATextoListo += texto_total[i]
                    }

                    if (traduccionATextoListo === ingreso) { // Si la traduccion es correcta

                        cantidad_texto += 1
                        aciertos_texto += 1

                        // Seccion para calcular porcentaje texto
                        let porcentaje_texto = 0
                        porcentaje_texto = Math.floor((aciertos_texto * 100) / cantidad_texto)
                        $('.porcentaje_a_texto').text(+ porcentaje_texto + "%") // Calcular texto

                        // Seccion para calcular porcentaje grafico
                        let porcentaje_grafico = 0
                        porcentaje_grafico = ((cantidad_texto - aciertos_texto) * 100) / cantidad_texto // Para calcular inverso del porcentaje_texto (si porcentaje_texto = 1/5 | este seria = 4/5)
                        porcentaje_grafico = ((porcentaje_grafico) * 450) / 100
                        $('.circle-a-texto').css('stroke-dashoffset', porcentaje_grafico) // Calcular grafico

                        animacion_aparecer_alert()
                        animacion_stop()
                        animacion_desaparecer_alert()

                        function animacion_aparecer_alert() {
                            $('.alert-success').animate({
                                top: '20px'
                            }, 500)
                        }
                        function animacion_stop() {
                            $('.alert-success').animate({
                                top: '20px'
                            }, 400)
                        }
                        function animacion_desaparecer_alert() {
                            $('.alert-success').animate({
                                top: '-120px'
                            }, 500)
                        }

                        generarTexto()

                    } else { // Si la traduccion es incorrecta

                        cantidad_texto += 1

                        // Seccion para calcular porcentaje texto
                        let porcentaje_texto = 0
                        porcentaje_texto = Math.floor((aciertos_texto * 100) / cantidad_texto)
                        $('.porcentaje_a_texto').text(+ porcentaje_texto + "%")

                        // Seccion para calcular porcentaje grafico
                        let porcentaje_grafico = 0
                        porcentaje_grafico = ((cantidad_texto - aciertos_texto) * 100) / cantidad_texto // Para calcular inverso del porcentaje_texto (si porcentaje_texto = 1/5 | este seria = 4/5)
                        porcentaje_grafico = ((porcentaje_grafico) * 450) / 100
                        $('.circle-a-texto').css('stroke-dashoffset', porcentaje_grafico) // Calcular grafico


                        $('.lista-errores').text("Traduccion correcta: " + traduccionATextoListo)
                        animacion_aparecer_error()
                        function animacion_aparecer_error() {
                            $('.alert-danger').animate({
                                top: '20px'
                            }, 500)
                        }
                        $('.traduccion__btn-confirmar').prop('disabled', true)
                    }
                }

            })



            // INPUT ESCRITORIO = INPUT RESPONSIVE
            $('.traduccion__input-responsive').change(() => {
                $('.traduccion__input').val($('.traduccion__input-responsive').val())
            })

            // INPUT RESPONSIVE = INPUT ESCRITORIO
            $('.traduccion__input').change(() => {
                $('.traduccion__input-responsive').val($('.traduccion__input').val())
            })

            // ACTIVAR ALFABETO
            $('.activar-alfabeto').change(function () {
                if (contador__alfabetico == true) {

                    contador__alfabetico = false
                    $('.btn-aceptar').prop('disabled', false)
                    generarTexto()
                } else {

                    contador__alfabetico = true
                    caracteres = 25

                    if (contador__alfabetico == true && contador__numerico == true && contador__simbolico == true) {
                        texto_total = ""
                        $('.texto').text("")
                        $('.btn-aceptar').prop('disabled', true)
                    }
                    generarTexto()
                }

            })

            // ACTIVAR NUMEROS
            $('.activar-numeros').click(function () {
                if (contador__numerico == true) {


                    contador__numerico = false
                    $('.btn-aceptar').prop('disabled', false)
                    generarTexto()
                } else {
                    contador__numerico = true
                    caracteres = 10

                    if (contador__alfabetico == true && contador__numerico == true && contador__simbolico == true) {
                        texto_total = ""
                        $('.texto').text("")
                        $('.btn-aceptar').prop('disabled', true)
                    }
                    generarTexto()
                }
            })

            // ACTIVAR SIMBOLOS
            $('.activar-simbolos').click(function () {
                if (contador__simbolico == true) {


                    contador__simbolico = false
                    $('.btn-aceptar').prop('disabled', false)
                    generarTexto()
                } else {
                    contador__simbolico = true
                    caracteres = 10

                    if (contador__alfabetico == true && contador__numerico == true && contador__simbolico == true) {
                        texto_total = ""
                        $('.texto').text("")
                        $('.btn-aceptar').prop('disabled', true)
                    }
                    generarTexto()
                }
            })

            // CAMBIAR TRADUCCION
            $('.tipo-traduccion').click(function () {
                cambiarTraduccion()
            })

            $('.traduccion-a-texto').click(() => {
                $('.tipo-de-traduccion').text('.-')
                contador__traduccion = false
                cambiarTraduccion()
            })

            $('.traduccion-a-morse').click(() => {
                $('.tipo-de-traduccion').text('A')
                contador__traduccion = true
                cambiarTraduccion()
            })

            //   AUMENTAR CANTIDAD
            $('.btn-aumentar-cant').click(() => {
                let cantidad: number = $('.input-cantidad').val()
                cantidad++
                $('.input-cantidad').val(cantidad)
                aumentarcantidad()
            })

            //   REDUCIR CANTIDAD
            $('.btn-reducir-cant').click(() => {
                let cantidad: number = $('.input-cantidad').val()
                cantidad--
                $('.input-cantidad').val(cantidad)
                reducircantidad()
            })

            //   PRESIONAR BOTON NUMEROS RESPONSIVE
            $('.activar-numeros-responsive').on('change', function () {
                // Check if checkbox is checked
                if ($(this).is(':checked')) {
                    // Set checkbox to checked
                    $(this).prop('checked', true);
                    $('.activar-numeros').prop('checked', true);
                } else {
                    // Set checkbox to unchecked
                    $(this).prop('checked', false);
                    $('.activar-numeros').prop('checked', false);
                }
            });

            //   PRESIONAR BOTON NUMEROS
            $('.activar-numeros').on('change', function () {
                // Check if checkbox is checked
                if ($(this).is(':checked')) {
                    // Set checkbox to checked
                    $(this).prop('checked', true);
                    $('.activar-numeros-responsive').prop('checked', true);
                } else {
                    // Set checkbox to unchecked
                    $(this).prop('checked', false);
                    $('.activar-numeros-responsive').prop('checked', false);
                }
            });

            //   PRESIONAR BOTON ALFABETO RESPONSIVE
            $('.activar-alfabeto-responsive').on('change', function () {
                // Check if checkbox is checked
                if ($(this).is(':checked')) {
                    // Set checkbox to checked
                    $(this).prop('checked', true);
                    $('.activar-alfabeto').prop('checked', true);
                } else {
                    // Set checkbox to unchecked
                    $(this).prop('checked', false);
                    $('.activar-alfabeto').prop('checked', false);
                }
            });

            //   PRESIONAR BOTON ALFABETO
            $('.activar-alfabeto').on('change', function () {
                // Check if checkbox is checked
                if ($(this).is(':checked')) {
                    // Set checkbox to checked
                    $(this).prop('checked', true);
                    $('.activar-alfabeto-responsive').prop('checked', true);
                } else {
                    // Set checkbox to unchecked
                    $(this).prop('checked', false);
                    $('.activar-alfabeto-responsive').prop('checked', false);
                }
            });

            //   PRESIONAR BOTON SIMBOLOS RESPONSIVE
            $('.activar-simbolos-responsive').on('change', function () {
                // Check if checkbox is checked
                if ($(this).is(':checked')) {
                    // Set checkbox to checked
                    $(this).prop('checked', true);
                    $('.activar-simbolos').prop('checked', true);
                } else {
                    // Set checkbox to unchecked
                    $(this).prop('checked', false);
                    $('.activar-simbolos').prop('checked', false);
                }
            });

            //   PRESIONAR BOTON SIMBOLOS
            $('.activar-simbolos').on('change', function () {
                // Check if checkbox is checked
                if ($(this).is(':checked')) {
                    // Set checkbox to checked
                    $(this).prop('checked', true);
                    $('.activar-simbolos-responsive').prop('checked', true);
                } else {
                    // Set checkbox to unchecked
                    $(this).prop('checked', false);
                    $('.activar-simbolos-responsive').prop('checked', false);
                }
            });

            // ALERTA ERROR
            $('.btn-close-alert').click(() => {
                animacion_aparecer_error()
                function animacion_aparecer_error() {
                    $('.alert-danger').animate({
                        top: '-140px'
                    }, 500)
                }
            })



        })
    }



    public Traduccion() {
        if (bandera_traduccion === true) {
            $('.responsive-header').css({
                'width': '110px'
            })
        } else {
            $('.responsive-header').css({
                'width': '35px'
            })
        }
        bandera_traduccion = !bandera_traduccion
    }
}




$(document).ready(function () {
    mostrarEstadisticas()
    $(function () {
        $('.btn-aceptar').prop('disabled', true)
    })
})



// Define functions to play dots and dashes
function playDot() {
    oscillator.frequency.value = 600;
    oscillator.connect(audioContext.destination);
    setTimeout(function() {
      oscillator.disconnect(audioContext.destination);
    }, DOT_TIME);
  }
  
  function playDash() {
    oscillator.frequency.value = 600;
    oscillator.connect(audioContext.destination);
    setTimeout(function() {
      oscillator.disconnect(audioContext.destination);
    }, DASH_TIME);
  }
  
  // Define function to play Morse code for a given message
//   function playMorseCode(message) {
//     var signals = [];
//     for (var i = 0; i < message.length; i++) {
//       var letter = message[i].toLowerCase();
//       if (morseCode[letter]) {
//         signals.push.apply(signals, morseCode[letter].split(''));
//         signals.push(' ');
//       } else if (letter === ' ') {
//         signals.push('/');
//       }
//     }
//     var i = 0;
//     function playNextSignal() {
//       if (i < signals.length) {
//         var signal = signals[i];
//         if (signal === '.') {
//           playDot();
//           setTimeout(playNextSignal, SPACE_TIME);
//         } else if (signal === '-') {
//           playDash();
//           setTimeout(playNextSignal, SPACE_TIME);
//         } else if (signal === ' ') {
//           setTimeout(playNextSignal, LETTER_SPACE_TIME);
//         } else if (signal === '/') {
//           setTimeout(playNextSignal, WORD_SPACE_TIME);
//         }
//         i++;
//       }
//     }
//     playNextSignal();
//   }

  function playNextSignal() {
    if (i < CodigoMorseParaAudio.length) {
      var signal = CodigoMorseParaAudio[i];
      if (signal === '.') {
        playDot();
        setTimeout(playNextSignal, SPACE_TIME);
      } else if (signal === '-') {
        playDash();
        setTimeout(playNextSignal, SPACE_TIME);
      } else if (signal === ' ') {
        setTimeout(playNextSignal, LETTER_SPACE_TIME);
      } else if (signal === '/') {
        setTimeout(playNextSignal, WORD_SPACE_TIME);
      }
      i++;
    }
  }


// Metodo para reducir la cantidad de caracteres a traducir
function reducircantidad() {
    texto_total = ""
    $('.texto').text("")

    if (cantidad <= 1) {
        alert("La cantidad minima de caracteres a traducir es 1!")

        $('.input-cantidad').val(1)
        $('.traduccionTexto__input').focus();

        // for (let i = 0; i < cantidad; i++) {
        //   let aleatorio = Math.floor(Math.random()*texto.length)
        //   texto_total += texto.charAt(aleatorio)
        // }

        // $('.texto').text(texto_total)
        generarTexto()
    } else {
        $('.texto').text("");

        $('.input-cantidad').text(cantidad - 1)
        --cantidad
        traduccionTexto = ""
        traduccionMorse = ""

        // switch (cantidad) {
        //     case 7:
        //         $('.traduccion__input').css('font-size', '260%')
        //         $('.texto').css('font-size', '600%')
        //         break;
        //     case 8:
        //         $('.traduccion__input').css('font-size', '220%')
        //         $('.texto').css('font-size', '500%')
        //         break;
        //     case 9:
        //         $('.traduccion__input').css('font-size', '180%')
        //         $('.texto').css('font-size', '400%')
        //         break;
        //     default:
        //         break;
        // }
        // for (let i = 0; i < cantidad; i++) {
        //   let aleatorio = Math.floor(Math.random()*texto.length)
        //   texto_total += texto.charAt(aleatorio)
        // }

        // $('.texto').text(texto_total)
        generarTexto()
    }


}

// Metodo para aumentar la cantidad de caracteres a traducir
function aumentarcantidad() {
    texto_total = ""
    $('.texto').text("")

    if (cantidad >= 16) {
        alert("Ha alcanzado el limite!")
        $('.traduccionTexto__input').focus();

        // for (let i = 0; i < cantidad; i++) {
        //   let aleatorio = Math.floor(Math.random()*texto.length)
        //   texto_total += texto.charAt(aleatorio)
        // }

        // $('.texto').text(texto_total)
        generarTexto()

    } else {
        $('.texto').text("");
        $('.input-cantidad').text(cantidad + 1)
        ++cantidad
        traduccionTexto = ""
        traduccionMorse = ""


        // switch (cantidad) {
        //     case 7:
        //         $('.traduccion__input').css('font-size', '260%')
        //         $('.texto').css('font-size', '600%')
        //         break;
        //     case 8:
        //         $('.traduccion__input').css('font-size', '220%')
        //         $('.texto').css('font-size', '500%')
        //         break;
        //     case 9:
        //         $('.traduccion__input').css('font-size', '180%')
        //         $('.texto').css('font-size', '400%')
        //         break;
        //     default:
        //         break;
        // }

        // for (let i = 0; i < cantidad; i++) {
        //   let aleatorio = Math.floor(Math.random()*texto.length)
        //   texto_total += texto.charAt(aleatorio)
        // }

        // $('.texto').text(texto_total)
        generarTexto()
    }
}

//  Metodo para indicar tipo de traduccionTexto
function cambiarTraduccion() {
    if (contador__traduccion == true) {
        // MODO ESCRITORIO
        $('.tipo-traduccion').css('transform', 'rotateZ(180deg)')

        // MODO RESPONSIVE
        $('.responsive-header').css({
            'width': '110px'
        })
        contador__traduccion = false
    } else {
        // MODO ESCRITORIO
        $('.tipo-traduccion').css('transform', 'rotateZ(0deg)')

        // MODO RESPONSIVE
        $('.responsive-header').css({
            'width': '35px'
        })
        contador__traduccion = true
    }
    $('.texto').text("");
    traduccionTexto = ""
    traduccionMorse = ""
    generarTexto()
}


// Metodo para abrir diccionario
function abrirDiccionario() {
    if (diccionario == true) {
        $('.diccionario').css('display', 'flex')
        diccionario = false
    } else {
        $('.diccionario').css('display', 'none')
        $('.traduccion__input').focus();
        diccionario = true
    }
}

function generarTexto() {
    $(function () {
        $('.traduccion__input').val("");
        $('.traduccion__input-responsive').val("");
        $('.traduccion__input-responsive').focus();
        $('.texto').text("")
        texto_total = ""
        texto = ""
        morse = []
        morse_total = []
        CodigoMorseParaAudio = ''

        cantidad = $('.input-cantidad').val()


        if (contador__alfabetico == false) {
            texto += alfabeto

            for (let i = 0; i < alfabeto_morse.length; i++) {
                morse.push(alfabeto_morse[i])
            }
        }

        if (contador__numerico == false) {
            texto += numeros

            for (let i = 0; i < numeros_morse.length; i++) {
                morse.push(numeros_morse[i])
            }
        }

        if (contador__simbolico == false) {
            texto += simbolos

            for (let i = 0; i < simbolos_morse.length; i++) {
                morse.push(simbolos_morse[i])
            }
        }

        if (contador__traduccion == false) {


            for (let i = 0; i < cantidad; i++) {
                let aleatorio = Math.floor(Math.random() * texto.length)
                texto_total += texto.charAt(aleatorio)
                morse_total.push(morse[aleatorio])
                $('.texto').text(texto_total)
                if (cantidad < 8) {

                } else {

                }
            }
        } else {
            for (let i = 0; i < cantidad; i++) {
                let aleatorio = Math.floor(Math.random() * texto.length)
                texto_total += texto.charAt(aleatorio)
                // morse_total.push(morse[aleatorio])
                morse_total += (morse[aleatorio] + ' | ')
                CodigoMorseParaAudio += (morse[aleatorio] + ' ')


                // Si el alfabeto, numeros y simbolos estan apagados. Muestro nada
                if (contador__alfabetico != false && contador__numerico != false && contador__simbolico != false) {
                    $('.texto').text("")
                } else { // Si no, muestro los datos
                    // $('.texto').text($('.texto').text() + morse[aleatorio] + ' |')
                    $('.texto').text(morse_total)
                    // console.log(CodigoMorseParaAudio)
                }
            }
        }
    })
}


function modificarCantidad() {
    if (contador_general == true) {

        contador_general = false
    } else {

        contador_general = true
    }
}

// function activarAlfabeto() {
//     if (contador__alfabetico == true) {

//         contador__alfabetico = false
//         $('.traduccion__btn-confirmar').prop('disabled', false)
//         generarTexto()
//     } else {

//         contador__alfabetico = true
//         caracteres = 25

//         if (contador__alfabetico == true && contador__numerico == true && contador__simbolico == true) {
//             texto_total = ""
//             $('.texto').text("")
//             $('.traduccion__btn-confirmar').prop('disabled', true)
//         }
//         generarTexto()
//     }
// }

// function activarNumeros() {
//     if (contador__numerico == true) {


//         contador__numerico = false
//         $('.traduccion__btn-confirmar').prop('disabled', false)
//         generarTexto()
//     } else {
//         contador__numerico = true
//         caracteres = 10

//         if (contador__alfabetico == true && contador__numerico == true && contador__simbolico == true) {
//             texto_total = ""
//             $('.texto').text("")
//             $('.traduccion__btn-confirmar').prop('disabled', true)
//         }
//         generarTexto()
//     }
// }

function activarSimbolos() {
    if (contador__simbolico == true) {


        contador__simbolico = false
        $('.traduccion__btn-confirmar').prop('disabled', false)
        generarTexto()
    } else {

        contador__simbolico = true
        caracteres = 10

        if (contador__alfabetico == true && contador__numerico == true && contador__simbolico == true) {
            texto_total = ""
            $('.texto').text("")
            $('.traduccion__btn-confirmar').prop('disabled', true)
        }
        generarTexto()
    }
}


function cerrarAlertaErrores() {
    animacion_desaparecer_error()
    function animacion_desaparecer_error() {
        $('.alerta-error').animate({
            top: '-80px'
        }, 500)
    }
    $('.traduccion__input').val("");
    $('.traduccion__input').focus();
    $('.traduccion__btn-confirmar').prop('disabled', false)
    generarTexto()
}

function mostrarEstadisticas() {
    if (contador_estadisticas == true) {
        $('.sidebar2').css('width', '375px')

        $('.circle-a-texto').css('animation', 'mover 6s')
        $('.circle-a-texto').css('animation-fill-mode', 'both')
        $('.circle-a-morse').css('animation', 'mover 6s')
        $('.circle-a-morse').css('animation-fill-mode', 'both')
        contador_estadisticas = false

        $('.sidebar__configuracion').css('width', '0')
        contador_configuracion = true
    } else {
        $('.sidebar2').css('width', '0')
        contador_estadisticas = true
    }
}

function playAudio() {

    pipidoCorto.playbackRate = 4
    pipidoLargo.playbackRate = 4
    pipidoCorto.play(); // play pipidoCorto for the first time
  setTimeout(function() {
    pipidoCorto.play(); // play pipidoCorto for the second time after a delay
  }, 500); // delay for 500 milliseconds
  setTimeout(function() {
    pipidoLargo.play(); // play pipidoLargo after a delay
  }, 1000); // delay for 1000 milliseconds
  setTimeout(function() {
    pipidoCorto.play(); // play pipidoCorto for the third time after a delay
  }, 1500); // delay for 1500 milliseconds
}


(function ($) {
    "use strict"

    function Notification(props) {
        // see https://getbootstrap.com/docs/4.0/components/alerts/
        this.props = {
            body: "", // put here the text, shown
            type: "primary", // the appearance
            duration: 5500, // duration till auto-hide, set to `0` to disable auto-hide
            maxWidth: "520px", // the notification maxWidth
            minWidth: "320px", // the notification minWidth
            shadow: "0 2px 6px rgba(0,0,0,0.2)", // the box-shadow
            zIndex: 100,
            margin: "1rem", // the margin (above maxWidth)
            direction: "prepend" // or "append", the stack direction
        }
        this.containerId = "bootstrap-show-notification-container"
        for (let prop in props) {
            // noinspection JSUnfilteredForInLoop
            this.props[prop] = props[prop]
        }
        const cssClass = "alert alert-" + this.props.type + " alert-dismissible fade"
        this.id = "id-" + Math.random().toString(36).substr(2)
        this.template =
            "<div class='" + cssClass + "' role='alert'>" + this.props.body +
            "   <button type='button' class='close' data-dismiss='alert' aria-label='close'>" +
            "       <span aria-hidden='true'>&times;</span>" +
            "   </button>" +
            "</div>"
        this.$container = $("#" + this.containerId)
        if (!this.$container.length) {
            this.$container = $("<div id='" + this.containerId + "'></div>")
            $(document.body).append(this.$container)
            const css = "#" + this.containerId + " {" +
                "position: fixed;" +
                "right: " + this.props.margin + ";" +
                "top: " + this.props.margin + ";" +
                "margin-left: " + this.props.margin + ";" +
                "z-index: " + this.props.zIndex + ";" +
                "}" +
                "#" + this.containerId + " .alert {" +
                "box-shadow: " + this.props.shadow + ";" +
                "max-width: " + this.props.maxWidth + ";" +
                "min-width: " + this.props.minWidth + ";" +
                "float: right; clear: right;" +
                "}" +
                "@media screen and (max-width: " + this.props.maxWidth + ") {" +
                "#" + this.containerId + " {min-width: 0; max-width: 100%; width: 100%; right: 0; top: 0;}" +
                "#" + this.containerId + " .alert {min-width: 0; margin-bottom: 0.25rem;width: auto;float: none;}" +
                "}"
            const head = document.head || document.getElementsByTagName('head')[0]
            const style = document.createElement('style')
            head.appendChild(style)
            style.appendChild(document.createTextNode(css))
        }
        this.$element = this.showNotification()
    }
    Notification.prototype.showNotification = function () {
        const $notification = $(this.template)
        if (this.props.direction === "prepend") {
            this.$container.prepend($notification)
        } else {
            this.$container.append($notification)
        }
        $notification.addClass("show")
        if (this.props.duration) {
            setTimeout(function () {
                $notification.alert("close")
            }, this.props.duration)
        }
        return $notification
    }
    $.extend({
        showNotification: function (props) {
            return new Notification(props)
        }
    })
}(jQuery))





