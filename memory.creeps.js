module.exports = {
    execute: function(){
        cleanCreeps();
        countCreeps();
    }
};

function cleanCreeps() {
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}

function countCreeps() {
    for(var roomName in Game.rooms){
        var room = Game.rooms[roomName];
        room.memory.creeps = {harvester: 0, carrier: 0, upgrader: 0, builder: 0, provider:0, looter: 0, colonist: 0, prospector: 0};
    }
    for(var name in Memory.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.behaviour == 'colonist')
        {
            var room = Game.rooms[creep.memory.targetRoom];
            room.memory.creeps[creep.memory.behaviour]++;
        }
        else if (creep.memory.behaviour == 'prospector') {
            var room = Game.rooms[creep.memory.homeRoom];
            room.memory.creeps[creep.memory.behaviour]++;
        }
        else{
            creep.room.memory.creeps[creep.memory.behaviour]++;
        }
    }
}