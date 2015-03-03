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
  $rootScope.menu = {};
  $rootScope.imageTypes = {};
  $rootScope.imageTypes.team = ["normal", "uniforme", "escudo"];
  $rootScope.imageTypes.player = ["cara", "completa"];
  $rootScope.imageTypes.tournament = ["copa", "escudo"];
  $rootScope.imageTypes.match = ["normal"];
  $rootScope.imageTypes.matchday = ["normal"];
  $rootScope.imageTypes.league = ["logo", "normal"];
  $rootScope.imageTypes.field = ["normal"];
  $rootScope.imageTypes.chronicle = ["completa"];
  $rootScope.imageTypes.rule = ["completa"];
  $rootScope.imageTypes.advertising = ["encabezado", "lateral"];

  $rootScope.imageHelper = {};
  $rootScope.imageHelper.getImage = function(images, type){
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
      $rootScope.menu.tournaments = data;
    });

}

/*Users*/

function login($scope, $http, $window) {
  $scope.user = {username: 'john.doe', password: 'foobar'};
  $scope.message = '';
  $scope.submit = function () {
    $http
      .post('/authenticate', $scope.user)
      .success(function (data, status, headers, config) {
        $window.sessionStorage.token = data.token;
        $scope.message = 'Welcome';
      })
      .error(function (data, status, headers, config) {
        // Erase the token if the user fails to log in
        delete $window.sessionStorage.token;

        // Handle login errors here
        $scope.message = 'Error: Invalid user or password';
      });
  };
}

function users_index($scope, $http) {
  $http.get('/api/users').
    success(function(data, status, headers, config) {
      $scope.users = data;
    });
}

function users_add($scope, $http, $location) {
  $scope.form = {};
  $scope.submitUser = function () {
    $http.post('/api/users', $scope.form).
      success(function(data) {
        $location.path('/');
      });
  };
}

function users_view($scope, $http, $routeParams) {
  $http.get('/api/users/' + $routeParams.id).
    success(function(data) {
      $scope.user = data;
    });
}

function users_edit($scope, $http, $location, $routeParams) {
  $scope.form = {};
  $http.get('/api/users/' + $routeParams.id).
    success(function(data) {
      $scope.form = data;
    });

  $scope.editPost = function () {
    $http.put('/api/users/' + $routeParams.id, $scope.form).
      success(function(data) {
        $location.url('/readPost/' + $routeParams.id);
      });
  };
}

function user_delete($scope, $http, $location, $routeParams) {
  $http.get('/api/users/' + $routeParams.id).
    success(function(data) {
      $scope.post = data;
    });

  $scope.deleteUser = function () {
    $http.delete('/api/users/' + $routeParams.id).
      success(function(data) {
        $location.url('/');
      });
  };

  $scope.home = function () {
    $location.url('/');
  };
}


/*Leagues*/
function leagues_index($scope, $http) {
  $http.get('/api/leagues').
    success(function(data, status, headers, config) {
      $scope.leagues = data;
    });
}

function leagues_add($scope, $http, $location) {
  $scope.form = {};
  $scope.submitLeague = function () {
    $http.post('/api/leagues', $scope.form).
      success(function(data) {
        $location.path('/');
      });
  };
}

function leagues_view($scope, $http, $routeParams) {
  $http.get('/api/leagues/' + $routeParams.id).
    success(function(data) {
      $scope.league = data;
    });
}

function leagues_edit($scope, $http, $location, $routeParams) {
  $scope.form = {};
  $http.get('/api/leagues/' + $routeParams.id).
    success(function(data) {
      $scope.league = data;
    });

  $scope.editLeague = function () {
    $http.put('/api/leagues/' + $routeParams.id, $scope.league).
      success(function(data) {
        $location.url('/readPost/' + $routeParams.id);
      });
  };
}

function league_delete($scope, $http, $location, $routeParams) {
  $http.get('/api/leagues/' + $routeParams.id).
    success(function(data) {
      $scope.league = data;
    });

  $scope.deleteLeague = function () {
    $http.delete('/api/leagues/' + $routeParams.id).
      success(function(data) {
        $location.url('/');
      });
  };

  $scope.home = function () {
    $location.url('/');
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

function zones_view($scope, $http, $routeParams, $rootScope, $location) {
  var searchInParticipatorStatsByPlayer = function(id , objArray){
    return objArray[id] || 0;
  }
  if((typeof $rootScope.zone === "undefined") || ($routeParams.id != $rootScope.zone.id)){
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
          if(!$rootScope.tournament_stats){
            $rootScope.tournament_stats = {};
          }
        if( $rootScope.tournament_stats.id != $scope.zone.tournament){
          $http.get('/api/participators_stats/'+$scope.zone.tournament).
            success(function(data) {
              $rootScope.tournament_stats.participators_stats = data;
              $rootScope.tournament_stats.id = $scope.zone.tournament;
              for (var i = $scope.zone.participations.length - 1; i >= 0; i--) {
                var participation = $scope.zone.participations[i];
                for (var j = participation.players.length - 1; j >= 0; j--) {
                  var player = participation.players[j];
                  player.goals = searchInParticipatorStatsByPlayer( player._id,  $rootScope.tournament_stats.participators_stats.goals);
                  player.yellow_cards = searchInParticipatorStatsByPlayer( player._id,  $rootScope.tournament_stats.participators_stats.yellow_cards);
                  player.red_cards =  searchInParticipatorStatsByPlayer( player._id,  $rootScope.tournament_stats.participators_stats.red_cards);
                  player.mvps =  searchInParticipatorStatsByPlayer( player._id,  $rootScope.tournament_stats.participators_stats.mvps);
                  $scope.zone.participations[i].players[j] = player;
                };
              };
          });
        }
        
    });

  }else{
    $scope.zone = $rootScope.zone;
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

function players_add($scope, $http, $location) {
  $scope.form = {};
  $scope.submitPlayer = function () {
    $http.post('/api/players', $scope.form).
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

function players_view($scope, $http, $routeParams, $rootScope) {
  $http.get('/api/players/' + $routeParams.id).
    success(function(data) {
      data.cara_image =  $rootScope.imageHelper.getImage(data.images, "cara");
      $scope.player = data;
    });
  $scope.removeImage = function(image_id){
    $http.delete('/api/images/player/'+$scope.player._id + '/'+ image_id).
      success(function(data) {
        $scope.player.images = $scope.player.images.filter(function(img) { return img._id == image_id; });
      });
  };
}

function players_edit($scope, $http, $location, $routeParams) {
  $scope.form = {};
  $http.get('/api/players/' + $routeParams.id).
    success(function(data) {
      $scope.form = data;
    });

  $scope.editPlayer = function () {
    $http.put('/api/players/' + $routeParams.id, $scope.form).
      success(function(data) {
        $location.url('/readPost/' + $routeParams.id);
      });
  };
}

function player_delete($scope, $http, $location, $routeParams) {
  $http.get('/api/players/' + $routeParams.id).
    success(function(data) {
      $scope.league = data;
    });

  $scope.deletePlayer = function () {
    $http.delete('/api/players/' + $routeParams.id).
      success(function(data) {
        $location.url('/');
      });
  };

  $scope.home = function () {
    $location.url('/');
  };
}


/*teams*/
function teams_index($scope, $http) {
  $http.get('/api/teams').
    success(function(data, status, headers, config) {
      $scope.teams = data;
    });
}

function teams_add($scope, $http, $location) {
  $scope.form = {};
  $scope.submitTeam = function (form) {
    $http.post('/api/teams', $scope.team).
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

function teams_view($scope, $http, $routeParams, $rootScope) {
  function trigger(event,data) {
    $scope.team.images.push(data.image);
  }
  $http.get('/api/teams/' + $routeParams.id).success(function(data) {
    $scope.team = data;
    $scope.team.logo_image = $rootScope.imageHelper.getImage($scope.team.images, "escudo");
    for (var i = $scope.team.players.length - 1; i >= 0; i--) {
      $scope.team.players[i].cara_image =  $rootScope.imageHelper.getImage($scope.team.players[i].images, "cara");
    };
    $scope.$on('savedImage', trigger);
  });
  $http.get('/api/suspensionsByTeam?team=' + $routeParams.id).success(function(data) {
    $scope.suspensions = data;
  });
  $http.get('/api/matchesLastPlayed?team=' + $routeParams.id).success(function(data) {
    $scope.last_played_matches = data;
  });
  $scope.removeImage = function(image_id){
    $http.delete('/api/images/team/'+$scope.team._id + '/'+ image_id).
      success(function(data) {
        $scope.team.images = $scope.team.images.filter(function(img) { return img._id == image_id; });
      });
  };
}

function teams_edit($scope, $http, $location, $routeParams) {
  $scope.form = {};
  $http.get('/api/teams/' + $routeParams.id).
    success(function(data) {
      $scope.form = data;
    });

  $scope.editTeam = function () {
    $http.put('/api/teams/' + $routeParams.id, $scope.form).
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
    $http.delete('/api/teams/' + $routeParams.id).
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

function tournaments_add($scope, $http, $location) {
  $scope.form = {};
  $scope.submitTournament = function () {
    $http.post('/api/tournaments', $scope.form).
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

function tournaments_view($scope, $http, $routeParams, $rootScope) {
  if((typeof $rootScope.tournament === "undefined") || ($routeParams.id !== $rootScope.tournament._id)){
    $http.get('/api/tournaments/' + $routeParams.id).
      success(function(data) {
        $scope.tournament = data;
        $rootScope.tournament = data;
      });
  }else{
    $scope.tournament = $rootScope.tournament
  }
}

function tournaments_edit($scope, $http, $location, $routeParams) {
  $scope.form = {};
  $http.get('/api/tournaments/' + $routeParams.id).
    success(function(data) {
      $scope.form = data;
    });

  $scope.editTournament = function () {
    $http.put('/api/tournaments/' + $routeParams.id, $scope.form).
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
    $http.delete('/api/tournaments/' + $routeParams.id).
      success(function(data) {
        $location.url('/');
      });
  };

  $scope.home = function () {
    $location.url('/');
  };
}

/*matchdays*/
function matchdays_index($scope, $http) {
  $http.get('/api/matchdays').
    success(function(data, status, headers, config) {
      $scope.matchdays = data;
    });
}

function matchdays_add($scope, $http, $location) {
  $scope.form = {};
  $scope.submitMatchday = function () {
    $http.post('/api/matchdays', $scope.form).
      success(function(data) {
        $location.path('/');
      });
  };
}

function matchdays_view($scope, $http, $routeParams, $rootScope) {
  if((typeof $rootScope.matchday === "undefined") || ($routeParams.id != $rootScope.matchday._id)){
    $http.get('/api/matchdays/' + $routeParams.id).
      success(function(data) {
        $scope.matchday = data;
        $rootScope.matchday = data;
      });
  }else{
    $scope.matchday = $rootScope.matchday;
  }
}

function matchdays_edit($scope, $http, $location, $routeParams) {
  $scope.form = {};
  $http.get('/api/matchdays/' + $routeParams.id).
    success(function(data) {
      $scope.form = data;
    });

  $scope.editMatchday = function () {
    $http.put('/api/matchdays/' + $routeParams.id, $scope.form).
      success(function(data) {
        $location.url('/readPost/' + $routeParams.id);
      });
  };
}

function matchday_delete($scope, $http, $location, $routeParams) {
  $http.get('/api/matchdays/' + $routeParams.id).
    success(function(data) {
      $scope.league = data;
    });

  $scope.deleteMatchday = function () {
    $http.delete('/api/matchdays/' + $routeParams.id).
      success(function(data) {
        $location.url('/');
      });
  };

  $scope.home = function () {
    $location.url('/');
  };
}

/*matches*/
function matches_index($scope, $http, $location, $routeParams) {
  var queryString = $.param( $routeParams );
  $http.get('/api/matches'+'?'+queryString).
    success(function(data, status, headers, config) {
      $scope.matches = data;
    });
}

function matches_add($scope, $http, $location) {
  $scope.form = {};
  $scope.submitMatch = function () {
    $http.post('/api/matches', $scope.form).
      success(function(data) {
        $location.path('/');
      });
  };
}

function matches_view($scope, $http, $routeParams, $rootScope) {
  $scope.incident_types = [
      {name:'Amonestación'},
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
  var populateMatchPlayers = function(data, match){
    for (var i = data.local_goals.length - 1; i >= 0; i--) {
      data.local_goals[i].player = searchPlayer(data.local_goals[i].player, match.local_players);
    };
    for (var i = data.visitor_goals.length - 1; i >= 0; i--) {
      data.visitor_goals[i].player = searchPlayer(data.visitor_goals[i].player, match.visitor_players);
    };
    for (var i = data.local_incidents.length - 1; i >= 0; i--) {
      data.local_incidents[i].player = searchPlayer(data.local_incidents[i].player, match.local_players);
    };
    for (var i = data.visitor_incidents.length - 1; i >= 0; i--) {
      data.visitor_incidents[i].player = searchPlayer(data.visitor_incidents[i].player, match.visitor_players);
    };
    for (var i = data.local_suspensions.length - 1; i >= 0; i--) {
      data.local_incidents[i].player = searchPlayer(data.local_suspensions[i].player, match.local_players);
    };
    for (var i = data.visitor_suspensions.length - 1; i >= 0; i--) {
      data.visitor_incidents[i].player = searchPlayer(data.visitor_suspensions[i].player, match.visitor_players);
    };
    return data;
  }
  $http.get('/api/matches/' + $routeParams.id).
    success(function(data) {
      $scope.match = populateMatchPlayers(data, data);
      $scope.match.visitor_team.logo_image = $rootScope.imageHelper.getImage($scope.match.visitor_team.images, "escudo");
      $scope.match.local_team.logo_image = $rootScope.imageHelper.getImage($scope.match.local_team.images, "escudo");
      $scope.submitGoal = function (form, role) {
        $http.post('/api/matches/goals/'+role+"/"+$scope.match._id, $scope.goal).
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
              $scope.match = populateMatchPlayers(data, $scope.match);
            }
          });
      };
      $scope.submitIncident = function  (form, role) {
        $http.post('/api/matches/incidents/'+role+"/"+$scope.match._id+"/"+$rootScope.zone.tournament, $scope.incident).
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
              $scope.match = populateMatchPlayers(data, $scope.match);
            }
          });
      };
      $scope.submitSuspension = function  (form, role) {
        $http.post('/api/suspensions/'+role+'/'+$scope.match._id, $scope.suspension).
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
        $http.delete('/api/matches/goals/'+role+'/'+id).
          success(function(data) {
            if(role === "local"){
              $scope.match.local_goals = removeObjectById($scope.match.local_goals, id)
            }else if(role ==="visitor"){
              $scope.match.visitor_goals = removeObjectById($scope.match.visitor_goals, id)
            }
          });
      };
      $scope.removeIncident = function  (role, id) {
        $http.delete('/api/matches/incidents/'+role+'/'+id).
          success(function(data) {
            if(role === "local"){
              $scope.match.local_incidents = removeObjectById($scope.match.local_incidents, id)
            }else if(role ==="visitor"){
              $scope.match.visitor_incidents = removeObjectById($scope.match.visitor_incidents, id)
            }
          });
      };
      $scope.removeSuspension = function  (role, id) {
        $http.delete('/api/matches/suspensions/'+role+'/'+id).
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
      $scope.setMatchAsPlayed = function () {
        $http.post('/api/matches/setAsPlayed', {"match_id" : $scope.match._id}).
          success(function(data) {
            updateParticipations();
          });
      };
    });
}

function matches_edit($scope, $http, $location, $routeParams) {
  $scope.form = {};
  $http.get('/api/matches/' + $routeParams.id).
    success(function(data) {
      $scope.form = data;
    });

  $scope.editMatch = function () {
    $http.put('/api/matches/' + $routeParams.id, $scope.form).
      success(function(data) {
        $location.url('/readPost/' + $routeParams.id);
      });
  };
}

function matches_delete($scope, $http, $location, $routeParams) {
  $http.get('/api/matches/' + $routeParams.id).
    success(function(data) {
      $scope.league = data;
    });

  $scope.deleteMatch = function () {
    $http.delete('/api/matches/' + $routeParams.id).
      success(function(data) {
        $location.url('/');
      });
  };

  $scope.home = function () {
    $location.url('/');
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
  var queryString = $.param( $routeParams );
  $scope.form = {};
  $scope.submitChronicle = function () {
    if(queryString.match){
      $scope.chronicle.match = queryString.match;
    }
    $scope.chronicle.content  = $("#contentarea").html();
    $http.post('/api/chronicles', $scope.chronicle).
      success(function(data) {
        $location.path('/');
      });
  };
}

function chronicles_view($scope, $http, $routeParams, $rootScope, $sce) {
  $http.get('/api/chronicles/' + $routeParams.id).
    success(function(data) {
      $scope.chronicle = data;
      $scope.chronicle.preview_image = $rootScope.imageHelper.getImage($scope.chronicle.images, "completa");
      $scope.content_chronicle = $sce.trustAsHtml($scope.chronicle.content);
      $scope.content_summary = $sce.trustAsHtml($scope.chronicle.summary);
    });
}

function chronicles_edit($scope, $http, $location, $routeParams) {
  $scope.chronicle = {};
  $http.get('/api/chronicles/' + $routeParams.id).
    success(function(data) {
      $scope.chronicle = data;
    });

  $scope.editChronicle = function () {
    $scope.chronicle.content  = $("#contentarea").html();
    $http.put('/api/chronicles/' + $routeParams.id, $scope.chronicle).
      success(function(data) {
        $location.url('/readPost/' + $routeParams.id);
      });
  };
}

function chronicles_delete($scope, $http, $location, $routeParams) {
  $http.get('/api/chronicles/' + $routeParams.id).
    success(function(data) {
      $scope.league = data;
    });

  $scope.deleteChronicle = function () {
    $http.delete('/api/chronicles/' + $routeParams.id).
      success(function(data) {
        $location.url('/');
      });
  };

  $scope.home = function () {
    $location.url('/');
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
}

function advertisings_add($scope, $http, $location, $routeParams ) {
  var queryString = $.param( $routeParams );
  $scope.form = {};
  $scope.submitAdvertising = function () {
    if(queryString.match){
      $scope.advertising.match = queryString.match;
    }
    $scope.advertising.content  = $("#contentarea").html();
    $http.post('/api/advertisings', $scope.advertising).
      success(function(data) {
        $location.path('/');
      });
  };
}

function advertisings_view($scope, $http, $routeParams, $rootScope, $sce) {
  $http.get('/api/advertisings/' + $routeParams.id).
    success(function(data) {
      data.preview_image = $rootScope.imageHelper.getImage(data.images,  data.type);
      $scope.advertising = data;
    });

  $scope.removeImage = function(image_id){
    $http.delete('/api/images/advertising/'+$scope.advertising._id + '/'+ image_id).
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
    $http.put('/api/advertisings/' + $routeParams.id, $scope.advertising).
      success(function(data) {
        $location.url('/readPost/' + $routeParams.id);
      });
  };
}

function advertisings_delete($scope, $http, $location, $routeParams) {
  $http.get('/api/advertisings/' + $routeParams.id).
    success(function(data) {
      $scope.league = data;
    });

  $scope.deleteAdvertising = function () {
    $http.delete('/api/advertisings/' + $routeParams.id).
      success(function(data) {
        $location.url('/');
      });
  };

  $scope.home = function () {
    $location.url('/');
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
        data[i].trusted_summary = $sce.trustAsHtml(data[i].summary);
      };
      $scope.rules = data;
    });
}

function rules_add($scope, $http, $location) {
  $scope.form = {};
  $scope.submitRule = function () {
    $scope.rule.content  = $("#contentarea").html();
    $http.post('/api/rules', $scope.rule).
      success(function(data) {
        $location.path('/');
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
    $http.put('/api/rules/' + $routeParams.id, $scope.rule).
      success(function(data) {
        $location.url('/readPost/' + $routeParams.id);
      });
  };
}

function rules_delete($scope, $http, $location, $routeParams) {
  $http.get('/api/rules/' + $routeParams.id).
    success(function(data) {
      $scope.league = data;
    });

  $scope.deleteRule = function () {
    $http.delete('/api/rules/' + $routeParams.id).
      success(function(data) {
        $location.url('/');
      });
  };

  $scope.home = function () {
    $location.url('/');
  };
}

/*TUrns*/
function turns_index($scope, $http) {
  $http.get('/api/turns').
    success(function(data, status, headers, config) {
      $scope.turns = data;
    });
}

function turns_add($scope, $http, $location) {
  $scope.form = {};
  $scope.submitTurn = function () {
    $http.post('/api/turns', $scope.form).
      success(function(data) {
        $location.path('/');
      });
  };
}


function turns_view($scope, $http, $routeParams, $rootScope, $location) {
    $http.get('/api/turns/' + $routeParams.id).
      success(function(data) {
        $scope.turn = data;
    });
    $scope.deleteTurn = function () {
    $http.delete('/api/turns/' + $routeParams.id).
      success(function(data) {
        $location.url('/');
      });
  };
  
}

function turns_edit($scope, $http, $location, $routeParams) {
  $scope.form = {};
  $http.get('/api/turns/' + $routeParams.id).
    success(function(data) {
      $scope.form = data;
    });

  $scope.editTurn = function () {
    $http.put('/api/turns/' + $routeParams.id, $scope.form).
      success(function(data) {
        $location.url('/readPost/' + $routeParams.id);
      });
  };
}

function rules_delete($scope, $http, $location, $routeParams) {
  $http.get('/api/rules/' + $routeParams.id).
    success(function(data) {
      $scope.league = data;
    });

  $scope.deleteRule = function () {
    $http.delete('/api/rules/' + $routeParams.id).
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
      "uniforme" : {"height":115 , "width":50},
      "cara" : {"height":80, "width":80},
      "copa" : {"height":70 , "width":100},
      "encabezado" : {"height":100 , "width":400},
      "lateral" : {"height":60 , "width":100}
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
      .post('/api/images/'+$routeParams.param+'/'+ $routeParams.id, $scope.image)
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
          $rootScope.$broadcast('savedImage', {id:$routeParams.id,image:image})
        }
      })
      .error(function (data, status, headers, config) {
        
      });
  };
}
