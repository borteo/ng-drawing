
/* Simple service to get data passing a specific url */

services.factory('dataFactory', [
  '$http',
  function( $http ) {

    return {
      get: function( url ) {
        return $http
          .get(url)
          .then(function( resp ) {
            return resp.data;
        });
      }
    };

  }
]);
