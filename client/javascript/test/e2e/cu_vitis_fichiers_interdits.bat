echo %DATE% > Output/fichiers_interdits.txt
echo %TIME% >> Output/fichiers_interdits.txt
protractor protractor.conf.fichiers_interdits.js --params.login=margot --params.password=margot --specs scenario/sc_vitis_fichiers_interdits.js > Output/fichiers_interdits.txt


Afficvher tous les élments de formulaire de type fichier : 
$("input[type='file']")