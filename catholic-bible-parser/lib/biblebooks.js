/*
bp_booksInfo: array holding order, chapters and verses info.
bp_normalizedNames: contains normalized long and short book names in the same order of bp_booksInfo.
bp_bookAliases: string holding book names and aliases used for finding matches with a regex, shares the order of bp_booksInfo. (strings like #a* are used in validateCandidates function of bibleparser.js for books that have the same name e.g: 1 Samuel, 2 Samuel, or 1 Kings 2 Kings etc.)

-If you want to make changes to the books you will have to update these vars and also check the function validateCandidates which uses the book order of bp_bookAliases inside a switch block.-
For localization of only the recognition part of book names (without changing order of books) you only need to update bp_bookAliases string.-
*/
  var bp_booksInfo = [ 
  //(index 0) Genesis:  
  [31,25,24,26,32,22,24,22,29,32,32,20,18,24,21,16,27,33,38,18,34,24,20,67,34,35,46,22,35,43,55,32,20,31,29,43,36,30,23,23,57,38,34,34,28,34,31,22,33,26],
  //(index 1)... Exodus:
  [22,25,22,31,23,30,25,32,35,29,10,51,22,31,27,36,16,27,25,26,36,31,33,18,40,37,21,43,46,38,18,35,23,35,35,38,29,31,43,38],
  //...2 Leviticus
  [17,16,17,35,19,30,38,36,24,20,47,8,59,57,33,34,16,30,37,27,24,33,44,23,55,46,34],
  //3 Numbers
  [54,34,51,49,31,27,89,26,23,36,35,16,33,45,41,50,13,32,22,29,35,41,30,25,18,65,23,31,40,16,54,42,56,29,34,13],
  //4 Deuteronomy
  [46,37,29,49,33,25,26,20,29,22,32,32,18,29,23,22,20,22,21,20,23,30,25,22,19,19,26,68,29,20,30,52,29,12],
  //5 Joshua
  [18,24,17,24,15,27,26,35,27,43,23,24,33,15,63,10,18,28,51,9,45,34,16,33],
  //6 Judges
  [36,23,31,24,31,40,25,35,57,18,40,15,25,20,20,31,13,31,30,48,25],
  //7 Ruth
  [22,23,18,22],
  //8 1 Samuel
  [28,36,21,22,12,21,17,22,27,27,15,25,23,52,35,23,58,30,24,42,15,23,29,22,44,25,12,25,11,31,13],
  //9 2 Samuel
  [27,32,39,12,25,23,29,18,13,19,27,31,39,33,37,23,29,33,43,26,22,51,39,25],
  //10 1 Kings
  [53,46,28,34,18,38,51,66,28,29,43,33,34,31,34,34,24,46,21,43,29,53],
  //11 2 Kings
  [18,25,27,44,27,33,20,29,37,36,21,21,25,29,38,20,41,37,37,21,26,20,37,20,30],
  //12 1 Chronicles
  [54,55,24,43,26,81,40,40,44,14,47,40,14,17,29,43,27,17,19,8,30,19,32,31,31,32,34,21,30],
  //13 2 Chronicles
  [17,18,17,22,14,42,22,18,31,19,23,16,22,15,19,14,19,34,11,37,20,12,21,27,28,23,9,27,36,27,21,33,25,33,27,23],
  //14 Ezra
  [11,70,13,24,17,22,28,36,15,44] ,
  //... Nehemiah
  [11,20,38,17,19,19,72,18,38,39,36,47,31],
  //Tobit
  [22,14,17,21,22,19,16,21,6,14,18,22,18,15],
  //Judith
  [16,28,10,15,24,21,32,36,14,23,23,20,20,19,14,25],  
  //Esther
  [22,23,15,17,14,14,10,17,32,13,12,6,18,19,19,24],
  //1 Maccabees
  [64,70,60,61,68,63,50,32,73,89,74,53,53,49,41,24],
  //2 Maccabees
  [36,32,40,50,27,31,42,36,29,38,38,45,26,46,39],  
  //Isaiah
  [31,22,26,6,30,13,25,22,21,34,16,6,22,32,9,14,14,7,25,6,17,25,18,23,12,21,13,29,24,33,9,20,24,17,10,22,38,22,8,31,29,25,28,28,25,13,15,22,26,11,23,15,12,17,13,12,21,14,21,22,11,12,19,12,25,24],
  //Jeremiah
  [19,37,25,31,31,30,34,22,26,25,23,17,27,22,21,21,27,23,15,18,14,30,40,10,38,24,22,17,32,24,40,44,26,22,19,32,21,28,18,16,18,22,13,30,5,28,7,47,39,46,64,34],
  //Baruch
  [22,35,38,37,9],  
  //Ezekiel
  [28,10,27,17,17,14,27,18,11,22,25,28,23,23,8,63,24,32,14,49,32,31,49,27,17,21,36,26,21,26,18,32,33,31,15,38,28,23,29,49,26,20,27,31,25,24,23,35],
  //Daniel
  [21,49,30,37,31,28,28,27,27,21,45,13],
  //Hosea
  [11,23,5,19,15,11,16,14,17,15,12,14,16,9],
  //Joel
  [20,27,5,21],  
  //Amos
  [15,16,15,13,27,14,17,14,15],
  //Obadiah
  [21] ,
  //Jonah
  [17,10,10,11],
  //Micah
  [16,13,12,13,15,16,20],
  //Nahum
  [15,13,19],
  //Habakkuk
  [17,20,19],
  //Zephaniah
  [18,15,20],
  //Haggai
  [15,23],
  //Zechariah
  [21,13,10,14,11,15,14,23,17,12,17,14,9,21],
  //Malachi
  [14,17,24],  
  //Job
  [22,13,26,21,27,30,21,22,35,22,20,25,28,22,35,22,16,21,29,29,34,30,17,25,6,14,23,28,25,31,40,22,33,37,16,33,24,41,30,24,34,17],
  //Proverbs
  [33,22,35,27,23,35,27,36,18,32,31,28,25,35,33,33,28,24,29,30,31,29,35,34,28,28,27,28,27,33,31],  
  //Ecclesiastes
  [18,26,22,16,20,12,29,17,18,20,10,14],  
  //Wisdom
  [16,24,19,20,23,25,30,21,18,21,26,27,19,31,19,29,21,25,22],  
  //Sirach
  [30,18,31,31,15,37,36,19,18,31,34,18,26,27,20,30,32,33,30,31,28,27,27,34,26,29,30,26,28,25,31,24,33,26,24,27,31,34,35,30,27,25,33,23,26,20,25,25,16,29,30],  
  //Lamentations
  [22,22,66,22,22],
  //Song of Songs
  [17,17,11,16,16,13,13,14],
  //Psalms
  [6,12,8,8,12,10,17,9,20,18,7,8,6,7,5,11,15,50,14,9,13,31,6,10,22,12,14,9,11,12,24,11,22,22,28,12,40,22,13,17,13,11,5,26,17,11,9,14,20,23,19,9,6,7,23,13,11,11,17,12,8,12,11,10,13,20,7,35,36,5,24,20,28,23,10,12,20,72,13,19,16,8,18,12,13,17,7,18,52,17,16,15,5,23,11,13,12,9,9,5,8,28,22,35,45,48,43,13,31,7,10,10,9,8,18,19,2,29,176,7,8,9,4,8,5,6,5,6,8,8,3,18,3,3,21,26,9,8,24,13,10,7,12,15,21,10,20,14,9,6],
// _______*********_________************** NEW TESTAMENT ***********************________*********_________    
  //Matthew:
  [25,23,17,25,48,34,29,34,38,42,30,50,58,36,39,28,27,35,30,34,46,46,39,51,46,75,66,20],
  //Mark:
  [45,28,35,41,43,56,37,38,50,52,33,44,37,72,47,20],
  //Luke:
  [80,52,38,44,39,49,50,56,62,42,54,59,35,35,32,31,37,43,48,47,38,71,56,53],
  //John:
  [51,25,36,54,47,71,53,59,41,42,57,50,38,31,27,33,26,40,42,31,25],
  //Acts:
  [26,47,26,37,42,15,60,40,43,48,30,25,52,28,41,40,34,28,41,38,40,30,35,27,27,32,44,31],
  //Romans:
  [32,29,31,25,21,23,25,39,33,21,36,21,14,23,33,27],
  //1 Corinthians:
  [31,16,23,21,13,20,40,13,27,33,34,31,13,40,58,24],
  //2 Corinthians:
  [24,17,18,18,21,18,16,24,15,18,33,21,14],
  //Galatians:
  [24,21,29,31,26,18],
  //Ephesians:
  [23,22,21,32,33,24],
  //Philippians
  [30,30,21,23],
  //Colossians
  [29,23,25,18],
  //1 Thessalonians
  [10,20,13,18,28],
  //2 Thessalonians
  [12,17,18],
  //1 Timothy
  [20,15,16,16,25,21],
  //2 Timothy
  [18,26,17,22],
  //Titus
  [16,15,15],
  //Philemon
  [25],
  //Hebrews
  [14,18,19,16,14,20,28,13,28,39,40,29,25],
  //James
  [27,26,18,17,20],
  //1 Peter
  [25,25,22,19,14],
  //2 Peter
  [21,22,18],
  //1 John
  [10,29,24,21,21],
  //2 John
  [13],
  //3 John
  [14],
  //Jude
  [25],
  //Revelation
  [20,29,22,11,14,17,17,13,21,11,19,17,18,20,8,21,18,24,21,15,27,21]	
];
	
var bp_normalizedNames = {};
//english
bp_normalizedNames.en = [
['Genesis', 'Gen.'],['Exodus', 'Ex.'],['Leviticus', 'Lev.'],['Numbers', 'Num.'],['Deuteronomy', 'Deut.'],['Joshua', 'Josh.'],['Judges', 'Jdg.'],['Ruth', 'Rut.'],['1 Samuel', '1 Sam.'],['2 Samuel', '2 Sam.'],['1 Kings', '1 Ki.'],['2 Kings', '2 Ki.'],['1 Chronicles', '1 Chr.'],['2 Chronicles', '2 Chr.'],['Ezra', 'Ezr.'],['Nehemiah', 'Neh.'],['Tobit', 'Tob.'],['Judith', 'Jdt.'],['Esther', 'Est.'],['1 Maccabees', '1 Mac.'],['2 Maccabees', '2 Mac.'],['Isaiah', 'Is.'],['Jeremiah', 'Jer.'],['Baruch', 'Bar.'],['Ezekiel', 'Ez.'],['Daniel', 'Dn.'],['Hosea', 'Hos.'],['Joel', 'Jl.'],['Amos', 'Am.'],['Obadiah', 'Ob.'],['Jonah', 'Jon.'],['Micah', 'Mic.'],['Nahum', 'Nah.'],['Habakkuk', 'Hab.'],['Zephaniah', 'Zeph.'],['Haggai', 'Hag.'],['Zechariah', 'Zech.'],['Malachi', 'Mal.'],['Job', 'Jb.'],['Proverbs', 'Prov.'],['Ecclesiastes', 'Eccl.'],['Wisdom', 'Wis.'],['Sirach', 'Sir.'],['Lamentations', 'Lam.'],['Songs', 'Song.'],['Psalms', 'Pss.'],['Matthew', 'Mt.'],['Mark', 'Mk.'],['Luke', 'Lk.'],['John', 'Jn.'],['Acts', 'Act.'],['Romans', 'Rom.'],['1 Corinthians', '1 Cor.'],['2 Corinthians', '2 Cor.'],['Galatians', 'Gal.'],['Ephesians', 'Eph.'],['Philippians', 'Phil.'],['Colossians', 'Col.'],['1 Thessalonians', '1 Thes.'],['2 Thessalonians', '2 Thes.'],['1 Timothy', '1 Tim.'],['2 Timothy', '2 Tim.'],['Titus', 'Ti.'],['Philemon', 'Phlm.'],['Hebrews', 'Heb.'],['James', 'Jas.'],['1 Peter', '1 Pe.'],['2 Peter', '2 Pe.'],['1 John', '1 Jn.'],['2 John', '2 Jn.'],['3 John', '3 Jn.'],['Jude', 'Ju.'],['Revelation', 'Rev.']
];
//spanish - español:
bp_normalizedNames.es = [
['Génesis', 'Gén.'],['Éxodo', 'Éx.'],['Levítico', 'Lev.'],['Números', 'Núm.'],['Deuteronomio', 'Deut.'],['Josué', 'Jos.'],['Jueces', 'Jc.'],['Rut', 'Rut'],['1 Samuel', '1 Sam.'],['2 Samuel', '2 Sam.'],['1 Reyes', '1 Re.'],['2 Reyes', '2 Re.'],['1 Crónicas', '1 Crón.'],['2 Crónicas', '2 Crón.'],['Esdras', 'Esd.'],['Nehemías', 'Neh.'],['Tobías', 'Tob.'],['Judit', 'Jdt.'],['Ester', 'Est.'],['1 Macabeos', '1 Mac.'],['2 Macabeos', '2 Mac.'],['Isaías', 'Is.'],['Jeremías', 'Jer.'],['Baruc', 'Bar.'],['Ezequiel', 'Ez.'],['Daniel', 'Dn.'],['Oseas', 'Os.'],['Joel', 'Jl.'],['Amos', 'Am.'],['Abdías', 'Ab.'],['Jonás', 'Jon.'],['Miqueas', 'Miq.'],['Nahúm', 'Nah.'],['Habacuc', 'Hab.'],['Sofonías', 'Sof.'],['Ageo', 'Ag.'],['Zacarías', 'Zac.'],['Malaquías', 'Mal.'],['Job', 'Jb.'],['Proverbios', 'Prov.'],['Eclesiastés', 'Ecl.'],['Sabiduría', 'Sab'],['Eclesiástico', 'Eclo.'],['Lamentaciones', 'Lam.'],['Cantar', 'Cant.'],['Salmos', 'Sal.'],['Mateo', 'Mt.'],['Marcos', 'Mc.'],['Lucas', 'Lc.'],['Juan', 'Jn.'],['Hechos', 'Hec.'],['Romanos', 'Rom.'],['1 Corintios', '1 Cor.'],['2 Corintios', '2 Cor.'],['Gálatas', 'Gál.'],['Efesios', 'Ef.'],['Filipenses', 'Flp.'],['Colosenses', 'Col.'],['1 Tesalonicenses', '1 Tes.'],['2 Tesalonicenses', '2 Tes.'],['1 Timoteo', '1 Tim.'],['2 Timoteo', '2 Tim.'],['Tito', 'Ti.'],['Filemón', 'Flm'],['Hebreos', 'Heb.'],['Santiago', 'Sgo.'],['1 Pedro', '1 Pe.'],['2 Pedro', '2 Pe.'],['1 Juan', '1 Jn.'],['2 Juan', '2 Jn.'],['3 Juan', '3 Jn.'],['Judas', 'Jds.'],['Apocalipsis', 'Ap.']
];
		
//English and Spanish book names  
var bp_bookAliases = "#01 Genesis Génesis Gen Gén Gn #02 Exodus Éxodo Exodo Exod Ex Exo Éx #03 Leviticus Levítico Levitico Lev Lv #04 Numbers Números Numeros Núm Num #05 Deuteronomy Deut Deuteronomio Dt #06 Joshua Josh Josué Josue Jos #07 Judges Judg Jdg Jueces Jc #08 Ruth Rut Rt #a* Samuel Sam #b* Kings Ki Kgs Reyes Rey Re #c* Chronicles Chr Crónicas Cronicas Crón Cron Cr #15 Ezra Ezr Esdras Esd #16 Nehemiah Neh Nehemías Nehemias #17 Tobit Tobías Tobias Tob Tb #18 Judith Judit Jdt #19 Esther Esth Est Ester #d* Maccabees Macabeos Mac #22 Isaiah Isa Isaías Isaias Is #23 Jeremiah Jer Jeremías Jeremias #24 Baruch Baruc Bar #25 Ezekiel Ezek Ezequiel Ez #26 Daniel Dan Dn #27 Hosea Hos Oseas Os #28 Joel Jl #29 Amos Amós Am #30 Obadiah Obad Oba Ob Abdías Abdias Abd Ab #31 Jonah Jon Jonás Jonas #32 Micah Mic Miqueas Miq #33 Nahum Nah Nahúm #34 Habakkuk Hab Habacuc Habacuq #35 Zephaniah Zeph Zep Sofonías Sofonias Sof #36 Haggai Hag Ageo Ag #37 Zechariah Zech Zec Zacarías Zacarias Zac #38 Malachi Mal Malaquías Malaquias #39 Job Jb #40 Proverbs Prov Prv Pro Proverbios #41 Ecclesiastes Eccl Ecc Eclesiastés Eclesiastes Ecl #42 Wisdom Wis Sabiduría Sabiduria Sab #43 Sirach Sirac Sir Eclesiástico Eclesiastico Ecli Eclo #44 Lamentations Lam Lamentaciones #45 Song Songs Cantar Cant #46 Psalms Ps Pss Psalm Salmos Sal #47 Matthew Matt Mateo Mat Mt #48 Mark Mk Marcos Mar Mc #49 Luke Lk Lucas Luc Lc #50 John Juan Jua Jn #51 Acts Act Hechos Hech Hec #52 Romans Romanos Rom #e* Corinthians Cor Corintios #55 Galatians Gal Gálatas Galatas Gál #56 Ephesians Eph Efesios Ef #57 Philippians Phil Filipenses Flp #58 Colossians Col Colosenses #f* Thessalonians Thess Thes Tesalonicenses Tes #g* Timothy Tim Tm Timoteo #63 Titus Tito Tit #64 Philemon Phlm Filemón Filemon Flm #65 Hebrews Heb Hebreos #66 James Jas Santiago Sant Sgo #h* Peter Pet Pt Pedro Ped Pe #72 Jude Judas Ju Jds #73 Revelation Rev Rv Apocalipsis Apoc Ap";