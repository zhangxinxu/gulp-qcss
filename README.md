# gulp-qcss
write css quickly as rocket!

## Use example

<pre>
var gulp = require('gulp');

var qcss = require('gulp-qcss');

gulp.task('default', function () {
    gulp.src('src/test.qcss')
        .pipe(qcss())
        .pipe(gulp.dest('dist/'));
});
</pre>

