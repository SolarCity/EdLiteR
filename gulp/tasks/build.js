var gulp = require('gulp')
// var browserSync  = require('browser-sync');
// var reload       = browserSync.reload;

gulp.task('build', ['scripts', 'vendors', 'styles', 'templates', 'fonts'])
