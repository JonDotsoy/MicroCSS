/**
 * Contiene el elemento css de tipo selector
 */
var cssElementSelector = function cssElementSelector() {
    this.type = 'selector'
}

/**
 * Contiene el elemento css de tipo Media Queris
 */
var cssElementMedia = function cssElementMedia() {
    this.type = 'media'
}

/**
 * Contiene el elemento css de tipo Input
 */
var cssElementInput = function cssElementInput() {
    this.type = 'input'
}


/**
 * Combienrte todo el contenido de un documento css en un objeto que se pueda trabajar con javascript.
 *
 * @param  {string} srcfile Contiene el contenido css de la hoja de estilo
 * @return {Object}
 */
var decomposeCSS = function decomposeCSS(srcfile) {
    this.setLiteralCSS(srcfile)
}

decomposeCSS.prototype.setLiteralCSS = function(CSS) {
    this.literalCSS = CSS
}

decomposeCSS.prototype.setCSSemptyToCommnet = function(CSSemptyToCommnet) {
    this.CSSemptyToCommnet = CSSemptyToCommnet
};




/**
 * Elimina todos los comentarios detectados en el documento css
 * @return {array}
 */
decomposeCSS.prototype.removeComment = function() {
    var timeCodeEject = (new Date().getTime())
    var keyToStartCommnet = '/*StartCommnet' + timeCodeEject + '>>'
    var keyToEndCommnet = '<<' + timeCodeEject + 'EndComnet*/'

    var CSSNoEmptyLine = this.literalCSS.split("\n\r").join("")
    var CSSNoPreSpace = CSSNoEmptyLine.split("\t").join('')
    var CSSoneLine = CSSNoPreSpace.split("\r\n").join('')
    var CSSNoCommnet = CSSoneLine.replace(/(\/\*)/g, '\n' + keyToStartCommnet)
    var CSSNoCommnet = CSSNoCommnet.replace(/(\*\/)/g, keyToEndCommnet + '\n')
    var CSSInArrToRemoveCommnet = CSSNoCommnet.split("\n")
    var CSSemptyToCommnet = ''

    // find arr to remove Commnet
    for (var key in CSSInArrToRemoveCommnet) {
        var line = CSSInArrToRemoveCommnet[key]
        if (line.slice(0, keyToStartCommnet.length) != keyToStartCommnet) {
            CSSemptyToCommnet += line
        }
        // console.log(line.slice(0,keyToStartCommnet.length) == keyToStartCommnet, line)
    }

    // var regexFind = CSSNoEmptyLine.split(';')

    this.setCSSemptyToCommnet(CSSemptyToCommnet)
    return CSSemptyToCommnet
}

decomposeCSS.getClassifyObject = function(arrLiteralCSS) {

}

decomposeCSS.getObjectFromTextCSS = function(literalCSS) {
    // Corta el texto
    var ArrLiteral = literalCSS
        .split(/([}|;|{])/g)

    // Variables de estado mediante el recorrido
    var arrComponentCSS = [];
    var typeTravel = 'literal' // Ex. @import, @media, literal.
    var positionOfTheBraket = 0
    var tmpArrComponent = [];

    for (var key in ArrLiteral) {
    	var element = ArrLiteral[key]
    	
    }

    return ArrLiteral
}

/**
 * Convierte todo el componente CSS en objecto
 * @return {Object}
 */
decomposeCSS.prototype.createObject = function() {
    return decomposeCSS.getObjectFromTextCSS(this.CSSemptyToCommnet)
}

module.exports = decomposeCSS
