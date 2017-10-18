/* global goog, angular, nsVmap, less, bootbox, ol, vitisApp */
/**
 * @author: Armand Bahi
 */
//less.refresh();
//G_testRunner.setStrict(false);

goog.provide('oVmap');

/**
 * Vmap Object
 * @type {object}
 * @export
 */
var oVmap = {};

/**
 * Angular module
 * @type {!angular.Module}
 */
oVmap.module = angular.module('vmap', ["formReader"]);

/**
 * Module config
 * 
 * @param {angular.$httpProvider} $httpProvider Angular httpProvider service.
 * @ngInject
 */
oVmap.config = function ($httpProvider) {

    $httpProvider.defaults.headers.get = {
        'Accept': 'application/x-vm-json'
    };

    $httpProvider.defaults.headers.post = {
        'Accept': 'application/x-vm-json'
    };

};
oVmap.module.config(oVmap.config);

/**
 * Filtre angular permettant de faire du orderBy sur des objets
 * ex: ng-repeat="node in ctrl.oBusinessObjects | orderObjectBy:'bo_title'"
 * @returns {Function}
 */
oVmap.orderObjectBy = function () {
    return function (items, field, reverse) {
        var filtered = [];
        angular.forEach(items, function (item) {
            filtered.push(item);
        });
        filtered.sort(function (a, b) {
            return (a[field] > b[field] ? 1 : -1);
        });
        if (reverse)
            filtered.reverse();
        return filtered;
    };

};
oVmap.module.filter('orderObjectBy', oVmap.orderObjectBy);

/**
 * Filtre angular permettant de connaitre le type d'un élément
 * @returns {Function}
 */
oVmap.getType = function () {
    return function (obj) {
        return typeof obj;
    };
};
oVmap.module.filter('getType', oVmap.getType);

/**
 * Filtre angular permettant de savoir si un élément est défini
 * @returns {Function}
 */
oVmap.isDef = function () {
    return function (obj) {
        return goog.isDefAndNotNull(obj);
    };
};
oVmap.module.filter('isDef', oVmap.isDef);

/**
 * Properties
 * @type {object}
 * @api stable
 */
oVmap.properties = {};

/**
 * Objet which contains the map
 * @type {nsVmap.Map}
 * @private
 */
oVmap.oMap_ = {};

/**
 * Objet which contains the layers tools (on the left band)
 * @type {nsVmap.nsMapManager.MapManager}
 * @private
 */
oVmap.oMapManager_ = {};

/**
 * Objet which contains the map tools (on the right band)
 * @private
 */
oVmap.oToolsManager_ = {};

/**
 * Function to log messages
 * @param {string} message message to log
 * @param {string} message2 message to log
 * @export
 */
oVmap.log = function (message, message2) {
    if (goog.isDefAndNotNull(oVmap['properties'])) {
        if (oVmap['properties']['debug_mode'])
            if (goog.isDef(message2))
                console.log(message, message2);
            else
                console.log(message);
    }
};

/**
 * Initialise Vmap
 * @export
 */
oVmap.init = function () {
    oVmap.log("oVmap.init");

    vitisApp.broadcast('vmapLoaded');

    var vMapLoaderScope = angular.element($('#app-vmap-loader')).scope();

    if (goog.isDefAndNotNull(vMapLoaderScope)) {
        angular.element($('#app-vmap-loader')).scope()['compileVmapTemplates']();
    } else {
        // Charge les template
        vitisApp.on('vmapLoaderOk', function () {
            angular.element($('#app-vmap-loader')).scope()['compileVmapTemplates']();
        });
    }

    var url = window.location.href;
    var indexOfLastFolder = url.lastIndexOf('/');
    var vmap_folder = url.slice(0, indexOfLastFolder);

    /**
     * Nom de l'application
     */
    if (!goog.isDefAndNotNull(sessionStorage['application'])) {
        sessionStorage['application'] = document.location.pathname.replace(/\//g, '');
    }

    oVmap['properties'] = window["oClientProperties"];
    oVmap['properties']['api_url'] = oVmap['properties']['web_server_name'] + '/' + oVmap['properties']['services_alias'];

    // Recherche si il y a le token dans l'url ou dans le session storage
    oVmap['properties']['token'] = goog.isDef(sessionStorage['session_token']) ?
            sessionStorage['session_token'] : oVmap.findInURL('token', window.location.href);

    if (goog.isDefAndNotNull(oVmap['properties']['token'])) {

        // Recupère les properties serveur
        ajaxRequest({
            'method': 'GET',
            'url': oVmap['properties']['api_url'] + '/vitis/properties',
            'async': false,
            'responseType': '',
            'success': function (response) {
                var data = JSON.parse(response['data']);
                goog.object.extend(oVmap['properties'], data);
                oVmap.log("properties: ", oVmap['properties']);
            }
        });

        // Recupère les projections dispo
        ajaxRequest({
            'method': 'GET',
            'url': oVmap['properties']['api_url'] + '/vmap/crss',
            'success': function (response) {
                var aCrs = response['data']['crss'];
                oVmap['oProjections'] = {};
                for (var i = 0; i < aCrs.length; i++) {
                    oVmap['oProjections'][aCrs[i]['crs_id']] = aCrs[i]['name'];
                }
            }
        });

    }

    // Instenciation des objects Vmap
    oVmap.oMap_ = new nsVmap.Map();
    oVmap.oMapManager_ = new nsVmap.nsMapManager.MapManager();
    oVmap.oToolsManager_ = new nsVmap.nsToolsManager.ToolsManager();

    // Resize les outils du bandeau de gauche
    oVmap.resizeAll();

    // Resize les outils du bandeau de gauche lorsque la fenêtre se resize
    $(window).resize(oVmap.resizeAll);

    // Active l'ooutil tooltip
    $('[data-toggle="tooltip"]').tooltip({animation: false});

    // Incrémenté lors de l'appel à la fonction oVmap.displayNoTokenMessage
    oVmap.noTokenMessage_ = 0;

    // S'inscrit au service WebSocket VmapEvents    
    if (goog.isDefAndNotNull(vitisApp['oWebsocket'])) {
        vitisApp['oWebsocket'].subscribeService('VmapEvents');
    }

};

/**
 * Vmap Directive
 *
 * @return {angular.Directive} The directive specs.
 * @export
 * @constructor
 */
oVmap.vmapDirective = function () {
    oVmap.log("oVmap.vmapDirective");
    vitisApp.broadcast('vmapDirectiveLoaded');
    return {
        restrict: 'A',
        controller: 'AppVmapController',
        controllerAs: 'vmapCtrl',
        bindToController: true,
        templateUrl: oVmap['properties']['vmap_folder'] + '/' + 'template/vmap.html'
    };
};

/**
 * Vmap controller
 * 
 * @constructor
 * @ngInject
 * @export
 */
oVmap.vmapController = function () {
    oVmap.log("oVmap.vmapController");

    var this_ = this;

    /**
     * Variable lang
     * @type {string}
     * @api stable
     */
    this.lang = this['lang'] = 'fr';

    /**
     * True if the panel is open
     * @type {boolean}
     * @api stable
     */
    this.left_open = this['left_open'] = false;

    /**
     * True if the panel is open
     * @type {boolean}
     * @api stable
     */
    this.right_open = this['right_open'] = false;

    /**
     * True if the panel is open
     * @type {boolean}
     * @api stable
     */
    this.bottom_open = this['bottom_open'] = false;

    /**
     * The OpenLayers map
     * @type {ol.Map}
     * @api stable
     */
    this.map = this['map'] = oVmap.getMap().getOLMap();

    /**
     * The current action on map
     * @type {string}
     * @api stable
     */
    this.currentAction = this['currentAction'] = '';

    /**
     * The OpenLayers map projection
     * @type {string}
     * @api stable
     */
    this.proj = this['proj'] = this.map.getView().getProjection().getCode();

    /**
     * The infoContainer infos
     * @type {string}
     * @api stable
     */
    this.infos = this['infos'] = [];

    /**
     * Root scope
     */
    oVmap['scope'] = angular.element('#app-vmap').scope();

    /**
     * Root controller
     */
    oVmap['ctrl'] = oVmap['scope']['vmapCtrl'];

    // Usefull Functions

    /**
     * Return the size of the object|array
     * @param {object|array} obj
     * @returns {Number}
     */
    oVmap['scope']['sizeOf'] = function (obj) {
        return Object.keys(obj).length;
    };

    /**
     * Return true if the element is defined and not false
     * @param {type} obj
     * @returns {Boolean}
     */
    oVmap['scope']['isDef'] = function (obj) {
        return goog.isDefAndNotNull(obj);
    };

    // Ferme le panier et le bandeau de droite quand on change de carte
    oVmap['scope'].$on('mapChanged', function () {
        // Ferme le panier
        oVmap['scope'].$applyAsync(function () {
            oVmap['scope']['ctrl']['bottom_open'] = false;
            oVmap.minResizeBottomBar();
        });
        // Ferme le bandeau de droite
        oVmap.simuleClickOnClass('tool-btn-active');
    });
};

/************************************************
 ------------ GETTERS AND SETTERS ----------------
 *************************************************/
/**
 * nsVmap.oMap_ getter
 * @return {nsVmap.Map} Map to use
 * @export
 * @api experimental
 */
oVmap.getMap = function () {
    return this.oMap_;
};

/**
 * nsVmap.oMapManager_ getter
 * @return {nsVmap.nsMapManager.MapManager} Tools fo layers
 * @export
 * @api experimental
 */
oVmap.getMapManager = function () {
    return this.oMapManager_;
};

/**
 * nsVmap.oToolsManager_ getter
 * @return {nsVmap.nsToolsManager.ToolsManager} Tools for map
 * @export
 * @api experimental
 */
oVmap.getToolsManager = function () {
    return this.oToolsManager_;
};

// Usefull Functions

/**
 * Function find attributes in url
 * @param {string} element element to find
 * @param {string} url url to parse
 * @return {string} value of the element
 * @export
 */
oVmap.findInURL = function (element, url) {

    var elementIndexEnd = 0;

    if (url.indexOf('?') === -1)
        return undefined;

    url = url.slice(url.indexOf('?') + 1);

    if (url.indexOf(element + '=') === -1)
        return undefined;

    url = url.slice(url.indexOf(element + '='));

    if (url.indexOf('&') !== -1) {
        elementIndexEnd = url.indexOf('&');
        url = url.slice(0, elementIndexEnd);
    }

    elementIndexEnd = url.indexOf('=');
    url = url.slice(elementIndexEnd + 1);

    return url;
};

/**
 * Function called when a layer is added on the map by layerstree.js
 */
oVmap.layerAdded = function () {
    // donne la valeur de la projection à l'outil current-projection
    $("#current-projection").html(oVmap['oProjections'][oVmap.getMap().getOLMap().getView().getProjection().getCode()]);
    var vMapCatalog = oVmap.getMapManager().getMapCatalog();
    for (var i = 0; i < vMapCatalog['maps'].length; i++) {
        if (vMapCatalog['maps'][i]['used'] === true) {
            var currentMapName = vMapCatalog['maps'][i]['name'];
        }
    }
    $("#map-name").html(currentMapName);
};

/**
 * Function to move elements in array
 * @param {array} array Array to change
 * @param {integer} old_index Index of the element to move
 * @param {integer} new_index Index where move the element
 * @return {array} The new array
 */
oVmap.moveInArray = function (array, old_index, new_index) {
    if (new_index >= array.length) {
        var k = new_index - array.length;
        while ((k--) + 1) {
            array.push(undefined);
        }
    }
    array.splice(new_index, 0, array.splice(old_index, 1)[0]);
    return array;
};

/**
 * Convert an object to csv
 * @param {object} objArray object to convert
 * @param {boolean} labels true if you want to include the labels in the first row
 * @param {boolean} quotes true if you want to wrap the values in double quotes
 */
oVmap.JSON2CSV = function (objArray, labels, quotes) {
    var array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    var line = '';
    if (labels === true) {
        var head = array[0];
        if ($("#quote").is(':checked')) {
            for (var index in array[0]) {
                var value = index + "";
                line += '"' + value.replace(/"/g, '""') + '",';
            }
        } else {
            for (var index in array[0]) {
                line += index + ',';
            }
        }
        line = line.slice(0, -1);
        str += line + '\r\n';
    }
    for (var i = 0; i < array.length; i++) {
        var line = '';
        if (quotes === true) {
            for (var index in array[i]) {
                var value = array[i][index] + "";
                line += '"' + value.replace(/"/g, '""') + '",';
            }
        } else {
            for (var index in array[i]) {
                line += array[i][index] + ',';
            }
        }
        line = line.slice(0, -1);
        str += line + '\r\n';
    }
    return str;
};

/**
 * Simule a click on a target by id
 * @param {string} target id of the target
 * @export
 */
oVmap.simuleClick = function (target) {
    oVmap.log("simuleClick : " + target);
    if (goog.isDefAndNotNull(document.getElementById(target))) {
        var evt = document.createEvent("MouseEvents");
        evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        document.getElementById(target).dispatchEvent(evt);
        var evt = document.createEvent("MouseEvents");
        evt.initMouseEvent("mouseout", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        document.getElementById(target).dispatchEvent(evt);
    } else {
        console.error('target undefined: ', target);
    }
};

/**
 * Simule a click on targets by class name
 * @param {string} targets class of the targets
 * @export
 */
oVmap.simuleClickOnClass = function (targets) {
    oVmap.log("simuleClickOnClass : " + targets);
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    var aElements = document.getElementsByClassName(targets);
    for (var i = 0; i < aElements.length; i++) {
        aElements[i].dispatchEvent(evt);
    }
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("mouseout", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    aElements = document.getElementsByClassName(targets);
    for (var i = 0; i < aElements.length; i++) {
        aElements[i].dispatchEvent(evt);
    }
};

/**
 * Write a succes message under the layers tools
 * @param {string} message message to display
 * @param {string} target Target Id
 * @export
 */
oVmap.displaySucces = function (message, target) {
    $("#" + target).show();
    var messageContainer = document.getElementById(target);
    var numberOfChildren = messageContainer.getElementsByTagName('*').length;
    var messageDiv = goog.dom.createDom('div', {'id': target + '_' + numberOfChildren,
        'class': 'alert alert-warning', 'role': 'alert'}, null);
    goog.dom.appendChild(messageContainer, messageDiv);
    var closeMessageButton = goog.dom.createDom('button', {'class': 'close'}, "x");
    closeMessageButton.onclick = function () {
        $('#' + target + '_' + numberOfChildren).hide();
    };
    goog.dom.appendChild(messageDiv, closeMessageButton);
    var messageDom = goog.dom.createDom('strong', null, message);
    goog.dom.appendChild(messageDiv, messageDom);
};

/**
 * Write a info message under the layers tools
 * @param {string} message message to display
 * @param {string} target Target Id
 * @export
 */
oVmap.displayInfo = function (message, target) {
    $("#" + target).show();
    var messageContainer = document.getElementById(target);
    var numberOfChildren = messageContainer.getElementsByTagName('*').length;
    var messageDiv = goog.dom.createDom('div', {'id': target + '_' + numberOfChildren,
        'class': 'alert alert-warning', 'role': 'alert'}, null);
    goog.dom.appendChild(messageContainer, messageDiv);
    var closeMessageButton = goog.dom.createDom('button', {'class': 'close'}, "x");
    closeMessageButton.onclick = function () {
        $("#" + target + '_' + numberOfChildren).hide();
    };
    goog.dom.appendChild(messageDiv, closeMessageButton);
    var messageDom = goog.dom.createDom('strong', null, message);
    goog.dom.appendChild(messageDiv, messageDom);
};

/**
 * Write a warning message under the layers tools
 * @param {string} message message to display
 * @param {string} target Target Id
 * @export
 */
oVmap.displayWarning = function (message, target) {
    $("#" + target).show();
    var messageContainer = document.getElementById(target);
    var numberOfChildren = messageContainer.getElementsByTagName('*').length;
    var messageDiv = goog.dom.createDom('div', {'id': target + '_' + numberOfChildren,
        'class': 'alert alert-warning', 'role': 'alert'}, null);
    goog.dom.appendChild(messageContainer, messageDiv);
    var closeMessageButton = goog.dom.createDom('button', {'class': 'close'}, "x");
    closeMessageButton.onclick = function () {
        $("#" + target + '_' + numberOfChildren).hide();
    };
    goog.dom.appendChild(messageDiv, closeMessageButton);
    var messageDom = goog.dom.createDom('strong', null, message);
    goog.dom.appendChild(messageDiv, messageDom);
};

/**
 * Write a error message under the layers tools
 * @param {string} message Error message to display
 * @param {string} target Target Id
 * @export
 */
oVmap.displayError = function (message, target) {
    message = "Erreur: " + message;
    $("#" + target).show();
    var messageContainer = document.getElementById(target);
    var numberOfChildren = messageContainer.getElementsByTagName('*').length;
    var messageDiv = goog.dom.createDom('div', {'id': target + '_' + numberOfChildren,
        'class': 'alert alert-warning', 'role': 'alert'}, null);
    goog.dom.appendChild(messageContainer, messageDiv);
    var closeMessageButton = goog.dom.createDom('button', {'class': 'close'}, "x");
    closeMessageButton.onclick = function () {
        $("#" + target + '_' + numberOfChildren).hide();
    };
    goog.dom.appendChild(messageDiv, closeMessageButton);
    var messageDom = goog.dom.createDom('strong', null, message);
    goog.dom.appendChild(messageDiv, messageDom);
};

/**
 * 
 * @param {object} opt_options
 * @param {string|undefined} opt_options.target
 * @param {string} opt_options.coordinates
 * @param {string} opt_options.type ('top-left, top-right, bottom-left, bottom-right')
 * @param {string} message
 * @returns {string} messageDiv
 * @export
 */
oVmap.displayTooltipError = function (opt_options, message) {

    var offsetX = 0;
    var offsetY = 0;

    if (goog.isDef(opt_options.target)) {
        $(opt_options.target).animate({opacity: 0}, 300, "linear")
                .animate({opacity: 1}, 300, "linear")
                .animate({opacity: 0}, 300, "linear")
                .animate({opacity: 1}, 300, "linear")
                .animate({opacity: 0}, 300, "linear")
                .animate({opacity: 1}, 300, "linear");
    }

    // Récupère les coordonnées de la target
    if (goog.isDef(opt_options.target)) {
        var offset = $(opt_options.target).offset();
        opt_options.coordinates = [offset.left, offset.top];
    }

    if (!goog.isDef(opt_options.coordinates))
        return 0;

    // Type par défaut
    opt_options.type = goog.isDef(opt_options.type) ? opt_options.type : 'top-right';

    var messageDiv = goog.dom.createDom('div', {'class': 'tooltip-error tooltip-error-' + opt_options.type, 'role': 'alert'}, null);
    var messageDom = goog.dom.createDom('strong', null, message);

    // Met la div dans le body
    goog.dom.appendChild(document.body, messageDiv);
    goog.dom.appendChild(messageDiv, messageDom);

    // place la tooltip par rapport au target
    if (opt_options.type === 'top-left') {

        if (goog.isDef(opt_options.target))
            offsetX = 0 - messageDiv.offsetWidth + 33;
        else
            offsetX = 0 - messageDiv.offsetWidth + 13;

        offsetY = 0 - messageDiv.offsetHeight - 12;

    } else if (opt_options.type === 'top-right') {

        offsetX = $(opt_options.target).width() - 35;
        offsetY = 0 - messageDiv.offsetHeight - 12;

    } else if (opt_options.type === 'bottom-left') {

        offsetX = 0 - messageDiv.offsetWidth + 33;
        offsetY = $(opt_options.target).height() + 12;

    } else if (opt_options.type === 'bottom-right') {

        offsetX = $(opt_options.target).width() - 35;
        offsetY = $(opt_options.target).height() + 12;

    }

    messageDiv.style.left = opt_options.coordinates[0] + offsetX + 'px';
    messageDiv.style.top = opt_options.coordinates[1] + offsetY + 'px';

    // Détruit la div lors su click ailleurs que sur la div
    var bodyEvent = goog.events.listenOnce(document.body, goog.events.EventType.CLICK, function (evt) {
        oVmap.log('remove error tooltip');
        if (evt.target !== messageDiv)
            document.body.removeChild(messageDiv);
    });

    return messageDiv;
};

/**
 * Set the layers order tools max height
 * @param {boolean} animate true if the function have to animate
 * @export
 * @api experimental
 */
oVmap.resizeLayerTools = function (animate) {
    oVmap.log("oVmap.resizeLayerTools: " + animate);

    if (goog.isDef(angular.element($('#olMap')).scope()))
        angular.element($('#olMap')).scope()['ctrl'].startAnimation();

    var aItems = ["layertree", "layersorder", "maplegendcontainer"];
    var iMarge = 0;
    var iNbCollapses = 0;
    var iNbItems = aItems.length;
    var iMaxHeight = 0;

    /**
     * Set collapste in/out and get if is collapse
     * @param {string} id id of the html element
     * @return {boolean} true if the element is not collapse
     */
    var getCollapse = function (id) {
        if ($("#" + id).attr("collapse") === "out") {
            return true;
        } else
            return false;
    };

    var setHeight = function (aItems, aMaxHeight, aHeight) {

        var aBigElements = {
            sItem: [],
            iHeight: [],
            iMaxHeight: []
        };

        var iOverHeight = 0;

        // Cherche les elements qui sont plus grand que la normale
        for (var i = 0; i < aItems.length; i++) {

            // Si plus grand que la nourmale, on l'incrit dans un objet que l'on utilisera plus tard,
            // Sinon on lui donne son animation
            if ((aHeight[i] >= aMaxHeight[i]) && (getCollapse(aItems[i]) === false)) {
                aBigElements.sItem.push(aItems[i]);
                aBigElements.iHeight.push(aHeight[i]);
                aBigElements.iMaxHeight.push(aMaxHeight[i]);
            } else {
                if (aMaxHeight[i] > aHeight[i])
                    iOverHeight += (aMaxHeight[i] - aHeight[i]);

                if (animate === true) {
                    $("#" + aItems[i]).animate({"max-height": aMaxHeight[i]});
                } else
                    $("#" + aItems[i]).css({"max-height": aMaxHeight[i]});
            }
        }

        // Pour les elements grands, on ajoute à leur max-height une part du blanc de façon à compenser tous les trous
        for (var i = 0; i < aBigElements.sItem.length; i++) {
            var heightToAdd = iOverHeight / aBigElements.sItem.length;
            if (animate === true)
                $("#" + aBigElements.sItem[i]).animate({"max-height": aBigElements.iMaxHeight[i] + heightToAdd});
            else
                $("#" + aBigElements.sItem[i]).css({"max-height": aBigElements.iMaxHeight[i] + heightToAdd});
        }
        ;
    };

    var headersHeight = $("#maplistlitle-container").height();

    for (var i = 0; i < aItems.length; i++) {

        // Calcule la hauteur des boutons
        headersHeight += $("#" + aItems[i] + "-button").height();

        // Compte le nombre de collapses
        if (getCollapse(aItems[i]) === true)
            iNbCollapses++;
    }

    var aMaxHeight = [];
    var aHeight = [];

    iMaxHeight = ($("#left-sidebar").height() - headersHeight) / (iNbItems - iNbCollapses) - iMarge;

    // Donne la valeur max-height aux éléments correspondants
    for (var i = 0; i < aItems.length; i++) {

        // Récupère la hauteur théorique
        aMaxHeight[i] = $("#" + aItems[i]).css("max-height");
        $("#" + aItems[i]).css({"max-height": ""});
        aHeight[i] = $("#" + aItems[i]).height();
        $("#" + aItems[i]).css({"max-height": aMaxHeight[i]});

        // Donne la valeur du max-height
        if (getCollapse(aItems[i]) === false)
            aMaxHeight[i] = iMaxHeight;
        else
            aMaxHeight[i] = 0;
    }

    setHeight(aItems, aMaxHeight, aHeight);
};

/**
 * Print the content of an element
 * @param {string} elem html element selector
 * @export
 */
oVmap.printElem = function (elem) {
    oVmap.log('print: ' + elem);

    var this_ = this;

    var data = $(elem).html();
    this.printElemWindow_ = window.open('', 'Impression', 'height=400,width=600');
    this.printElemWindow_.document.write('<html><head><title>Impression</title>');
    /* stylesheet*/
    this.printElemWindow_.document.write($("HEAD").html());
    this.printElemWindow_.document.write('<style>.print-hidden{visibility: hidden !important;}</style>');
    this.printElemWindow_.document.write('</head><body>');
    this.printElemWindow_.document.write(data);
    this.printElemWindow_.document.write('</body></html>');

    setTimeout(function () {
        this_.printElemWindow_.document.close(); // necessary for IE >= 10
        this_.printElemWindow_.focus(); // necessary for IE >= 10
        this_.printElemWindow_.print();
        this_.printElemWindow_.close();
    }, 500);


};

/**
 * Resize the bottombar to 50%
 * @export
 */
oVmap.maxResizeBottomBar = function () {
    angular.element($('#olMap')).scope()['ctrl'].startAnimation();

    $(".open-more-selection-info").toggleClass("reverse");

    if (!$("#map-container").hasClass("open2")) {
        $("#map-container").addClass("open2");
        $("#bottombar").addClass("open2");
    } else {
        $("#map-container").removeClass("open2");
        $("#bottombar").removeClass("open2");
    }
};

/**
 * Resize the bottombar to 25%
 * @export
 */
oVmap.minResizeBottomBar = function () {
    angular.element($('#olMap')).scope()['ctrl'].startAnimation();

    if ($("#map-container").hasClass("open2")) {
        $("#map-container").removeClass("open2");
        $("#bottombar").removeClass("open2");
        $(".open-more-selection-info").removeClass("reverse");
    } else if ($("#map-container").hasClass("open")) {
        $("#map-container").addClass("minus");
    }
};

/**
 * resize all
 */
oVmap.resizeAll = function () {
    // resize le bandeau de gauche
    oVmap.resizeLayerTools(false);
};

/**
 * Parse a WKT geom and a EPSG projection code to return an EWKT geometry
 * @param {string} WKTGeom WKT Geom
 * @param {string} EPSGProj EPSG Code
 * @returns {string} EWKT Geom
 */
oVmap.getEWKTFromWKT = function (WKTGeom, EPSGProj) {
    oVmap.log('getEWKTFromWKT');

    if (!goog.isString(WKTGeom)) {
        console.error('WKTGeom is not a string');
        return null;
    }
    if (!goog.isString(EPSGProj)) {
        console.error('EPSGProj is not a string');
        return null;
    }
    if (!EPSGProj.indexOf('EPSG:') === 0) {
        console.error('EPSGProj is not an EPSG code');
        return null;
    }

    var SRID = EPSGProj.substr(5);
    var EWKTGeom = 'SRID=' + SRID + ';' + WKTGeom;

    return EWKTGeom;
};

/**
 * Return an EWKT geometry from a geom and a proj
 * @param {ol.geom.Geometry} geom
 * @param {String|undefined} proj
 * @returns {String} EWKT Geom
 */
oVmap.getEWKTFromGeom = function (geom, proj) {
    oVmap.log('getEWKTFromWKT');

    if (!goog.isDefAndNotNull(geom)) {
        console.error('geom is not defined');
        return null;
    }

    proj = goog.isDefAndNotNull(proj) ? proj : oVmap.getMap().getOLMap().getView().getProjection().getCode();

    if (!goog.isString(proj)) {
        console.error('proj is not a string');
        return null;
    }
    if (!proj.indexOf('EPSG:') === 0) {
        console.error('proj is not an EPSG code');
        return null;
    }

    var WKT = new ol.format.WKT();
    var WKTGeom = WKT.writeGeometry(geom, {
        dataProjection: proj,
        featureProjection: proj
    });

    var SRID = proj.substr(5);
    var EWKTGeom = 'SRID=' + SRID + ';' + WKTGeom;

    return EWKTGeom;
};

/**
 * Return true if EWKTGeom is an EWKT geometry 
 * @param {string} EWKTGeom
 * @returns {boolean}
 */
oVmap.isEWKTGeom = function (EWKTGeom) {
    oVmap.log('isEWKTGeom');

    if (EWKTGeom.substr(0, 5).toUpperCase() !== 'SRID=')
        return false;

    var WKTFormat = new ol.format.WKT();
    var WKTGeom = EWKTGeom.substr(EWKTGeom.indexOf(';') + 1);

    try {
        WKTFormat.readGeometry(WKTGeom);
    } catch (e) {
        console.error('readGeometry failed: ', EWKTGeom);
        return false;
    }

    return true;
};

/**
 * Return an OpenLayers geometry from a EWKT geom
 * @param {string} EWKTGeom
 * @param {string|undefined} proj
 * @returns {ol.geom.Geometry}
 */
oVmap.getGeomFromEWKT = function (EWKTGeom, proj) {
    oVmap.log('getGeomFromEWKT');

    if (!goog.isString(EWKTGeom)) {
        console.error('EWKTGeom is not a string: ', EWKTGeom);
        return null;
    }

    proj = goog.isDefAndNotNull(proj) ? proj : oVmap.getMap().getOLMap().getView().getProjection().getCode();

    if (this.isEWKTGeom(EWKTGeom)) {

        var WKTFormat = new ol.format.WKT();
        var WKTGeom = EWKTGeom.substr(EWKTGeom.indexOf(';') + 1);
        var EWKTGeomProj = 'EPSG:' + EWKTGeom.slice(5, EWKTGeom.indexOf(';'));

        var oGeom = WKTFormat.readGeometry(WKTGeom, {
            dataProjection: EWKTGeomProj,
            featureProjection: proj
        });

        return oGeom;

    } else {
        console.error('Geom is not an EWKT Geometry: ', EWKTGeom);
        return null;
    }

};

/**
 * Get all the loaded styles
 * @returns {Array}
 * @export
 */
oVmap.getStyles = function () {
    var aStyles = [];
    $('link[rel="stylesheet"]').each(function (i, ele) {
        ajaxRequest({
            'method': 'GET',
            'url': $(this).attr('href'),
            'async': false,
            'responseType': '',
            'success': function (response) {
                var css = response['data'];
                var style = document.createElement('style');
                style.type = 'text/css';
                if (style.styleSheet) {
                    style.styleSheet.cssText = css;
                } else {
                    style.appendChild(document.createTextNode(css));
                }
                aStyles.push(style);
            }
        });
    });
    $('style').each(function (i, ele) {
        var css = this.innerHTML;
        var style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
        aStyles.push(style);
    });
    return aStyles;
};

/**
 * Generate a report
 * @param {object} opt_options
 * @param {string} opt_options.printReportId
 * @param {string} opt_options.ids
 * @export
 */
oVmap.generatePrintReport = function (opt_options) {
    oVmap.log('oVmap.generatePrintReport');

    if (!goog.isDefAndNotNull(opt_options['printReportId'])) {
        console.error('generatePrintReport: opt_options.printReportId undefined');
        return 0;
    }
    if (!goog.isDefAndNotNull(opt_options['ids'])) {
        console.error('generatePrintReport: opt_options.ids undefined');
        return 0;
    }

    var printReportId = opt_options['printReportId'];
    var aIds = opt_options['ids'];
    var sIds = '';

    for (var i = 0; i < aIds.length; i++) {
        if (i > 0)
            sIds += '|';
        sIds += aIds[i];
    }

    // Ouvre la fenêtre d'impression
    var printWindow = window.open("", '_blank', 'height=400,width=600');

    // Si le navigateur bloque les fenêtres
    if (!goog.isDefAndNotNull(printWindow)) {
        $.notify('Fenêtre d\'impression bloquée par le navigateur', 'error');
        return 0;
    }
    printWindow.document.write('<div style="width: 100%; text-align: center; margin-top: 80px"><img src="images/ajax-big-loader.GIF" alt="Load img" style="width: 200px;height: 170px;"><br><br><i style="color: gray">Construction de la fiche en cours..</i></div>');

    ajaxRequest({
        'method': 'POST',
        'url': oVmap['properties']['api_url'] + '/vmap/printreportservices',
        'headers': {
            'Accept': 'application/x-vm-json'
        },
        'data': {
            'printreport_id': printReportId,
            'ids': sIds
        },
        'timeout': 120000,
        'success': function (response) {

            var bError = false;
            if (!goog.isDefAndNotNull(response['data'])) {
                bError = true;
            } else if (!goog.isDefAndNotNull(response['data']['printreportservices'])) {
                bError = true;
            } else if (!goog.isDefAndNotNull(response['data']['printreportservices']['fileurl'])) {
                bError = true;
            } else if (response['data']['status'] !== 1) {
                bError = true;
            }
            if (bError) {
                $.notify('Une erreur est survenue lors de l\'impression', 'error');
                printWindow.document.write('<div style="width: 100%; text-align: center; margin-top: 80px">Une erreur est survenue lors de l\'impression</div>');
                console.error("response: ", response);
                return 0;
            }

            $.notify('Impression réussie', 'success');

            // Ajoute les styles d'impression
            var aStyles = oVmap.getStyles();
            for (var i = 0; i < aStyles.length; i++) {
                try {
                    printWindow.document.head.appendChild(aStyles[i]);
                } catch (e) {

                }
            }

            // Ajoute le bouton d'impression
            printWindow.document.body.style.textAlign = 'center';
            printWindow.document.body.innerHTML = '<a href="' + response['data']['printreportservices']['fileurl'] + '" style="margin-top: calc(50vh - 46px);" class="btn btn-lg btn-primary btn-bs btn-outline" download>Télécharger le rapport</a>';

        },
        'error': function (response) {
            $.notify('Une erreur est survenue lors de l\'impression', 'error');
            printWindow.document.write('<div style="width: 100%; text-align: center; margin-top: 80px">Une erreur est survenue lors de l\'impression</div>');
        }
    });
};

/**
 * Get if the item is a link to parse ex: [link href="https://www.google.fr" target="_blank"]Lien[/link]
 * @param {String} item
 * @param {String} tagIdentifier the indentifier inside the brackets ex: [link] or [bo_link]
 * @returns {Boolean}
 * @export
 */
oVmap.isLink = function (item, tagIdentifier) {
    if (!goog.isString(item)) {
        return false;
    }
    tagIdentifier = goog.isDefAndNotNull(tagIdentifier) ? tagIdentifier : 'link';
    if (item.indexOf('[' + tagIdentifier) !== -1 && item.indexOf('[/' + tagIdentifier + ']') !== -1) {
        return true;
    }
    return false;
};

/**
 * Parse a tagged link ex: [link href="https://www.google.fr" target="_blank"]Lien[/link]
 * @param {String} sString
 * @param {String} tagIdentifier the indentifier inside the brackets ex: [link] or [bo_link]
 * @returns {String}
 * @export
 */
oVmap.parseLink = function (sString, tagIdentifier) {
    tagIdentifier = goog.isDefAndNotNull(tagIdentifier) ? tagIdentifier : 'link';
    var sLink = sString.substr(sString.indexOf('[' + tagIdentifier), sString.indexOf('[/' + tagIdentifier + ']') - sString.indexOf('[' + tagIdentifier) + 10);
    var sLinkFirstTag = oVmap.getFirstLinkTag_(sLink);
    var sLinkLastTag = '[/' + tagIdentifier + ']';
    var sLinkContent = oVmap.getLinkContent_(sLink, sLinkFirstTag, sLinkLastTag);
    var oLinkArgs = oVmap.getLinkTagArguments_(sLinkFirstTag);

    var sHref = goog.isDefAndNotNull(oLinkArgs['href']) ? oLinkArgs['href'] : null;
    var sTarget = goog.isDefAndNotNull(oLinkArgs['target']) ? oLinkArgs['target'] : '_blank';
    var sContent = sLinkContent.length > 0 ? sLinkContent : sHref;

    if (goog.isDefAndNotNull(sHref)) {
        var sLink = '<a href="' + sHref + '" target="' + sTarget + '">' + sContent + '</a>';
        return sLink;
    } else {
        console.error('cannot parse href');
        return sString;
    }
};

/**
 * Get the first tag
 * @param {String} sLink
 * @returns {String}
 */
oVmap.getFirstLinkTag_ = function (sLink) {

    var quoteIndex1 = null;
    var quoteIndex2 = null;
    var bInArgument = false;
    var sLinkFirstTag = '';

    for (var i = 0; i < sLink.length; i++) {
        sLinkFirstTag += sLink[i];
        if (sLink[i] === '"') {
            if (quoteIndex1 === null) {
                if (sLink[i - 1] !== '\\') {
                    quoteIndex1 = i;
                    continue;
                }
            }
        }
        if (sLink[i] === '"') {
            if (quoteIndex2 === null && quoteIndex1 !== null) {
                if (sLink[i - 1] !== '\\') {
                    quoteIndex2 = i;
                    continue;
                }
            }
        }

        if (quoteIndex1 !== null && quoteIndex2 === null) {
            bInArgument = true;
        } else {
            bInArgument = false;
            if (quoteIndex1 !== null && quoteIndex2 !== null) {
                quoteIndex1 = null;
                quoteIndex2 = null;
            }
        }

        if (!bInArgument && sLink[i] === ']') {
            break;
        }
    }
    return sLinkFirstTag;
};

/**
 * Get the content
 * @param {String} sLink
 * @param {String} sLinkFirstTag
 * @param {String} sLinkLastTag
 * @returns {unresolved}
 */
oVmap.getLinkContent_ = function (sLink, sLinkFirstTag, sLinkLastTag) {

    // sLink sans le premier tag
    var content1 = sLink.substr(sLink.indexOf(sLinkFirstTag) + sLinkFirstTag.length);
    // Contenu
    var content = content1.substr(0, content1.indexOf(sLinkLastTag));
    return content;
};

/**
 * Get the arguments
 * @param {String} sLinkTag
 * @returns {Object}
 */
oVmap.getLinkTagArguments_ = function (sLinkTag) {

    var quoteIndex1 = null;
    var quoteIndex2 = null;
    var spaceIndex = null;
    var equalIndex = null;
    var content = null;
    var argument = null;
    var bInArgument = false;
    var oArguments = {};

    for (var i = 0; i < sLinkTag.length; i++) {

        if (sLinkTag[i] === '"') {
            if (quoteIndex1 === null) {
                if (sLinkTag[i - 1] !== '\\') {
                    quoteIndex1 = i;
                    continue;
                }
            }
        }
        if (sLinkTag[i] === '"') {
            if (quoteIndex2 === null && quoteIndex1 !== null) {
                if (sLinkTag[i - 1] !== '\\') {
                    quoteIndex2 = i;
                    continue;
                }
            }
        }

        if (quoteIndex1 !== null && quoteIndex2 === null) {
            bInArgument = true;
        } else {
            bInArgument = false;
            if (quoteIndex1 !== null && quoteIndex2 !== null) {
                content = sLinkTag.substr(quoteIndex1 + 1, quoteIndex2 - quoteIndex1 - 1);
                quoteIndex1 = null;
                quoteIndex2 = null;
            }
        }

        if (!bInArgument) {
            if (sLinkTag[i] === ' ') {
                if (spaceIndex === null) {
                    spaceIndex = i;
                }
            }
            if (sLinkTag[i] === '=') {
                if (equalIndex === null) {
                    equalIndex = i;
                }
            }

            if (spaceIndex !== null && equalIndex !== null) {
                argument = sLinkTag.substr(spaceIndex + 1, equalIndex - spaceIndex - 1);
                spaceIndex = null;
                equalIndex = null;
            }
        }

        if (content !== null && argument !== null) {
            oArguments[argument] = content;
            content = null;
            argument = null;
        }
    }
    return oArguments;
};

/**
 * Download a blob in a file
 * @param {object} oBlob
 * @param {string} sFileName
 * @export
 */
oVmap.downloadBlob = function (oBlob, sFileName) {

    // IE
    if (window.navigator['msSaveOrOpenBlob']) {
        window.navigator['msSaveOrOpenBlob'](oBlob, sFileName);
    }
    // Others
    else {
        var a = document.createElement("a");
        var url = window.URL.createObjectURL(oBlob);
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = url;
        a.download = sFileName;
        a.click();
        window.URL.revokeObjectURL(url);
    }
};

/**
 * appVmapLoaderDrtv directive.
 * Charge les template vMap en utilisant compileVmapTemplates
 * @param {service} $compile
 * @param {service} $log
 * @ngInject
 */
oVmap.appVmapLoaderDrtv = function ($compile, $log) {
    return {
        link: function (scope, element, attrs) {
            $log.log("formReader.appSubformDrtv.link");

            var content;
            var template = '<div app-vmap id="app-vmap"></div>';

            scope['compileVmapTemplates'] = function () {
                $log.log("compileVmapTemplates");

                scope.$applyAsync(function () {
                    // compile the provided template against the current scope
                    content = $compile(template)(scope);
                    // add the template content
                    element.html("");
                    element.append(content);

                });
            };
            vitisApp.broadcast('vmapLoaderOk');
        }
    };
};
oVmap.module.directive("appVmapLoader", oVmap.appVmapLoaderDrtv);

// Définit la directive et le controller
oVmap.module.directive('appVmap', oVmap.vmapDirective);
oVmap.module.controller('AppVmapController', oVmap.vmapController);