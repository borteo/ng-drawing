
# ng-drawing

Web app that draws shapes on a page based on a user's commands.

Current version: 0.1

## Features

- Command line interface
- Autocomplete
- Graceful error handling
- Responsive
- General development features:
  - Sass (with compass, Ruby required)
  - Grunt.js, Bower    


## Getting Started

To get you started you can simply clone the ng-drawing repository and install the dependencies:

### Prerequisites

You need git to clone the ng-drawing repository. You can get it from
[http://git-scm.com/](http://git-scm.com/).

I also use a number of node.js tools to initialise ng-drawing. You must have node.js and
its package manager (npm) installed. You can get them from [http://nodejs.org/](http://nodejs.org/).

Public folder already contains the compiled CSS files.
In order to compile Sass by yourself with Compass, you have to install ruby, rubygem and finally compass gem.
[https://rubygems.org/](https://rubygems.org/)


### Clone ng-drawing

Clone the ng-drawing repository using [git](http://git-scm.com/):

```
git clone https://github.com/borteo/ng-drawing.git
cd ng-drawing
```

### Install Dependencies

There are two kinds of dependencies in this project: tools and angular framework code. The tools help
to manage the application.

* We get the tools we depend upon via `npm`, the [node package manager](https://www.npmjs.org/).
* We get the angular code via `bower`, a [client-side code package manager](http://bower.io/).
* `grunt` concatenates JavaScript and compiles Sass, a [JavaScript task runner](http://gruntjs.com/).


I have preconfigured `npm` to automatically run `bower` so we can simply do:

```
npm install
```

Behind the scenes this will also call `bower install`. You should find that you have two new folders in your project.

* `node_modules` - contains the npm packages for the tools we need
* `public/components` - contains the angular framework files


### Run the Application

I have preconfigured the project with a simple development web server.  The simplest way to start the server is:

```
npm start
```

Now browse to the app at `http://localhost:8000/drawing.html`


### Run tasks with grunt
- Run `grunt watch` (for live compiling SCSS and JS) 
- Run `grunt` for build


## Directory Layout

    app/                --> all of the files to be used in development
      css/              --> css files (Sass)
      js/               --> javascript files
        application.js  --> application
        controllers.js  --> application controllers
        directives.js   --> application directives
        services/       --> custom angular services 

    public/             --> production files
      css/              --> compiled css files
      js/               --> compiled javascript file
        main.js         --> concatenated main javascript file
      template/         --> angular templates/view partials
      drawing.html      --> app layout file (the main html template file of the app)


## Application walkthrough

I imagined that this was the first page I was building of a large site, used by other developers and designers.

I've chosen to use Angular in order to have a scalable, maintainable, yet easy to customise web application.

Angular implements MVC by asking you to split your app into MVC components. It's not possible to write shortcuts between components that break abstractions just to make them fit easier.

### AngularJS combined with HTML5 canvas

Angular is ideally suited for writing applications in declarative style. Once you hit the canvas element you cannot go any further with declarative and you have to switch towards an imperative way of writing mechanism. 

But the beauty of AngularJS is the `directive`. Thus the imperative code is hidden in the reusable implementation of the directive. The developer get to write the imperative code once and use it declaratively as the solution and re-use it.

Many of the popular charting and graphing JS libraries are starting to support AngularJS by providing the directives for their components.


### Directives

The container directive is called painter, this component can be used in every page simply using the tag `<painter>`.

Painter contains the following directives:
- notification: to visualise the error raised from the typeahead
- drawing-panel: the canvas with customisable attribute: width, height and inline-style for the babkground-color 
- typeahead: the input text which provides a simple autocomplete to suggest the commands available

Design pattern chain of responsabilities is used to communicate (`$emit`) to the father that an event has been triggered.
This is used to communicate the command from the typeahead to the canvas and to the notification.

The event gets propagated from the father to the children when the scope of the directive is by default set to false.

### Services and Factories

These components are singletons. There is only one object, but is injected into many places.

Most of the directives use services and/or factories. 
In order to keep them sorted I have created a folder called services which contains several files for every service/factory


- bucketService: has the logic to flood-fill the canvas.
- canvasDrawFactory: contains the methods to draw the shapes. I created a instance variable `shapes` to keep in an array all the shapes created. 
This can be improved saving and array of objects, and every object can be `new Shape( attributes )` in order to have an instance of every shape created and manipulate position, dimension, colour and so on. (drag and drop would be easy to implement).
- drawCommands: this is an array of objects. It's used by the autocomplete to show the commmands, and by the commandService to check if the command written is well formatted.
The convention for the format is `number` for the dimensions and positions and `colour` for the hex colour (3 or 6 digits). That's easily scalable to other formats.
- commandService: instance of the command sent. Directives use the `command` and `params` instance variables to create the shapes, fill the canvas or change the background.
