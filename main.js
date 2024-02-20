var map = L.map("map").setView([-12.0389, -77.024763], 15.5);

var anioSeleccionado = "2017";
var layerSeleccionado = "Rimac";
let anios = document.getElementById("anios");
let distritos = document.getElementById("distritos");
var dist;
let tituloDistrito = document.getElementById("tituloDistrito");

dist = distritos.addEventListener("change", function () {
  var layerSeleccionado = distritos.value;

  if (layerSeleccionado === "Rimac") {
    dist = "Rimac";
  } else if (layerSeleccionado === "Lurigancho") {
    dist = "Lurigancho";
  }
});

dist = "Rimac";
tituloDistrito.innerHTML = "&nbsp;" + dist + "&nbsp;";

var zonas = array(anioSeleccionado, "zona", dist);
var cantidadTotalZona = totalPorZona(anioSeleccionado, zonas, "T_TOTAL", dist);
var arrayOrdenados = ordenarArrays(zonas, cantidadTotalZona);
var zonasOrdenada = arrayOrdenados.array;
var cantidadOrdenada = arrayOrdenados.cantidades;

//https://tile.openstreetmap.org/{z}/{x}/{y}.png

L.tileLayer("http://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

var geojsonLayer;

class ColorEdit {
  constructor(color, opacity, weight, fillColor, fillOpacity) {
    this.color = color;
    this.opacity = opacity;
    this.weight = weight;
    this.fillColor = fillColor;
    this.fillOpacity;
  }

  // color: "#FF3361",
  // opacity: 1,
  // weight: 1,
  // fillColor: 'red',
  // fillOpacity: 0.9
}

let arrayColoresRimac = [
  "#a14965",
  "#e65b5e",
  "#fa8167",
  "#fbad74",
  "#f9c67f",
  "#f9e19d",
];

let arrayColoresLurigancho = [
  "#1f78b4",
  "#3870b3",
  "#5068a3",
  "#685f94",
  "#805784",
  "#984e75",
  "#b04566",
  "#c83d57",
  "#e03447",
  "#f82c38",
  "#ff2439",
];

//Rimac

const color1 = new ColorEdit("white", 1, 0.5, arrayColoresRimac[0], 0.9);
const color2 = new ColorEdit("white", 1, 0.5, arrayColoresRimac[1], 0.9);
const color3 = new ColorEdit("white", 1, 0.5, arrayColoresRimac[2], 0.9);
const color4 = new ColorEdit("white", 1, 0.5, arrayColoresRimac[3], 0.9);
const color5 = new ColorEdit("white", 1, 0.5, arrayColoresRimac[4], 0.9);
const color6 = new ColorEdit("white", 1, 0.5, arrayColoresRimac[5], 0.9);

//Lurigancho

const color8 = new ColorEdit("white", 1, 0.5, arrayColoresLurigancho[0], 0.9);
const color9 = new ColorEdit("white", 1, 0.5, arrayColoresLurigancho[1], 0.9);
const color10 = new ColorEdit("white", 1, 0.5, arrayColoresLurigancho[2], 0.9);
const color11 = new ColorEdit("white", 1, 0.5, arrayColoresLurigancho[3], 0.9);
const color12 = new ColorEdit("white", 1, 0.5, arrayColoresLurigancho[4], 0.9);
const color13 = new ColorEdit("white", 1, 0.5, arrayColoresLurigancho[5], 0.9);
const color14 = new ColorEdit("white", 1, 0.5, arrayColoresLurigancho[6], 0.9);
const color15 = new ColorEdit("white", 1, 0.5, arrayColoresLurigancho[7], 0.9);
const color16 = new ColorEdit("white", 1, 0.5, arrayColoresLurigancho[8], 0.9);
const color17 = new ColorEdit("white", 1, 0.5, arrayColoresLurigancho[9], 0.9);
const color18 = new ColorEdit("white", 1, 0.5, arrayColoresLurigancho[10], 0.9);

//Color transparente
const colorT = new ColorEdit("rgba(0,0,0,0)", 1, 0.5, "rgba(0,0,0,0)", 0.9);

let arrayColoresObjetoRimac = [
  color1,
  color2,
  color3,
  color4,
  color5,
  color6,
  colorT,
];

let arrayColoresObjetoLurigancho = [
  color8,
  color9,
  color10,
  color11,
  color12,
  color13,
  color14,
  color15,
  color16,
  color17,
  color18,
  colorT,
];



// Define las opciones para el estilo de las teselas vectoriales
var options = {
  maxZoom: 19,
  tolerance: 3,
  debug: 0,
  style: (properties) =>
    obtenerColorZonas(
      arrayColoresObjetoRimac,
      anioSeleccionado,
      properties,
      dist
    ),
};

// Añade las teselas vectoriales
var geojsonLayer = L.geoJSON.vt(lotes_rimac, options).addTo(map);




// Define el área específica donde quieres que se imprima las coordenadas
var areaEspecifica = L.geoJSON(lotes_rimac)
var polygonCoords = [];
var polygon = null;

map.on("click", onMapClick);




// Crear un control informativo
var info = L.control();

info.onAdd = function (map) {
  this._div = L.DomUtil.create("div", "info"); // crea un div con una clase 'info'
  this.update();
  return this._div;
};

// Método para actualizar el control informativo
info.update = function (props) {
  zonasAfect = zonas;

  this._div.innerHTML =
    "<h4>Población afectada</h4>" +
    (props
      ? "<b>" +
        "Zona " +
        props.zona +
        "</b><br />" +
        props.T_TOTAL +
        " personas / lote" +
        "</b><br />"
      : "Click en un lote para más información");
};

info.addTo(map);

//Leyenda

var legend = L.control({ position: "bottomright" });
leyenda(legend, zonasOrdenada, dist);
legend.addTo(map);

//Agregando información a los cuadros

updateCuadros(anioSeleccionado, dist);

//Agregar cuadro pastel estadístico a cuadro02

cuadro02 = document.querySelector(".cuadro02");
agregarPastelEstadistico(cuadro02, zonasOrdenada, cantidadOrdenada, dist);

//Agregando información a cuadro de lotes afectados
mostrarContenido(2, anioSeleccionado, dist);
eventoClick(anioSeleccionado, dist);

//Agregando barra de barras verticales en cuadro10

cuadroBarrasVertical(dist);

//Agregar iconos de hospitales y colegios

agregarIconos(anioSeleccionado, dist);

// Calles afectadas
var arrayCallesAfectadas = listaCallesAfectadas(anioSeleccionado, dist);
var arrayDistancias = listaDistancias(
  arrayCallesAfectadas,
  anioSeleccionado,
  dist
);
var listaCallesOrdenadas = ordenarArrays(arrayCallesAfectadas, arrayDistancias);
var arrayCallesOrdenadas = listaCallesOrdenadas.array;
var lista = document.querySelector(".lista");
var listaUl = crearListaUl(arrayCallesOrdenadas, anioSeleccionado, dist);
// Agregar la listaUl al div con la clase llamada lista
lista.appendChild(listaUl);

//Añadir funcionalidad al Buscador

document.addEventListener("keyup", (e) => {
  if (e.target.matches("#buscador")) {
    if (e.key === "Escape") e.target.value = "";

    document.querySelectorAll(".calle").forEach((calle) => {
      calle.textContent.toLowerCase().includes(e.target.value.toLowerCase())
        ? calle.classList.remove("filtro")
        : calle.classList.add("filtro");
    });
  }
});

//Agregando cuadro estadistico a cuadro11
crearCuadroEstadisticoBarras(dist);

//Agregando cuadro estadistico al cuadro06
crearCuadroEstadisticoBarrasHorizontal(dist);

//Cambiar de año y datos
//============================================================================================
anios.addEventListener("change", function () {

  console.log("Este es el dist" + dist);
  anioSeleccionado = anios.value;

  zonas = array(anioSeleccionado, "zona", dist);
  cantidadTotalZona = totalPorZona(anioSeleccionado, zonas, "T_TOTAL", dist);
  arrayOrdenados = ordenarArrays(zonas, cantidadTotalZona);
  zonasOrdenada = arrayOrdenados.array;
  cantidadOrdenada = arrayOrdenados.cantidades;

  var capaDistrito;

  if (dist === "Rimac") {
    capaDistrito = lotes_rimac;
    arrayColoresObjeto = arrayColoresObjetoRimac;
  } else if (dist === "Lurigancho") {
    capaDistrito = lotes_lurigancho;
    arrayColoresObjeto = arrayColoresObjetoLurigancho;
  }

  //Agregando leyenda
  leyenda(legend, zonasOrdenada, dist);
  legend.addTo(map);

  //Eliminando solo geojsonLayer

  if (geojsonLayer !== null) {
    map.removeLayer(geojsonLayer);
  }

  
  if(polygon !== null){
    map.removeLayer(polygon);
  }

  //Eliminando todas las capas anteriores

  map.eachLayer(function (layer) {
    if (layer instanceof L.GeoJSON) {
      map.removeLayer(layer);
    }
  });

  //Cambiando zonas afectadas por año

  // Define las opciones para el estilo de las teselas vectoriales
  options = {
    maxZoom: 19,
    tolerance: 3,
    debug: 0,
    style: (properties) =>
      obtenerColorZonas(
        arrayColoresObjeto,
        anioSeleccionado,
        properties,
        dist
      ),
  };

  // Añade las teselas vectoriales
  geojsonLayer = L.geoJSON.vt(capaDistrito, options).addTo(map);

  //Cambiando información de los cuadros
  updateCuadros(anioSeleccionado, dist);

  //Agregando informacion a cuadro02 de poblacion afectada

  agregarPastelEstadistico(cuadro02, zonasOrdenada, cantidadOrdenada, dist);

  //Agregando información a cuadro de lotes afectados
  mostrarContenido(2, anioSeleccionado, dist);
  eventoClick(anioSeleccionado, dist);

  //Agregar iconos de hospitales y colegios

  agregarIconos(anioSeleccionado, dist);

  //Borrar la lista anterior

  var elementos = document.getElementsByClassName("lista");

  // Iterar sobre la lista de elementos y borrar el contenido de cada uno
  for (var i = 0; i < elementos.length; i++) {
    elementos[i].innerHTML = "";
  }

  // Calles afectadas
  var arrayCallesAfectadas = listaCallesAfectadas(anioSeleccionado, dist);
  var arrayDistancias = listaDistancias(
    arrayCallesAfectadas,
    anioSeleccionado,
    dist
  );
  var listaCallesOrdenadas = ordenarArrays(
    arrayCallesAfectadas,
    arrayDistancias
  );
  var arrayCallesOrdenadas = listaCallesOrdenadas.array;
  var lista = document.querySelector(".lista");
  var listaUl = crearListaUl(arrayCallesOrdenadas, anioSeleccionado, dist);
  // Agregar la listaUl al div con la clase llamada lista
  lista.appendChild(listaUl);
});

//=====================================================================================
//=====================================================================================
//Cambio Según distrito
distritos.addEventListener("change", function () {
  layerSeleccionado = distritos.value;
  console.log(layerSeleccionado);

  var layerGeoJson;
  var nuevaUbicacion;

  map.eachLayer(function (layer) {
    if (layer instanceof L.GeoJSON) {
      map.removeLayer(layer);
    }
  });

  if (geojsonLayer !== null) {
    map.removeLayer(geojsonLayer);
  }

  if(areaEspecifica !== null){
    map.removeLayer(areaEspecifica);
  }

  if(polygon !== null){
    map.removeLayer(polygon);
  }

  if (layerSeleccionado === "Rimac") {
    layerGeoJson = lotes_rimac;
    nuevaUbicacion = { latitud: -12.0389, longitud: -77.024763, zoom: 15.5 };
    arrayColoresObjeto = arrayColoresObjetoRimac;
    areaEspecifica = L.geoJSON(lotes_rimac)
  } else if (layerSeleccionado === "Lurigancho") {
    layerGeoJson = lotes_lurigancho;
    nuevaUbicacion = { latitud: -12.03, longitud: -76.97817, zoom: 14.3 };
    arrayColoresObjeto = arrayColoresObjetoLurigancho;
    areaEspecifica = L.geoJSON(lotes_lurigancho)
  }

  tituloDistrito.innerHTML = "&nbsp;" + dist + "&nbsp;";

  zonas = array(anioSeleccionado, "zona", dist);
  cantidadTotalZona = totalPorZona(anioSeleccionado, zonas, "T_TOTAL", dist);
  arrayOrdenados = ordenarArrays(zonas, cantidadTotalZona);
  zonasOrdenada = arrayOrdenados.array;
  cantidadOrdenada = arrayOrdenados.cantidades;

  map.setView(
    [nuevaUbicacion.latitud, nuevaUbicacion.longitud],
    nuevaUbicacion.zoom
  );

  // Define las opciones para el estilo de las teselas vectoriales
  options = {
    maxZoom: 19,
    tolerance: 3,
    debug: 0,
    style: (properties) =>
      obtenerColorZonas(
        arrayColoresObjeto,
        anioSeleccionado,
        properties,
        dist
      ),
  };

  // Añade las teselas vectoriales
  geojsonLayer = L.geoJSON.vt(layerGeoJson, options).addTo(map);

  //Agregando leyenda
  leyenda(legend, zonasOrdenada, dist);
  legend.addTo(map);

  updateCuadros(anioSeleccionado, dist);

  agregarPastelEstadistico(cuadro02, zonasOrdenada, cantidadOrdenada, dist);

  //Agregando información a cuadro de lotes afectados
  mostrarContenido(2, anioSeleccionado, dist);
  eventoClick(anioSeleccionado, dist);

  //Agregando cuadro de barras en cuadro10

  cuadroBarrasVertical(dist);

  //Agregar iconos de hospitales y colegios

  agregarIconos(anioSeleccionado, dist);

  //Borrar la lista anterior

  var elementos = document.getElementsByClassName("lista");

  // Iterar sobre la lista de elementos y borrar el contenido de cada uno
  for (var i = 0; i < elementos.length; i++) {
    elementos[i].innerHTML = "";
  }

  // Calles afectadas
  var arrayCallesAfectadas = listaCallesAfectadas(anioSeleccionado, dist);
  var arrayDistancias = listaDistancias(
    arrayCallesAfectadas,
    anioSeleccionado,
    dist
  );
  var listaCallesOrdenadas = ordenarArrays(
    arrayCallesAfectadas,
    arrayDistancias
  );
  var arrayCallesOrdenadas = listaCallesOrdenadas.array;
  var lista = document.querySelector(".lista");
  var listaUl = crearListaUl(arrayCallesOrdenadas, anioSeleccionado, dist);
  // Agregar la listaUl al div con la clase llamada lista
  lista.appendChild(listaUl);

  //Agregando cuadro estadistico a cuadro11
  crearCuadroEstadisticoBarras(dist);

  //Agregando cuadro estadistico al cuadro06
  crearCuadroEstadisticoBarrasHorizontal(dist);
});
