const gulp = require('gulp')
const rename = require('gulp-rename')
const babel = require('gulp-babel')

gulp.task('babel', () => {
    return gulp.src('src/main/webapp/im.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(rename('im-ie.js'))
        .pipe(gulp.dest('src/main/webapp'))
})