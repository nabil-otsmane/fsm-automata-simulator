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
        this.setEtatInit(S0);
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

    setEtatsFinaux(F) {
        for(var s in F) {
            if(!this.S.includes(F[s]))
                throw "l'etat final "+ F[s]+" n'est pas dans l'ensemble des etats.";
        }
        this.F = F;
    }

    ajouterEtatFinal(f) {
        if(!this.S.includes(f))
            throw "l'etat " + s + " n'est pas dans l'ensemble des etats.";

        this.F.push(f);
    }

    setInstructions(II) {
        for(var i in II)
        {
            if(!Array.isArray(II[i]) || II[i].length != 3)
                throw "l'element " + II[i] + " n'est pas reconnu comme instruction";
            if(!this.S.includes(II[i][0]) || !this.S.includes(II[i][2]))
                throw "un etat de l'instruction n'est pas dans l'ensemble des etats.";
            if(!this.X.includes(II[i][1]))
                throw II[i][1] + " n'est pas dans l'alphabet.";
        }

        this.II = II;
        // filling the transition table
        this.transitionTable = {};
        for(var i in II) {
            var s1 = II[i][0];
            var x = II[i][1];
            var s2 = II[i][2];
            this.transitionTable[s1] = this.transitionTable[s1] || {};
            if (this.transitionTable[s1][x])
                this.transitionTable[s1][x].push(s2);
            else 
                this.transitionTable[s1][x] = [s2];
        }
    }

    ajouterInstruction(s1, x, s2) {
        if(!this.S.includes(s1))
            throw "l'etat " + s1 + " n'est pas dans l'ensemble des etats.";
        if(!this.S.includes(s2))
            throw "l'etat " + s2 + " n'est pas dans l'ensemble des etats.";
        if(!this.X.includes(x))
            throw "l'alphabet " + x + " n'est pas dans l'ensemble X.";

        this.II.push([s1, x, s2]);
        // updating transition table
        this.transitionTable[s1] = this.transitionTable[s1] || {};
        if (this.transitionTable[s1][x])
            this.transitionTable[s1][x].push(s2);
        else 
            this.transitionTable[s1][x] = [s2];
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
            var filter = this.II.filter(x => x[2] === s);
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
            var filter = this.II.filter(x => x[0] === s);
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

    AutomateReduit() {
        var A = new Automate(this.X, this.S, this.S0, this.F, this.II);
        for(var s in A.S){
            if(!A.isAccessible(A.S[s]) || !A.isCoaccessible(A.S[s]))
                A.supprimerEtat(A.S[s]);
        }
        return A;
    }
}