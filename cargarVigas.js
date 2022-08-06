let pesoEspecifico = {
    "cementoPortland" : 1400,
    "cementoAlbañileria": 930,
    "calHidraulica": 700,
    "calAerea": 850,
    "yeso": 970,
    "arenaGruesa": 1600,
    "arenaFina": 1600,
    "piedraPartida": 1550,
    "cascoteLadrillo": 1500,
    "agua": 1000,
    "morteroAsiento": 1900,
    "jaharroEnlucido": 1900,
    "morteroHidrofugo": 2100,
    "hormigon": 2350, 
    "hormigonArmado": 2500,
    "hormigonPobre": 1800
}

let pesoMamposteriaCompleta = {     // Incluye mortero de asiento y revoques
    "LH": 1050,
    "LHP": 1200,
    "BH": 1700,
    "LC": 1700,
}

let cargasSuperficiales ={
    "cielorrasoPlacaYeso": 20,
    "soladoPorcelanato": 20
}


// Formulas Auxiliares

function redondearNumero(num, digitos) {
    var multiplo = Math.pow(10, digitos);
    var numRedondeado = Math.round(num * multiplo) / multiplo;
    return numRedondeado;
}

function selectorCargaMayor(q1, q2){
    var resultado;
    if (q1 === q2 || q1 > q2){
        resultado = q1;
    }
    else {
        resultado = q2;
    }
    return redondearNumero(resultado, 2);
}

// Formulas Mayoracion: devuelven qu de elementos
function quLosa(componentes, luz, apoyo, carpeta, contrapiso, losa, dead, live){
    let cargaUltima;
    if (componentes === true){
        var superficie = luz*apoyo;
        let dead =  superficie * cargasSuperficiales["soladoPorcelanato"] + superficie * cargasSuperficiales["cielorrasoPlacaYeso"] + carpeta * pesoEspecifico["morteroHidrofugo"] + contrapiso * pesoEspecifico["hormigonPobre"] + losa * pesoEspecifico["hormigonArmado"];
        cargaUltima = selectorCargaMayor(live * 1.6 + dead * 1.2, 1.4 * dead);
    } else {
        cargaUltima = selectorCargaMayor(live * 1.6 + dead * 1.2, 1.4 * dead);
    }
    return cargaUltima;
}

function quTabique(tipo, espesor){
    let cargaUltima = pesoMamposteriaCompleta[tipo] * espesor * 1.2;
    return redondearNumero(cargaUltima, 2);
}

function quPuntual(carga){
    return redondearNumero(carga*1.3, 2);
}

// Formulas para Diagrama de Situaciones de Carga

// L , T o P    |   ubicacion(a, b)  a= inicio - b=fin     | cargasVigas = [nombre, kg, m al 0 ], 
let cargasViga = [];

function encontrarVaricentro(ubicacion){
    var varicentro = ubicacion[0]+((ubicacion[1]-ubicacion[0])/2);
    return varicentro;
}

function dimensionApoyo(ubicacion){
    var largo = ubicacion[1]-ubicacion[0];
    return largo;
}

var contadorCargas = {
    "L": 0,
    "T": 0,
    "P": 0,
}
function nomencladorCargas(tipo){
    let nombre = tipo;
    contadorCargas[tipo] += 1;
    nombre += contadorCargas[tipo];
    return nombre;
}

function agregarCarga(tipo, ubicacion, carga){
    let codCarga;
    let cargaUltima;
    let varicentro;
    if (tipo === "P") {
        cargaUltima = quPuntual(carga);
        varicentro = ubicacion;
    } else if (tipo === "L" || tipo === "T") {
        let cargaLineal;
        let largo = dimensionApoyo(ubicacion);
        varicentro = encontrarVaricentro(ubicacion);
        if (tipo === "T"){
            var tipoMampuesto = carga[0];
            var espesor = carga[1];
            cargaLineal = quTabique(tipoMampuesto, espesor);
        } else if (tipo === "L") {
            var componentes = carga[0];
            var luz = carga[1];
            var ancho = carga[2];
            var carpeta = carga[3];
            var contrapiso = carga[4];
            var losa = carga[5];
            var dead = carga[6];
            var live = carga[7];
            cargaLineal = quLosa(componentes, luz, ancho, carpeta, contrapiso, losa, dead, live);
            cargaLineal = (cargaLineal * luz)/2;
        }
        cargaUltima = redondearNumero(largo * cargaLineal, 2);
    } 
    codCarga = nomencladorCargas(tipo, cargasViga);
    if (varicentro === ubicacion){
        cargasViga.push([codCarga, cargaUltima, varicentro]);
    } else {
        cargasViga.push([codCarga, cargaUltima, varicentro, ubicacion]);
    }
}

/*
agregarCarga("L", [0, 6], [false, 4, 6, 0, 0, 0, 300, 200]);
agregarCarga("T", [0, 3], ["LH", 0.18]);
agregarCarga("T", [4, 6], ["LH", 0.18]);
agregarCarga("P", 2, 150);
agregarCarga("P", 6, 300);
console.log(cargasViga);
*/

function removerCarga(nombre){
    
}

function momentoMaximoVigasIsostaticas(largo, rA, rB, cargas){
}