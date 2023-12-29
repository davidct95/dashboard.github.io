var map = L.map('map').setView([-12.0389, -77.024763], 15.5);

var anioSeleccionado = '2017';
var layerSeleccionado = 'Rimac';
let anios = document.getElementById('anios')
let distritos = document.getElementById('distritos')
var dist;
let tituloDistrito = document.getElementById('tituloDistrito');

dist = distritos.addEventListener('change', function () {
    var layerSeleccionado = distritos.value

    if (layerSeleccionado === 'Rimac') {
        dist = 'Rimac';
    } else if (layerSeleccionado === 'Lurigancho') {
        dist = "Lurigancho"
    }
})


dist = 'Rimac';
tituloDistrito.innerHTML = "&nbsp;" + dist + "&nbsp;";

var zonas = array(anioSeleccionado, 'zona', dist)
var cantidadTotalZona = totalPorZona(anioSeleccionado, zonas, 'T_TOTAL', dist);
var arrayOrdenados = ordenarArrays(zonas, cantidadTotalZona)
var zonasOrdenada = arrayOrdenados.array;
var cantidadOrdenada = arrayOrdenados.cantidades;

//https://tile.openstreetmap.org/{z}/{x}/{y}.png

L.tileLayer('http://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var geojsonLayer;

geojsonLayer = L.geoJSON(lotes_rimac, {
    style: function (feature) {
        return {
            fillColor: ColorLotesZona(feature, anioSeleccionado, zonasOrdenada, dist),
            weight: 0.5,
            opacity: 1,
            fillOpacity: 1,
            dashArray: feature.properties.afec_2017 == 1 ? '3' : '0',
            color: feature.properties['afec_' + anioSeleccionado] == 1 ? 'white' : 'rgba(0,0,0,0)'
        }
    },
    onEachFeature: onEachFeature

}).addTo(map);

// Crear un control informativo
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // crea un div con una clase 'info'
    this.update();
    return this._div;
};

// Método para actualizar el control informativo
info.update = function (props) {
    zonasAfect = zonas;

    this._div.innerHTML = '<h4>Población afectada</h4>' + (props ?
        '<b>' + "Zona " + props.zona + '</b><br />' + props.T_TOTAL + ' personas / lote' + '</b><br />'
        : 'Mantenga el puntero sobre una lote');
};

info.addTo(map);


//Leyenda

var legend = L.control({ position: 'bottomright' });
leyenda(legend, zonasOrdenada, dist);
legend.addTo(map);

//Agregando información a los cuadros

updateCuadros(anioSeleccionado, dist)

//Agregar cuadro pastel estadístico a cuadro02

cuadro02 = document.querySelector('.cuadro02')
agregarPastelEstadistico(cuadro02, zonasOrdenada, cantidadOrdenada, dist)

//Agregando información a cuadro de lotes afectados
mostrarContenido(2, anioSeleccionado, dist);
eventoClick(anioSeleccionado, dist);

//Agregando barra de barras verticales en cuadro10

cuadroBarrasVertical(dist)

//Agregar iconos de hospitales y colegios

agregarIconos(anioSeleccionado, dist);

// Calles afectadas
var arrayCallesAfectadas = listaCallesAfectadas(anioSeleccionado, dist);
var arrayDistancias = listaDistancias(arrayCallesAfectadas, anioSeleccionado, dist)
var listaCallesOrdenadas = ordenarArrays(arrayCallesAfectadas, arrayDistancias);
var arrayCallesOrdenadas = listaCallesOrdenadas.array;
var lista = document.querySelector('.lista');
var listaUl = crearListaUl(arrayCallesOrdenadas, anioSeleccionado, dist);
// Agregar la listaUl al div con la clase llamada lista 
lista.appendChild(listaUl);



//Añadir funcionalidad al Buscador

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


//Agregando cuadro estadistico a cuadro11 
crearCuadroEstadisticoBarras(dist)

//Agregando cuadro estadistico al cuadro06
crearCuadroEstadisticoBarrasHorizontal(dist)



//Cambiar de año y datos
//============================================================================================
anios.addEventListener('change', function () {

    anioSeleccionado = anios.value;

    zonas = array(anioSeleccionado, 'zona', dist)
    cantidadTotalZona = totalPorZona(anioSeleccionado, zonas, 'T_TOTAL', dist);
    arrayOrdenados = ordenarArrays(zonas, cantidadTotalZona)
    zonasOrdenada = arrayOrdenados.array;
    cantidadOrdenada = arrayOrdenados.cantidades;

    var capaDistrito;

    if (dist === 'Rimac') {
        capaDistrito = lotes_rimac;
    } else if (dist === 'Lurigancho') {
        capaDistrito = lotes_lurigancho;
    }

    //Agregando leyenda
    leyenda(legend, zonasOrdenada, dist);
    legend.addTo(map);

    //Eliminando zonas afectadas anterior

    map.eachLayer(function (layer) {
        if (layer instanceof L.GeoJSON) {
            map.removeLayer(layer);
        }
    });

    //Cambiando zonas afectadas por año

    geojsonLayer = L.geoJSON(capaDistrito, {

        style: function (feature) {
            return {
                fillColor: ColorLotesZona(feature, anioSeleccionado, zonasOrdenada, dist),
                weight: 0.5,
                fillOpacity: 1,
                color: feature.properties['afec_' + anioSeleccionado] == 1 ? 'white' : 'rgba(0,0,0,0)'
            }
        },
        onEachFeature: onEachFeature
    }).addTo(map);

    //Cambiando información de los cuadros
    updateCuadros(anioSeleccionado, dist)

    //Agregando informacion a cuadro02 de poblacion afectada

    agregarPastelEstadistico(cuadro02, zonasOrdenada, cantidadOrdenada, dist)

    //Agregando información a cuadro de lotes afectados
    mostrarContenido(2, anioSeleccionado, dist);
    eventoClick(anioSeleccionado, dist);

    //Agregar iconos de hospitales y colegios

    agregarIconos(anioSeleccionado, dist);

    //Borrar la lista anterior

    var elementos = document.getElementsByClassName("lista");

    // Iterar sobre la lista de elementos y borrar el contenido de cada uno
    for (var i = 0; i < elementos.length; i++) {
        elementos[i].innerHTML = '';
    }

    // Calles afectadas
    var arrayCallesAfectadas = listaCallesAfectadas(anioSeleccionado, dist);
    var arrayDistancias = listaDistancias(arrayCallesAfectadas, anioSeleccionado, dist)
    var listaCallesOrdenadas = ordenarArrays(arrayCallesAfectadas, arrayDistancias);
    var arrayCallesOrdenadas = listaCallesOrdenadas.array;
    var lista = document.querySelector('.lista');
    var listaUl = crearListaUl(arrayCallesOrdenadas, anioSeleccionado, dist);
    // Agregar la listaUl al div con la clase llamada lista 
    lista.appendChild(listaUl);


})



//=====================================================================================
//=====================================================================================
//Cambio Según distrito
distritos.addEventListener('change', function () {

    layerSeleccionado = distritos.value;
    console.log(layerSeleccionado)

    var layerGeoJson;
    var nuevaUbicacion;

    map.eachLayer(function (layer) {
        if (layer instanceof L.GeoJSON) {
            map.removeLayer(layer);
        }
    });

    if (layerSeleccionado === 'Rimac') {
        layerGeoJson = lotes_rimac;
        nuevaUbicacion = { latitud: -12.0389, longitud: -77.024763, zoom: 15.5 };
    } else if (layerSeleccionado === 'Lurigancho') {
        layerGeoJson = lotes_lurigancho;
        nuevaUbicacion = { latitud: -12.03, longitud: -76.978170, zoom: 14.3 };
    }

    tituloDistrito.innerHTML = "&nbsp;" + dist + "&nbsp;";

    zonas = array(anioSeleccionado, 'zona', dist)
    cantidadTotalZona = totalPorZona(anioSeleccionado, zonas, 'T_TOTAL', dist);
    arrayOrdenados = ordenarArrays(zonas, cantidadTotalZona)
    zonasOrdenada = arrayOrdenados.array;
    cantidadOrdenada = arrayOrdenados.cantidades;

    map.setView([nuevaUbicacion.latitud, nuevaUbicacion.longitud], nuevaUbicacion.zoom);

    geojsonLayer = L.geoJSON(layerGeoJson, {
        style: function (feature) {
            return {
                fillColor: ColorLotesZona(feature, anioSeleccionado, zonasOrdenada, dist),
                weight: 0.5,
                fillOpacity: 1,
                color: feature.properties['afec_' + anioSeleccionado] == 1 ? 'white' : 'rgba(0,0,0,0)'
            }
        },
        onEachFeature: onEachFeature
    }).addTo(map);

    //Agregando leyenda
    leyenda(legend, zonasOrdenada, dist);
    legend.addTo(map);

    updateCuadros(anioSeleccionado, dist)

    agregarPastelEstadistico(cuadro02, zonasOrdenada, cantidadOrdenada, dist)

    //Agregando información a cuadro de lotes afectados
    mostrarContenido(2, anioSeleccionado, dist);
    eventoClick(anioSeleccionado, dist);

    //Agregando cuadro de barras en cuadro10

    cuadroBarrasVertical(dist)

    //Agregar iconos de hospitales y colegios

    agregarIconos(anioSeleccionado, dist);


    //Borrar la lista anterior

    var elementos = document.getElementsByClassName("lista");

    // Iterar sobre la lista de elementos y borrar el contenido de cada uno
    for (var i = 0; i < elementos.length; i++) {
        elementos[i].innerHTML = '';
    }

    // Calles afectadas
    var arrayCallesAfectadas = listaCallesAfectadas(anioSeleccionado, dist);
    var arrayDistancias = listaDistancias(arrayCallesAfectadas, anioSeleccionado, dist)
    var listaCallesOrdenadas = ordenarArrays(arrayCallesAfectadas, arrayDistancias);
    var arrayCallesOrdenadas = listaCallesOrdenadas.array;
    var lista = document.querySelector('.lista');
    var listaUl = crearListaUl(arrayCallesOrdenadas, anioSeleccionado, dist);
    // Agregar la listaUl al div con la clase llamada lista 
    lista.appendChild(listaUl);

    //Agregando cuadro estadistico a cuadro11 
    crearCuadroEstadisticoBarras(dist)

    //Agregando cuadro estadistico al cuadro06
    crearCuadroEstadisticoBarrasHorizontal(dist)

})






