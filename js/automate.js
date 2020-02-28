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

    setEtatInit(S0) {
        if(!this.S.includes(S0))
            throw "l'etat initial "+ S0 +" n'est pas dans l'ensemble des etats.";
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
    }

    ajouterInstruction(s1, x, s2) {
        if(!this.S.includes(s1))
            throw "l'etat " + s1 + " n'est pas dans l'ensemble des etats.";
        if(!this.S.includes(s2))
            throw "l'etat " + s2 + " n'est pas dans l'ensemble des etats.";
        if(!this.X.includes(x))
            throw "l'alphabet " + x + " n'est pas dans l'ensemble X.";

        this.II.push([s1, x, s2]);
    }
}