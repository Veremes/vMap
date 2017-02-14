<?php
$aSql['pgsql']['proprietaire']= 'SELECT *, id_dnupro, id_pro, l_ccodro, l_ccodem, dnuper, dqualp, ddenom, dnomlp, dprnlp, epxnee, dnomcp, dprncp, jdatnss, dldnss, dlign3, dlign4, dlign5, dlign6 FROM s_majic.proprietaire LEFT JOIN s_majic.tc_ccodro_code_droit ON proprietaire.ccodro = c_ccodro_code_droit.ccodro LEFT JOIN s_majic.tc_ccodem_nature_demembrement ON proprietaire.ccodem= tc_ccodem_nature_demembrement.ccodem WHERE id_dnupro=\'$sIdDnupro\' AND id_pro=\'$sIdPro\'';
$aSql['pgsql']['bati'] = 'SELECT *, bati_0010_local.id_local , jdatat, ccosec, dnupla, ccoplc, dnvoiri,  dindic, dvoilib, ccoriv, dnubat, nesc, dniv, dpor, bati_0010_local.invar, ccoeva, cconlc, gtauom, cconad FROM s_majic.bati_0010_local LEFT JOIN majic.bati_60_descr_dep ON bati_0010_local.id_local=bati_60_descr_dep.id_local WHERE bati_0010_local.id_local=\'$sIdBat\'';
$aSql['pgsql']['pev'] = 'SELECT  *, bati_21_pev_descr.id_pev, ccostb, ccoaff, dcapec, dcsglc, bipevla1, gnexpl, dvlpera, bati_21_pev_descr.dnupev FROM s_majic.bati_21_pev_descr LEFT JOIN s_majic.bati_36_pev_tax ON bati_21_pev_descr.id_pev=bati_36_pev_tax.id_pev WHERE bati_21_pev_descr.id_pev=\'$sIdPev\'';
$aSql['pgsql']['parcelle']='SELECT *, id_par, jdatat, ccosec, dnupla, dnvoiri, dindic, cconvo, dvoilib, ccoriv, dparpi, gparnf FROM s_majic.nb_10_parcelle WHERE id_par=\'$sIdPar\''; 
$aSql['pgsql']['suf']='SELECT *, id_suf, ccostn, ccosub, dsgrpf, dclssf, cnatsp, dcntsf, drcsuba FROM s_majic.nb_21_suf_descr WHERE id_suf=\'$sIdSuf\'';
$aSql['pgsql']['compte_communal']='SELECT *, proprietaire.ccodep, proprietaire.ccodir, fantoir_commune.ccocom, libcom, dnupro, id_dnupro FROM s_majic.proprietaire LEFT JOIN s_majic.fantoir_commune ON proprietaire.id_com=fantoir_commune.id_com WHERE id_dnupro=\'$sIdDnupro\'';
$aSql['pgsql']['exone_pev']='SELECT *, id_ex, ccolloc, gnextl, janimp, jandeb, rcexba2 FROM s_majic.bati_30_pev_exo WHERE id_ex=\'$sIdEx\'';
$aSql['pgsql']['exon_suf']='SELECT *, id_suf, rnuexn, ccolloc, gnexts, jfinex, pexn FROM s_majic.nb_30_suf_exo WHERE id_suf=\'$sIdSuf\' and rnuexn=\'$sRnuexn\'';
$aSql['pgsql']['lot_local']='SELECT *, id_local, klot, dnupdl, dnulot, dnumql, ddenql FROM s_majic.lot_local WHERE id_local=\'$sIdBat\' and klot=\'$sKlot\'';
$aSql['pgsql']['get_id_pev']='SELECT  id_pev FROM s_majic.bati_21_pev_descr WHERE id_local=\'$sIdBat\'';
$aSql['pgsql']['get_id_ex_pev']='SELECT id_ex FROM s_majic.bati_30_pev_exo WHERE id_pev=\'$sIdPev\'';
$aSql['pgsql']['get_klot']='SELECT klot FROM s_majic.lot_local WHERE id_local=\'$sIdBat\'';
$aSql['pgsql']['get_id_suf']='SELECT id_suf FROM s_majic.nb_21_suf_descr WHERE id_par=\'$sIdPar\'';
$aSql['pgsql']['get_rnuexn']='SELECT rnuexn FROM s_majic.nb_30_suf_exo WHERE id_suf=\'$sIdSuf\'';
$aSql['pgsql']['get_id_pro']='SELECT id_pro FROM s_majic.proprietaire WHERE id_dnupro=\'$sIdDnupro\'';
$aSql['pgsql']['get_id_bat']='SELECT id_local FROM s_majic.bati_0010_local WHERE id_dnupro=\'$sIdDnupro\'';
$aSql['pgsql']['get_id_par']='SELECT id_par FROM s_majic.nb_10_parcelle WHERE id_dnupro=\'$sIdDnupro\'';

$aSql['sqlite']['proprietaire']= 'SELECT *, id_dnupro, id_pro, l_ccodro, l_ccodem, dnuper, dqualp, ddenom, dnomlp, dprnlp, epxnee, dnomcp, dprncp, jdatnss, dldnss, dlign3, dlign4, dlign5, dlign6 FROM s_majic.proprietaire LEFT JOIN s_majic.tc_ccodro_code_droit ON proprietaire.ccodro=tc_ccodro_code_droit.ccodro LEFT JOIN s_majic.tc_ccodem_nature_demembrement ON proprietaire.ccodem=tc_ccodem_nature_demembrement.ccodem WHERE id_dnupro=\'$sIdDnupro\' AND id_pro=\'$sIdPro\'';
$aSql['sqlite']['bati'] = 'SELECT *, bati_0010_local.id_local, jdatat, ccosec, dnupla, ccoplc, dnvoiri, dindic, dvoilib, ccoriv, dnubat, nesc, dniv, dpor, bati_0010_local.invar, ccoeva, cconlc, gtauom, cconad FROM s_majic.bati_0010_local LEFT JOIN s_majic.bati_60_descr_dep ON bati_0010_local.id_local=bati_60_descr_dep.id_local WHERE bati_0010_local.id_local=\'$sIdBat\'';
$aSql['sqlite']['pev'] = 'SELECT  *, bati_21_pev_descr. id_pev, ccostb, ccoaff, dcapec, dcsglc, bipevla1, gnexpl, dvlpera, bati_21_pev_descr.dnupev FROM s_majic.bati_21_pev_descr LEFT JOIN s_majic.bati_36_pev_tax ON bati_21_pev_descr.id_pev=bati_36_pev_tax.id_pev WHERE bati_21_pev_descr.id_pev=\'$sIdPev\'';
$aSql['sqlite']['parcelle']='SELECT *, id_par, jdatat, ccosec, dnupla, dnvoiri, dindic, codevoie, libvoie, ccoriv, dparpi, gparnf FROM s_majic.nb_10_parcelle LEFT JOIN s_majic.fantoir_voie ON nb_10_parcelle.id_voie=fantoir_voie.id_voie WHERE id_par=\'$sIdPar\'';
$aSql['sqlite']['suf']='SELECT *, id_suf, ccostn, ccosub, dsgrpf, dclssf, cnatsp, dcntsf, drcsuba FROM s_majic.nb_21_suf_descr WHERE id_suf=\'$sIdSuf\'';
$aSql['sqlite']['compte_communal']='SELECT *, proprietaire. ccodep, proprietaire.ccodir,fantoir_commune.ccocom, libcom, dnupro, id_dnupro FROM s_majic.proprietaire LEFT JOIN s_majic.fantoir_commune ON proprietaire.id_com=fantoir_commune.id_com WHERE id_dnupro=\'$sIdDnupro\'';
$aSql['sqlite']['exone_pev']='SELECT *, id_ex, ccolloc, gnextl, janimp, jandeb, rcexba2 FROM s_majic.bati_30_pev_exo WHERE id_ex=\'$sIdEx\'';
$aSql['sqlite']['exon_suf']='SELECT *, id_suf,  rnuexn, ccolloc, gnexts, jfinex, pexn FROM s_majic.nb_30_suf_exo WHERE id_suf=\'$sIdSuf\' and rnuexn=\'$sRnuexn\'';
$aSql['sqlite']['lot_local']='SELECT *, id_local, klot, dnupdl, dnulot, dnumql, ddenql FROM s_majic.lot_local WHERE id_local=\'$sIdBat\' and klot=\'$sKlot\''; 
$aSql['sqlite']['get_id_pev']='SELECT  id_pev FROM s_majic.bati_21_pev_descr WHERE id_local=\'$sIdBat\'';
$aSql['sqlite']['get_id_ex_pev']='SELECT id_ex FROM s_majic.bati_30_pev_exo WHERE id_pev=\'$sIdPev\'';
$aSql['sqlite']['get_klot']='SELECT klot FROM s_majic.lot_local WHERE id_local=\'$sIdBat\'';
$aSql['sqlite']['get_id_suf']='SELECT id_suf FROM s_majic.nb_21_suf_descr WHERE id_par=\'$sIdPar\'';
$aSql['sqlite']['get_rnuexn']='SELECT  rnuexn FROM s_majic.nb_30_suf_exo WHERE id_suf=\'$sIdSuf\'';
$aSql['sqlite']['get_id_pro']='SELECT id_pro FROM s_majic.proprietaire WHERE id_dnupro=\'$sIdDnupro\'';
$aSql['sqlite']['get_id_bat']='SELECT id_local FROM s_majic.bati_0010_local WHERE id_dnupro=\'$sIdDnupro\'';
$aSql['sqlite']['get_id_par']='SELECT id_par FROM s_majic.nb_10_parcelle WHERE id_dnupro=\'$sIdDnupro\'';
?>