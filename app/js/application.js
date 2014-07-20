'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module( 'ngDrawing', [
  'ngRoute',
  'ngDrawing.services',
  'ngDrawing.directives',
  'ngDrawing.controllers'
]);

app.config([ '$routeProvider', function( $routeProvider ) {
  $routeProvider.when( '/intro', {
    activePage: 'intro',
    templateUrl: 'assets/template/intro.html',
    controller: 'introController'
  });
  $routeProvider.when( '/playground', {
    activePage: 'playground',
    templateUrl: 'assets/template/playground.html',
    controller: 'playgroundController'
  });

  $routeProvider.otherwise({ redirectTo: '/intro' });
}]);

// used to save the status of the view activated
app.run(['$rootScope', "$route",
  function( $rootScope, $route ) {

    $rootScope.$on("$routeChangeSuccess", function ( scope, next, current ) {
      $rootScope.view = $route.current.activePage;
    });
  }
]);


var services = angular.module('ngDrawing.services', []);

