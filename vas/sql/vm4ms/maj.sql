-- Frédéric le 14/02/2017 à 12:24
UPDATE s_vitis.vm_translation SET translation = 'Type' WHERE translation_id = 'vm4ms_26';
UPDATE s_vitis.vm_table_field SET template = '<div data-app-vm4ms-connection-type-column="{{row.entity[col.field]}}"></div>', index = 3 WHERE label_id = 'vm4ms_26';
-- Frédéric le 16/02/2017 à 14:19
UPDATE s_vitis.vm_string SET string = 'Onglet "Flux WMS privé" du mode "vm4ms"' WHERE string_id = 'vm4ms_50';
UPDATE s_vitis.vm_translation SET translation = 'Flux WMS privé' WHERE translation_id = 'vm4ms_50' AND lang = 'fr';
UPDATE s_vitis.vm_translation SET translation = 'Private WMS services' WHERE translation_id = 'vm4ms_50' AND lang = 'en';
-- Frédéric le 17/02/2017 à 10:22
UPDATE s_vitis.vm_table_field SET index = 3, width = 60, template='<div data-app-layer-title-column="{{row.entity[col.field]}}"></div>' WHERE label_id = 'vm4ms_44';
UPDATE s_vitis.vm_table_field SET index = 6 WHERE label_id = 'vm4ms_45';
-- Frédéric le 17/02/2017 à 16:22
ALTER TABLE s_vm4ms.layer DROP CONSTRAINT uk_layer_id_name;
ALTER TABLE s_vm4ms.layer ADD CONSTRAINT uk_name_version UNIQUE(name, version);
-- Frédéric le 23/02/2017 à 14:26
DROP VIEW IF EXISTS s_vm4ms.v_layer_version;
DROP VIEW IF EXISTS s_vm4ms.v_public_wms_service;
DROP VIEW IF EXISTS s_vm4ms.v_wms_service;
DROP VIEW IF EXISTS s_vm4ms.v_wms_service_layers;
DROP VIEW IF EXISTS s_vm4ms.v_private_wms_service;
DROP VIEW IF EXISTS s_vm4ms.v_public_layer;
DROP VIEW IF EXISTS s_vm4ms.v_private_layer;
DROP VIEW IF EXISTS s_vm4ms.v_public_wms_service_layers;
DROP VIEW IF EXISTS s_vm4ms.v_layer;

ALTER TABLE s_vm4ms.connection ALTER COLUMN name TYPE character varying(50);
ALTER TABLE s_vm4ms.connection ADD COLUMN server varchar(50);
ALTER TABLE s_vm4ms.connection ADD COLUMN port int4;
ALTER TABLE s_vm4ms.connection ADD COLUMN database varchar(50);

DELETE FROM s_vm4ms.layer WHERE version <> 'default';
ALTER TABLE s_vm4ms.layer ALTER COLUMN title TYPE text;
ALTER TABLE s_vm4ms.layer DROP COLUMN version;
ALTER TABLE s_vm4ms.layer ADD COLUMN definitiontmp text;
ALTER TABLE s_vm4ms.layer DROP CONSTRAINT IF EXISTS uk_name_version;
ALTER TABLE s_vm4ms.layer ADD CONSTRAINT uk_name UNIQUE(name);

ALTER TABLE s_vm4ms.wmsservice ADD COLUMN msdebuglevel_id int4;

CREATE OR REPLACE VIEW s_vm4ms.v_public_wms_service AS SELECT wmsservice.wmsservice_id, wmsservice.description, wmsservice.definition, wmsservice.alias, wmsservice.web_id, web.name AS web_name, wmsservice.msdebuglevel_id FROM s_vm4ms.wmsservice LEFT JOIN s_vm4ms.web ON web.web_id = wmsservice.web_id WHERE wmsservice_id <> 'private';
GRANT ALL ON TABLE s_vm4ms.v_public_wms_service TO vm4ms_admin;
CREATE OR REPLACE VIEW s_vm4ms.v_wms_service AS SELECT wmsservice.wmsservice_id, wmsservice.description, wmsservice.definition, wmsservice.alias, wmsservice.web_id, web.name AS web_name, wmsservice.msdebuglevel_id FROM s_vm4ms.wmsservice LEFT JOIN s_vm4ms.web ON web.web_id = wmsservice.web_id;
GRANT ALL ON TABLE s_vm4ms.v_wms_service TO vm4ms_admin;
CREATE OR REPLACE VIEW s_vm4ms.v_layer AS SELECT layer.layer_id, layer.name, layer.title, layer.coordsys_id, layer.source_id, layer.connection_id, layer.tableschema, layer.tablename, layer.tableidfield, layer.definition, layer.active, layer.opacity, layer.layertype_id, connection.private AS private_connection, connection.name AS connection_label, source.name AS source_label FROM s_vm4ms.layer LEFT JOIN s_vm4ms.connection ON connection.connection_id = layer.connection_id LEFT JOIN s_vm4ms.source ON source.source_id = layer.source_id;
GRANT ALL ON TABLE s_vm4ms.v_layer TO vm4ms_admin;
CREATE OR REPLACE VIEW s_vm4ms.v_wms_service_layers AS SELECT wmsservice_layer.wmsservice_id,wmsservice_layer.layer_id,layer.name,layer.title,layer.active,layer.opacity,connection.private FROM s_vm4ms.wmsservice_layer LEFT JOIN s_vm4ms.layer ON layer.layer_id = wmsservice_layer.layer_id LEFT JOIN s_vm4ms.connection ON connection.connection_id = layer.connection_id;
GRANT ALL ON TABLE s_vm4ms.v_wms_service_layers TO vm4ms_admin;
CREATE OR REPLACE VIEW s_vm4ms.v_private_wms_service AS SELECT wmsservice.wmsservice_id, wmsservice.description, wmsservice.definition, wmsservice.alias, wmsservice.web_id, web.name AS web_name, wmsservice.msdebuglevel_id FROM s_vm4ms.wmsservice LEFT JOIN s_vm4ms.web ON web.web_id = wmsservice.web_id WHERE wmsservice_id = 'private';
GRANT ALL ON TABLE s_vm4ms.v_private_wms_service TO vm4ms_admin;
CREATE OR REPLACE VIEW s_vm4ms.v_public_layer AS SELECT layer.layer_id, layer.name, layer.title, layer.coordsys_id, layer.source_id, layer.connection_id, layer.tableschema, layer.tablename, layer.tableidfield, layer.definition, layer.active, layer.opacity, layer.layertype_id, connection.private AS private_connection FROM s_vm4ms.layer LEFT JOIN s_vm4ms.connection ON connection.connection_id = layer.connection_id WHERE connection.private = false;
GRANT ALL ON TABLE s_vm4ms.v_public_layer TO vm4ms_admin;
CREATE OR REPLACE VIEW s_vm4ms.v_private_layer AS SELECT layer.layer_id, layer.name, layer.title, layer.coordsys_id, layer.source_id, layer.connection_id, layer.tableschema, layer.tablename, layer.tableidfield, layer.definition, layer.active, layer.opacity, layer.layertype_id, connection.private AS private_connection FROM s_vm4ms.layer LEFT JOIN s_vm4ms.connection ON connection.connection_id = layer.connection_id WHERE connection.private = true;
GRANT ALL ON TABLE s_vm4ms.v_private_layer TO vm4ms_admin;
CREATE OR REPLACE VIEW s_vm4ms.v_public_wms_service_layers AS SELECT wmsservice_layer.wmsservice_id,wmsservice_layer.layer_id,layer.name,layer.title,layer.active,layer.opacity,connection.private FROM s_vm4ms.wmsservice_layer LEFT JOIN s_vm4ms.layer ON layer.layer_id = wmsservice_layer.layer_id LEFT JOIN s_vm4ms.connection ON connection.connection_id = layer.connection_id WHERE connection.private = false;
GRANT ALL ON TABLE s_vm4ms.v_public_wms_service_layers TO vm4ms_admin;

DELETE FROM s_vitis.vm_section WHERE label_id IN('vm4ms_61', 'vm4ms_46');
DELETE FROM s_vitis.vm_table_button WHERE label_id = 'vm4ms_62';
DELETE FROM s_vitis.vm_table_field WHERE label_id IN ('vm4ms_63', 'vm4ms_64', 'vm4ms_65');
DELETE FROM s_vitis.vm_string WHERE string_id IN ('vm4ms_61', 'vm4ms_62', 'vm4ms_63', 'vm4ms_64', 'vm4ms_65', 'vm4ms_46');
DELETE FROM s_vitis.vm_translation WHERE translation_id IN ('vm4ms_61', 'vm4ms_62', 'vm4ms_63', 'vm4ms_64', 'vm4ms_65', 'vm4ms_46');

INSERT INTO s_vitis.vm_string (string, string_id) VALUES ('Titre de la section "wms_service" de l''onglet "vm4ms_layer"', 'vm4ms_61');
INSERT INTO s_vitis.vm_translation (translation_id, lang, translation) VALUES ('vm4ms_61', 'fr', 'Flux WMS');
INSERT INTO s_vitis.vm_translation (translation_id, lang, translation) VALUES ('vm4ms_61', 'en', 'WMS service');
INSERT INTO s_vitis.vm_section (label_id, name, index, event, template, tab_id, section_id, ressource_id, module) VALUES ('vm4ms_61', 'wms_service', 1, '', 'simpleFormTpl.html', (SELECT tab_id FROM s_vitis.vm_tab WHERE name='vm4ms_layer'), nextval('s_vitis.seq_vm'), 'vm4ms/layers', 'vm4ms');

-- Frédéric le 23/02/2017 à 15:07
CREATE TABLE s_vm4ms.msdebuglevel (msdebuglevel_id int4 NOT NULL, label_id varchar(60) NOT NULL, PRIMARY KEY (msdebuglevel_id));
ALTER TABLE s_vm4ms.msdebuglevel ADD CONSTRAINT fk_string_msdebuglevel FOREIGN KEY (label_id) REFERENCES s_vitis.vm_string (string_id);

INSERT INTO s_vitis.vm_string (string, string_id) VALUES ('msdebuglevel : erreurs seulement', 'vm4ms_76');
INSERT INTO s_vitis.vm_string (string, string_id) VALUES ('msdebuglevel : erreurs et notifications (warning)', 'vm4ms_77');
INSERT INTO s_vitis.vm_string (string, string_id) VALUES ('msdebuglevel : optimisation', 'vm4ms_78');
INSERT INTO s_vitis.vm_translation (translation_id, lang, translation) VALUES ('vm4ms_76', 'fr', 'Erreurs seulement');
INSERT INTO s_vitis.vm_translation (translation_id, lang, translation) VALUES ('vm4ms_76', 'en', 'Only errors');
INSERT INTO s_vitis.vm_translation (translation_id, lang, translation) VALUES ('vm4ms_77', 'fr', 'Erreurs et notifications (warning)');
INSERT INTO s_vitis.vm_translation (translation_id, lang, translation) VALUES ('vm4ms_77', 'en', 'Errors and notifications (warning)');
INSERT INTO s_vitis.vm_translation (translation_id, lang, translation) VALUES ('vm4ms_78', 'fr', 'optimisation');
INSERT INTO s_vitis.vm_translation (translation_id, lang, translation) VALUES ('vm4ms_78', 'en', 'optimisation');

INSERT INTO s_vm4ms.msdebuglevel (msdebuglevel_id, label_id) VALUES (0, 'vm4ms_76');
INSERT INTO s_vm4ms.msdebuglevel (msdebuglevel_id, label_id) VALUES (1, 'vm4ms_77');
INSERT INTO s_vm4ms.msdebuglevel (msdebuglevel_id, label_id) VALUES (3, 'vm4ms_78');

-- Frédéric le 27/02/2017 à 16:33
CREATE OR REPLACE VIEW s_vm4ms.v_layer AS SELECT layer.layer_id, layer.name, layer.title, layer.coordsys_id, layer.source_id, layer.connection_id, layer.tableschema, layer.tablename, layer.tableidfield, layer.definition, layer.active, layer.opacity, layer.layertype_id, connection.private AS private_connection, connection.name AS connection_label, source.name AS source_label,layer.definitiontmp FROM s_vm4ms.layer LEFT JOIN s_vm4ms.connection ON connection.connection_id = layer.connection_id LEFT JOIN s_vm4ms.source ON source.source_id = layer.source_id;
GRANT ALL ON TABLE s_vm4ms.v_layer TO vm4ms_admin;

-- Frédéric le 28/02/2017 à 14:32
CREATE OR REPLACE VIEW s_vm4ms.v_msdebuglevel AS SELECT msdebuglevel.*, vm_translation.translation, vm_translation.lang FROM s_vm4ms.msdebuglevel LEFT JOIN s_vitis.vm_translation ON vm_translation.translation_id = msdebuglevel.label_id;
GRANT ALL ON TABLE s_vm4ms.v_msdebuglevel TO vm4ms_admin;

-- Frédéric le 01/03/2017 à 11:56
UPDATE s_vitis.vm_section SET ressource_id = 'vm4ms/layerwmsservices' WHERE label_id = 'vm4ms_61';

-- Frédéric le 02/03/2017 à 10:28
ALTER TABLE s_vm4ms.connection ADD COLUMN "user" varchar(50);
ALTER TABLE s_vm4ms.connection ADD COLUMN "password" varchar(50);
ALTER TABLE s_vm4ms.connection DROP COLUMN definition;

-- Frédéric le 06/03/2017 à 10:47
DROP VIEW s_vm4ms.v_private_layer;
CREATE OR REPLACE VIEW s_vm4ms.v_private_layer AS SELECT layer.layer_id, layer.name, layer.title, layer.coordsys_id, layer.source_id, layer.connection_id, layer.tableschema, layer.tablename, layer.tableidfield, layer.definition, layer.active, layer.opacity, layer.layertype_id, connection.private AS private_connection, 'private'::text AS wmsservice_id FROM s_vm4ms.layer LEFT JOIN s_vm4ms.connection ON connection.connection_id = layer.connection_id WHERE connection.private = true;
GRANT ALL ON TABLE s_vm4ms.v_private_layer TO vm4ms_admin;

-- Armand le 07/03/2017 à 15:05: ajout des services Test et private dans vMap
INSERT INTO s_vmap.service(service_type_id, name, description, url, key, service_type_version, thumbnail, lang, imagery, service_type_type, service_options, service_vm4ms) VALUES ('imagewms', 'vm4ms_Test', 'Flux wms servant à tester une couche et les couches d''un flux wms', '[ms_cgi_url]/public/Test', '', '1.3.0', '', '', '', '', '', TRUE);
INSERT INTO s_vmap.service(service_type_id, name, description, url, key, service_type_version, thumbnail, lang, imagery, service_type_type, service_options, service_vm4ms) VALUES ('imagewms', 'vm4ms_private', 'Flux wms privé', '[ms_cgi_url]/private/[token]', '', '1.3.0', '', '', '', '', '', TRUE);

-- Frédéric le 10/03/2017 à 11:16
INSERT INTO s_vitis.vm_string (string, string_id) VALUES ('Champ server de l''onglet "vm4ms_connection"', 'vm4ms_79');
INSERT INTO s_vitis.vm_string (string, string_id) VALUES ('Champ port de l''onglet "vm4ms_connection"', 'vm4ms_80');
INSERT INTO s_vitis.vm_string (string, string_id) VALUES ('Champ database de l''onglet "vm4ms_connection"', 'vm4ms_81');
INSERT INTO s_vitis.vm_string (string, string_id) VALUES ('Champ user de l''onglet "vm4ms_connection"', 'vm4ms_82');

INSERT INTO s_vitis.vm_translation (translation_id, lang, translation) VALUES ('vm4ms_79', 'fr', 'Serveur');
INSERT INTO s_vitis.vm_translation (translation_id, lang, translation) VALUES ('vm4ms_79', 'en', 'Server');
INSERT INTO s_vitis.vm_translation (translation_id, lang, translation) VALUES ('vm4ms_80', 'fr', 'Port');
INSERT INTO s_vitis.vm_translation (translation_id, lang, translation) VALUES ('vm4ms_80', 'en', 'Port');
INSERT INTO s_vitis.vm_translation (translation_id, lang, translation) VALUES ('vm4ms_81', 'fr', 'Base de données');
INSERT INTO s_vitis.vm_translation (translation_id, lang, translation) VALUES ('vm4ms_81', 'en', 'Database');
INSERT INTO s_vitis.vm_translation (translation_id, lang, translation) VALUES ('vm4ms_82', 'fr', 'Utilisateur');
INSERT INTO s_vitis.vm_translation (translation_id, lang, translation) VALUES ('vm4ms_82', 'en', 'User');

INSERT INTO s_vitis.vm_table_field (name, sortable, resizeable, "index", width, align, label_id, ressource_id, tab_id) VALUES  ('server', true, true, 4,  150, 'left', 'vm4ms_79', 'vm4ms/layerconnections', (SELECT tab_id FROM s_vitis.vm_tab WHERE name='vm4ms_connection'));
INSERT INTO s_vitis.vm_table_field (name, sortable, resizeable, "index", width, align, label_id, ressource_id, tab_id) VALUES  ('port', true, true, 5,  50, 'right', 'vm4ms_80', 'vm4ms/layerconnections', (SELECT tab_id FROM s_vitis.vm_tab WHERE name='vm4ms_connection'));
INSERT INTO s_vitis.vm_table_field (name, sortable, resizeable, "index", width, align, label_id, ressource_id, tab_id) VALUES  ('database', true, true, 6,  150, 'left', 'vm4ms_81', 'vm4ms/layerconnections', (SELECT tab_id FROM s_vitis.vm_tab WHERE name='vm4ms_connection'));
INSERT INTO s_vitis.vm_table_field (name, sortable, resizeable, "index", width, align, label_id, ressource_id, tab_id) VALUES  ('user', true, true, 7,  200, 'left', 'vm4ms_82', 'vm4ms/layerconnections', (SELECT tab_id FROM s_vitis.vm_tab WHERE name='vm4ms_connection'));

-- Frédéric le 10/03/2017 à 15:51
ALTER TABLE s_vm4ms.coordsys ADD COLUMN "label" varchar(100);
UPDATE s_vm4ms.coordsys SET "label" = coordsys_id;

UPDATE s_vitis.vm_table_field SET index = 3, width = 100 WHERE label_id = 'vm4ms_38';
INSERT INTO s_vitis.vm_string (string, string_id) VALUES ('Champ label de l''onglet "vm4ms_coordsys"', 'vm4ms_83');
INSERT INTO s_vitis.vm_translation (translation_id, lang, translation) VALUES ('vm4ms_83', 'fr', 'Libellé');
INSERT INTO s_vitis.vm_translation (translation_id, lang, translation) VALUES ('vm4ms_83', 'en', 'Label');
INSERT INTO s_vitis.vm_table_field (name, sortable, resizeable, "index", width, align, label_id, ressource_id, tab_id) VALUES  ('label', true, true, 2,  200, 'left', 'vm4ms_83', 'vm4ms/coordinatesystems', (SELECT tab_id FROM s_vitis.vm_tab WHERE name='vm4ms_coordsys'));

-- Armand le 13/03/2017 à 11:00 : suppression de la colonne alias de la table wmsservice

DROP VIEW IF EXISTS s_vm4ms.v_wms_service;
DROP VIEW IF EXISTS s_vm4ms.v_public_wms_service;
DROP VIEW IF EXISTS s_vm4ms.v_private_wms_service;

CREATE OR REPLACE VIEW s_vm4ms.v_wms_service AS SELECT wmsservice.wmsservice_id, wmsservice.description, wmsservice.definition, wmsservice.web_id, web.name AS web_name, wmsservice.msdebuglevel_id FROM s_vm4ms.wmsservice LEFT JOIN s_vm4ms.web ON web.web_id = wmsservice.web_id;
GRANT ALL ON TABLE s_vm4ms.v_wms_service TO vm4ms_admin;
CREATE OR REPLACE VIEW s_vm4ms.v_public_wms_service AS SELECT wmsservice.wmsservice_id, wmsservice.description, wmsservice.definition, wmsservice.web_id, web.name AS web_name, wmsservice.msdebuglevel_id FROM s_vm4ms.wmsservice LEFT JOIN s_vm4ms.web ON web.web_id = wmsservice.web_id WHERE wmsservice_id <> 'private';
GRANT ALL ON TABLE s_vm4ms.v_public_wms_service TO vm4ms_admin;
CREATE OR REPLACE VIEW s_vm4ms.v_private_wms_service AS SELECT wmsservice.wmsservice_id, wmsservice.description, wmsservice.definition, wmsservice.web_id, web.name AS web_name, wmsservice.msdebuglevel_id FROM s_vm4ms.wmsservice LEFT JOIN s_vm4ms.web ON web.web_id = wmsservice.web_id WHERE wmsservice_id = 'private';
GRANT ALL ON TABLE s_vm4ms.v_private_wms_service TO vm4ms_admin;

ALTER TABLE s_vm4ms.wmsservice DROP COLUMN alias;


-- Armand le 13/03/2017 à 10:33 : coordsys_id devient un code EPSG

INSERT INTO s_vm4ms.coordsys ("coordsys_id", "label", "definition", "srid") VALUES ('EPSG:27571', 'Lambert I Carto', E'PROJECTION\r\n          #epsg 27571\r\n          "+proj=lcc +lat_1=49.50000000000001 +lat_0=49.50000000000001 +lon_0=0 +k_0=0.999877341 +x_0=600000 +y_0=1200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs"\r\nEND', 27571);
INSERT INTO s_vm4ms.coordsys ("coordsys_id", "label", "definition", "srid") VALUES ('EPSG:27572', 'Lambert II Carto', E'PROJECTION\r\n          #epsg 27572\r\n          "+proj=lcc +lat_1=46.8 +lat_0=46.8 +lon_0=0 +k_0=0.99987742 +x_0=600000 +y_0=2200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs"\r\nEND', 27572);
INSERT INTO s_vm4ms.coordsys ("coordsys_id", "label", "definition", "srid") VALUES ('EPSG:27573', 'Lambert III Carto', E'PROJECTION\r\n          #epsg 27573\r\n          "+proj=lcc +lat_1=44.10000000000001 +lat_0=44.10000000000001 +lon_0=0 +k_0=0.999877499 +x_0=600000 +y_0=3200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs"\r\nEND', 27573);
INSERT INTO s_vm4ms.coordsys ("coordsys_id", "label", "definition", "srid") VALUES ('EPSG:27574', 'Lambert IV Carto', E'PROJECTION\r\n          #epsg 27574\r\n          "+proj=lcc +lat_1=42.16500000000001 +lat_0=42.16500000000001 +lon_0=0 +k_0=0.99994471 +x_0=234.358 +y_0=4185861.369 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs"\r\nEND', 27574);
INSERT INTO s_vm4ms.coordsys ("coordsys_id", "label", "definition", "srid") VALUES ('EPSG:27561', 'Lambert Nord France', E'PROJECTION\r\n          #epsg 27561\r\n          "+proj=lcc +lat_1=49.50000000000001 +lat_0=49.50000000000001 +lon_0=0 +k_0=0.999877341 +x_0=600000 +y_0=200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs"\r\nEND', 27561);
INSERT INTO s_vm4ms.coordsys ("coordsys_id", "label", "definition", "srid") VALUES ('EPSG:27562', 'Lambert Centre France', E'PROJECTION\r\n          #epsg 27562\r\n          "+proj=lcc +lat_1=46.8 +lat_0=46.8 +lon_0=0 +k_0=0.99987742 +x_0=600000 +y_0=200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs"\r\nEND', 27562);
INSERT INTO s_vm4ms.coordsys ("coordsys_id", "label", "definition", "srid") VALUES ('EPSG:27563', 'Lambert Sud France', E'PROJECTION\r\n          #epsg 27563\r\n          "+proj=lcc +lat_1=44.10000000000001 +lat_0=44.10000000000001 +lon_0=0 +k_0=0.999877499 +x_0=600000 +y_0=200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs"\r\nEND', 27563);
INSERT INTO s_vm4ms.coordsys ("coordsys_id", "label", "definition", "srid") VALUES ('EPSG:27564', 'Lambert Corse', E'PROJECTION\r\n          #epsg 27564\r\n          "+proj=lcc +lat_1=42.16500000000001 +lat_0=42.16500000000001 +lon_0=0 +k_0=0.99994471 +x_0=234.358 +y_0=185861.369 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs"\r\nEND', 27564);
INSERT INTO s_vm4ms.coordsys ("coordsys_id", "label", "definition", "srid") VALUES ('EPSG:2154', 'Lambert 93', E'PROJECTION\r\n		#EPSG:2154 / RGF93\r\n		"+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"\r\n	END', 2154);
INSERT INTO s_vm4ms.coordsys ("coordsys_id", "label", "definition", "srid") VALUES ('EPSG:3942', 'Conique Conforme 1', E'PROJECTION\r\n		#EPSG:3942 / RGF93 CC1\r\n		"+proj=lcc +lat_1=41.25 +lat_2=42.75 +lat_0=42 +lon_0=3 +x_0=1700000 +y_0=1200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"\r\n	END', 3942);
INSERT INTO s_vm4ms.coordsys ("coordsys_id", "label", "definition", "srid") VALUES ('EPSG:3943', 'Conique Conforme 2', E'PROJECTION\r\n		#EPSG:3943 / RGF93 CC2\r\n		"+proj=lcc +lat_1=42.25 +lat_2=43.75 +lat_0=43 +lon_0=3 +x_0=1700000 +y_0=2200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"\r\n	END', 3943);
INSERT INTO s_vm4ms.coordsys ("coordsys_id", "label", "definition", "srid") VALUES ('EPSG:3944', 'Conique Conforme 3', E'PROJECTION\r\n		#EPSG:3944 / RGF93 CC3\r\n		"+proj=lcc +lat_1=43.25 +lat_2=44.75 +lat_0=44 +lon_0=3 +x_0=1700000 +y_0=3200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"\r\n	END', 3944);
INSERT INTO s_vm4ms.coordsys ("coordsys_id", "label", "definition", "srid") VALUES ('EPSG:3945', 'Conique Conforme 4', E'PROJECTION\r\n		#EPSG:3945 / RGF93 CC4\r\n		"+proj=lcc +lat_1=44.25 +lat_2=45.75 +lat_0=45 +lon_0=3 +x_0=1700000 +y_0=4200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"\r\n	END', 3945);
INSERT INTO s_vm4ms.coordsys ("coordsys_id", "label", "definition", "srid") VALUES ('EPSG:3946', 'Conique Conforme 5', E'PROJECTION\r\n		#EPSG:3946 / RGF93 CC5\r\n		"+proj=lcc +lat_1=45.25 +lat_2=46.75 +lat_0=46 +lon_0=3 +x_0=1700000 +y_0=5200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"\r\n	END', 3946);
INSERT INTO s_vm4ms.coordsys ("coordsys_id", "label", "definition", "srid") VALUES ('EPSG:3947', 'Conique Conforme 6', E'PROJECTION\r\n		#EPSG:3946 / RGF93 CC6\r\n		"+proj=lcc +lat_1=46.25 +lat_2=47.75 +lat_0=47 +lon_0=3 +x_0=1700000 +y_0=6200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"\r\n	END', 3947);
INSERT INTO s_vm4ms.coordsys ("coordsys_id", "label", "definition", "srid") VALUES ('EPSG:3948', 'Conique Conforme 7', E'PROJECTION\r\n		#EPSG:3946 / RGF93 CC7\r\n		"+proj=lcc +lat_1=47.25 +lat_2=48.75 +lat_0=48 +lon_0=3 +x_0=1700000 +y_0=7200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"\r\n	END', 3948);
INSERT INTO s_vm4ms.coordsys ("coordsys_id", "label", "definition", "srid") VALUES ('EPSG:3949', 'Conique Conforme 8', E'PROJECTION\r\n		#EPSG:3946 / RGF93 CC8\r\n		"+proj=lcc +lat_1=48.25 +lat_2=49.75 +lat_0=49 +lon_0=3 +x_0=1700000 +y_0=8200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"\r\n	END', 3949);
INSERT INTO s_vm4ms.coordsys ("coordsys_id", "label", "definition", "srid") VALUES ('EPSG:3950', 'Conique Conforme 9', E'PROJECTION\r\n		#EPSG:3946 / RGF93 CC9\r\n		"+proj=lcc +lat_1=49.25 +lat_2=50.75 +lat_0=50 +lon_0=3 +x_0=1700000 +y_0=9200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"\r\n	END', 3950);

UPDATE s_vm4ms.layer SET coordsys_id='EPSG:27571' WHERE coordsys_id='Lambert I Carto';
UPDATE s_vm4ms.layer SET coordsys_id='EPSG:27572' WHERE coordsys_id='Lambert II Carto';
UPDATE s_vm4ms.layer SET coordsys_id='EPSG:27573' WHERE coordsys_id='Lambert III Carto';
UPDATE s_vm4ms.layer SET coordsys_id='EPSG:27574' WHERE coordsys_id='Lambert IV Carto';
UPDATE s_vm4ms.layer SET coordsys_id='EPSG:27561' WHERE coordsys_id='Lambert Nord France';
UPDATE s_vm4ms.layer SET coordsys_id='EPSG:27562' WHERE coordsys_id='Lambert Centre France';
UPDATE s_vm4ms.layer SET coordsys_id='EPSG:27563' WHERE coordsys_id='Lambert Sud France';
UPDATE s_vm4ms.layer SET coordsys_id='EPSG:27564' WHERE coordsys_id='Lambert Corse';
UPDATE s_vm4ms.layer SET coordsys_id='EPSG:2154' WHERE coordsys_id='Lambert 93';
UPDATE s_vm4ms.layer SET coordsys_id='EPSG:3942' WHERE coordsys_id='Conique Conforme 1';
UPDATE s_vm4ms.layer SET coordsys_id='EPSG:3943' WHERE coordsys_id='Conique Conforme 2';
UPDATE s_vm4ms.layer SET coordsys_id='EPSG:3944' WHERE coordsys_id='Conique Conforme 3';
UPDATE s_vm4ms.layer SET coordsys_id='EPSG:3945' WHERE coordsys_id='Conique Conforme 4';
UPDATE s_vm4ms.layer SET coordsys_id='EPSG:3946' WHERE coordsys_id='Conique Conforme 5';
UPDATE s_vm4ms.layer SET coordsys_id='EPSG:3947' WHERE coordsys_id='Conique Conforme 6';
UPDATE s_vm4ms.layer SET coordsys_id='EPSG:3948' WHERE coordsys_id='Conique Conforme 7';
UPDATE s_vm4ms.layer SET coordsys_id='EPSG:3949' WHERE coordsys_id='Conique Conforme 8';
UPDATE s_vm4ms.layer SET coordsys_id='EPSG:3950' WHERE coordsys_id='Conique Conforme 9';

DELETE FROM s_vm4ms.coordsys WHERE coordsys_id='Lambert I Carto';
DELETE FROM s_vm4ms.coordsys WHERE coordsys_id='Lambert II Carto';
DELETE FROM s_vm4ms.coordsys WHERE coordsys_id='Lambert II Etendu';
DELETE FROM s_vm4ms.coordsys WHERE coordsys_id='Lambert III Carto';
DELETE FROM s_vm4ms.coordsys WHERE coordsys_id='Lambert IV Carto';
DELETE FROM s_vm4ms.coordsys WHERE coordsys_id='Lambert Nord France';
DELETE FROM s_vm4ms.coordsys WHERE coordsys_id='Lambert Centre France';
DELETE FROM s_vm4ms.coordsys WHERE coordsys_id='Lambert Sud France';
DELETE FROM s_vm4ms.coordsys WHERE coordsys_id='Lambert Corse';
DELETE FROM s_vm4ms.coordsys WHERE coordsys_id='Lambert 93';
DELETE FROM s_vm4ms.coordsys WHERE coordsys_id='Conique Conforme 1';
DELETE FROM s_vm4ms.coordsys WHERE coordsys_id='Conique Conforme 2';
DELETE FROM s_vm4ms.coordsys WHERE coordsys_id='Conique Conforme 3';
DELETE FROM s_vm4ms.coordsys WHERE coordsys_id='Conique Conforme 4';
DELETE FROM s_vm4ms.coordsys WHERE coordsys_id='Conique Conforme 5';
DELETE FROM s_vm4ms.coordsys WHERE coordsys_id='Conique Conforme 6';
DELETE FROM s_vm4ms.coordsys WHERE coordsys_id='Conique Conforme 7';
DELETE FROM s_vm4ms.coordsys WHERE coordsys_id='Conique Conforme 8';
DELETE FROM s_vm4ms.coordsys WHERE coordsys_id='Conique Conforme 9';

ALTER TABLE s_vm4ms.coordsys ALTER COLUMN coordsys_id TYPE varchar(20);

DROP VIEW IF EXISTS s_vm4ms.v_layer;
CREATE OR REPLACE VIEW s_vm4ms.v_layer AS SELECT layer.layer_id, layer.name, layer.title, layer.coordsys_id, coordsys.label as coordsys_label, layer.source_id, layer.connection_id, layer.tableschema, layer.tablename, layer.tableidfield, layer.definition, layer.active, layer.opacity, layer.layertype_id, connection.private AS private_connection, connection.name AS connection_label, source.name AS source_label,layer.definitiontmp FROM s_vm4ms.layer LEFT JOIN s_vm4ms.connection ON connection.connection_id = layer.connection_id LEFT JOIN s_vm4ms.source ON source.source_id = layer.source_id LEFT JOIN s_vm4ms.coordsys ON coordsys.coordsys_id = layer.coordsys_id;
GRANT ALL ON TABLE s_vm4ms.v_layer TO vm4ms_admin;

UPDATE s_vitis.vm_table_field SET name='coordsys_label' WHERE name='coordsys_id' AND ressource_id='vm4ms/layers';


-- Armand le 14/03/2017 à 10:33 : layer -> ms_layer

ALTER TABLE s_vm4ms.layer RENAME TO ms_layer;
ALTER TABLE s_vm4ms.ms_layer RENAME COLUMN layer_id TO ms_layer_id;
ALTER TABLE s_vm4ms.ms_layer RENAME COLUMN layertype_id TO ms_layertype_id;

ALTER TABLE s_vm4ms.wmsservice_layer RENAME TO wmsservice_ms_layer;
ALTER TABLE s_vm4ms.wmsservice_ms_layer RENAME COLUMN layer_id TO ms_layer_id;
ALTER TABLE s_vm4ms.wmsservice_ms_layer RENAME COLUMN wmsservice_layer_id TO wmsservice_ms_layer_id;

ALTER TABLE s_vm4ms.layertype RENAME TO ms_layertype;
ALTER TABLE s_vm4ms.ms_layertype RENAME COLUMN layertype_id TO ms_layertype_id;

DROP VIEW IF EXISTS s_vm4ms.v_layer;
DROP VIEW IF EXISTS s_vm4ms.v_public_layer;
DROP VIEW IF EXISTS s_vm4ms.v_private_layer;
DROP VIEW IF EXISTS s_vm4ms.v_wms_service_layer;
DROP VIEW IF EXISTS s_vm4ms.v_public_wms_service_layer;

DROP VIEW IF EXISTS s_vm4ms.v_ms_layer;
CREATE OR REPLACE VIEW s_vm4ms.v_ms_layer AS SELECT ms_layer.ms_layer_id, ms_layer.name, ms_layer.title, ms_layer.coordsys_id, coordsys.label as coordsys_label, ms_layer.source_id, ms_layer.connection_id, ms_layer.tableschema, ms_layer.tablename, ms_layer.tableidfield, ms_layer.definition, ms_layer.active, ms_layer.opacity, ms_layer.ms_layertype_id, connection.private AS private_connection, connection.name AS connection_label, source.name AS source_label,ms_layer.definitiontmp FROM s_vm4ms.ms_layer LEFT JOIN s_vm4ms.connection ON connection.connection_id = ms_layer.connection_id LEFT JOIN s_vm4ms.source ON source.source_id = ms_layer.source_id LEFT JOIN s_vm4ms.coordsys ON coordsys.coordsys_id = ms_layer.coordsys_id;
GRANT ALL ON TABLE s_vm4ms.v_ms_layer TO vm4ms_admin;

DROP VIEW IF EXISTS s_vm4ms.v_public_ms_layer;
CREATE OR REPLACE VIEW s_vm4ms.v_public_ms_layer AS SELECT ms_layer.ms_layer_id, ms_layer.name, ms_layer.title, ms_layer.coordsys_id, ms_layer.source_id, ms_layer.connection_id, ms_layer.tableschema, ms_layer.tablename, ms_layer.tableidfield, ms_layer.definition, ms_layer.active, ms_layer.opacity, ms_layer.ms_layertype_id, connection.private AS private_connection FROM s_vm4ms.ms_layer LEFT JOIN s_vm4ms.connection ON connection.connection_id = ms_layer.connection_id WHERE connection.private = false;
GRANT ALL ON TABLE s_vm4ms.v_public_ms_layer TO vm4ms_admin;

DROP VIEW IF EXISTS s_vm4ms.v_private_ms_layer;
CREATE OR REPLACE VIEW s_vm4ms.v_private_ms_layer AS SELECT ms_layer.ms_layer_id, ms_layer.name, ms_layer.title, ms_layer.coordsys_id, ms_layer.source_id, ms_layer.connection_id, ms_layer.tableschema, ms_layer.tablename, ms_layer.tableidfield, ms_layer.definition, ms_layer.active, ms_layer.opacity, ms_layer.ms_layertype_id, connection.private AS private_connection, 'private'::text AS wmsservice_id FROM s_vm4ms.ms_layer LEFT JOIN s_vm4ms.connection ON connection.connection_id = ms_layer.connection_id WHERE connection.private = true;
GRANT ALL ON TABLE s_vm4ms.v_private_ms_layer TO vm4ms_admin;

DROP VIEW IF EXISTS s_vm4ms.v_wms_service_ms_layer;
CREATE OR REPLACE VIEW s_vm4ms.v_wms_service_ms_layer AS SELECT wmsservice_ms_layer.wmsservice_id,wmsservice_ms_layer.ms_layer_id,ms_layer.name,ms_layer.title,ms_layer.active,ms_layer.opacity,connection.private FROM s_vm4ms.wmsservice_ms_layer LEFT JOIN s_vm4ms.ms_layer ON ms_layer.ms_layer_id = wmsservice_ms_layer.ms_layer_id LEFT JOIN s_vm4ms.connection ON connection.connection_id = ms_layer.connection_id;
GRANT ALL ON TABLE s_vm4ms.v_wms_service_ms_layer TO vm4ms_admin;

DROP VIEW IF EXISTS s_vm4ms.v_public_wms_service_ms_layer;
CREATE OR REPLACE VIEW s_vm4ms.v_public_wms_service_ms_layer AS SELECT wmsservice_ms_layer.wmsservice_id,wmsservice_ms_layer.ms_layer_id,ms_layer.name,ms_layer.title,ms_layer.active,ms_layer.opacity,connection.private FROM s_vm4ms.wmsservice_ms_layer LEFT JOIN s_vm4ms.ms_layer ON ms_layer.ms_layer_id = wmsservice_ms_layer.ms_layer_id LEFT JOIN s_vm4ms.connection ON connection.connection_id = ms_layer.connection_id WHERE connection.private = false;
GRANT ALL ON TABLE s_vm4ms.v_public_wms_service_ms_layer TO vm4ms_admin;

UPDATE s_vitis.vm_tab SET sorted_by='ms_layer_id' WHERE sorted_by='layer_id' AND mode_id='vm4ms';
UPDATE s_vitis.vm_table_field SET name='ms_layer_id' WHERE name='layer_id' AND ressource_id='vm4ms/layers';
UPDATE s_vitis.vm_table_field SET name='ms_layer_id' WHERE name='layer_id' AND ressource_id='vm4ms/publicwmsservicelayers';
UPDATE s_vitis.vm_table_field SET name='ms_layer_id' WHERE name='layer_id' AND ressource_id='vm4ms/privatewmsservicelayers';


-- Armand le 13/03/2017 à 10:33 : changement sur coordsys (à nouveau)

INSERT INTO s_vm4ms.coordsys ("coordsys_id", "label", "definition", "srid") VALUES (27571, '[EPSG:27571]-NTF(Paris)/Lambert zone I', E'PROJECTION\r\n          #epsg 27571\r\n          "+proj=lcc +lat_1=49.50000000000001 +lat_0=49.50000000000001 +lon_0=0 +k_0=0.999877341 +x_0=600000 +y_0=1200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs"\r\nEND', 27571);
INSERT INTO s_vm4ms.coordsys ("coordsys_id", "label", "definition", "srid") VALUES (27572, '[EPSG:27572]-NTF(Paris)/Lambert zone II', E'PROJECTION\r\n          #epsg 27572\r\n          "+proj=lcc +lat_1=46.8 +lat_0=46.8 +lon_0=0 +k_0=0.99987742 +x_0=600000 +y_0=2200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs"\r\nEND', 27572);
INSERT INTO s_vm4ms.coordsys ("coordsys_id", "label", "definition", "srid") VALUES (27573, '[EPSG:27573]-NTF(Paris)/Lambert zone III', E'PROJECTION\r\n          #epsg 27573\r\n          "+proj=lcc +lat_1=44.10000000000001 +lat_0=44.10000000000001 +lon_0=0 +k_0=0.999877499 +x_0=600000 +y_0=3200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs"\r\nEND', 27573);
INSERT INTO s_vm4ms.coordsys ("coordsys_id", "label", "definition", "srid") VALUES (27574, '[EPSG:27574]-NTF(Paris)/Lambert zone IV', E'PROJECTION\r\n          #epsg 27574\r\n          "+proj=lcc +lat_1=42.16500000000001 +lat_0=42.16500000000001 +lon_0=0 +k_0=0.99994471 +x_0=234.358 +y_0=4185861.369 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs"\r\nEND', 27574);
INSERT INTO s_vm4ms.coordsys ("coordsys_id", "label", "definition", "srid") VALUES (27561, '[EPSG:27561]-NTF(Paris)/Lambert Nord France', E'PROJECTION\r\n          #epsg 27561\r\n          "+proj=lcc +lat_1=49.50000000000001 +lat_0=49.50000000000001 +lon_0=0 +k_0=0.999877341 +x_0=600000 +y_0=200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs"\r\nEND', 27561);
INSERT INTO s_vm4ms.coordsys ("coordsys_id", "label", "definition", "srid") VALUES (27562, '[EPSG:27562]-NTF(Paris)/Lambert Centre France', E'PROJECTION\r\n          #epsg 27562\r\n          "+proj=lcc +lat_1=46.8 +lat_0=46.8 +lon_0=0 +k_0=0.99987742 +x_0=600000 +y_0=200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs"\r\nEND', 27562);
INSERT INTO s_vm4ms.coordsys ("coordsys_id", "label", "definition", "srid") VALUES (27563, '[EPSG:27563]-NTF(Paris)/Lambert Sud France', E'PROJECTION\r\n          #epsg 27563\r\n          "+proj=lcc +lat_1=44.10000000000001 +lat_0=44.10000000000001 +lon_0=0 +k_0=0.999877499 +x_0=600000 +y_0=200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs"\r\nEND', 27563);
INSERT INTO s_vm4ms.coordsys ("coordsys_id", "label", "definition", "srid") VALUES (27564, '[EPSG:27564]-NTF(Paris)/Lambert Corse', E'PROJECTION\r\n          #epsg 27564\r\n          "+proj=lcc +lat_1=42.16500000000001 +lat_0=42.16500000000001 +lon_0=0 +k_0=0.99994471 +x_0=234.358 +y_0=185861.369 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs"\r\nEND', 27564);
INSERT INTO s_vm4ms.coordsys ("coordsys_id", "label", "definition", "srid") VALUES (2154, '[EPSG:2154]-RGF93/Lambert-93', E'PROJECTION\r\n		#EPSG:2154 / RGF93\r\n		"+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"\r\n	END', 2154);
INSERT INTO s_vm4ms.coordsys ("coordsys_id", "label", "definition", "srid") VALUES (3942, '[EPSG:3942]-RGF93/CC42 (Lambert zone 1)', E'PROJECTION\r\n		#EPSG:3942 / RGF93 CC1\r\n		"+proj=lcc +lat_1=41.25 +lat_2=42.75 +lat_0=42 +lon_0=3 +x_0=1700000 +y_0=1200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"\r\n	END', 3942);
INSERT INTO s_vm4ms.coordsys ("coordsys_id", "label", "definition", "srid") VALUES (3943, '[EPSG:3943]-RGF93/CC43 (Lambert zone 2)', E'PROJECTION\r\n		#EPSG:3943 / RGF93 CC2\r\n		"+proj=lcc +lat_1=42.25 +lat_2=43.75 +lat_0=43 +lon_0=3 +x_0=1700000 +y_0=2200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"\r\n	END', 3943);
INSERT INTO s_vm4ms.coordsys ("coordsys_id", "label", "definition", "srid") VALUES (3944, '[EPSG:3944]-RGF93/CC44 (Lambert zone 3)', E'PROJECTION\r\n		#EPSG:3944 / RGF93 CC3\r\n		"+proj=lcc +lat_1=43.25 +lat_2=44.75 +lat_0=44 +lon_0=3 +x_0=1700000 +y_0=3200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"\r\n	END', 3944);
INSERT INTO s_vm4ms.coordsys ("coordsys_id", "label", "definition", "srid") VALUES (3945, '[EPSG:3945]-RGF93/CC45 (Lambert zone 4)', E'PROJECTION\r\n		#EPSG:3945 / RGF93 CC4\r\n		"+proj=lcc +lat_1=44.25 +lat_2=45.75 +lat_0=45 +lon_0=3 +x_0=1700000 +y_0=4200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"\r\n	END', 3945);
INSERT INTO s_vm4ms.coordsys ("coordsys_id", "label", "definition", "srid") VALUES (3946, '[EPSG:3946]-RGF93/CC46 (Lambert zone 5)', E'PROJECTION\r\n		#EPSG:3946 / RGF93 CC5\r\n		"+proj=lcc +lat_1=45.25 +lat_2=46.75 +lat_0=46 +lon_0=3 +x_0=1700000 +y_0=5200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"\r\n	END', 3946);
INSERT INTO s_vm4ms.coordsys ("coordsys_id", "label", "definition", "srid") VALUES (3947, '[EPSG:3947]-RGF93/CC47 (Lambert zone 6)', E'PROJECTION\r\n		#EPSG:3946 / RGF93 CC6\r\n		"+proj=lcc +lat_1=46.25 +lat_2=47.75 +lat_0=47 +lon_0=3 +x_0=1700000 +y_0=6200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"\r\n	END', 3947);
INSERT INTO s_vm4ms.coordsys ("coordsys_id", "label", "definition", "srid") VALUES (3948, '[EPSG:3948]-RGF93/CC48 (Lambert zone 7)', E'PROJECTION\r\n		#EPSG:3946 / RGF93 CC7\r\n		"+proj=lcc +lat_1=47.25 +lat_2=48.75 +lat_0=48 +lon_0=3 +x_0=1700000 +y_0=7200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"\r\n	END', 3948);
INSERT INTO s_vm4ms.coordsys ("coordsys_id", "label", "definition", "srid") VALUES (3949, '[EPSG:3949]-RGF93/CC49 (Lambert zone 8)', E'PROJECTION\r\n		#EPSG:3946 / RGF93 CC8\r\n		"+proj=lcc +lat_1=48.25 +lat_2=49.75 +lat_0=49 +lon_0=3 +x_0=1700000 +y_0=8200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"\r\n	END', 3949);
INSERT INTO s_vm4ms.coordsys ("coordsys_id", "label", "definition", "srid") VALUES (3950, '[EPSG:3950]-RGF93/CC50 (Lambert zone 9)', E'PROJECTION\r\n		#EPSG:3946 / RGF93 CC9\r\n		"+proj=lcc +lat_1=49.25 +lat_2=50.75 +lat_0=50 +lon_0=3 +x_0=1700000 +y_0=9200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"\r\n	END', 3950);

UPDATE s_vm4ms.ms_layer SET coordsys_id=27571 WHERE coordsys_id='EPSG:27571';
UPDATE s_vm4ms.ms_layer SET coordsys_id=27572 WHERE coordsys_id='EPSG:27572';
UPDATE s_vm4ms.ms_layer SET coordsys_id=27573 WHERE coordsys_id='EPSG:27573';
UPDATE s_vm4ms.ms_layer SET coordsys_id=27574 WHERE coordsys_id='EPSG:27574';
UPDATE s_vm4ms.ms_layer SET coordsys_id=27561 WHERE coordsys_id='EPSG:27561';
UPDATE s_vm4ms.ms_layer SET coordsys_id=27562 WHERE coordsys_id='EPSG:27562';
UPDATE s_vm4ms.ms_layer SET coordsys_id=27563 WHERE coordsys_id='EPSG:27563';
UPDATE s_vm4ms.ms_layer SET coordsys_id=27564 WHERE coordsys_id='EPSG:27564';
UPDATE s_vm4ms.ms_layer SET coordsys_id=2154 WHERE coordsys_id='EPSG:2154';
UPDATE s_vm4ms.ms_layer SET coordsys_id=3942 WHERE coordsys_id='EPSG:3942';
UPDATE s_vm4ms.ms_layer SET coordsys_id=3943 WHERE coordsys_id='EPSG:3943';
UPDATE s_vm4ms.ms_layer SET coordsys_id=3944 WHERE coordsys_id='EPSG:3944';
UPDATE s_vm4ms.ms_layer SET coordsys_id=3945 WHERE coordsys_id='EPSG:3945';
UPDATE s_vm4ms.ms_layer SET coordsys_id=3946 WHERE coordsys_id='EPSG:3946';
UPDATE s_vm4ms.ms_layer SET coordsys_id=3947 WHERE coordsys_id='EPSG:3947';
UPDATE s_vm4ms.ms_layer SET coordsys_id=3948 WHERE coordsys_id='EPSG:3948';
UPDATE s_vm4ms.ms_layer SET coordsys_id=3949 WHERE coordsys_id='EPSG:3949';
UPDATE s_vm4ms.ms_layer SET coordsys_id=3950 WHERE coordsys_id='EPSG:3950';

DELETE FROM s_vm4ms.coordsys WHERE coordsys_id='EPSG:27571';
DELETE FROM s_vm4ms.coordsys WHERE coordsys_id='EPSG:27572';
DELETE FROM s_vm4ms.coordsys WHERE coordsys_id='EPSG:27573';
DELETE FROM s_vm4ms.coordsys WHERE coordsys_id='EPSG:27574';
DELETE FROM s_vm4ms.coordsys WHERE coordsys_id='EPSG:27561';
DELETE FROM s_vm4ms.coordsys WHERE coordsys_id='EPSG:27562';
DELETE FROM s_vm4ms.coordsys WHERE coordsys_id='EPSG:27563';
DELETE FROM s_vm4ms.coordsys WHERE coordsys_id='EPSG:27564';
DELETE FROM s_vm4ms.coordsys WHERE coordsys_id='EPSG:2154';
DELETE FROM s_vm4ms.coordsys WHERE coordsys_id='EPSG:3942';
DELETE FROM s_vm4ms.coordsys WHERE coordsys_id='EPSG:3943';
DELETE FROM s_vm4ms.coordsys WHERE coordsys_id='EPSG:3944';
DELETE FROM s_vm4ms.coordsys WHERE coordsys_id='EPSG:3945';
DELETE FROM s_vm4ms.coordsys WHERE coordsys_id='EPSG:3946';
DELETE FROM s_vm4ms.coordsys WHERE coordsys_id='EPSG:3947';
DELETE FROM s_vm4ms.coordsys WHERE coordsys_id='EPSG:3948';
DELETE FROM s_vm4ms.coordsys WHERE coordsys_id='EPSG:3949';
DELETE FROM s_vm4ms.coordsys WHERE coordsys_id='EPSG:3950';

DROP VIEW IF EXISTS s_vm4ms.v_ms_layer;
DROP VIEW IF EXISTS s_vm4ms.v_public_ms_layer;
DROP VIEW IF EXISTS s_vm4ms.v_private_ms_layer;
DROP VIEW IF EXISTS s_vm4ms.v_wms_service_ms_layer;
DROP VIEW IF EXISTS s_vm4ms.v_public_wms_service_ms_layer;

ALTER TABLE s_vm4ms.ms_layer DROP CONSTRAINT fk_layer_coordsys;

ALTER TABLE s_vm4ms.coordsys ALTER COLUMN coordsys_id TYPE integer USING (trim(coordsys_id)::integer);
ALTER TABLE s_vm4ms.ms_layer ALTER COLUMN coordsys_id TYPE integer USING (trim(coordsys_id)::integer);

ALTER TABLE s_vm4ms.ms_layer ADD CONSTRAINT fk_layer_coordsys FOREIGN KEY (coordsys_id) REFERENCES s_vm4ms.coordsys (coordsys_id);

DROP VIEW IF EXISTS s_vm4ms.v_ms_layer;
CREATE OR REPLACE VIEW s_vm4ms.v_ms_layer AS SELECT ms_layer.ms_layer_id, ms_layer.name, ms_layer.title, ms_layer.coordsys_id, coordsys.label as coordsys_label, ms_layer.source_id, ms_layer.connection_id, ms_layer.tableschema, ms_layer.tablename, ms_layer.tableidfield, ms_layer.definition, ms_layer.active, ms_layer.opacity, ms_layer.ms_layertype_id, connection.private AS private_connection, connection.name AS connection_label, source.name AS source_label,ms_layer.definitiontmp FROM s_vm4ms.ms_layer LEFT JOIN s_vm4ms.connection ON connection.connection_id = ms_layer.connection_id LEFT JOIN s_vm4ms.source ON source.source_id = ms_layer.source_id LEFT JOIN s_vm4ms.coordsys ON coordsys.coordsys_id = ms_layer.coordsys_id;
GRANT ALL ON TABLE s_vm4ms.v_ms_layer TO vm4ms_admin;

DROP VIEW IF EXISTS s_vm4ms.v_public_ms_layer;
CREATE OR REPLACE VIEW s_vm4ms.v_public_ms_layer AS SELECT ms_layer.ms_layer_id, ms_layer.name, ms_layer.title, ms_layer.coordsys_id, ms_layer.source_id, ms_layer.connection_id, ms_layer.tableschema, ms_layer.tablename, ms_layer.tableidfield, ms_layer.definition, ms_layer.active, ms_layer.opacity, ms_layer.ms_layertype_id, connection.private AS private_connection FROM s_vm4ms.ms_layer LEFT JOIN s_vm4ms.connection ON connection.connection_id = ms_layer.connection_id WHERE connection.private = false;
GRANT ALL ON TABLE s_vm4ms.v_public_ms_layer TO vm4ms_admin;

DROP VIEW IF EXISTS s_vm4ms.v_private_ms_layer;
CREATE OR REPLACE VIEW s_vm4ms.v_private_ms_layer AS SELECT ms_layer.ms_layer_id, ms_layer.name, ms_layer.title, ms_layer.coordsys_id, ms_layer.source_id, ms_layer.connection_id, ms_layer.tableschema, ms_layer.tablename, ms_layer.tableidfield, ms_layer.definition, ms_layer.active, ms_layer.opacity, ms_layer.ms_layertype_id, connection.private AS private_connection, 'private'::text AS wmsservice_id FROM s_vm4ms.ms_layer LEFT JOIN s_vm4ms.connection ON connection.connection_id = ms_layer.connection_id WHERE connection.private = true;
GRANT ALL ON TABLE s_vm4ms.v_private_ms_layer TO vm4ms_admin;

DROP VIEW IF EXISTS s_vm4ms.v_wms_service_ms_layer;
CREATE OR REPLACE VIEW s_vm4ms.v_wms_service_ms_layer AS SELECT wmsservice_ms_layer.wmsservice_id,wmsservice_ms_layer.ms_layer_id,ms_layer.name,ms_layer.title,ms_layer.active,ms_layer.opacity,connection.private FROM s_vm4ms.wmsservice_ms_layer LEFT JOIN s_vm4ms.ms_layer ON ms_layer.ms_layer_id = wmsservice_ms_layer.ms_layer_id LEFT JOIN s_vm4ms.connection ON connection.connection_id = ms_layer.connection_id;
GRANT ALL ON TABLE s_vm4ms.v_wms_service_ms_layer TO vm4ms_admin;

DROP VIEW IF EXISTS s_vm4ms.v_public_wms_service_ms_layer;
CREATE OR REPLACE VIEW s_vm4ms.v_public_wms_service_ms_layer AS SELECT wmsservice_ms_layer.wmsservice_id,wmsservice_ms_layer.ms_layer_id,ms_layer.name,ms_layer.title,ms_layer.active,ms_layer.opacity,connection.private FROM s_vm4ms.wmsservice_ms_layer LEFT JOIN s_vm4ms.ms_layer ON ms_layer.ms_layer_id = wmsservice_ms_layer.ms_layer_id LEFT JOIN s_vm4ms.connection ON connection.connection_id = ms_layer.connection_id WHERE connection.private = false;
GRANT ALL ON TABLE s_vm4ms.v_public_wms_service_ms_layer TO vm4ms_admin;

ALTER TABLE s_vm4ms.coordsys DROP COLUMN srid;

ALTER TABLE s_vm4ms.coordsys ADD COLUMN epsg varchar(20);
UPDATE s_vm4ms.coordsys SET epsg=concat('EPSG:', coordsys_id);

UPDATE s_vitis.vm_table_field SET width='100' WHERE name='coordsys_id' AND ressource_id='vm4ms/coordinatesystems';
UPDATE s_vitis.vm_table_field SET name='epsg' WHERE name='srid' AND ressource_id='vm4ms/coordinatesystems';
UPDATE s_vitis.vm_table_field SET width='400' WHERE name='label' AND ressource_id='vm4ms/coordinatesystems';
UPDATE s_vitis.vm_table_field SET width='270' WHERE name='coordsys_label' AND ressource_id='vm4ms/layers';
UPDATE s_vitis.vm_translation SET translation='Code EPSG' WHERE translation_id='vm4ms_38';
UPDATE s_vitis.vm_translation SET translation='SRID' WHERE translation_id='vm4ms_37';

INSERT INTO s_vm4ms.coordsys ("coordsys_id", "label", "definition", "epsg") VALUES (3857, '[EPSG:3857]-WGS84/Spherical Mercator', E'PROJECTION\r\n		#EPSG:3857 / WGS84\r\n		"+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +a=6378137 +b=6378137 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"\r\n	END', 'EPSG:3857');
INSERT INTO s_vm4ms.coordsys ("coordsys_id", "label", "definition", "epsg") VALUES (4326, '[EPSG:4326]-WGS84/Long-Lat', E'PROJECTION\r\n		#EPSG:4326 / WGS84\r\n		"+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs"\r\n	END', 'EPSG:4326');

-- Frédéric le 24/03/2017 à 14:37
UPDATE s_vmap.service SET url = '[ms_cgi_url]/private/[token]' WHERE name = 'vm4ms_private';

-- Armand le 31/03/2017 à 11:30
UPDATE s_vitis.vm_translation SET translation='Srid' where translation_id='vm4ms_37'

-- Frédéric le 19/04/2017 à 09:39
UPDATE s_vitis.vm_section SET index = 2 WHERE label_id = 'vm4ms_61';

-- Frédéric le 20/04/2017 à 12:30
DROP VIEW IF EXISTS s_vm4ms.v_ms_layer;
CREATE VIEW s_vm4ms.v_ms_layer AS    SELECT ms_layer.ms_layer_id, ms_layer.name, ms_layer.title, ms_layer.coordsys_id, coordsys.label AS coordsys_label, ms_layer.source_id, ms_layer.connection_id, ms_layer.tableschema, ms_layer.tablename, ms_layer.tableidfield, ms_layer.definition, ms_layer.active, ms_layer.opacity, ms_layer.ms_layertype_id, COALESCE(connection.private, false) AS private_connection, connection.name AS connection_label, source.name AS source_label, ms_layer.definitiontmp FROM (((s_vm4ms.ms_layer LEFT JOIN s_vm4ms.connection ON ((connection.connection_id = ms_layer.connection_id))) LEFT JOIN s_vm4ms.source ON ((source.source_id = ms_layer.source_id))) LEFT JOIN s_vm4ms.coordsys ON ((coordsys.coordsys_id = ms_layer.coordsys_id)));
ALTER TABLE s_vm4ms.v_ms_layer OWNER TO postgres;
REVOKE ALL ON TABLE s_vm4ms.v_ms_layer FROM PUBLIC;
REVOKE ALL ON TABLE s_vm4ms.v_ms_layer FROM postgres;
GRANT ALL ON TABLE s_vm4ms.v_ms_layer TO postgres;
GRANT ALL ON TABLE s_vm4ms.v_ms_layer TO vm4ms_admin;

-- Frédéric le 20/04/2017 à 14:05
DROP VIEW IF EXISTS s_vm4ms.v_public_ms_layer;
CREATE VIEW s_vm4ms.v_public_ms_layer AS    SELECT ms_layer.ms_layer_id, ms_layer.name, ms_layer.title, ms_layer.coordsys_id, ms_layer.source_id, ms_layer.connection_id, ms_layer.tableschema, ms_layer.tablename, ms_layer.tableidfield, ms_layer.definition, ms_layer.active, ms_layer.opacity, ms_layer.ms_layertype_id, COALESCE(connection.private, false) AS private_connection FROM (s_vm4ms.ms_layer LEFT JOIN s_vm4ms.connection ON ((connection.connection_id = ms_layer.connection_id))) WHERE (connection.private = false OR connection.private IS NULL);
ALTER TABLE s_vm4ms.v_public_ms_layer OWNER TO postgres;
REVOKE ALL ON TABLE s_vm4ms.v_public_ms_layer FROM PUBLIC;
REVOKE ALL ON TABLE s_vm4ms.v_public_ms_layer FROM postgres;
GRANT ALL ON TABLE s_vm4ms.v_public_ms_layer TO postgres;
GRANT ALL ON TABLE s_vm4ms.v_public_ms_layer TO vm4ms_admin;

DROP VIEW IF EXISTS s_vm4ms.v_public_wms_service_layers;
CREATE VIEW s_vm4ms.v_public_wms_service_layers AS    SELECT wmsservice_layer.wmsservice_id, wmsservice_layer.ms_layer_id AS layer_id, layer.name, layer.title, layer.active, layer.opacity, COALESCE(connection.private, false) FROM ((s_vm4ms.wmsservice_ms_layer wmsservice_layer LEFT JOIN s_vm4ms.ms_layer layer ON ((layer.ms_layer_id = wmsservice_layer.ms_layer_id))) LEFT JOIN s_vm4ms.connection ON ((connection.connection_id = layer.connection_id))) WHERE (connection.private = false OR connection.private IS NULL);
ALTER TABLE s_vm4ms.v_public_wms_service_layers OWNER TO postgres;
REVOKE ALL ON TABLE s_vm4ms.v_public_wms_service_layers FROM PUBLIC;
REVOKE ALL ON TABLE s_vm4ms.v_public_wms_service_layers FROM postgres;
GRANT ALL ON TABLE s_vm4ms.v_public_wms_service_layers TO postgres;
GRANT ALL ON TABLE s_vm4ms.v_public_wms_service_layers TO vm4ms_admin;

DROP VIEW IF EXISTS s_vm4ms.v_public_wms_service_ms_layer;
CREATE VIEW s_vm4ms.v_public_wms_service_ms_layer AS    SELECT wmsservice_ms_layer.wmsservice_id, wmsservice_ms_layer.ms_layer_id, ms_layer.name, ms_layer.title, ms_layer.active, ms_layer.opacity, COALESCE(connection.private, false) FROM ((s_vm4ms.wmsservice_ms_layer LEFT JOIN s_vm4ms.ms_layer ON ((ms_layer.ms_layer_id = wmsservice_ms_layer.ms_layer_id))) LEFT JOIN s_vm4ms.connection ON ((connection.connection_id = ms_layer.connection_id))) WHERE (connection.private = false OR connection.private IS NULL);
ALTER TABLE s_vm4ms.v_public_wms_service_ms_layer OWNER TO postgres;
REVOKE ALL ON TABLE s_vm4ms.v_public_wms_service_ms_layer FROM PUBLIC;
REVOKE ALL ON TABLE s_vm4ms.v_public_wms_service_ms_layer FROM postgres;
GRANT ALL ON TABLE s_vm4ms.v_public_wms_service_ms_layer TO postgres;
GRANT ALL ON TABLE s_vm4ms.v_public_wms_service_ms_layer TO vm4ms_admin;
