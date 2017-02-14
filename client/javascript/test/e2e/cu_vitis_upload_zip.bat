echo %DATE% > Output/upload_zip.txt
echo %TIME% >> Output/upload_zip.txt
protractor protractor.conf.upload_zip.js --params.login=margot --params.password=margot --specs scenario/sc_vitis_upload_zip.js >> Output/upload_zip.txt

