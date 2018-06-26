<?php

$aMail["newUserTitle"] = "Un nouvel utilisateur vient juste de s\'inscrire";
$aMail["newUserTitleAutomated"] = "Vérification de votre adresse mail";
$aMail["newUserBody"] = '<!-- 1 Column Text + Button : BEGIN -->
    <tr>
        <td bgcolor="#ffffff" style="padding: 0px; text-align: center;background-color:#8c8c8c; height:50px; margin-bottom:10px;">
            <h1 style="margin: 0; font-family: sans-serif; font-size: 24px; line-height: 27px; color: #FFFFFF; font-weight: normal;">[TITLE]</h1>
        </td>
    </tr>
    <tr>
        <td bgcolor="#ffffff" style="padding: 10px 20px; font-family: sans-serif; font-size: 15px; line-height: 20px; color: #000000; text-align: center;">
            <p style="width:100%; font-weight:bold; text-align: justify; font-size: 20px;">Bonjour [FULLNAME],</p>
            <p style="width:100%; text-align: left;font-size: 18px;">Nous vous remercions d\'avoir créé votre compte sur <b>[HOSTNAME]</b>.</p>
            <p style="width:100%; text-align: left;font-size: 18px;"><b>Informations sur votre compte :</b></p>
            <p style="width:100%; text-align: left;font-size: 18px;">Identifiant : [LOGIN]</p>
            <p style="width:100%; text-align: left;font-size: 18px;">Mail : [MAIL]</p>
            <p style="width:100%; text-align: left;font-size: 18px;">Organisme : [COMPANY] </p>
            <p style="width:100%; text-align: left;font-size: 18px;margin-top: 20px;">Cliquez sur le bouton ci-dessous pour finaliser votre inscription :</p>
        </td>
    </tr>
    <tr>
        <td bgcolor="#ffffff" style="padding: 10px 20px; font-family: sans-serif; font-size: 20px; line-height: 20px; color: #555555;">
            <table role="presentation" aria-hidden="true" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: auto">
                <tr>
                    <td style="border-radius: 3px; background: #5cb85c; text-align: center;" class="button-td">
                        <a href="[URL]" style="background: #5cb85c; border: 15px solid #5cb85c; font-family: sans-serif; font-size: 18px; line-height: 1.1; text-align: center; text-decoration: none; display: block; border-radius: 0px; font-weight: bold;" class="button-a">
                            &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#ffffff;">Je confirme mon adresse mail</span>&nbsp;&nbsp;&nbsp;&nbsp;
                        </a>
                    </td>
                </tr>
            </table>
            <!-- Button : END -->
        </td>
    </tr>
    <tr>
        <td bgcolor="#ffffff" style="padding: 10px 20px; font-family: sans-serif; line-height: 20px; color: #000000; text-align: center;">
            <p style="width:100%; text-align: justify;font-size: 18px;">Si vous ne vous êtes pas inscrit(e) sur notre application <b>[HOSTNAME]</b>, ignorez simplement ce message.</p>
        </td>
    </tr>
    <!-- 1 Column Text + Button : END -->';

$aMail["confirmationSignUpTitle"] = "Confirmation d'inscription";
$aMail["genericBody"] = '
            <tr>
                <td bgcolor="#ffffff" style="padding: 40px 40px 20px; text-align: center;">
                    <h1 style="margin: 0; font-family: sans-serif; font-size: 24px; line-height: 27px; color: #333333; font-weight: normal;">[MESSAGE]</h1>
                </td>
            </tr>';

$aMail["SignUpOk"] = '<tr>
                <td bgcolor="#ffffff" style="padding: 40px 40px 20px; text-align: center;">
                    <h1 style="margin: 0; font-family: sans-serif; font-size: 24px; line-height: 27px; color: #333333; font-weight: normal;">L\'utilisateur a été ajouté, connectez vous sur la base de données pour lui donner des droits (Defaut: [ROLES])</h1>
                </td>
            </tr>';
$aMail["SignUpError"] = '<tr>
                <td bgcolor="#ffffff" style="padding: 40px 40px 20px; text-align: center;">
                    <h1 style="margin: 0; font-family: sans-serif; font-size: 24px; line-height: 27px; color: #333333; font-weight: normal;">L\'utilisateur n\'a pas pu être ajouté consultez les fichiers de log pour plus d\'informations</h1>
                </td>
            </tr>';

$aMail["signUpConfirmation"] = '<tr>
                <td bgcolor="#ffffff" style="padding: 40px 40px 20px; text-align: center;">
                    <h1 style="margin: 0; font-family: sans-serif; font-size: 24px; line-height: 27px; color: #333333; font-weight: normal; margin-bottom: 15px;">Votre compte est maintenant activé, vous pouvez vous connecter. Pour avoir accès à plus de fonctionnalités contactez l\'administrateur</h1>
                    <a style="margin: 0; font-family: sans-serif; font-size: 22px; font-weight: normal;" href="[REDIRECTION]"> Retourner vers l\'application </a>
                </td>
            </tr>';
$aMail["fpwdTitle"] = "Changez votre mot de passe";
$aMail["fpwdUpdateOk"] = '<tr>
                <td bgcolor="#ffffff" style="padding: 40px 40px 20px; text-align: center;">
                    <h1 style="margin: 0; font-family: sans-serif; font-size: 24px; line-height: 27px; color: #333333; font-weight: normal;">Le mot de passe a été mis à jour</h1>
                </td>
            </tr>';
$aMail["fpwdUpdateError"] = '<tr>
                <td bgcolor="#ffffff" style="padding: 40px 40px 20px; text-align: center;">
                    <h1 style="margin: 0; font-family: sans-serif; font-size: 24px; line-height: 27px; color: #333333; font-weight: normal;">Le mot de passe n\'a pas pu être mis à jour</h1>
                </td>
            </tr>';
$aMail["alreadyUpdate"] = '<tr>
                <td bgcolor="#ffffff" style="padding: 40px 40px 20px; text-align: center;">
                    <h1 style="margin: 0; font-family: sans-serif; font-size: 24px; line-height: 27px; color: #333333; font-weight: normal;">Le mot de passe à déjà été changé</h1>
                </td>
            </tr>';

$aMail["fpwdBody"] = '<!-- 1 Column Text + Button : BEGIN -->
            <tr>
                <td bgcolor="#ffffff" style="padding: 0px; text-align: center;background-color:#8c8c8c; height:50px; margin-bottom:10px;">
                    <h1 style="margin: 0; font-family: sans-serif; font-size: 24px; line-height: 27px; color: #FFFFFF; font-weight: normal;">Changez votre mot de passe</h1>
                </td>
            </tr>
            <tr>
                <td bgcolor="#ffffff" style="padding: 10px 20px; font-family: sans-serif; font-size: 15px; line-height: 20px; color: #000000; text-align: center;">
                    <p style="width:100%; font-weight:bold; text-align: left; font-size: 20px;">Bonjour [LOGIN],</p>
                    <p style="width:100%; text-align: left;font-size: 18px;">Une tentative de récupération de votre compte à été effectué sur le site <b>[HOSTNAME]</b>.</p>
                    <p style="width:100%; text-align: left;font-size: 18px;margin-top: 10px;">Cliquez sur le bouton ci-dessous pour changer votre mot de passe :</p>
                </td>
            </tr>
            <tr>
                <td bgcolor="#ffffff" style="padding: 10px 20px; font-family: sans-serif; font-size: 15px; line-height: 20px; color: #555555;">
                    <table role="presentation" aria-hidden="true" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: auto">
                        <tr>
                            <td style="border-radius: 3px; background: #5cb85c; text-align: center;" class="button-td">
                                <a href="[URL]" style="background: #5cb85c; border: 15px solid #5cb85c; font-family: sans-serif; font-size: 18px; line-height: 1.1; text-align: center; text-decoration: none; display: block; border-radius: 0px; font-weight: bold;" class="button-a">
                                    &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#ffffff;">Changer mon mot de passe</span>&nbsp;&nbsp;&nbsp;&nbsp;
                                </a>
                            </td>
                        </tr>
                    </table>
                    <!-- Button : END -->
                </td>
            </tr>
            <tr>
                <td bgcolor="#ffffff" style="padding: 10px 20px; font-family: sans-serif; line-height: 20px; color: #000000; text-align: center;">
                    <p style="width:100%; text-align: justify;font-size: 18px;">Si vous n\'avez pas perdu votre mot de passe pour vous connecter à notre application <b>[HOSTNAME]</b>, ignorez simplement ce message.</p>
                </td>
            </tr>
            <!-- 1 Column Text + Button : END -->';

$aMail["fpwdForm"] = '<!-- 1 Column Text + Button : BEGIN -->
            <tr>
                <td bgcolor="#ffffff" style="padding: 0px; text-align: center;background-color:#8c8c8c; height:50px; margin-bottom:10px;">
                    <h1 style="margin: 0; font-family: sans-serif; font-size: 24px; line-height: 27px; color: #FFFFFF; font-weight: normal;">Saisissez votre nouveau mot de passe</h1>
                </td>
            </tr>
            <tr>
                <td bgcolor="#ffffff" style="padding: 20px 40px 40px; font-family: sans-serif; font-size: 15px; line-height: 20px; color: #555555; text-align: center;">
                    <form action="[URL]" method="PUT" style="text-align:-webkit-right;">
                        <div style="text-align:left;">
                            <label for="password" style="font-weight: bold;">Nouveau mot de passe</label>
                            <input type="password" id="password" name="password" class="input-text-control" required/>
                        </div>
                        <div style="text-align:left;margin-top:10px;">
                            <label for="password_confirm" style="font-weight: bold;">Confirmer votre nouveau mot de passe</label>
                            <input type="password" id="password_confirm" name="password_confirm" class="input-text-control" required/>
                        </div>
                        <div style="margin-top:20px;">
                            <input type="hidden" name="token" value="[TOKEN]"/>
                            <input type="hidden" name="output" value="text/html"/>
                            <button style="background: #5cb85c; border: 15px solid #5cb85c; font-family: sans-serif; font-size: 15px; line-height: 1.1; text-align: center; text-decoration: none; display: block; border-radius: 0px; font-weight: bold;" class="button-a" type="submit"><span style="color:#ffffff;">Envoi</span></button>
                        </div>
                    </form>
                </td>
            </tr>';

$aMail["passwordScript"] = '<script>
    var password = document.getElementById("password"), confirm_password = document.getElementById("password_confirm");

        function validatePassword(){
          if(password.value != confirm_password.value) {
            confirm_password.setCustomValidity("Les deux mots de passe doivent être identique");
          } else {
            confirm_password.setCustomValidity(\'\');
          }
        }

        password.onchange = validatePassword;
        confirm_password.onkeyup = validatePassword;
    </script>';

$aMail["mainBody"] = '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"> <!-- utf-8 works for most cases -->
    <meta name="viewport" content="width=device-width"> <!-- Forcing initial-scale shouldn\'t be necessary -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->
    <meta name="x-apple-disable-message-reformatting">  <!-- Disable auto-scale in iOS 10 Mail entirely -->
    <title>VAM</title> <!-- The title tag shows in email notifications, like Android 4.4. -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <!-- Web Font / @font-face : BEGIN -->
    <!-- NOTE: If web fonts are not required, lines 10 - 27 can be safely removed. -->

    <!-- Desktop Outlook chokes on web font references and defaults to Times New Roman, so we force a safe fallback font. -->
    <!--[if mso]>
        <style>
            * {
                font-family: sans-serif !important;
            }
        </style>
    <![endif]-->

    <!-- All other clients get the webfont reference; some will render the font and others will silently fail to the fallbacks. More on that here: http://stylecampaign.com/blog/2015/02/webfont-support-in-email/ -->
    <!--[if !mso]><!-->
  <!-- insert web font reference, eg: <link href="https://fonts.googleapis.com/css?family=Roboto:400,700" rel="stylesheet" type="text/css"> -->
  <!--<![endif]-->

  <!-- Web Font / @font-face : END -->

  <!-- CSS Reset -->
  <style>

  /* What it does: Remove spaces around the email design added by some email clients. */
  /* Beware: It can remove the padding / margin and add a background color to the compose a reply window. */
  html,
  body {
     margin: 0 auto !important;
     padding: 0 !important;
     height: 100% !important;
     width: 100% !important;
     /*min-width: 600px;*/
 }

 /* What it does: Stops email clients resizing small text. */
 * {
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
}

/* What it does: Centers email on Android 4.4 */
div[style*="margin: 16px 0"] {
    margin:0 !important;
}

/* What it does: Stops Outlook from adding extra spacing to tables. */
table,
td {
    mso-table-lspace: 0pt !important;
    mso-table-rspace: 0pt !important;
}

/* What it does: Fixes webkit padding issue. Fix for Yahoo mail table alignment bug. Applies table-layout to the first 2 tables then removes for anything nested deeper. */
table {
    border-spacing: 0 !important;
    border-collapse: collapse !important;
    table-layout: fixed !important;
    margin: 0 auto !important;
}
table table table {
    table-layout: auto;
}

/* What it does: Uses a better rendering method when resizing images in IE. */
img {
    -ms-interpolation-mode:bicubic;
}

/* What it does: A work-around for iOS meddling in triggered links. */
*[x-apple-data-detectors] {
    color: inherit !important;
    text-decoration: none !important;
}

/* What it does: A work-around for Gmail meddling in triggered links. */
.x-gmail-data-detectors,
.x-gmail-data-detectors *,
.aBn {
    border-bottom: 0 !important;
    cursor: default !important;
}

/* What it does: Prevents Gmail from displaying an download button on large, non-linked images. */
.a6S {
 display: none !important;
 opacity: 0.01 !important;
}
/* If the above doesn\'t work, add a .g-img class to any image in question. */
img.g-img + div {
 display:none !important;
}

/* What it does: Prevents underlining the button text in Windows 10 */
.button-link {
    text-decoration: none !important;
}

.input-text-control{
    display: block;
    width: 100%;
    height: 14px;
    padding: 4px 5px;
    font-size: 12px;
    line-height: 1.5;
    border-radius: 3px;
    color: #555;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
    -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
    -webkit-transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
    -o-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
}

/* What it does: Removes right gutter in Gmail iOS app: https://github.com/TedGoas/Cerberus/issues/89  */
/* Create one of these media queries for each additional viewport size you\'d like to fix */
/* Thanks to Eric Lepetit (@ericlepetitsf) for help troubleshooting */
@media only screen and (min-device-width: 375px) and (max-device-width: 413px) { /* iPhone 6 and 6+ */
    .email-container {
        min-width: 375px !important;
    }
}

</style>

<!-- What it does: Makes background images in 72ppi Outlook render at correct size. -->
    <!--[if gte mso 9]>
    <xml>
        <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
    </xml>
<![endif]-->

<!-- Progressive Enhancements -->
<style>

/* What it does: Hover styles for buttons */
.button-td,
.button-a {
    transition: all 100ms ease-in;
}
.button-td:hover,
.button-a:hover {
    background: #449D44 !important;
    border-color: #449D44 !important;
}

.bottom-strip{
    width: 120px !important;
    height: 10px !important;
    float: left !important;
}

.square-logo-layout{
    width: 40px;
    float: left !important;
    background-color: #FFF;//#24292E;
    border-radius: 50%;
    font-size: 30px;
    padding: 7.5px;
    margin-right: 0px;
    //color: #FFF;
    //cursor:pointer !important;
}

.square-logo-layout > i{
    cursor:pointer!important;
}


/* Media Queries */
@media screen and (max-width: 600px) {

    .email-container {
        width: 100% !important;
        margin: auto !important;
    }

    /* What it does: Forces elements to resize to the full width of their container. Useful for resizing images beyond their max-width. */
    .fluid {
        max-width: 100% !important;
        height: auto !important;
        margin-left: auto !important;
        margin-right: auto !important;
    }

    /* What it does: Forces table cells into full-width rows. */
    .stack-column,
    .stack-column-center {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        direction: ltr !important;
    }
    /* And center justify these ones. */
    .stack-column-center {
        text-align: center !important;
    }

    /* What it does: Generic utility class for centering. Useful for images, buttons, and nested tables. */
    .center-on-narrow {
        text-align: center !important;
        display: block !important;
        margin-left: auto !important;
        margin-right: auto !important;
        float: none !important;
    }
    table.center-on-narrow {
        display: inline-block !important;
    }

    .input-text-control{
        display: block;
        width: 100%;
        height: 14px;
        padding: 4px 5px;
        font-size: 12px;
        line-height: 1.5;
        border-radius: 3px;
        color: #555;
        background-color: #fff;
        background-image: none;
        border: 1px solid #ccc;
        -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
        box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
        -webkit-transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
        -o-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
        transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
    }

    /* What it does: Adjust typography on small screens to improve readability */
    .email-container p {
        font-size: 17px !important;
        line-height: 22px !important;
    }

}

</style>

</head>
<body width="100%" bgcolor="#E5E5E5" style="margin: 0px; mso-line-height-rule: exactly;">
    <center style="width: 600px; margin: auto; background: #FFFFFF; text-align: left;">
        <!-- Email Header : BEGIN -->
        <table role="presentation" aria-hidden="true" aria-hidden="true" cellspacing="0" cellpadding="0" border="0" align="center" width="600" style="margin: auto;" class="email-container">
           <tr>
            <td style="padding: 20px 0px; text-align: center">
             <a href="http://www.veremes.com/" target="_blank">
                <svg version="1.1" id="Calque_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="335px" height="100px" viewBox="0 0 335 100" enable-background="new 0 0 335 100" xml:space="preserve">
                    <g>
                        <rect fill="#FFFFFF" width="335" height="100"/>
                        <g>
                            <path fill="#1A171B" d="M308.774,60.788c-0.99-1.493-2.537-2.688-4.64-3.589c-0.533-0.224-1.577-0.57-3.142-1.042
                                        c-1.563-0.47-2.75-0.959-3.567-1.472c-0.893-0.547-1.532-1.161-1.916-1.841c-0.386-0.682-0.577-1.517-0.577-2.511
                                        c0-1.4,0.466-2.572,1.398-3.516c0.933-0.944,2.098-1.417,3.498-1.417c1.561,0,2.793,0.437,3.695,1.308
                                        c0.901,0.873,1.402,2.1,1.505,3.681h4.622c-0.12-2.909-1.026-5.178-2.72-6.806c-1.69-1.626-3.972-2.439-6.845-2.439
                                        c-2.71,0-5.016,0.916-6.921,2.744c-1.904,1.831-2.856,4.057-2.856,6.678c0,2.319,0.569,4.168,1.714,5.551
                                        c1.143,1.383,3.582,2.734,7.318,4.056c2.334,0.858,3.947,1.775,4.838,2.754c0.891,0.98,1.336,2.274,1.336,3.884
                                        c0,1.612-0.561,2.947-1.682,4.007c-1.121,1.063-2.526,1.592-4.219,1.592c-1.772,0-3.262-0.69-4.463-2.071
                                        c-1.202-1.379-1.802-3.12-1.802-5.228v-0.122h-4.502c0.103,3.535,1.114,6.344,3.039,8.431c1.922,2.085,4.466,3.127,7.637,3.127
                                        c3.108,0,5.674-0.952,7.698-2.853c2.025-1.899,3.038-4.301,3.038-7.205C310.261,64.182,309.764,62.279,308.774,60.788z
                                         M118.462,41.021c-5.17,0-9.417,1.679-12.739,5.035c-3.32,3.357-4.979,7.607-4.979,12.742c0,4.912,1.693,9.118,5.084,12.617
                                        c3.389,3.502,7.535,5.252,12.438,5.252c3.694,0,6.947-0.998,9.756-2.988c2.808-1.994,4.988-4.849,6.542-8.569h-4.866
                                        c-1.103,2.332-2.666,4.151-4.688,5.459c-2.023,1.308-4.302,1.962-6.834,1.962c-3.575,0-6.558-1.131-8.947-3.394
                                        c-2.391-2.263-3.718-5.226-3.983-8.894h30.413v-0.318c0-5.604-1.601-10.154-4.797-13.655
                                        C127.662,42.771,123.529,41.021,118.462,41.021z M105.366,56.472c0.509-3.468,1.901-6.219,4.17-8.258
                                        c2.27-2.037,5.04-3.056,8.313-3.056c3.517,0,6.368,0.948,8.556,2.844c2.188,1.897,3.692,4.719,4.509,8.47H105.366z M99.054,31.046
                                        L84.898,69.101L72.402,35.38l0.007-0.047l-0.079-0.217c-0.401-1.095-0.841-2.3-1.34-3.546l-0.194-0.523h-0.021
                                        c-2.108-5.143-5.249-10.879-10.817-12.957c-5.541-2.069-12.762-0.675-17.169,3.314c-3.422,3.096-5.471,7.843-6.089,14.111
                                        c0-0.002-0.117,1.154-0.117,1.154c-0.239,2.31-0.481,4.665-0.354,7.034l0.047,0.874l0.875-0.048l2.31-0.124l0.876-0.046
                                        l-0.049-0.876c-0.113-2.069,0.115-4.268,0.335-6.396c0-0.001,0.12-1.172,0.12-1.172c0.517-5.235,2.121-9.103,4.771-11.499
                                        c3.349-3.03,8.825-4.09,13.024-2.522c4.294,1.604,6.994,6.964,8.88,11.717l1.387,3.688l0.208,0.57l0.005-0.004L83.24,75.692h3.407
                                        l16.788-44.646H99.054z M268.755,41.021c-5.171,0-9.418,1.679-12.738,5.035c-3.32,3.357-4.979,7.607-4.979,12.742
                                        c0,4.912,1.692,9.118,5.084,12.617c3.389,3.502,7.535,5.252,12.438,5.252c3.695,0,6.947-0.998,9.758-2.988
                                        c2.807-1.994,4.986-4.849,6.54-8.569h-4.866c-1.102,2.332-2.666,4.151-4.688,5.459c-2.022,1.308-4.302,1.962-6.835,1.962
                                        c-3.574,0-6.557-1.131-8.945-3.394c-2.392-2.263-3.72-5.226-3.984-8.894h30.415v-0.318c0-5.604-1.603-10.154-4.8-13.655
                                        C277.955,42.771,273.821,41.021,268.755,41.021z M255.658,56.472c0.51-3.468,1.901-6.219,4.171-8.258
                                        c2.27-2.037,5.039-3.056,8.314-3.056c3.516,0,6.367,0.948,8.555,2.844c2.187,1.897,3.692,4.719,4.509,8.47H255.658z
                                         M148.164,42.625c-1.253,0.705-2.409,1.808-3.465,3.315v-3.946h-4.074v33.698h4.379V55.395c0-3.099,0.583-5.334,1.754-6.711
                                        c1.17-1.376,3.11-2.187,5.821-2.431l-0.032-4.744C150.878,41.549,149.417,41.922,148.164,42.625z M172.22,41.021
                                        c-5.171,0-9.418,1.679-12.738,5.035c-3.321,3.357-4.981,7.607-4.981,12.742c0,4.912,1.694,9.118,5.085,12.617
                                        c3.389,3.502,7.535,5.252,12.438,5.252c3.695,0,6.947-0.998,9.757-2.988c2.808-1.994,4.988-4.849,6.541-8.569h-4.866
                                        c-1.102,2.332-2.665,4.151-4.688,5.459c-2.023,1.308-4.303,1.962-6.834,1.962c-3.574,0-6.557-1.131-8.947-3.394
                                        c-2.391-2.263-3.718-5.226-3.984-8.894h30.414v-0.318c0-5.604-1.6-10.154-4.799-13.655
                                        C181.419,42.771,177.286,41.021,172.22,41.021z M159.124,56.472c0.51-3.468,1.901-6.219,4.17-8.258
                                        c2.271-2.037,5.04-3.056,8.313-3.056c3.517,0,6.369,0.948,8.556,2.844c2.188,1.897,3.692,4.719,4.51,8.47H159.124z
                                         M232.864,41.264c-2.51,0-4.779,0.509-6.809,1.518c-2.03,1.012-3.73,2.49-5.097,4.43c-1.106-1.818-2.712-3.264-4.82-4.338
                                        c-2.108-1.072-4.441-1.61-7-1.61c-2.212,0-4.191,0.379-5.941,1.134c-1.748,0.756-3.27,1.88-4.558,3.372v-3.776h-4.258v33.698
                                        h4.258V59.274c0-2.927,0.105-4.978,0.321-6.154c0.215-1.177,0.586-2.227,1.119-3.147c0.856-1.473,2.026-2.604,3.509-3.391
                                        c1.481-0.787,3.203-1.182,5.165-1.182c3.248,0,5.66,0.926,7.233,2.777c1.573,1.852,2.36,4.722,2.36,8.61v18.905h4.136V59.274
                                        c0-2.927,0.112-4.978,0.338-6.154c0.223-1.177,0.59-2.227,1.1-3.147c0.854-1.473,2.012-2.604,3.467-3.391
                                        c1.457-0.787,3.143-1.182,5.06-1.182c3.318,0,5.711,0.947,7.178,2.84c1.469,1.894,2.202,5.07,2.202,9.529v17.923h4.137V58.658
                                        c0-6.093-1.043-10.516-3.122-13.268C240.76,42.64,237.436,41.264,232.864,41.264z"/>
                            <g>
                            <path fill="#1A171B" d="M36.791,43.727c4.5,3.508,3.856-8.518,5.095-10.445c-0.251,0.39,1.045-0.227,1.359-0.68
                                                c0.714-1.033,0.78-1.304,1.783-0.467c0.685,0.57,4.073-2.156,5.011-2.76c-0.206-0.223,0.68,1.338,0.68,0.764
                                                c0,4.354-0.253,0.671,2.42,1.401c1.206,0.329,2.179-0.847,3.269,0.893c-0.283,0.31-0.566,0.621-0.849,0.933
                                                c4.111,1.071,3.139,4.072,7.134,6.029c-1.239,0.545-2.304,1.363-2.463,2.803c1.169,0.267,2.366,0.422,3.566,0.424
                                                c-0.34,0.311-0.679,0.622-1.02,0.934c2.158,0.346,2.307,2.235,4.671,1.699c-0.891,1.669-4.83,4.51-1.274,5.094
                                                c-0.198,0.085-0.396,0.171-0.594,0.255c0.745,0.477,1.172,1.362,1.868,1.868c-0.946,0.11-1.794,0.679-2.802,0.68
                                                c0.04,1.611,1.581,1.87,2.717,2.124c-2.577,1.72,0.311,0.894,0.722,2.122c-0.165-0.493,1.154,1.254,0.807,0.977
                                                c-0.173-0.139-1.318,0.596-0.807,1.062c0.174,0.158,4.875,0.583,1.98,1.482c-1.714,0.534-4.447,0.456-3.679,2.763
                                                c-1.174-0.126-1.886,0.235-2.845-0.083c0.154,0.687-0.067,0.846,0.213,1.442c-1.335,0.382-2.595-0.269-3.695-1.061
                                                c-0.042,0.268-0.084,0.537-0.127,0.806c-0.368-0.325-0.736-0.649-1.104-0.976c0.016,0.536-0.255,1.096-0.212,1.656
                                                c-0.877-0.677-5.258-4.209-2.972-1.189c0.905,1.195,1.842,1.439,2.93,2.463c-1.363,0.366-0.2,5.027,1.91,4.627
                                                c-1.045,1.709-3.151-0.414-4.289,1.828c1.419,0.304,0.683,0.515,1.826,1.146c-0.596-0.139-1.35,0.109-1.996-0.043
                                                c0.058,0.606,1.302,2.911,1.104,3.185c-0.761,1.05-2.778-1.146-3.949-1.146c-0.209,0.18-0.252,0.392-0.126,0.636
                                                c1.264,0.254,0.742,0.52,0.976,1.698c-2.448-0.878-0.467,0.231-0.467,1.104c0,3.686-2.677-0.092-2.548,2.505
                                                c-0.269-0.014-0.537-0.027-0.806-0.041c0.263,2.893-2.243-0.257-2.845,3.056c0.048,0.018-3.298-0.522-3.333-0.488
                                                c-1.136,1.135-1.402-0.027-2.174,0.598c-1.87,1.514-1.024-1.807-1.552-1.998c-0.694-0.253-2.246,1.984-2.455,0.573
                                                c-0.207-1.396-0.55-3.131-1.463-1.656c-0.954-0.37-3.546,0.314-3.842-0.572c-0.223-0.67-2.252-3.619-0.871-4.078
                                                c-0.407,0.137-1.347,0.543-1.719,0.765c0.857-2.833-1.515-2.188-3.185-1.146c0.104-1.69,0.899-3.521-1.083-3.247
                                                c0.293-0.662,0.337-1.645,0.828-2.356c-0.382,0.084-0.764,0.17-1.146,0.254c0.059-0.477,4.984-10.382,5.223-10.382
                                                c-0.199-0.062-0.369-0.169-0.51-0.318c-1.236,3.129-3.048,5.804-5.095,8.534c0.046-0.52-0.061-1.008-0.318-1.464
                                                c-0.23,0-1.983,2.339-2.548,2.61c0-0.253,0-0.509,0-0.763c-0.231,0.366-1.444,2.675-1.783,2.675c-0.329,0,0.481-1.796-0.51-1.467
                                                c-0.944,0.315-1.458,0.54-2.292,0.701c0.99-1.181,1.719-2.432-0.446-1.783c0.204-0.955-0.191-1.231-0.191-1.974
                                                c-0.159,0.41-0.393,0.771-0.7,1.084c-0.23-1.254-0.242-6.138-0.383-6.138c-1.46,0,0.123-2.937,0.341-3.312
                                                c-0.17-0.142-0.341-0.282-0.51-0.425c0.05,1.16-0.433,1.305-0.764,2.293c-1.08-1.767,1.521-3.314-0.764-3.99
                                                c0.311-0.256,0.623-0.51,0.934-0.765c-0.199-0.198-0.396-0.396-0.595-0.595c-0.269,0.61-0.729,1.216-1.02,1.783
                                                c-0.154-0.479,0.034-2.888,0.51-2.888c-0.313-0.017-0.624-0.044-0.935-0.084c0.723-0.973,0.495-1.264,1.444-1.699
                                                c-0.17-0.51-0.339-1.019-0.509-1.529c0.17,0.058,0.339,0.114,0.509,0.171c0.149,0.083-0.41-0.829-0.68-0.424
                                                c0.503-0.754,1.123-1.223,1.868-1.614c-0.283-0.17-0.566-0.34-0.849-0.51c0.664-0.432,1.176-1.357,2.038-1.698
                                                c-0.566-1.104-0.674-1.464-1.868-1.784c-0.033-2.104,1.163-9.234,2.717-8.407c-0.049-0.578-0.062-0.699,0.509-0.765
                                                c-0.087-1.145-0.637-0.797,0.595-1.104c-0.979-4.102,1.847-2.083,3.651-1.104c0-0.341,0-0.68,0-1.02
                                                c0.534,0.116,1.853,0.641,2.177,0.085c0.109-0.188-0.92-0.513-1.073-0.594c1.126-0.569,0.975-1.844,0.17-3.143
                                                c1.503,0.075,3.008,0.738,3.482-0.594c0.613,0.591,1.188,0.584,1.697,1.358c0.284-0.481,0.566-0.963,0.85-1.443
                                                c0.53,0.646,1.549,2.504,2.59,1.983c0.223-0.111,1.486,0.661,1.486,0.394c0-1.159,0.588-2.121,1.529-2.717
                                                C35.584,34.716,35.005,38.027,36.791,43.727"/>
                            </g>
                        </g>
                    </g>
                </svg>
            </a>
        </td>
    </tr>
</table>
<!-- Email Header : END -->

<!-- Email Body : BEGIN -->
<table role="presentation" aria-hidden="true" cellspacing="0" cellpadding="0" border="0" align="center" width="600" style="margin: auto;" class="email-container">

    [CONTENT]

</table>
<!-- Email Body : END -->

<!-- Email Footer : BEGIN -->
<table role="presentation" aria-hidden="true" cellspacing="0" cellpadding="0" border="0" align="center" width="600" style="margin: auto;" class="email-container">
    <tr>
        <td style="padding: 0px;width: 100%;" class="x-gmail-data-detectors">
            <div class="bottom-strip" style="background-color: #39468A;"></div>
            <div class="bottom-strip" style="background-color: #E74F23;"></div>
            <div class="bottom-strip" style="background-color: #923288;"></div>
            <div class="bottom-strip" style="background-color: #1C9DB2;"></div>
            <div class="bottom-strip" style="background-color: #E10759;"></div>
        </td>
    </tr>
</table>
<table role="presentation" aria-hidden="true" cellspacing="0" cellpadding="0" border="0" align="center" width="600" style="margin: auto;" class="email-container">
    <tr>
        <td style="padding: 10px;width: 50%;font-size: 12px; font-family: sans-serif; line-height:18px; text-align: center; color: #888888;" class="x-gmail-data-detectors">
            <a class="square-logo-layout" href="https://twitter.com/Veremes_Info" target="_blank" style="color: #24292E; cursor:pointer;">
                <!--<i class="fa fa-twitter" style=""></i>-->
                <svg id="Calque_1" data-name="Calque 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style="fill: currentColor; cursor:pointer;">
                        <title>Twitter</title>
                        <path d="M50,0a50,50,0,1,0,50,50A50,50,0,0,0,50,0ZM75.28,37c0,.56,0,1.12,0,1.68C75.32,56,62.2,75.83,38.21,75.83h0a37,37,0,0,1-20-5.86,24.62,24.62,0,0,0,3.11.18,26.13,26.13,0,0,0,16.2-5.58,13,13,0,0,1-12.18-9.06,12.34,12.34,0,0,0,2.45.24,13,13,0,0,0,3.44-.46A13,13,0,0,1,20.77,42.5v-.16A13.11,13.11,0,0,0,26.68,44a13.05,13.05,0,0,1-4-17.42A37,37,0,0,0,49.52,40.18a13.19,13.19,0,0,1-.34-3,13.05,13.05,0,0,1,22.57-8.92A26.11,26.11,0,0,0,80,25.12a13.08,13.08,0,0,1-5.73,7.22,26.23,26.23,0,0,0,7.49-2.06A26.49,26.49,0,0,1,75.28,37Z"/>
                </svg>
            </a>
            <a class="square-logo-layout" href="https://www.linkedin.com/company/1223206/" target="_blank" style="color: #24292E; cursor:pointer;">
                <!--<i class="fa fa-linkedin" style=""></i>-->
                <svg id="Calque_1" data-name="Calque 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style="fill: currentColor; cursor:pointer;">
                        <title>LinkedIn</title>
                        <path d="M50,0a50,50,0,1,0,50,50A50,50,0,0,0,50,0ZM60.71,51a6.48,6.48,0,0,0-6.33,6.32V79.68H41.74V41.74H54.38v5a13.63,13.63,0,0,1,10.54-5.9A15,15,0,0,1,79.68,55.65v24H67V57.33A6.48,6.48,0,0,0,60.71,51ZM27,34.57A7.59,7.59,0,1,1,34.57,27,7.55,7.55,0,0,1,27,34.57Zm6.32,7.17V79.68H20.66V41.74Z"/>
                </svg>
            </a>
            <a class="square-logo-layout" href="https://github.com/Veremes" target="_blank" style="color: #24292E; cursor:pointer;">
                <!--<i class="fa fa-github" style=""></i>-->
                <svg id="Calque_1" data-name="Calque 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style="fill: currentColor; cursor:pointer;">
                    <title>GitHub</title>
                    <path d="M50,0A50,50,0,0,0,38,98.53,2.44,2.44,0,0,0,38.49,97c0-.12,0-1.23,0-3.32s0-3.92,0-5.48L37,88.42a18.62,18.62,0,0,1-3.42.21,25.75,25.75,0,0,1-4.27-.43,9.5,9.5,0,0,1-4.12-1.84,7.81,7.81,0,0,1-2.71-3.78l-.61-1.42A15.31,15.31,0,0,0,20,78a7.35,7.35,0,0,0-2.68-2.34l-.43-.31a5,5,0,0,1-.8-.74,3.45,3.45,0,0,1-.55-.86c-.12-.29,0-.52.31-.71a4.07,4.07,0,0,1,1.78-.27l1.23.18a9,9,0,0,1,3.05,1.48,10,10,0,0,1,3,3.19,10.76,10.76,0,0,0,3.41,3.85,7.26,7.26,0,0,0,4,1.32,17.14,17.14,0,0,0,3.51-.31,11.94,11.94,0,0,0,2.76-.92,10,10,0,0,1,3-6.34,41.78,41.78,0,0,1-6.31-1.1,25.48,25.48,0,0,1-5.78-2.4,16.56,16.56,0,0,1-4.95-4.12,19.9,19.9,0,0,1-3.23-6.46A30.75,30.75,0,0,1,20,51.94,18,18,0,0,1,24.9,39.27q-2.28-5.6.43-12.55,1.79-.55,5.29.83a38.64,38.64,0,0,1,5.14,2.37c1.08.66,2,1.21,2.61,1.66a44.39,44.39,0,0,1,23.62,0l2.34-1.47A32.49,32.49,0,0,1,70,27.4q3.26-1.23,5-.67,2.76,6.94.49,12.54a18,18,0,0,1,4.86,12.67,31,31,0,0,1-1.26,9.26,19,19,0,0,1-3.26,6.46,17.17,17.17,0,0,1-5,4.09A25.48,25.48,0,0,1,65,74.15a43,43,0,0,1-6.31,1.11Q61.93,78,61.93,84V97a2.43,2.43,0,0,0,.46,1.48A50,50,0,0,0,50,0Z"/>
                </svg>
            </a>
            <a class="square-logo-layout" href="http://www.veremes.com/" target="_blank" style="color: #24292E; cursor:pointer;">
                <!--<i class="fa fa-globe" style=""></i>-->
                <svg id="Calque_1" data-name="Calque 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style="fill: currentColor; cursor:pointer;">
                        <defs>
                                <style>.cls-1{fill:none;}</style>
                        </defs>
                        <title>Veremes</title>
                        <path class="cls-1" d="M60.17,18.09h0S60.15,18.05,60.17,18.09Z"/>
                        <path class="cls-1" d="M48.39,26.38c.66-6.65,2.7-11.56,6.06-14.6a11.45,11.45,0,0,1,1.82-1.29A40.5,40.5,0,0,0,50,10l-1,0c-3.18,3.87-5.13,9.17-5.79,15.85l-.15,1.47c-.21,2.06-.42,4.16-.47,6.28-1.35-5.7-.83-9.69-1.1-15.87A4,4,0,0,0,39.6,21.2c0,.34-1.6-.64-1.88-.5-1.33.67-2.62-1.69-3.29-2.51L33.35,20c-.65-1-1.38-1-2.16-1.73-.6,1.69-2.51.85-4.42.76,1,1.65,1.21,3.26-.21,4,.19.1,1.5.51,1.36.75-.41.71-2.09,0-2.77-.11V25c-2.29-1.25-5.88-3.81-4.63,1.4-1.57.39-.87-.05-.76,1.4-.72.09-.71.24-.64,1-2-1.05-3.5,8-3.45,10.68,1.51.4,1.65.86,2.37,2.26-1.1.43-1.75,1.61-2.59,2.16l1.08.64a6,6,0,0,0-2.37,2c.34-.51,1.05.65.86.54l-.65-.22c.22.65.43,1.3.65,2-1.21.55-.92.92-1.83,2.15.39,0,.78.09,1.18.11-.6,0-.84,3.06-.65,3.67.37-.72,1-1.49,1.3-2.27l.75.76-1.18,1c2.9.86-.4,2.82,1,5.06.42-1.25,1-1.43,1-2.91l.65.54c-.28.48-2.29,4.21-.44,4.21.18,0,.2,6.2.49,7.79a4,4,0,0,0,.89-1.38c0,.95.5,1.3.24,2.51,2.75-.82,1.82.76.57,2.26a20.92,20.92,0,0,0,2.91-.89c1.26-.41.23,1.86.64,1.86s2-2.93,2.27-3.39v1c.72-.35,2.94-3.32,3.23-3.32a3.11,3.11,0,0,1,.41,1.86,46.51,46.51,0,0,0,6.47-10.83,1.46,1.46,0,0,0,.65.4c-.31,0-6.56,12.58-6.64,13.18l1.46-.32c-.63.9-.68,2.15-1,3,2.51-.35,1.5,2,1.37,4.13,2.12-1.33,5.14-2.15,4.05,1.45a15.73,15.73,0,0,1,2.18-1c-1.76.58.82,4.33,1.11,5.17.37,1.13,3.66.26,4.87.73,1.16-1.87,1.6.33,1.86,2.11s2.24-1,3.12-.73c.67.24-.4,4.46,2,2.53,1-.79,1.32.68,2.76-.75,0,0,4.29.64,4.23.62.77-4.21,3.94-.21,3.61-3.88l1,0c-.16-3.3,3.24,1.5,3.24-3.18,0-1.11-2.52-2.52.59-1.4-.29-1.5.37-1.84-1.24-2.16a.62.62,0,0,1,.16-.81c1.49,0,4,2.79,5,1.46.25-.35-1.33-3.28-1.4-4,.82.2,1.77-.12,2.53.06-1.45-.8-.52-1.07-2.32-1.46,1.45-2.84,4.12-.15,5.45-2.32C70.78,71.9,69.3,66,71,65.52c-1.38-1.3-2.57-1.61-3.72-3.13-2.9-3.83,2.66.65,3.78,1.51-.06-.71.28-1.42.27-2.1L72.76,63c0-.34.11-.69.16-1,1.4,1,3,1.83,4.69,1.35-.35-.76-.08-1-.27-1.83,1.22.4,2.12-.06,3.61.11-1-2.93,2.5-2.84,4.67-3.51,3.68-1.15-2.29-1.68-2.51-1.88-.65-.6.8-1.53,1-1.35.44.35-1.23-1.87-1-1.24-.52-1.56-4.19-.51-.92-2.7-1.44-.32-3.4-.65-3.45-2.69,1.28,0,2.36-.73,3.56-.87-.89-.64-1.43-1.76-2.37-2.37l.75-.32c-4.51-.74.49-4.35,1.62-6.47-3,.68-3.19-1.72-5.93-2.16l1.29-1.18a20.84,20.84,0,0,1-4.52-.54c.19-1.83,1.55-2.87,3.12-3.56-5.07-2.49-3.84-6.3-9.06-7.66L68.28,22c-1.38-2.21-2.62-.72-4.15-1.13-3.39-.93-3.07,3.75-3.07-1.78,0,.62-.81-.72-.89-1-1.22.8-5.47,4.21-6.34,3.49-1.27-1.06-1.35-.72-2.26.59-.4.58-2,1.36-1.73.87-.9,1.41-1,7.1-2.05,10.79,0-2,.25-4,.45-6Z"/>
                        <path d="M99.94,47.71l0-.64c0-.61-.08-1.23-.14-1.84,0-.16,0-.31,0-.46-.08-.74-.17-1.47-.28-2.2,0-.19-.06-.38-.1-.57q-.13-.86-.3-1.68l-.12-.64c-.15-.7-.31-1.39-.48-2.08,0-.15-.09-.3-.13-.45-.14-.56-.3-1.11-.46-1.65-.08-.24-.15-.49-.23-.73-.16-.51-.34-1-.52-1.54-.06-.17-.12-.35-.19-.53-.23-.62-.47-1.24-.73-1.85-.11-.27-.22-.53-.34-.8s-.35-.78-.53-1.17l-.38-.81c-.27-.56-.56-1.11-.85-1.66-.16-.3-.33-.59-.49-.88s-.35-.61-.53-.92-.37-.63-.57-.94L92,22.86q-.55-.86-1.14-1.68l-.45-.62c-.25-.35-.51-.69-.77-1-.13-.18-.27-.35-.41-.52q-1.36-1.74-2.9-3.35L86,15.35q-1.66-1.72-3.48-3.29L82.46,12a51.79,51.79,0,0,0-5.4-4h0a49.56,49.56,0,0,0-4.42-2.54h0A49.59,49.59,0,0,0,63.94,2h0c-1.56-.45-3.16-.83-4.78-1.13L58.49.73,57.21.52C56.59.43,56,.35,55.33.29L54.54.21,53,.1l-.73,0C51.51,0,50.76,0,50,0a50,50,0,1,0,50,50C100,49.23,100,48.47,99.94,47.71ZM49.84,23c-.31.49,1.33-.29,1.73-.87.91-1.31,1-1.65,2.26-.59.87.72,5.12-2.69,6.34-3.49,0,0,0-.06,0,0h0c.08.24.89,1.58.89,1,0,5.53-.32.85,3.07,1.78,1.53.41,2.77-1.08,4.15,1.13L67.2,23.14c5.22,1.36,4,5.17,9.06,7.66-1.57.69-2.93,1.73-3.12,3.56a20.84,20.84,0,0,0,4.52.54l-1.29,1.18c2.74.44,2.92,2.84,5.93,2.16-1.13,2.12-6.13,5.73-1.62,6.47l-.75.32c.94.61,1.48,1.73,2.37,2.37-1.2.14-2.28.86-3.56.87.05,2,2,2.37,3.45,2.69-3.27,2.19.4,1.14.92,2.7-.21-.63,1.46,1.59,1,1.24-.22-.18-1.67.75-1,1.35.22.2,6.19.73,2.51,1.88-2.17.67-5.64.58-4.67,3.51-1.49-.17-2.39.29-3.61-.11.19.87-.08,1.07.27,1.83-1.7.48-3.29-.34-4.69-1.35,0,.34-.11.69-.16,1l-1.4-1.24c0,.68-.33,1.39-.27,2.1C70,63,64.41,58.56,67.31,62.39c1.15,1.52,2.34,1.83,3.72,3.13-1.73.46-.25,6.38,2.43,5.87-1.33,2.17-4-.52-5.45,2.32,1.8.39.87.66,2.32,1.46-.76-.18-1.71.14-2.53-.06.07.77,1.65,3.7,1.4,4-1,1.33-3.53-1.46-5-1.46a.62.62,0,0,0-.16.81c1.61.32,1,.66,1.24,2.16-3.11-1.12-.59.29-.59,1.4,0,4.68-3.4-.12-3.24,3.18l-1,0c.33,3.67-2.84-.33-3.61,3.88.06,0-4.19-.67-4.23-.62-1.44,1.43-1.78,0-2.76.75-2.37,1.93-1.3-2.29-2-2.53-.88-.32-2.86,2.52-3.12.73s-.7-4-1.86-2.11c-1.21-.47-4.5.4-4.87-.73-.29-.84-2.87-4.59-1.11-5.17a15.73,15.73,0,0,0-2.18,1c1.09-3.6-1.93-2.78-4.05-1.45.13-2.15,1.14-4.48-1.37-4.13.37-.84.42-2.09,1-3l-1.46.32c.08-.6,6.33-13.18,6.64-13.18a1.46,1.46,0,0,1-.65-.4,46.51,46.51,0,0,1-6.47,10.83A3.11,3.11,0,0,0,28,67.51c-.29,0-2.51,3-3.23,3.32v-1c-.3.46-1.83,3.39-2.27,3.39s.62-2.27-.64-1.86a20.92,20.92,0,0,1-2.91.89c1.25-1.5,2.18-3.08-.57-2.26.26-1.21-.24-1.56-.24-2.51a4,4,0,0,1-.89,1.38c-.29-1.59-.31-7.79-.49-7.79-1.85,0,.16-3.73.44-4.21l-.65-.54c.06,1.48-.55,1.66-1,2.91-1.37-2.24,1.93-4.2-1-5.06l1.18-1L15,52.47c-.34.78-.93,1.55-1.3,2.27-.19-.61,0-3.67.65-3.67-.4,0-.79-.06-1.18-.11.91-1.23.62-1.6,1.83-2.15-.22-.65-.43-1.3-.65-2l.65.22c.19.11-.52-1-.86-.54a6,6,0,0,1,2.37-2l-1.08-.64c.84-.55,1.49-1.73,2.59-2.16-.72-1.4-.86-1.86-2.37-2.26-.05-2.68,1.47-11.73,3.45-10.68-.07-.73-.08-.88.64-1-.11-1.45-.81-1,.76-1.4-1.25-5.21,2.34-2.65,4.63-1.4v-1.3c.68.15,2.36.82,2.77.11.14-.24-1.17-.65-1.36-.75,1.42-.73,1.23-2.34.21-4,1.91.09,3.82.93,4.42-.76C32,19,32.7,19,33.35,20l1.08-1.83c.67.82,2,3.18,3.29,2.51.28-.14,1.88.84,1.88.5a4,4,0,0,1,1.94-3.45c.27,6.18-.25,10.17,1.1,15.87,0-2.12.26-4.22.47-6.28l.15-1.47c.66-6.68,2.61-12,5.79-15.85l1,0a40.5,40.5,0,0,1,6.27.49,11.45,11.45,0,0,0-1.82,1.29c-3.36,3-5.4,8-6.06,14.6l-.15,1.49c-.2,2-.41,4-.45,6C48.82,30.14,48.94,24.45,49.84,23Z"/>
                </svg>
            </a>
        </td>
        <td style="padding: 10px;width: 50%;font-size: 20px; font-family: sans-serif; line-height:18px; text-align: center; color: #000000;" class="x-gmail-data-detectors">
            <div style="margin-bottom:10px;">Pour toute question :</div>
            <div>support@veremes.com</div>
        </td>
    </tr>
</table>
<!-- Email Footer : END -->

</center>
[SCRIPT]
</body>
</html>';
?>