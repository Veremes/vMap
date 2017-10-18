<?php

$properties["cadastre"]["selection_limit"] = 100;

$properties["cadastre"]["rp"]["rp_dir"] = $properties['vas_home'] . '/public/cadastreV2';
$properties["cadastre"]["rp"]["rp_url"] = $properties['public_alias'] . '/cadastreV2';

// Login Mp qui a le droit de lecture sur le schéma Majic
$properties["cadastre"]["rp"]["login"] = "u_vitis";
$properties["cadastre"]["rp"]["pass"] = "";

$properties["cadastre"]["selection_buffer"] = 5;
$properties["cadastre"]["database_projection"] = "EPSG:2154";

$properties['schema_cadastre'] = 's_cadastre';
$properties['schema_majic'] = 's_majic';

// Vues à utiliser dans les ressources (CadastreV2)
$properties["cadastre"]["views"]["adresse"] = "v_vmap_nb_10_parcelle_light";
$properties["cadastre"]["views"]["commune"] = "v_vmap_commune";
$properties["cadastre"]["views"]["description_parcelle"] = "v_vmap_nb_10_parcelle";
$properties["cadastre"]["views"]["invariant"] = "v_vmap_bati_0010_local";
$properties["cadastre"]["views"]["lieu_dit"] = "v_vmap_lieu_dit";
$properties["cadastre"]["views"]["parcelle"] = "v_vmap_parcelle_all_geom";
$properties["cadastre"]["views"]["proprietaire"] = "v_vmap_maj_pc";
$properties["cadastre"]["views"]["section"] = "v_vmap_section_cadastrale";
$properties["cadastre"]["views"]["voie"] = "v_vmap_maj_fv";

// Vues à utiliser dans les ressources (CadastreV1)
//$properties["cadastre"]["views"]["adresse"] = "v_non_bati_a10_descr_parcelle";
//$properties["cadastre"]["views"]["commune"] = "v_commune";
//$properties["cadastre"]["views"]["description_parcelle"] = "v_non_bati_a10_descr_parcelle";
//$properties["cadastre"]["views"]["invariant"] = "v_bati_a00_ident_local";
//$properties["cadastre"]["views"]["lieu_dit"] = "v_lieu_dit";
//$properties["cadastre"]["views"]["parcelle"] = "v_parcelle";
//$properties["cadastre"]["views"]["proprietaire"] = "v_maj_pc";
//$properties["cadastre"]["views"]["section"] = "v_section";
//$properties["cadastre"]["views"]["voie"] = "v_maj_fv";

//// Paramètres pour l'affichage de données supplémentaires sur la fiche descriptive d'une parcelle
//$properties["cadastre"]["descr_parcel"]["intersect"]["views"]["public.v_pos"]["title"] = "POS";
//$properties["cadastre"]["descr_parcel"]["intersect"]["views"]["public.v_pos"]["type"] = "POLYGON";
//$properties["cadastre"]["descr_parcel"]["intersect"]["views"]["public.v_pos"]["intersect"] = "Surface intersecté";
//$properties["cadastre"]["descr_parcel"]["intersect"]["views"]["public.v_pos"]["type_pos"] = "Type";
//$properties["cadastre"]["descr_parcel"]["intersect"]["views"]["public.v_pos"]["id_com"] = "Code commune";
//$properties["cadastre"]["descr_parcel"]["intersect"]["views"]["public.v_pos"]["surface"] = "Surface du POS";
//$properties["cadastre"]["descr_parcel"]["intersect"]["views"]["public.v_pos"]["reglement"] = "Lien vers réglement";
//
//$properties["cadastre"]["descr_parcel"]["intersect"]["views"]["s_cadastre.v_vmap_commune"]["title"] = "Commune";
//$properties["cadastre"]["descr_parcel"]["intersect"]["views"]["s_cadastre.v_vmap_commune"]["type"] = "POLYGON";
//$properties["cadastre"]["descr_parcel"]["intersect"]["views"]["s_cadastre.v_vmap_commune"]["intersect"] = "Surface intersecté";
//$properties["cadastre"]["descr_parcel"]["intersect"]["views"]["s_cadastre.v_vmap_commune"]["id_com"] = "Id de la commune";
//$properties["cadastre"]["descr_parcel"]["intersect"]["views"]["s_cadastre.v_vmap_commune"]["code_com"] = "Code commune";
//$properties["cadastre"]["descr_parcel"]["intersect"]["views"]["s_cadastre.v_vmap_commune"]["nom"] = "Nom de la commune";

// Tolérence d'intersection (en %)
$properties["cadastre"]["descr_parcel"]["intersect"]["tolerance"] = 1;


// On peut donner soit un logo soit un nom de company
$properties["cadastre"]["fiche_urb"]["logo"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAM8AAAA+CAIAAAADLdi0AAAAFXRFWHRDcmVhdGlvbiBUaW1lAAfgARUXDAt3OP8+AAAAB3RJTUUH4AUGCDYTNKrgnQAAAAlwSFlzAAAK8AAACvABQqw0mAAAEXlJREFUeNrtXAdXFMkW3n/x3q6ugBkERQXJJsyYwZwWs+IqYFofAq6rYiAYwAwrAkqWDIqouwbAAAiSEURgFQTFCCrq+5iLtb09Mz0zCL53PHVPHc7QU9VVfe9XN9Xt+e4TJ05fi77jLODE0caJo40TJ442ThxtnDhxtHHiaOPE0caJE0cbJ442ITU1NRUXF6deSA09GxYbE3v71u2GhgbOcY62DqYHDx64u7qbGpv9+EO3H/7VhbV+ffVXr3QoLCzkfOdo6wB6+/bt3t17e2j3FIJM1HS0uvuf8G9paeHc52hrP71582bp4mUMVSOGjfTY6ZGclJx+I/3K5StH/I5MmjCpy7+74iv89fL0/vjxIxcAR1t7CLrK2XE94czQYGBUZFRzc7Ooz7t370LPhJLmg5FNiE/gAuBoaw/Fx8WT3rIwtawor5DQW+dTzmt11UbPAfqGtbW1XAYcbZoRlNYwq+EAUHetHnfv3pXuDCDu3bOPtOAvm7Zwe8rRphnBLSP0uGxxUaf/y5cvh1uNQH9Y1bKyMi4GjjYxPW14eu/ePdjBjPSMyPDIDx8+QC35+R5+8/qNs1Orx9b1+x9LS0qp8/v37wNPnc7KylZ2t5joGAKo21Z3rt442sTU+KyR/K1uXbQArC2bt5wJOYuA4OnTp0OMTHB97OhxiAwyMzILCwsXLfgJV7a6uAb4BwQHBadeSBVBCnC0NLNEH93ees+fP9do0biVy5atM21nLpy/UNOxnP6v0dZQ31BZWYmQs7ioWJStJazk5ubCXcPnnx3WOjs6A4jaP+rQt/hMH0aPHP3mzRvRnY8dPU7fhoWGa7ToBw8eUGA7b/Y8qFguxW8Hbfv2ekK0C+YuMDe16NZVSx5tyUnJ9HnWjNnKMroIV8eNHl9dXS288+NHjwmmdtNnaGRM/Xz96Lbnos5xEX47aIPmIJuorPXtpet/wp8+T5wwSaInoUqYhAPCli1pzQbrdOsO9anmit++fTtqxGiMMujXn5vRbwptoWfDSP0oazCarlvdPpvLMdJoQ9uxfYfwzIrpxUMHfdVccdadLErsbVy/kcvv20FbfX2DXt9+KgEEb12Waes+sP8glZ0BFB/v/cJUiNFA41akWo959+6dOitGfEC3upl5k8vv20Hb+ZTzKtGD1qdnX8rr9tTppbLz4p8WIxoVzuLutq0Vhd93vX37tsrlwhDr6xmgv5X5UIXxAWKR/Pz8yIhI34O+3p7eRw4fTYhPqHxQKVEEAIMO64w7M7jjQ42MFPZved9S9bAqOSnl+LHjmOLg/oPhoeF5uXlNb5okVo6nbpYR81Ax6f2y+xdT02LOxaQkp+TnF7x8+UqZ//rixYu8vLykxCR0vph6sbSktKmpSX0xY66y0jKM9fM9jDX7HfI7F32upKQE19UZDqVw7dr104FBgadOX7l8paGhoX1JKym07fbYow7aNGrWw0e5u7ojjGWz3L2bS6GryxYXlc+QmJDYZnkPHBKnA58+9drnZWFqSXZW2LS6ak+fapuYmKQQc0CA7TQ7MxNzx3VOWEBiQtLY0eMw5JdNv8gjBgKbOnkaC7qFzcLMEqsCLBSu3MvTG1OgPfrr0atXr04cPzli2EgWs1MbZDjYzdX94cOHwoEV5RWbNmwy7D9QZCIQtAHouJU0x16/fh3g/7v1iFGiueioeuyocWdCzsifaP+9tVpazoScNR5kLKoc8/HykRjVHrQtW7K8w9FGbYbtzIqKtrNUqCiYUTo2ld6v6L/EfglFFRguvH7p0mWjf3JEvoHdSxcvkw8sMKmJsSk6zJk197Dv4W5dtD6fqv0DbTXVNTPtZomgLI/soZbDcrJz5LcNcwAy0jPGjRkvsc5+fftFRkR9lFFYaDiZDmVt4viJ9U/qlXEMGtd6uLV41L/FN5k+dboI4ixG9NjpIQ9TauudNmhaNvadhGjtFy3uJLSR5fU91BYZnDh+gi4iaJBYK0xbr+69Kc0mFCdEQmnn1vKT/gOhO1MvpBbkFxQVFv1x5Q/oG0iXwWLMqLF1dXUK0abbW48lFPv21t3jsYf1wd2MBw9hK8c+jAiPyM7KLiu7n5l5MyQ4BLzCHmCuxdU/r4oAx9Cmr2tAH4YYmfzqvh33gWUMDgoBuLHfGIjDwyIC/ANI0vg7YZyNt5dPfFxCUmLyyeMn7RfZs+lmz5yj0KlIu5jWu2cfljpY77Q+Pi4e+IMVvnH9xskTJ+2m2bGtZTxoSHl5hegOMNzMOKz7eV1sTFxYaNiCeQtZ2Rim6DDdBjWAndpJaJsw1oYZHRgXytYusV8qsZ6AkwE0NioyWshTBjUITGExOixgVGQUOXxo8+fMF/orDG3URg6zhqsndE3qaussTC3alj3OBm6AvOrCFfhVNuMnUjcDvf7l5eUK0UaHMYCyvBGsr6//aaE99QFDKBuAPYDFw1kUdYabC8srk3qXS2mX5LUai/CwEx5WKlZd2BWmxmZtDz7curGxUdiBPc5hvyPskcFMZ0dnur5i2QqNHDgp3Qb4M0F2eEu/kS6ci7gM1VX7uFaZlz3JZnKrodHVZ0x58uTJ4IFGdEPPfV7S5wpwEPX6tAngVMAphWjD7oLIRQNXrVhN306ZNFUkD7Ev//wF+lBn2OWPHz4qRJvnXk9lQoI/Du0rtNTQfMqmg+YmZWy/0F54HVEOu8nPDmubm5qlD2ZMPz++21Z3dh1PSuoTqBWdAxUXF5PSNTex0MiYKkUbNjf2cedZ0tEjx4Cz8ok3mA+F68m/l9+WZtuwiV302LWbRkEpikJdhQQlwXQP3Gd5tKGDaMitm7dIogMMDB8/fqxyCrh3+rr6ZP4uX74ijzYri6HSuZ74+ATGpdUrHSR6QtJTZeCGdX7e+Lc/Cr++zW2wHiMNNaKbmTcJWD11epXfb1PJCOTJzkLniSCFf48dPY54H/GHRieHStEWHXWu86BGaeEjfkfkE29QYAq3y47tO2hg5uc0GywRmRJwSs03a3Dn8WMn0H0iIyJFaIPxqqqqEg1xWufUZk18D6vJ0wM+B2jI8qXL5dHmtc9bejiUK9ws6qzSMUJsSCrwXt49ZiiYBbx86bI6C8YQwJrpXRbjU+gNtsjr+w7Ot7H90UktLjZetC1cXVzJpyksKJQ3o4RFCzNLhsWMjEwW4arvPYQEn6FRK5evEqENTrrIl4IFoeAAJh5KS80pAFlKPRr069/4rFGEtgvnL6iU/fChI4gVKrUpswmIHugKoktSVDBz6icprl27TqYDu5FxeIRsGWiIil69fNVZaMMDO6xy6FS06Wh1F5V+wPsmb2DXjl0i9MALplH7fQ6wr1gJiY+3z7u379RslZWVJAyzIWZkfBnaDA0GMvPKcl1kRuFUILBQcwr0nDZ5Gq3tbs5dEdpysnNUSsV2mh2ltRobVRwE37mTRbcNPBVIVy6mptGVtWvWqc8W7CvsDQo/mYcTejaUxfImRiZgOKD8JS/LKdVtRw8fZfq8s8LScTbCsnLAaPTI1uN2yF7k2axeuZoAKgz06BCCsh7w7tVsluZWBCA8HYIMabRlpGfQFNBV6k+BxpJkcbFxIrTBAVUTbXguoWurkIqKisi7Orj/IF059fsploPVaM0spVJUVMyCVm8vH+1uOsI8+eSJU06e8JeOljSPEuobpJOQHdKwXf4B8SNH6fq1q9eEfgzFkqLEkvM65y9Srt26wxGWRhvTE+1u8KNFaKt6WNWBaCsuKia0Hdh/gK7Aef/CNV+7el2oArLuZC2cv0iU4zU3tbh+/UaHoQ0KU52aji9sUDAOq9awcPLRo0eUZFq7Zu3fnlZQiMKAcet/2uS3eNHiX923a9p2/rYTjrA02gD6tndjh45sxxRomRmZXxltLCtpO822fWu+X3Zf3rNCrLp3zz6W4iZf9s7tOx2DNmgRlmmUbyPlz0M0bxvXb8zOyhYKGJPayyaFMiMoAPS2U21bg3w9A+ZxE/keaqupDAkO+RLXVQJtpaVltKfnzZn/hQ7yV0MbwgWaaPuvv3V4EQeiKMTmdKLTmoCcOKVjMiCgmHMxymwQnWyq32AEMQpWn4RnaWYFKCsMuBI+Z5siwiLw7/375cRNZ8f1op5//nmVejqtc+oktEHYVEY12NBI5fn3/wna4NpS5mLq5GmdVEYfHxvPogeFB6ztQRs8UIXQmTVjVpfvu2qEtiFGJqcDT0dHncvOztm5Y5dEfhz8hWhby+bsZoFZnvu82g6zP5skYRFOf/0BlGh49uyZmoml04FBHrt2o7EElQTa0H/N6p9pAedTLqjJUyyVpogWFLJ/NbRhzXSQgOulpaVqrjkxIZHWfPXPq6TDtrlt27RhM/iv8JiOHWlKiFIztFVXV8vjBu4h8ULT1qdX3wq5c1+F5OriRhq0rLTMzMScdKHCo4Jft22nm+/x2KNOyu3WrdssIGUZSwm0geB40ZDxYydIV7CxPUCSwO6Pj4v/+mgDBQUG0VyrVqxShy0VFRUUh+l008nLzaM6JVLqgwwHK1TqzMsCTDsGbbB0un30hBU7RoOMD+w/2L7D0x7aPdU0RjnZOV1lupOVG3h7Ks6/I6qgugnEFpfSVOTNa2pqLM2t5MvjpNEmrIVR+epry/sWx7VO7C0NYR7na6INT0SONbgHXa7CFXv5arrMM0ZzXOfEjO9kmykkdIVVrqNkuSo0jSJTKbSBWeGh4YMGDJYdNGn7+fohWlmyeGn7YgI8uco0OhOw9YhRQjdRPkoS+nnkC/bU6RkRHqkw90gFGsMsh9MNJ0+cIiykk0YblaiQcccjbNq4WRkCENYgvmbxWkF+wf/Eb2NZ3949+lCGDApCYY0u2FJVVcWgBiZQArLt/G3/gc+xrZ2o7vBS2iXiOR7zxYuXHYM22dFNEyLHhfMXpV5IBeorKyvpyLl9yQ4bWbmOOss6euTY3+89yBw4ic6+B33J2AENc2fNTUpKfvTocXNzM5CHMBZR+i+bt+hotaUuh1kNFx2GqkSbTHh3WMESfIkTx0+W3y+HqobAXr96Dcf82JFjrJwTWjwhPvF/FSUwiouNY28wjR8zPjwsAg+Oh8WaAZGCggKPnbtZVZKBXv+cnH/8gEtdXR0rmZk7ex4sLJwEGJPgoGDd3nrt+50D1W/44XaYg26K+dR51UW+AQ3nU87To6qzrJrqGsYpaCyViww6HSx8KwJ7DrI3G2IOJgrLayeMs5EXtjpo+ySrGLMyHyrMqoMVQN6gAYOEheP6ugYpySkStbtfDW2y7PRFtkla/Q3tHkYDjcxNLAwNDIUvoluYWSo8T4uKjGZJXcwywMCwV4/eQmaKclJfijb50/Gj7UpVQwZpF9PUD8gp24dHlU+zKTO+4Pv8uQuU+ZSIW2FQFIIJaDM3Mcdcgw0HS6Dtk6y8dPu239jOlk8MrV7p8FAJmFxdXDEFmnyZiTzNtJ0pW4+RSrSVFJdgXnQ+KPeiBrGlurrGca0jU+2iBmvrttVNGYchheioaCFeme5wWOVACdFORBsImmbalOmjBH6VSq2GaA4KRlg+qQ7VPq6FOpHw2BQyF2HssaPH4D/BHZk4fhIMq8t/tsKuSYgNPAVSMVdhYaE6+wFcjoyI2rxx8+yZczCF3fQZa9es+z3gd+nM0181f2EKNHVec4JppvWoPALHVrmXdw+d62rrpCMkhAsIAmZMn4E1z7KbtcF5I2yr0FFTRk+e1AeeOg3IImhbsWyF1z6v3Ny8jn/nSlk+rKXlQ3JSMiualW5aP2r7n/SHSlfnNJrTt03t/P026IDtn3Nd0g32PvduLmc0p09f8muBlZUPWYwt/6IbqwWCCyL6sRlOHG3toaLCovT0DKgueHJwVOXftbwiKMznxKljfgk1Nib2xo10xFDAnF6fftB2K5evhAfKf1yNU8ejjTy5+Lj4kpLS9+/fv3jxgv/WFadORBsnThxtnDjaOHG0ceLE0caJo40TJ442ThxtnDh9+i8Ul9vHscwxiAAAAABJRU5ErkJggg==";
//$properties["cadastre"]["fiche_urb"]["company"] = "Veremes";
$properties["cadastre"]["fiche_urb"]["printtemplate_id"] = "-1";
$properties["cadastre"]["fiche_urb"]["map_id"] = "-1";
$properties["cadastre"]["fiche_urb"]["features_zoom"] = "800";

//*** Vue des batiments pour le rapport cadastre parcelle
$properties["cadastre"]["view"]["bati"] = "s_cadastre.v_vmap_batiment";

//$properties["cadastre"]["fiche_urb"]["intersect"]["views"]["public.v_pos"]["title"] = "";
//$properties["cadastre"]["fiche_urb"]["intersect"]["views"]["public.v_pos"]["type"] = "POLYGON";
//$properties["cadastre"]["fiche_urb"]["intersect"]["views"]["public.v_pos"]["intersect"] = "POS intersecté";
//$properties["cadastre"]["fiche_urb"]["intersect"]["views"]["public.v_pos"]["type_pos"] = "Type";
//$properties["cadastre"]["fiche_urb"]["intersect"]["views"]["public.v_pos"]["id_com"] = "Commune";
//$properties["cadastre"]["fiche_urb"]["intersect"]["views"]["public.v_pos"]["surface"] = "Suf.pos";
//
//$properties["cadastre"]["fiche_urb"]["intersect"]["views"]["s_cadastre.v_vmap_commune"]["title"] = "Commune";
//$properties["cadastre"]["fiche_urb"]["intersect"]["views"]["s_cadastre.v_vmap_commune"]["type"] = "POLYGON";
//$properties["cadastre"]["fiche_urb"]["intersect"]["views"]["s_cadastre.v_vmap_commune"]["intersect"] = "Surface intersecté";
//$properties["cadastre"]["fiche_urb"]["intersect"]["views"]["s_cadastre.v_vmap_commune"]["id_com"] = "Id de la commune";
//$properties["cadastre"]["fiche_urb"]["intersect"]["views"]["s_cadastre.v_vmap_commune"]["code_com"] = "Code commune";
//$properties["cadastre"]["fiche_urb"]["intersect"]["views"]["s_cadastre.v_vmap_commune"]["nom"] = "Nom de la commune";
//
//$properties["cadastre"]["fiche_urb"]["intersect"]["views"]["s_cadastre.v_vmap_section_cadastrale"]["title"] = "Section";
//$properties["cadastre"]["fiche_urb"]["intersect"]["views"]["s_cadastre.v_vmap_section_cadastrale"]["type"] = "POLYGON";
//$properties["cadastre"]["fiche_urb"]["intersect"]["views"]["s_cadastre.v_vmap_section_cadastrale"]["intersect"] = "Surface intersecté";
//$properties["cadastre"]["fiche_urb"]["intersect"]["views"]["s_cadastre.v_vmap_section_cadastrale"]["id_sec"] = "Id de la section";
//$properties["cadastre"]["fiche_urb"]["intersect"]["views"]["s_cadastre.v_vmap_section_cadastrale"]["id_com"] = "Id de la commune";
//$properties["cadastre"]["fiche_urb"]["intersect"]["views"]["s_cadastre.v_vmap_section_cadastrale"]["code_com"] = "Code commune";
//$properties["cadastre"]["fiche_urb"]["intersect"]["views"]["s_cadastre.v_vmap_section_cadastrale"]["section"] = "Code section";
//$properties["cadastre"]["fiche_urb"]["intersect"]["views"]["s_cadastre.v_vmap_section_cadastrale"]["pre"] = "pre";
//$properties["cadastre"]["fiche_urb"]["intersect"]["views"]["s_cadastre.v_vmap_section_cadastrale"]["idu"] = "idu";
//$properties["cadastre"]["fiche_urb"]["intersect"]["views"]["s_cadastre.v_vmap_section_cadastrale"]["texte"] = "texte";

// Tolérence d'intersection (en %)
$properties["cadastre"]["fiche_urb"]["intersect"]["tolerance"] = 1;
?>