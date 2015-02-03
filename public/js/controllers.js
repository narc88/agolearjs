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

  $rootScope.imageHelper = {};
  $rootScope.imageHelper.getImage = function(images, type){
    for (var i = images.length - 1; i >= 0; i--) {
      if(images[i].type === type){
        return images[i];
      }
    };  
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

function teams_view($scope, $http, $routeParams, $rootScope) {
  function trigger(event,data) {
    $scope.team.images.push(data.image);
  }
  $http.get('/api/teams/' + $routeParams.id).
    success(function(data) {
      $scope.team = data;
      $scope.team.logo_image = $rootScope.imageHelper.getImage($scope.team.images, "escudo");
      $scope.$on('savedImage', trigger);
    });
  $http.get('/api/suspensionsByTeam?team=' + $routeParams.id).
    success(function(data) {
      $scope.suspensions = data;
    });
  $http.get('/api/matchesLastPlayed?team=' + $routeParams.id).
    success(function(data) {
      $scope.last_played_matches = data;
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
    return data;
  }
  $http.get('/api/matches/' + $routeParams.id).
    success(function(data) {
      $scope.match = populateMatchPlayers(data, data);
      
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
        $http.post('/api/matches/incidents/'+role+"/"+$scope.match._id, $scope.incident).
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

function chronicles_add($scope, $http, $location) {
  $scope.form = {};
  $scope.submitChronicle = function () {
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
/*images*/
function images_add($rootScope, $scope, $http, $window, $location, $routeParams){
  var cropperImageSizesByType = {
      "normal" : {"height": 300, "width": 230},
      "escudo" : {"height":100, "width":100},
      "logo" : {"height":120 , "width":120},
      "completa" : {"height": 230, "width":300},
      "uniforme" : {"height":115 , "width":50},
      "cara" : {"height":80, "width":80},
      "copa" : {"height":70 , "width":100}
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
      .post('/images/'+$routeParams.param+'/'+ $routeParams.id, $scope.image)
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
          $rootScope.$broadcast('savedImage', {id:id,image:image})
        }
      })
      .error(function (data, status, headers, config) {
        
      });
  };
}


function images_delete($scope, $http, $location, $routeParams) {
  $http.get('/api/images/' + $routeParams.id).
    success(function(data) {
      $scope.league = data;
    });

  $scope.deleteimage = function () {
    $http.delete('/api/images/' + $routeParams.id).
      success(function(data) {
        $location.url('/');
      });
  };

  $scope.home = function () {
    $location.url('/');
  };
}
