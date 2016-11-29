var bodyParts = {
    "work": 100,
    "move": 50,
    "carry": 50,
    "attack": 80,
    "ranged_attack": 150,
    "heal": 250,
    "claim": 600,
    "tough": 10
}

module.exports = {
    getBodyPartCost: function(type)
    {
        return bodyParts[type];
    }
};

//var bodyParts = {WORK: 100,MOVE: 50,CARRY: 50,ATTACK: 80,RANGED_ATTACK: 150,HEAL: 250,CLAIM: 600,TOUGH: 10}; console.log(bodyParts["work"]);