//Colocar color de lote por zona

function ColorLotesZona(feature, anioSeleccionado, zonasOrdenada, distrito) {

    var dist = distrito
    var misZonas = zonasOrdenada;
    var arrayColores = []

    if (dist === 'Rimac') {
        arrayColores = [
            '#a14965',
            '#e65b5e',
            '#fa8167',
            '#fbad74',
            '#f9c67f',
            '#f9e19d',
        ];
    } else if (dist === 'Lurigancho') {
        arrayColores = [
            '#1f78b4',  // Azul oscuro
            '#3870b3',
            '#5068a3',
            '#685f94',
            '#805784',
            '#984e75',
            '#b04566',
            '#c83d57',
            '#e03447',
            '#f82c38',
            '#ff2439',  // Rojo oscuro
        ];

    }

    if (feature.properties['afec_' + anioSeleccionado] == 1) {
        var zonaIndex = misZonas.indexOf(feature.properties.zona);

        if (zonaIndex >= 0 && zonaIndex < arrayColores.length) {
            return arrayColores[zonaIndex];
        } else {
            return 'rgba(0,0,0,0)';
        }
    }
}

//Obtener el array según el campo que queramos del geojson del año y la zona afectada, sin que se repita el mismo elemento

function array(anioSeleccionado, campo, distrito) {

    const setZonasUnicas = new Set();
    var capaDistrito;

    var dist = distrito

    if (dist === 'Rimac') {
        capaDistrito = lotes_rimac;
    } else if (dist === 'Lurigancho') {
        capaDistrito = lotes_lurigancho;
    }

    for (const lote of capaDistrito.features) {
        if (lote.properties['afec_' + anioSeleccionado] > 0) {
            setZonasUnicas.add(lote.properties[campo]);
        }
    }

    // Convierte el conjunto a un array si es necesario
    const arrayNuevo = Array.from(setZonasUnicas);

    // Imprime el nuevo array
    return arrayNuevo;

}

//Devuelve las distancias de calles en un array

function listaDistancias(array, anio, distrito){
    var arrayDistancias = [];
    var capa_calles;
    var cantidad;

    if (distrito === 'Rimac') {
        if (anio === '2017') {
            capa_calles = calles_rimac_2017;
            cantidad = calles_rimac_2017.features.length
        } else if (anio === '1998') {
            capa_calles = calles_rimac_1998;
            cantidad = calles_rimac_1998.features.length
        } else if (anio === '1987') {
            capa_calles = calles_rimac_1987;
            cantidad = calles_rimac_1987.features.length
        }
    } else if (distrito === 'Lurigancho') {
        if (anio === '2017') {
            capa_calles = calles_lurigancho_2017;
            cantidad = calles_lurigancho_2017.features.length
        } else if (anio === '1998') {
            capa_calles = calles_lurigancho_1998;
            cantidad = calles_lurigancho_1998.features.length
        } else if (anio === '1987') {
            capa_calles = calles_lurigancho_1987;
            cantidad = calles_lurigancho_1987.features.length
        }
    }

    for (let i = 0; i < cantidad; i++) {
        var distancia = capa_calles.features[i].properties.distancia;
        if (capa_calles.features[i].properties.NOM_VIA_C === array[i]) {
            arrayDistancias.push(distancia)
        }
    }

    return arrayDistancias;

}

//Cantidad total de elementos en los diferentes años y campos seleccionadas

function totalAfectados(campo, anioSeleccionado, distrito) {
    var total = 0;

    var capaDistrito;

    if (distrito === 'Rimac') {
        capaDistrito = lotes_rimac;
    } else if (distrito === 'Lurigancho') {
        capaDistrito = lotes_lurigancho;
    }

    for (const lote of capaDistrito.features) {
        if (lote.properties['afec_' + anioSeleccionado] > 0) {
            total = total + lote.properties[campo + anioSeleccionado]
        }
    }

    return total;
}

//Cantidad total de personas

function totalPersonasAfectadas(anioSeleccionado, distrito) {
    var total = 0;

    var capaDistrito;
    var dist = distrito

    if (dist === 'Rimac') {
        capaDistrito = lotes_rimac;
    } else if (dist === 'Lurigancho') {
        capaDistrito = lotes_lurigancho;
    }

    for (const lote of capaDistrito.features) {
        if (lote.properties['afec_' + anioSeleccionado] > 0) {
            total = total + lote.properties.T_TOTAL
        }
    }

    return total;


}

//Hallar la cantidad total por zona y devuelve un array
//Campo equivale al valor total por zona, por ejemplo puede ser el de total personas por zona

function totalPorZona(anioSeleccionado, zonas, campo, distrito) {

    var cantidad = zonas.length;

    var total = 0;

    var capaDistrito;
    var dist = distrito;

    if (dist === 'Rimac') {
        capaDistrito = lotes_rimac;
    } else if (dist === 'Lurigancho') {
        capaDistrito = lotes_lurigancho;
    }


    const setZonasUnicas = new Set();

    for (let i = 0; i < cantidad; i++) {
        for (const lote of capaDistrito.features) {
            if (lote.properties['afec_' + anioSeleccionado] > 0 && lote.properties.zona == zonas[i]) {
                total = total + lote.properties[campo]
            }
        }
        setZonasUnicas.add(total)

        total = 0;
    }

    const arrayAfectadosPorZona = Array.from(setZonasUnicas);

    return arrayAfectadosPorZona;
}

//Ordenar un array en funcion del array de sus cantidades respectivas
//Por ejemplo cuando tenemos un array de zonas y la cantidad de lotes, entonces queremos ordenar el array de zonas dependiendo de su cantidad de lotes de mayor a menor


function ordenarArrays(array, arrayCantidad) {
    // Combina los arrays en un array de objetos [{zona: 'valor', cantidad: 'valor'}, ...]
    var zonasConCantidades = array.map((zona, index) => ({ zona, cantidad: arrayCantidad[index] }));

    // Ordena el array de objetos de mayor a menor basándote en las cantidades
    zonasConCantidades.sort((a, b) => b.cantidad - a.cantidad);

    // Extrae las zonas ordenadas
    var arrayOrdenados = zonasConCantidades.map(obj => obj.zona);
    var cantidadesOrdenadas = zonasConCantidades.map(obj => obj.cantidad);


    return { array: arrayOrdenados, cantidades: cantidadesOrdenadas };
}


// Función para actualizar la información de los cuadros


function updateCuadros(anioSeleccionado, distrito) {
    var cuadro01 = document.querySelector('.cuadro01');
    var cuadro03 = document.querySelector('.cuadro03');
    var cuadro04 = document.querySelector('.cuadro04');

    var imagenHospital = '<img src="img/iconos/edificio-del-hospital (1).png" alt="Descripción de la imagen" style="width: 50px;">&nbsp';

    var imagenColegio = '<img src="img/iconos/escuela.png" alt="Descripción de la imagen" style="width: 50px;">&nbsp';


    cuadro01.innerHTML = totalPersonasAfectadas(anioSeleccionado, distrito);
    cuadro03.innerHTML = imagenHospital + totalAfectados('hosp_', anioSeleccionado, distrito);
    cuadro04.innerHTML = imagenColegio + totalAfectados('cole_', anioSeleccionado, distrito);
}


//Agregar cuadro estadistico tipo pastel en cuadro02

function agregarPastelEstadistico(cuadro, zonaOrd, cantidadOrdenada, distrito) {

    var dist = distrito

    var cuadroDos = document.querySelector('.cuadro02')
    var cuadroTrece = document.querySelector('.cuadro13')

    if (dist === 'Rimac') {
        arrayColores = [
            '#a14965',
            '#e65b5e',
            '#fa8167',
            '#fbad74',
            '#f9c67f',
            '#f9e19d',
        ];
    } else if (dist === 'Lurigancho') {
        arrayColores = [
            '#1f78b4',  // Azul oscuro
            '#3870b3',
            '#5068a3',
            '#685f94',
            '#805784',
            '#984e75',
            '#b04566',
            '#c83d57',
            '#e03447',
            '#f82c38',
            '#ff2439',  // Rojo oscuro
        ];

    }

    var altura;
    var ancho;
    var equis;
    var ye;

    if (cuadro === cuadroDos) {
        altura = 300;
        ancho = 300;
        equis = 1.2;
        ye = 1.2;
    } else if (cuadro === cuadroTrece) {
        altura = 210;
        ancho = 290;
        equis = 2;
        ye = 0.5;
    }

    // Cuadro 02
    var data = [{
        values: cantidadOrdenada,
        labels: zonaOrd,
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
        height: altura,
        width: ancho,
        paper_bgcolor: 'rgba(240, 240, 240, 0)', // Establece el color de fondo del gráfico
        margin: {
            l: 50,
            r: 30,
            b: 40,
            t: 20
        },
        legend: {
            x: equis,  // Ajusta la posición horizontal de la leyenda (0-1)
            y: ye,  // Ajusta la posición vertical de la leyenda (0-1)
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

function eventoClick(anioSeleccionado, distrito) {

    var dist = distrito
    var boton1 = document.getElementById('boton1');
    var boton2 = document.getElementById('boton2');

    boton1.addEventListener('click', function () {
        mostrarContenido(1, anioSeleccionado, dist);
    });

    boton2.addEventListener('click', function () {
        mostrarContenido(2, anioSeleccionado, dist);
    });
}


function mostrarContenido(numeroPestana, anioSeleccionado, distrito) {

    var dist = distrito

    var cuadro12 = document.getElementById('informacion1');
    cuadro12.innerHTML = totalAfectados('afec_', anioSeleccionado, dist);

    // Ocultar todos los contenidos
    document.getElementById('informacion1').style.display = 'none';
    document.getElementById('informacion2').style.display = 'none';

    // Mostrar el contenido de la pestaña seleccionada
    var contenidoId = 'informacion' + numeroPestana;
    document.getElementById(contenidoId).style.display = 'block';

    if (numeroPestana == 1) {
        var cuadro12 = document.getElementById('informacion1');
        cuadro12.innerHTML = totalAfectados('afec_', anioSeleccionado, dist);

    } else if (numeroPestana == 2) {
        if (!anioSeleccionado) {
            anioSeleccionado = '2017';
        }

        var cuadro13 = document.getElementById('informacion2');
        zonas = array(anioSeleccionado, 'zona', dist)
        cantidadTotalZona = totalPorZona(anioSeleccionado, zonas, 'afec_' + anioSeleccionado, dist);
        arrayOrdenados = ordenarArrays(zonas, cantidadTotalZona)
        zonasOrdenada = arrayOrdenados.array;
        cantidadOrdenada = arrayOrdenados.cantidades;

        agregarPastelEstadistico(cuadro13, zonasOrdenada, cantidadOrdenada, dist)

    }
}


//Agrega leyenda
function leyenda(legend, zonasOrdenada, distrito) {

    if (distrito === 'Rimac') {
        colorIcono = 'img/iconos/colegio_azul.png'
    } else if (distrito === 'Lurigancho') {
        colorIcono = 'img/iconos/colegio_rosa.png'
    }

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = '<p style="font-weight: bold;">Zonas afectadas</p>';

        labels = [];

        var dist = distrito;

        if (dist === 'Rimac') {
            arrayColores = [
                '#a14965',
                '#e65b5e',
                '#fa8167',
                '#fbad74',
                '#f9c67f',
                '#f9e19d',
            ];
        } else if (dist === 'Lurigancho') {
            arrayColores = [
                '#1f78b4',  // Azul oscuro
                '#3870b3',
                '#5068a3',
                '#685f94',
                '#805784',
                '#984e75',
                '#b04566',
                '#c83d57',
                '#e03447',
                '#f82c38',
                '#ff2439',  // Rojo oscuro
            ];

        }

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < zonasOrdenada.length; i++) {
            div.innerHTML +=
                '<i style="background:' + arrayColores[i] + '"></i> ' +
                zonasOrdenada[i] + '<br>';
        }

        div.innerHTML += '<br><p style="font-weight: bold;">Instituciones</p><div class="cajita"><img src="' + colorIcono + '" class="icono"><p>Escuela</p></div>' +
            '<div class="cajita"><img src="img/iconos/hospital.png" class="icono"><p>Hospital</p></div>'
        return div;
    };
}

//Agregar Cuadro de barras en el cuadro10

function cuadroBarrasVertical(distrito) {
    var cuadro10 = document.querySelector('.cuadro10');
    var dist = distrito;
    var ordenadaY;

    if (dist === "Rimac") {
        ordenadaY = 550
    } else if (dist === "Lurigancho") {
        ordenadaY = 300
    }

    var za1987 = array('1987', 'zona', dist);
    var za1998 = array('1998', 'zona', dist);
    var za2017 = array('2017', 'zona', dist);

    let miArrayModificado1987 = za1987.map(elemento => 'z_' + elemento);
    let miArrayModificado1998 = za1998.map(elemento => 'z_' + elemento);
    let miArrayModificado2017 = za2017.map(elemento => 'z_' + elemento);

    var arrayAreaTotal1987 = totalPorZona("1987", za1987, "area", dist)
    var arrayAreaTotal1998 = totalPorZona("1998", za1998, "area", dist)
    var arrayAreaTotal2017 = totalPorZona("2017", za2017, "area", dist)

    var anio_1987 = {
        x: miArrayModificado1987,
        y: arrayAreaTotal1987,
        name: '1987',
        type: 'bar'
    };

    var anio_1998 = {
        x: miArrayModificado1998,
        y: arrayAreaTotal1998,
        name: '1998',
        type: 'bar'
    };

    var anio_2017 = {
        x: miArrayModificado2017,
        y: arrayAreaTotal2017,
        name: '2017',
        type: 'bar'
    };

    var data = [anio_1987, anio_1998, anio_2017];

    var layout = {
        barmode: 'group',
        margin: {
            l: 50,  // margen izquierdo
            b: 90   // margen inferior
        },
        width: 330, // ancho en píxeles
        height: 220, // alto en píxeles
        legend: {
            font: {
                color: 'white'  // Establece el color del texto en la leyenda
            },
            y: 1.2  // Ajusta este valor para cambiar la posición vertical de la leyenda
        },
        yaxis: {
            range: [0, ordenadaY],
            dtick: 100,  // Ajusta este valor para cambiar la distancia entre las marcas del eje y
            zerolinecolor: 'white', // Establece el color de la línea cero en el eje x
            color: 'white',         // Establece el color del eje x
            tickfont: {
                color: 'white'        // Establece el color de las etiquetas en el eje x
            }
        },
        bargap: 0.2,  // Ajusta este valor para cambiar el espacio entre las barras
        margin: {
            l: 50,
            r: 50,
            t: 50,
            b: 80
        },
        paper_bgcolor: 'rgba(0,0,0,0)',  // Hace que el área del plot sea transparente
        plot_bgcolor: 'rgba(0,0,0,0)',
        xaxis: {
            zerolinecolor: 'white', // Establece el color de la línea cero en el eje x
            color: 'white',         // Establece el color del eje x
            tickfont: {
                color: 'white'        // Establece el color de las etiquetas en el eje x
            }
        },
    };

    var config = {
        displayModeBar: false
    }

    Plotly.newPlot(cuadro10, data, layout, config);
}

//Función para realizar efectos y mostrar informacion en el cuadro info al pasar el curso por encima de los poligonos
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
    var layer = e.target;

    // Restaurar el estilo original
    geojsonLayer.resetStyle(layer);

    // Actualizar el control informativo para que muestre el mensaje predeterminado
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

//Agregar iconos de colegios y hospitales al mapa

function agregarIconos(anioSeleccionado, distrito) {

    var dist = distrito
    var colegios;
    var hospitales;

    if (dist === 'Rimac') {
        colegios = colegios_rimac
        hospitales = hospitales_rimac
        colorIcono = 'img/iconos/colegio_azul.png'
    } else if (dist === 'Lurigancho') {

        colegios = colegios_lurigancho
        hospitales = hospitales_lurigancho
        colorIcono = 'img/iconos/colegio_rosa.png'
    }

    var iconColegio = L.icon({
        iconUrl: colorIcono,  // Ruta a tu archivo de icono
        iconSize: [32, 32],  // Tamaño del icono
        iconAnchor: [16, 32],  // Punto de anclaje del icono
        popupAnchor: [0, -32]  // Punto de anclaje del popup
    });

    var iconHospital = L.icon({
        iconUrl: 'img/iconos/hospital.png',  // Ruta a tu archivo de icono
        iconSize: [32, 32],  // Tamaño del icono
        iconAnchor: [16, 32],  // Punto de anclaje del icono
        popupAnchor: [0, -32]  // Punto de anclaje del popup
    });

    var iconTransparente = L.icon({
        iconUrl: 'img/iconos/transparente.png',  // Ruta a tu archivo de icono
        iconSize: [32, 32],  // Tamaño del icono
        iconAnchor: [16, 32],  // Punto de anclaje del icono
        popupAnchor: [0, -32]  // Punto de anclaje del popup
    });


    var iconosColegio = L.geoJson(colegios, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
                icon: feature.properties['colafe' + anioSeleccionado] == 1 ? iconColegio : iconTransparente
            })
        },
        onEachFeature: function (feature, layer) {
            layer.on('click', function () {
                mostrarInformacion(feature, layer);
            });
        }
    })

    var iconosHospital = L.geoJson(hospitales, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
                icon: feature.properties['hosafe' + anioSeleccionado] == 1 ? iconHospital : iconTransparente
            })
        },
        onEachFeature: function (feature, layer) {
            layer.on('click', function () {
                mostrarInformacion(feature, layer);
            });
        }
    })

    iconosColegio.addTo(map);
    iconosHospital.addTo(map);
}

//Mostar información al dar click en el icono de colegios o hospitales

//Muestra contenido al dar click en un icono
function mostrarInformacion(feature, layer) {
    var informacion = '<p>Nombre: ' + feature.properties.Name + '</p>'; // Puedes personalizar esto según tus datos

    // Aquí puedes agregar más información según sea necesario

    layer.bindPopup(informacion); // Muestra la información en un popup al hacer clic
}

//Funciomes para agregar lista de calles

//Crear lista de calles afectadas
function listaCallesAfectadas(anioSeleccionado, distrito) {
    var arrayCallesAfectadas = [];
    var capa_calles;
    var cantidad;

    if (distrito === 'Rimac') {
        if (anioSeleccionado === '2017') {
            capa_calles = calles_rimac_2017;
            cantidad = calles_rimac_2017.features.length
        } else if (anioSeleccionado === '1998') {
            capa_calles = calles_rimac_1998;
            cantidad = calles_rimac_1998.features.length
        } else if (anioSeleccionado === '1987') {
            capa_calles = calles_rimac_1987;
            cantidad = calles_rimac_1987.features.length
        }
    } else if (distrito === 'Lurigancho') {
        if (anioSeleccionado === '2017') {
            capa_calles = calles_lurigancho_2017;
            cantidad = calles_lurigancho_2017.features.length
        } else if (anioSeleccionado === '1998') {
            capa_calles = calles_lurigancho_1998;
            cantidad = calles_lurigancho_1998.features.length
        } else if (anioSeleccionado === '1987') {
            capa_calles = calles_lurigancho_1987;
            cantidad = calles_lurigancho_1987.features.length
        }
    }


    for (let i = 0; i < cantidad; i++) {
        arrayCallesAfectadas.push(capa_calles.features[i].properties.NOM_VIA_C);
    }

    return arrayCallesAfectadas;
}



//Crear lista a nivel html y agregar la información a cada li 

function crearListaUl(arrayCallesAfectadas, anioSeleccionado, distrito) {
    // Crear una lista ul
    const listaUl = document.createElement('ul');
    listaUl.classList.add('listUl');

    // Variable para almacenar la capa GeoJSON actual
    let mapaCallesActual;

    var capa_calles;

    if (distrito === 'Rimac') {
        if (anioSeleccionado === '2017') {
            capa_calles = calles_rimac_2017;
            cantidad = calles_rimac_2017.features.length
        } else if (anioSeleccionado === '1998') {
            capa_calles = calles_rimac_1998;
            cantidad = calles_rimac_1998.features.length
        } else if (anioSeleccionado === '1987') {
            capa_calles = calles_rimac_1987;
            cantidad = calles_rimac_1987.features.length
        }
    } else if (distrito === 'Lurigancho') {
        if (anioSeleccionado === '2017') {
            capa_calles = calles_lurigancho_2017;
            cantidad = calles_lurigancho_2017.features.length
        } else if (anioSeleccionado === '1998') {
            capa_calles = calles_lurigancho_1998;
            cantidad = calles_lurigancho_1998.features.length
        } else if (anioSeleccionado === '1987') {
            capa_calles = calles_lurigancho_1987;
            cantidad = calles_lurigancho_1987.features.length
        }
    }

    // Iterar sobre el array y agregar elementos de lista li
    arrayCallesAfectadas.forEach(elemento => {
        const listItem = document.createElement('li');
        const parrafo = document.createElement('p');


        var cantidad = capa_calles.features.length;


        for (let i = 0; i < cantidad; i++) {
            var cA = capa_calles.features[i].properties.NOM_VIA_C;
            var distancias = capa_calles.features[i].properties.distancia;
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
            mapaCallesActual = L.geoJson(capa_calles, {
                style: function (feature) {
                    return {
                        color: feature.properties.NOM_VIA_C === elemento ? 'yellow' : '',
                        weight: 2,
                        dashArray: 5
                    };
                }
            }).addTo(map);
        });
    });

    return listaUl;
}


//Obtener indice para cuadro11

function obtenerIndice(anioSeleccionado, distrito) {
    var cantidadColegios = totalAfectados('cole_', anioSeleccionado, distrito);

    var cantidadHospitales = totalAfectados('hosp_', anioSeleccionado, distrito);

    var listaCalles = listaCallesAfectadas(anioSeleccionado, distrito)
    var cantidadCalles = listaCalles.length;

    var listaZonasAfectadas = array(anioSeleccionado, 'zona', distrito);
    var cantidadZonas = listaZonasAfectadas.length;

    var indice = (3 * cantidadColegios) + (3 * cantidadHospitales) + (2 * cantidadCalles) + (2 * cantidadZonas);

    return indice;
}

//Agregar cuadro estadistico a cuadro11

function crearCuadroEstadisticoBarras(distrito) {

    var eye;
    var rango;

    if (distrito === 'Rimac') {
        eye = 250;
        rango = 50;
    } else if (distrito === 'Lurigancho') {
        eye = 400;
        rango = 100;
    }


    var indice1987 = obtenerIndice('1987', distrito)
    var indice1998 = obtenerIndice('1998', distrito)
    var indice2017 = obtenerIndice('2017', distrito)

    var cuadro11 = document.querySelector('.cuadro11');

    var layer_cuadro11 = {
        type: 'bar',
        x: ['Año 1987', 'Año 1998', 'Año 2017'],
        y: [indice1987, indice1998, indice2017],
        marker: {
            color: ['#1f77b4', '#ff7f0e', '#2ca02c'], // Colores diferentes para cada barra
            line: {
                width: 2.5
            }
        }
    };

    var data11 = [layer_cuadro11];

    var layout = {
        barmode: 'group',
        margin: {
            l: 50,  // margen izquierdo
            b: 90   // margen inferior
        },
        width: 330, // ancho en píxeles
        height: 220, // alto en píxeles
        legend: {
            font: {
                color: 'white'  // Establece el color del texto en la leyenda
            },
            y: 1.2  // Ajusta este valor para cambiar la posición vertical de la leyenda
        },
        yaxis: {
            range: [0, eye],
            dtick: rango,  // Ajusta este valor para cambiar la distancia entre las marcas del eje y
            zerolinecolor: 'white', // Establece el color de la línea cero en el eje x
            color: 'white',         // Establece el color del eje x
            tickfont: {
                color: 'white'        // Establece el color de las etiquetas en el eje x
            }
        },
        bargap: 0.2,  // Ajusta este valor para cambiar el espacio entre las barras
        margin: {
            l: 50,
            r: 50,
            t: 50,
            b: 80
        },
        paper_bgcolor: 'rgba(0,0,0,0)',  // Hace que el área del plot sea transparente
        plot_bgcolor: 'rgba(0,0,0,0)',
        xaxis: {
            zerolinecolor: 'white', // Establece el color de la línea cero en el eje x
            color: 'white',         // Establece el color del eje x
            tickfont: {
                color: 'white'        // Establece el color de las etiquetas en el eje x
            }
        },
    };

    var config = {
        responsive: true,
        displayModeBar: false
    }

    Plotly.newPlot(cuadro11, data11, layout, config);

}

//Funcion para agregrar cuadro estadistico al cuadro06


function crearCuadroEstadisticoBarrasHorizontal(distrito) {

    var equis;
    var rango;

    if (distrito === 'Rimac') {
        equis = 70
        rango = 10
    } else if (distrito === 'Lurigancho') {
        equis = 120
        rango = 30
    }

    var arrayCallesAfectadas2017 = listaCallesAfectadas('2017', distrito);
    var cantidadCallesAfectadas2017 = arrayCallesAfectadas2017.length;

    var arrayCallesAfectadas1998 = listaCallesAfectadas('1998', distrito);
    var cantidadCallesAfectadas1998 = arrayCallesAfectadas1998.length;

    var arrayCallesAfectadas1987 = listaCallesAfectadas('1987', distrito);
    var cantidadCallesAfectadas1987 = arrayCallesAfectadas1987.length;

    var cuadro06 = document.querySelector('.cuadro06')

    var data = [{
        type: 'bar',
        x: [cantidadCallesAfectadas2017, cantidadCallesAfectadas1998, cantidadCallesAfectadas1987],
        y: ['Año 2017', 'Año 1998', 'Año 1987'],
        orientation: 'h',
        marker: {
            color: ['#2ca02c', '#ff7f0e', '#1f77b4'],
            line: {
                width: 2.5
            }
        }
    }];

    var layout_cuadro06 = {
        width: 300, // ancho en píxeles
        height: 220, // alto en píxeles
        margin: {
            l: 60,  // margen izquierdo
            r: 40,
            b: 50,   // margen inferior
            t: 20
        },
        modeBar: {
            displayModeBar: false
        },
        paper_bgcolor: 'rgba(0,0,0,0)',  // Hace que el área del plot sea transparente
        plot_bgcolor: 'rgba(0,0,0,0)',
        yaxis: {
            tickfont: {
                color: 'white'
            }
        },
        xaxis: {
            tickfont: {
                color: 'white'
            },
            range: [0, equis],
            dtick: rango
        }

    }

    var config = {
        displayModeBar: false
    }

    Plotly.newPlot(cuadro06, data, layout_cuadro06, config);
}