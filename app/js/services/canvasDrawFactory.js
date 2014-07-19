
/* Factory used to draw shapes on the canvas */

services.factory('canvasDrawFactory', [
  'bucketService',
  function( bucketService ) {

    var canvasDrawFactory = function () {
      // TODO (out of assignment scope)
      // creating a proper Object with attributes (x,y,h,w,c)
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
