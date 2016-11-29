var harvester = require("behaviour.harvester");
var upgrader = require("behaviour.upgrader");
var builder = require("behaviour.builder");
var looter = require("behaviour.looter");
var carrier = require("behaviour.carrier");
var provider = require("behaviour.provider");
var claimer = require("behaviour.claimer");
var prospectorcolonist = require("behaviour.colonist");
var prospector = require("behaviour.prospector");

module.exports = {
    execute: function(){
        updateCreeps();
    }
};

function updateCreeps() {
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.behaviour === 'harvester')
        {
            harvester.run(creep);
        }
        else if(creep.memory.behaviour === 'builder')
        {
            builder.run(creep);
        }
        else if(creep.memory.behaviour === 'upgrader')
        {
            upgrader.run(creep);
        }
        else if(creep.memory.behaviour === 'carrier')
        {
            carrier.run(creep);
        }
        else if(creep.memory.behaviour === 'looter')
        {
            looter.run(creep);
        }
        else if(creep.memory.behaviour === 'provider')
        {
            provider.run(creep);
        }
        else if(creep.memory.behaviour === 'claimer'){
            claimer.run(creep);
        }
        else if(creep.memory.behaviour === 'colonist'){
            colonist.run(creep);
        }
        else if (creep.memory.behaviour === 'prospector') {
            prospector.run(creep);
        }
    }
}