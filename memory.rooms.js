var utilSpots = require('util.spots');
var enums = require('enums');

module.exports = {
    execute: function(){
        checkRoomMemory();
        checkSpawnMemory();
        updateContainers();
        updateLinks();
        updateExits();
        updateMiningOperation();
    }
};

function checkRoomMemory()
{
    if(Memory.rooms === undefined)
    {
        Memory.rooms = {};
    }
    var memoryRoomNames = Object.keys(Memory.rooms);
    var gameRoomNames = Object.keys(Game.rooms);
    if(memoryRoomNames.length < gameRoomNames.length)
    {
        var addedRooms = 0;
        for(var i = 0; i < gameRoomNames.length; i++)
        {
            var foundRoom = _.filter(memoryRoomNames, (name) => name == gameRoomNames[i]);
            if(_.isEmpty(foundRoom))
            {
                var room = Game.rooms[gameRoomNames[i]];
                console.log('Adding room to memory: ', room.name);
                Memory.rooms[room.name] = {name: room.name};
                room.memory.sources = utilSpots.getHarvestSpots(room.name);
            }
        }
    }
    for(roomName in Game.rooms)
    {
        var room = Game.rooms[roomName];
        var containersWithEnergy = room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType == STRUCTURE_CONTAINER && 
                    structure.store[RESOURCE_ENERGY] > 0
        });
        room.memory.energy = room.energyAvailable;
        for(var j = 0; j < containersWithEnergy.length; j++){
            var container = containersWithEnergy[j];
            room.memory.energy = room.memory.energy
             + container.store[RESOURCE_ENERGY];
        }
        if(room.memory.sources === undefined){
            room.memory.sources = utilSpots.getHarvestSpots(room.name);
        }
        if(room.memory.maxHitsDefence === undefined){
            room.memory.maxHitsDefence = 10000;
        }
    }
}

function checkSpawnMemory()
{
    if(Memory.spawns === undefined)
    {
        Memory.spawns = {};
    }
    var memorySpawnNames = Object.keys(Memory.spawns);
    var gameSpawnNames = Object.keys(Game.spawns);
    if(memorySpawnNames.length < gameSpawnNames.length)
    {
        var addedSpawns = 0;
        for(var i = 0; i < gameSpawnNames.length; i++)
        {
            var foundSpawn = _.filter(memorySpawnNames, (name) => name == gameSpawnNames[i]);
            if(_.isEmpty(foundSpawn))
            {
                var spawn = Game.spawns[gameSpawnNames[i]];
                console.log('Adding Spawn to memory: ', spawn.name);
                Memory.spawns[spawn.name] = {name: spawn.name};
            }
        }
    }
}

function updateContainers(){
    for(var roomName in Game.rooms){
        var room = Game.rooms[roomName];

        //Add containers to memory for logistic purposes
        if(room.memory.containers == undefined || (room.memory.containers["storage"] !== undefined && Object.keys(room.memory.containers["storage"]).length < 4)){
            room.memory.containers = {};
            var controllerContainer = room.controller.pos.findClosestByRange(FIND_STRUCTURES, { filter: (structure) => structure.structureType == STRUCTURE_CONTAINER });
            if(controllerContainer){
                room.memory.containers["controller"] = controllerContainer.id;
            }
            var containers = room.find(FIND_STRUCTURES, { filter: (structure) => structure.structureType == STRUCTURE_CONTAINER && structure.id !== controllerContainer.id});
            var storage = {};
            for(var i = 0; i < containers.length; i++){
                storage[i] = containers[i].id;
            }
            room.memory.containers["storage"] = storage;      
        }

        //Calculate the total distance between storage containers and storage, to adapt the carrier count required in a room
        if (room.storage !== undefined && room.memory.containers["totalTransportDistance"] == undefined && Object.keys(room.memory.containers["storage"]).length == 4) {
            var totalDistance = 0;
            for (var j = 0; j < Object.keys(room.memory.containers["storage"]).length; j++) {
                var container = Game.getObjectById(room.memory.containers["storage"][j]);
                totalDistance += container.pos.getRangeTo(room.storage);
            }
            room.memory.containers["totalTransportDistance"] = totalDistance;
        }
    }
}

function updateLinks(){
    for(var roomName in Game.rooms){
        var room = Game.rooms[roomName];
        if(room.memory.links == undefined || room.controller.level >= 5 && !(Object.keys(room.memory.links).length === room.controller.level - 3 || Object.keys(room.memory.links) === room.controller.level - 2))
        {
            room.memory.links = {};
            if(room.storage !== undefined){
                var sendingLink = room.storage.pos.findClosestByRange(FIND_STRUCTURES, { filter: (structure) => structure.structureType == STRUCTURE_LINK });
                if (sendingLink) {
                    room.memory.links["sender"] = sendingLink.id;
                }
            }
            if(room.controller !== undefined){
                var controllerLink = room.controller.pos.findClosestByRange(FIND_STRUCTURES, { filter: (structure) => structure.structureType == STRUCTURE_LINK });
                if (controllerLink) {
                    room.memory.links["controller"] = controllerLink.id;
                }
            }
            var links = room.find(FIND_STRUCTURES, { filter: (structure) => structure.structureType == STRUCTURE_LINK && structure.id !== sendingLink.id && structure.id !== controllerLink.id });
            if (links) {
                var recievers = {};
                for (var i = 0; i < links.length; i++) {
                    recievers[i] = links[i].id;
                }
                room.memory.links["recievers"] = recievers;
            }
        }
    }
}

function updateExits() {
    for (var roomName in Game.rooms) {
        var room = Game.rooms[roomName];
    }
}

function updateMiningOperation() {
    for (var roomName in Game.rooms) {
        var room = Game.rooms[roomName];
        if (room.memory.mining == undefined) {
            room.memory.mining = {};
        }
        //Check which neighbor rooms we have and where the exits are
        if (room.memory.mining.areas == undefined) {
            room.memory.mining.areas = {};
            var neighbors = Game.map.describeExits(room.name);
            for (var neighbor in neighbors) {
                //console.log(neighbor);
                var neighborName = neighbors[neighbor];
                var area = {};
                area.name = neighborName;
                area.state = enums.miningState.UNEXPLORED;
                if(neighbor == 1){
                    //Top
                    area.exits = room.find(FIND_EXIT_TOP);
                }
                else if (neighbor == 3) {
                    //Right
                    area.exits = room.find(FIND_EXIT_RIGHT);
                }
                else if (neighbor == 5) {
                    //Bottom
                    area.exits = room.find(FIND_EXIT_BOTTOM);
                }
                else if (neighbor == 7) {
                    //Left
                    area.exits = room.find(FIND_EXIT_LEFT);
                }
                room.memory.mining.areas[neighborName] = area;
            }
        }
        else {
            //When explored and found the room can be used as mining area check out the sources..
            for (var areaName in room.memory.mining.areas) {
                var area = room.memory.mining.areas[areaName];
                if (area.state === enums.miningState.MINABLE && area.sources == undefined) {
                    var spots = utilSpots.getHarvestSpots(area.name);
                    console.log(JSON.stringify(spots));
                    area.sources = spots;
                    area.state = enums.miningState.DIGGING;
                }
            }
        }
    }
}