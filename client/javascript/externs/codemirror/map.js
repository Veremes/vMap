/**
*
* Mode codeMirror pour les définitions mapserver
*
*/
CodeMirror.defineMode("map", function(){
	return {
		token: function(stream, state) {
			var rRegGroup1 = /(^|\s{1,})(COMPOSITE|MAP|LINESET|MARKERSET|POINTS|SHADESET|STYLE|CLASS|FEATURE|JOIN|LABEL|LAYER|LEGEND|PROJECTION|GRID|QUERY|OUTPUTFORMAT|QUERYMAP|REFERENCE|SCALEBAR|SYMBOL|WEB|METADATA|END|FONTSET|GRID|OUTPUTFORMAT|SYMBOLSET)($|\s)/;
			var rRegGroup2 = /(^|\s{1,})(ANGLE|ANTIALIAS|BACKGROUNDCOLOR|BACKGROUNDSHADOWCOLOR|BACKGROUNDSHADOWSIZE|BUFFER|CHARACTER|CLASSITEM|COLOR|CONNECTION|CONNECTIONTYPE|CONFIG|DATAPATTERN|DATA|DESCRIPTION|DEBUG|DRIVER|EMPTY|ERROR|EXPRESSION|EXTENT|EXTENSION|FILLED|FONT|FOOTER|FORCE|FROM|FILTER|FILTERITEM|FORMATOPTION|GROUP|HEADER|IMAGE|IMAGECOLOR|IMAGEPATH|IMAGEURL|INTERLACE|INTERVALS|IMAGETYPE|IMAGEMODE|INCLUDE|KEYIMAGE|KEYSIZE|KEYSPACING|LABELANGLEITEM|LABELCACHE|LABELITEM|LABELMAXSCALE|LABELMINSCALE|LABELSIZEITEM|LOG|LABELREQUIRES|LABELFORMAT|MAXFEATURES|MAXSCALEDENOM|MAXSIZE|MAXTEMPLATE|MINDISTANCE|MINFEATURESIZE|MINSCALEDENOM|MINSIZE|MINTEMPLATE|MINARCS|MAXARCS|MININTERVAL|MAXINTERVAL|MINSUBDIVIDE|MAXSUBDIVIDE|MIMETYPE|MARKER|MARKERSIZE|MINBOXSIZE|MAXBOXSIZE|NAME|OFFSET|OUTLINECOLOR|OFFSITE|OVERLAYOUTLINECOLOR|OVERLAYCOLOR|OVERLAYSYMBOL|OVERLAYSIZE|OVERLAYMINSIZE|OVERLAYMAXSIZE|OVERLAYBACKGROUNDCOLOR|PARTIALS|POSITION|POSTLABELCACHE|PROCESSING|QUERYITEM|REQUIRES|SCALE|SHAPEPATH|SIZE|SPACING|STATUS|STYLED|SYMBOL|SYMBOLSCALE|STYLEITEM|SIZEUNITS|SHADOWCOLOR|SHADOWSIZE|TABLE|TEMPLATE|TEXT|TILEINDEX|TILEITEM|TO|TOLERANCE|TOLERANCEUNITS|TRANSFORM|TRANSPARENT|TRANSPARENCY|TYPE|TEMPLATEPATTERN|UNITS|WRAP|WIDTH|OPACITY)($|\s)/;
			var rRegComment = /(^|\s{1,})#.+/;
		
		// Début de chaine ?
			if (stream.sol()) {
			// Ligne en commentaire ?	
				if (stream.match(rRegComment)) {
					stream.skipToEnd();
					return "commentaire";
				}			
			//	
				else if (stream.match(rRegGroup1)) {
					return "group1";
					stream.next();
				}			
				else if (stream.match(rRegGroup2)) {
					return "group2";
					stream.next();
				}			
			// Caractère suivant	
				else {
					stream.next();
					return null;
				}
			}
			else {
			// Chaine de caractères entre "" ?	
				if (stream.peek() == '"') {
					stream.next();
					if (stream.skipTo('"')) {
						stream.next();
						return 'chaine';
					}
				}
			// Rien à colorer	
				else {
					stream.next();
					return null;
				}
			}
		}
	};
});

/**
*
* Mode codeMirror pour les définitions mapserver
*
*/
CodeMirror.defineMode("symbol", function(){
	return {
		token: function(stream, state) {
			var rRegGroup1 = /(^|\s{1,})(SYMBOL|POINTS|END)($|\s)/i;
			var rRegGroup2 = /(^|\s{1,})(ANCHORPOINT|ANTIALIAS|CHARACTER|FILLED|FONT|IMAGE|NAME|TRANSPARENT|TYPE)($|\s)/i;
			var rRegComment = /(^|\s{1,})#.+/i;
		
		// Début de chaine ?
			if (stream.sol()) {
			// Ligne en commentaire ?	
				if (stream.match(rRegComment)) {
					stream.skipToEnd();
					return "commentaire";
				}			
			//	
				else if (stream.match(rRegGroup1)) {
					return "group1";
					stream.next();
				}			
				else if (stream.match(rRegGroup2)) {
					return "group2";
					stream.next();
				}			
			// Caractère suivant	
				else {
					stream.next();
					return null;
				}
			}
			else {
			// Chaine de caractères entre "" ?	
				if (stream.peek() == '"') {
					stream.next();
					if (stream.skipTo('"')) {
						stream.next();
						return 'chaine';
					}
				}
			// Rien à colorer	
				else {
					stream.next();
					return null;
				}
			}
		}
	};
});