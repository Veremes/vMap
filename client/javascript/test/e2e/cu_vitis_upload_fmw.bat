echo %DATE% > Output/upload_fmw.txt
echo %TIME% >> Output/upload_fmw.txt
protractor protractor.conf.upload_fmw.js --params.login=margot --params.password=margot --specs scenario/sc_vitis_upload_fmw.js >> Output/upload_fmw.txt

