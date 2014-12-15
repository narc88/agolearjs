var mongoose = require('mongoose');

var ParticipationPlayer = exports.PlayerParticipationSchema = new mongoose.Schema({
    _id     : {type: mongoose.Schema.ObjectId, ref: 'Player' }
  , name      : String
  , last_name      : String
})