// Script JS calculadora de excesos
// Actualizado al acuerdo de la Comisión Negociadora del día 25 de mayo de 2023
//Copyright (C) 2023  H. Garabito 
//Web publicada bajo la licencia GPLv3. https://www.gnu.org/licenses/

function calculator(option) {
    var TiempoToma = document.getElementById("inputHoraToma").value;
    var HoraPrimer = document.getElementById("inputHoraPrimer").value;
    var HoraUltimo = document.getElementById("inputHoraUltimo").value;
    var HoraFin = document.getElementById("inputHoraFin").value;
    var HoraInicio = document.getElementById("inputHoraInicio").value;
    var HoraTeorica = document.getElementById("inputHoraTeorica").value;
    var HoraRealizada = document.getElementById("inputHoraRealizada").value;

    var tiempoMinJornada = 433; // Tiempo mínimo de jornada según ADPC y acuerdos

    var alertaModal = new bootstrap.Modal(document.getElementById('alertaModal'), {});
    if(isNaN(TiempoToma)) {
        TiempoToma = 15; //Tiempo mínimo de toma según ADPC
    } else {
        TiempoToma = parseInt(TiempoToma);
    }
    if(!document.getElementById('inputAC').checked) {
        var HorasDedicacion = Math.round((diff(HoraPrimer,HoraUltimo)-tiempoMinJornada+TiempoToma+15)*1.65);
    } else {
        var HorasDedicacion = Math.round((diff(HoraPrimer,HoraUltimo)-tiempoMinJornada+15)*1.65);
    }
    var HorasMerma = Math.round(diff(HoraFin,HoraInicio));
    var HorasExtra = Math.round((HoraRealizada-HoraTeorica)*60*1.75);
    var HorasTotales = 0;
       //Comprobaciones iniciales
       if(isNaN(HorasDedicacion)) {
           HorasDedicacion = 0;
       } 
       if(isNaN(HorasMerma)) {
            HorasMerma = 0;
       } else {
        HorasMerma = HorasMerma - 480; // Ajuste para considerar las 8 horas mínimas entre jornadas para considerar interrumpido el descanso
        if(HorasMerma >= 0 && HorasMerma < 60) {
               HorasMerma = (60-HorasMerma)*1.5;
        }else if (HorasMerma >= 180 && HorasMerma < 361) {
               HorasMerma = -(HorasMerma-360)*1.5;
        } else {
            HorasMerma = 0;
        }
       }
    if(isNaN(HorasExtra)) {
        HorasExtra = 0;
    }
    if (div_horas_totales.style.display === "none") {
        div_horas_totales.style.display = "block";
    }
    switch(option) {
           case 1: //Horas de mayor dedicacion
               if (div_horas_dedicacion.style.display === "none") {
                div_horas_dedicacion.style.display = "block";
            }
            if(document.getElementById("boton_dedicacion").firstChild.data === "Calcula!") {
                if(HorasDedicacion > 0) {
                    document.getElementById("horas_dedicacion").innerHTML="Mayor dedicación: "+HorasDedicacion+" minutos";
                //} else if (HorasDedicacion > 420) {
                  //document.getElementById("horas_dedicacion").innerHTML="Has superado las 12 horas de turno. A compensar quedan "+HorasDedicacion+" minutos";
                } else {
                    document.getElementById("horas_dedicacion").innerHTML="No da lugar a compensación por horas de mayor dedicación";
                }
                document.getElementById("boton_dedicacion").firstChild.data = "Reset";
            } else {
                div_horas_dedicacion.style.display = "none";
                document.getElementById("form_dedicacion").reset(); 
                document.getElementById("boton_dedicacion").firstChild.data = "Calcula!";
                HorasDedicacion = 0;
            }
               break;
           case 2: //Horas de merma de descanso
               if (div_horas_merma.style.display === "none") {
                div_horas_merma.style.display = "block";
            } 
            if(document.getElementById("boton_merma").firstChild.data === "Calcula!") {
                if(HorasMerma > 0 && HorasMerma <= 180) {
                    document.getElementById("horas_merma").innerHTML="Merma de descanso: "+HorasMerma+" minutos";
                } else if (HorasMerma >= 180) {
                    document.getElementById("horas_merma").innerHTML=HorasMerma+" minutos. Ten en cuenta que no ha habido una interrupción de jornada al haber menos de 12 horas de descanso";
                } else {
                    document.getElementById("horas_merma").innerHTML="No da lugar a compensación por merma de descanso.";
                }
                document.getElementById("boton_merma").firstChild.data = "Reset";
            } else {
                HorasMerma = 0;
                div_horas_merma.style.display = "none";
                document.getElementById("form_merma").reset();
                document.getElementById("boton_merma").firstChild.data = "Calcula!";
            }
               break;
           case 3: //Horas extraordinarias
               if (div_horas_extra.style.display === "none") {
                div_horas_extra.style.display = "block";
            } 
            if(document.getElementById("boton_extra").firstChild.data === "Calcula!") {
                if(HorasExtra > 0) {
                    document.getElementById("horas_extra").innerHTML="Horas Extra: "+HorasExtra+" minutos";
                } else {
                    document.getElementById("horas_extra").innerHTML="No da lugar a compensación por horas extra";
                }
                document.getElementById("boton_extra").firstChild.data = "Reset";
            } else {
                HorasExtra = 0;
                div_horas_extra.style.display = "none";
                document.getElementById("form_extra").reset();
                document.getElementById("boton_extra").firstChild.data = "Calcula!";
            }
               break;
           case 4: //Reseta toda la calculadora
               div_totales.style.display="none";
               div_horas_dedicacion.style.display="none";
               div_horas_merma.style.display="none";
               div_horas_extra.style.display="none";
               div_horas_totales.style.display="none";
               HorasExtra = 0;
               HorasMerma = 0;
               HorasDedicacion = 0;
               document.getElementById("form_extra").reset();
               document.getElementById("form_merma").reset();
               document.getElementById("form_dedicacion").reset(); 
               document.getElementById("boton_dedicacion").firstChild.data = "Calcula!";
               document.getElementById("boton_merma").firstChild.data = "Calcula!";
               document.getElementById("boton_extra").firstChild.data = "Calcula!";
               break;
           case 5: //Genera el PDF de los excesos
               if(HorasExtra > 0 || HorasMerma > 0 || HorasDedicacion > 0) {
                   document.getElementById("boton_pdf").firstChild.data = "Generando PDF...";
                   document.getElementById("boton_pdf").disabled = true;
                   var data = {
               "horasMD": HorasDedicacion,
               "horasMerma": HorasMerma,
               "horasExtra": HorasExtra
                };
                var formBody = [];
                for (var property in data) {
                  var encodedKey = encodeURIComponent(property);
                  var encodedValue = encodeURIComponent(data[property]);
                  formBody.push(encodedKey + "=" + encodedValue);
                }
                formBody = formBody.join("&");
                // Send a post request
                fetch('/calculadora/pdf', {
                   method: 'POST',
                   headers: {
                          'Content-Type': 'application/x-www-form-urlencoded',
                   },
                   body: formBody
                })
                .then(response => response.json())
                .then(data => {
                    if(data.status === 'ok') {
                        window.open('/calculadora/download/'+data.file);
                    } else if (data.status === 'pdf_error') {
                        document.getElementById("modal_text").innerHTML="Ha habido un error generando el archivo PDF. Por favor, vuelve a intentarlo más tarde.";
                        alertaModal.show();
                    } else {
                        document.getElementById("modal_text").innerHTML="Ha habido un error descargando el archivo PDF. Por favor, vuelve a intentarlo más tarde.";
                        alertaModal.show();
                    }
                })
                document.getElementById("boton_pdf").firstChild.data = "Generar PDF";
                document.getElementById("boton_pdf").firstChild.disabled = false;
               } else {
                document.getElementById("modal_text").innerHTML="Rellena alguno de los campos para poder generar el PDF.";
                alertaModal.show();
               }
               break;
           default:
           //Nada
       }
       HorasTotales = Math.round(HorasDedicacion+HorasMerma+HorasExtra);
       if(HorasTotales > 0) {
        div_totales.style.display = "block";
        document.getElementById("horas_totales").innerHTML=HorasTotales+" minutos a compensar. <br />"+Math.floor(HorasTotales/60)+" Horas y "+Math.round(HorasTotales%60)+" minutos.";
    }
}
function diff(start, end) {
    start = start.split(":");
    end = end.split(":");
    var startDate = new Date(0, 0, 0, start[0], start[1], 0, 0);
    var endDate = new Date(0, 0, 0, end[0], end[1], 0, 0);

    //for calculation to work if endtime cross over next day. Eg. 11pm to 2am
    if (endDate.getTime() < startDate.getTime()) {
        endDate.setDate(endDate.getDate() + 1);
    }
    var diff = endDate.getTime() - startDate.getTime();
    var minutes = Math.floor(diff / 1000 / 60);
    diff -= minutes * 1000 * 60;

    return minutes;
}