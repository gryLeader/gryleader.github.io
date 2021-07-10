/* 
Catholic Bible Parser 1.0.0 by Ezequiel Mayan
July 05, 2021
https://github.com/gryLeader/Catholic-Bible-Reference-Parser/
 */ 
 
//Constructor BibleParser()
function BibleParser() {  
  this.validRefs = [];   
  this.allowsections = false;   
  this.vtype = "bcv";
  this.locale = "en";  
  this.grabCandidates = function(astring) {
    var match, 
		matches = [];
	//This regex does most of the job. You can learn more using https://regexr.com/ to understand how it works.		
	var bigRegex = /(?:(\b[1-3])(?:[^\S\r\n]|[°stndar.]{1,3}[^\S\r\n])?)?([A-Za-zÀ-ÿ]{2,})(?:\.?_?[^\S\r\n]?)(\d+)(?:[:,]\s?(\d+[a-d]*))?(?:-(\d+[a-d]{0,5})([\d\.\-,a-d]*)?)?(?:(\.[\d\.\-,a-d]+|,[\d\.\-,a-d]+))?/g;	
					
	while (match = bigRegex.exec(astring)) {
		var refObject = {
			"pos" :	match.index + '-' + bigRegex.lastIndex, //14-40 (start and end position within string)
			"ref" : match[0],								//1 Sam. 2:17-24ab.25,27-29a
			"prefix": match[1],								//1
			"bookID": undefined,							//(temporary, gets defined later by validation function)		
			"book": match[2],								//Sam (temporary value, gets re-defined later by validation function)
			"bookshort": undefined,							//(temporary, gets defined later by validation function)
			"chapter": match[3],							//2
			"verse": match[4],								//17
			"rangeto": match[5],							//24ab
			"addendum": match[6] || match[7]				//.25,27-29a  
		}
		
		if (refObject.addendum && refObject.addendum.length === 1) {
			refObject.addendum = undefined;
			refObject.ref = refObject.ref.slice(0, -1);
			refObject.pos = match.index + '-' + (bigRegex.lastIndex -1);			
		}
		
		if (refObject.chapter)
			refObject.chapter = refObject.chapter.replace(/^0+/, '');
		if (refObject.verse)
			refObject.verse = refObject.verse.replace(/^0+/, '');
		if (refObject.rangeto)
			refObject.rangeto = refObject.rangeto.replace(/^0+/, '');		
		
		matches.push(refObject);			
				
	}	
	return matches.length ? matches : false;
  };
  this.validateCandidates = function(candidates) {    		
	
	var book_found, removed,
		aliases = window.bp_bookAliases, //defined in file biblebooks.js
		booksinfo = window.bp_booksInfo, //defined in file biblebooks.js
		normalizedNames = window.bp_normalizedNames; //defined in file biblebooks.js
		
	
	//validate refs based on book name against the aliases string with this regex	
	for (var i = candidates.length -1; i >= 0 ; i--) {
		var patt = new RegExp("#(\\d\\d|\\w\\*)(?:\\s{1}[A-zÀ-ÿ]*)+\\b" + candidates[i].book + "\\b", "i");
				
		book_found = aliases.match(patt);
			if (book_found) { //if book name match
				removed = false; //(reset var to false)
			
				switch (book_found[1]) { //switch #xx (xx is book number in aliases or a special string if book has prefix)
				//handle 'prefix' special cases: check book number prefix to handle books that share the name like '1 Samuel', '2 Samuel' etc. 	
					case 'a*':		 //1 Samuel	2 Samuel
						if (candidates[i].prefix == '1')
							candidates[i].bookID = 9;
						else if (candidates[i].prefix == '2')
							candidates[i].bookID = 10;
						else {
							candidates.splice(i, 1); //if book requires prefix but it was not detected then remove from candidates
							removed = true;		}					
						break;
					case 'b*': //1 Kings 2 Kings
						if (candidates[i].prefix == '1')
							candidates[i].bookID = 11;
						else if (candidates[i].prefix == '2')
							candidates[i].bookID = 12;
						else {
							candidates.splice(i, 1);	
							removed = true;	}						
						break;
					case 'c*': //1 Chronicles 2 Chronicles
						if (candidates[i].prefix == '1')
							candidates[i].bookID = 13;
						else if (candidates[i].prefix == '2')
							candidates[i].bookID = 14;
						else {
							candidates.splice(i, 1);	
							removed = true;	}						
						break;
					case 'd*': //1 Maccabees 2 Maccabees
						if (candidates[i].prefix == '1')
							candidates[i].bookID = 20;
						else if (candidates[i].prefix == '2')
							candidates[i].bookID = 21;
						else {
							candidates.splice(i, 1);	
							removed = true;	}						
						break;
					case 'e*': //1 Corinthians 2 Corinthians
						if (candidates[i].prefix == '1')
							candidates[i].bookID = 53;
						else if (candidates[i].prefix == '2')
							candidates[i].bookID = 54;
						else {
							candidates.splice(i, 1);	
							removed = true;		}					
						break;
					case 'f*': //1 Thessalonians 2 Thessalonians
						if (candidates[i].prefix == '1')
							candidates[i].bookID = 59;
						else if (candidates[i].prefix == '2')
							candidates[i].bookID = 60;
						else {
							candidates.splice(i, 1);	
							removed = true;		}					
						break;
					case 'g*': //1 Timothy 2 Timothy
						if (candidates[i].prefix == '1')
							candidates[i].bookID = 61;
						else if (candidates[i].prefix == '2')
							candidates[i].bookID = 62;
						else {
							candidates.splice(i, 1);	
							removed = true;		}					
						break;
					case 'h*': //1 Peter 2 Peter
						if (candidates[i].prefix == '1')
							candidates[i].bookID = 67;
						else if (candidates[i].prefix == '2')
							candidates[i].bookID = 68;
						else {
							candidates.splice(i, 1);	
							removed = true;		}					
						break;
					case '22':
					//Isaiah: if abbreviated to 'Is' (without a dot) and has no verse then discard to avoid ambiguous case: "she is 20 y/o."
						if (candidates[i].book == 'Is' || candidates[i].book == 'is') {
							if (candidates[i].ref.charAt(2) != '.' && !candidates[i].verse) {
								candidates.splice(i, 1);
								removed = true;
								}
							else 
								candidates[i].bookID = 22;									
						}
						else
							candidates[i].bookID = 22;					
						break;						
					case '50':
					//John: could be either the gospel or one of the three letters, define correct ID based on prefix number 					
						if (candidates[i].prefix == '1')
							candidates[i].bookID = 69;
						else if (candidates[i].prefix == '2')
							candidates[i].bookID = 70;
						else if (candidates[i].prefix == '3')
							candidates[i].bookID = 71;							
						else
							candidates[i].bookID = 50;
						break;
					default:	
						candidates[i].bookID = Number(book_found[1]);
						//handle cases when prefix number was detected but book has no prefix, e.g: '2 Matthew 1:15'
						if (Number(candidates[i].prefix) >= 1) {
							candidates[i].prefix = undefined;
							candidates[i].ref = candidates[i].ref.replace(/^\d\s?/, '');							
							var posfix = candidates[i].pos.split('-');
							candidates[i].pos = (posfix[1]-candidates[i].ref.length).toString() + '-'+ posfix[1];
						}
				}
				if (!removed)	{
					//re-assign long and short normalized book names  e.g. Leviticus Lev
					
					if (!normalizedNames[this.locale])  
						this.locale = "en";					
					
					candidates[i].book =  normalizedNames[this.locale][candidates[i].bookID-1][0]; 
					candidates[i].bookshort = normalizedNames[this.locale][candidates[i].bookID-1][1]; 
				}
			} else {
				//if candidate book name wasn't found in aliases, then remove from array			
				candidates.splice(i, 1);							
			}				
	}
		
	//bc: further validation: validate chapter number is within correct ranges
	if (this.vtype == "bc" || this.vtype == "bcv" || this.vtype == "bcva") {
	
		var stack = "30 64 70 71 72"; // <- for one-chapter books
		 
		for (var i = candidates.length -1; i >= 0 ; i--) {
		
			if (Number(candidates[i].chapter) > booksinfo[candidates[i].bookID-1].length) {
				//if chapter is greater than allowed, candidate should be removed.. but first check special cases:
				//handle cases of books with only one chapter which can be omitted in favour of the verse e.g "Obadiah 9"	
				if (stack.indexOf(candidates[i].bookID.toString()) != -1) {
					if (candidates[i].verse == undefined && candidates[i].chapter <= booksinfo[candidates[i].bookID-1][0]) {
						candidates[i].verse = candidates[i].chapter;
						candidates[i].chapter = "1";																	
					}
					else
						candidates.splice(i, 1);
				}
				else
					candidates.splice(i, 1);
			} 
		} 	
	}
	 //bcv: further validation II: validate verse number is within correct ranges						
	if (this.vtype == "bcv" || this.vtype == "bcva") {
		var versenum, rangenum;
				
		for (var i = candidates.length -1; i >= 0 ; i--) {
			if (candidates[i].verse && candidates[i].verse != undefined) {
				
				versenum = candidates[i].verse.replace(/\D/g,'');
				if (this.allowsections == false)
					candidates[i].verse = versenum;				
				
				versenum = Number(versenum);
			
				if (versenum > booksinfo[candidates[i].bookID-1][candidates[i].chapter -1]) { 
						//remove from array							
						candidates.splice(i, 1); }
				else {
				
					if (candidates[i].rangeto && candidates[i].rangeto != undefined) {
						rangenum = candidates[i].rangeto.replace(/\D/g,'');
						if (this.allowsections == false)
							candidates[i].rangeto = rangenum;
						
						rangenum = Number(rangenum);						
					
					if (rangenum > booksinfo[candidates[i].bookID-1][candidates[i].chapter -1] || rangenum <= versenum)
						candidates.splice(i, 1);
					}					
				}			
			}		
		}				
	} 
	//bcva: further validation III: validate addendum verse numbers are within limits. 
	if (this.vtype == "bcva") {
		var toberemoved = false;
				
		for (var i = candidates.length -1; i >= 0 ; i--) {
			if (candidates[i].addendum != undefined) {			
				
				var extras = candidates[i].addendum.split(/(?:[a-d.,\-])+/g);
								
				for (var b = 0; b < extras.length ; b++) {
					if (extras[b] != undefined && extras[b].length) {					
					
					if (extras[b] > booksinfo[candidates[i].bookID-1][candidates[i].chapter -1]) 
						//remove from array							
						toberemoved = true;		
					}
				}				
				if (toberemoved)
					candidates.splice(i, 1);
				else if (this.allowsections == false)
					candidates[i].addendum = candidates[i].addendum.replace(/[a-d]/g,'');
			}		
		}				
	}
	
	return candidates;
  };
  this.parseText = function(string_to_parse, vtype) {
	if (vtype == "b" || vtype == "bc" || vtype == "bcv" || vtype == "bcva")
		this.vtype = vtype;
	else 	this.vtype = "bcv";
		
	this.validRefs = []; //reset refs	
    var candidates = this.grabCandidates(string_to_parse);	
		
	if (candidates !== false) {
	
		var validated = this.validateCandidates(candidates);	
		
		if (validated.length) {
			this.validRefs = validated;
			return true;			
		}
		else
			return false;
	}
	else 	
		return false;
  };
  this.normalizeRefs = function(stringToNormalize, lang, mode) {
	  var old_vtype = this.vtype;	  
	  this.vtype = "b";	  
	  var normalizedNames = window.bp_normalizedNames;
  	  
	  if (lang && normalizedNames[lang])  
			this.locale = lang;
	  else this.locale = "en"; 

	  if (mode == 0)
		mode = "book";
	  else 
		mode = "bookshort";
	  
	  var candidates = this.grabCandidates(stringToNormalize);
	  if (candidates !== false) {
		var validated = this.validateCandidates(candidates);
		var delta = 0;		
		
		for (var i = 0; i < validated.length; i++) {
			var pos_ar = validated[i].pos.split('-');
			var	diff = validated[i].ref.length;			
						
			var constructedRef = validated[i][mode] + " " + validated[i].chapter;
			if (validated[i].verse)
				constructedRef += ":" + validated[i].verse;
			if (validated[i].rangeto)
				constructedRef += "-" + validated[i].rangeto;
			if (validated[i].addendum)
				constructedRef += validated[i].addendum;							
			
			stringToNormalize = stringToNormalize.substr(0, Number(pos_ar[0]) + delta) +
			constructedRef +
			stringToNormalize.substr(Number(pos_ar[1]) + delta); 						
			
			if (constructedRef.length > diff)
				delta += constructedRef.length - diff;
			else if (constructedRef.length < diff)
				delta -= diff - constructedRef.length;
		}				
	  }
	  this.vtype = old_vtype;	  
	  return stringToNormalize;	    	  
  };   
  this.hasRefs = function() {	
	return this.validRefs.length ? true : false;	
  };
  this.refCount = function() {
	return this.validRefs.length;	  
  };   
  this.logRefs = function() {
	if (this.hasRefs()) {
		
		var parsedResult, bookprefixnum;					
		
		parsedResult = '<strong>' + this.validRefs.length + ' biblical refs have been found:' + '</strong><br>';
			
		for (var i = 0; i < this.validRefs.length; i++) {		
			bookprefixnum =	this.validRefs[i].prefix ? ' | prefix: ' + this.validRefs[i].prefix : '';		
			
			parsedResult += i+1 + ': pos: ' + this.validRefs[i].pos + ' | ref: ' + this.validRefs[i].ref + ' | bookID: ' + this.validRefs[i].bookID +bookprefixnum + ' | book: ' + this.validRefs[i].book  + ' | bookshort: ' + this.validRefs[i].bookshort + ' | chapter: ' + this.validRefs[i].chapter;
			
			if (this.validRefs[i].verse)
				parsedResult +=  ' | verse: ' + this.validRefs[i].verse;
			if (this.validRefs[i].rangeto)
				parsedResult +=  ' | rangeto: ' + this.validRefs[i].rangeto;
			if (this.validRefs[i].addendum)
				parsedResult +=  ' | addendum: ' + this.validRefs[i].addendum + '<br>';
			else				
				parsedResult += '<br>';
									
		}		
		return parsedResult;				
		
	}
  };
}