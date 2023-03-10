const { src, dest, series, watch, parallel } = require('gulp')
const less = require('gulp-less');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer')
const rename = require('gulp-rename');
const concat = require('gulp-concat')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify-es').default
const notify = require('gulp-notify')
const sourcemaps = require('gulp-sourcemaps')
const del = require('del');
const browserSync = require('browser-sync').create()

const paths = {
  html: {
    src: '*.html',
    dest: 'dist'
  },
  styles: {
    src: 'src/styles/**/*.less',
    dest: 'dist/css'
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'dist/js'
  },
}

const clean = ()=> {
  return del(['dist'])
}
const cleanNode = ()=> {
  return del(['node_modules'])
}

const html = ()=> {
  return src(paths.html.src)
  .pipe(dest(paths.html.dest))
}

const styles = ()=> {
  return src(paths.styles.src)
  .pipe(sourcemaps.init())
  .pipe(less())
  .pipe(rename({
    basename: 'main',
    suffix: '.min'
  }))
  .pipe(sourcemaps.write('.'))
  .pipe(dest(paths.styles.dest))
  .pipe(browserSync.stream())
}

const stylesProd = ()=> {
  return src(paths.styles.src)
  .pipe(less())
  .pipe(autoprefixer({
    cascade: false
  }))
  .pipe(cleanCSS({level: 2}))
  .pipe(rename({
    basename: 'main',
    suffix: '.min'
  }))
  .pipe(dest(paths.styles.dest))
  .pipe(browserSync.stream())
}

const scripts = ()=> {
  return src(paths.scripts.src)
  .pipe(sourcemaps.init())
  .pipe(concat('main.min.js'))
  .pipe(sourcemaps.write('.'))
  .pipe(dest(paths.scripts.dest))
  .pipe(browserSync.stream())
}

const scriptsProd = ()=> {
  return src(paths.scripts.src)
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .pipe(concat('main.min.js'))
  .pipe(uglify({
    toplevel: true
  }).on('error', notify.onError()))
  .pipe(dest(paths.scripts.dest))
  .pipe(browserSync.stream())
}


const watchFailes = () => {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  })
}

const build = series(clean, parallel(html, styles, scripts), watchFailes)
const prodaction = series(clean, parallel(html, stylesProd, scriptsProd), watchFailes)


watch(paths.styles.src, styles)
watch(paths.html.src, html)
watch(paths.scripts.src, scripts)

exports.clean = clean;
exports.del = cleanNode;

exports.default = build
exports.prod = prodaction

//
// const svgSprite = require('gulp-svg-sprite')
// const image = require('gulp-image')
// const notify = require('gulp-notify')
//
//
// const resources = () => {
//   return src('src/resources/**')
//   .pipe(dest('dist'))
// }

// const html = () => {
//   return src('Compiled-HTML/index.html')
//   .pipe(dest('dist'))
//   .pipe(browserSync.stream())
// }

// const styles = () => {
//   return src(['src/css/*.css', 'src/css/*.map'])
//     .pipe(dest('dist'))
//     .pipe(browserSync.stream())
//   }

//   const stylesProd = () => {
//     return src('src/styles/**/*.css')
//       .pipe(concat('main.css'))
//       .pipe(autoprefixer({
//         cascade: false
//       }))
//       .pipe(cleanCss({
//         level: 2
//       }))
//       .pipe(dest('dist'))
//       .pipe(browserSync.stream())
//     }

//     const scripts = () => {
//       return src([
//         'src/js/components/**/*.js',
//         'src/js/main.js',
//       ])
//       .pipe(sourcemaps.init())
//       .pipe(concat('main.js'))
//       .pipe(sourcemaps.write())
//       .pipe(dest('dist'))
//       .pipe(browserSync.stream())
//     }

//     const scriptsProd = () => {
//       return src([
//         'src/js/components/**/*.js',
//         'src/js/main.js',
//       ])
//       .pipe(babel({
//         presets: ['@babel/env']
//       }))
//       .pipe(concat('main.js'))
//       .pipe(uglify({
//         toplevel: true
//       }).on('error', notify.onError()))
//       .pipe(dest('dist'))
//       .pipe(browserSync.stream())
//     }

// const svgSprites = () => {
//   return src('src/img/svg/**/*.svg')
//   .pipe(svgSprite({
//     mode: {
//       stack: {
//         sprite: '../sprite.svg'
//       }
//     }
//   }))
//   .pipe(dest('dist/images'))
// }

// const images = () => {
//   return src([
//     'src/img/**/*.jpg',
//     'src/img/**/*.jpeg',
//     'src/img/**/*.png',
//     'src/img/**.jpg',
//     'src/img/**.jpeg',
//     'src/img/**.png',
//     'src/img/*.svg',
//   ])
//   .pipe(image())
//   .pipe(dest('dist/images'))
// }


// watch('Compiled-HTML/index.html', html)
// watch('src/css/*.css', styles)
// watch('src/css/*.map', styles)
// watch('src/js/**/*.js', scripts)
// watch('src/resources/**', resources)
// watch('src/img/*.{jpg,jpeg,png,svg}', images);
// watch('src/img/**/*.{jpg,jpeg,png}', images);
// watch('src/img/svg/**.svg', svgSprites);

// exports.clean = clean
// exports.styles = styles
// exports.scripts = scripts
// exports.default = series(clean, resources, images, svgSprites, scripts, styles, html,  watchFailes)
// exports.prod = series(clean, resources, scriptsProd, images, svgSprites, watchFailes)
