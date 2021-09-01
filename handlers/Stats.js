export default class Stats {
    constructor (name, str, dex, int, inv) {
        this.name = name;
        this.strength = +str;
        this.dexterity = +dex;
        this.intellect = +int;
        this.isInvincible = inv === "true";
    }    
}

