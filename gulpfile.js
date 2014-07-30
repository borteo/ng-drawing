'use strict';

var gulp       = require('gulp');

var livereload = require('gulp-livereload');
var sass       = require('gulp-sass');
var cleanhtml  = require('gulp-cleanhtml');
var concat     = require('gulp-concat');
var uglify     = require('gulp-uglifyjs');


var src = {
  css: ['app/css/*.scss'],
  partials: ['app/partials/**/*.html'],
  pages: ['app/pages/**/*.html'],
  js: ['app/js/**/*.js'],
};
var dest = {
  css: 'public/assets/css',
  partials: 'public/assets/partials',
  pages: 'public/',
  js: 'public/assets/js/',
};

gulp.task('styles', function () {
  return gulp.src(src.css)
    .pipe( sass({
      outputStyle: 'compressed',
      errLogToConsole: true
    }))
    .pipe(gulp.dest(dest.css));
});

gulp.task('pages', function() {
  return gulp.src(src.pages)
    .pipe(cleanhtml())
    .pipe(gulp.dest(dest.pages));
});

gulp.task('partials', function() {
  return gulp.src(src.partials)
    .pipe(cleanhtml())
    .pipe(gulp.dest(dest.partials));
});

gulp.task('scripts', function() {
  gulp.src(src.js)
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest(dest.js));
});

gulp.task('build', ['styles', 'pages', 'partials', 'scripts']);

gulp.task('server', function () {
  var connect = require('connect');
  var server  = connect();

  server.use(connect.static('public')).listen(process.env.PORT || 9122);
  require('opn')('http://localhost:' + (process.env.PORT || 9122));
});

gulp.task('watch', ['server'], function () {
  gulp.start('build');

  gulp.watch('app/**/*.html', ['pages', 'partials']);
  gulp.watch('app/js/**/*.js', ['scripts']);
  gulp.watch('app/css/*.scss', ['styles']);


  var server = livereload();
  gulp.watch('public/**').on('change', function (file) {
    server.changed(file.path);
  });
});

gulp.task('default', function () {
  gulp.start('build');
});
