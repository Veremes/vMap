/**
*
* Mode codeMirror pour les définitions mapserver
*
*/
CodeMirror.defineMode("map", function(){
	return {
		token: function(stream, state) {
			var rRegGroup1 = /(^|\s{1,})(COMPOSITE|MAP|LINESET|MARKERSET|POINTS|SHADESET|STYLE|CLASS|FEATURE|JOIN|LABEL|LAYER|LEGEND|PROJECTION|GRID|QUERY|OUTPUTFORMAT|QUERYMAP|REFERENCE|SCALEBAR|WEB|METADATA|END|FONTSET|SYMBOLSET|VALIDATION|PATTERN)($|\s)/;
			var rRegGroup2 = /(^|\s{1,})(ALIGN|ANGLE|ANTIALIAS|BACKGROUNDCOLOR|BACKGROUNDSHADOWCOLOR|BACKGROUNDSHADOWSIZE|BUFFER|CHARACTER|CLASSITEM|COLOR|CONFIG|CONNECTION|CONNECTIONTYPE|DATA|DATAPATTERN|DEBUG|DESCRIPTION|DRIVER|EMPTY|ERROR|EXPRESSION|EXTENSION|EXTENT|FILLED|FILTER|FILTERITEM|FONT|FOOTER|FORCE|FORMATOPTION|FROM|GAP|GEOMTRANSFORM|GROUP|HEADER|IMAGE|IMAGECOLOR|IMAGEMODE|IMAGEPATH|IMAGETYPE|IMAGEURL|INCLUDE|INTERLACE|INTERVALS|KEYIMAGE|KEYSIZE|KEYSPACING|LABELANGLEITEM|LABELCACHE|LABELFORMAT|LABELITEM|LABELMAXSCALE|LABELMAXSCALEDENOM|LABELMINSCALE|LABELMINSCALEDENOM|LABELREQUIRES|LABELSIZEITEM|LINECAP|LINEJOIN|LINEJOINMAXSIZE|LOG|MARKER|MARKERSIZE|MAXARCS|MAXBOXSIZE|MAXFEATURES|MAXINTERVAL|MAXSCALEDENOM|MAXSIZE|MAXSUBDIVIDE|MAXTEMPLATE|MIMETYPE|MINARCS|MINBOXSIZE|MINDISTANCE|MINFEATURESIZE|MININTERVAL|MINSCALEDENOM|MINSIZE|MINSUBDIVIDE|MINTEMPLATE|NAME|OFFSET|OFFSITE|OPACITY|OUTLINECOLOR|OVERLAYBACKGROUNDCOLOR|OVERLAYCOLOR|OVERLAYMAXSIZE|OVERLAYMINSIZE|OVERLAYOUTLINECOLOR|OVERLAYSIZE|OVERLAYSYMBOL|PARTIALS|POSITION|POSTLABELCACHE|PROCESSING|QUERYITEM|REQUIRES|SCALE|SHADOWCOLOR|SHADOWSIZE|SHAPEPATH|SIZE|SIZEUNITS|SPACING|STATUS|STYLED|STYLEITEM|SYMBOL|SYMBOLSCALE|SYMBOLSCALEDENOM|TABLE|TEMPLATE|TEMPLATEPATTERN|TEXT|TILEINDEX|TILEITEM|TO|TOLERANCE|TOLERANCEUNITS|TRANSFORM|TRANSPARENCY|TRANSPARENT|TYPE|UNITS|WIDTH|WRAP)($|\s)/;
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