var map = L.map('map').setView([-12.0389, -77.024763], 15.5);

//https://tile.openstreetmap.org/{z}/{x}/{y}.png

L.tileLayer('http://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var anios = document.getElementById('anios');
console.log(anios.value)

var geojsonLayer;

var valorSeleccionado = 2017;

// Inicializar la capa GeoJSON y agregarla al mapa
geojsonLayer = L.geoJson(manzanas_rimac, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map)


//=============================================================
//Agregamos leyenda y cuadro de informacion

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {

    zonasAfect = arrayZonasAfectadas('2017'),

        this._div.innerHTML = '<h4>Población afectada</h4>' + (props ?
            '<b>' + props.ZONA + '</b><br />' + props.T_TOTAL + ' personas / manzana' + '</b><br />' + props.lotes + ' lotes / manzana' + '</b><br />'
            : 'Mantenga el puntero sobre un manzana');
};

info.addTo(map);

//Leyenda

var legend = L.control({ position: 'bottomright' });

leyenda('2017', legend);

legend.addTo(map);
//=============================================================

// Calles afectadas

var lista = document.querySelector('.lista');
var arrayCallesAfectadas = listaCallesAfectadas('2017');
console.log(arrayCallesAfectadas)
var listaUl = crearListaUl(arrayCallesAfectadas);

// Agregar la lista al div
lista.appendChild(listaUl);

actualizarCuadros(valorSeleccionado);

//Inicializacion para cuadro09
mostrarContenido(1, valorSeleccionado);
eventoClick(valorSeleccionado);

// Agregar un escuchador de eventos para el cambio de año
anios.addEventListener('change', function () {


    // Obtener el valor seleccionado
    valorSeleccionado = anios.value;
    //Agregando leyenda según año
    leyenda(valorSeleccionado, legend);
    legend.addTo(map);

    //Agregando lista de calles
    if (listaUl) {
        listaUl.remove();
    }

    lista = document.querySelector('.lista');
    arrayCallesAfectadas = listaCallesAfectadas(valorSeleccionado);
    listaUl = crearListaUl(arrayCallesAfectadas);
    lista.appendChild(listaUl);

    //======================================================================

    actualizarCuadros(valorSeleccionado);

    // Limpiar capas existentes antes de agregar una nueva
    map.eachLayer(function (layer) {
        if (layer instanceof L.GeoJSON) {
            map.removeLayer(layer);
        }
    });

    // Inicializar y agregar la nueva capa GeoJSON
    geojsonLayer = L.geoJson(manzanas_rimac, {
        style: function (feature) {
            // Establecer el estilo según el año seleccionado
            return {
                fillColor: getColor(feature.properties.ZONA, feature.properties['afec_' + valorSeleccionado], valorSeleccionado),
                weight: 2,
                opacity: 1,
                color: feature.properties['afec_' + valorSeleccionado] == 1 ? 'white' : 'rgba(240, 240, 240,0)',
                dashArray: feature.properties['afec_' + valorSeleccionado] == 1 ? '3' : '0',
                fillOpacity: 1
            };
        },
        onEachFeature: onEachFeature // Asignar el Popup a cada polígono
    }).addTo(map);


    //Refencia: class = "cuadro09"
    //Cambio de valores al dar click
    mostrarContenido(1, valorSeleccionado);
    eventoClick(valorSeleccionado);


    //===================================================================

    //Este bloque de codigo los iconos de hospitales y colegios en el change, cuando se cambia de anio

    iconosColegio = L.geoJson(colegios, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
                icon: feature.properties['colafe' + valorSeleccionado] == 1 ? iconColegio : iconTransparente
            })
        },
        onEachFeature: function (feature, layer) {
            layer.on('click', function () {
                mostrarInformacion(feature, layer);
            });
        }
    })

    iconosHospital = L.geoJson(hospitales, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
                icon: feature.properties['hosafe' + valorSeleccionado] == 1 ? iconHospital : iconTransparente
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
    //====================================================================

});

/*-----------------------------------------------------------------------------------*/

//Buscador

document.addEventListener("keyup", e => {

    if (e.target.matches("#buscador")) {

        if (e.key === "Escape") e.target.value = ""

        document.querySelectorAll(".calle").forEach(calle => {

            calle.textContent.toLowerCase().includes(e.target.value.toLowerCase())
                ? calle.classList.remove("filtro")
                : calle.classList.add("filtro")
        })
    }
})

//===================================================================

//Este bloque de codigo agrega los iconos de hospitales y colegios

var iconColegio = L.icon({
    iconUrl: 'img/iconos/colegio.png',  // Ruta a tu archivo de icono
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



var anio = '2017'

// Crear la capa GeoJSON con puntos y aplicar el icono personalizado
var iconosColegio = L.geoJson(colegios, {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
            icon: feature.properties['colafe' + anio] == 1 ? iconColegio : iconTransparente
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
            icon: feature.properties['hosafe' + anio] == 1 ? iconHospital : iconTransparente
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

//===================================================================

//Agregando cuadro estadistico al cuadro numero 10

var cuadro10 = document.querySelector('.cuadro10');

console.log(cuadro10)


var za1987 = arrayZonasAfectadas('1987');
var za1998 = arrayZonasAfectadas('1998');
var za2017 = arrayZonasAfectadas('2017');

let miArrayModificado1987 = za1987.map(elemento => 'z_' + elemento);
let miArrayModificado1998 = za1998.map(elemento => 'z_' + elemento);
let miArrayModificado2017 = za2017.map(elemento => 'z_' + elemento);

var arrayAreaTotal2017 = obtenerArrayAreaTotal('2017', za2017);
var arrayAreaTotal1998 = obtenerArrayAreaTotal('1998', za1998);
var arrayAreaTotal1987 = obtenerArrayAreaTotal('1987', za1987);

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
    type: 'bar',
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
        range: [0, 550],
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


//===================================================================

//Agregando cuadro estadistico al cuadro numero 06

var arrayCallesAfectadas2017 = listaCallesAfectadas('2017');
var cantidadCallesAfectadas2017 = arrayCallesAfectadas2017.length;

var arrayCallesAfectadas1998 = listaCallesAfectadas('1998');
var cantidadCallesAfectadas1998 = arrayCallesAfectadas1998.length;

var arrayCallesAfectadas1987 = listaCallesAfectadas('1987');
var cantidadCallesAfectadas1987 = arrayCallesAfectadas1987.length;

console.log(cantidadCallesAfectadas2017)
console.log(cantidadCallesAfectadas1998)
console.log(cantidadCallesAfectadas1987)

var cuadro06 = document.querySelector('.cuadro06')

var data = [{
    type: 'bar',
    x: [cantidadCallesAfectadas2017, cantidadCallesAfectadas1998, cantidadCallesAfectadas1987],
    y: ['Año 2017', 'Año 1998', 'Año 1987'],
    orientation: 'h'
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
        }
    }

}

var config = {
    displayModeBar: false
}

Plotly.newPlot(cuadro06, data, layout_cuadro06, config);

//Cuadro 11
//Cantidades de valores(hospital, colegios, calles, zonas)
var colegios2017 = totalAfectados('2017', 'colegios');
var colegios1998 = totalAfectados('1998', 'colegios');
var colegios1987 = totalAfectados('1987', 'colegios');

var hospital2017 = totalAfectados('2017', 'hospital');
var hospital1998 = totalAfectados('1998', 'hospital');
var hospital1987 = totalAfectados('1987', 'hospital');

var arrayCalles2017 = listaCallesAfectadas('2017');
var calles2017 = arrayCalles2017.length;
var arrayCalles1998 = listaCallesAfectadas('1998');
var calles1998 = arrayCalles1998.length;
var arrayCalles1987 = listaCallesAfectadas('1987');
var calles1987 = arrayCalles1987.length;

var arrayZona20171 = arrayZonasAfectadas('2017')
var zonas2017 = arrayZona20171.length;
var arrayZona19981 = arrayZonasAfectadas('1998')
var zonas1998 = arrayZona19981.length;
var arrayZona19871 = arrayZonasAfectadas('1987')
var zonas1987 = arrayZona19871.length;

//Indices
var indice2017 = (3 * colegios2017) + (3 * hospital2017) + (2 * calles2017) + (zonas2017);
var indice1998 = (3 * colegios1998) + (3 * hospital1998) + (2 * calles1998) + (zonas1998);
var indice1987 = (3 * colegios1987) + (3 * hospital1987) + (2 * calles1987) + (zonas1987);
console.log(indice1987)


var cuadro11 = document.querySelector('.cuadro11');


var layer_cuadro11 = {
    type: 'bar',
    x: ['Año 1987', 'Año 1998', 'Año 2017'],
    y: [indice1987, indice1998, indice2017],
    marker: {
        color: '#C8A2C8',
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
        range: [0, 250],
        dtick: 50,  // Ajusta este valor para cambiar la distancia entre las marcas del eje y
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