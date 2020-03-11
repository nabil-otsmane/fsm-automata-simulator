var A = new Automate([],[],[],[],[]); // empty Automate

var nodes, edges, network, nodeIds = [], edgeIds = [];

function addToEns(id, add, modify, remove, value, focus) {
    var ens = document.getElementById(id);
    if(!ens)
        throw "IdError: Wrong id '"+id+"' to AddToEns";

    // <input type='text' class='in3' onkeydown='in3' />
    var inp = document.createElement('input');
    inp.type = "text";
    inp.className = "in3";
    inp.value = value || '';
    inp.onkeydown = in3;
    var p = document.createElement('span');

    if(ens.children.length === 0) { // empty
        ens.appendChild(inp)
    } else {
        p.innerText = ', ';
        ens.append(p);
        ens.appendChild(inp);
    }
    !focus && inp.focus();
    var i = value || -1;
    inp.onblur = function() {
        if(this.value === ""){
            if(ens.children.item(0) === inp){
                if(ens.childElementCount > 1)
                    ens.removeChild(ens.children.item(1));
            } else {
                ens.removeChild(p);
            }
            ens.removeChild(inp);

            if(i != -1) { // not the first time
                remove(i);
            }
        } else {
            try {
                if(i === -1)
                    add(this.value);
                else if(i !== this.value)
                    modify(i, this.value);

                i = this.value;
            } catch(e) {
                alert(e);
                inp.value = i===-1?'':i;
                inp.focus();
            }
        }
        
    }
}

function addIToEns(id, add, modify, remove, value, focus) {
    var ens = document.getElementById(id);
    if(!ens)
        throw "IdError: Wrong id '"+id+"' to AddToEns";

    // <span id='inst'>(<input type='text' class='in3' />, <input type='text' />, <input type='text' />) <button>-</button></span>
    var cont = document.createElement('span');
    var virg = document.createElement('span');
    virg.innerHTML = ', ';
    var inp = document.createElement('input');
    var inp2 = document.createElement('input');
    var inp3 = document.createElement('input');
    inp.className = inp2.className = inp3.className = 'in3';
    inp.type = inp2.type = inp3.type = 'text';
    value && (inp.value = value[0]);
    value && (inp2.value = value[1]);
    value && (inp3.value = value[2]);
    inp.onkeydown = inp2.onkeydown = inp3.onkeydown = in3;

    var btn = document.createElement('button');
    btn.innerHTML = '-';

    if(ens.children.length !== 0)
        ens.appendChild(virg);
    
    cont.append('(');
    cont.appendChild(inp);
    cont.append(', ');
    cont.appendChild(inp2);
    cont.append(', ');
    cont.appendChild(inp3);
    cont.append(')');
    cont.appendChild(btn);
    cont.appendChild(document.createElement('br'));

    ens.appendChild(cont);

    !focus && inp.focus();
    var i = [-1, -1, -1];
    function blur(e, x) {
        if(e.target.value !== ''){
            var tmp = [...i];
            try {
                i[x] = e.target.value;
                if(!i.includes(-1))
                {
                    if(tmp[x] === -1)
                    {
                        add(i);
                    } else if(tmp[x] !== i[x]) {
                        modify(tmp, [...i]);
                    }
                }
            } catch(ee) {
                if(ee instanceof Error)
                    console.log(ee);
                alert(ee);
                // remove element
                if(tmp.includes(-1))
                    ens.removeChild(cont);
                else {
                    e.target.value = tmp[x];
                    i = [...tmp];
                }
            }
        } else {
            i[x] = -1;
        }
    }
    inp.onblur = e => {blur(e, 0)};
    inp2.onblur = e => {blur(e, 1)};
    inp3.onblur = e => {blur(e, 2)};
    btn.onclick = function() {
        if(ens.children.item(0) === cont){
            if(ens.childElementCount > 1)
                ens.removeChild(ens.children.item(1));
        } else {
            ens.removeChild(virg);
        }
        ens.removeChild(cont);

        if(inp.value !== '' && inp2.value !== '' && inp3.value !== '')
            remove([inp.value, inp2.value, inp3.value]);
    }
}

function in3(e) {
    if(e.target.value.length == 3 && e.key !== "Backspace")
        e.preventDefault();
}

function extractFromEns(elem, isII) {
    var ret = [];
    
    if(isII){

    } else {
        var inps = elem.getElementsByClassName("in3");
        for(var i=0; i<inps.length;i++){
            ret.push(inps[i].value);
        }
    }
    return ret;
}

function setX(elem) {
    A.setAlphabet(extractFromEns(elem));
    /*
    drawAutomate(A)
    //*/
}

function setS(elem) {
    var etats = extractFromEns(elem);
    A.setEtats([]);
    nodes.clear();
    for(var i in etats){
        addEtat(etats[i]);
    }
    /*
    drawAutomate(A)
    //*/
}

function setS0(elem) {
    A.setEtatsInit(extractFromEns(elem));
    /*
    drawAutomate(A)
    //*/
}

function setF(elem) {
    A.setEtatsFinaux(extractFromEns(elem));
    /*
    drawAutomate(A)
    //*/
}

function setII(elem) {
    A.setInstructions(extractFromEns(elem, true));
    /*
    drawAutomate(A)
    //*/
}

function addAlpha(x) {
    A.ajouterAlpha(x);
}

function modifyAlpha(x, y) {
    A.modifierAlpha(x, y);
    refreshII(A);
    for(var i in A.II) {
        if(A.II[i][1] === y){
            drawSuppInst([A.II[i][0], x, A.II[i][2]]);
            drawInst(A.II[i]);
        }
    }
}

function removeAlpha(x) {
    var I = A.II;
    A.supprimerAlpha(x);
    refreshII(A);
    for(var i in I){
        if(I[i][1] === x){
            drawSuppInst(I[i]);
        }
    }
}

function addEtat(etat) {
    A.ajouterEtat(etat);
    drawEtat(etat);
}

function modifyEtat(etat0, etat1) {
    A.modifierEtat(etat0, etat1);
    drawModifEtat(etat0, etat1);
    refreshS0(A);
    refreshF(A);
    refreshII(A);
}

function removeEtat(etat) {
    A.supprimerEtat(etat);
    drawSuppEtat(etat);
    refreshS0(A);
    refreshF(A);
    refreshII(A);
}

function addEtatInit(s0) {
    A.ajouterEtatInit(s0);
    drawEtatInit(s0, true);
}

function modifyEtatInit(s0, s1) {
    A.modifierEtatInit(s0, s1);
    drawEtatInit(s0, false);
    drawEtatInit(s1, true);
}

function removeEtatInit(s0) {
    A.supprimerEtatInit(s0);
    drawEtatInit(s0, false);
}

function addEtatFinal(s0) {
    A.ajouterEtatFinal(s0);
    drawEtatFinal(s0, true);
}

function modifyEtatFinal(s0, s1) {
    A.modifierEtatFinal(s0, s1);
    drawEtatFinal(s0, false);
    drawEtatFinal(s1, true);
}

function removeEtatFinal(s0) {
    A.supprimerEtatFinal(s0);
    drawEtatFinal(s0, false);
}

function addInstruction(ins) {
    A.ajouterInstruction(...ins);
    drawInst(ins);
}

function removeInstruction(ins) {
    A.supprimerInstruction(...ins);
    drawSuppInst(ins);
}

function modifyInstruction(ins0, ins1) {
    A.modifierInstruction(ins0, ins1);
    drawSuppInst(ins0);
    drawInst(ins1);
}

var etatId = 0;
function drawEtat(etat) {
    var node = {id: etatId++, label: etat, isEtatInit: false, isEtatFinal: false};

    nodeIds.push(node);
    nodes.add(node);
}

function drawModifEtat(etat0, etat1) {
    var id = nodeIds.findIndex(x => x.label === etat0);
    
    // modify everything
    nodeIds[id].label = etat1;
    nodes.update([nodeIds[id]]);
}

function drawSuppEtat(etat) {
    var id = nodeIds.findIndex(x => x.label === etat);
    nodes.remove(nodeIds.splice(id, 1)[0]);
}

function drawEtatInit(etat, isInit) {
    var id = nodeIds.findIndex(x => x.label === etat);
    nodeIds[id].isEtatInit = isInit;
    nodes.update([nodeIds[id]]);
}

function drawEtatFinal(etat, isFinal) {
    var id = nodeIds.findIndex(x => x.label === etat);
    nodeIds[id].isEtatFinal = isFinal;
    nodes.update([nodeIds[id]]);
}

var instId = 0;
function drawInst(ins) {
    var edge = {
        id: instId++,
        from: nodeIds.find(x => x.label === ins[0]).id,
        to: nodeIds.find(x => x.label === ins[2]).id,
        label: ins[1]
    };
    edgeIds.push(edge);
    edges.add(edge);
}

function drawSuppInst(ins) {
    var id = edgeIds.findIndex(
        e => e.from === nodeIds.find(x => x.label === ins[0]).id
        && e.to === nodeIds.find(x => x.label === ins[2]).id
        && e.label === ins[1]);

    edges.remove(edgeIds.splice(id, 1)[0]);
}

function initNetwork(id) {
    var el = document.getElementById(id);
    if(!el)
        throw 'ElemError: no element with id ' + id;

    nodes = new vis.DataSet([]);
    edges = new vis.DataSet([]);
    network = new vis.Network(el, {nodes, edges}, {
        edges: {
            arrows:'to'
        },
        nodes: {
            color: {background:'white', border:'black'}
        }
    });
    network.on('afterDrawing', function(ctx) {
        var init = nodeIds.reduce((p, n, i, arr) => {
            if(arr[i].isEtatInit)
                p.push(arr[i].id);
            return p;
        }, []);
        var initPositions = network.getPositions(init);

        var final = nodeIds.reduce((p, n, i, arr) => {
            if(arr[i].isEtatFinal)
                p.push(arr[i].id);
            return p;
        }, []);
        var finalPositions = network.getPositions(final);

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 0.3;
        for(var i in final) {
            ctx.beginPath();
            ctx.arc(
                finalPositions[final[i]].x,
                finalPositions[final[i]].y,
                20,
                0,
                2 * Math.PI
            );
            ctx.closePath();
            ctx.stroke();
        }
        for(var i in init) {
            var ox = initPositions[init[i]].x;
            var oy = initPositions[init[i]].y;
            var b = 5;
            var off1 = 2.5;
            var x1 = 30 + off1, y1 = 30 - b;
            var x2 = 15 + off1, y2 = 15 - b;
            ctx.moveTo(ox-x1, oy-y1);
            ctx.lineTo(ox-x2, oy-y2);
            var off2 = 3.5;
            var rx = 30 - off2;
            var rx2 = 15 - off2;
            var ry = rx + b;
            var ry2 = rx2 + b;
            ctx.moveTo(ox-rx, oy-ry);
            ctx.lineTo(ox-rx2, oy-ry2);

            var cx = 11;
            var cy = 10;
            // find line equation y = ax + b
            var a = (ry2-cy)/(rx2-cx);
            var b = ry2 - a*rx2;
            var x = 11.9;
            ctx.moveTo(ox-x, oy-(a*x+b));
            ctx.lineTo(ox-cx, oy-cy);
            a = (y2-cy)/(x2-cx);
            b = y2 - a*x2;
            x = 23;
            ctx.lineTo(ox-x, oy-(a*x+b));
            ctx.stroke();
        }
    });
}

function clearElems(){
    for(var i=0;i < arguments.length;i++){
        var elem = document.getElementById(arguments[i]);
        elem.innerHTML = '';
    }
}

function refreshX(B, draw) {
    clearElems('ens1');
    for(var i in B.X){
        addToEns('ens1', addAlpha, modifyAlpha, removeAlpha, B.X[i], true);
        draw && addAlpha(B.X[i]);
    }
}

function refreshS(B, draw) {
    clearElems('ens2');
    for(var i in B.S){
        addToEns('ens2', addEtat, modifyEtat, removeEtat, B.S[i], true);
        draw && addEtat(B.S[i]);
    }
}

function refreshS0(B, draw) {
    clearElems('ens3');
    for(var i in B.S0){
        addToEns('ens3', addEtatInit, modifyEtatInit, removeEtatInit, B.S0[i], true);
        draw && addEtatInit(B.S0[i]);
    }
}

function refreshF(B, draw) {
    clearElems('ens4');
    for(var i in B.F){
        addToEns('ens4', addEtatFinal, modifyEtatFinal, removeEtatFinal, B.F[i], true);
        draw && addEtatFinal(B.F[i]);
    }
}

function refreshII(B, draw) {
    clearElems('ens5');
    for(var i in B.II){
        addIToEns('ens5', addInstruction, modifyInstruction, removeInstruction, B.II[i], true);
        draw && addInstruction(B.II[i]);
    }
}

/**
 * Draw the automate manually
 * @param {Automate} B 
 */
function drawAutomate(B) {
    A = new Automate([], [], [], [], []);
    nodes.clear();
    edges.clear();
    edgeIds = [];
    nodeIds = [];

    refreshX(B, !0);

    refreshS(B, !0);

    refreshS0(B, !0);

    refreshF(B, !0);

    refreshII(B, !0);
}

function drawReduit() {
    drawAutomate(A.AutomateReduit());
}

function drawMiroir() {
    drawAutomate(A.AutomateMiroir());
}

function drawComplement() {
    drawAutomate(A.AutomateComplement());
}

function drawDeterministe() {
    drawAutomate(A.AutomateDeterministe());
}

function drawComplet() {
    drawAutomate(A.AutomateComplet());
}

function reconnaissance() {
    var inst = document.getElementById('instructions');
    var out = document.getElementById('out');
    var steps = document.getElementById('steps');
    var mot = prompt("entrer le mot: ");
    inst.style.display = 'block';
    try {
        var chemin = [];
        var res = A.reconnaissance(mot, chemin)?'est':"n'est pas";
        out.style.color = "#000000"
        out.innerHTML = `le mot "${mot}" ${res} reconnue par A.`;
        steps.innerHTML = chemin.join('->');
    } catch(e) {
        out.innerHTML = `ERREUR: ${e}`;
        out.style.color = "#ff0000"
    }
}

function clik() {
    var inst = document.getElementById('instructions');
    inst.style.display = 'none';
}