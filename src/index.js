import Card from './Card.js';
import Game from './Game.js';
import TaskQueue from './TaskQueue.js';
import SpeedRate from './SpeedRate.js';
import Creature from './Creature.js';


// Класс Утка
export class Duck extends Creature {
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

// Класс Собака
export class Dog extends Creature {
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

function isDuck(card) {
    return card instanceof Duck;
}

function isDog(card) {
    return card instanceof Dog;
}

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

// 🃏 Колоды для проверки 
const seriffStartDeck = [
    new Duck(),
    new Duck(),
    new Duck(),
    new Duck(),
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