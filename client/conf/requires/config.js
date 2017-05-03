'use strict';

goog.provide('vitis.application.config');
goog.require('vmap');
goog.require('oVFB');

// Fichiers js et css à charger pour l'application Vmap.
var oApplicationFiles = {
    'css': [
        // Vitis
        'css/lib/bootstrap/css/bootstrap.min.css',
        'css/lib/jquery/plugins/bootstrap-datepicker/bootstrap-datepicker3.min.css',
        'css/lib/jquery/plugins/bootstrap-fileinput/css/fileinput.min.css',
        'css/lib/ui-grid/ui-grid.min.css',
        'css/lib/jquery/plugins/bootstrap-colorpicker/css/bootstrap-colorpicker.min.css',
        'css/lib/bootstrap-checkbox/build.css',
        'css/lib/bootstrap-checkbox/font-awesome.css',
        'css/lib/jquery/plugins/bootstrap-slider/bootstrap-slider.min.css',
        'css/lib/jquery/plugins/malihu-custom-scrollbar/jquery.mCustomScrollbar.min.css',
        'css/lib/ui-grid/plugins/draggable-rows.less',
        'less/main.less',
        // App
        'modules/vitis/less/main.less',
        'javascript/externs/studio/less/studio.less',
        'modules/vmap/css/lib/bootstrap-toggle/bootstrap-toggle.css',
        'modules/vmap/css/lib/colorpicker/css/bootstrap-colorpicker.css',
        'modules/vmap/css/lib/bootstrap-table/bootstrap-table.min.css',
        'modules/vmap/css/lib/jquery-sortable/jquery-sortable.css',
        'modules/vmap/css/ol.css',
        'modules/vmap/css/vmap.less',
        'modules/vm4ms/less/main.less',
        'css/lib/codemirror/codemirror.css',
        'css/lib/codemirror/codemirror_foldgutter.css',
        'css/lib/codemirror/map.css',
        'css/lib/codemirror/show-hint.css',
        'javascript/externs/studio/less/CodeMirror.less',
        'css/lib/jquery/plugins/bootstrap-treeview/bootstrap-treeview.min.css',
        'css/lib/jquery/plugins/bootstrap-tagsinput/bootstrap-tagsinput.css',
        'css/lib/jquery/plugins/bootstrap-colorpicker/css/bootstrap-colorpicker.min.css',
        'css/lib/viewer/viewer.min.css'
    ],
    'js': {
        'externs': [
            // vMap
//            'modules/vmap/javascript/externs/angular/angular-animate.min.js',
            'modules/vmap/javascript/externs/bootstrap-toggle/bootstrap-toggle.min.js',
            'modules/vmap/javascript/externs/bootstrap-table/bootstrap-table.js',
            'modules/vmap/javascript/externs/bootstrap-table/bootstrap-table-export.js',
            'modules/vmap/javascript/externs/bootstrap-table/tableExport.js',
            'modules/vmap/javascript/externs/jquery-sortable/jquery-sortable.js',
            'modules/vmap/javascript/externs/html2canvas/html2canvas.js',
            'modules/vmap/javascript/externs/jspdf/jspdf.debug.js',
            // Studio
            'javascript/externs/bootbox/bootbox.min.js',
            'javascript/externs/codemirror/codemirror.min.js',
            'javascript/externs/codemirror/htmlmixed.js',
            'javascript/externs/codemirror/css.js',
            'javascript/externs/codemirror/javascript.js',
            'javascript/externs/codemirror/clike.js',
            'javascript/externs/codemirror/php.js',
            'javascript/externs/codemirror/xml.js',
            'javascript/externs/codemirror/sql.js',
            'javascript/externs/codemirror/map.js',
            'javascript/externs/codemirror/show-hint.js',
            'javascript/externs/codemirror/addon/fold/foldcode.js',
            'javascript/externs/codemirror/addon/fold/foldgutter.js',
            'javascript/externs/codemirror/addon/fold/brace-fold.js',
            'javascript/externs/codemirror/addon/fold/xml-fold.js',
            'javascript/externs/angular/modules/ui-codemirror/ui-codemirror.min.js',
            'javascript/externs/tinymce/tinymce.min.js',
            'javascript/externs/angular/modules/ui-tinymce/tinymce.js',
            'javascript/externs/jquery/plugins/bootstrap-treeview/bootstrap-treeview.js',
            'javascript/externs/jquery/plugins/bootstrap-tagsinput/bootstrap-tagsinput.min.js',
            'javascript/externs/scripts_cryptage.js',
            'javascript/externs/moment/moment.min.js',
            'javascript/externs/moment/min/moment-with-locales.min.js',
            'javascript/externs/jquery/plugins/notify/notify.js',
            'javascript/externs/jquery/plugins/bootstrap-colorpicker/bootstrap-colorpicker.min.js',
            'javascript/externs/jquery/plugins/bootstrap-confirmation/bootstrap-confirmation.min.js',
            'javascript/externs/jquery/plugins/bootstrap-datetimepicker/bootstrap-datetimepicker.min.js',
            'javascript/externs/viewer/viewer.min.js'
        ]
    },
    'vitisModuleDependencies': ['vmap', 'ui.codemirror', 'ui.tinymce', 'vfb', 'ui.grid.draggable-rows']
};