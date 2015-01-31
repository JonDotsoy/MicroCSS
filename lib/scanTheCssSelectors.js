var decomposeCSS = require('./decomposeCSS')

/**
 * Retorna un conjunto con los selectores de la hoja de estilo indicado.
 * @param  {string} CSS Hoja de estilo CSS
 * @return {object}
 */
var scanTheCssSelectors = function scanTheCssSelectors (strCSS) {
	var cssComponent = new decomposeCSS(strCSS)

	this.cssComponent = cssComponent// .objectCSSElement
}

var getTitles = function(objectCSS) {
	if (objectCSS.type) {
		if (objectCSS.type == 'decomposeCSS' && objectCSS.objectCSSElement) {
			var arrWithTitles = []
			for (var key in objectCSS.objectCSSElement) {
				var CSSElement = objectCSS.objectCSSElement[key]
				var tmpToPush = null
				if (tmpToPush = getTitles(CSSElement)) {
					arrWithTitles.push(tmpToPush)
				}
			}
			return arrWithTitles
		}
		if (objectCSS.type == 'selector') {
			return objectCSS.title
		}
		if (objectCSS.type == 'media') {
			var arrTitlesFromMedia = []

			for (var key in objectCSS.selectors) {
				var selector = objectCSS.selectors[key]

				arrTitlesFromMedia.push(getTitles(selector))
			}

			return [objectCSS.title,arrTitlesFromMedia]
		}
	}
}

scanTheCssSelectors.prototype.desconpos = function() {
	var arrOutputTitle = []

	return getTitles(this.cssComponent)
}

module.exports = scanTheCssSelectors