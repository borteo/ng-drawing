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



/* Controllers */

angular.module( 'ngDrawing.controllers', [])
  .controller( 'introController', [
    '$scope',
    function( $scope ) { }
  ])
  .controller( 'playgroundController', [
    '$scope',
    function( $scope ) { }
  ]);



/* Directives */

var directives = angular.module('ngDrawing.directives', []);

// notification system
directives.directive('notification', [
  '$timeout',
  function( $timeout ) {
    return {
      restrict: 'E',
      templateUrl: 'assets/template/notification.html',
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
      templateUrl: 'assets/template/typeahead.html',

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
      templateUrl: 'assets/template/painter.html',
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


/* Service used to flood-fill the canvas */

services.service('bucketService', function() {
  var context;
  var canvasWidth;
  var canvasHeight;
  var colorLayerData;
  var outlineLayerData;
  var curColour = {};

  // transforms hex colour to RGB
  var hexToR = function(h) {
    return parseInt( (cutHex(h) ).substring( 0, 2 ), 16 );
  };
  var hexToG = function(h) {
    return parseInt( (cutHex(h)).substring( 2, 4 ), 16 );
  };
  var hexToB = function(h) {
    return parseInt( (cutHex(h)).substring( 4, 6 ), 16 );
  };
  var cutHex = function (h) {
    return ( h.charAt(0) === "#" ) ? h.substring( 1, 7 ) : h;
  };

  // Clears the canvas
  var clearCanvas = function() {
    context.clearRect( 0, 0, context.canvas.width, context.canvas.height );
  };

    // Draw the elements on the canvas
  var redraw = function() {
    clearCanvas();
    // Draw the current state of the color layer to the canvas
    context.putImageData(colorLayerData, 0, 0);
  };

  var matchOutlineColor = function( r, g, b, a ) {
    return ( r + g + b < 100 && a === 255 );
  };

  var matchStartColor = function (pixelPos, startR, startG, startB) {

    var r = outlineLayerData.data[ pixelPos ];
    var g = outlineLayerData.data[ pixelPos + 1 ];
    var b = outlineLayerData.data[ pixelPos + 2 ];
    var a = outlineLayerData.data[ pixelPos + 3 ];

    // If current pixel of the outline image is black
    if ( matchOutlineColor( r, g, b, a ) ) {
      return false;
    }

    r = colorLayerData.data[pixelPos];
    g = colorLayerData.data[pixelPos + 1];
    b = colorLayerData.data[pixelPos + 2];

    // If the current pixel matches the clicked color
    if ( r === startR && g === startG && b === startB ) {
      return true;
    }

    // If current pixel matches the new color
    if ( r === curColour.r && g === curColour.g && b === curColour.b ) {
      return false;
    }

    return true;
  };

  var colorPixel = function (pixelPos, r, g, b, a) {
    colorLayerData.data[ pixelPos ]     = r;
    colorLayerData.data[ pixelPos + 1 ] = g;
    colorLayerData.data[ pixelPos + 2 ] = b;
    colorLayerData.data[ pixelPos + 3 ] = a !== undefined ? a : 255;
  };

  // Inspiration from William Malone
  var floodFill = function( startX, startY, startR, startG, startB ) {

    var newPos;
    var x;
    var y;
    var pixelPos;
    var reachLeft;
    var reachRight;
    var drawingBoundLeft   = 0;
    var drawingBoundTop    = 0;
    var drawingBoundRight  = angular.copy(canvasWidth - 1);
    var drawingBoundBottom = angular.copy(canvasHeight - 1);
    var pixelStack = [[startX, startY]];

    while ( pixelStack.length ) {

      newPos = pixelStack.pop();
      x = newPos[0];
      y = newPos[1];

      // Get current pixel position
      pixelPos = (y * canvasWidth + x) * 4;

      // Go up as long as the color matches and are inside the canvas
      while ( y >= drawingBoundTop && matchStartColor( pixelPos, startR, startG, startB ) ) {
        y -= 1;
        pixelPos -= canvasWidth * 4;
      }

      pixelPos += canvasWidth * 4;
      y += 1;
      reachLeft = false;
      reachRight = false;

      // Go down as long as the color matches and in inside the canvas
      while ( y <= drawingBoundBottom && matchStartColor( pixelPos, startR, startG, startB ) ) {
        y += 1;

        colorPixel( pixelPos, curColour.r, curColour.g, curColour.b );

        if ( x > drawingBoundLeft ) {
          if ( matchStartColor(pixelPos - 4, startR, startG, startB ) ) {
            if ( !reachLeft ) {
              // Add pixel to stack
              pixelStack.push([ x - 1, y ]);
              reachLeft = true;
            }
          } else if ( reachLeft ) {
            reachLeft = false;
          }
        }

        if ( x < drawingBoundRight ) {
          if ( matchStartColor( pixelPos + 4, startR, startG, startB ) ) {
            if ( !reachRight ) {
              // Add pixel to stack
              pixelStack.push([ x + 1, y ]);
              reachRight = true;
            }
          } else if ( reachRight ) {
            reachRight = false;
          }
        }

        pixelPos += canvasWidth * 4;
      }
    }
  };

  // Start painting with paint bucket tool starting from pixel specified by startX and startY
  var paintAt = function( startX, startY ) {

    var pixelPos = ( startY * canvasWidth + startX ) * 4;
    var r        = colorLayerData.data[ pixelPos ];
    var g        = colorLayerData.data[ pixelPos + 1 ];
    var b        = colorLayerData.data[ pixelPos + 2 ];
    var a        = colorLayerData.data[ pixelPos + 3 ];

    if ( r === curColour.r && g === curColour.g && b === curColour.b ) {
      // Return because trying to fill with the same color
      return;
    }

    if ( matchOutlineColor( r, g, b, a ) ) {
      // Return because position outline
      return;
    }

    floodFill( startX, startY, r, g, b );

    redraw();
  };

  // public methods available for DI
  var service = {

    // Creates a canvas element, loads images, adds events, and draws the canvas for the first time.
    init: function( ctx ) {
      context = ctx;

      canvasWidth  = context.canvas.width;
      canvasHeight = context.canvas.height;

      try {
        outlineLayerData = context.getImageData( 0, 0, canvasWidth, canvasHeight );
      } catch ( ex ) {
        console.error("Application cannot be run locally. Please run on a server.");
        return;
      }

      colorLayerData = context.getImageData( 0, 0, canvasWidth, canvasHeight );
    },

    // colour hex format: "#454567"
    paint: function( x, y, colour ) {

      // when format is #123 -> #112233
      if ( colour.length === 4) {
        colour = '#' + colour[1] + colour[1] + colour[2] + colour[2] + colour[3] + colour[3];
      }

      curColour.r = hexToR( colour );
      curColour.g = hexToG( colour );
      curColour.b = hexToB( colour );

      paintAt( x, y );
    }

  };
  
  return service;
  
});



/* Factory used to draw shapes on the canvas */

services.factory('canvasDrawFactory', [
  'bucketService',
  function( bucketService ) {

    var canvasDrawFactory = function () {
      // TODO (out of assignment scope)
      // creating a proper Object with attributes (x, y, h, w, c)
      // and adding it into this array
      // it would be possible to delete, move and so on.
      // I just save a string for now
      this.shapes = [];
    };

    canvasDrawFactory.prototype.rectangle = function( context, x, y, width, height, colour) {
      context.beginPath();
      context.rect( x, y, width, height );
      context.lineWidth   = 2;
      context.strokeStyle = colour;
      context.stroke();

      this.shapes.push('rectangle');
    };

    canvasDrawFactory.prototype.line = function( context, x1, y1, x2, y2, colour ) {
      context.beginPath();
      context.moveTo( x1, y1 );
      context.lineTo( x2, y2 );
      context.stroke();
      context.lineWidth   = 2;
      context.strokeStyle = colour;
      context.stroke();

      this.shapes.push('line');
    };

    canvasDrawFactory.prototype.bucket = function( context, x, y, colour ) {
      bucketService.init( context );
      bucketService.paint( x, y, colour);
    };

    return new canvasDrawFactory();
  }
]);


services.service('commandService', [
  'drawCommands',
  function( drawCommands ) {

    var cmdList = drawCommands.list;

    // private methods

    // Is this command param 'cmd' available?   
    var searchCommand = function( cmd ) {
      for ( var i = 0, nodes = cmdList.length; i < nodes; i++) {
        if (cmdList[i].name === cmd) {
          return cmdList[i];
        }
      }
      return false;
    };

    // Are all the params correct?
    // @param:
    // - details of the specific command (drawCommand[command])
    // - cmd is the command to check
    // accepts hex colour: #123 - #123456
    var checkParams = function( details, cmd ) {
      // hex 3 or 6 digits accapted
      var reColour = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;
      
      for ( var i = 0, nodes = details.format.length; i < nodes; i++) {
        
        // check the 'format types'
        if ( details.format[ i ] === "number" ) {
          if ( cmd[ i ] < 0 || cmd[ i ] > 500) { // 500 could be set up in a config file
            return false;
          }
        }

        if ( details.format[ i ] === "colour" ) {
          if ( reColour.test( cmd[ i ] ) === false ) {
            return false;
          }
        }

      }
      return true;

    };


    var service = {

      command: "",
      params: [],

      // check the command
      // @param 
      // - str: command string
      // @return
      // - true: when is correct
      // - string: with the error message
      check: function (str) {

        var cmd = str.split(" ");
        
        // check the first string (command)
        var cmdDetails = searchCommand(cmd[ 0 ]);
        if ( !cmdDetails ) {
          return "Warning: you didn't write the right command.";
        }

        this.command = cmd.shift(); // saves the command to execute
        this.params  = cmd;         // and the params

        if ( !checkParams( cmdDetails, cmd ) ) {
          return "Warning: you didn't write the right parameters.";
        }

        return true;
      }
    };
    
    return service;

  }

]);

/* available commands to draw */

app.constant("drawCommands", (function() {
  
  return {

    list: [
      {
        "name": "clear",
        "description": "clear 'hex colour'",
        "format": [
          "colour"
        ]
      },
      {
        "name": "rectangle",
        "description": "rectangle 'x' 'y' 'w' 'h' 'hex colour'",
        "format": [
          "number",
          "number",
          "number",
          "number",
          "colour"
        ]
      },
      {
        "name": "line",
        "description": "line 'x1' 'y1' 'x2' 'y2' 'hex colour'",
        "format": [
          "number",
          "number",
          "number",
          "number",
          "colour"
        ]
      },
      {
        "name": "fill",
        "description": "fill 'x' 'y' 'hex colour'",
        "format": [
          "number",
          "number",
          "colour"
        ]
      }
    ]

  };
  
})());