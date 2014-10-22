/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
   WATCH

   watches for changes in source stylesheets and scripts

   when activated sets isWatching flag that triggers
   watchify to wrap around browserify in the scripts task

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

var gulp  = require('gulp')
var concat = require('gulp-concat');


var paths = {
  styles:    './src/css/**/*.css',
  scripts:   './www/js/**/*.js'
}

gulp.task('scripts', function() {
  return   gulp.src([
    'www/js/*.js',
    'www/js/states/*.js',
    'www/js/services/*.js',
    'www/js/controllers/*.js',
    'www/js/directives/*.js',
    ])
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./www/js'))
})

global.isWatching = true;

gulp.task('watch', function(){
  // gulp.watch(paths.styles,  ['concat'])
  gulp.watch(paths.scripts, ['scripts'])
})
