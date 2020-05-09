var { src, dest, task, series, parallel, watch } = require("gulp"),
  rename = require("gulp-rename"),
  sass = require("gulp-sass"),
  map = require("gulp-sourcemaps"),
  prefixer = require("gulp-autoprefixer"),
  htmlmin = require("gulp-htmlmin"),
  imagemin = require("gulp-imagemin"),
  babelify = require("babelify"),
  uglify = require("gulp-uglify"),
  browserify = require("browserify"),
  source = require("vinyl-source-stream"),
  buffer = require("vinyl-buffer");

//style compile minify and path function with task
var stylePath = {
  main: "src/scss/**/*.scss",
  dest: "dist/css/",
};
function css(done) {
  src(stylePath.main)
    .pipe(map.init())
    .pipe(
      sass({
        errLogToConsole: true,
        outputStyle: "compressed",
      })
    )
    .on("error", console.error.bind(console))
    .pipe(
      prefixer({
        overrideBrowserslist: ["last 3 versions"],
        cascade: false,
      })
    )
    .pipe(rename({ suffix: ".min" }))
    .pipe(map.write("./"))

    .pipe(dest(stylePath.dest));
  done();
}

task("css", css);
/* ******************************************************* */

//javascript compile minify and path function with task
var jsMain = "app.js",
  JsDest = "dist/js/",
  jsFolder = "src/js/",
  jsFolders = [jsMain];

function js(done) {
  jsFolders.map(function (entery) {
    return browserify({
      entries: [jsFolder + entery],
      debug: true,
    })
      .transform(babelify, { presets: ["@babel/preset-env"] })
      .bundle()
      .pipe(source(entery))
      .pipe(rename({ extname: ".min.js" }))
      .pipe(buffer())
      .pipe(map.init({ loadMaps: true }))
      .pipe(uglify())
      .pipe(map.write("./"))
      .pipe(dest(JsDest));
  });
  done();
}

task("js", js);
/* ******************************************************* */

//HTML minify and path function with task
var htmlPath = {
  main: "src/*.html",
  dest: "views/",
};
function html(done) {
  src(htmlPath.main)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(dest(htmlPath.dest));
  done();
}

task("html", html);
/* ******************************************************* */

//image minify and path function with task
var imgPath = {
  main: "src/img/**/*.*",
  dest: "dist/img/",
};

function img(done) {
  src(imgPath.main).pipe(imagemin()).pipe(dest(imgPath.dest));
  done();
}

task("img", img);
/* ******************************************************* */

//Default task
task("default", parallel(css, js, html, img));

function watch_file() {
  watch(stylePath.main, series(css));
  watch(jsFolder + jsMain, series(js));
  watch(imgPath.main, series(img));
  watch(htmlPath.main, series(html));
}

task("watch", parallel(watch_file));
