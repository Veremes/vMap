echo %DATE% > Output/users_speciaux.txt
echo %TIME% >> Output/users_speciaux.txt
protractor protractor.conf.users_speciaux.js --params.login=margot --params.password=margot --specs scenario/sc_vitis_users_speciaux.js > Output/users_speciaux.txt

