/**
 * @class l'automate d'etat finie
 * 
 */
class Automate {
    /**
     * @constructor
     * 
     * @param {[string]} X est un ensemble de caracteres designant l'alphabet
     * @param {[string]} S est un ensemble de chaine de caracteres (ensemble des etats)
     * @param {string} S0 est l'ensemble des etats initiaux
     * @param {[string]} F est l'ensemble des etats finaux
     * @param {[any]} II est un ensemble des triplets (s1, x, s2)
     */
    constructor(X, S, S0, F, II) {
        this.setAlphabet(X);
        this.setEtats(S);
        this.setEtatsInit(S0);
        this.setEtatsFinaux(F);
        this.setInstructions(II);
    }

    setAlphabet(X) {
        for(var x in X){
            if(typeof X[x] != "string")
                throw `${X[x]} has to be a string.`;
            if(X[x].length != 1)
                throw `${X[x]} is not a single caractere.`;
        }
        this.X = X;
    }

    ajouterAlpha(x) {
        if(typeof x != "string")
            throw `${x} has to be a string.`;
        if(x.length != 1)
            throw `${x} is not a single caractere.`;
        if(this.X.includes(x))
            throw "charactere " + x + " already exists in alphabet";
        
        this.X.push(x);
    }

    modifierAlpha(x, y) {
        if(this.X.includes(y))
            throw `charactere ${y} already in X.`;
        var id = this.X.indexOf(x);
        if(id === -1)
            throw x + " is not in the alphabet";

        this.X[id] = y;
    }

    supprimerAlpha(x) {
        this.X = this.X.filter(e => e !== x);
    }

    setEtats(S) {
        this.S = S;
    }

    ajouterEtat(s) {
        if(this.S.includes(s))
            throw "l'etat " + s + " existe deja dans S.";
        this.S.push(s);
    }

    supprimerEtat(s) {
        if(!this.S.includes(s))
            throw "l'etat " + s + " n'existe pas dans S.";
        this.S = this.S.filter(x => x !== s);
        this.F = this.F.filter(x => x !== s);
        this.S0 = this.S0.filter(x => x !== s);
        this.II = this.II.filter(x => x[0] !== s && x[2] !== s);
        delete this.transitionTable[s];
        for(var i in this.transitionTable) {
            for(var x in this.transitionTable[i])
            {
                this.transitionTable[i][x] = this.transitionTable[i][x].filter(x => x !== s);
            }
        }
    }

    setEtatsInit(S0) {
        for(var i in S0)
            if(!this.S.includes(S0[i]))
                throw "l'etat initial "+ S0[i] +" n'est pas dans l'ensemble des etats.";
        this.S0 = S0;
    }

    ajouterEtatInit(s0) {
        if(!this.S.includes(s0))
            throw `etat ${s0} not in S.`;
        if(this.S0.includes(s0))
            throw `etat ${s0} already in S0.`;

        this.S0.push(s0);
    }

    modifierEtatInit(s0, s1) {
        if(this.S0.includes(s1))
            throw `etat ${s1} already in S0.`;
        var id = this.S0.indexOf(s0);
        if(id === -1)
            throw `etat ${s0} not in S0.`;

        this.S0[id] = s1;
    }

    supprimerEtatInit(s0) {
        var id = this.S0.indexOf(s0);
        if(id === -1)
            throw `etat ${s0} not in S0.`;
        
        this.S0.splice(id, 1);
    }

    setEtatsFinaux(F) {
        for(var s in F) {
            if(!this.S.includes(F[s]))
                throw "l'etat final "+ F[s]+" n'est pas dans l'ensemble des etats.";
        }
        this.F = F;
    }

    ajouterEtatFinal(s0) {
        if(!this.S.includes(s0))
            throw `etat ${s0} not in S.`;
        if(this.F.includes(s0))
            throw `etat ${s0} already in S0.`;

        this.F.push(s0);
    }

    modifierEtatFinal(s0, s1) {
        if(this.F.includes(s1))
            throw `etat ${s1} already in S0.`;
        var id = this.F.indexOf(s0);
        if(id === -1)
            throw `etat ${s0} not in S0.`;

        this.F[id] = s1;
    }

    supprimerEtatFinal(s0) {
        var id = this.F.indexOf(s0);
        if(id === -1)
            throw `etat ${s0} not in S0.`;
        
        this.F.splice(id, 1);
    }

    setInstructions(II) {
        this.II = [];
        // filling the transition table
        this.transitionTable = {};
        for(var i in II)
        {
            if(!Array.isArray(II[i]) || II[i].length != 3)
                throw "l'element " + II[i] + " n'est pas reconnu comme instruction";
            
            this.ajouterInstruction(...II[i]);
        }
    }

    ajouterInstruction(s1, x, s2) {
        if(!this.S.includes(s1))
            throw "l'etat " + s1 + " n'est pas dans S.";
        if(!this.S.includes(s2))
            throw "l'etat " + s2 + " n'est pas dans S.";
        if(!this.X.includes(x))
            throw "l'alphabet " + x + " n'est pas dans X.";
        if(this.II.find(e => e[0] === s1 && e[1] === x && e[2] === s2))
            throw `l'instruction (${s1}, ${x}, ${s2}) already in II.`;

        this.II.push([s1, x, s2]);
        // updating transition table
        this.transitionTable[s1] = this.transitionTable[s1] || {};
        if (this.transitionTable[s1][x])
            this.transitionTable[s1][x].push(s2);
        else 
            this.transitionTable[s1][x] = [s2];
    }

    supprimerInstruction(s1, x, s2) {
        var id = this.II.findIndex(e => e[0] === s1 && e[1] === x && e[2] === s2)
        if(id === -1)
            throw "can't find instruction to delete";

        this.transitionTable[s1][x] = this.transitionTable[s1][x].filter(e => e !== s2);
        this.II.splice(id, 1);
    }

    /**
     * voir si l'automate est deterministe ou pas
     * @returns {boolean} true ou false selon l'automate est deterministe ou pas (respectivement)
     *
     */
    isDeterministe() {
        if(this.S0.length > 1)
            return false;
        for(var i in this.transitionTable){
            for(var x in this.X) {
                if(this.transitionTable[i][this.X[x]] && this.transitionTable[i][this.X[x]].length > 1)
                    return false;
            }
        }
        return true;
    }

    isAccessible(s) {
        var tmp = arguments.length === 2 && arguments[1];
        if(this.S0.includes(s))
            return true;
        else  // watch for infinite loops
        {
            var filter = this.II.filter(x => x[2] === s && x[0] !== s);
            for(var i in filter)
            {

                if(tmp && tmp === filter[i][0])
                    continue;
                if(this.isAccessible(filter[i][0], tmp || s))
                    return true
            }
        }
        return false;
    }

    isCoaccessible(s) {
        var tmp = arguments.length === 2 && arguments[1];
        if(this.F.includes(s))
            return true;
        else {
            var filter = this.II.filter(x => x[0] === s && x[2] !== s);
            for(var i in filter)
            {
                if(tmp && tmp === filter[i][2])
                    continue;
                if(this.isCoaccessible(filter[i][2], tmp || s))
                    return true;
            }
        }
        return false;
    }

    reconnaissance(w) {
        if(!this.isDeterministe())
            throw "this Automate has to be deterministe to do this. (for now)";
        if(typeof w !== 'string')
            throw "word must be a string";
        if(w === "" && this.F.includes(this.S0[0]))
            return true;

        var curS = this.S0[0];
        for(var i in w) {
            var next = this.II.find(x => x[0] === curS && x[1] === w[i]);
            if(!next)
                return false;
            curS = next[2];
        }
        if(!this.F.includes(curS))
            return false;
        return true;
    }

    AutomateReduit() {
        var A = new Automate(this.X, this.S, this.S0, this.F, this.II);
        var S = A.S;
        for(var s in S){
            if(!A.isAccessible(S[s]) || !A.isCoaccessible(S[s]))
                A.supprimerEtat(S[s]);
        }
        return A;
    }

    AutomateMiroir() {
        var A = new Automate(this.X, this.S, this.S0, this.F, this.II);
        // on permute les instructions
        /* il faut changer aussi la table */
        for(var i in A.II){
            var tmp = A.II[i][0];
            A.II[i][0] = A.II[i][2];
            A.II[i][2] = tmp;
        }
        // on permute entre les etats finaux et les etats initiaux
        var tmp = A.F;
        A.setEtatsFinaux(A.S0);
        A.setEtatsInit(tmp);

        return A;
    }

    AutomateDeterministe() {
        var A = new Automate(this.X, this.S, this.S0, this.F, this.II);
        
        if(A.isDeterministe()) // il est deja deterministe
            return A;
        
        A.setInstructions([]);
        for(var k in this.transitionTable) {
            for(var j in this.transitionTable[k]){
                var s2 = this.transitionTable[k][j];
                if(s2.length == 1)
                    A.ajouterInstruction(k, j, s2);
                if(s2.length > 1){
                    var s = s2.join('-');
                    A.ajouterEtat(s);
                    A.ajouterInstruction(k, j, s);
                }
            }
        }  // TODO: to be completed

        return A;
    }

    isComplet() {
        for(var s in this.S){
            for(var x in this.X) {
                if(!this.II.find(e => e[0] === this.S[s] && e[1] === this.X[x]))
                    return false;
            }
        }
        return true;
    }

    AutomateComplet() {
        if(this.isComplet())
            return this;

        var A = new Automate(this.X, this.S, this.S0, this.F, this.II);
        A.ajouterEtat('Sp');
        for(var x in A.X) {
            A.ajouterInstruction('Sp', A.X[x], 'Sp');
            for(var s in A.S)
                if(!A.II.find(e => e[0] === A.S[s] && e[1] === A.X[x]))
                    A.ajouterInstruction(A.S[s], A.X[x], 'Sp');    
        }
        return A;
    }

    AutomateComplement() {
        var A = new Automate(this.X, this.S, this.S0, this.F, this.II);
        if(!A.isDeterministe())
            A = A.AutomateDeterministe();
        if(!A.isComplet())
            A = A.AutomateComplet();
        
        A.setEtatsFinaux(A.S.filter(x => !A.F.includes(x)));

        return A;
    }

}