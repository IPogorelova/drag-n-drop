'use strict';

const gulp = require('gulp');

// utilities
const runSequence = require('run-sequence');
const del = require('del');
const cache = require('gulp-cache');
const browserSync = require('browser-sync').create();

// sourcemaps
const sourcemaps = require('gulp-sourcemaps');

// javascript
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const concat = require('gulp-concat');

// css
const postcss = require('gulp-postcss');
const csso = require('gulp-csso');

// html
const htmlmin = require('gulp-htmlmin');
const nunjucksRender = require('gulp-nunjucks-render');
const validator = require('gulp-html');

// images
const imagemin = require('gulp-imagemin');

const src_dir = 'src/**';
const html_src = `src/html/*.html`;
const css_src = `src/css/*.css`;
const js_src = `src/js/*.js`;
const dest_dir = 'dist';
const dest_dir_html = `${dest_dir}/**/*.html`
const dest_dir_css = `${dest_dir}/css`
const dest_dir_js = `${dest_dir}/js`

const postcssPlugins = [
  require('postcss-import'),
  require('precss'),
  require('postcss-short'),
  require('postcss-use'),
  require('postcss-utilities'),
  require('autoprefixer'),
  require('cssnext'),
  require('postcss-normalize')({ forceImport: true }),
  // require('colorguard'),
  // require('stylelint'),
  require("postcss-reporter")({ clearReportedMessages: true }),
];

const htmlminConfig = {
  collapseWhitespace: true,
  removeComments: true
};

gulp.task('js', () =>
  gulp.src(js_src)
  .pipe( sourcemaps.init() )
  .pipe( babel() )
  .pipe( eslint() )
  // .pipe( uglify() )
  // .pipe( eslint.format() )
  .pipe( sourcemaps.write(".") )
  .pipe( gulp.dest(dest_dir_js) )
);

gulp.task('css', () =>
  gulp.src(css_src)
  // .pipe( less() )
  .pipe( sourcemaps.init() )
  .pipe( postcss(postcssPlugins) )
  .pipe( sourcemaps.write('.') )
  // .pipe(csso())
  .pipe( gulp.dest(dest_dir_css) )
  .pipe( browserSync.reload({ stream: true }))
);

gulp.task('nunjucks', () =>
  gulp.src('src/pages/**/*.+(nunjucks)')
  // Renders template with nunjucks
  .pipe(nunjucksRender({
      path: ['src/templates']
    }))
  .pipe(gulp.dest('src/html'))
);

gulp.task('html', ['nunjucks'], () =>
  gulp.src(html_src)
  // .pipe( htmlmin(htmlminConfig) )
  // .pipe(validator())
  .pipe( gulp.dest(dest_dir) )
);

gulp.task('browserSync', () =>
  browserSync.init({
    server: {
      baseDir: './'
    },
  })
)

gulp.task('images', () =>
  gulp.src('src/images/**/*.+(png|jpg|gif|svg)')
  .pipe( cache( imagemin() ) )
  .pipe( gulp.dest('dist/images') )
);



gulp.task('watch', ['browserSync'], () => {
  gulp.watch(css_src, ['css']);
  gulp.watch(js_src, ['js']);
  gulp.watch(dest_dir_html, browserSync.reload)
  gulp.watch(dest_dir_js, browserSync.reload)
});

gulp.task('clean', () => del([dest_dir]) );
gulp.task('default', ['clean'], () => runSequence('css', 'js', 'images') );
