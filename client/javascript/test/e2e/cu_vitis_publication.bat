echo %DATE% > Output/publication.txt
echo %TIME% >> Output/publication.txt
protractor protractor.conf.publication.js --params.login=margot --params.password=margot --specs scenario/sc_vitis_publication.js >> Output/publication.txt

