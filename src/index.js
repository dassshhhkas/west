import Card from './Card.js';
import Game from './Game.js';
import TaskQueue from './TaskQueue.js';
import SpeedRate from './SpeedRate.js';

//Класс Утка
export class Duck extends Card {
    constructor(name = 'Мирная утка', power = 2) {
        super(name, power);
    }

    quacks() {
        console.log('quack');
    }

    swims() {
        console.log('float: both;');
    }
}

export class Gatling extends Creature {
    constructor(name = 'Гатлинг', power = 6) {
        super(name, power);
    }

    attack(gameContext, continuation){
        const taskQueue = new TaskQueue();
        const { oppositePlayer, position } = gameContext;
        taskQueue.push(onDone => this.view.showAttack(onDone));

        for (let i = 0; i < oppositePlayer.table.length; i++) {
            const targetCard = oppositePlayer.table[i];
            
            if (!targetCard) continue;

            taskQueue.push(onDone => {
                this.dealDamageToCreature(2, targetCard, gameContext, onDone);
            });
        }

        taskQueue.continueWith(continuation);
    }
    
    dealDamageToPlayer(value, gameContext, continuation) {
        continuation();
    }
}

//Класс Собака
export class Dog extends Card {
    constructor(name = 'Пес-бандит', power = 3) {
        super(name, power);
    }

}

//Класс Громила 
export class Trasher extends Dog {
    constructor() {
        super('Громила', 5);
    }

    modifyTakenDamage(value, fromCard, gameContext, continuation) {
        const reducedDamage = Math.max(value - 1, 0);
        
        if (reducedDamage < value) {
            this.view.signalAbility(() => {
                continuation(reducedDamage);
            });
        } else {
            continuation(reducedDamage);
        }
    }

    getDescriptions() {
        return [...super.getDescriptions(), 'Получает на 1 меньше урона'];
    }
}

// Класс Браток
export class Lad extends Dog {
    constructor(name = 'Браток', power = 2) {
        super(name, power);
    }

    static getInGameCount() {
        return this.inGameCount || 0;
    }

    static setInGameCount(value) {
        this.inGameCount = value;
    }

    static getBonus() {
        const count = this.getInGameCount();
        return count * (count + 1) / 2;
    }

    doAfterComingIntoPlay(gameContext, continuation) {
        Lad.setInGameCount(Lad.getInGameCount() + 1);
        super.doAfterComingIntoPlay(gameContext, continuation);
    }

    doBeforeRemoving(continuation) {
        Lad.setInGameCount(Lad.getInGameCount() - 1);
        super.doBeforeRemoving(continuation);
    }

    modifyDealedDamageToCreature(value, toCard, gameContext, continuation) {
        const bonus = Lad.getBonus();
        continuation(value + bonus);
    }

    modifyTakenDamage(value, fromCard, gameContext, continuation) {
        const bonus = Lad.getBonus();
        const reduced = Math.max(value - bonus, 0);
        continuation(reduced);
    }

    getDescriptions() {
        const baseDescriptions = super.getDescriptions();
        

        if (Lad.prototype.hasOwnProperty('modifyDealedDamageToCreature') || 
            Lad.prototype.hasOwnProperty('modifyTakenDamage')) {
            return [...baseDescriptions, 'Чем их больше, тем они сильнее'];
        }
        
        return baseDescriptions;
    }
}

// Проверка типа 
function isDuck(card) {
    return card instanceof Duck;
}

function isDog(card) {
    return card instanceof Dog;
}

export // Описание существа
function getCreatureDescription(card) {
    if (isDuck(card) && isDog(card)) {
        return 'Утка-Собака';
    }
    if (isDuck(card)) {
        return 'Утка';
    }
    if (isDog(card)) {
        return 'Собака';
    }
    return 'Существо';
}

const seriffStartDeck = [
    new Duck(),
    new Duck(),
    new Gatling(),
];
const banditStartDeck = [
    new Trasher(),  
];

// Создание игры.
const game = new Game(seriffStartDeck, banditStartDeck);

// Управление скоростью анимаций.
SpeedRate.set(1);

// Запуск игры.
game.play(false, (winner) => {
    alert('Победил ' + winner.name);
});