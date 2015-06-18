'use strict';

/* Controllers */

/*Router redirects to selected page when a url is targeted by get request*/
function router_controller($scope, $http, $location, $routeParams, $rootScope) {
 //  $location = 'route/to/wherever';
 alert(JSON.stringify($routeParams))
}

/*Main*/
function main($rootScope,$scope, $http) {
 /* $http.get('/api/countries').
    success(function(data, status, headers, config) {
      $scope.countries = data;
      $scope.default_country = data[0];
    });*/
  $rootScope.days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
  $rootScope.locationBeforeImage = '';
  $rootScope.tournament_stats = {};
  $rootScope.menu = {};
  $rootScope.imageTypes = {};
  $rootScope.imageTypes.team = ["completa", "uniforme", "escudo"];
  $rootScope.imageTypes.player = ["cara", "normal"];
  $rootScope.imageTypes.tournament = ["copa", "escudo"];
  $rootScope.imageTypes.match = ["normal"];
  $rootScope.imageTypes.matchday = ["normal"];
  $rootScope.imageTypes.league = ["logo", "normal"];
  $rootScope.imageTypes.field = ["normal"];
  $rootScope.imageTypes.chronicle = ["completa"];
  $rootScope.imageTypes.rule = ["completa"];
  $rootScope.imageTypes.advertising = ["encabezado", "lateral"];

  $http.get('/api/myleague/').
    success(function(data, status, headers, config) {
     $rootScope.league = data;
    });
  

  $scope.datePickerOptions = {
    format: 'yyyy-mm-dd', // ISO formatted date
    onClose: function(e) {
      // do something when the picker closes   
    }
  }

  $rootScope.tournament_types = ['Liga' , 'Liga y Playoff', 'Liga y Liguilla'];
  $rootScope.imageHelper = {};
  $rootScope.imageHelper.getImage = function(images, type){
    if(images.length == 0 ){
      return undefined;
    }
    for (var i = images.length - 1; i >= 0; i--) {
      if(images[i].type === type){
        return images[i];
      }
    };  
  }

  $rootScope.isUndefinedOrNull = function(val) {
    return angular.isUndefined(val) || val === null 
  }
  //Service that responds with the json structure of the main menu
   $http.get('/api/menu').
    success(function(data, status, headers, config) {
      $rootScope.menu.tournaments = data.tournaments;
      for (var i = 0; i < $rootScope.menu.tournaments.length; i++) {
        $rootScope.menu.tournaments[i].zones = $.grep(data.zones, function(e){ return e.tournament == $rootScope.menu.tournaments[i]._id; });

      };
    });

}

/*Users*/
function ResetPassCtrl($scope, $http, $window) {
  $scope.user = {};
  $scope.message = '';
  $scope.submit = function () {
    $http
      .post('/resetPassword', $scope.user)
      .success(function (data, status, headers, config) {
        $scope.message = 'Cambiada';
      })
      .error(function (data, status, headers, config) {
        // Erase the token if the user fails to log in
        // Handle login errors here
        $scope.message = 'Error: Invalid user or password';
      });
  };
};


function users_index($scope, $http) {
  $http.get('/sapi/users').
    success(function(data, status, headers, config) {
      $scope.users = data;
    });
}

function users_add($scope, $http, $location) {
  $scope.form = {};
  $scope.submitUser = function () {
    $http.post('/sapi/users', $scope.form).
      success(function(data) {
        $location.path('/');
      });
  };
}

function users_view($scope, $http, $routeParams) {
  $http.get('/sapi/users/' + $routeParams.id).
    success(function(data) {
      $scope.user = data;
    });
}

function users_edit($scope, $http, $location, $routeParams) {
  $scope.form = {};
  $http.get('/sapi/users/' + $routeParams.id).
    success(function(data) {
      $scope.form = data;
    });

  $scope.editPost = function () {
    $http.put('/sapi/users/' + $routeParams.id, $scope.form).
      success(function(data) {
        $location.url('/users/' + $routeParams.id);
      });
  };
}

function user_delete($scope, $http, $location, $routeParams) {
  $http.get('/sapi/users/' + $routeParams.id).
    success(function(data) {
      $scope.post = data;
    });

  $scope.deleteUser = function () {
    $http.delete('/sapi/users/' + $routeParams.id).
      success(function(data) {
        $location.url('/users');
      });
  };
}


/*Leagues*/
function leagues_index($scope, $http) {
  $http.get('/sapi/leagues').
    success(function(data, status, headers, config) {
      $scope.leagues = data;
    });
}

function leagues_add($scope, $http, $location) {
  $scope.form = {};
  $scope.submitLeague = function () {
    $http.post('/sapi/leagues', $scope.form).
      success(function(data) {
        $location.path('/');
      });
  };
}

function leagues_view($scope, $http, $routeParams) {
  $http.get('/api/leagues/' + $routeParams.id).
    success(function(data) {
      $scope.league = data;
      $rootScope.locationBeforeImage = '/leagues/'+$routeParams.id;
    });
}

function leagues_edit($scope, $http, $location, $routeParams) {
  $scope.form = {};
  $http.get('/api/leagues/' + $routeParams.id).
    success(function(data) {
      $scope.league = data;
    });

  $scope.editLeague = function () {
    $http.put('/sapi/leagues/' + $routeParams.id, $scope.league).
      success(function(data) {
        $location.url('/leagues/' + $routeParams.id);
      });
  };
}

function league_delete($scope, $http, $location, $routeParams) {
  $http.get('/api/leagues/' + $routeParams.id).
    success(function(data) {
      $scope.league = data;
    });

  $scope.deleteLeague = function () {
    $http.delete('/sapi/leagues/' + $routeParams.id).
      success(function(data) {
        $location.url('/');
      });
  };

  $scope.home = function () {
    $location.url('/leagues');
  };
}

/*Zones*/
function zones_index($scope, $http) {
  $http.get('/api/zones').
    success(function(data, status, headers, config) {
      $scope.zones = data;
    });
}

function zones_add($scope, $http, $location) {
  $scope.form = {};
  $scope.submitZone = function () {
    $http.post('/api/zones', $scope.form).
      success(function(data) {
        $location.path('/');
      });
  };
}

function zones_view($scope, $http, $routeParams, $rootScope,$route, $location) {
 
   $scope.setMatchdayAsClosed = function (matchday) {
      $http.put('/sapi/zones/setMatchdayAsClosed', {"matchday_id" : matchday._id, 'status': matchday.closed}).
        success(function(data) {
        
        });
    };

    $scope.setMatchdayAsPlayed = function (matchday) {
      $http.put('/sapi/zones/setMatchdayAsPlayed', {"matchday_id" : matchday._id,  'status': matchday.played}).
        success(function(data) {
        
        });
    };

  
  $scope.generateFixture = function(zone){
    //Function to generate de fixture
      $http.post('/api/zones/'+zone._id+'/create_league_fixture', {"tournament_id": zone.tournament}).
          success(function(data) {
            $location.url('/zones/' + zone._id);
            $scope.zone.matchdays = data.matchdays;
          });
    }

  $scope.loadMatchesToRenderList = function(list_matchday){
    
    $scope.tournament = $.grep($rootScope.menu.tournaments, function(e){ return e._id == $scope.zone.tournament })[0];
    $scope.list_matchday = list_matchday;
    var matchday_dispute_day = new Date( $scope.list_matchday.dispute_day);
    $scope.list_matchday.pretty_date = matchday_dispute_day.getDay() +'/'+ (matchday_dispute_day.getMonth()+1) +'/'+ matchday_dispute_day.getFullYear();
    
    var teamTable = function( players , doc, headers){
      var processed_players = [];
      for (var i = 0; i < players.length; i++) {
        var new_player = {};
        new_player.name = players[i].name +' '+ players[i].last_name;
        new_player.dni = players[i].dni || '';
        new_player.numero = ' ';
        new_player.goles = ' ';
        new_player.tarjeta = ' ';
        if($scope.zone.suspensions.indexOf(players[i]._id) >= 0){
          new_player.firma = 'Suspendido';
        }else{
          new_player.firma = ' ';
        }
        processed_players.push(new_player);
      };
      function compare(a,b) {
          if (a.name < b.name)
             return -1;
          if (a.name > b.name)
            return 1;
          return 0;
        }
        var renderHeaderCell = function (x, y, width, height, key, value, settings) {
            doc.setFillColor(255, 255, 255); 
            doc.setTextColor(100, 100, 100);
            doc.setFontStyle('bold');
            doc.setLineWidth(0.3);
            doc.setDrawColor(100);
            doc.rect(x, y, width, height, 'fill');
            y += settings.lineHeight / 2 + doc.internal.getLineHeight() / 2 - 2.5;
            doc.text('' + value, x + settings.padding, y);
        };
        var renderCell = function (x, y, width, height, key, value, row, settings) {
            doc.setFillColor(255);
            doc.setLineWidth(0.3);
            doc.setDrawColor(100);
            doc.rect(x, y, width, height, 'fill');
            y += settings.lineHeight / 2 + doc.internal.getLineHeight() / 2 - 2.5;
            doc.text('' + value, x + settings.padding, y);
        };
        doc.setLineWidth(0.1);
        doc.setTextColor(100, 100, 100);
        doc.setFillColor(255, 255, 255); 
        doc.setDrawColor(100);

      doc.autoTable(headers, processed_players.sort(compare), { renderCell: renderCell, renderHeaderCell: renderHeaderCell,  startY: 130, fontSize: 12});
    };

    var createMatchTeamPages = function( match , doc, headers, i){
      if(i != 0){
        doc.addPage();
      }
      doc.setFontSize(14);
      doc.text($rootScope.league.name+' '+$scope.tournament.name, 40, 44);
      doc.setFontSize(12);
      doc.text('Fecha numero: '+$scope.list_matchday.matchday_number, 40,70);
      doc.text('Dia: '+$scope.list_matchday.pretty_date, 200, 70);
      doc.text('Partido: '+ match.local_team_name + ' vs ' + match.visitor_team_name, 40, 90);
      doc.text('Cancha: '+ match.turn[0].field[0].name +' '+ match.turn[0].hour +':'+ match.turn[0].minute +' Hs.' , 40, 110);
      teamTable(match.visitor_team.players , doc, headers);
      doc.addPage();
      doc.setFontSize(14);
      doc.text($rootScope.league.name+' '+$scope.tournament.name, 40, 44);
      doc.setFontSize(12);
      doc.text('Fecha numero : '+$scope.list_matchday.matchday_number, 40, 70);
      doc.text('Dia : '+$scope.list_matchday.pretty_date, 200, 70);
      doc.text('Partido: '+ match.local_team_name + ' vs ' + match.visitor_team_name, 40, 90);
      doc.text('Cancha: '+ match.turn[0].field[0].name +' '+ match.turn[0].hour +':'+ match.turn[0].minute +' Hs.' , 40, 110);
      teamTable(match.visitor_team.players , doc, headers);
    };

    

    $http.get('/api/matches?matchday='+$scope.list_matchday._id).
      success(function(data, status, headers, config) {
        for (var i = 0; i < data.length; i++) {
          data[i].visitor_team = $.grep($scope.zone.participations, function(e){ return e.team == data[i].visitor_team._id; })[0];
          data[i].local_team =$.grep($scope.zone.participations, function(e){ return e.team == data[i].local_team._id; })[0];
        };
        $scope.matchday_list_matches = data;
        var doc = new jsPDF('p', 'pt', 'a4');
        doc.setTextColor(100, 100, 100);
        doc.setFillColor(255, 255, 255); 
        doc.setLineWidth(0.5);
        var headers = [{title: "Nombre", key: "name"},
                    {title: "Dni", key: "dni"},
                    {title: "Numero", key: "numero"},
                    {title: "Goles", key: "goles"},
                    {title: "Tarjetas", key: "tarjeta"},
                    {title: "Firma", key: "firma"}
                  ];
        for (var i = 0; i < $scope.matchday_list_matches.length; i++) {
          createMatchTeamPages($scope.matchday_list_matches[i], doc, headers, i)
        };
        
        doc.output('dataurlnewwindow');
      });
  }

  $scope.selectTeam = function(team_id){
    $scope.selected_team = {};
    $scope.selected_team.team_id = team_id;
  };

  $scope.selectTeamForReplacement = function(team_id){
    $scope.selected_team = {};
    $scope.selected_team.team_id = team_id;
    if(!$rootScope.all_teams){
       $http.get('/api/teamNames').
        success(function(teams) {
            $rootScope.all_teams = teams;
        })
    }
   
  };

  $scope.openMatchday = function(matchday){
    $scope.selected_matchday = matchday;

    $http.get('/api/matches?matchday='+matchday._id).
      success(function(matches) {
        for (var i = 0; i < matches.length; i++) {
          matches[i].visitor_team.logo_image = $rootScope.imageHelper.getImage( matches[i].visitor_team.images, "escudo");
          matches[i].local_team.logo_image = $rootScope.imageHelper.getImage( matches[i].local_team.images, "escudo");
        };
        $scope.selected_matchday.matches = matches;
      })
  };

  $scope.addTeamSuspension = function(form){
    var participator = $.grep($scope.zone.participations, function(e){ return e.team == $scope.selected_team.team_id; })[0];
    var players = [];
    for (var i = 0; i < participator.players.length; i++) {
      players.push( participator.players[i]._id);
    };
    $http.post('/sapi/teams/'+$scope.selected_team.team_id+'/suspension', {"players" : players, "reason" : $scope.selected_team.reason}).
      success(function(data) {
        $scope.zone.suspensions = $scope.zone.suspensions.concat(data);
        $scope.zone.team_suspensions.push($scope.selected_team.team_id);
        $('#teamSuspension').modal('hide');
      });
  };

  $scope.closeModal = function(id){
    $('#openMatchday').modal('hide');
    $location.url('/matches/'+id);
  }
  
  $scope.removeTeamSuspension = function(team_id){
    if(confirm("¿Confirma que desea borrar la suspensión?")){
      var participator = $.grep($scope.zone.participations, function(e){ return e.team == $scope.selected_team.team_id; })[0];
      var players = [];
      for (var i = 0; i < participator.players.length; i++) {
        players.push( participator.players[i]._id);
      };
      $http.delete('/sapi/teams/'+team_id+'/suspension').
        success(function(data) {
          var index = $scope.zone.team_suspensions.indexOf(data);
          $scope.zone.team_suspensions.splice(index, 1);
      });
    }
  };

  $scope.submitReplaceTeam = function(){
    if(confirm("¿Confirma que desea reemplazar el equipo? Esto modificará todos los partidos donde interviene el equipo a reemplazar, para esta zona.")){
       $http.post('/api/zones/'+$scope.zone._id+'/participations/replace', {"data":{'team_id' : $scope.selected_team.team_id, 'replacer_team': $scope.selected_team.replacer_team}}).
        success(function(data) {
          $('#replaceTeam').modal('hide');
           $route.reload();
           $location.url('/zones/'+ $scope.zone._id);
        });
    }
  };

  $scope.selectMatchday = function(matchdayId){
    $scope.dispute_day = null;
    $scope.selected_matchday = matchdayId;
  };

  $scope.submitMatchdayDisputeDay = function(){
    if(confirm("¿Confirma que desea cambiar el dia de disputa?")){
       $http.post('/sapi/zones/matchdays/dispute_day', {"data":{'matchdayId' : $scope.selected_matchday , 'dispute_day': $scope.dispute_day}}).
        success(function(data) {
          for (var i = 0; i < $scope.zone.matchdays.length; i++) {
            if($scope.zone.matchdays[i]._id == data.matchdayId){
              $scope.zone.matchdays[i].dispute_day = data.dispute_day;
            }
          };
        });
    }
  };

  $scope.submitMatchStartDate = function(match, matchdispteday){
    if(confirm("¿Confirma que desea cambiar el dia de disputa?")){
       $http.post('/sapi/zones/matches/startDate', {"data":{'match_id' : match._id , 'dispute_day': matchdispteday.dispute_day}}).
        success(function(data) {
          $('#openMatchday').modal('hide');
        });
    }
  };

  $scope.submitMatchReferee = function(match, referee){
     $http.post('/sapi/zones/matches/addReferee', {"data":{'match_id' : match._id , 'referee': referee.referee_id}}).
      success(function(data) {
        $('#openMatchday').modal('hide');
      });
  };

  $scope.selectTeamToAddPlayers = function(participator){
    $scope.selected_team = {};
    $scope.selected_team.team_id = participator.team;
    $scope.selected_team.players = [];
    $scope.addPlayers.players = {};
     $http.get('/api/teams/'+participator.team+'/players').
      success(function(players) {
        for (var i = 0; i < players.length; i++) {
          var found = $.grep(participator.players, function(e){ return e._id == players[i]._id; });
          if(found.length == 0){
             $scope.selected_team.players.push(players[i]);
          };
        };
          
      })
    
  };

  $scope.submitAddPlayers = function(addPlayers){
    var ids = Object.keys(addPlayers.players);
    $http.post('/sapi/zones/'+$scope.zone._id+'/participation/'+ $scope.selected_team.team_id +'/players', {"players": ids}).
        success(function(data) {
          for (var i = 0; i < $scope.zone.participations.length; i++) {
            if($scope.zone.participations[i].team == $scope.selected_team.team_id){
              $scope.zone.participations[i].players = $scope.zone.participations[i].players.concat(data);
            }
          };
          $('#addPlayersToParticipation').modal('hide');
        });
  };


  var getStats = function(){
    if( $rootScope.tournament_stats.id != $scope.zone.tournament){
      $http.get('/api/zonesTournament?tournament='+$scope.zone.tournament+'&exclude='+$scope.zone._id).
        success(function(zones) {
          if(zones){
            $rootScope.zones = zones;
          }else{
            $rootScope.zones = [];
          }
          $rootScope.zones.push($rootScope.zone);

          $http.get('/api/participators_stats/'+$scope.zone.tournament).
            success(function(data) {
              $rootScope.tournament_stats.participators_stats = data;
              $rootScope.tournament_stats.id = $scope.zone.tournament;

              $scope.$emit('tournament_stats', $rootScope.tournament_stats.id );

              for (var k = $rootScope.zones.length - 1; k >= 0; k--) {
                var zone = $rootScope.zones[k];
                for (var i = zone.participations.length - 1; i >= 0; i--) {
                  var participation = zone.participations[i];
                  for (var j = participation.players.length - 1; j >= 0; j--) {
                    var player = participation.players[j];
                    player.goals = searchInParticipatorStatsByPlayer( player._id,  $rootScope.tournament_stats.participators_stats.goals);
                    player.yellow_cards = searchInParticipatorStatsByPlayer( player._id,  $rootScope.tournament_stats.participators_stats.yellow_cards);
                    player.double_yellow_cards = searchInParticipatorStatsByPlayer( player._id,  $rootScope.tournament_stats.participators_stats.double_yellow_cards);
                    player.red_cards =  searchInParticipatorStatsByPlayer( player._id,  $rootScope.tournament_stats.participators_stats.red_cards);
                    player.mvps =  searchInParticipatorStatsByPlayer( player._id,  $rootScope.tournament_stats.participators_stats.mvps);
                    $rootScope.zones[k].participations[i].players[j] = player;
                    $scope.zone = $rootScope.zones[$rootScope.zones.length-1];
                  };
                };
              };
          }); 
        });
    }
  }
  var searchInParticipatorStatsByPlayer = function(id , objArray){
    return objArray[id] || 0;
  }

  if( $rootScope.account || (typeof $rootScope.zones === "undefined") || ($.grep($rootScope.zones, function(e){ return e._id == $routeParams.id; }).length == 0) ){
     $('.loading_container').show();
     $http.get('/api/zones/' + $routeParams.id).
      success(function(data) {
        
        $scope.zone = data;
        $rootScope.zone = data;
        $scope.sociallikeurl = $location.absUrl();
        $scope.socialname = "El usuario ha compartido la zona"
        $http.get('/api/suspensions/suspendedPlayers').
          success(function(data) {
            $scope.zone.suspensions = data;
        });
          $http.get('/api/suspendedTeams').
          success(function(data) {
            $scope.zone.team_suspensions = data;
        });
          if(!$rootScope.tournament_stats){
            $rootScope.tournament_stats = {};
          }
        getStats();
        $('.loading_container').hide();
    });

  }else{
    $scope.zone = $.grep($rootScope.zones, function(e){ return e._id == $routeParams.id; })[0];
  }
  
}

function zones_edit($scope, $http, $location, $routeParams) {
  $scope.form = {};
  $http.get('/api/zones/' + $routeParams.id).
    success(function(data) {
      $scope.form = data;
    });

  $scope.editZone = function () {
    $http.put('/api/zones/' + $routeParams.id, $scope.form).
      success(function(data) {
        $location.url('/readPost/' + $routeParams.id);
      });
  };
}

function league_delete($scope, $http, $location, $routeParams) {
  $http.get('/api/zones/' + $routeParams.id).
    success(function(data) {
      $scope.league = data;
    });

  $scope.deleteZone = function () {
    $http.delete('/api/zones/' + $routeParams.id).
      success(function(data) {
        $location.url('/');
      });
  };

  $scope.home = function () {
    $location.url('/');
  };
}


/*players*/
function players_index($scope, $http) {
  $http.get('/api/players').
    success(function(data, status, headers, config) {
      $scope.players = data;
    });
}


function players_view($scope, $http, $routeParams, $rootScope) {
  $http.get('/api/players/' + $routeParams.id).
    success(function(data) {
      $http.get('/api/matches/mvp/' + $routeParams.id).
        success(function(data) {
          $scope.mvps = data;
        });
      data.cara_image =  $rootScope.imageHelper.getImage(data.images, "cara");
      data.cuerpo_image =  $rootScope.imageHelper.getImage(data.images, "normal");
      $rootScope.locationBeforeImage = '/players/'+$routeParams.id;
      $scope.player = data;
      $scope.player.yellow_cards = $.grep(data.incidents, function(e){ return e.incident_type == "Amonestación" }).length;
      $scope.player.red_cards = $.grep(data.incidents, function(e){ return e.incident_type == "Expulsión" }).length;
      $scope.player.double_yellow_cards = $.grep(data.incidents, function(e){ return e.incident_type == "Doble Amonestación" }).length;
      
    });
  $scope.removeImage = function(image_id){
    $http.delete('/sapi/images/player/'+$scope.player._id + '/'+ image_id).
      success(function(data) {
        $scope.player.images = $scope.player.images.filter(function(img) { return img._id == image_id; });
      });
  };
  $scope.editPlayer = function (player) {
    $scope.form ={};
    $scope.addPlayer = false;
    $scope.form.player = player;
  };
  $scope.submitPlayer = function (addPlayer) {
    $http.post( '/sapi/players/'+$scope.form.player._id , addPlayer).
      success(function(data) {
        if (data.error) {
          for (var object in data.error.errors) {
            if(object){
              if (data.error.errors.hasOwnProperty(object)) {
                form[object].$error.mongoose = data.error.errors[object].message;
              }
            }
          }
        } else{
          $('#addNewPlayer').modal('hide');
          $location.path('/teams/'+$scope.team._id);
        }        
      });
  };
}


/*teams*/
function teams_index($scope, $http, $rootScope) {
  $http.get('/api/teams').
    success(function(data, status, headers, config) {
      $scope.teams = data;
      for (var i = $scope.teams.length - 1; i >= 0; i--) {
        $scope.teams[i].logo_image =  $rootScope.imageHelper.getImage($scope.teams[i].images, "escudo");
      };
      
    });
}

function teams_add($scope, $http, $location) {
  $scope.form = {};
  $scope.submitTeam = function (form) {
    $http.post('/sapi/teams', $scope.team).
      success(function(data) {
        if (data.error) {
          for (var object in data.error.errors) {
            if(object){
              if (data.error.errors.hasOwnProperty(object)) {
                form[object].$error.mongoose = data.error.errors[object].message;
              }
            }
          }
        } else{
          $location.path('/');
        }
        
      });
  };
}

function teams_view($scope, $http, $routeParams, $rootScope, $location) {
  $http.get('/api/teams/' + $routeParams.id).success(function(data) {
    $scope.team = data;
    $rootScope.locationBeforeImage = "/teams/"+$routeParams.id;
    $scope.team.logo_image = $rootScope.imageHelper.getImage($scope.team.images, "escudo");
    $scope.team.team_image = $rootScope.imageHelper.getImage($scope.team.images, "completa");
    $scope.team.uniform_image = $rootScope.imageHelper.getImage($scope.team.images, "uniforme");
    for (var i = $scope.team.players.length - 1; i >= 0; i--) {
      $scope.team.players[i].cara_image =  $rootScope.imageHelper.getImage($scope.team.players[i].images, "cara");
    };
  });
  $http.get('/api/suspensionsByTeam?team=' + $routeParams.id).success(function(data) {
    $scope.suspensions = data;
  });
  $http.get('/api/matchesLastPlayed?team=' + $routeParams.id).success(function(data) {
    $scope.last_played_matches = data;
  });

  $scope.form = {};
  $scope.submitPlayer = function (addPlayer) {
    addPlayer.team_id = $scope.team._id;
    var add_player_url = '/sapi/players';
    if(!$scope.addPlayer){
      var add_player_url = '/sapi/players/'+$scope.form.player._id;
    }
    $http.post( add_player_url , addPlayer).
      success(function(data) {
        if (data.error) {
          for (var object in data.error.errors) {
            if(object){
              if (data.error.errors.hasOwnProperty(object)) {
                form[object].$error.mongoose = data.error.errors[object].message;
              }
            }
          }
        } else{
          $('#addNewPlayer').modal('hide');
          $location.path('/teams/'+$scope.team._id);
        }        
      });
  };

  $scope.addPlayer = function () {
    $scope.addPlayer = true;
  };

  $scope.editPlayer = function (player) {
    $scope.addPlayer = false;
    $scope.form.player = player;
  };

  $scope.form = {};
  $scope.submitTeam = function (addTeam) {
    $http.post( '/api/team/' , addTeam).
      success(function(data) {
        if (data.error) {
          for (var object in data.error.errors) {
            if(object){
              if (data.error.errors.hasOwnProperty(object)) {
                form[object].$error.mongoose = data.error.errors[object].message;
              }
            }
          }
        } else{
          $('#addNewTeam').modal('hide');
          $location.path('/teams/'+$scope.team._id);
        }        
      });
  };

  $scope.removeImage = function(image_id){
    $http.delete('/sapi/images/team/'+$scope.team._id + '/'+ image_id).
      success(function(data) {
        $scope.team.images = $scope.team.images.filter(function(img) { return img._id == image_id; });
      });
  };
  $rootScope.locationBeforeImage = "/teams/"+$routeParams.id;
}

function teams_edit($scope, $http, $location, $routeParams) {
  $scope.form = {};
  $http.get('/api/teams/' + $routeParams.id).
    success(function(data) {
      $scope.form = data;
    });

  $scope.editTeam = function () {
    $http.put('/sapi/teams/' + $routeParams.id, $scope.form).
      success(function(data) {
        $location.url('/teams/' + $routeParams.id);
      });
  };
}

function teams_delete($scope, $http, $location, $routeParams) {
  $http.get('/api/teams/' + $routeParams.id).
    success(function(data) {
      $scope.league = data;
    });

  $scope.deleteTeam = function () {
    $http.delete('/sapi/teams/' + $routeParams.id).
      success(function(data) {
        $location.url('/');
      });
  };

  $scope.home = function () {
    $location.url('/');
  };
}

/*tournaments*/
function tournaments_index($scope, $http) {
  $http.get('/api/tournaments').
    success(function(data, status, headers, config) {
      $scope.tournaments = data;
    });
}

function tournaments_classified($scope, $routeParams, $http) {
  $http.get('/api/zones/'+$routeParams.tournament_id+'/classified').
    success(function(data, status, headers, config) {
      $scope.participators = data.participators;
      $scope.tournament = data.tournament;

      $scope.classified = function(index){
        if(index < $scope.tournament.cant_teams_for_next_round){
          return true;
        }
        return false;
      }

      $scope.createPlayoff = function(){
        var classified_teams = [];
        for (var i = 0; i < $scope.tournament.cant_teams_for_next_round; i++) {
          classified_teams.push({'players': $scope.participators[i].participations.players ,'team':$scope.participators[i].participations.team, 'team_name':$scope.participators[i].participations.team_name, 'team_position': i});
        };
        $http.post('/sapi/zones/'+$routeParams.tournament_id+'/create_playoff_fixture', {'classified' : classified_teams, 'tournament_id': $scope.tournament._id}).
          success(function(data, status, headers, config) {
            $scope.tournaments = data;
          });
      }
    });

 
}

function tournaments_add($scope, $http, $location) {
  $scope.form = {};
  $scope.tournament = {
    number_of_teams : 1,
    number_of_zones : 1,
    tournament_type : 1,
    yellow_card_limit : 5,
    winner_points : 3,
    tied_points : 1,
    presentation_points : 0,
    cant_teams_for_next_round : 0,
    double_playoff_match : false,
    double_league_match : false,
    suspension_increment : true,
    type_of_zone_name : 1
  }


  $scope.submitTournament = function () {
    $http.post('/sapi/tournaments', $scope.tournament).
      success(function(data) {
        if (data.error) {
          for (var object in data.error.errors) {
            if(object){
              if (data.error.errors.hasOwnProperty(object)) {
                form[object].$error.mongoose = data.error.errors[object].message;
              }
            }
          }
        } else{
          $location.path('/tournaments/select_teams/'+data._id);
        }        
      });
  };
}

function tournaments_view($scope, $http, $routeParams, $rootScope, $location) {
  var zonesString = function(zones){
    var list = [];
    for (var i = 0; i < zones.length; i++) {
      if(i!=0){
        list += ",";
      }
      list += zones[i];
    };
    return list;
  }
  
  $http.get('/api/tournaments/' + $routeParams.id).
    success(function(data) {
      data.copa_image =  $rootScope.imageHelper.getImage(data.images, "copa");
      $scope.tournament = data;
      $rootScope.tournament = data;
      $rootScope.locationBeforeImage = '/tournaments/'+$routeParams.id;
      $http.get('/api/getZones?_id='+zonesString($scope.tournament.zones)).
        success(function(zones) {
          $rootScope.tournament.zones = zones;
          $scope.tournament.zones = zones;
        });
    });
 

  $scope.generateFixture = function(zone){
    //Function to generate de fixture
    $http.post('/sapi/zones/'+zone._id+'/create_league_fixture', {"tournament_id": $scope.tournament._id}).
        success(function(data) {
          $location.url('/zones/' + zone._id);
        });
  }

  $scope.selectTurnsForZone = function(zone){
    $scope.selected_zone = zone;
    $http.get('/api/turns/').
      success(function(data) {
         $scope.turns = data;
      });
  }

  $scope.submitSelectedTurns = function(addTurns){
    var matches = Math.floor($scope.selected_zone.participations.length/2);
    var turns_selected =  Object.keys(addTurns.turns).length;
    if((matches==turns_selected) || confirm("Hay "+matches+' partidos por fecha, y se han seleccionado '+turns_selected+'. Esto producirá partidos sin horarios o que algunos horarios no sean utilizados tdas las fechas, ¿desea continuar?')){
       var ids = Object.keys(addTurns.turns);
      $http.post('/api/zones/addTurns/'+$scope.selected_zone._id, {"turns": ids}).
        success(function(data) {
          $('#selectTurns').modal('hide');
        });
    }else{
      addTurns.turns = {};
    }
    
  };

  $scope.canClassiffy = function(){
    for (var i = 0; i < $scope.tournament.zones.length; i++) {
      if($scope.tournament.zones[i].matchdays){
        for (var j = 0; j < $scope.tournament.zones[i].matchdays.length; j++) {
          if( !$scope.tournament.zones[i].matchdays[j].played){
            return false;
          }
        };
      }else{
        false;
      }
      
    };
    return true;
  };
}

function tournaments_select_teams($scope, $http, $routeParams, $rootScope, $location) {
  if((typeof $rootScope.tournament === "undefined") || ($routeParams.id !== $rootScope.tournament._id)){
    $http.get('/api/tournaments/' + $routeParams.id).
      success(function(data) {
         $http.get('/api/teamNames/').
            success(function(teams) {
              $scope.teams = teams;
              $scope.tournament = data;
              $rootScope.tournament = data;
            });
      });
  }else{
    $scope.tournament = $rootScope.tournament
  }

  $scope.submitAddTeams = function(addTeams){
    var ids = Object.keys(addTeams.teams);
    if(ids.length != $scope.tournament.number_of_teams){
      alert("Cantidad invalida, debe seleccionar "+$scope.tournament.number_of_teams+' equipos.')
    }else{
      $http.post('/sapi/tournaments/'+$scope.tournament._id+'/teams', {"teams": ids}).
        success(function(data) {
          $scope.participations = data;
          $(document).scrollTop(0)
          //$location.url('/tournaments/' + $scope.tournament._id);
        });
    }
   
  };

  $scope.goToTournament = function(){
    $location.url('/tournaments/' + $scope.tournament._id);
  };
}

function tournaments_edit($scope, $http, $location, $routeParams) {
  $scope.form = {};
  $http.get('/api/tournaments/' + $routeParams.id).
    success(function(data) {
      $scope.form = data;
    });

  $scope.editTournament = function () {
    $http.put('/sapi/tournaments/' + $routeParams.id, $scope.form).
      success(function(data) {
        $location.url('/readPost/' + $routeParams.id);
      });
  };
}

function tournament_delete($scope, $http, $location, $routeParams) {
  $http.get('/api/tournaments/' + $routeParams.id).
    success(function(data) {
      $scope.league = data;
    });

  $scope.deleteTournament = function () {
    $http.delete('/sapi/tournaments/' + $routeParams.id).
      success(function(data) {
        $location.url('/');
      });
  };
}

/*matches*/
function matches_index($scope, $http, $location, $routeParams, $rootScope) {
  var queryString = $.param( $routeParams );
  $http.get('/api/matches'+'?'+queryString).
    success(function(data, status, headers, config) {
      $scope.matches = data;
      for (var i = 0; i < $scope.matches.length; i++) {
        $scope.matches[i].visitor_team.logo_image = $rootScope.imageHelper.getImage( $scope.matches[i].visitor_team.images, "escudo");
        $scope.matches[i].local_team.logo_image = $rootScope.imageHelper.getImage( $scope.matches[i].local_team.images, "escudo");
      };


      $scope.getZone = function () {
        $http.get('/api/zoneByMatchday/'+$scope.matches[0].matchday).
          success(function(data) {
            $location.path('/zones/'+data.zone_id);
          });
      };
    });


}

function matches_add($scope, $http, $location) {
  $scope.form = {};
  $scope.submitMatch = function () {
    $http.post('/sapi/matches', $scope.form).
      success(function(data) {
        $location.path('/');
      });
  };
}

function matches_view($scope, $http, $routeParams, $rootScope) {
  $scope.incident_types = [
      {name:'Amonestación'},
      {name:'Doble Amonestación'},
      {name:'Expulsión'}
    ];
  var removeObjectById = function(objectArray, id){
    objectArray = objectArray.filter(function( obj ) {
        return obj._id !== id;
    });
    return objectArray;
  }
  var searchPlayer = function(key, array){
    for (var i = array.length - 1; i >= 0; i--) {
      if(key == array[i]._id){
        return array[i];
      }
    };
  }
  var hasYellowCard = function(player){
    $.each($scope.match.local_incidents, function( index, incident ) {
        if(incident.player == player){
          return true;
        }
    });
    $.each($scope.match.visitor_incidents, function( index, incident ) {
        if(incident.player == player){
          return true;
        }
    });
  }
  var populateMatchPlayers = function(data, match){
    for (var i = data.local_goals.length - 1; i >= 0; i--) {
      data.local_goals[i].player = searchPlayer(data.local_goals[i].player, match.local_players.concat(match.visitor_players));
    };
    for (var i = data.visitor_goals.length - 1; i >= 0; i--) {
      data.visitor_goals[i].player = searchPlayer(data.visitor_goals[i].player, match.visitor_players.concat(match.local_players));
    };
    for (var i = data.local_incidents.length - 1; i >= 0; i--) {
      data.local_incidents[i].player = searchPlayer(data.local_incidents[i].player, match.local_players);
    };
    for (var i = data.visitor_incidents.length - 1; i >= 0; i--) {
      data.visitor_incidents[i].player = searchPlayer(data.visitor_incidents[i].player, match.visitor_players);
    };
    for (var i = data.local_suspensions.length - 1; i >= 0; i--) {
      data.local_suspensions[i].player = searchPlayer(data.local_suspensions[i].player, match.local_players);
    };
    for (var i = data.visitor_suspensions.length - 1; i >= 0; i--) {
      data.visitor_suspensions[i].player = searchPlayer(data.visitor_suspensions[i].player, match.visitor_players);
    };
    return data;
  }
  $http.get('/api/matches/' + $routeParams.id).
    success(function(data) {

      $scope.visitor_team = data.visitor_team;
      $scope.local_team = data.local_team;

      $scope.match = populateMatchPlayers(data, data);
      $scope.visitor_team.logo_image = $rootScope.imageHelper.getImage($scope.visitor_team.images, "escudo");
      $scope.local_team.logo_image = $rootScope.imageHelper.getImage($scope.local_team.images, "escudo");
      if($scope.match.mvp){
        $http.get('/api/players/' + $scope.match.mvp).
            success(function(player) {
               player.cara_image =  $rootScope.imageHelper.getImage(player.images, "cara");
              $scope.mvp_player = player;

            });
      }
       
      $scope.submitGoal = function (form, role) {
        $http.post('/sapi/matches/goals/'+role+"/"+$scope.match._id, $scope.goal).
          success(function(data) {
            if (data.error) {
              for (var object in data.error.errors) {
                if(object){
                  if (data.error.errors.hasOwnProperty(object)) {
                    form[object].$error.mongoose = data.error.errors[object].message;
                  }
                }
              }
            } else{
              $('#headingGoal'+role).modal('hide');
              $scope.match = populateMatchPlayers(data, $scope.match);
            }
          });
      };

      $scope.submitIncident = function  (form, role) {
        if( ($scope.incident.incident_type === "Amonestación") && (hasYellowCard($scope.incident.player)) ){
          alert("Este jugador ya posee una amonestación")
        }
        $http.post('/sapi/matches/incidents/'+role+"/"+$scope.match._id+"/"+$scope.match.matchday, $scope.incident).
          success(function(data) {
            if (data.error) {
              for (var object in data.error.errors) {
                if(object){
                  if (data.error.errors.hasOwnProperty(object)) {
                    form[object].$error.mongoose = data.error.errors[object].message;
                  }
                }
              }
            } else{
              
              if(data.suspension){
                if(role === "local"){
                  data.suspension.player = searchPlayer(data.suspension.player, $scope.match.local_players);
                  $scope.match.local_suspensions.push(data.suspension);
                }else if(role ==="visitor"){
                  data.suspension.player = searchPlayer(data.suspension.player, $scope.match.visitor_players);
                  $scope.match.visitor_suspensions.push(data.suspension);
                }
              }
              $('#headingSuspension'+role).modal('hide');
              $scope.match = populateMatchPlayers(data.match, $scope.match);
            }
          });
      };

      $scope.submitSuspension = function  (form, role) {
        $http.post('/sapi/suspensions/'+role+'/'+$scope.match._id, $scope.suspension).
          success(function(data) {
            if (data.error) {
              for (var object in data.error.errors) {
                if(object){
                  if (data.error.errors.hasOwnProperty(object)) {
                    form[object].$error.mongoose = data.error.errors[object].message;
                  }
                }
              }
            } else{
               $('#headingIncident'+role).modal('hide');
              if(role === "local"){
                data.player = searchPlayer(data.player, $scope.match.local_players);
                $scope.match.local_suspensions.push(data);
              }else if(role ==="visitor"){
                data.player = searchPlayer(data.player, $scope.match.visitor_players);
                $scope.match.visitor_suspensions.push(data);
              }
            }
          });
      };

      $scope.removeGoal = function  (role, id) {
        $http.delete('/sapi/matches/goals/'+role+'/'+id).
          success(function(data) {
            if(role === "local"){
              $scope.match.local_goals = removeObjectById($scope.match.local_goals, id)
            }else if(role ==="visitor"){
              $scope.match.visitor_goals = removeObjectById($scope.match.visitor_goals, id)
            }
          });
      };

      $scope.removeIncident = function  (role, id) {
        $http.delete('/sapi/matches/incidents/'+role+'/'+id).
          success(function(data) {
            if(role === "local"){
              $scope.match.local_incidents = removeObjectById($scope.match.local_incidents, id)
            }else if(role ==="visitor"){
              $scope.match.visitor_incidents = removeObjectById($scope.match.visitor_incidents, id)
            }
          });
      };

      $scope.removeSuspension = function  (role, id) {
        $http.delete('/sapi/matches/suspensions/'+role+'/'+id).
          success(function(data) {
            if(role === "local"){
              $scope.match.local_suspensions = removeObjectById($scope.match.local_suspensions, id)
            }else if(role ==="visitor"){
              $scope.match.visitor_suspensions = removeObjectById($scope.match.visitor_suspensions, id)
            }
          });
      };

      $scope.updateParticipations = function  () {
        $http.post('/api/zones/'+$scope.match.matchday+'/update_participations', {"match_id" : $scope.match._id}).
          success(function(data) {
            
          });
      };

      $scope.setMatchAsPlayed = function (played) {
        $http.post('/sapi/matches/setMatchAsPlayed', {"match_id" : $scope.match._id}).
          success(function(data) {
            $scope.updateParticipations();
          });
      };

      $scope.submitWalkOver = function (walk_over) {
        $http.put('/sapi/matches/updateWalkOver/'+$scope.match._id,  { "data" : {"walk_over" : walk_over}}).
          success(function(data) {
            $scope.match.walk_over = walk_over;
          }).
          error(function(data, status, headers, config) {
            $scope.match.walk_over = !walk_over;
          });
      };

      $scope.submitLostForBoth = function (lost_for_both) {
        $http.put('/sapi/matches/updateSetAsLostForBoth/'+$scope.match._id, { "data" : {"lost_for_both" : lost_for_both}}).
          success(function(data) {
            $scope.match.lost_for_both = lost_for_both;
          }).
          error(function(data, status, headers, config) {
            $scope.match.lost_for_both = !lost_for_both;
          });
      };

      $scope.submitMVP = function(player_id){
        $http.post('/sapi/matches/mvp/'+$scope.match._id, {"player_id" : player_id}).success(function(data) {
          $http.get('/api/players/' + data).
            success(function(player) {
              player.cara_image =  $rootScope.imageHelper.getImage(player.images, "cara");
              $scope.mvp_player = player;
            });
        });
      }

       $scope.removePlayer = function  (role,  player_id) {
        $http.delete('/sapi/matches/'+role+'/'+$scope.match._id+'/players/'+player_id).
          success(function(data) {
            if(role === "local"){
              $scope.match.local_players = removeObjectById($scope.match.local_players, data)
            }else if(role ==="visitor"){
              $scope.match.visitor_players = removeObjectById($scope.match.visitor_players, data)
            }
          });
      };

      $scope.addPlayers = function(team_id, match_id, matchday_id, role){
        $http.post('/sapi/matches/addPlayers', {"team_id" : team_id,"match_id" : match_id,"matchday_id" : matchday_id,"role" : role}).success(function(data) {
           if(role === "local"){
              $scope.match.local_players =  data;
            }else if(role ==="visitor"){
              $scope.match.visitor_players = data;
            }
        });
      }
    });
}

function matches_change_turn($scope, $rootScope, $http, $location, $routeParams) {
  
  $scope.form = {};
  $http.get('/api/turns').
    success(function(data) {
      $scope.turns = data;
    });
  $scope.submit = function () {
    $http.put('/sapi/matches/updateTurn/' + $routeParams.id, {"turn_id" : $scope.turn}).
      success(function(data) {
        $location.url('/matches/' + $routeParams.id);
      });
  };
}

function matches_delete($scope, $http, $location, $routeParams) {
  $http.get('/api/matches/' + $routeParams.id).
    success(function(data) {
      $scope.league = data;
    });

  $scope.deleteMatch = function () {
    $http.delete('/sapi/matches/' + $routeParams.id).
      success(function(data) {
        $location.url('/');
      });
  };

  $scope.home = function () {
    $location.url('/');
  };
}

function suspensions_index($scope, $http, $location, $routeParams , $sce, $rootScope) {
  $http.get('/api/suspensions').
    success(function(data, status, headers, config) {
      $scope.suspensions = data;
    });

  $http.get('/api/suspensions/accomplished').
    success(function(data, status, headers, config) {
      $scope.accomplished_suspensions = data;
    });


  $scope.markAsAccomplished = function(suspension){
    if(confirm("¿Confirma que desea setear la suspension como completada?")){
       $http.put('/sapi/suspensions/setAsAccomplished', {'suspension' : suspension }).
        success(function(data) {
           $location.url('/suspensions');
        });
    }
  };
}

/*chronicle*/
function chronicles_index($scope, $http, $location, $routeParams , $sce, $rootScope) {
  var queryString = $.param( $routeParams );
  $http.get('/api/chronicles'+'?'+queryString).
    success(function(data, status, headers, config) {
      
      for (var i = 0; i < data.length; i++) {
        data[i].preview_image = $rootScope.imageHelper.getImage(data[i].images, "completa");
        data[i].trusted_content = $sce.trustAsHtml(data[i].content);
        data[i].trusted_summary = $sce.trustAsHtml(data[i].summary);
      };
      $scope.chronicles = data;
    });
}

function chronicles_add($scope, $http, $location, $routeParams ) {
  $scope.form = {};
  $scope.chronicle = {};
  $scope.submitChronicle = function () {
    var obj = $location.search();
    if(obj.match){
     $scope.chronicle.match = obj.match ;
    }
    $scope.chronicle.content  = $("#contentarea").html();
    $http.post('/sapi/chronicles', {'chronicle' : $scope.chronicle } ).
      success(function(data) {
        $location.path('/chronicles/'+data._id);
      });
  };
}

function chronicles_view($scope, $http, $routeParams, $rootScope, $sce , $location) {
  
  $http.get('/api/chronicles/' + $routeParams.id).
    success(function(data) {
      $scope.chronicle = data;
      $scope.chronicle.preview_image = $rootScope.imageHelper.getImage($scope.chronicle.images, "completa");
      $scope.content_chronicle = $sce.trustAsHtml($scope.chronicle.content);
      $scope.content_summary = $sce.trustAsHtml($scope.chronicle.summary);
      $scope.sociallikeurl = $location.absUrl();
      $scope.socialname = $scope.chronicle.title;
    });

  $rootScope.locationBeforeImage = "/chronicles/"+$routeParams.id;

  $scope.selectImage = function(image){
    $scope.selected_image = image;
  }

  $scope.removeChronicle = function(){
    if(confirm("¿Confirma que desea borrar la crónica?")){
       $http.delete('/sapi/chronicles/'+ $routeParams.id).
      success(function(data) {
        $location.path('/chronicles');
      });
    }
  }
}

function chronicles_edit($scope, $http, $location, $rootScope, $sce , $routeParams) {
  $scope.chronicle = {};
   $rootScope.locationBeforeImage = "/chronicles/"+$routeParams.id;
  $http.get('/api/chronicles/' + $routeParams.id).
    success(function(data) {
      $scope.chronicle = data;
      $("#contentarea").html($scope.chronicle.content);
    });

  $scope.submitChronicle = function () {
    $scope.chronicle.content  = $("#contentarea").html();
    $http.put('/sapi/chronicles/' + $routeParams.id, {'chronicle' : $scope.chronicle } ).
      success(function(data) {
        $location.path('/chronicles/'+data._id);
      });
  };
}

/*roles*/
function roles_add($scope, $http, $location, $routeParams ) {
  var queryString = $.param( $routeParams );
  $scope.form = {};
  $scope.submitRole = function () {
    if(queryString.match){
      $scope.role.match = queryString.match;
    }
    $scope.role.content  = $("#contentarea").html();
    $http.post('/api/roles', $scope.role).
      success(function(data) {
        $location.path('/roles/'+data._id);
      });
  };
}

function roles_view($scope, $http, $routeParams, $rootScope, $sce) {
  $http.get('/api/roles/' + $routeParams.id).
    success(function(data) {
      $scope.role = data;
      $scope.role.preview_image = $rootScope.imageHelper.getImage($scope.role.images, "completa");
      $scope.content_role = $sce.trustAsHtml($scope.role.content);
      $scope.content_summary = $sce.trustAsHtml($scope.role.summary);
    });
  $rootScope.locationBeforeImage = "/roles/"+$routeParams.id;
}

function roles_edit($scope, $http, $location, $routeParams) {
  $scope.role = {};
  $http.get('/api/roles/' + $routeParams.id).
    success(function(data) {
      $scope.role = data;
    });

  $scope.editRole = function () {
    $scope.role.content  = $("#contentarea").html();
    $http.put('/api/roles/' + $routeParams.id, $scope.role).
      success(function(data) {
        $location.url('/roles/' + $routeParams.id);
      });
  };
}

/*advertising*/
function advertisings_index($scope, $http, $location, $routeParams , $sce, $rootScope) {
  var queryString = $.param( $routeParams );
  $http.get('/api/advertisings'+'?'+queryString).
    success(function(data, status, headers, config) {
      for (var i = 0; i < data.length; i++) {
        data[i].preview_image = $rootScope.imageHelper.getImage(data[i].images, data[i].type);
      };
      $scope.advertisings = data;
    });

  $scope.deleteAdvertising = function (advertising) {
    $http.delete('/sapi/advertisings/' + advertising._id).
      success(function(data) {
        $location.url('/advertisings');
      });
  };
}

function advertisings_add($scope, $http, $location, $routeParams ) {
  var queryString = $.param( $routeParams );
  $scope.form = {};
  $scope.submitAdvertising = function () {
    if(queryString.match){
      $scope.advertising.match = queryString.match;
    }
    $scope.advertising.content  = $("#contentarea").html();
    $http.post('/sapi/advertisings', $scope.advertising).
      success(function(data) {
        $location.path('/advertisings');
      });
  };
}

function advertisings_view($scope, $http, $routeParams, $rootScope, $sce) {
  $http.get('/api/advertisings/' + $routeParams.id).
    success(function(data) {
      data.preview_image = $rootScope.imageHelper.getImage(data.images,  data.type);
      $scope.advertising = data;
      $rootScope.locationBeforeImage = '/advertisings/'+$routeParams.id;
    });

  $scope.removeImage = function(image_id){
    $http.delete('/sapi/images/advertising/'+$scope.advertising._id + '/'+ image_id).
      success(function(data) {
        $scope.advertising.images = $scope.advertising.images.filter(function(img) { return img._id == image_id; });
      });
  };

  
}

function advertisings_edit($scope, $http, $location, $routeParams) {
  $scope.advertising = {};
  $http.get('/api/advertisings/' + $routeParams.id).
    success(function(data) {
      $scope.advertising = data;
    });

  $scope.editAdvertising = function () {
    $scope.advertising.content  = $("#contentarea").html();
    $http.put('/sapi/advertisings/' + $routeParams.id, $scope.advertising).
      success(function(data) {
        $location.url('/readPost/' + $routeParams.id);
      });
  };
}

/*rule*/
function rules_index($scope, $http, $location, $routeParams , $sce, $rootScope) {
  var queryString = $.param( $routeParams );
  $http.get('/api/rules'+'?'+queryString).
    success(function(data, status, headers, config) {
      
      for (var i = 0; i < data.length; i++) {
        data[i].preview_image = $rootScope.imageHelper.getImage(data[i].images, "completa");
        data[i].trusted_content = $sce.trustAsHtml(data[i].content);
      };
      $scope.rules = data;
    });
}

function rules_add($scope, $http, $location, $routeParams) {
  $scope.form = {};
  $scope.submitRule = function () {
    $scope.rule.content  = $("#contentarea").html();
    $http.post('/sapi/rules/'+$routeParams.tournament_id, $scope.rule).
      success(function(data) {
        $location.path('/tournaments/'+$routeParams.tournament_id);
      });
  };
}

function rules_view($scope, $http, $routeParams, $rootScope, $sce) {
  $http.get('/api/rules/' + $routeParams.id).
    success(function(data) {
      $scope.rule = data;
      $scope.rule.preview_image = $rootScope.imageHelper.getImage($scope.rule.images, "completa");
      $scope.content_rule = $sce.trustAsHtml($scope.rule.content);
      $scope.content_summary = $sce.trustAsHtml($scope.rule.summary);
    });
}

function rules_edit($scope, $http, $location, $routeParams) {
  $scope.rule = {};
  $http.get('/api/rules/' + $routeParams.id).
    success(function(data) {
      $scope.rule = data;
    });

  $scope.editRule = function () {
    $scope.rule.content  = $("#contentarea").html();
    $http.put('/sapi/rules/' + $routeParams.id, $scope.rule).
      success(function(data) {
        $location.url('/rules/' + $routeParams.id);
      });
  };
}

function rules_delete($scope, $http, $location, $routeParams) {
  $http.get('/api/rules/' + $routeParams.id).
    success(function(data) {
      $scope.league = data;
    });

  $scope.deleteRule = function () {
    $http.delete('/sapi/rules/' + $routeParams.id).
      success(function(data) {
        $location.url('/rules');
      });
  };
}

/*TUrns*/
function turns_index($scope, $http) {
  $scope.days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
  $http.get('/api/turns').
    success(function(data, status, headers, config) {
      $scope.turns = data;
    });
}

function turns_add($scope, $http, $location) {
  $scope.form = {};
  $scope.submitTurn = function () {
    $http.post('/sapi/turns', $scope.form).
      success(function(data) {
        $location.path('/');
      });
  };
}


function turns_view($scope, $http, $routeParams, $rootScope, $location) {
    $scope.days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
    $http.get('/api/turns/' + $routeParams.id).
      success(function(data) {
        $scope.turn = data;
    });
    $scope.deleteTurn = function () {
    $http.delete('/sapi/turns/' + $routeParams.id).
      success(function(data) {
        $location.url('/');
      });
  };
  
}

function turns_edit($scope, $http, $location, $routeParams) {
  $scope.days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
  $scope.form = {};
  $http.get('/api/turns/' + $routeParams.id).
    success(function(data) {
      $scope.form.turn = data;
    });
  $http.get('/api/fields/').success(function(data){
    $scope.fields = data;
  })
  $scope.editTurn = function (addTurn) {
    $http.put('/sapi/turns/' + $routeParams.id, $scope.form.turn).
      success(function(data) {
        $location.url('/turns');
      });
  };
}

/*Referees*/
function referees_index($scope, $http) {
  $scope.days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
  $http.get('/api/referees').
    success(function(data, status, headers, config) {
      $scope.referees = data;
    });
}

function referees_add($scope, $http, $location) {
  $scope.form = {};
  $scope.addReferee = function () {
    $http.post('/sapi/referees', $scope.form).
      success(function(data) {
        $location.path('/');
      });
  };
}


function referees_view($scope, $http, $routeParams, $rootScope, $location) {
    $scope.days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
    $http.get('/api/referees/' + $routeParams.id).
      success(function(data) {
        $scope.referee = data;
    });
    $scope.deleteTurn = function () {
    $http.delete('/sapi/referees/' + $routeParams.id).
      success(function(data) {
        $location.url('/');
      });
  };
  
}

function referees_edit($scope, $http, $location, $routeParams) {
  $scope.days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
  $scope.form = {};
  $http.get('/api/referees/' + $routeParams.id).
    success(function(data) {
      $scope.form.referee = data;
    });
  $scope.editReferee = function (addTurn) {
    $http.put('/sapi/referees/' + $routeParams.id, $scope.form.turn).
      success(function(data) {
        $location.url('/referees');
      });
  };
}

function rules_delete($scope, $http, $location, $routeParams) {
  $http.get('/api/rules/' + $routeParams.id).
    success(function(data) {
      $scope.league = data;
    });

  $scope.deleteRule = function () {
    $http.delete('/sapi/rules/' + $routeParams.id).
      success(function(data) {
        $location.url('/');
      });
  };

  $scope.home = function () {
    $location.url('/');
  };
}
/*images*/
function images_add($rootScope, $scope, $http, $window, $location, $routeParams){
  var cropperImageSizesByType = {
      "normal" : {"height": 300, "width": 230},
      "escudo" : {"height":100, "width":100},
      "logo" : {"height":120 , "width":120},
      "completa" : {"height": 230, "width":300},
      "uniforme" : {"height":200 , "width":200},
      "cara" : {"height":80, "width":80},
      "copa" : {"height":100 , "width":50},
      "encabezado" : {"height":90 , "width":400},
      "lateral" : {"height":40 , "width":180}
      };
  $scope.image = {};
  $scope.image.type = $routeParams.format;
  $('#image-cropper').cropit({ imageBackground: true, width : cropperImageSizesByType[$scope.image.type].width, height : cropperImageSizesByType[$scope.image.type].height });
 
  $scope.submit = function (model, addImage) {
    var imgBase64 = $('#image-cropper').cropit('export', {
      type: 'image/jpeg',
      quality: .8,
      originalSize: true
    });
    $scope.image.imageBase64Content = imgBase64;
    $http
      .post('/sapi/images/'+$routeParams.param+'/'+ $routeParams.id, $scope.image)
      .success(function (data, status, headers, config) {
        if (data.error) {
          for (var object in data.error.errors) {
            if(object){
              if (data.error.errors.hasOwnProperty(object)) {
                form[object].$error.mongoose = data.error.errors[object].message;
              }
            }
          }
        } else{
          
          $location.url($rootScope.locationBeforeImage);
        }
      })
      .error(function (data, status, headers, config) {
        
      });
  };
}
