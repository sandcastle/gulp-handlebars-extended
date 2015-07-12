/* global describe, it */
'use strict';
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var gulp = require('gulp');
var stream = require('stream-assert');
var hbx = require('handlebars-extended');
var handlebars = require('../');

describe('gulp-handlebars-extended', function(){
   
    var data = {};
    var context = {
        layouts: {
            'root': fs.readFileSync(getFixturePath('root.hbs')).toString()
        }
    };
   
    describe('default export', function(){
       
        it('should render nested template', function(done){
           gulp.src(getFixturePath('page.hbs'))
            .pipe(handlebars(data, context))
            .pipe(stream.first(function(obj){
                assert.equal(obj.contents.toString(), compilePage('page.hbs', data, context))
            }))
            .pipe(stream.end(done));
        });
    });
   
    describe('compile & render exports', function(){
        
        it('should compile and render the template separately', function(done){
            gulp.src(getFixturePath('page.hbs'))
                .pipe(handlebars.compile(context))
                .pipe(handlebars.render(data, context))
                .pipe(stream.first(function(obj){
                    assert.equal(obj.contents.toString(), compilePage('page.hbs', data, context))
                }))
                .pipe(stream.end(done));
        });
    });
});

function compilePage(name, data, context){
    var file = fs.readFileSync(getFixturePath(name)).toString();
    return hbx.compile(file)(data, context);
}

function getFixturePath(name){
    return path.join(__dirname, '/fixture/' + name);
}