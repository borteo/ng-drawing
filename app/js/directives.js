
/* Directives */

var directives = angular.module('ngDrawing.directives', []);

// notification system
directives.directive('notification', [
  '$timeout',
  function( $timeout ) {
    return {
      restrict: 'E',
      templateUrl: 'assets/partials/notification.html',
      link: function( scope, elem, attrs ) {

        scope.$on('SEND_NOTIFICATION', function( event, message ) {
          scope.active       = true;
          scope.notification = message;

          // remove error after 3s
          $timeout(function() {
            scope.active = false;
          }, 3000);
        
        });
        
      }
    };
  }
]);

// autocomplete/typeahead
directives.directive('typeahead', [
  'canvasDrawFactory',
  'commandService',
  function( canvasDrawFactory, commandService ) {
    return {
      restrict: 'E',
      scope: {
        prompt:'@',
        title: '@',
        hint: '@',
        items: '=',
        model: '=',
        onSelect: '&'
      },
      templateUrl: 'assets/partials/typeahead.html',

      link: function( scope, elem, attrs ) {
        // private 
        // initialize the typeahead popup box
        var init = function( ) {
          scope.current  = 0;
          scope.selected = true;
        };

        scope.handleSelection = function( title, descr ) {
          init();
          scope.model    = title;
          scope.details  = descr;
          scope.onSelect();
        };

        // used to highlight the selection
        scope.isCurrent = function( index ) {
          return scope.current === index;
        };

        // on hover effect
        scope.setCurrent = function( index ) {
          scope.current = index;
        };

        scope.reset = function() {
          scope.model   = null;
          scope.details = null;
        };

        // sends the new command up to the other directives
        scope.submit = function() {

          // check if the command is written correclty
          // "sanitise" the string
          var checkString = commandService.check( scope.model );
          
          // show the error when gets a string
          if ( typeof checkString === 'string') {
            console.warn( checkString );
            scope.$emit( 'SEND_NOTIFICATION', checkString );
            return;
          }

          // chain of responsibility
          // sends to the right directives
          if (commandService.command === "clear") {
            scope.$emit( 'SEND_CLEAR', scope.model );
          } else {
            scope.$emit( 'SEND_COMMAND', scope.model );
          }
          
        };

        init();
      }
      
    };
  }

]);

directives.directive( 'drawingPanel', [
  'canvasDrawFactory',
  'commandService',
  function( canvasDrawFactory, commandService ) {
    return {
      restrict: "A",
      link: function(scope, element, attr){
        var context = element[0].getContext('2d');

        scope.$on('SEND_COMMAND', function( event, message ) {
          var prm = commandService.params;

          if (commandService.command === "rectangle") {
            canvasDrawFactory.rectangle( context, prm[0], prm[1], prm[2], prm[3], prm[4] );
          }
          if (commandService.command === "line") {
            canvasDrawFactory.line( context, prm[0], prm[1], prm[2], prm[3], prm[4] );
          }
          if (commandService.command === "fill") {
            canvasDrawFactory.bucket( context, prm[0], prm[1], prm[2] );
          }

        });

      }
    };
  }
]);


// main directive - container
// used to initialise typeahead (autocomplete) and canvas directives
directives.directive('painter', [
  'drawCommands',
  'canvasDrawFactory',
  'commandService',
  function( drawCommands, canvasDrawFactory, commandService ) {
    return {
      restrict: 'E',
      templateUrl: 'assets/partials/painter.html',
      link: function( scope, elem, attrs ) {

        // set up canvas size
        scope.canvas = {
          width: 450,
          height: 350,
          background: 'white'
        };

        // get the available commands to draw
        scope.items = drawCommands.list;

        scope.$on('SEND_CLEAR', function( event, message ) {
          scope.canvas.background = commandService.params[0];
        });
        
      }
    };
  }

]);
