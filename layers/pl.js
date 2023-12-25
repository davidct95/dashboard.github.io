var cuadro02 = document.querySelector('.cuadro02');
console.log(cuadro02)
var geojson;
//Inicializar la pagina con el anio 2017
var objetoPersAfectZon = agregarValoresAObjetoZona('2017', 'T_TOTAL');
var arrayDePropiedades = Object.keys(objetoPersAfectZon);
var arrayDeValores = Object.values(objetoPersAfectZon);
var arrayColores = [
  '#a14965',
  '#e65b5e',
  '#fa8167',
  '#fbad74',
  '#f9c67f',
  '#f9e19d',
];

agregarPastelEstadistico(arrayDeValores, arrayDePropiedades, arrayColores, cuadro02);

//---------------------------------------------------------------------------------

anios.addEventListener('change', function () {

  var valor = anios.value;

  objetoPersAfectZon = agregarValoresAObjetoZona(valor, 'T_TOTAL');

  arrayDePropiedades = Object.keys(objetoPersAfectZon);
  arrayDeValores = Object.values(objetoPersAfectZon);

  agregarPastelEstadistico(arrayDeValores, arrayDePropiedades, arrayColores, cuadro02);
});

