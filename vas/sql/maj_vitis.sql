-- Frédéric le 15/07/2016 10:05
ALTER TABLE s_vitis.vm_section ADD COLUMN module character varying(100);
ALTER TABLE s_vitis.vm_section ADD CONSTRAINT fk_module_vm_section FOREIGN KEY (module) REFERENCES s_vitis.vm_module (module_id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION;
UPDATE s_vitis.vm_section SET module='vitis' WHERE label_id LIKE 'vitis%';

-- Frédéric le 15/07/2016 10:28
DROP VIEW s_vitis.v_section;
CREATE VIEW s_vitis.v_section AS SELECT vm_section.tab_id, vm_section.section_id, vm_section.event, vm_section.index, vm_translation.translation AS label, vm_translation.lang, vm_section.name, vm_section.template, vm_section.ressource_id, vm_section.module AS module_name FROM s_vitis.vm_section LEFT JOIN s_vitis.vm_translation ON vm_section.label_id::text = vm_translation.translation_id::text LEFT JOIN s_vitis.vm_tab ON vm_section.tab_id::text = vm_tab.tab_id::text;
ALTER TABLE s_vitis.v_section OWNER TO u_vitis;
REVOKE ALL ON TABLE s_vitis.v_section FROM PUBLIC;
REVOKE ALL ON TABLE s_vitis.v_section FROM u_vitis;
GRANT ALL ON TABLE s_vitis.v_section TO u_vitis;
GRANT ALL ON TABLE s_vitis.v_section TO vitis_admin;
GRANT SELECT ON TABLE s_vitis.v_section TO vitis_user;
-- Yoann le 15/07/2016 10:52
ALTER TABLE s_vitis.privileges DROP COLUMN type;

-- Frédéric le 15/07/2016 16:21 
CREATE OR REPLACE RULE insert_v_user AS ON INSERT TO s_vitis.v_user DO INSTEAD  INSERT INTO s_vitis."user" (user_id, login, domain_id, name, email, company, department, ip_constraint, restriction) VALUES (new.user_id, new.login, new.domain_id, new.name, new.email, new.company, new.department, new.ip_constraint, new.restriction);
CREATE OR REPLACE RULE update_v_user AS ON UPDATE TO s_vitis.v_user DO INSTEAD  UPDATE s_vitis."user" SET name = new.name, email = new.email, company = new.company, department = new.department, ip_constraint = new.ip_constraint, restriction = new.restriction WHERE "user".user_id = new.user_id;
-- Yoann le 26/07/2016 16:52
ALTER TABLE ONLY s_vitis.version    ADD CONSTRAINT pk_version PRIMARY KEY (version);
-- Armand le 01/09/2016 10:16
ALTER TABLE s_vitis.business_object ADD COLUMN search_field character varying(50);
ALTER TABLE s_vitis.business_object ADD COLUMN result_field character varying(50);
-- Armand le 01/09/2016 10:55
ALTER TABLE s_vitis.business_object ADD COLUMN search_use_strict character varying(30);
-- Armand le 01/09/2016 08:55
ALTER TABLE s_vitis.business_object DROP COLUMN "version" CASCADE, DROP COLUMN "last_update_date" CASCADE, DROP COLUMN "last_update_author" CASCADE;

-- Frédéric le 02/09/2016 09:39
UPDATE s_vitis.privileges SET description=E'rôle utilisateur de vitis\n\nPermet de se connecter à l''application' WHERE rolname='vitis_user';
UPDATE s_vitis.privileges SET description=E'rôle administrateur de vitis\n\nPermet d''accéder aux modes :\n     - Utilisateur\n     - Utilisateurs\n     - Configuration\n     - Logs' WHERE rolname='vitis_admin';

-- Frédéric le 11/10/2016 15:46
UPDATE s_vitis.vm_table_field SET template = '<div data-app-format-date-column="{{row.entity[col.field]}}"></div>' WHERE label_id LIKE 'vitis_%' AND name = 'last_connection';

-- Frédéric le 12/10/2016 09:37
GRANT UPDATE ON TABLE s_vitis.v_user TO vitis_user;