if (typeof jQuery === 'undefined') { 
	throw new Error('This JavaScript requires jQuery'); 
}
/** 
 * Marco Eberhardt
 *  	
 * @type Object
 * @description 
 */
$.validate = {
		
};

/**
 * Validierung eines Institutionskennzeichen / IK-Nummer
 * Um die Gültigkeit der Nummer zu berechnen, wird der Luhn-Algorithmus (Modulo-10-Verfahren) zugrunde gelegt.
 * 
 * Die neunstellige Nummer unterteilt sich in vier Bereiche:
 * Ziffern 1 & 2 	>> Klassifikation 	>> Kennzeichnung der Art der Einrichtung oder Personengruppe
 * Ziffern 3 & 4 	>> Regionalbereich 	>> Kennzeichnung des Bundeslands der Einrichtung
 * Ziffern 5 bis 8 	>> Seriennummer 	>> werden fortlaufend vergeben
 * Ziffer 9 		>> Prüfziffer
 * 
 * @param string ik_number	>> 9 Stellige IK-Nummer
 * @param bool check_region	>> default false >> Regionalbereich 0-16 prüfen
 * 
 * @return bool
 */
$.validate.ik_number = function(ik_number, check_region) 
{
	if (check_region == undefined){
		check_region = false;
	}
	
	if (ik_number == undefined){
		return false;
	}
	
	if(! ik_number.match(/[0-9]{9}$/) ){
		$.app.toConsole("IK keine 9-Stellige Zahl");
		return false;				// Keine 9-stellige Zahl
	}
	else
	{
		var ik = [
			ik_number.substring(0, 2),
			ik_number.substring(2, 4),
			ik_number.substring(4, 8),
			ik_number.substring(8, 9),
		]
		
		if(1==2 && (parseInt(ik[1]) < 0 || parseInt(ik[1]) > 16)){
			$.app.toConsole("Regionalberich ungültig");
			return false;			// Regionalbereich nur von 0 - 16
		}
		
		var multiplier 	= 0;
		var product 	= 0;
		var crosssum 	= 0;
		$.each(ik, function (index, value) {
			if (index > 0 && index < 3){	// Klassifikation und Prüfnummer werden hier nicht berücksichtigt
				for (var i=0; i < value.length; i++) {
					multiplier 	= (i % 2 == 0 ? 2:1);						// Multiplikator/Gewichtung
					product 	= parseInt(value.charAt(i)) * multiplier;	// Produkt
					crosssum	+= $.app.crosssum(product); 				// Die Queersummen der Produkte werden addiert
					console.log("Wert["+value.charAt(i)+"] - Multiplikator["+multiplier+"] - Produkt ["+product+"] - Queersumme ["+$.app.crosssum(product)+"]");
				}
			}
		});
		console.log("Summe Queersummen["+crosssum+"] Erwartete Prüfsumme["+parseInt(crosssum % 10)+"] IK-Prüfsumme["+parseInt(ik[3])+"]");
		// Das Ergebnis (Der addierten Queersummen) wird durch 10 dividiert. Der Rest ist die Prüfziffer 
		if(crosssum % 10 != ik[3]){	
			$.app.toConsole("Prüfsumme nicht korrekt");
			return false;			// Prüfsumme falsch
		}
		return true;
	}
};

/**
 * Die Krankenversichertennummer hat 20 bis 30 Stellen. 
 * 
 * Der unveränderliche Teil (die eigentliche Krankenversichertennummer) besteht aus insgesamt 10 Stellen:
 * 1 alphanumerisches Zeichen A-Z
 * 8 Ziffern 0-9
 * 1 Prüfziffer (0-9)
 * 
 * Buchstabe und die 8 Ziffern sind für jede Person "zufällig" aber eindeutig vergeben.
 * Die Prüfziffer wird mit dem Modulo-10-Verfahren und den Gewichtungen 1-2-1-2-1-2-1-2-1-2 berechnet. 
 * Der Buchstabe wird dabei durch eine zweistellige Zahl ersetzt, das A mit 01, das B mit 02, …, und das Z mit 26.
 * 	>> Hierfür benutze ich einfach die jeweiligen ASCII-Codes (A=65 ...Z=90) von denen ich 64 abziehe 
 *  
 */
/*
$.validate.health_insurance_number = function(insurance_number)
{
	if(! insurance_number.match(/^[A-Z][0-9]{9}$/) ){
		return false
	}
	
	var char2number = insurance_number.toUpperCase().charCodeAt(0) - 64; 
	if (char2number < 10){
		char2number = "0"+char2number;
	}
	var teststring = char2number + insurance_number.substring(1, 10);
	
	$.app.toConsole("Versichertennummer["+insurance_number+"] Teststring["+teststring+"]");
	
	
	return true;
	
};
*/


/**
 * Validates zipcode against a ruleset (restrictions)
 * 
 * Restrictions may look like the examles below:
 * 3****-312**		>> from/till range with *-wildcards (seperated with "-")
 * 127**-128**		>> from/till range with *-wildcards (seperated with "-")
 * 1270*			>> range with one *-wildcard
 * 12345			>> exact zipcode
 *  
 * @param string zipcode 		>> The zipcode to validate
 * @param array restrictions 	>> An array containing the rules (usually a seperated string in the db. use "str.split(';')" to get the array)
 * @return bool match			>> Returns matching rule or FALSE 
 */ 
$.validate.zipcode_restrictions = function(zipcode, restricions)
{
	$.app.toConsole({"fkt":"$.validate.zipcode_restrictions", "zipcode":zipcode, "zipcode_int":parseInt(zipcode), "restricions":restricions});
	
	if (restricions.length == 0){
		return "no restrictions";
	}
	
	var match = false; 
	
	$.each(restricions, function( index, value )
	{
		if (match !== false){return false;}	// already found a match. exit each by returning false
		
		var is_range = value.indexOf('-') != -1;		// ranges look like this [01***-04***]
		if (is_range)
		{
			var from_till 	= value.split('-');
			var from 		= from_till[0].replace(/\*/g, "0");
			var till		= from_till[1].replace(/\*/g, "9");
		}
		else
		{
			var from 		= value.replace(/\*/g, "0");
			var till		= value.replace(/\*/g, "9");
		}
		
		
		if (from.length != 5 || till.length != 5){// we need to make sure both parts have a length of 5
			return;
		}
		
		if (zipcode >= from && zipcode <= till){
			$.app.toConsole("zipcode ["+zipcode+"] matches rule["+value+"]");
			match = value;
		}
	});
	return match;
};

