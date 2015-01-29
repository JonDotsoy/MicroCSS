/**
 * Agrupa los argumentos eun formato de Objeto
 * 
 * @param  {Array}  args   Contiene los argumentos rescatados dentro de un arreglo
 * @param  {Object} config Contiene los parametros de configuracion
 * @return {Object}
 */
module.exports = function consoleControl (args, config) {
	'use strict'

	if (!config) config    = {}

	var types_             = config.types || {}
	var parameters         = config.parameters || {}
	var acronymsParameters = config.acronyms || {}

	var validateIfIsParameter = function(strParam, strNextParam) {
		var containsSingleLine = strParam.slice(0,1) == '-'
		var containsDoubleLine = strParam.slice(0,2) == '--'
		var hasAnEqualsSymbol  = strParam.indexOf('=') != -1
		var thereNextValue     = strNextParam != undefined && validateIfIsParameter(strNextParam) == 0
		var isEmptyParam       = false

		if (containsDoubleLine && containsSingleLine) {
			isEmptyParam = strParam.slice(2) == ''
		} else if (containsSingleLine) {
			isEmptyParam = strParam.slice(1) == ''
		}


		var isAParameterOfTypeOne   = false // Ex. --message=mensaje
		var isAParameterOfTypeTwo   = false // Ex. --action
		var isAParameterOfTypeThree = false // Ex. -m mensaje
		var isAParameterOfTypeFour  = false // Ex. -a

		// Ex. --message=mensaje
		if (true
			&& containsDoubleLine
			&& containsSingleLine
			&& hasAnEqualsSymbol
			// && thereNextValue
			&& !isEmptyParam
			)
			isAParameterOfTypeOne = true

		// Ex. --action
		if (true
			&& containsDoubleLine
			&& containsSingleLine
			&& !hasAnEqualsSymbol
			// && thereNextValue
			&& !isEmptyParam
			)
			isAParameterOfTypeTwo = true

		// Ex. -m mensaje
		if (true
			&& !containsDoubleLine
			&& containsSingleLine
			&& !hasAnEqualsSymbol
			&& thereNextValue
			&& !isEmptyParam
			)
			isAParameterOfTypeThree = true

		// Ex. -a
		if (true
			&& !containsDoubleLine
			&& containsSingleLine
			&& !hasAnEqualsSymbol
			&& !thereNextValue
			&& !isEmptyParam
			)
			isAParameterOfTypeFour = true

		if (isAParameterOfTypeOne)   return 1 // Ex. --message=mensaje
		if (isAParameterOfTypeTwo)   return 2 // Ex. --action
		if (isAParameterOfTypeThree) return 3 // Ex. -m mensaje
		if (isAParameterOfTypeFour)  return 4 // Ex. -a
		return 0
	}

	var descomposeByAttributes = function (strParam, strNextParam) {
		var param = ''
		var value = ''
		var typeOfParameter = validateIfIsParameter(strParam, strNextParam)

		// return [typeOfParameter,strParam, strNextParam]

		// Ex. --message=mensaje
		if (typeOfParameter == 1) {
			var arrParam = strParam.split('=')
			for (var keyArrParam in arrParam) {
				keyArrParam = parseInt(keyArrParam)
				var estractValue = arrParam[keyArrParam]

				if (keyArrParam > 1)
					value += "="

				if (keyArrParam > 0)
					value += estractValue
			}
			param = arrParam[0].slice(2)
		}
		// Ex. --action
		if (typeOfParameter == 2) {
			param = strParam.slice(2)
		}
		// Ex. -m mensaje
		if (typeOfParameter == 3) {
			param = strParam.slice(1)
			value = strNextParam
		}
		// Ex. -a
		if (typeOfParameter == 4) {
			param = strParam.slice(1)
		}

		if (typeOfParameter == 0) return

		return {
			// isParam: validateIfIsParameter(strParam, strNextParam),
			name: param,
			value: value,
		}
	}

	/*
		Lee todos los paramoetros y los agrua de forma de objetos.
		validando que coincidan con los parametros.
	 */
	var csl = function (args) {
		var args = args
		var $this = {}

		// Recorre todos los argumentos
		for (var keyArg in args){

			keyArg = parseInt(keyArg)
			var arg = args[keyArg]
			var nextArg = args[keyArg+1]

			var argument = descomposeByAttributes(arg, nextArg)

			if (argument) {
				var findType = (acronymsParameters[argument.name] && parameters[acronymsParameters[argument.name]]) || parameters[argument.name]
				
				if (findType && findType.validate && findType.validate(argument.value)) {
					$this[acronymsParameters[argument.name] || argument.name] = argument.value
				}
			}

		}

		return $this
	}

	return csl(args)
}