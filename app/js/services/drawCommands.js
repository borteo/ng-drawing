
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