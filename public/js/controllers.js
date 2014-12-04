'use strict';

/* Controllers */

/*Main*/
function main($scope, $http) {
  $http.get('/api/countries').
    success(function(data, status, headers, config) {
      $scope.countries = data;
      $scope.default_country = data[0];
    });
}

/*Users*/
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
      $scope.form = data;
    });

  $scope.editLeague = function () {
    $http.put('/api/leagues/' + $routeParams.id, $scope.form).
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

function zones_view($scope, $http, $routeParams, $rootScope) {
  if((typeof $rootScope.zone === "undefined") || ($routeParams.id != $rootScope.zone.id)){
    $http.get('/api/zones/' + $routeParams.id).
      success(function(data) {
        $scope.zone = data;
        $rootScope.zone = data;
    });
  }else{
    $scope.zone = $rootScope.zone
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

function players_view($scope, $http, $routeParams) {
  $http.get('/api/players/' + $routeParams.id).
    success(function(data) {
      $scope.player = data;
    });
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

function teams_view($scope, $http, $routeParams) {
  $http.get('/api/teams/' + $routeParams.id).
    success(function(data) {
      $scope.team = data;
    });
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

function tournaments_view($scope, $http, $routeParams) {
  $http.get('/api/tournaments/' + $routeParams.id).
    success(function(data) {
      $scope.tournament = data;
    });
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

function player_delete($scope, $http, $location, $routeParams) {
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

function matchdays_view($scope, $http, $routeParams) {
  $http.get('/api/matchdays/' + $routeParams.id).
    success(function(data) {
      $scope.match = data;
    });
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

function player_delete($scope, $http, $location, $routeParams) {
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
  $http.get('/api/matches/' + $routeParams.id).
    success(function(data) {
      $scope.match = data;
      //$scope.match = $rootScope.zone;
      $scope.submitGoal = function (form) {
        $http.post('/api/goals', $scope.goal).
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

function player_delete($scope, $http, $location, $routeParams) {
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
