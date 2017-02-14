<?php

/*
 * stringUtil.inc : fonctions sur les cha�nes de caract�res
 */

function addDelimitedAttribute($sMain, $sAdded, $sDelim, $sProtectField) {
    // renvoie  la concat�nation des cha�nes $main et $added en ajoutant le d�limiteur $sDelim
    if ($sMain == "")
        $sMain = $sProtectField . $sAdded . $sProtectField;
    else
        $sMain .= $sDelim . $sProtectField . $sAdded . $sProtectField;
    return $sMain;
}

function addDelimitedString($sMain, $sAdded, $sDelim) {
    // renvoie  la concat�nation des cha�nes $main et $added en ajoutant le d�limiteur $sDelim
    if ($sMain == "")
        $sMain = $sAdded;
    else
        $sMain .= $sDelim . $sAdded;
    return $sMain;
}

// Convertit une chaine geometrique type veremes (x@y x@y) en wkt
function vm2wkt($sGeom, $sType) {

    switch ($sType) {

        case 'point' :
            $aPointCoord = array();
            $aPointCoord = split("@", $sGeom);
            $sWkt = "POINT (";

            $aPointCoordxy[0]["x"] = $aPointCoord[0];
            $aPointCoordxy[0]["y"] = $aPointCoord[1];

            $sWkt = $sWkt . $aPointCoordxy[0]["x"] . " " . $aPointCoordxy[0]["y"] . ")";

            break;

        case 'line' :
            $aLineCoord = array();
            $aPoint = array();
            $aLineCoord = split(" ", $sGeom);

            $sWkt = "LINESTRING (";
            $i = 0;

            while ($aLineCoord[$i]) {
                $aPoint = split("@", $aLineCoord[$i]);
                $aLineCoordxy[$i]["x"] = $aPoint[0];
                $aLineCoordxy[$i]["y"] = $aPoint[1];
                $i++;
            }

            $i = 0;
            while ($aLineCoordxy[$i]) {
                $sWkt = $sWkt . $aLineCoordxy[$i]["x"] . " " . $aLineCoordxy[$i]["y"] . ",";
                $i++;
            }
            $sWkt = rtrim($sWkt, ',');
            $sWkt = $sWkt . ")";
            break;

        case 'polygon':

            $sWkt = "POLYGON ((";
            $aShapeCoord = array();
            $aShapeCoord = split(" ", $aRequest["mf_selectShape"]);

            $i = 0;
            while ($aShapeCoord[$i]) {
                $aPoint = split("@", $aShapeCoord[$i]);
                $aShapeCoordxy[$i]["x"] = $aPoint[0];
                $aShapeCoordxy[$i]["y"] = $aPoint[1];
                $i++;
            }

            $i = 0;
            while ($aShapeCoord[$i]) {
                $sWkt = $sWkt . $aShapeCoordxy[$i]["x"] . " " . $aShapeCoordxy[$i]["y"] . ",";
                $i++;
            }
            $sWkt = rtrim($sWkt, ',');
            $sWkt = $sWkt . "))";

            break;
    }
    return $sWkt;
}

function wkt2vm($sWkt) {

    $sWkt = ltrim($sWkt, 'POLYGON(');
    $sWkt = rtrim($sWkt, ')');
    $sWkt = str_replace(" ", "@", $sWkt);
    $sWkt = str_replace(",", " ", $sWkt);

    return $sWkt;
}

/*
 *  Fonction qui permet de prendre une chaine de caractere
 *  De la d�couper selon un d�limiter choisi en permettant de mettre des caract�res de protections
 */

function stringExplode($sValue, $cDelimiter, $cProtectDeb, $cProtectFin) {
    $iArray = 0;
    $iChar = 0;
    $iLength = strlen($sValue);
    $aPart = array();
    while ($iChar < $iLength) {
        if ($sValue[$iChar] == $cDelimiter) {
            $iArray++;
            $iChar++;
        } else {  // Caract�re diff�rent de $cDelimiter
            if ($sValue[$iChar] == $cProtectDeb) {  // Le caract�re est �gal � $cProtectDeb
                $aPart[$iArray].=$sValue[$iChar];
                $iChar++;
                while ($sValue[$iChar] != $cProtectFin) {  // On boucle jusqu'� la trouver $cProtectFin
                    $aPart[$iArray].=$sValue[$iChar];
                    $iChar++;
                }
            }
            $aPart[$iArray].=$sValue[$iChar];
            $iChar++;
        }
    } //while
    return $aPart;
}

/*
 * Fonction qui normalise une chaine de caract�re
 * En remplacant tout les caract�res sp�ciaux par des _
 */

function normalizeString($sString) {

    $sString = str_replace(" ", "_", $sString);
    $sString = str_replace(":", "_", $sString);
    $sString = str_replace("/", "_", $sString);
    $sString = str_replace("\\", "_", $sString);
    $sString = str_replace("*", "_", $sString);

    return $sString;
}

?>