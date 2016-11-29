var utilCosts = require('util.costs');
var enums = require('enums');

module.exports = {
    execute: function () {
        for (var i = 0; i < Object.keys(Memory.spawns).length; i++) {
            var spawn = Game.spawns[Object.keys(Memory.spawns)[i]];
            if (spawn.spawning === null) { //If not spawning
                var room = spawn.room;
                if (room.energyAvailable === room.energyCapacityAvailable || room.energyAvailable >= 300) //and enough energy available
                {
                    if (executeHarvesterPolicy(room, spawn)) { continue; }
                    else if (executeCarrierPolicy(room, spawn)) { continue; }
                    else if (executeUpgraderPolicy(room, spawn)) { continue; }
                    else if (executeProviderPolicy(room, spawn)) { continue; }
                    else if (executeBuilderPolicy(room, spawn)) { continue; }
                    else if (executeLooterPolicy(room, spawn)) { continue; }
                    else if (executeColonistPolicy(room, spawn)) { continue; }
                    else if (executeProspectorPolicy(room, spawn)) { continue; }
                }
            }
        }
    }
};

//Game.spawns["Spawn1"].createCreep([CLAIM, MOVE, MOVE, MOVE, MOVE, MOVE], undefined, {behaviour: 'claimer', targetRoom: "W3N7"});

function executeHarvesterPolicy(room, spawn) {
    for (var i = 0; i < room.memory.sources.length; i++) {
        var id = room.memory.sources[i].id;
        var spots = room.memory.sources[i].spots;
        var harvesters = room.memory.sources[i].harvesters;

        //Check if full with harvesters
        for (var j = 0; j < spots; j++) {
            if(j > 2) { break; } //Max 3 harvesters per spot in current form else waste
            //Exits?
            if (_.isEmpty(harvesters[j]) || harvesters[j] === null) {
                if (room.energyAvailable !== room.energyCapacityAvailable) {
                    return true;
                }
                console.log("Free spot detected");
                harvesters[j] = spawnHarvester(id);
                return true;
            }
            //Alive?
            if (Game.creeps[harvesters[j]] === undefined) //DOUBLE? ^move up
            {
                console.log("Dead harvester detected");
                harvesters[j] = spawnHarvester(id);
                return true;
            }
        }
    }
    return false;

    function spawnHarvester(sourceId) {
        var originalBody = [WORK, WORK, CARRY, MOVE];
        var body = originalBody;
        if (room.energyAvailable > 300) {
            body = createBody(originalBody, room.energyAvailable, [{ part: CARRY, count: 1 }, { part: MOVE, count: 1 }], 400);
        }
        return spawnCreep(spawn, body, undefined, { behaviour: 'harvester', source: sourceId, requireTransport: true });
    }
}

function executeCarrierPolicy(room, spawn) {
    var carriersMax = 2;
    if (room.memory.containers !== undefined && room.memory.containers["totalTransportDistance"] !== undefined) {
        carriersMax = Math.ceil(room.memory.containers["totalTransportDistance"] / 33);
    }
    var carriers = room.memory.creeps.carrier;
    if (carriers < carriersMax && room.energyAvailable >= 300) {
        var originalBody = [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
        var body = originalBody;
        if (room.energyAvailable > 300) {
            body = createBody(originalBody, room.energyAvailable, [{ part: CARRY, count: 2 }, { part: MOVE, count: 1 }], 550);
        }
        var newName = spawnCreep(spawn, body, undefined, { behaviour: 'carrier', unloading: false });
        return true;
    }
    return false;
}

function executeUpgraderPolicy(room, spawn) {
    var upgradersMax = 2;
    if(room.storage != undefined){
        upgradersMax += Math.floor(_.sum(room.storage.store) / 100000);
    } 
    else{
        upgradersMax = 4;
    }
    var upgraders = room.memory.creeps.upgrader;
    if (upgraders < upgradersMax && room.energyAvailable >= 300) {
        var originalBody = [MOVE, WORK, WORK, CARRY];
        var body = originalBody;
        if (room.energyAvailable > 300) {//TEMP: W2 C1 is policy, but for now this.. waiting for the carrier
            body = createBody(originalBody, room.energyAvailable, [{ part: WORK, count: 2 }, { part: CARRY, count: 1 }], 800);
        }
        var newName = spawnCreep(spawn, body, undefined, { behaviour: 'upgrader', unloading: false});
        return true;
    }
    return false;
}

function executeProviderPolicy(room, spawn) {
    var providersMax = 1;
    if(room.storage == undefined){
        providersMax = 3;
    }
    var providers = room.memory.creeps.provider;
    if(providers < providersMax && room.energyAvailable >= 300) {
        var originalBody = [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
        var body = originalBody;
        if (room.energyAvailable > 300) {
            body = createBody(originalBody, room.energyAvailable, [{ part: CARRY, count: 2 }, { part: MOVE, count: 1 }], 700);
        }
        var newName = spawnCreep(spawn, body, undefined, { behaviour: 'provider', unloading: false });
        return true;
    }
    return false;
}

function executeBuilderPolicy(room, spawn) {
    var buildersMax = 2;
    if(room.controller.level < 3){
        buildersMax = 4;
    }
    var builders = room.memory.creeps.builder;
    if (builders < buildersMax && room.energyAvailable >= 300) {
        var originalBody = [MOVE, MOVE, CARRY, CARRY, WORK];
        var body = originalBody;
        if (room.energyAvailable > 300) {//TEMP: W1 C1 is policy, but for now this.. waiting for the carrier
            body = createBody(originalBody, room.energyAvailable, [{ part: CARRY, count: 2 }, { part: WORK, count: 1 }, { part: MOVE, count: 1 }], 550);
        }
        var newName = spawnCreep(spawn, body, undefined, { behaviour: 'builder' });
        return true;
    }
    return false;
}

function executeLooterPolicy(room, spawn) {
    var lootersMax = 1;
    var looters = room.memory.creeps.looter;
    if (looters < lootersMax && room.energyAvailable >= 300) {
        var body = [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
        var newName = spawnCreep(spawn, body, undefined, { behaviour: 'looter', looting: true });
        return true;
    }
    return false;
}

function executeColonistPolicy(room, spawn){
    for(roomName in Game.rooms){ 
        var otherRoom = Game.rooms[roomName]; 
        if(otherRoom.controller.my && otherRoom.energyCapacityAvailable === 0) { 
            var colonistsMax = 6;
            var colonists = otherRoom.memory.creeps.colonist;
            if(colonists < colonistsMax && room.energyAvailable >= 750) {
                var body = [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
                var newName = spawnCreep(spawn, body, undefined, { behaviour: 'colonist', targetRoom: otherRoom.name });
                return true;
            }
        } 
    }
    return false;
}

function executeProspectorPolicy(room, spawn) {
    var prospectorMax = 1;
    var prospectors = room.memory.creeps.prospector;
    if (prospectors < prospectorMax && room.energyAvailable >= 300) {
        for (var areaName in room.memory.mining.areas) {
            var area = room.memory.mining.areas[areaName];
            if (area.state == enums.miningState.UNEXPLORED) {
                console.log("Spawn a prospector to research room " + area.name);
                var body = [MOVE, MOVE, MOVE, MOVE, MOVE];
                spawnCreep(spawn, body, undefined, { behaviour: 'prospector', homeRoom: room.name, targetRoom: area.name });
                return true;
            }
        }
    }
    return false;
}

/** @param {Spawn} spawn **/
/** @param {Array} body **/
/** @param {String} name **/
/** @param {String} memory **/
    function spawnCreep(spawn, body, name, memory) {
    var newName = spawn.createCreep(body, name, memory);
    console.log('Spawning new ' + Game.creeps[newName].memory.behaviour + ': ' + newName);
    return newName;
}

function createBody(originalBody, availableEnergy, upgradePolicy, maxEnergy) {
    console.log("createBody:");
    var energy = Math.min(availableEnergy, maxEnergy);
    var extraEnergy = energy - 300; //console.log("extraEnergy: " + extraEnergy);
    var extraBodyParts = []; //console.log("extraBodyParts: " + JSON.stringify(extraBodyParts));
    var smallestEnergyNeed = 600; //console.log("smallestEnergyNeed: " + smallestEnergyNeed);
    var body = originalBody; //console.log("body: " + JSON.stringify(body));
    var totalBodyCost = 300;
    do {
        for (var i = 0; i < upgradePolicy.length; i++) {
            //Get stats
            var bodyPart = upgradePolicy[i].part; //console.log("bodyPart: " + JSON.stringify(bodyPart));
            var desiredCount = upgradePolicy[i].count; //console.log("desiredCount: " + desiredCount);
            var bodyPartCost = utilCosts.getBodyPartCost(bodyPart); //console.log("bodyPartCost: " + bodyPartCost);
            if (bodyPartCost < smallestEnergyNeed) {
                smallestEnergyNeed = bodyPartCost;
                //console.log("bodyPartCost < smallestEnergyNeed == true energy: " + smallestEnergyNeed);
            }
            //Add body parts
            var numberOfBodyParts = Math.min(desiredCount, Math.floor(extraEnergy / bodyPartCost));  //console.log("numberOfBodyParts: " + numberOfBodyParts);
            for (var j = 0; j < numberOfBodyParts; j++) {
                body[body.length] = bodyPart; //console.log("body: " + JSON.stringify(body));
                extraEnergy -= bodyPartCost;
                totalBodyCost += bodyPartCost;
            }
        }
    }
    while (extraEnergy >= smallestEnergyNeed);
    console.log("createBody created: " + JSON.stringify(body) + " Total cost: " + totalBodyCost);
    return body;
}

/*
Spawn policy:
- Harvester -> Number of spots around source
- Carrier -> 1 per harvester + balancing upgraders capacity vs carrier capacity 
- Upgrader -> 2 + RCL
- Builder -> 3 + RCL
- Repair -> 1 + structures need repair / 4
- Looter -> 1 per 50 creeps
*/