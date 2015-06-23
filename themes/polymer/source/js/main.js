/* 
 * @Author: wayou
 * @Date:   2015-06-19 16:40:51
 * @Last Modified by:   wayou
 * @Last Modified time: 2015-06-21 15:16:51
 */

(function(document) {
    'use strict';

    // Grab a reference to our auto-binding template
    // and give it some initial binding values
    // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
    var app = document.querySelector('#app');

    app.displayInstalledToast = function() {
        document.querySelector('#caching-complete').show();
    };

    // Listen for template bound event to know when bindings
    // have resolved and content has been stamped to the page
    app.addEventListener('dom-change', function() {
        console.log('Our app is ready to rock!');
    });

    // See https://github.com/Polymer/polymer/issues/1381
    window.addEventListener('WebComponentsReady', function() {
        // imports are loaded and elements have been registered
    });

    // Close drawer after menu item is selected if drawerPanel is narrow
    app.onMenuSelect = function() {
        var drawerPanel = document.querySelector('#paperDrawerPanel');
        if (drawerPanel.narrow) {
            drawerPanel.closeDrawer();
        }
    };

})(document);

// back to home page
function back(e) {
    window.history.length > 2 ? window.history.back() : window.location.href = '/';
}