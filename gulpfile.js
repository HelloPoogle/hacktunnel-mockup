// Requirements

var
  gulp = require('gulp'),
  newer = require('gulp-newer'),
  del = require('del'),
  imagemin = require('gulp-imagemin'),
  imageresize = require('gulp-image-resize'),
  path = require('path'),
  less = require('gulp-less'),
  bower = require('gulp-bower'),
  pkg = require('./package.json');

// Build variables

var
  devBuild = ((process.env.NODE_ENV || 'dev').trim().toLowerCase() !== 'prod'),
  source = 'source/',
  dest = 'build/',
  images_for_index_page = {
    in: source + 'img/index-page-backgrounds/*',
    out: dest + 'img/index-page-backgrounds/'
  },
  images_for_tunnel_page = {
    in: source + 'img/tunnel-page-backgrounds/*',
    out: dest + 'img/tunnel-page-backgrounds/'
  },
  images = {
    in: source + 'img/*',
    out: dest + 'img/'
  },
  less_files = {
    in: source + 'less/style.less',
    out: dest + 'css/',
    watch: source + 'less/*.less'
  },
  html_files = {
    in: source + '*.html',
    out: dest
  },
  js_files = {
    in: source + '/js/**/*.js',
    out: dest + '/js/'
  };

// Show debug message

console.log(pkg.name + ' ' + pkg.version + ', ' + (devBuild ? 'dev' : 'prod') + ' build (env: ' + process.env.NODE_ENV + ')');

// Clean task

gulp.task('clean', function() {
  del([
      dest + '*'
    ]);
});

// Task for resizing and optimizing background images for index page

gulp.task('images-for-index-page', function() {
  return gulp.src(images_for_index_page.in)
    .pipe(newer(images_for_index_page.out))
    .pipe(imageresize({
      width: 1200,
      height: 1200,
      crop: false,
      upscale: false,
      imageMagick: true,
      quality: 0.51
    }))
    .pipe(imagemin())
    .pipe(gulp.dest(images_for_index_page.out));
});

// Task for optimizing background images for tunnel page

gulp.task('images-for-tunnel-page', function() {
  return gulp.src(images_for_tunnel_page.in)
    .pipe(newer(images_for_tunnel_page.out))
    .pipe(imagemin())
    .pipe(gulp.dest(images_for_tunnel_page.out));
});

// Other images

gulp.task('images', function() {
  return gulp.src(images.in)
    .pipe(newer(images.out))
    .pipe(imagemin())
    .pipe(gulp.dest(images.out));
});

// Task for converting less to css
// TODO: minify css for production, see https://github.com/plus3network/gulp-less

gulp.task('less', function() {
  return gulp.src(less_files.in)
    .pipe(less({ 
      paths: [ path.join(__dirname, 'less') ] // paths for @import directive
    }))
    .pipe(gulp.dest(less_files.out));
});

// Other files (html, js)
// TODO: move js to /js folder, minify for production

gulp.task('html', function() {
  return gulp.src(html_files.in)
    .pipe(gulp.dest(html_files.out));  
});

gulp.task('js', function() {
  return gulp.src(js_files.in)
    .pipe(gulp.dest(js_files.out));  
});

gulp.task('bower', function () {
  return bower({directory: dest + 'vendor', cwd: '.'});
});

gulp.task('mockup', ['html', 'js', 'bower'], function() {
});

gulp.task('nowatch', ['mockup', 'less', 'html', 'js', 'images-for-index-page', 'images-for-tunnel-page', 'images'], function() {
});

// Gulp default task

gulp.task('default', ['mockup', 'less', 'images-for-index-page', 'images-for-tunnel-page', 'images'], function() {

  gulp.watch(less_files.watch, ['less']);

  gulp.watch(html_files.in, ['html']);

  gulp.watch(js_files.in, ['js']);

  gulp.watch('bower.json', ['bower']);

});