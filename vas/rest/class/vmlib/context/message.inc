<?php

// Corps du message
$properties['message.email_body']['value'] = $this->aObjects["oMessage"]->getBody('email_body');
$properties['message.email_body']['fr'] = "Corps du message";
$properties['message.email_body']['en'] = "Corps du message";

// Id de la demande
$properties['message.order_id']['value'] = $this->aObjects["oMessage"]->getBody('order_id');
$properties['message.order_id']['fr'] = "Id de la demande";
$properties['message.order_id']['en'] = "Order Id";
?>