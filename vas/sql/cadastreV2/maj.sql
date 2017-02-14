-- Yoann le 27/07/2016 - 10:29
ALTER ROLE cadastre_user  RENAME TO vmap_cadastre_user;
INSERT INTO s_vitis.privileges(rolname, description) VALUES ('vmap_cadastre_user', 'rôle utilisateur du module cadastre de vMap');
ALTER TABLE s_cadastre.batiment ADD CONSTRAINT pk_batiment PRIMARY KEY (id);
ALTER TABLE s_cadastre.borne_de_limite_de_propriete ADD CONSTRAINT pk_borne_de_limite_de_propriete PRIMARY KEY (id);

ALTER TABLE s_cadastre.ensemble_immobilier ADD CONSTRAINT pk_ensemble_immobilier PRIMARY KEY (id);
ALTER TABLE s_cadastre.lieu_dit ADD CONSTRAINT pk_lieu_dit PRIMARY KEY (id);
ALTER TABLE s_cadastre.numero_de_voirie ADD CONSTRAINT pk_numero_de_voirie PRIMARY KEY (id);
ALTER TABLE s_cadastre.objet_du_reseau_routier ADD CONSTRAINT pk_objet_du_reseau_routier PRIMARY KEY (id);
ALTER TABLE s_cadastre.objet_lineaire_divers ADD CONSTRAINT pk_objet_lineaire_divers PRIMARY KEY (id);
ALTER TABLE s_cadastre.objet_ponctuel_divers ADD CONSTRAINT pk_objet_ponctuel_divers PRIMARY KEY (id);
ALTER TABLE s_cadastre.objet_surfacique_divers ADD CONSTRAINT pk_objet_surfacique_divers PRIMARY KEY (id);
ALTER TABLE s_cadastre.point_de_canevas ADD CONSTRAINT pk_point_de_canevas PRIMARY KEY (id);
ALTER TABLE s_cadastre.subdivision_de_section_cadastrale ADD CONSTRAINT pk_subdivision_de_section_cadastrale PRIMARY KEY (id);
ALTER TABLE s_cadastre.subdivision_fiscale ADD CONSTRAINT pk_subdivision_fiscale PRIMARY KEY (id);
ALTER TABLE s_cadastre.texte_ensemble_immobilier ADD CONSTRAINT pk_texte_ensemble_immobilier PRIMARY KEY (id);
ALTER TABLE s_cadastre.texte_lieu_dit ADD CONSTRAINT pk_texte_lieu_dit PRIMARY KEY (id);
ALTER TABLE s_cadastre.texte_numero_de_voirie ADD CONSTRAINT pk_texte_numero_de_voirie PRIMARY KEY (id);
ALTER TABLE s_cadastre.texte_objet_du_reseau_routier ADD CONSTRAINT pk_texte_objet_du_reseau_routier PRIMARY KEY (id);
ALTER TABLE s_cadastre.texte_objet_lineaire_divers ADD CONSTRAINT pk_texte_objet_lineaire_divers PRIMARY KEY (id);
ALTER TABLE s_cadastre.texte_objet_ponctuel_divers ADD CONSTRAINT pk_texte_objet_ponctuel_divers PRIMARY KEY (id);
ALTER TABLE s_cadastre.texte_parcelle ADD CONSTRAINT pk_texte_parcelle PRIMARY KEY (id);
ALTER TABLE s_cadastre.texte_section_cadastrale ADD CONSTRAINT pk_texte_section_cadastrale PRIMARY KEY (id);
ALTER TABLE s_cadastre.texte_troncon_de_cours_d_eau ADD CONSTRAINT pk_texte_troncon_de_cours_d_eau PRIMARY KEY (id);
ALTER TABLE s_cadastre.texte_zone_de_communication ADD CONSTRAINT pk_texte_zone_de_communication PRIMARY KEY (id);
ALTER TABLE s_cadastre.troncon_de_cours_d_eau ADD CONSTRAINT pk_troncon_de_cours_d_eau PRIMARY KEY (id);
ALTER TABLE s_cadastre.version ADD CONSTRAINT pk_version PRIMARY KEY (version);
ALTER TABLE s_cadastre.zone_de_communication ADD CONSTRAINT pk_zone_de_communication PRIMARY KEY (id);

ALTER TABLE s_majic.annee_reference ADD CONSTRAINT pk_annee_reference PRIMARY KEY (annee);
ALTER TABLE s_majic.fantoir_direction  ADD CONSTRAINT pk_fantoir_direction PRIMARY KEY (ccodep, ccodir);