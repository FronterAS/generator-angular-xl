'use strict';
var path = require('path');
var util = require('util');
var ScriptBase = require('../script-base.js');
var yeoman = require('yeoman-generator');
var _ = require('underscore.string');

var Generator = module.exports = function Generator() {
    ScriptBase.apply(this, arguments);
    yeoman.generators.NamedBase.apply(this, arguments);

    this.hookFor('angular-xl:controller');

    this.sourceRoot(path.join(__dirname, '../templates'));

    if (typeof this.env.options.appPath === 'undefined') {
        try {
            this.env.options.appPath = require(path.join(process.cwd(), 'bower.json')).appPath;
        } catch (e) {}
        this.env.options.appPath = this.env.options.appPath || 'app';
    }
};

util.inherits(Generator, ScriptBase);

Generator.prototype.createViewFiles = function createViewFiles() {
    this.viewClassesForHTML = this.dasherizedName + '-page';
    this.viewClassesForScss = '.' + this.dasherizedName + '-page';
    var targetPath = this.slugifiedPath.join('/') + '/' + this.dasherizedName;
    this.template('common/view.html', path.join(this.env.options.appPath, 'pages', targetPath, 'index', 'main-view.html'));
    this.template('common/page.scss', path.join(this.env.options.appPath, 'pages', targetPath, 'index', '_' + this.dasherizedName + '-page' + '.scss'));
    this.addStyleToPagesScss('../pages/' + targetPath + '/index/' + this.dasherizedName + '-page');
};