/* global ol, nsUtils */

/**
 * Class Template
 * @param {object} opt_options
 */
PrintTemplate = function (opt_options) {

    var this_ = this;

    this.token = opt_options.token;

    this.apiUrl = opt_options.apiUrl;

    this.templateId = opt_options.templateId;

    this.includes = opt_options.includes;

    this.templateDefinition = this.getTemplateDefinition(this.templateId);

    var template = document.createElement("div");
    template.innerHTML = this.templateDefinition;

    var $scope = angular.element($('#print_template')).scope();

    // Ajoute les attributs de opt_options.scope dans $scope
    for (var option in opt_options.scope) {
        $scope[option] = opt_options.scope[option];
    }

    var templateCompiled = $scope.$compile(template)($scope);

    $('#print_template').append(templateCompiled);

    $scope.$digest();

    this.addTemplateIncludes(opt_options.includes);
};

/**
 * Get SYNCHRONELY the template definition from API URL
 * @param {string} templateId
 * @returns {Array|Object}
 */
PrintTemplate.prototype.getTemplateDefinition = function (templateId) {

    var apiUrl = this.apiUrl;

    var token = this.token;

    if (typeof apiUrl != "string" || apiUrl == null) {
        callError("getMapDefinition: Can't get the apiUrl");
    }
    if (typeof token != "string" || token == null) {
        callError("getMapDefinition: Can't get the token");
    }
    if (typeof templateId == "undefined" || templateId == null) {
        callError("getMapDefinition: Can't get the templateId");
    }

    var http = new nsUtils.Http();
    var templateDefinition;

    http.get({
        url: apiUrl + '/vmap/userprinttemplates/' + templateId + '?token=' + token,
        async: false,
        successCallback: function (response) {
            if (!isDef(response)) {
                callError("getTemplateDefinition: Can't get the response");
            }
            if (!isDef(response['userprinttemplates'])) {
                callError("getTemplateDefinition: Can't get the response.userprinttemplates");
            }
            if (!isDef(response['userprinttemplates'][0])) {
                callError("getTemplateDefinition: Can't get the response.userprinttemplates[0]");
            }
            if (!isDef(response['userprinttemplates'][0]['definition'])) {
                callError("getTemplateDefinition: Can't get the response.userprinttemplates[0].definition");
            }
            templateDefinition = response['userprinttemplates'][0]['definition'];
        }
    });

    return templateDefinition;
};

/**
 * Add the template includes from their definition
 * @param {array<object>} aIncludes
 */
PrintTemplate.prototype.addTemplateIncludes = function (aIncludes) {

    if (typeof aIncludes !== 'object')
        return 0;

    for (var i = 0; i < aIncludes.length; i++) {

        var oIncludeDef = aIncludes[i];

        // Si target est défini
        if (typeof oIncludeDef['target'] !== 'undefined') {
            if (typeof oIncludeDef['imageUrl'] !== 'undefined') {
                $(oIncludeDef['target']).attr('src', oIncludeDef['imageUrl']);
            }
            if (typeof oIncludeDef['base64Image'] !== 'undefined') {
                $(oIncludeDef['target']).attr('src', oIncludeDef['base64Image']);
            }
            if (typeof oIncludeDef['html'] !== 'undefined') {

                oIncludeDef['html'] = decodeURIComponent(oIncludeDef['html']);
                oIncludeDef['html'] = oIncludeDef['html'].replace(/\n/g, '');
                oIncludeDef['html'] = oIncludeDef['html'].replace(/\\"/g, '"');

                $(oIncludeDef['target']).append(oIncludeDef['html']);
            }
        }

        delete oIncludeDef;
    }
};

/**
 * Print template App
 */
ngPrintTemplate = angular.module("ngPrintTemplate", []);

/**
 * Print template controller
 * @param {object} $scope
 * @param {object} $compile
 */
ngPrintTemplate.controller("printCtrl", function ($scope, $compile) {

    $scope.ctrl = this;

    $scope.$compile = $compile;
});