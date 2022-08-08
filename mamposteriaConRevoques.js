// Selector de Mampuesto para el calculo
var mampuestoCalculo = "";

function seleccionarMampuesto (mampuestoElegido) {
    var mampuestos = document.getElementsByName("mampuesto");
    var eleccion = document.getElementById("mampuestoElegido");
    var eleccionMortero = document.getElementById("morteroElegido");
    for (let i of mampuestos){
        if (i.checked) {
            eleccion.innerHTML = mampuestoElegido;
            mampuestoCalculo = i.value;
        }
    }
    switch (mampuestoElegido) {
        case 'Ladrillo Comun':
            eleccionMortero.innerHTML = "MHR 1/2 : 1 : 3  (15cm - panderete)<br> MHR 1/4 : 1 : 3  (30cm)";
                break;
        case 'Ladrillo Hueco':
            eleccionMortero.innerHTML = "MHR 1/2 : 1 : 3";
                break;
        case 'Ladrillo Hueco Portante':
            eleccionMortero.innerHTML = "MHR 1/8 : 1 : 3";
                break;
        case 'Bloque de Cemento':
            eleccionMortero.innerHTML = "MHR 1 : 1 : 6";
                break;
        case 'Bloque Retak':
            eleccionMortero.innerHTML = "Mortero Adhesivo Retak";
                break;
    }
}

// Factor Desperdicio Global

let desperdicio = 5;
const porcentajeDesperdicio = 1 + desperdicio/100;


// Diccionarios Datos Materiales 

let coefAporte = {
    "cementoPortland" : 0.45,
    "cementoAlbañileria": 0.39,
    "calHidraulica": 0.5,
    "calAerea": 0.43,
    "yeso": 0.4,
    "arenaGruesa": 0.6,
    "arenaFina": 0.5,
    "piedraPartida": 0.6,
    "cascoteLadrillo": 0.6,
    "agua": 1
}

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
    "LH": 1700,
    "LHP": 1200,
    "BH": 1050,
    "LC": 1700,
}


let pesoMampuestos = {
    "lH8" : 3.3,
    "lH12" : 4.4,
    "lH18" : 6,
    "lHP12" : 6,
    "lHP18" : 7.8,
    "bH10" : 8.7,
    "bH10m" : 4.15,
    "bH15" : 11.5,
    "bH15m" : 6.91,
    "bH20" : 17.1,
    "bH20m" : 9,
    "Rk10" : 8.5,
    "Rk15" : 12.8,
    "Rk20" : 17
}

let unidadesComerciales = {
    "arenaFina": 0.5,
    "arenaGruesa": 0.5,
    "cascoteLadrillo": 0.5,
    "cementoPortland" : 50,
    "cementoAlbañileria": 40,
    "calHidraulica": 30,
    "calAerea": 25,
    "morteroRetak": 30, 
    "piedraPartida": 0.5,
    "yesoFino": 25,
}

let ladrilloMacizo = {
    "largo" : 0.25,
    "ancho" : 0.11,
    "espesor" : 0.05,
    "juntaVertical": 0.02,
    "juntaHorizontal": 0.02
}

let ladrilloPortante = {
    "12": [0.3333, 0.19, 0.12],
    "18": [0.3333, 0.19, 0.18]
}

let ladrilloHueco = {
    "8": [0.3333, 0.18, 0.08],
    "12": [0.3333, 0.18, 0.12],
    "18": [0.3333, 0.18, 0.18]
}

let bloqueHormigon = {
    "10": [0.39, 0.19, 0.095],
    "10m": [0.19, 0.19, 0.095],
    "15": [0.39, 0.19, 0.14],
    "15m": [0.19, 0.19, 0.14],
    "20": [0.39, 0.19, 0.19],
    "20m": [0.19, 0.19, 0.19]
}

let ladrilloRetak = {
    "10": [0.5, 0.25, 0.1],
    "15": [0.5, 0.25, 0.15],
    "20": [0.5, 0.25, 0.2]
}



// Funciones Auxiliares

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

function redondearNumeroAbajo(num, digitos) {
    var multiplo = Math.pow(10, digitos);
    var numRedondeado = Math.floor(num * multiplo) / multiplo;
    return numRedondeado;
}

function superficieMuro(largo, alto){
    var superficie = redondearNumero(largo * alto, 2);
    return superficie;
}


// Funciones Especificas Construccion

function rendimientoMamposteriaRoja(largo, alto, espesor, juntaV, juntaH){
    var rendimientoHorizontal = 1/(largo + juntaV);
    var rendimientoVertical = 1/(alto + juntaH);
    ladrillosXM2 = redondearNumero(rendimientoHorizontal * rendimientoVertical, 2);
    var morteroXM2 = redondearNumero(largo * espesor * juntaH * ladrillosXM2, 3);
    return [ladrillosXM2, morteroXM2];
}

function rendimientoBloquesRetak(superficie, espesorBloque){
    let bloques = redondearNumero(superficie/(ladrilloRetak["20"][0] * ladrilloRetak["20"][1]), 0);
    mortero = superficie;
    if (espesorBloque == "10"){
        mortero *= 3.15;
    }
    else if (espesorBloque == "15"){
        mortero *= 4.70;
    }
    else if (espesorBloque == "20"){
        mortero *= 6.25;
    }
    return [bloques, mortero];
}


//  falta formula rendimiento bloque hormigon



// Morteros y Hormigones

function dosificadorAsiento(cemento, calH, arena){
    let porcentajeAgua = 12;
    let agua = (porcentajeAgua/100) * (cemento + calH + arena);
    var cementoReal = coefAporte["cementoPortland"] * cemento;
    var calReal = coefAporte["calHidraulica"] * calH;
    var arenaReal = coefAporte["arenaGruesa"] * arena;
    let total = cementoReal + calReal + arenaReal + agua;
    cemento = cemento/total;
    calH = calH/total;
    arena = redondearNumero(arena/total, 2);
    cemento = redondearNumero(cemento * pesoEspecifico["cementoPortland"], 2);
    calH = redondearNumero(calH * pesoEspecifico["calHidraulica"], 2);
    let materiales = [cemento, calH, arena];
    return materiales;
}

function dosificadorJaharro(cemento, calH, arena){
    let porcentajeAgua = 12;
    let agua = (porcentajeAgua/100) * (cemento + calH + arena);
    var cementoReal = coefAporte["cementoPortland"] * cemento;
    var calReal = coefAporte["calHidraulica"] * calH;
    var arenaReal = coefAporte["arenaGruesa"] * arena;
    let total = cementoReal + calReal + arenaReal + agua;
    cemento = cemento/total;
    calH = calH/total;
    arena = redondearNumero(arena/total, 2);
    cemento = redondearNumero(cemento * pesoEspecifico["cementoPortland"], 2);
    calH = redondearNumero(calH * pesoEspecifico["calHidraulica"], 2);
    let materiales = [cemento, calH, arena];
    return materiales;
}

function dosificadorEnlucido(cemento, calA, arena){
    let porcentajeAgua = 12;
    let agua = (porcentajeAgua/100) * (cemento + calA + arena);
    var cementoReal = coefAporte["cementoPortland"] * cemento;
    var calReal = coefAporte["calAerea"] * calA;
    var arenaReal = coefAporte["arenaFina"] * arena;
    let total = cementoReal + calReal + arenaReal + agua;
    cemento = cemento/total;
    calA = calA/total;
    arena = redondearNumero(arena/total, 2);
    cemento = redondearNumero(cemento * pesoEspecifico["cementoPortland"], 2);
    calA = redondearNumero(calA * pesoEspecifico["calAerea"], 2);
    let materiales = [cemento, calA, arena];
    return materiales;
}

function dosificadorHidrofugo(cemento, arena){
    let porcentajeAgua = 12;
    let agua = (porcentajeAgua/100) * (cemento + arena);
    var cementoReal = coefAporte["cementoPortland"] * cemento;
    var arenaReal = coefAporte["arenaGruesa"] * arena;
    let total = cementoReal + arenaReal + agua;
    agua = redondearNumero((agua/total) * pesoEspecifico["agua"], 2);
    let hidrofugo = redondearNumero(agua/10, 2);
    cemento = cemento/total;
    arena = redondearNumero(arena/total, 2);
    cemento = redondearNumero(cemento * pesoEspecifico["cementoPortland"], 2);
    let materiales = [cemento, arena, hidrofugo];
    return materiales;
}

function dosificadorHormigon(cemento, arena, piedra){
    let porcentajeAgua = 10;
    let agua = (porcentajeAgua/100) * (cemento + piedra + arena);
    var cementoReal = coefAporte["cementoPortland"] * cemento;
    var piedraReal = coefAporte["piedraPartida"] * arena;
    var arenaReal = coefAporte["arenaGruesa"] * arena;
    let total = cementoReal + arenaReal + piedraReal + agua;
    cemento = cemento/total;
    arena = redondearNumero(arena/total, 2);
    piedra = redondearNumero(piedra/total, 2);
    cemento = redondearNumero(cemento * pesoEspecifico["cementoPortland"], 2);
    let materiales = [cemento, arena, piedra];
    return materiales;
}

function dosificadorHormigonPobre(cemento, cal, arena, cascote){
    let porcentajeAgua = 10;
    let agua = (porcentajeAgua/100) * (cemento + cal + arena + cascote);
    var cementoReal = coefAporte["cementoPortland"] * cemento;
    var calReal = coefAporte["calHidraulica"] * cal;
    var arenaReal = coefAporte["arenaGruesa"] * arena;
    var cascoteReal = coefAporte["cascoteLadrillo"] * cascote;
    let total = cementoReal + calReal + arenaReal + cascoteReal + agua;
    cemento = cemento/total;
    cal = cal/total;
    arena = redondearNumero(arena/total, 2);
    cascote = redondearNumero(cascote/total, 2);
    cemento = redondearNumero(cemento * pesoEspecifico["cementoPortland"], 2);
    cal = redondearNumero(cal * pesoEspecifico["calHidraulica"], 2);
    let materiales = [cemento, cal, arena, cascote];
    return materiales;
}


// Dosificaciones

let morteroAsientoPortantes = dosificadorAsiento(0.125, 1, 3);
let morteroAsientoHuecos = dosificadorAsiento(0.5, 1, 3);
let morteroAsientoComunes = dosificadorAsiento(0.25, 1, 3);
let jaharro = dosificadorJaharro(0.25, 1, 3);
let enlucido = dosificadorEnlucido(0.125, 1, 2);
let hidrofugo = dosificadorHidrofugo(1, 3);
let contrapiso = dosificadorHormigonPobre(0.25, 1, 4, 8);


// Resultados Mamposteria
    
let resultadoLadrillos = document.getElementById("resultados-ladrillos");
let resultadoCemento = document.getElementById("resultados-cemento");
let resultadoCal = document.getElementById("resultados-calH");
let resultadoArena = document.getElementById("resultados-arena");
let resultadoBloquesRetak = document.getElementById("resultados-bloquesRetak");
let resultadoMorteroRetak = document.getElementById("resultados-morteroRetak");
let pisoMuro = document.getElementById("");



function materialesMuroM2 () {
    let largo = document.getElementById("entrada-largo").value;
    let alto = document.getElementById("entrada-alto").value;
    let espesor = document.getElementById("entrada-espesor").value;
    let superficie = superficieMuro(largo, alto);
    cemento = NaN;
    calH = NaN;
    arena = NaN;
    morteroRetak = NaN;
    if (mampuestoCalculo === "LH" || mampuestoCalculo === "LHP"){
        if (mampuestoCalculo === "LH") {
            var materiales = rendimientoMamposteriaRoja(ladrilloHueco[espesor][0], ladrilloHueco[espesor][1], ladrilloHueco[espesor][2], 0, 0.015);
            var ladrillos = redondearNumeroArriba(materiales[0] * superficie * porcentajeDesperdicio, 0);
            cemento = redondearNumero(morteroAsientoHuecos[0] * materiales[1] * superficie * porcentajeDesperdicio, 2);
            calH = redondearNumero(morteroAsientoHuecos[1] * materiales[1] * superficie * porcentajeDesperdicio, 2);
            arena = redondearNumero(morteroAsientoHuecos[2] * materiales[1] * superficie * porcentajeDesperdicio, 2);
        } else {
            var materiales = rendimientoMamposteriaRoja(ladrilloPortante[espesor][0], ladrilloPortante[espesor][1], ladrilloPortante[espesor][2], 0, 0.01);
            var ladrillos = redondearNumeroArriba(materiales[0] * superficie * porcentajeDesperdicio, 0);
            cemento = redondearNumero(morteroAsientoPortantes[0] * materiales[1] * superficie * porcentajeDesperdicio, 2);
            calH = redondearNumero(morteroAsientoPortantes[1] * materiales[1] * superficie * porcentajeDesperdicio, 2);
            arena = redondearNumero(morteroAsientoPortantes[2] * materiales[1] * superficie * porcentajeDesperdicio, 2);
        }
    document.getElementById("resultadosRetak").style.display = "none";
    document.getElementById("resultados").style.display = "block";
    cemento = redondearNumeroArriba(cemento/unidadesComerciales["cementoPortland"], 0);
    calH = redondearNumeroArriba(calH/unidadesComerciales["calHidraulica"], 0);
    resultadoLadrillos.textContent = ladrillos;
    resultadoCemento.textContent = cemento;
    resultadoCal.textContent = calH;
    resultadoArena.textContent = arena; 
    return
    } else if (mampuestoCalculo === "BH") {
    } else if (mampuestoCalculo === "RK") {
        var materiales = rendimientoBloquesRetak(superficie, espesor);
        resultadoBloquesRetak.textContent = materiales[0];
        resultadoMorteroRetak.textContent = redondearNumeroArriba(materiales[1]/unidadesComerciales["morteroRetak"], 0);
        document.getElementById("resultados").style.display = "none";
        document.getElementById("resultadosRetak").style.display = "block";
        return
    } else if (mampuestoCalculo === "LC") {
        document.getElementById("resultadosRetak").style.display = "none";
    }
}


function limpiarResultados(){
    document.getElementById("resultados").style.display = "none";
    document.getElementById("resultadosRetak").style.display = "none";
    resultadoLadrillos.textContent = "";
    resultadoCemento.textContent = "";
    resultadoCal.textContent = "";
    resultadoArena.textContent = "";
    resultadoBloquesRetak.textContent = "";
    resultadoMorteroRetak.textContent = "";
}
