/* global ol, nsUtils */

/**
 * Class Report
 * @param {object} opt_options
 */
PrintReport = function (opt_options) {

    var this_ = this;

    this.token = opt_options.token;

    this.apiUrl = opt_options.apiUrl;

    this.reportId = opt_options.reportId;

    this.includes = opt_options.includes;

    this.reportDefinition = this.getReportDefinition(this.reportId);

    var report = document.createElement("div");
    report.innerHTML = this.reportDefinition;

    var $scope = angular.element($('#print_report')).scope();

    // Ajoute les attributs de opt_options.scope dans $scope
    for (var option in opt_options.scope) {        
        $scope[option] = opt_options.scope[option];
    }

    var reportCompiled = $scope.$compile(report)($scope);

    $('#print_report').append(reportCompiled);

    $scope.$digest();

    this.addReportIncludes(opt_options.includes);
};

/**
 * Get SYNCHRONELY the report definition from API URL
 * @param {string} reportId
 * @returns {Array|Object}
 */
PrintReport.prototype.getReportDefinition = function (reportId) {

    var apiUrl = this.apiUrl;

    var token = this.token;

    if (typeof apiUrl != "string" || apiUrl == null) {
        callError("getMapDefinition: Can't get the apiUrl");
    }
    if (typeof token != "string" || token == null) {
        callError("getMapDefinition: Can't get the token");
    }
    if (typeof reportId == "undefined" || reportId == null) {
        callError("getMapDefinition: Can't get the reportId");
    }

    var http = new nsUtils.Http();
    var reportDefinition;

    http.get({
        url: apiUrl + '/vmap/printreports/' + reportId + '?token=' + token,
        async: false,
        successCallback: function (response) {
            if (!isDef(response)) {
                callError("getReportDefinition: Can't get the response");
            }
            if (!isDef(response['printreports'])) {
                callError("getReportDefinition: Can't get the response.printreports");
            }
            if (!isDef(response['printreports'][0])) {
                callError("getReportDefinition: Can't get the response.printreports[0]");
            }
            if (!isDef(response['printreports'][0]['htmldefinition'])) {
                callError("getReportDefinition: Can't get the response.printreports[0].htmldefinition");
            }
            reportDefinition = response['printreports'][0]['htmldefinition'];
        }
    });

    return reportDefinition;
};

/**
 * Add the report includes from their definition
 * @param {array<object>} aIncludes
 */
PrintReport.prototype.addReportIncludes = function (aIncludes) {

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
 * Print report App
 */
ngPrintReport = angular.module("ngPrintReport", []);

/**
 * Print report controller
 * @param {object} $scope
 * @param {object} $compile
 */
ngPrintReport.controller("printCtrl", function ($scope, $compile) {

    $scope.ctrl = this;

    $scope.$compile = $compile;
});