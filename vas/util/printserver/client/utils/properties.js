/* global ol */

if (typeof nsUtils == 'undefined') {
    nsUtils = {};
}

/**
 * Class properties (requires nsUtils.Http)
 * Get the properties from API
 * @param {apiUrl} Url to the API
 * @param {token} Api token to conet with
 * @returns {nsUtils.Properties}
 */
nsUtils.Properties = function (apiUrl, token) {

    var this_ = this;

    var http = new nsUtils.Http();

    http.get({
        url: apiUrl + '/vitis/properties?token=' + token,
        async: false,
        successCallback: function(response){
            for (var key in response) {
                this_[key] = response[key];
            }
        }
    });
};