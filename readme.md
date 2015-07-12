# gulp-handlebars-extended [![Build Status](https://travis-ci.org/sandcastle/gulp-handlebars-extended.svg)](https://travis-ci.org/sandcastle/gulp-handlebars-extended)
> handlebars-extended plugin for gulp

## Usage

Install `gulp-handlebars-extended` as a development dependency:

```shell
npm install gulp-handlebars-extended --save-dev
```

## Compiling to html

#### gulpfile.js
```js
var handlebars = require('gulp-handlebars-extended');

gulp.task('templates', function(){
    
  var data = { site: 'my blog', author: 'sandcastle' };
  var layouts = {
    root: fs.readFileSync('src/templates/blog.hbs').toString()
  };

  return gulp.src('src/pages/*.hbs')
    .pipe(handlebars(data, { layouts: layouts }))
    .pipe(gulp.dest('dest'));
});
```

#### blog.hbs
```html
<html>
<head>
  <title>{{site}}</title>
</head>
<body>
  <article class="post">
    {{{content}}}
    <br>
    {{author}}
  </article>
</body>
```

#### page.hbs
```html
{{! layout: blog }}
Lorem ipsum dolor sit amet
```

#### Output
```html
<html>
<head>
  <title>my blog</title>
</head>
<body>
  <article class="post">
    Lorem ipsum dolor sit amet 
    <br>
    sandcastle
  </article>
</body>
```
