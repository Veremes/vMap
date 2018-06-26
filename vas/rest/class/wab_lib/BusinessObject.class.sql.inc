<?php
    $aSQL["getStatusId"] = 'SELECT * FROM [SCHEMA].rt_[TABLE]_status WHERE name = [STATUS_NAME];';
    $aSQL["updateStatus"] = 'UPDATE [SCHEMA].[TABLE] SET status_id=[STATUS_ID] WHERE [TABLE].[BOIDFIELD]=[BOID];';
    $aSQL["getStatusName"] = 'SELECT name FROM [SCHEMA].rt_[TABLE]_status WHERE status_id = (SELECT status_id FROM [SCHEMA].[TABLE] WHERE [TABLE].[BOIDFIELD]=[BOID])';
?>