function getColor(zona, afec, valorSeleccionado) {

    var arrayZonaAfectada = arrayZonasAfectadas(valorSeleccionado);
    var arrayColores = [
        '#a14965',
        '#e65b5e',
        '#fa8167',
        '#fbad74',
        '#f9c67f',
        '#f9e19d',
    ];

    if (zona == arrayZonaAfectada[0] && afec == 1) {
        return arrayColores[0];
    } else if (zona == arrayZonaAfectada[1] && afec == 1) {
        return arrayColores[1];
    } else if (zona == arrayZonaAfectada[2] && afec == 1) {
        return arrayColores[2];
    } else if (zona == arrayZonaAfectada[3] && afec == 1) {
        return arrayColores[3];
    } else if (zona == arrayZonaAfectada[4] && afec == 1) {
        return arrayColores[4];
    } else if (zona == arrayZonaAfectada[5] && afec == 1) {
        return arrayColores[5];
    } else {
        return 'rgba(128, 128, 128, 0)';
    }
}



//Actualizar cambio de datos en cuadros

function actualizarCuadros(valorSeleccionado) {
    var elemento1 = 'hospital';
    var elemento2 = 'colegios';
    var elemento4 = 'T_TOTAL';

    var cuadro1 = document.querySelector('.cuadro01')
    var cuadro3 = document.querySelector('.cuadro03');
    var cuadro4 = document.querySelector('.cuadro04');

    var imagenHospital = '<img src="img/iconos/edificio-del-hospital (1).png" alt="Descripción de la imagen" style="width: 50px;">&nbsp';

    var imagenColegio = '<img src="img/iconos/escuela.png" alt="Descripción de la imagen" style="width: 50px;">&nbsp';


    if (valorSeleccionado || valorSeleccionado == 2017) {
        var total_personas_afectadas = totalAfectados(valorSeleccionado, elemento4);
        var centro_salud_afectados = totalAfectados(valorSeleccionado, elemento1);
        var colegios_afectados = totalAfectados(valorSeleccionado, elemento2)

        cuadro1.innerHTML = total_personas_afectadas;
        cuadro3.innerHTML = imagenHospital + centro_salud_afectados;
        cuadro4.innerHTML = imagenColegio + colegios_afectados;

    }
}

//Establecer estilo de manzanas 
function estiloManzana(feature) {
    return {
        fillColor: getColor(feature.properties['afec_' + valorSeleccionado]),
        weight: 2,
        opacity: 1,
        color: 'rgba(128, 128, 128, 1)',
        fillOpacity: 0.7
    };
}

//Obtener zonas afectadas
//valor hace referencia al año
function arrayZonasAfectadas(valor) {
    var cantidad = manzanas_rimac.features.length;
    var miArray = [];
    for (let i = 0; i < cantidad; i++) {
        var manzanaAfectada = manzanas_rimac.features[i].properties['afec_' + valor];
        var zonaAfectada = manzanas_rimac.features[i].properties.ZONA;
        if (manzanaAfectada == 1 && !miArray.includes(zonaAfectada)) {
            miArray.push(zonaAfectada)
        }
    }
    return miArray;
}

// Convertir un array en objeto
function arrayToObject(x) {
    // Usar reduce para convertir el array en un objeto
    return x.reduce((obj, propiedad) => {
        // Asignar un valor inicial (puedes asignar cualquier valor)
        obj[propiedad] = null;
        return obj; // Importante: Devolver el objeto modificado en cada iteración
    }, {});
}

//Agregar a las propiedades del objeto el campo seleccionado
//zonaAfectada : cantidad de personas
//Obtener personas afectadas por zona
//valor: hace referencia al año
//campo: hace referencia al valor que se le asignará a la propiedad del objeto
function agregarValoresAObjetoZona(valor, campo) {
    var cantidad = manzanas_rimac.features.length;
    var miArray = arrayZonasAfectadas(valor);
    var objeto = arrayToObject(miArray);
    var cantidadArray = miArray.length;

    for (let j = 0; j < cantidadArray; j++) {
        var zonaAfect = miArray[j];
        objeto[zonaAfect] = 0; // Inicializar la propiedad en 0
        for (let i = 0; i < cantidad; i++) {
            var manzanaAfectada = manzanas_rimac.features[i].properties['afec_' + valor];
            var personasAfectZona = manzanas_rimac.features[i].properties[campo];
            if (manzanaAfectada == 1 && manzanas_rimac.features[i].properties.ZONA == zonaAfect) {
                // Acumular personasAfectZona solo para la zonaAfect específica
                objeto[zonaAfect] += personasAfectZona;
            }
        }
    }
    return objeto;
}

//Agregar cuadro estadistico tipo pastel en cuadro02
function agregarPastelEstadistico(arrayDeValores, arrayDePropiedades, arrayColores, cuadro) {
    // Cuadro 02
    var data = [{
        values: arrayDeValores,
        labels: arrayDePropiedades,
        type: 'pie',
        marker: {
            colors: arrayColores
        },
        insidetextfont: {
            color: 'black' // Establece el color del texto en el interior del gráfico de torta
        },
        outsidetextfont: {
            color: 'white' // Establece el color del texto fuera del gráfico de torta
        }
    }];

    var layout = {
        height: 200,
        width: 300,
        paper_bgcolor: 'rgba(240, 240, 240, 0)', // Establece el color de fondo del gráfico
        margin: {
            l: 30,
            r: 30,
            b: 30,
            t: 30
        },
        legend: {
            font: {
                color: 'white' // Puedes cambiar 'blue' al color que desees
            }
        }
    };

    var config = {
        displayModeBar: false
    }

    return Plotly.newPlot(cuadro, data, layout, config);
}

//Obtener la suma total de afectados sea instituciones o personas
//valor: año afectado
//elemento: campo de la tabla

function totalAfectados(valor, elemento) {
    var x;
    var suma = 0;
    var cantidad = manzanas_rimac.features.length

    for (let i = 0; i < cantidad; i++) {
        if (manzanas_rimac.features[i].properties['afec_' + valor] == 1 && manzanas_rimac.features[i].properties[elemento] != 0) {
            x = manzanas_rimac.features[i].properties[elemento];
            suma = suma + x;
        }
    }

    return suma;
}

//CUADRO 09

//Hace referencia a los botones del class cuadro09 

function mostrarContenido(numeroPestana, valorSeleccionado) {
    var cuadro12 = document.getElementById('informacion1');
    cuadro12.innerHTML = totalAfectados(valorSeleccionado, 'lotes');

    // Ocultar todos los contenidos
    document.getElementById('informacion1').style.display = 'none';
    document.getElementById('informacion2').style.display = 'none';

    // Mostrar el contenido de la pestaña seleccionada
    var contenidoId = 'informacion' + numeroPestana;
    document.getElementById(contenidoId).style.display = 'block';

    if (numeroPestana == 1) {
        var cuadro12 = document.getElementById('informacion1');
        cuadro12.innerHTML = totalAfectados(valorSeleccionado, 'lotes');

    } else if (numeroPestana == 2) {
        if (!valorSeleccionado) {
            valorSeleccionado = '2017';
        }

        var cuadro13 = document.getElementById('informacion2');
        var objetoLotesAfectadosZona = agregarValoresAObjetoZona(valorSeleccionado, 'lotes');
        var arrayDePropiedades = Object.keys(objetoLotesAfectadosZona);
        var arrayDeValores = Object.values(objetoLotesAfectadosZona);
        var arrayColores = [
            '#a14965',
            '#e65b5e',
            '#fa8167',
            '#fbad74',
            '#f9c67f',
            '#f9e19d',
        ];

        agregarPastelEstadistico(arrayDeValores, arrayDePropiedades, arrayColores, cuadro13);


    }
}

//Hace referencia a los botones del class cuadro09 
function eventoClick(valorSeleccionado) {
    var boton1 = document.getElementById('boton1');
    var boton2 = document.getElementById('boton2');

    boton1.addEventListener('click', function () {
        mostrarContenido(1, valorSeleccionado);
    });

    boton2.addEventListener('click', function () {
        mostrarContenido(2, valorSeleccionado);
    });
}

//-------------------------------------------------------------------------------------

function style(feature) {
    return {
        fillColor: getColor(feature.properties.ZONA, feature.properties.afec_2017, valorSeleccionado),
        weight: 2,
        opacity: 1,
        color: feature.properties.afec_2017 == 1 ? 'white' : 'rgba(240, 240, 240,0)',
        dashArray: feature.properties.afec_2017 == 1 ? '3' : '0',
        fillOpacity: 1
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    layer.bringToFront();

    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    geojsonLayer.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

//=============================================================.

//Agrega leyenda

function leyenda(valorSeleccionado, legend) {
    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = '<p style="font-weight: bold;">Zonas afectadas</p>';

        zonasAfect = arrayZonasAfectadas(valorSeleccionado);
        labels = [];

        var arrayColores = [
            '#a14965',
            '#e65b5e',
            '#fa8167',
            '#fbad74',
            '#f9c67f',
            '#f9e19d',
        ];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < zonasAfect.length; i++) {
            div.innerHTML +=
                '<i style="background:' + arrayColores[i] + '"></i> ' +
                zonasAfect[i] + '<br>';
        }

        div.innerHTML += '<br><p style="font-weight: bold;">Instituciones</p><div class="cajita"><img src="img/iconos/colegio.png" class="icono"><p>Escuela</p></div>' +
            '<div class="cajita"><img src="img/iconos/hospital.png" class="icono"><p>Hospital</p></div>'
        return div;
    };
}

//===================================================================================
//Agregar lista de calles

function listaCallesAfectadas(anio) {
    var arrayCallesAfectadas = [];

    cantidad = calles_afectadas.features.length;

    for (let i = 0; i < cantidad; i++) {
        var nomCalleAfectada = calles_afectadas.features[i].properties.NOM_VIA_C;
        var zonaAfectada = calles_afectadas.features[i].properties['afect_' + anio];
        if (zonaAfectada == 1 && !arrayCallesAfectadas.includes(nomCalleAfectada)) {
            arrayCallesAfectadas.push(nomCalleAfectada);
        }
    }

    return arrayCallesAfectadas;
}

function crearListaUl(arrayCallesAfectadas) {
    // Crear una lista ul
    const listaUl = document.createElement('ul');
    listaUl.classList.add('listUl');

    // Variable para almacenar la capa GeoJSON actual
    let mapaCallesActual;

    // Iterar sobre el array y agregar elementos de lista li
    arrayCallesAfectadas.forEach(elemento => {
        const listItem = document.createElement('li');
        const parrafo = document.createElement('p');

        cantidad = calles_afectadas.features.length;


        for (let i = 0; i < cantidad; i++) {
            cA = calles_afectadas.features[i].properties.NOM_VIA_C;
            distancias = calles_afectadas.features[i].properties.distancia;
            if (cA == elemento) {
                parrafo.textContent = "Distancia afectada: " + distancias + " metros";
            }
        }


        listItem.classList.add('calle');
        listItem.textContent = elemento;
        listaUl.appendChild(listItem);
        listItem.appendChild(parrafo)


        listItem.addEventListener('click', function () {
            // Eliminar la capa GeoJSON anterior si existe
            if (mapaCallesActual) {
                map.removeLayer(mapaCallesActual);
            }

            // Crear y añadir la nueva capa GeoJSON
            mapaCallesActual = L.geoJson(calles_afectadas, {
                style: function (feature) {
                    return {
                        color: feature.properties.NOM_VIA_C === elemento ? 'yellow' : '',
                        weight: 2
                    };
                }
            }).addTo(map);
        });
    });

    return listaUl;
}


//Muestra contenido al dar click en un icono
function mostrarInformacion(feature, layer) {
    var informacion = '<p>Nombre: ' + feature.properties.Name + '</p>'; // Puedes personalizar esto según tus datos

    // Aquí puedes agregar más información según sea necesario

    layer.bindPopup(informacion); // Muestra la información en un popup al hacer clic
}



/*========================================================*/

//Obtener array de área total de cada zona 

function obtenerArrayAreaTotal(anio, arrayZonasAfectadasAnio) {
    var cant = manzanas_rimac.features.length;
    var areaTotal = 0;
    var arrayAreaTotal = [];

    for (let j = 0; j < arrayZonasAfectadasAnio.length; j++) {
        for (let i = 0; i < cant; i++) {
            var manAfec = manzanas_rimac.features[i].properties['afec_' + anio]
            var zonAfec = manzanas_rimac.features[i].properties.ZONA
            var areaAfec = manzanas_rimac.features[i].properties.area
            if (manAfec === 1 && zonAfec === arrayZonasAfectadasAnio[j]) {
                areaTotal = areaTotal + areaAfec;
            }
        }
        arrayAreaTotal.push(areaTotal / 1000)
        areaTotal = 0;
    }

    return arrayAreaTotal;
}