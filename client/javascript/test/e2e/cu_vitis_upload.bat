echo %DATE% > Output/upload.txt
echo %TIME% >> Output/upload.txt
protractor protractor.conf.upload.js --params.login=margot --params.password=margot --specs scenario/sc_vitis_upload.js >> Output/upload.txt

