echo %DATE% > Output/verrouillage_projet.txt
echo %TIME% >> Output/verrouillage_projet.txt
protractor protractor.conf.verrouillage_projet.js --params.login=margot --params.password=margot --specs scenario/sc_vitis_verrouillage_projet.js > Output/verrouillage_projet.txt


