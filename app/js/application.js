'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module( 'ngDrawing', [
  'ngRoute',
  'ngDrawing.filters',
  'ngDrawing.services',
  'ngDrawing.directives',
  'ngDrawing.controllers'
]);

app.config([ '$routeProvider', function( $routeProvider ) {
  $routeProvider.when( '/intro', {
    templateUrl: 'assets/template/intro.html', 
    controller: 'introController'
  });
  $routeProvider.when( '/playground', {
    templateUrl: 'assets/template/playground.html', 
    controller: 'playgroundController'
  });

  $routeProvider.otherwise({ redirectTo: '/intro' });
}]);


var services = angular.module('ngDrawing.services', []);