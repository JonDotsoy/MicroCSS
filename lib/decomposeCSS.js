/**
 * Property es el valor especifico de cada copropiedad del css 
 */
var cssProperty = function cssProperty(literalProperty) {
    this.type = 'property'
    this.title = ''
    this.value = ''

    var arrProperty = literalProperty.split(':')
    for (var key in arrProperty) {
        var fragProperty = arrProperty[key]
        if (key == 0) {
            this.title = this.title + fragProperty
        } else {
            if (key > 1) {
                this.value = this.value + ' '
            }
            this.value = this.value + fragProperty.trim()
        }
    }
}
cssProperty.prototype.toCSS = function toCSS() {
    return this.title + ':' + this.value + ';'
}

/**
 * Contiene el elemento css de tipo selector
 */
var cssElementSelector = function cssElementSelector(arrLiteralCSS) {
    this.type = 'selector'
    this.title = ''
    this.property = []

    var positionOfTheBraket = 0
    var startPropieties = false
    for (var key in arrLiteralCSS) {
        var line = arrLiteralCSS[key]

        if (line == '{') {
            startPropieties = true
            positionOfTheBraket = positionOfTheBraket + 1
        }

        if (line == '}')
            positionOfTheBraket = positionOfTheBraket - 1

        if (positionOfTheBraket == 0 && startPropieties == false) {
            this.title = this.title + line
        }

        if (positionOfTheBraket == 1 && line != '}' && line != '{') {
            this.property.push(new cssProperty(line))
        }
    }

}
cssElementSelector.prototype.toCSS = function() {
    var outLine = '' 

    outLine += this.title

    outLine += '{'

    for (var key in this.property) {
        var property = this.property[key]
        outLine += property.toCSS()
    }

    outLine += '}'

    return outLine
};

/**
 * Contiene el elemento css de tipo Media Queris
 */
var cssElementMedia = function cssElementMedia(arrLiteralCSS) {
    this.type = 'media'
    this.title = ''
    this.selectors = []

    var positionOfTheBraket = 0
    var startMedia = false
    var tmpSelector = []
    for (var key in arrLiteralCSS) {
        var line = arrLiteralCSS[key]

        if (line == '}') {
            positionOfTheBraket = positionOfTheBraket - 1
        }

        if (positionOfTheBraket >= 1 && startMedia == true) {
            tmpSelector.push(line)
            if (line == '}') {
                this.selectors.push(new cssElementSelector(tmpSelector))
                tmpSelector = []
            }
        }

        if (line == '{') {
            startMedia = true
            positionOfTheBraket = positionOfTheBraket + 1
        }

        if (positionOfTheBraket == 0 && startMedia == false) {
            if (key == 0) {
                line = line.replace('@media','',line).trim()
            }
            this.title += line
        }

        
    }
}
cssElementMedia.prototype.toCSS = function() {
    var selectorsMedia = ''

    for(var key in this.selectors) {
        var selector = this.selectors[key]
        selectorsMedia += selector.toCSS()
    }
    return '@media '+this.title+'{'+selectorsMedia+'}'
};

/**
 * Contiene el elemento css de tipo Input
 */
var cssElementImport = function cssElementImport(arrLiteralCSS) {
    this.type = 'import'
    var value = arrLiteralCSS.join(' ')
    this.value = value.replace('@import','',value).trim()
}
cssElementImport.prototype.toCSS = function() {
    return '@import '+this.value+';'
};


/**
 * Combienrte todo el contenido de un documento css en un objeto que se pueda trabajar con javascript.
 *
 * @param  {string} srcfile Contiene el contenido css de la hoja de estilo
 * @return {Object}
 */
var decomposeCSS = function decomposeCSS(srcfile) {
    this.setLiteralCSS(srcfile)
    this.removeComment()
    this.objectCSSElement = this.createObject()
}

decomposeCSS.prototype.setLiteralCSS = function(CSS) {
    this.literalCSS = CSS
}

decomposeCSS.prototype.setCSSemptyToCommnet = function(CSSemptyToCommnet) {
    this.CSSemptyToCommnet = CSSemptyToCommnet
}




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

decomposeCSS.getClassifyObject = function(typeTravel, arrLiteralCSS) {
    var objectCSSElement

    if (typeTravel == 'literal') {
        objectCSSElement = new cssElementSelector(arrLiteralCSS)
    }
    if (typeTravel == '@media')  {
        objectCSSElement = new cssElementMedia(arrLiteralCSS)
    }
    if (typeTravel == '@import') {
        objectCSSElement = new cssElementImport(arrLiteralCSS)
    }

    return objectCSSElement
}

decomposeCSS.getObjectFromTextCSS = function(literalCSS) {
    // Corta el texto
    var ArrLiteral = literalCSS
        .split(/([}|;|{])/g)

    // Variables de estado mediante el recorrido
    var keyImportElement = '@import'
    var keyMediaElement = '@media'
    var keyLiteralElement = 'literal'
    var arrComponentCSS = [];
    var typeTravel = 'literal' // Ex. @import, @media, literal.
    var positionOfTheBraket = 0
    var tmpArrComponent = [];

    for (var key in ArrLiteral) {
        var element = ArrLiteral[key].trim()

        if (element == '') continue

        // console.log(element)

        if (element == '{') {
            positionOfTheBraket = positionOfTheBraket + 1
        }
        if (element == '}') {
            positionOfTheBraket = positionOfTheBraket - 1
        }
        
        if (element != ';') {
            tmpArrComponent.push(element)
        }

        if ((element == '}' || element == ';') && positionOfTheBraket == 0) {
            if (keyImportElement == tmpArrComponent[0].slice(0, keyImportElement.length)) {
                typeTravel = keyImportElement
            } else
            if (keyMediaElement == tmpArrComponent[0].slice(0, keyMediaElement.length)) {
                typeTravel = keyMediaElement
            } else {
                typeTravel = keyLiteralElement
            }

            arrComponentCSS.push(decomposeCSS.getClassifyObject(typeTravel,tmpArrComponent))
            // arrComponentCSS.push(new function name(){})

            tmpArrComponent = []
        }

    }

    return arrComponentCSS
}

/**
 * Convierte todo el componente CSS en objecto
 * @return {Object}
 */
decomposeCSS.prototype.createObject = function() {

    return decomposeCSS.getObjectFromTextCSS(this.CSSemptyToCommnet)
}

module.exports = decomposeCSS
