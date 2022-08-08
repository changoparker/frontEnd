// Diccionarios Pesos y Datos

let pesoEspecifico = {
    "agua": 1000,
    "arenaGruesa": 1600,
    "arenaFina": 1600,
    "cascoteLadrillo": 1500,
    "cementoPortland" : 1400,
    "cementoAlbañileria": 930,
    "calHidraulica": 700,
    "calAerea": 850,
    "hormigon": 24, 
    "hormigonArmado": 2500,
    "hormigonPobre": 1800,
    "jaharroEnlucido": 1900,
    "morteroAsiento": 1900,
    "morteroHidrofugo": 2100,
    "piedraPartida": 1550,
    "yeso": 970,  
}


let cargasMamposteriaCompleta = {     // Incluye mortero de asiento y revoques
    "LH": 1050,
    "LHP": 1200,
    "BH": 1700,
    "LC": 1700,
}

let cargasMamposteria = {     // Incluye mortero de asiento y revoques
    "LH": 800,
    "LHP": 1000,
    "BH": 1500,
    "LC": 1600,
}

let cargasSolados ={
    "porcelanato": 20,
    "ceramico": 28,
    "gres": 38,
    "vinilico": 7,
    "calcareo": 42,
    "parquet14Dura": 15,
    "parquet14semiDura": 12,
    "parquet22Dura": 25,
    "parquet22semiDura": 20,
}

let cargasCielorrasos = {
    "placasJuntaTomada": 20,
    "placasDesmontable": 10,
    "yesoMetalica": 18,
}

// Formulas Auxiliares

function redondearNumero(num, digitos) {
    var multiplo = Math.pow(10, digitos);
    var numRedondeado = Math.round(num * multiplo) / multiplo;
    return numRedondeado;
}
function redondearNumeroArriba(num, digitos) {
    var multiplo = Math.pow(10, digitos);
    var numRedondeado = Math.ceil(num * multiplo) / multiplo;
    return numRedondeado;
}

// Formulas Mayoracion: devuelven qu de elementos
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

function quLosa(luz, apoyo, live, solado, carpeta, contrapiso, cielorraso, losa){
    let superficie = luz * apoyo;
    let dead =  superficie * cargasSolados[solado] 
                + superficie * cargasCielorrasos[cielorraso] 
                + carpeta * pesoEspecifico["morteroHidrofugo"] 
                + contrapiso * pesoEspecifico["hormigonPobre"] 
                + losa * pesoEspecifico["hormigonArmado"];
    let cargaUltima = selectorCargaMayor(live * 1.6 + dead * 1.2, 1.4 * dead);
    return redondearNumero(cargaUltima, 2);
}

function mayorarLosa(dead, live){
    let cargaUltima = selectorCargaMayor(live * 1.6 + dead * 1.2, 1.4 * dead);
    return redondearNumero(cargaUltima, 2);
}
function quTabique(tipo, espesor){
    let cargaUltima = cargasMamposteriaCompleta[tipo] * espesor * 1.2;
    return redondearNumero(cargaUltima, 2);
}

function quPuntual(carga){
    return redondearNumero(carga*1.3, 2);
}


// deberia archivarse -->  [  [ V01 [ cargas ] ], [ V02 [ cargas ] ] ]
let vigas = [];
let cargasViga = [];


function encontrarVaricentro(x1, x2){
    var varicentro = x1+((x2-x1)/2);
    return varicentro;
}

function dimensionApoyo(x1, x2){
    return x2-x1;
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

function agregarPuntual(x, carga){
    cargaUltima = quPuntual(carga);
    codCarga = nomencladorCargas("P", cargasViga);
    cargasViga.push([codCarga, cargaUltima, x]);
}

function agregarTabique(x1, x2, tipo, espesor){
    largo = dimensionApoyo(x1, x2);
    cargaLineal = quTabique(tipo, espesor);
    cargaUltima = redondearNumero(largo * cargaLineal, 2);
    codCarga = nomencladorCargas("T", cargasViga);
    varicentro = encontrarVaricentro(x1, x2)
    cargasViga.push([codCarga, cargaUltima, varicentro, [x1, x2]]);
}

function agregarLosa(x1, x2, tipo, luz, componentes, dead, live, solado, carpeta, contrapiso, cielorraso, losa){
    codCarga = nomencladorCargas("L", cargasViga);
    varicentro = encontrarVaricentro(x1, x2);
    largo = dimensionApoyo(x1, x2);
    if (componentes === true){
        cargaSuperficial = quLosa(luz, largo, live, solado, carpeta, contrapiso, cielorraso, losa);
    } else {
        cargaSuperficial = mayorarLosa(dead, live);
    } 
    cargaLineal = (cargaSuperficial * luz)/2;
    cargaUltima = redondearNumero(cargaLineal * largo, 2);
    cargasViga.push([codCarga, cargaUltima, varicentro, (x1, x2)]);
}

function predimensionadoVigaHormigon(luz, tipoApoyo){
    let coeficiente;
    switch (tipoApoyo) {
        case "voladizo": 
            coeficiente = 2,4;   
                break;
        case "tramo": 
            coeficiente = 10;   
                break;
        case "hiperestaticaBorde": 
            coeficiente = 12;   
                break;
        case "hiperestaticaCentro": 
            coeficiente = 15;   
                break;
            } 
        let vigaH = redondearNumeroArriba(luz/coeficiente, 0);
        let vigaD = vigaH - 3;
        let vigaBW  = vigaH/3.5;
}


function calculoReacciones(rA, rB, cargas){
    }


function agregarViga(material, largo, rA, rB){
    let codigoViga;
    if (largo < rB || largo == 0 || rB <= rA) {
        console.log("error: revise los datos");
        return;
    } else if (rA == 0) {
        if (largo == rB) {
            codigoViga = "V";
        } else {
            codigoViga = "V/M";
        }
    } else { 
        if (largo == rB) {
            codigoViga = "M/V";
        }
    } console.log(codigoViga);
}

agregarViga("madera", 6, 0, 6);
agregarViga("madera", 5, 0, 6);
agregarViga("madera", 6, 0, 5);
agregarViga("madera", 6, 1, 6);
agregarViga("madera", 0, 0, 6);


/*
agregarPuntual(0, 500);
agregarPuntual(4, 200);
agregarTabique(0, 3, "LH", 0.18);
agregarTabique(4, 6, "LH", 0.12);
console.log(cargasViga);

*/