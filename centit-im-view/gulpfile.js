const gulp = require('gulp')
const rename = require('gulp-rename')
const babel = require('gulp-babel')
const watch = require('gulp-watch')

// gulp.task('babel', () => {
//     return gulp.src('src/main/webapp/im.js')
//         .pipe(babel({
//             presets: ['es2015']
//         }))
//         .pipe(rename('im-ie.js'))
//         .pipe(gulp.dest('src/main/webapp'))
// })

gulp.task('babel',()=>{
    return gulp.src('src/main/webapp/src/js/src/*.js')
        .pipe(babel({
            presets:['es2015']
        }))
        .pipe(gulp.dest('src/main/webapp/src/js/ie'))
})

gulp.task('mobile', () => {
    return gulp.src('src/main/webapp/mobile-im.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(rename('mobile-im-ie.js'))
        .pipe(gulp.dest('src/main/webapp'))
})

gulp.task('monitorChat', () => {
    return gulp.src('src/main/webapp/monitorChat.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(rename('monitorChat-ie.js'))
        .pipe(gulp.dest('src/main/webapp'))
})

gulp.task('default',['mobile'], function() {
    return watch('src/main/webapp/im.js', { ignoreInitial: false })
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(rename('im-ie.js'))
        .pipe(gulp.dest('src/main/webapp'))
})
