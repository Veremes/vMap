echo %DATE% > Output/order.txt
echo %TIME% >> Output/order.txt
protractor protractor.conf.order.js --params.login=margot --params.password=margot --specs scenario/sc_vitis_order.js > Output/order.txt

