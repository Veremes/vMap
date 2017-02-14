echo %DATE% > Output/user_existant.txt
echo %TIME% >> Output/user_existant.txt
protractor protractor.conf.user_existant.js --params.login=margot --params.password=margot --specs scenario/sc_vitis_user_existant.js > Output/user_existant.txt

