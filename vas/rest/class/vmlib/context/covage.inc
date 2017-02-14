<?php

// Corps du message
$properties['businessobject.bo_id']['value'] = $this->aObjects["oBusinessObject"]->get('bo_id');
$properties['businessobject.bo_id']['fr'] = "Corps du message";
$properties['businessobject.bo_id']['en'] = "Corps du message";

// Nom du demandeur
$properties['businessobject.user.name']['value'] = $this->aObjects["oBusinessObject"]->getUser('admin_framework')->aFields['name'];
$properties['businessobject.user.name']['fr'] = "Nom du demandeur";
$properties['businessobject.user.name']['en'] = "Nom du demandeur";
?>