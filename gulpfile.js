const { src, dest, series, watch } = require('gulp')
const less = require('gulp-less');
const del = require('del');

const paths = {
  styles: {
    src: 'src/styles/**/*.less',
    dest: 'dist/css'
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'dist/js'
  },
}

function clean() {
  return del(['dist'])
}
function styles() {
  return src(paths.styles.src)
    .pipe(less())
    .pipe(dest(paths.styles.dest))
}

exports.clean = clean;
exports.st = styles;
