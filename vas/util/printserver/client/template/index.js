/* global ol, nsUtils */

/**
 * Initialize the template
 * @param {object} opt_options
 * @param {string} opt_options.token
 * @param {string} opt_options.apiUrl
 * @param {string} opt_options.templateId
 * @param {array<object>} opt_options.includes
 * @param {object} opt_options.scope
 */
var initTemplate = function (opt_options) {

    if (!isDef(opt_options.token)) {
        callError('opt_options.token not defined');
    }
    if (!isDef(opt_options.apiUrl)) {
        callError('opt_options.apiUrl not defined');
    }
    if (!isDef(opt_options.templateId)) {
        callError('opt_options.templateId not defined');
    }

    window.oProperties = new nsUtils.Properties(opt_options.apiUrl, opt_options.token);

    window.oPrintTemplate = new PrintTemplate({
        token: opt_options.token,
        apiUrl: opt_options.apiUrl,
        templateId: opt_options.templateId,
        styleId: opt_options.styleId,
        includes: opt_options.includes,
        scope: opt_options.scope
    });

};