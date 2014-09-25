'use strict';

// Declare app level module which depends on filters, and services
angular.module('agolear', ['agolear.filters', 'agolear.services', 'agolear.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
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
      when('/leagues/edit/:id', {
        templateUrl: '/partials/leagues/edit.jade',
        controller: leagues_edit
      }).
      when('/leagues/delete/:id', {
        templateUrl: '/partials/leagues/delete.jade',
        controller: league_delete
      }).
      otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  }]);