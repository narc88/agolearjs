var ZoneModel = require('../models/zone').ZoneModel;
var ImageModel 	= require('../models/image').ImageModel;

var mongoose = require('mongoose');

module.exports = function(app){


	// RESTful routes
	app.get('/api/zones', function(req, res, next){
		ZoneModel.find().exec( function(err, zones){
			if (err) throw err;
			res.send(zones);
		});
	});

	app.get('/api/zones/:id', function(req, res, next){
		ZoneModel.findOne({ _id: req.params.id }).exec( function(err, zone){
			if (err) throw err;
			res.send(zone);
		});
	});

	app.post('/api/zones', function(req, res){
		var zone = new ZoneModel(req.body.zone);
		zone.save(function(err){
			if(err) throw err;
			req.send(zone);
		});
	});

	app.put('/api/zones/:id', function(req, res, next){
		ZoneModel.findOne({ _id: req.params.id }).exec( function(err, zone){
			if (err) throw err;
			if(zone){
				zone.name = req.body.zone.name;
				zone.modified = new Date();
				zone.save(function(err){
					if (err) throw err;
					res.send(zone);
				});
			}
		});
	});

	app.delete('/api/zones/:id', function(req, res, next){
		ZoneModel.remove({ _id: req.params.id }).exec( function(err, zone){
			if (err) {
				res.send(err)
			} 
			res.send(true);
		});
	});
	//End of RESTful routes

	//Routes for embedded elements
	app.post('/api/zones/:id/participations', function(req, res){
		var participation = new ParticipationModel(req.body.participation);
		var callback = function(err, numAffected, status){
			if(err) throw err;
			req.send(goal);
		}
		ZoneModel.update(
		    { _id: req.params.id}, 
		    {$push: {"participations": participation}, callback}
		)
	});

	app.post('/api/zones/:id/participations/replace', function(req, res){
		//Reemplaza un equipo con otro entre los participantes
		var participation = new ParticipationModel(req.body.participation);
		var callback = function(err, numAffected, status){
			if(err) throw err;
			req.send(goal);
		}
		ZoneModel.update(
		    { _id: req.params.id}, 
		    {$push: {"participations": participation}, 
			    function(err, numAffected, status){
			    	 ZoneModel.update(
					    { "participations._id": req.body.replaced_id}, 
					    {$pull: {"participations" :{_id : req.params.id }}, callback}
					)
			    }
			}
		)
	});

	app.delete('/api/zones/participations/:id', function(req, res, next){
		var callback = function(err, numAffected, status){
			if(err) throw err;
			req.send(goal);
		}
		ZoneModel.update(
		    { "participations._id": req.params.id}, 
		    {$pull: {"participations" :{_id : req.params.id }}, callback}
		)
	});

	//Create matchdays (tournament structure)
	app.post('/api/zones/:id/create_fixture', function(req, res){
		//Reemplaza un equipo con otro entre los participantes
		ZoneModel.findById(req.params.id).exec( function(err, zone){
			if (err) throw err;
			
		
		
			var participants = [];
			for (var i = zone.participants.length - 1; i >= 0; i--) {
			 	participants.push(zone.participants[i]._id);
			}; 
			if(participants.length%2 != 0){
				//participants.push("0");
			}
			var num_matchdays = participants.length - 1;
	    	var num_matches = participants.length / 2 - 1;

	    	for (var i = num_matchdays; i > 0; i--) {
	    		Things[i]
	    	};
	    	MatchdayModel.createMatchdayWithMatches(participants);
	    	var matchday = new MatchdayModel(req.body.matchday);
			matchday.save(function(err){
				if(err) throw err;
				for j in (0..num_matches)
			        var match = new MatchModel();
			        match.visitor_team = participants[num_matchdays - j]
			        match.local_team = participants[j]
			        match.matchday = matchday._id
			        match.save  
			    end
			});
		});
	});
	//Rails Function
	/*#Por si son impares
	  set_zone
	  participants = Array.new()
	  @zone.teams.each{|x| participants << x.id }
	  if participants.length % 2 == 1
	   participants << 0
	  end
	    matchdays_home = []
	   # matchdays_away = []
	    num_matchdays = participants.length - 1
	    num_matches = participants.length / 2 - 1
	  
	    for i in (1..num_matchdays)
	      @matchday = Matchday.new()
	      @matchday.dispute_day = Date.today
	      @matchday.matchday_number = i
	      @matchday.zone_id = @zone.id
	      @matchday.save
	      
	      matches_home = []
	    #  matches_away = []
	      for j in (0..num_matches)
	      #  matches_home << [participants[j], participants[num_matchdays - j + 1]] #Home match
	        #Crear partido.
	        @match = Match.new()
	        @match.visitor_team_id = participants[num_matchdays - j]
	        @match.local_team_id = participants[j]
	        @match.matchday_id = @matchday.id
	        @match.save 
	        # matches_away << [participants[num_matchdays - j + 1], participants[j]] #Away match 
	      end
	      matchdays_home << matches_home
	      #matchdays_away << matches_away
	      #rotating the teams
	      last = participants.pop 
	      participants.insert(1, last)
	    end
	    @participants = participants
	   # matchdays_away.each { |x| matchdays_home << x}
	    
	 */

}
