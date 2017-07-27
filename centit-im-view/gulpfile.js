const gulp = require('gulp')
const rename = require('gulp-rename')
const babel = require('gulp-babel')
const watch = require('gulp-watch')

gulp.task('babel', () => {
    return gulp.src('src/main/webapp/im.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(rename('im-ie.js'))
        .pipe(gulp.dest('src/main/webapp'))
})

gulp.task('default', function() {
    return watch('src/main/webapp/im.js', { ignoreInitial: false })
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(rename('im-ie.js'))
        .pipe(gulp.dest('src/main/webapp'))
})
