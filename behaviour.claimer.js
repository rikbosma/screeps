/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('behaviour.claimer');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run: function(creep) {
        if(creep.room.name !== creep.memory.targetRoom){
            creep.moveTo(creep.pos.findClosestByRange(creep.room.findExitTo(creep.memory.targetRoom)));
        }
        else{
            if(creep.claimController(creep.room.controller) !== OK){
                creep.moveTo(creep.room.controller);
            }            
        }
    }
};