/**
 * test file by zhangxinxu
 */

var gulp = require('gulp');

var qcss = require('../index');

gulp.task('default', function () {
    gulp.src('src/test.qcss')
        .pipe(qcss())
        .pipe(gulp.dest('dist/'));
});