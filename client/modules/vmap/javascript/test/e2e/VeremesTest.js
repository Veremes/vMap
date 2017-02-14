/* global browser, __dirname, module */

'use strict';

/**
 * @author: Anthony Borghi
 * @Description: The class VeremesTest define all function use by E2E test
 */

module.exports = { 
//**********************************************************************/ 
//                                                                      /
//          fonctions de Mise en forme fichier de sortie                /
//                                                                      / 
//**********************************************************************/    

    /**
     * Wrap console.log for output file
     * @param {string} text : for the output 
     */
    log: function (text) {
        console.log("\n");
        console.log(text);
    },
    
//**********************************************************************/ 
//                                                                      /
//                     fonctions de Temporisation                       /
//                                                                      /
//**********************************************************************/  

    /**
     * Wait between to test for function afterEach() (default 300ms)
     */
    waitBetweenTwoTests: function () {
        browser.sleep(300);
    },
    /**
     * Wait to load a page of app (default 2000ms)
     */
    waitToLoadPage: function () {
        browser.sleep(4000);
    },
    /**
     * Wait after a function click() (default 200ms)
     */
    waitAfterClick: function () {
        browser.sleep(200);
    },
    /**
     * Wait after a function sendKeys() (default 200ms)
     */
    waitAfterSendKeys: function () {
        browser.sleep(300);
    },
    /**
     * Wait after a suite of actions (default 200ms)
     */
    waitAfterActions: function () {
        browser.sleep(200);
    },
    /**
     * Wait to pop of alert's windows (default 1000ms)
     */
    waitBeforeAlert: function () {
        browser.sleep(1000);
    },
	/**
     * Wait to pop of modal's windows (default 1000ms)
     */
    waitForModal: function () {
        browser.sleep(1000);
    },
    /**
     * Wait to finish your test and see the last state of the app (default 10000ms)
     */
    waitToSeeTheEnd: function () {
        browser.sleep(10000);
    },
    
//**********************************************************************/ 
//                                                                      /
//    fonctions de Simplification pour l'utilisation de Protractor      /
//                                                                      /
//**********************************************************************/  

    /**
     * resolve the absolute path of a file with it relative path
     * @param {string} URL : path to resolve 
     */
    pathResolver: function (URL) {
        var path = require('path');
        return path.resolve(__dirname, URL);
    },
 
    /**
     * enable or disable synchronization with angular application
     * @param {boolean} flag : true : this app is Angular Application false : this app is not Angular Application
     */
    isAngularApp: function (flag) {
        return browser.ignoreSynchronization = !flag;
    }
};

