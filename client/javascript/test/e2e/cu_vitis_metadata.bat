echo %DATE% > Output/metadata.txt
echo %TIME% >> Output/metadata.txt
protractor protractor.conf.metadata.js --params.login=margot --params.password=margot --specs scenario/sc_vitis_metadata.js >> Output/metadata.txt

