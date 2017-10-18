<?php
    // Test d'un flux WMS.
    $aSql['pgsql']['getWmsServiceDef'] = 'SELECT definition, web_id, msdebuglevel_id FROM '.$this->aProperties['schema_vm4ms'].'.wmsservice WHERE "wmsservice_id"=[sWmsServiceId]';
    $aSql['pgsql']['getObjDef'] = 'SELECT * FROM '.$this->aProperties['schema_vm4ms'].'.[sSqlTableName] WHERE [sObjName]_id=[iObjId]';
    $aSql['pgsql']['getWmsServiceLayersDef'] = 'SELECT wmsservice_ms_layer.wmsservice_id, wmsservice_ms_layer.ms_layer_id, ms_layer.name, ms_layer.opacity, coordsys.definition AS coordsys_def, ms_layer.ms_layertype_id FROM '.$this->aProperties['schema_vm4ms'].'.wmsservice_ms_layer LEFT JOIN '.$this->aProperties['schema_vm4ms'].'.ms_layer ON ms_layer.ms_layer_id::text = wmsservice_ms_layer.ms_layer_id::text LEFT JOIN '.$this->aProperties['schema_vm4ms'].'.connection ON connection.connection_id = ms_layer.connection_id LEFT JOIN '.$this->aProperties['schema_vm4ms'].'.coordsys ON coordsys.coordsys_id = ms_layer.coordsys_id WHERE "wmsservice_id"=[sWmsServiceId] AND ms_layer.active = true';
    $aSql['pgsql']['getLayerDef']='SELECT name, "coordsys_id", "connection_id", "opacity", "tableidfield", "tablename", "tableschema", title, metadata_id FROM '.$this->aProperties['schema_vm4ms'].'.ms_layer WHERE "ms_layer_id" = [ms_layer_id]';
    $aSql['pgsql']['getCoordsysDef']='SELECT "definition", "coordsys_id" as "srid" FROM '.$this->aProperties['schema_vm4ms'].'.coordsys WHERE "coordsys_id"=[iCoordsysId]';
    $aSql['pgsql']['getPrivateWmsServiceLayersDef'] = 'SELECT v_private_ms_layer.ms_layer_id, v_private_ms_layer.name, v_private_ms_layer.opacity, coordsys.definition AS coordsys_def, v_private_ms_layer.ms_layertype_id FROM '.$this->aProperties['schema_vm4ms'].'.v_private_ms_layer LEFT JOIN '.$this->aProperties['schema_vm4ms'].'.connection ON connection.connection_id = v_private_ms_layer.connection_id LEFT JOIN '.$this->aProperties['schema_vm4ms'].'.coordsys ON coordsys.coordsys_id = v_private_ms_layer.coordsys_id WHERE v_private_ms_layer.active = true';
    
    // Test d'une couche.
    $aSql['pgsql']['getLayerInfoToTest']='SELECT ms_layer.*, coordsys.definition AS coordsys_definition, coordsys.coordsys_id as srid, connection.connection_id,(SELECT COUNT(*) FROM s_vm4ms.wmsservice_ms_layer WHERE wmsservice_id = [sWmsServiceId] AND ms_layer_id = [iLayerToTest]) AS nb_layer_to_test FROM ' . $this->aProperties['schema_vm4ms'] . '.ms_layer LEFT JOIN ' . $this->aProperties['schema_vm4ms'] . '.coordsys ON coordsys.coordsys_id = ms_layer.coordsys_id LEFT JOIN ' . $this->aProperties['schema_vm4ms'] . '.connection ON connection.connection_id = ms_layer.connection_id WHERE ms_layer_id = [iLayerToTest]';
    
    // Définition d'une connexion.
    $aSql['pgsql']['getConnection']='SELECT * FROM '.$this->aProperties['schema_vm4ms'].'.connection WHERE connection_id = [iConnectionId]';
    
    // Génération fichiers de proj
    $aSql['pgsql']['getCoordsys']='SELECT * FROM "[sSchema]".coordsys';
    
    // Définition d'une métadonnée.
    $aSql['pgsql']['getMetadata']='SELECT * FROM '.$this->aProperties['schema_vm4ms'].'.metadata WHERE metadata_id = [iMetadataId]';
?>