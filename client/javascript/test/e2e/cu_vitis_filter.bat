echo %DATE% > Output/filter.txt
echo %TIME% >> Output/filter.txt
protractor protractor.conf.filter.js --params.login=margot --params.password=margot --specs scenario/sc_vitis_filter.js >> Output/filter.txt

