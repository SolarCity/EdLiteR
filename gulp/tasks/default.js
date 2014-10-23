var gulp = require('gulp')
var runSeq = require('run-sequence')

gulp.task('default', function(){
  runSeq('build', 'watch', 'browserSync')
})
