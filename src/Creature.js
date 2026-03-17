import Card from './Card.js';
import { getCreatureDescription } from './index.js';

export default class Creature extends Card{
    constructor(name, maxPower, image) {
        super(name, maxPower, image);
        this._currentPower = maxPower;
    }

    get currentPower() {
        return this._currentPower;
    }

    set currentPower(value) {
        this._currentPower = Math.min(value, this.maxPower);
        this.updateView();
    }
    
    getDescriptions(){
        const parentDescriptions = super.getDescriptions();
        return [getCreatureDescription(this), ...parentDescriptions];
    }
}
