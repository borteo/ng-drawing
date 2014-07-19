
services.service('commandService', [
  'drawCommands',
  function( drawCommands ) {

    var cmdList = drawCommands.list;

    // private methods

    // Is this command available?   
    var searchCommand = function( cmd ) {
      for ( var i = 0, nodes = cmdList.length; i < nodes; i++) {
        if (cmdList[i].name === cmd) {
          return cmdList[i];
        }
      }
      return false;
    };

    // Are all the params correct?
    // accepts hex colour: #123 - #123456
    var checkParams = function( details, cmd ) {
      var reColour = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;
      
      for ( var i = 0, nodes = details.format.length; i < nodes; i++) {

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