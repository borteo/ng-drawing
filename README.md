
# ng-drawer

Web app that draws shapes on a page based on a user's commands.

Current version: 0.3


## Features
- Command line interface
- Autocomplete
- Graceful error handling
- Responsive
- General development features:
  - Sass (with compass, Ruby required)
  - Grunt.js, Bower

#### Installation


- clone repo
- Change Twitter username and Disqus shortname in `default.hbs` (just find **justusebrain** for Twitter and **theaqua** for Disqus)
- Drop theme to `/content/themes` and change Ghost settings.
    

## Getting Started
To get you started you can simply clone the ng-drawer repository and install the dependencies:

### Prerequisites

You need git to clone the ng-drawer repository. You can get it from
[http://git-scm.com/](http://git-scm.com/).

I also use a number of node.js tools to initialise nd-drawer. You must have node.js and
its package manager (npm) installed. You can get them from [http://nodejs.org/](http://nodejs.org/).

Public folder already contains the compiled CSS files.
In order to compile Sass by yourself with Compass, you have to install ruby, rubygem and finally compass gem.
[https://rubygems.org/](https://rubygems.org/)


### Clone ng-drawer

Clone the ng-drawer repository using [git][git]:

```
git clone https://github.com/borteo/ng-drawer.git
cd ng-drawer
```

### Install Dependencies

There are two kinds of dependencies in this project: tools and angular framework code. The tools help
to manage the application.

* We get the tools we depend upon via `npm`, the [node package manager][npm].
* We get the angular code via `bower`, a [client-side code package manager][bower].
* `Grunt` concatenates JavaScript and compiles Sass, a [JavaScript task runner][grunt].


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


