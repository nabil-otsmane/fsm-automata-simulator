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
                else
                    modify(i, this.value);

                i = this.value;
            } catch(e) {
                alert(e);
                inp.value = '';
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
            try {
                var tmp = [...i];
                i[x] = e.target.value;
                if(!i.includes(-1))
                {
                    if(tmp[x] === -1)
                    {
                        add(i);
                    } else {
                        modify(tmp, i);
                    }
                }
            } catch(e) {
                alert(e);
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

function drawInst(ins) {
    var edge = {
        id: edgeIds.length,
        from: nodeIds.find(x => x.label === ins[0]).id,
        to: nodeIds.find(x => x.label === ins[2]).id,
        label: ins[1]
    };
    edgeIds.push(edge);
    edges.add(edge);
}

function drawSuppInst(ins) {
    var edge = edgeIds.find(e => e.from === nodeIds.find(x => x.label === ins[0]).id
    && e.to === nodeIds.find(x => x.label === ins[2]).id 
    && e.label === ins[1]);

    edges.remove(edge);
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
    removeInstruction(ins0);
    addInstruction(ins1);
}

function addAlpha(x) {
    A.ajouterAlpha(x);
}

function modifyAlpha(x, y) {
    A.modifierAlpha(x, y);
}

function removeAlpha(x) {
    A.supprimerAlpha(x);
}

function drawEtat(etat) {
    var node = {id: nodeIds.length, label: etat, isEtatInit: false, isEtatFinal: false};

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

function addEtat(etat) {
    A.ajouterEtat(etat);
    drawEtat(etat);
}

function modifyEtat(etat0, etat1) {
    A.supprimerEtat(etat0);
    A.ajouterEtat(etat1);
    drawModifEtat(etat0, etat1);
}

function removeEtat(etat) {
    A.supprimerEtat(etat);
    drawSuppEtat(etat);
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
    A.removeEtatInit(s0);
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
            var x = initPositions[init[i]].x;
            var y = initPositions[init[i]].y;
            ctx.moveTo(x-30, y-30);
            ctx.lineTo(x-15, y-15);
            ctx.stroke();
        }
    });
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
    ['ens1', 'ens2', 'ens3', 'ens4', 'ens5'].map(e => {
        var elem = document.getElementById(e);
        elem.innerHTML = '';
    });
    for(var i in B.X){
        addToEns('ens1', addAlpha, modifyAlpha, removeAlpha, B.X[i], true);
        addAlpha(B.X[i]);
    }

    for(var i in B.S){
        addToEns('ens2', addEtat, modifyEtat, removeEtat, B.S[i], true);
        addEtat(B.S[i]);
    }

    for(var i in B.S0){
        addToEns('ens3', addEtatInit, modifyEtatInit, removeEtatInit, B.S0[i], true);
        addEtatInit(B.S0[i]);
    }

    for(var i in B.F){
        addToEns('ens4', addEtatFinal, modifyEtatFinal, removeEtatFinal, B.F[i], true);
        addEtatFinal(B.F[i]);
    }

    for(var i in B.II) {
        addIToEns('ens5', addInstruction, modifyInstruction, removeInstruction, B.II[i], true);
        addInstruction(B.II[i]);
    }
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
