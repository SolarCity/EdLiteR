var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');

gulp.task('default', ['concat']);

gulp.task('concat', function(stuff){
  gulp.src([
    'www/js/*.js',
    'www/js/states/*.js',
    'www/js/services/*.js',
    'www/js/controllers/*.js',
    'www/js/directives/*.js',
    ])
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./www/js'))
})

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});
