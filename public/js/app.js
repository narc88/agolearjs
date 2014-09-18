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
        templateUrl: '../../partials/users/view',
        controller: users_view
      }).
      when('/users/edit/:id', {
        templateUrl: '../partials/users/edit',
        controller: users_edit
      }).
      when('/users/:id', {
        templateUrl: '../partials/users/delete',
        controller: user_delete
      }).
      otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  }]);