echo %DATE% > Output/import_export.txt
echo %TIME% >> Output/import_export.txt
protractor protractor.conf.import.export.js --params.login=margot --params.password=margot --specs scenario/sc_vitis_import_export.js >> Output/import_export.txt

