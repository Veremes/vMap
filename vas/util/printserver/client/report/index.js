/* global ol, nsUtils */

/**
 * Initialize the report
 * @param {object} opt_options
 * @param {string} opt_options.token
 * @param {string} opt_options.apiUrl
 * @param {string} opt_options.reportId
 * @param {array<object>} opt_options.includes
 * @param {object} opt_options.scope
 */
var initReport = function (opt_options) {
    
    if (!isDef(opt_options.token)) {
        callError('opt_options.token not defined');
    }
    if (!isDef(opt_options.apiUrl)) {
        callError('opt_options.apiUrl not defined');
    }
    if (!isDef(opt_options.reportId)) {
        callError('opt_options.reportId not defined');
    }

    window.oProperties = new nsUtils.Properties(opt_options.apiUrl, opt_options.token);
    
    window.oPrintReport = new PrintReport({
        token: opt_options.token,
        apiUrl: opt_options.apiUrl,
        reportId: opt_options.reportId,
        includes: opt_options.includes,
        scope: opt_options.scope
    });

};