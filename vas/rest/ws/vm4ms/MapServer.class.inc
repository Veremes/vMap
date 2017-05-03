<?php

/**
 * \file MapServer.class.inc
 * \class MapServer
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the MapServer php class
 *
 * This class defines Rest Api to Vmap4MapServer MapServer
 * 
 */
require_once 'Vmap4MapServer.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

class MapServer extends Vmap4MapServer {
    /**
     * @SWG\Definition(
     *   definition="/mapserver",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/mapserver")
     *   }
     * )
     * * @SWG\Tag(
     *   name="MapServer",
     *   description=""
     * )
     */

    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     */
    function __construct($aPath, $aValues, $properties) {
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
        $this->oConnection = new Connection($this->aValues, $this->aProperties);
    }

    /**
     * @SWG\Get(path="/mapserver/Symbols",
     *   tags={"MapServer"},
     *   summary="Get mapserver symbols",
     *   description="Request to get the symbols of MapServer",
     *   operationId="GET",
     *   produces={"application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/mapserver")
     *     )
     *  )
     */
    /**
     * @SWG\Get(path="/mapserver/Fonts",
     *   tags={"MapServer"},
     *   summary="Get mapserver fonts",
     *   description="Request to get the fonts of MapServer",
     *   operationId="GET",
     *   produces={"application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/mapserver")
     *     )
     *  )
     */

    /**
     * get MapServer
     * @return  MapServer
     */
    function GET() {
        if (!empty($this->aPath[2])) {
            if (!in_array('vm4ms_admin', $this->oConnection->aPrivileges)) {
                $oError = new VitisError(0, 'INSUFFICIENT_PRIVILEGES');
                $aXmlRacineAttribute['status'] = 0;
                $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                return $sMessage;
            }
            if ($this->aPath[2] == "Symbols")
                $sMessage = $this->getSymbols();
            else if ($this->aPath[2] == "Fonts")
                $sMessage = $this->getFonts();
            return $sMessage;
        }
    }

    /**
     * Retourne les symboles du fichier "symbols.sym".
     */
    function getSymbols() {
        $sMsSymbolsFile = $this->aProperties["map_dir"] . '/symbols/symbols.sym';
        if (file_exists($sMsSymbolsFile)) {
            $aFile = file($sMsSymbolsFile);
            $bSearchName = false;
            $aSymbols = array();
            $sResult = '';
            $i = 1;
            foreach ($aFile as $iLine => $sLine) {
                if (trim($sLine) != 'SYMBOLSET') {
                    if ($bSearchName) {
                        $iNbName = substr_count($sLine, 'name') + substr_count($sLine, 'Name') + substr_count($sLine, 'NAME');
                        if ($iNbName != 0) {
                            //$sAlinea = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                            $sAlinea = '';
                            $sDef .= $sAlinea . $sLine;
                            $bLoop = true;
                            $iLineDef = $iLine + 1;
                            $iNbEndAllowed = 0;
                            $aSymbol['definition'][] = $sLine;
                            while ($bLoop) {
                                $sLineDef = $aFile[$iLineDef];
                                $iNbEnd = substr_count($sLineDef, 'end') + substr_count($sLineDef, 'End') + substr_count($sLineDef, 'END');
                                $iNbPoints = substr_count($sLineDef, 'points') + substr_count($sLineDef, 'Points') + substr_count($sLineDef, 'POINTS');
                                $iNbStyle = substr_count($sLineDef, 'style') + substr_count($sLineDef, 'Style') + substr_count($sLineDef, 'STYLE');
                                if ($iNbEnd == 0) {
                                    $sDef .= $sAlinea . $sLineDef;
                                    if ($iNbPoints != 0 || $iNbStyle != 0) {
                                        $iNbEndAllowed++;
                                        //$sAlinea .= "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                                        $sAlinea .= '';
                                    }
                                } else {
                                    if ($iNbPoints == 0 && $iNbStyle == 0) {
                                        if ($iNbEndAllowed == 0) {
                                            $bLoop = false;
                                            $sAlinea = "";
                                        } else {
                                            $iNbEndAllowed = $iNbEndAllowed - 1;
                                            //$sAlinea = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                                            $sAlinea = '';
                                        }
                                    }
                                    $sDef .= $sAlinea . $sLineDef;
                                }
                                $aSymbol['definition'][] = $sLineDef;
                                $iLineDef++;
                            }
                            $sLine = str_replace(array('name', 'Name', 'NAME'), "", $sLine);
                            $sLine = ltrim(rtrim($sLine));
                            if ($sLine{0} == "'" || $sLine{0} == '"') {
                                $sLine = substr($sLine, 1);
                            }
                            if ($sLine{strlen($sLine) - 1} == "'" || $sLine{strlen($sLine) - 1} == '"') {
                                $sLine = substr($sLine, 0, strlen($sLine) - 1);
                            }
                            //$sResult .= "<tr><td>- <a href='javascript:getDefSymbol(\"".$sLine."\")' title='Afficher la définition' style='color: black; font-size: 10pt; font-weight: bold;'>".$sLine."</a><div id='".$sLine."' class='attribute2' style='display:none;'>".$sDef."</div></td></tr>";
                            $sResult .= $sDef;
                            $bSearchName = false;
                            $sDef = "";
                            $aSymbol['name'] = $sLine;
                            $aSymbol['id'] = 'symbol_' . $i++;
                            $aSymbols[] = $aSymbol;
                        }
                    } else {
                        $aSymbol = array();
                        $aSymbol['definition'][] = 'SYMBOL';
                        $iNbSymbol = substr_count($sLine, 'symbol') + substr_count($sLine, 'Symbol') + substr_count($sLine, 'SYMBOL');
                        if ($iNbSymbol != 0) {
                            $bSearchName = true;
                            $sDef = $sLine;
                        }
                    }
                }
            }
            $this->aObjects[0]->aFields['symbols_content'] = $aSymbols;
        }
        $aXmlRacineAttribute['status'] = 1;
        $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        return $sMessage;
    }

    /**
     * Retourne les polices du fichier "fonts.list".
     */
    function getFonts() {
        $sMsFontsFile = $this->aProperties["map_dir"] . '/fonts/fonts.list';
        if (file_exists($sMsFontsFile)) {
            $sFontsContent = strtolower(file_get_contents($sMsFontsFile));
            $sFontsContent = str_replace(PHP_EOL, '|', $sFontsContent);
            $aFonts = explode('|', $sFontsContent);
            $aFilteredFonts = array();
            foreach ($aFonts as $sFont) {
                $sFont = preg_replace('/\s+/', ' ', $sFont);
                $aFont = explode(' ', $sFont, 2);
                $aFilteredFonts[] = array('name' => trim($aFont[0]), 'filename' => $aFont[1]);
            }
            $this->aObjects[0]->aFields['fonts'] = $aFilteredFonts;
        }
        $aXmlRacineAttribute['status'] = 1;
        $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        return $sMessage;
    }

}

?>