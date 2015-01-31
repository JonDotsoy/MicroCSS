var consoleControl = require('./components/consoleControl')
var fs = require('fs')
var mime = require('mime')

var scanTheCssSelectors = require('./../lib/scanTheCssSelectors')

module.exports = function (args) {
	'use strict'

	var types_     = {}

	types_.File = function File(){}
	types_.File = {
		validate: function (filePath) {
			return fs.existsSync(filePath)
		}
	}

	types_.FileHTML = function FileHTML(){}
	types_.FileHTML = {
		validate: function (filePath) {
			return mime.lookup(filePath) == 'text/html' && fs.existsSync(filePath)
		}
	}

	types_.FileCSS = function FileCSS(){}
	types_.FileCSS = {
		validate: function (filePath) {
			return mime.lookup(filePath) == 'text/css' && fs.existsSync(filePath)
		}
	}

	types_.String = String
	types_.String = {
		validate: function (value) {
			return value === String
		}
	}

	types_.Number = Number
	types_.Number = {
		validate: function (value) {
			return value === Number
		}
	}

	types_.Boolean = Boolean
	types_.Boolean = {
		validate: function (value) {
			return true === Boolean
		}
	}

	var parameters = {
		'file': types_.FileHTML,
		'source-folder': types_.String,
		'file-css': types_.FileCSS,
	}

	var acronymsParameters = {
		'f': 'file',
		'p': 'source-folder',
		'c': 'file-css',
	}

	var csl = consoleControl(args, {
		types : types_,
		parameters : parameters,
		acronyms : acronymsParameters,
	})

	if (csl['file-css']) {
		var fileCSS = csl['file-css']
		var srcFileCSS = fs.readFileSync(fileCSS,'utf8')

		var selectors = new scanTheCssSelectors(srcFileCSS)

		console.log(selectors.desconpos())
	}

}