
// // Simple service to get data passing a specific url
// services.factory('dataFactory', [
//   '$http',
//   function( $http ) {

//     return {
//       get: function( url ) {
//         return $http
//           .get(url)
//           .then(function( resp ) {
//             return resp.data;
//         });
//       }
//     };

//   }
// ]);

// services.factory('canvasDrawerFactory', [
//   'bucketToolService',
//   function( bucketToolService ) {

//     var canvasDrawerFactory = function () {
//       // TODO 
//       // creating a proper Object with attributes (x,y,h,w,c)
//       // and adding it into this array
//       // it would be possible to delete, move and so on.
//       // I just save a string for now
//       this.shapes = [];
//     };

//     canvasDrawerFactory.prototype.rectangle = function( context, x, y, width, height, colour) {
//       context.beginPath();
//       context.rect( x, y, width, height );
//       context.lineWidth   = 2;
//       context.strokeStyle = colour;
//       context.stroke();

//       this.shapes.push('rectangle');
//     };

//     canvasDrawerFactory.prototype.line = function( context, x1, y1, x2, y2, colour ) {
//       context.beginPath();
//       context.moveTo( x1, y1 );
//       context.lineTo( x2, y2 );
//       context.stroke();
//       context.lineWidth   = 2;
//       context.strokeStyle = colour;
//       context.stroke();

//       this.shapes.push('line');
//     };

//     canvasDrawerFactory.prototype.bucket = function( context, x, y, colour ) {

//       bucketToolService.init( context );
//       bucketToolService.paint( x, y, colour);

//     };

//     return new canvasDrawerFactory();
//   }
// ]);

// // Inspiration from William Malone
// services.service("bucketToolService", function() {

//   var context;
//   var canvasWidth;
//   var canvasHeight;
//   var curColour = {};
//   var colorLayerData;
//   var outlineLayerData;
//   var curLoadResNum = 0;

//   var hexToR = function(h) {
//       return parseInt( (cutHex(h) ).substring( 0, 2 ), 16 );
//     };
//   var hexToG = function(h) {
//       return parseInt( (cutHex(h)).substring( 2, 4 ), 16 );
//     };
//   var hexToB = function(h) {
//       return parseInt( (cutHex(h)).substring( 4, 6 ), 16 );
//     };
//   var cutHex = function (h) {
//       return ( h.charAt(0) === "#" ) ? h.substring( 1, 7 ): h;
//     };

//   // Clears the canvas.
//   var clearCanvas = function () {

//       context.clearRect(0, 0, context.canvas.width, context.canvas.height);
//     };

//     // Draw the elements on the canvas
//   var redraw = function () {
//       clearCanvas();
//       // Draw the current state of the color layer to the canvas
//       context.putImageData(colorLayerData, 0, 0);
//     };

//   var matchOutlineColor = function (r, g, b, a) {
//       return (r + g + b < 100 && a === 255);
//     };

//   var matchStartColor = function (pixelPos, startR, startG, startB) {

//       var r = outlineLayerData.data[pixelPos],
//         g = outlineLayerData.data[pixelPos + 1],
//         b = outlineLayerData.data[pixelPos + 2],
//         a = outlineLayerData.data[pixelPos + 3];

//       // If current pixel of the outline image is black
//       if (matchOutlineColor(r, g, b, a)) {
//         return false;
//       }

//       r = colorLayerData.data[pixelPos];
//       g = colorLayerData.data[pixelPos + 1];
//       b = colorLayerData.data[pixelPos + 2];

//       // If the current pixel matches the clicked color
//       if (r === startR && g === startG && b === startB) {
//         return true;
//       }

//       // If current pixel matches the new color
//       if (r === curColour.r && g === curColour.g && b === curColour.b) {
//         return false;
//       }

//       return true;
//     };

//   var colorPixel = function (pixelPos, r, g, b, a) {

//       colorLayerData.data[pixelPos] = r;
//       colorLayerData.data[pixelPos + 1] = g;
//       colorLayerData.data[pixelPos + 2] = b;
//       colorLayerData.data[pixelPos + 3] = a !== undefined ? a : 255;
//     };

//   var floodFill = function (startX, startY, startR, startG, startB) {

//     var newPos;
//     var x;
//     var y;
//     var pixelPos;
//     var reachLeft;
//     var reachRight;
//     var drawingBoundLeft   = 0;
//     var drawingBoundTop    = 0;
//     var drawingBoundRight  = angular.copy(canvasWidth - 1);
//     var drawingBoundBottom = angular.copy(canvasHeight - 1);
//     var pixelStack = [[startX, startY]];

//     while (pixelStack.length) {

//       newPos = pixelStack.pop();
//       x = newPos[0];
//       y = newPos[1];

//       // Get current pixel position
//       pixelPos = (y * canvasWidth + x) * 4;

//       // Go up as long as the color matches and are inside the canvas
//       while (y >= drawingBoundTop && matchStartColor(pixelPos, startR, startG, startB)) {
//         y -= 1;
//         pixelPos -= canvasWidth * 4;
//       }

//       pixelPos += canvasWidth * 4;
//       y += 1;
//       reachLeft = false;
//       reachRight = false;

//       // Go down as long as the color matches and in inside the canvas
//       while (y <= drawingBoundBottom && matchStartColor(pixelPos, startR, startG, startB)) {
//         y += 1;

//         colorPixel(pixelPos, curColour.r, curColour.g, curColour.b);

//         if (x > drawingBoundLeft) {
//           if (matchStartColor(pixelPos - 4, startR, startG, startB)) {
//             if (!reachLeft) {
//               // Add pixel to stack
//               pixelStack.push([x - 1, y]);
//               reachLeft = true;
//             }
//           } else if (reachLeft) {
//             reachLeft = false;
//           }
//         }

//         if (x < drawingBoundRight) {
//           if (matchStartColor(pixelPos + 4, startR, startG, startB)) {
//             if (!reachRight) {
//               // Add pixel to stack
//               pixelStack.push([x + 1, y]);
//               reachRight = true;
//             }
//           } else if (reachRight) {
//             reachRight = false;
//           }
//         }

//         pixelPos += canvasWidth * 4;
//       }
//     }
//   };

//   // Start painting with paint bucket tool starting from pixel specified by startX and startY
//   var paintAt = function (startX, startY) {

//     var pixelPos = (startY * canvasWidth + startX) * 4,
//       r = colorLayerData.data[pixelPos],
//       g = colorLayerData.data[pixelPos + 1],
//       b = colorLayerData.data[pixelPos + 2],
//       a = colorLayerData.data[pixelPos + 3];

//     if (r === curColour.r && g === curColour.g && b === curColour.b) {
//       // Return because trying to fill with the same color
//       return;
//     }

//     if (matchOutlineColor(r, g, b, a)) {
//       // Return because clicked outline
//       return;
//     }

//     floodFill(startX, startY, r, g, b);

//     redraw();
//   };

//   var service = {
//     // Creates a canvas element, loads images, adds events, and draws the canvas for the first time.
//     init: function (ctx) {
//       context = ctx;

//       canvasWidth  = context.canvas.width;
//       canvasHeight = context.canvas.height;

//       try {
//         outlineLayerData = context.getImageData(0, 0, canvasWidth, canvasHeight);
//       } catch (ex) {
//         console.error("Application cannot be run locally. Please run on a server.");
//         return;
//       }

//       colorLayerData = context.getImageData(0, 0, canvasWidth, canvasHeight);
//     },

//     // colour hex format: "#454567"
//     paint: function( x, y, colour ) {

//       curColour.r = hexToR( colour );
//       curColour.g = hexToG( colour );
//       curColour.b = hexToB( colour );

//       paintAt( x, y );
//     }

//   };
  
//   return service;
  
// });


// services.service("sanitiser", function() {

// });
