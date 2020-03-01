var A = new Automate([],[],[],[],[]); // empty Automate

var nodes, edges, network, nodeIds = [];

function addToEns(id, add, modify, remove) {
    var ens = document.getElementById(id);
    if(!ens)
        throw "IdError: Wrong id '"+id+"' to AddToEns";

    // <input type='text' class='in3' onkeydown='in3' />
    var inp = document.createElement('input');
    inp.type = "text";
    inp.className = "in3";
    inp.onkeydown = in3;
    var p = document.createElement('span');

    if(ens.children.length === 0) { // empty
        ens.appendChild(inp)
    } else {
        p.innerText = ', ';
        ens.append(p);
        ens.appendChild(inp);
    }
    inp.focus();
    var i = -1;
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
            if(i === -1)
                add(this.value);
            else
                modify(i, this.value);
        }
        i = this.value;
    }
}

function addIToEns(id, add, modify, remove) {
    var ens = document.getElementById(id);
    if(!ens)
        throw "IdError: Wrong id '"+id+"' to AddToEns";

    // <span id='inst'>(<input type='text' class='in3' />, <input type='text' />, <input type='text' />)</span>
    var cont = document.createElement('span');
    var virg = document.createElement('span');
    virg.innerHTML = ', ';
    var inp = document.createElement('input');
    var inp2 = document.createElement('input');
    var inp3 = document.createElement('input');
    inp.className = inp2.className = inp3.className = 'in3';
    inp.type = inp2.type = inp3.type = 'text';
    inp.onkeydown = inp2.onkeydown = inp3.onkeydown = in3;

    if(ens.children.length !== 0)
        ens.appendChild(virg);
    
    cont.append('(');
    cont.appendChild(inp);
    cont.append(', ');
    cont.appendChild(inp2);
    cont.append(', ');
    cont.appendChild(inp3);
    cont.append(')');

    ens.appendChild(cont);

    inp.focus();
    var i = -1;
    cont.onblur = function() {
        if(inp.value === "" || inp2.value === '' || inp3.value === ''){
            if(ens.children.item(0) === cont){
                if(ens.childElementCount > 1)
                    ens.removeChild(ens.children.item(1));
            } else {
                ens.removeChild(virg);
            }
            ens.removeChild(cont);

            if(i != -1) { // not the first time
                remove(i);
            }
        } else {
            if(i === -1)
                add([inp.value, inp2.value, inp3.value]);
            else
                modify(i, [inp.value, inp2.value, inp3.value]);
        }
        i = [inp.value, inp2.value, inp3.value];
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

function addInstruction(ins) {
    A.ajouterInstruction(...ins);
    var edge = {
        from: nodeIds.find(x => x.label === ins[0]).id,
        to: nodeIds.find(x => x.label === ins[2]).id,
        label: ins[1]
    };

    edges.add(edge);
}

function removeInstruction(ins) {
    A.supprimerInstruction(...ins);
    var edge = {
        from: nodeIds.find(x => x.label === ins[0]).id,
        to: nodeIds.find(x => x.label === ins[2]).id,
    };
    edges.remove(edge);
}

function modifyInstruction() {

}

function addEtat(etat) {
    var node = {id: nodeIds.length, label: etat};

    nodeIds.push(node);
    A.ajouterEtat(etat);
    nodes.add(node);
}

function modifyEtat(etat0, etat1) {
    A.supprimerEtat(etat0);
    var id = nodeIds.findIndex(x => x.label === etat0);
    
    // modify everything
    nodeIds[id].label = etat1;
    A.ajouterEtat(etat1);
    nodes.update([nodeIds[id]]);
}

function removeEtat(etat) {
    A.supprimerEtat(etat);
    var id = nodeIds.findIndex(x => x.label === etat);
    nodes.remove(nodeIds.splice(id, 1)[0]);
}

function addInstruction(S0, x, S1) {

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
        }
    });
}