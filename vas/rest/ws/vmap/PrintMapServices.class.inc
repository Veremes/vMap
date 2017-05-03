<?php

require_once 'PrintServices.class.inc';
require_once __DIR__ . '/../vitis/Vitis.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

/**
 * \file printmapservices.class.inc
 * \class PrintMapServices
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 *  \brief This file contains the PrintMapServices php class
 *
 * This class defines the rest api for printmapservices
 * 
 */
class PrintMapServices extends PrintServices {
    /**
     * @SWG\Definition(
     *   definition="/printmapservices",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/printmapservices")
     *   }
     * )
     * * @SWG\Tag(
     *   name="printmapservices",
     *   description="Operations about printmapservices"
     * )
     */

    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     * @param type $oConnection connection object
     */
    function __construct($aPath, $aValues, $properties) {
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
//        $this->oConnection = new Connection($this->aValues, $this->aProperties);
    }

    /**
     * @SWG\Post(path="/printmapservices",
     *   tags={"PrintServices"},
     *   summary="Creates a map print",
     *   description="Creates a map print",
     *   operationId="POST",
     *   produces={"application/json"},
     * @SWG\Parameter(
     *     name="token",
     *     in="formData",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="map_id",
     *     in="formData",
     *     description="map to print out, not required if passed map_json",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="map_json",
     *     in="formData",
     *     description="map to print out",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="image_size",
     *     in="formData",
     *     description="image resolution splited by |",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="resolution_coeff",
     *     in="formData",
     *     description="image size multiplicator",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="extent",
     *     in="formData",
     *     description="map extent, not required if passed features splited by |",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="features",
     *     in="formData",
     *     description="Array of EWKT features to add splited by |",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="features_zoom",
     *     in="formData",
     *     description="percentage of zooming",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="resolution_coeff",
     *     in="formData",
     *     description="size multiplicator",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="quality",
     *     in="formData",
     *     description="image quality",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="PrintMapServices Response",
     *         @SWG\Schema(ref="#/definitions/printmapservices")
     *     )
     *  )
     */
    function POST() {

        $aReturn = Array();

        // Vérification des valeurs
        if (empty($this->aValues['map_id']) && empty($this->aValues['map_json'])) {
            $aReturn['error']['errorMessage'] .= " neither map_id nor map_json defined";
            return json_encode($aReturn);
        }
        if (empty($this->aValues['extent']) && empty($this->aValues['features'])) {
            $aReturn['error']['errorMessage'] .= " neither extent not features defined";
            return json_encode($aReturn);
        }
        if (empty($this->aValues['image_size'])) {
            $aReturn['error']['errorMessage'] .= " image_size not defined";
            return json_encode($aReturn);
        }

        /**
         * Files to delete after print
         */
        $this->aFilesToDelete = array();

        /**
         * The image name
         */
        $sTimestamp = date("YmdHis", time());

        /**
         * Map id
         */
        $sMapId = $this->aValues['map_id'];

        /**
         * Map id
         */
        $sMapJSON = $this->aValues['map_json'];

        /**
         * API URL
         */
        $RestUrl = $this->aProperties['web_server_name'] . '/' . $this->aProperties['services_alias'];

        /**
         * Token to use
         */
        $sToken = $this->aValues['token'];

        /**
         * Map extent
         */
        $sExtent = $this->aValues['extent'];

        /**
         * Image size
         */
        $sImageSize = $this->aValues['image_size'];

        /**
         * Map features
         */
        $sFeatures = $this->aValues['features'];

        /**
         * Map features zoom
         */
        $sFeaturesZoom = $this->aValues['features_zoom'];

        /**
         * Map features zoom
         */
        $sResolutionCoeff = $this->aValues['resolution_coeff'];

        /**
         * Image quality
         */
        $sQuality = $this->aProperties['print']['quality'];

        /**
         * Path to the PhantomJS .exe
         */
        $sPhantomjsPath = $this->aProperties['phantomjs_root_path'];

        /**
         * Path to the .js
         */
        $sProjectPath = $this->aProperties['vas_home'] . '/util/printserver/server/printmap.js';

        /**
         * Path to the client
         */
        $sPrintClientrUrl = $this->aProperties['web_server_name'] . '/' . $this->aProperties['printserver_alias'] . '/client/map/index.html';

        /**
         * Path to the output file
         */
        $sOutputFile = $this->aProperties['vas_home'] . '/public/vmap/prints/print_map_' . $sTimestamp . '.jpeg';

        /**
         * The image URL
         */
        $sImageUrl = $this->aProperties['web_server_name'] . '/' . $this->aProperties['public_alias'] . '/vmap/prints/print_map_' . $sTimestamp . '.jpeg';

        // Change la taille de l'image en fonction de la résolution
        if (isset($this->aValues['resolution_coeff'])) {
            $aImageSize = explode('|', $sImageSize);
            $aImageSize[0] = $aImageSize[0] * $this->aValues['resolution_coeff'];
            $aImageSize[1] = $aImageSize[1] * $this->aValues['resolution_coeff'];
            $sImageSize = implode('|', $aImageSize);
        }

        // Écrit les paramètres gros dans des fichiers
        if (is_dir($this->aProperties['vas_home'])) {
            if (!is_dir($this->aProperties['vas_home'] . '/public')) {
                mkdir($this->aProperties['vas_home'] . '/public', 0777, true);
            }
            if (!is_dir($this->aProperties['vas_home'] . '/public/vmap')) {
                mkdir($this->aProperties['vas_home'] . '/public/vmap', 0777, true);
            }
            if (!is_dir($this->aProperties['vas_home'] . '/public/vmap/prints')) {
                mkdir($this->aProperties['vas_home'] . '/public/vmap/prints', 0777, true);
            }
        }
        $sMapJSONPath = $this->writeToFile($this->aProperties['vas_home'] . '/public/vmap/prints', 'map_json_' . $sTimestamp, $sMapJSON);
        $sFeaturesPath = $this->writeToFile($this->aProperties['vas_home'] . '/public/vmap/prints', 'features_' . $sTimestamp, $sFeatures);

        // Arguments de la ligne de commande
        $aArguments = array($sProjectPath, $sPrintClientrUrl, $RestUrl, $sToken, $sOutputFile, $sMapId, $sMapJSONPath, $sImageSize, $sExtent, $sFeaturesPath, $sFeaturesZoom, $this->aValues['resolution_coeff'], $sQuality);

        // Commande à lancer
        $sCommand = '"' . $sPhantomjsPath . '" --ignore-ssl-errors=yes --ssl-protocol=any';

        // Ajoute les argumants à a commande
        for ($i = 0; $i < count($aArguments); $i++) {
            $sCommand .= ' "' . $aArguments[$i] . '"';
        }

        // Ferme la session php (pour que phantomJS puisse faire des requetes Ajax avec ce token)
        session_write_close();

        $aCommand = array();
        exec($sCommand, $aCommand);

        $sScale = $this->getMapScale($aCommand);

        $aReturn['printmapservices']['image'] = $sImageUrl;
        $aReturn['printmapservices']['imagePath'] = $sOutputFile;
        $aReturn['printmapservices']['command'] = $sCommand;
        $aReturn['printmapservices']['logs'] = $aCommand;
        $aReturn['printmapservices']['scale'] = $sScale !== null ? $sScale : null;
        $aReturn['printmapservices']['result'] = $aCommand[count($aCommand) - 1];
        $aReturn['status'] = $aReturn['printmapservices']['result'] === "Done" ? 1 : 0;

        // Supprime les fichiers générés pendant l'impression
        $this->deleteFiles($this->aFilesToDelete);

        return json_encode($aReturn);
    }

    /**
     * Get the map scale
     * @param array $aCommand
     * @return string
     */
    function getMapScale($aCommand) {

        $sScale = null;

        for ($i = 0; $i < count($aCommand); $i++) {
            if (strlen($aCommand[$i]) > 5) {
                if (substr($aCommand[$i], 0, 5) === 'scale') {
                    $sScale = substr($aCommand[$i], 6);
                }
            }
        }

        return $sScale;
    }

}

?>