echo %DATE% > Output/users.txt
echo %TIME% >> Output/users.txt
protractor protractor.conf.users.js --params.login=margot --params.password=margot --specs scenario/sc_vitis_users.js > Output/users.txt

