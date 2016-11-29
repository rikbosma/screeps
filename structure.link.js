/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('structure.link');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    execute: function(){
         for(roomName in Game.rooms) {
            var room = Game.rooms[roomName];
            var sender = Game.getObjectById(room.memory.links["sender"]);
            if(sender != undefined && sender.cooldown === 0 && sender.energy > sender.energyCapacity * 0.8){
                var controllerReciever = Game.getObjectById(room.memory.links["controller"]);
                var reciever = controllerReciever;
                if(sendEnergy(sender, reciever)){
                    var recievers = room.memory.links["recievers"];
                    for(var i = 0; i < Object.keys(recievers).length; i++){
                        reciever = Game.getObjectById(recievers[i]);
                        if(sendEnergy(sender, reciever)){
                            break;
                        }
                    }
                }
            }
         }
    }
};

function sendEnergy(sender, reciever, force){
    if(reciever.energy < reciever.energyCapacity * 0.5){
        sender.transferEnergy(reciever, Math.min(reciever.energyCapacity - reciever.energy, sender.energy));
        return true;
    }
    return false;
}