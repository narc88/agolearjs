'use strict';
// Declare app level module which depends on filters, and services
var agolear = angular.module('agolear', ['ngRoute','ngSanitize', 'angulike']).run([
      '$rootScope', function ($rootScope) {
          $rootScope.facebookAppId = '202443209924902'; // set your facebook app id here
      }
  ]).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider, $sceProvider) {
    $routeProvider.
      
      when('/login', {
        templateUrl: '/partials/users/login.jade',
        controller: login
      }).
      when('/users', {
        templateUrl: '/partials/users/index.jade',
        controller: users_index
      }).
      when('/users/add', {
        templateUrl: '/partials/users/form.jade',
        controller: users_add
      }).
      when('/users/:id', {
        templateUrl: '/partials/users/view.jade',
        controller: users_view
      }).
      when('/users/edit/:id', {
        templateUrl: '/partials/users/edit.jade',
        controller: users_edit
      }).
      when('/users/delete/:id', {
        templateUrl: '/partials/users/delete.jade',
        controller: user_delete
      }).
      when('/zones', {
        templateUrl: '/partials/zones/index.jade',
        controller: zones_index
      }).
      when('/zones/add', {
        templateUrl: '/partials/zones/form.jade',
        controller: zones_add
      }).
      when('/zones/:id', {
        templateUrl: '/partials/zones/view.jade',
        controller: zones_view
      }).
      when('/zones/edit/:id', {
        templateUrl: '/partials/zones/edit.jade',
        controller: zones_edit
      }).
      when('/zones/delete/:id', {
        templateUrl: '/partials/zones/delete.jade',
        controller: league_delete
      }).
      when('/leagues', {
        templateUrl: '/partials/leagues/index.jade',
        controller: leagues_index
      }).
      when('/leagues/add', {
        templateUrl: '/partials/leagues/form.jade',
        controller: leagues_add
      }).
      when('/leagues/:id', {
        templateUrl: '/partials/leagues/view.jade',
        controller: leagues_view
      }).
      when('/leagues/:id/edit', {
        templateUrl: '/partials/leagues/edit.jade',
        controller: leagues_edit
      }).
      when('/leagues/delete/:id', {
        templateUrl: '/partials/leagues/delete.jade',
        controller: league_delete
      }).
      when('/players', {
        templateUrl: '/partials/players/index.jade',
        controller: players_index
      }).
      when('/players/add', {
        templateUrl: '/partials/players/form.jade',
        controller: players_add
      }).
      when('/players/:id', {
        templateUrl: '/partials/players/view.jade',
        controller: players_view
      }).
      when('/players/edit/:id', {
        templateUrl: '/partials/players/edit.jade',
        controller: players_edit
      }).
      when('/players/delete/:id', {
        templateUrl: '/partials/players/delete.jade',
        controller: player_delete
      }).
      when('/teams', {
        templateUrl: '/partials/teams/index.jade',
        controller: teams_index
      }).
      when('/teams/add', {
        templateUrl: '/partials/teams/form.jade',
        controller: teams_add
      }).
      when('/teams/:id', {
        templateUrl: '/partials/teams/view.jade',
        controller: teams_view
      }).
      when('/teams/edit/:id', {
        templateUrl: '/partials/teams/edit.jade',
        controller: teams_edit
      }).
      when('/teams/delete/:id', {
        templateUrl: '/partials/teams/delete.jade',
        controller: teams_delete
      }).
      when('/tournaments', {
        templateUrl: '/partials/tournaments/index.jade',
        controller: tournaments_index
      }).
      when('/tournaments/add', {
        templateUrl: '/partials/tournaments/form.jade',
        controller: tournaments_add
      }).
      when('/tournaments/:id', {
        templateUrl: '/partials/tournaments/view.jade',
        controller: tournaments_view
      }).
      when('/tournaments/edit/:id', {
        templateUrl: '/partials/tournaments/edit.jade',
        controller: tournaments_edit
      }).
      when('/tournaments/delete/:id', {
        templateUrl: '/partials/tournaments/delete.jade',
        controller: teams_delete
      }).
      when('/matches', {
        templateUrl: '/partials/matches/index.jade',
        controller: matches_index
      }).
      when('/matches/add', {
        templateUrl: '/partials/matches/form.jade',
        controller: matches_add
      }).
      when('/matches/:id', {
        templateUrl: '/partials/matches/view.jade',
        controller: matches_view
      }).
      when('/matches/edit/:id', {
        templateUrl: '/partials/matches/edit.jade',
        controller: matches_edit
      }).
      when('/matches/delete/:id', {
        templateUrl: '/partials/matches/delete.jade',
        controller: matches_delete
      }).
      when('/chronicles', {
        templateUrl: '/partials/chronicles/index.jade',
        controller: chronicles_index
      }).
      when('/chronicles/add', {
        templateUrl: '/partials/chronicles/form.jade',
        controller: chronicles_add
      }).
      when('/chronicles/:id', {
        templateUrl: '/partials/chronicles/view.jade',
        controller: chronicles_view
      }).
      when('/chronicles/edit/:id', {
        templateUrl: '/partials/chronicles/edit.jade',
        controller: chronicles_edit
      }).
      when('/chronicles/delete/:id', {
        templateUrl: '/partials/chronicles/delete.jade',
        controller: chronicles_delete
      }).
      when('/rules/add/:tournament_id', {
        templateUrl: '/partials/rules/form.jade',
        controller: rules_add
      }).
      when('/rules/:id', {
        templateUrl: '/partials/rules/view.jade',
        controller: rules_view
      }).
      when('/rules/edit/:id', {
        templateUrl: '/partials/rules/edit.jade',
        controller: rules_edit
      }).
      when('/images/add/:param/:id/:format', {
        templateUrl: '/partials/images/upload.jade',
        controller: images_add
      }).
      when('/advertisings', {
        templateUrl: '/partials/advertisings/index.jade',
        controller: advertisings_index
      }).
      when('/advertisings/add', {
        templateUrl: '/partials/advertisings/form.jade',
        controller: advertisings_add
      }).
      when('/advertisings/:id', {
        templateUrl: '/partials/advertisings/view.jade',
        controller: advertisings_view
      }).
      when('/advertisings/edit/:id', {
        templateUrl: '/partials/advertisings/edit.jade',
        controller: advertisings_edit
      }).
      when('/advertisings/delete/:id', {
        templateUrl: '/partials/advertisings/delete.jade',
        controller: advertisings_delete
      }).
      when('/turns', {
        templateUrl: '/partials/turns/index.jade',
        controller: turns_index
      }).
      when('/turns/edit/:id', {
        templateUrl: '/partials/turns/edit.jade',
        controller: turns_edit
      }).
      when('/matches/updateTurn/:id', {
        templateUrl: '/partials/matches/change_turn.jade',
        controller: matches_change_turn
      })
      .otherwise({redirectTo: '/otherwise' });
    $locationProvider.html5Mode(true);
  }]);

agolear.factory('authInterceptor', function ($rootScope, $q, $window) {
    return {
      request: function (config) {
        config.headers = config.headers || {};
        if ($window.sessionStorage.token) {
          config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
        }
        return config;
      },
      response: function (response) {
        if (response.status === 401) {
          // handle the case where the user is not authenticated
        }
        return response || $q.when(response);
      }
    };
  }).config(function ($httpProvider) {
      $httpProvider.interceptors.push('authInterceptor');
    }).controller('UserCtrl', function ($scope, $http, $window) {
      $scope.user = {username: 'john.doe', password: 'foobar'};
      $scope.message = '';
      $scope.submit = function () {
        $http
          .post('/login', $scope.user)
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
    }).controller('HeaderAdvertisingsController', function ($scope, $http, $window, $rootScope) {
     $http.get('/api/advertisings?type=encabezado').
        success(function(data) {
          for (var i = 0; i < data.length; i++) {
            data[i].preview_image = $rootScope.imageHelper.getImage(data[i].images, "encabezado");
          };
          $scope.advertisings = data;
          $(".carousel-inner > .item").first().addClass("active")
          $(".carousel-indicators > li").first().addClass("active")
        });
    }).controller('SidebarAdvertisingsController', function ($scope, $http, $window, $rootScope) {
     $http.get('/api/advertisings?type=lateral').
        success(function(data) {
         for (var i = 0; i < data.length; i++) {
            data[i].preview_image = $rootScope.imageHelper.getImage(data[i].images, "lateral");
          };
          $scope.advertisings = data;
          $(".carousel-inner > .item").first().addClass("active")
          $(".carousel-indicators > li").first().addClass("active")
        });
    }).controller('ScorersAndOthersController', function ($scope, $http, $window, $rootScope) {
      var playersString = function(players){
        var scorers = [];
        for (var i = 0; i < players.length; i++) {
          if(i!=0){
            scorers += ",";
          }
          scorers += players[i].key;
        };
        return scorers;
      }
      var getPlayers = function(players){
        $http.get('/api/players/names?_id='+playersString(players)).
          success(function(data) {
            var top_scorers = $rootScope.tournament_stats.participators_stats.top_scorers;
            for (var i = 0; i < top_scorers.length; i++) {
                var key = top_scorers[i].key;
                $rootScope.tournament_stats.participators_stats.top_scorers[i].player = $.grep(data, function(e){ return e._id == key; })[0];
            };
        });
      }
      $rootScope.$on('tournament_stats', function (event, data) {
        console.log(data); // 'Data to send'
        getPlayers($rootScope.tournament_stats.participators_stats.top_scorers)
      });
      
      $scope.getLessBeaten = function(){
        var less_beaten_temp = [];
        for (var i = 0; i < $rootScope.zones.length; i++) {
            var zone = $rootScope.zones[i]
            for (var k = 0; k < zone.participations.length; k++) {
                var team = {};
                team._id = zone.participations[k]._id;
                team.name = zone.participations[k].team_name;
                team.other_goals = zone.participations[k].other_goals;
                team.played = zone.participations[k].won+ zone.participations[k].tied+ zone.participations[k].lost;
                less_beaten_temp.push(team);
            };
        };
        function compare(a,b) {
          if (a.other_goals < b.other_goals)
             return -1;
          if (a.other_goals > b.other_goals)
            return 1;
          return 0;
        }
        $rootScope.tournament_stats.less_beaten = less_beaten_temp.sort(compare).slice(0, 10);
      }
     
    });
