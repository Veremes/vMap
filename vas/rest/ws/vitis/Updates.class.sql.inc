<?php
        $aSql["pgsql"]["getModules"] = 'SELECT module_id, version FROM [sSchemaFramework].vm_module';
        $aSql["pgsql"]["verif_maj"] = "SELECT name FROM [sSchemaFramework].update WHERE name = '[sMajName]'";
        $aSql["pgsql"]["delete_correct"] = "DELETE FROM [sSchemaFramework].update WHERE \"from\" = '[from_correct]' AND \"to\" like '[name_correct]%' AND update_status_id = 1";
        $aSql["pgsql"]["delete_maj"] = "DELETE FROM [sSchemaFramework].update WHERE update_status_id = 1";
        $aSql["pgsql"]["insert_maj"] = "INSERT INTO [sSchemaFramework].update(name, \"from\", \"to\", publishing_date, update_status_id, module_id, vitis_version) VALUES ('[sMajName]','[de_version_maj]','[vers_version_maj]', '[publishing_date_maj]', '[status_maj]', '[sModule]', '[vitis_version]')";
?>   