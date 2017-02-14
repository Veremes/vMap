echo %DATE% > Output/AD.txt
echo %TIME% >> Output/AD.txt
protractor protractor.conf.ad.js --params.login=margot --params.password=margot --specs scenario/sc_vitis_ad.js >> Output/AD.txt

