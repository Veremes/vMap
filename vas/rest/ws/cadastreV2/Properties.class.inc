<?php

require_once __DIR__ . '/../vitis/Vitis.class.inc';
/**
* \file properties.class.inc
* \class Properties
*
* \author Armand Bahi <armand.bahi@veremes.com>.
*
*	\brief This file contains the Properties php class
*
* This class defines the rest api for properties
* 
*/
class Properties  extends Vitis{
    
     /**
     * @SWG\Definition(
     *   definition="/properties",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/properties")
     *   }
     * )
     * * @SWG\Tag(
     *   name="Properties",
     *   description="Operations about Properties"
     * )
     */
    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     */
    function properties($aPath, $aValues, $properties){
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = (object)$properties;
    }
      /**
     * @SWG\Get(path="/properties", 
     *   tags={"Properties"},
     *   summary="Get the cadastre properties",
     *   description="Request to get properties",
     *   operationId="GET",
     *   produces={"application/json", "application/x-vm-json"},
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/properties")
     *     )
     *  )
     */
    /**
     * 
     * @return properties
     */
    function GET(){
        
        $this->aFields['data'] = $this->aProperties->cadastre;
        $aXmlRacineAttribute['status']=1;
        $sMessage = $this->asDocument('','vitis',$this->aValues['sEncoding'],True,$aXmlRacineAttribute,$this->aValues['sSourceEncoding'],$this->aValues['output']);
				
        return $sMessage;
    }
    
}
 
?>