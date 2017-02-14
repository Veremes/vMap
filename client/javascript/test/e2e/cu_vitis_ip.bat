echo %DATE% > Output/IP.txt
echo %TIME% >> Output/IP.txt
protractor protractor.conf.ip.js --params.login=margot --params.password=margot --specs scenario/sc_vitis_ip.js >> Output/IP.txt

