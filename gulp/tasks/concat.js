var gulp = require('gulp');
var concat = require('gulp-concat');
console.log('yo')
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
