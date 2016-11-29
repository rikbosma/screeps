var utilCheck = require("util.check");

module.exports = {
    defendRoom: function (defender) {
        return doDefendRoom(defender);
    },
    healCreep: function (defender) {
        return doHealCreep(defender);
    }
};

function doDefendRoom(defender) {
    var hostile = defender.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (hostile) {
        Game.notify("Invader spotted in room " + defender.room.memory.name);
        if(utilCheck.isCreep(defender)){
            if(!defender.attack(hostile) === ERR_NOT_IN_RANGE){
                defender.moveTo(hostile);
            }
        }
        else if(utilCheck.isTower(defender)){
            defender.attack(hostile);
        }
        return true;
    }
    return false;
}

function doHealCreep(defender) {
    var noob = defender.pos.findClosestByRange(FIND_MY_CREEPS, {
        filter: function (creep) {
            return creep.hits < creep.hitsMax;
        }
    });
    if (noob) {
        if (utilCheck.isCreep(defender)) {
            if (!defender.heal(noob) === ERR_NOT_IN_RANGE) {
                defender.moveTo(noob);
            }
        }
        else if (utilCheck.isTower(defender)) {
            defender.heal(noob);
        }
        return true;
    }

}