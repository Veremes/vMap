<?xml version="1.0" encoding="utf-8"?>

<!DOCTYPE xsl:stylesheet [
  <!ENTITY nbsp "&#160;">
]>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="utf-8" doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"/>
  <xsl:template match="/">
    <xsl:param name="poste"/>
    <xsl:param name="type"/>

    <html xmlns="http://www.w3.org/1999/xhtml"
      lang="fr"
      >
      <body>
        <table  table-layout="fixed" width="100%" CELLSPACING="0" CELLPADDING="0">
          
          <!-- Début de l'en-tête qui se retrouvera sur chaque page du RP -->
          
          <thead>
            <tr> 
              <td width="100%">
                
                <table style="text-align: center; font-size: 10pt;line-height: 0.8cm;" width="100%" CELLSPACING="0" CELLPADDING="1" >
                  <tbody>
                    <xsl:for-each select="Mj/Mj_Compte_Communal | Mj/Mj_Compte_Communal_Parcelle">
                      <tr>
                        <td  style="border-width: 0.5pt; border-style: solid; border-color: black; border-right: hidden;" width="4.14%">
                          <div style="vertical-align: middle; line-height: 0.3cm; text-align: center;">ANNEE DE MAJ</div>
                        </td>
                        <td style="border-width: 0.5pt; border-style: solid; border-color: black; border-right: hidden;" width="2.07%">
                          <div style="vertical-align: middle; line-height: 0.6cm; text-align: center;">
                            <xsl:value-of select="@annee_de_maj"/>
                          </div>
                        </td>
                        <td style="border-width: 0.5pt; border-style: solid; border-color: black; border-right: hidden;" width="2.07%">
                          <div style="vertical-align: middle; line-height: 0.3cm; text-align: center;">DEP DIR</div>
                        </td>                       
                        <td style="border-width: 0.5pt; border-style: solid; border-color: black; border-right: hidden;" width="3.11%">
                          <div style="vertical-align: middle; line-height: 0.6cm; text-align: center;">
                            <xsl:value-of select="@dep_dir"/>
                          </div>
                        </td>                        
                        <td style="border-width: 0.5pt; border-style: solid; border-color: black; border-right: hidden;" whidth="3.11%">
                          <div style="vertical-align: middle; line-height: 0.6cm; text-align: center;">COM</div>
                        </td>
                        <td style="border-width: 0.5pt; border-style: solid; border-color: black;" whidth="22.08%">
                          <div style="vertical-align: middle; line-height: 0.6cm; text-align: center;">
                            <xsl:value-of select="@com"/>
                          </div>
                        </td>
                        <td whidth="53.13%">
                          <div style="font-style: italic; font-size: 16pt; vertical-align: middle; line-height: 0.5cm; text-align: center;">
                            RELEVE DE PROPRIETE
                          </div>
                        </td>                        
                        <td style="border-width: 0.5pt; border-style: solid; border-color: black; border-right: hidden;" whidth="6.21%">
                          <div style="vertical-align: middle; line-height: 0.3cm; text-align: center;">NUMERO COMMUNAL</div>
                        </td>                      
                        <td style="border-width: 0.5pt; border-style: solid; border-color: black;" whidth="3.11%">
                          <div style="vertical-align: middle; line-height: 0.6cm; text-align: center;">
                            <xsl:value-of select="substring(@numero_communal,6)"/>
                          </div>
                        </td>
                      </tr>
                    </xsl:for-each>
                  </tbody>
                </table>
              </td>
            </tr>
            <!-- Affichage de la ligne titre "PROPRIETAIRE" -->
            <tr>             
              <td width="100%"> 
                <table style="text-align: center;" width="100%">
                  <tbody> 
                    <tr>
                      <td padding-top="0.5cm" padding-bottom="0.1cm">
                        <div style="font-size: 10pt; text-align: center;">PROPRIETAIRE</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <!-- Affichage du tableau proprietaire -->
            
            <tr>
              
              <td>
                
                <table style="text-align: left; table-layout: fixed; border-color: black; border: 0.5pt; border-style: solid; border-collapse: collapse; font-size: 10pt; padding-top: 0.2cm; padding-bottom: 0.1cm;" width="100%" >                 
                  
                  
                  <tbody>
                    
                    <xsl:for-each select="Mj/Mj_Compte_Communal/Mj_Proprietaire | Mj/Mj_Compte_Communal_Parcelle/Mj_Proprietaire">
                      
                      <tr>
                        <xsl:if test="$type='complet'">
                          <td width="75%" style="padding-left: 0.3cm;">
                            <div>
                              <xsl:value-of select="@l_ccodro"/>&nbsp;<xsl:value-of select="@l_ccodem"/>&nbsp;<xsl:value-of select="@dnuper"/>&nbsp;<xsl:value-of select="@proprietaire_nom"/>
                            </div>
                          </td>

                          <td width="25%" style="padding-left: 0.3cm;">
                            <div>
                              <xsl:value-of select="@jdatnss"/>
                            </div>
                          </td>
                        </xsl:if>
                        <xsl:if test="not($type='complet')">
                          <td width="100%" style="padding-left: 0.3cm;">
                            <div>
                              <xsl:value-of select="@l_ccodro"/>&nbsp;<xsl:value-of select="@l_ccodem"/>&nbsp;<xsl:value-of select="@dnuper"/>&nbsp;<xsl:value-of select="@proprietaire_nom_tiers"/>
                            </div>
                          </td>
                        </xsl:if>
                      </tr>
                      
                      <tr>
                        <td style="padding-left: 0.3cm;">
                          <div>
                            <xsl:value-of select="@proprietaire_adresse"/>
                          </div>
                        </td>
                        <xsl:if test="$type='complet'">
                          <td>
                            <div>
                              <xsl:value-of select="@dldnss"/>
                            </div>
                          </td>
                        </xsl:if>
                      </tr>
                    </xsl:for-each>
                  </tbody>
                </table>
              </td>
            </tr>
          </thead>
          <!-- Fin de l'en-tête -->
          <!-- Début du corps du tableau global -->
          
          <tbody>
            <!-- Affichage des poprietes baties -->
            
            <tr>

              <td width="100%">
                
                <table width="100%" style="text-align: center; font-size: 10pt;" CELLSPACING="0" CELLPADDING="0"  >
                  
                  <!-- Affichage de l'en-tête des propriétés baties -->
                  
                  <thead width="100%">
                    
                    <tr >
                      <xsl:if test="$type='complet'">
                        <td style="text-align: center; border-color: black; border-style: solid; border-left: hidden; border-right: hidden; border-top: hidden; border-bottom: hidden; border-width: 0.5pt; padding-top: 1cm; padding-bottom: 0.1cm;" valign="top" colspan="26" >
                          <div style ="text-align: center; font-size: 8pt; line-height: 0.5cm; vertical-align: middle;" >PROPRIETES BATIES</div>
                        </td>
                      </xsl:if>
                      <xsl:if test="not($type='complet')">
                        <td style="text-align: center; border-color: black; border-style: solid; border-left: hidden; border-right: hidden; border-top: hidden; border-bottom: hidden; border-width: 0.5pt; padding-top: 1cm; padding-bottom: 0.1cm;" valign="top" colspan="20" >
                          <div style ="text-align: center; font-size: 8pt; line-height: 0.5cm; vertical-align: middle;" >PROPRIETES BATIES</div>
                        </td>
                      </xsl:if>
                    </tr>
                    
                    <tr>
                      
                      <td style="border-color: black; border-style: solid; border-right: hidden; border-bottom: hidden; border-width: 0.5pt;" valign="top" colspan="7">
                        <div style ="text-align: center; font-size: 8pt; line-height: 0.5cm; vertical-align: middle;" >DESIGNATION DES PROPRIETES</div>
                      </td>
                      
                      <td style="border-color: black; border-style: solid; border-left: hidden; border-bottom: hidden; border-right: hidden; border-width: 0.5pt;" valign="top" colspan="5">
                        <div style ="text-align: center; font-size: 8pt; line-height: 0.5cm; vertical-align: middle;" >IDENTIFICATION DU LOCAL</div>
                      </td>
                      <xsl:if test="$type='complet'">
                        <td style="border-color: black; border-style: solid; border-left: hidden; border-bottom: hidden; border-width: 0.5pt;" valign="top" colspan="14">
                          <div style ="text-align: center; font-size: 8pt; line-height: 0.5cm; vertical-align: middle;" >EVALUATION DU LOCAL</div>
                        </td>
                      </xsl:if>
                      <xsl:if test="not($type='complet')">
                        <td style="border-color: black; border-style: solid; border-left: hidden; border-bottom: hidden; border-width: 0.5pt;" valign="top" colspan="8">
                          <div style ="text-align: center; font-size: 8pt; line-height: 0.5cm; vertical-align: middle;" >EVALUATION DU LOCAL</div>
                        </td>
                      </xsl:if>
                    </tr>
                    
                    <!-- Affichage des titres des colonnes des propriétés baties -->
                    
                    <tr>

                      <td width="2.07%" style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden;" valign="top">
                        <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">AN</div>
                      </td>
                      
                      <td width="4.14%" style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden;" valign="top">
                        <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">SECTION</div>
                      </td>

                      <td width="3.45%" style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden;" valign="top">
                        <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">N°PLAN</div>
                      </td>

                      <td width="1.38%" style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden;" valign="top">
                        <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">CP</div>
                      </td>

                      <td width="4.14%" style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden;" valign="top">
                        <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">N° Voirie</div>
                      </td>

                      <xsl:if test="$type='complet'">
                        <td width="22.08%" style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden;" valign="top">
                          <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">ADRESSE</div>
                        </td>
                      </xsl:if>
                      <xsl:if test="not($type='complet')">
                        <td width="38.99%" style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden;" valign="top">
                          <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">ADRESSE</div>
                        </td>
                      </xsl:if>

                      <td width="3.11%" style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-left: hidden;" valign="top">
                        <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">CODE RIVOLI</div>
                      </td>

                      <td width="2.07%" style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden;" valign="top">
                        <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">BAT</div>
                      </td>

                      <td width="2.07%" style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden;" valign="top">
                        <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">ENT</div>
                      </td>

                      <td width="2.07%" style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden;" valign="top">
                        <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">NIV</div>
                      </td>

                      <td width="4.14%" style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden;" valign="top">
                        <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">N°PORTE</div>
                      </td>

                      <td width="6.21%" style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden;" valign="top">
                        <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">N°INVAR</div>
                      </td>

                      <td width="2.42%" style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden;" valign="top">
                        <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">S TAR</div>
                      </td>

                      <td width="2.42%" style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden;" valign="top">
                        <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">M EVAL</div>
                      </td>

                      <td width="1.38%" style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden;" valign="top">
                        <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">AF</div>
                      </td>

                      <td width="4.14%" style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden;" valign="top">
                        <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">NAT LOC</div>
                      </td>

                      <td width="2.07%" style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden;" valign="top">
                        <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">CAT</div>
                      </td>

                      <td width="8.28%" style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden;" valign="top">
                        <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">REVENU CADASTRAL</div>
                      </td>

                      <xsl:if test="$type='complet'">
                        <td width="2.42%" style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden;" valign="top">
                          <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">COLL</div>
                        </td>

                        <td width="2.07%" style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden;" valign="top">
                          <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">NAT EXO</div>
                        </td>

                        <td width="2.07%" style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden;" valign="top">
                          <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">AN RET</div>
                        </td>

                        <td width="2.07%" style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden;" valign="top">
                          <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">AN DEB</div>
                        </td>

                        <td width="6.21%" style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden;" valign="top">
                          <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">FRACTION RC EXO</div>
                        </td>

                        <td width="2.07%" style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden;" valign="top">
                          <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">% EXO</div>
                        </td>
                      </xsl:if>

                      <td width="2.07%" style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden;" valign="top">
                        <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">TX OM</div>
                      </td>

                      <td width="2.42%" style="border-style: solid; border-width: 0.5pt; border-color: black;" valign="top">
                        <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">COEF</div>
                      </td>
                    </tr>
                  </thead>
                  
                  <tfoot>
                    
                    <tr>

                      <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-left: hidden;" valign="top">
                        <div>
                        </div>
                      </td>
                      
                      <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-left: hidden;" valign="top">
                        <div>
                        </div>
                      </td>
                      
                      <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-left: hidden;" valign="top">
                        <div>
                        </div>
                      </td>
                      
                      <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-left: hidden;" valign="top">
                        <div>
                        </div>
                      </td>
                      
                      <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-left: hidden;" valign="top">
                        <div>
                        </div>
                      </td>
                      
                      <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-left: hidden;" valign="top">
                        <div>
                        </div>
                      </td>
                      
                      <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-left: hidden;" valign="top">
                        <div>
                        </div>
                      </td>
                      
                      <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-left: hidden;" valign="top">
                        <div>
                        </div>
                      </td>
                      
                      <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-left: hidden;" valign="top">
                        <div>
                        </div>
                      </td>
                      
                      <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-left: hidden;" valign="top">
                        <div>
                        </div>
                      </td>
                      
                      <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-left: hidden;" valign="top">
                        <div>
                        </div>
                      </td>
                      
                      <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-left: hidden;" valign="top">
                        <div>
                        </div>
                      </td>
                      
                      <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-left: hidden;" valign="top">
                        <div>
                        </div>
                      </td>
                      
                      <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-left: hidden;" valign="top">
                        <div>
                        </div>
                      </td>
                      
                      <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-left: hidden;" valign="top">
                        <div>
                        </div>
                      </td>
                      
                      <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-left: hidden;" valign="top">
                        <div>
                        </div>
                      </td>
                      
                      <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-left: hidden;" valign="top">
                        <div>
                        </div>
                      </td>
                      
                      <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-left: hidden;" valign="top">
                        <div>
                        </div>
                      </td>

                      <xsl:if test="$type='complet'">
                        <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-left: hidden;" valign="top">
                          <div>
                          </div>
                        </td>

                        <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-left: hidden;" valign="top">
                          <div>
                          </div>
                        </td>

                        <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-left: hidden;" valign="top">
                          <div>
                          </div>
                        </td>

                        <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-left: hidden;" valign="top">
                          <div>
                          </div>
                        </td>

                        <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-left: hidden;" valign="top">
                          <div>
                          </div>
                        </td>

                        <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-left: hidden;" valign="top">
                          <div>
                          </div>
                        </td>
                      </xsl:if>
                        
                      <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-left: hidden;" valign="top">
                        <div>
                        </div>
                      </td>
                      
                      <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-left: hidden;" valign="top">
                        <div>
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                  <!-- Affichage des données des propriétés baties -->
                  
                  <tbody>
                    
                    <tr>
                      
                      <td>
                        <div>
                        </div>
                      </td>
                    </tr>
                    
                    <xsl:for-each select="Mj/Mj_Compte_Communal/Mj_Bati | Mj/Mj_Compte_Communal_Parcelle/Mj_Bati">
						 <xsl:sort select="substring(@num_invar,1,3)" />

                      <xsl:sort select="@section" />
						<xsl:sort select="@num_plan" data-type="number"/>
                      <tr>
                        
                        <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                          
                          <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                            <xsl:value-of select="@date"/>
                          </div>
                        </td>
                        
                        <td style="padding-right: 0.1cm;border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                          
                          <div text-align="right" vertical-align="middle" line-height="0.5cm">
                            <xsl:value-of select="@section"/>
                          </div>
                        </td>
                        
                        <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                          
                          <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                            <xsl:value-of select="@num_plan"/>
                          </div>
                        </td>
                        
                        <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                          
                          <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                            <xsl:value-of select="@cp"/>
                          </div>
                        </td>
                        
                        <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                          
                          <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                            <xsl:value-of select="@voirie"/>
                          </div>
                        </td>
                        
                        <td style="padding-left: 0.1cm; border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                          
                          <div vertical-align="middle" line-height="0.5cm">
                            <xsl:value-of select="@adresse"/>
                          </div>
                        </td>
                        
                        <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden; border-left: hidden;" valign="top">
                          
                          <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                            <xsl:value-of select="@code_rivoli"/>
                          </div>
                        </td>
                        
                        <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                          
                          <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                            <xsl:value-of select="@bat"/>
                          </div>
                        </td>
                        
                        <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden; border-left: hidden;">
                          
                          <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                            <xsl:value-of select="@ent"/>
                          </div>
                        </td>
                        
                        <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden; border-left: hidden;">
                          
                          <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                            <xsl:value-of select="@niv"/>
                          </div>
                        </td>
                        
                        <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden; border-left: hidden;">
                          
                          <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                            <xsl:value-of select="@num_de_porte"/>
                          </div>
                        </td>
                        
                        <td style="padding-left: 0.1cm; border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;">
                          
                          <div vertical-align="middle" line-height="0.5cm">
                            <xsl:value-of select="@num_invar"/>
                          </div>
                        </td>
                        
                        <!-- Affichage du PEV lorsqu'il n'y en a qu'un (même ligne) -->
                        
                        <xsl:if test="count(Mj_Pev) = 1">
                          
                          <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                            
                            <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                              <xsl:value-of select="@s_tar"/>
                            </div>
                          </td>
                          
                          <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                            
                            <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                              <xsl:value-of select="@m_eva"/>
                            </div>
                          </td>
                          
                          <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                            
                            <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                              <xsl:value-of select="@af"/>
                            </div>
                          </td>
                          
                          <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                            
                            <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                              <xsl:value-of select="@nat_loc"/>
                            </div>
                          </td>
                          
                          <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                            
                            <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                              <xsl:value-of select="@cat"/>
                            </div>
                          </td>
                          
                          <td style="padding-right: 0.1cm; border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                            
                            <div text-align="right" vertical-align="middle" line-height="0.5cm">
                              <xsl:value-of select="@revenu_cadastral"/>
                            </div>
                          </td>

                          <xsl:if test="$type='complet'">
                            <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">

                              <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                                
                              </div>
                            </td>

                            <td style="padding-right: 0.1cm; border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">

                              <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                                
                              </div>
                            </td>

                            <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">

                              <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                                
                              </div>
                            </td>

                            <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                              <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                              </div>
                            </td>

                            <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">

                              <div text-align="right" vertical-align="middle" line-height="0.5cm">
                               
                              </div>
                            </td>

                            <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">

                              <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                                
                              </div>
                            </td>
                          </xsl:if>
                          <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                            
                            <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                              <xsl:value-of select="@tx_om"/>
                            </div>
                          </td>
                          
                          <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
                            <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                            </div>
                          </td>
                        </xsl:if>
                        
                        <!--Affichage du premier PEV lorsqu'il y en a plusieurs (même ligne) -->
                        
                        <xsl:if test="count(Mj_Pev) > 1">
                          
                          <xsl:for-each select="Mj_Pev">
                            
                            <xsl:if test="position()=1">
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                                  <xsl:value-of select="@s_tar"/>
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                                  <xsl:value-of select="../@m_eva"/>
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                                  <xsl:value-of select="@af"/>
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                                  <xsl:value-of select="../@nat_loc"/>
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                                  <xsl:value-of select="@cat"/>
                                </div>
                              </td>
                              
                              <td style="padding-right: 0.1cm; border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div text-align="right" vertical-align="middle" line-height="0.5cm">
                                  <xsl:value-of select="@revenu_cadastral"/>
                                </div>
                              </td>

                              <xsl:if test="$type='complet'">
                                <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                  <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                                  </div>
                                </td>
                              
                                <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                  <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                                    <xsl:value-of select="@nat_exo"/>
                                  </div>
                                </td>
                              
                                <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                  <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                                  </div>
                                </td>
                              
                                <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                  <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                                  </div>
                                </td>
                              
                                <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                  <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                                  </div>
                                </td>
                              
                                <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                  <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                                  </div>
                                </td>
                              </xsl:if>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                                </div>
                              </td>
                            </xsl:if>
                          </xsl:for-each>
                        </xsl:if>
                      </tr>
                      <!--Affichage des PEV suivants (lignes suivantes) -->
                      
                        
                        <xsl:for-each select="Mj_Pev">
                          
                          <xsl:if test="position()>1">
                            
                            <tr>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden; border-left: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden; border-left: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden; border-left: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden; border-left: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                  <xsl:value-of select="@s_tar"/>
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                  <xsl:value-of select="../@m_eva"/>
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                  <xsl:value-of select="@af"/>
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                  <xsl:value-of select="../@nat_loc"/>
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                  <xsl:value-of select="@cat"/>
                                </div>
                              </td>
                              
                              <td style="padding-right: 0.1cm; border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div text-align="right" vertical-align="middle" line-height="0.3cm">
                                  <xsl:value-of select="@revenu_cadastral"/>
                                </div>
                              </td>
                              <xsl:if test="$type='complet'">
                                <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">

                                  <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                  </div>
                                </td>

                                <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">

                                  <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                    <xsl:value-of select="@nat_exo"/>
                                  </div>
                                </td>

                                <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">

                                  <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                  </div>
                                </td>

                                <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">

                                  <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                  </div>
                                </td>

                                <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">

                                  <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                  </div>
                                </td>

                                <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">

                                  <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                  </div>
                                </td>
                              </xsl:if>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                            </tr>
                            
                            <tr>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden; border-left: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden; border-left: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden; border-left: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden; border-left: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="padding-right: 0.1cm; border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div text-align="right" vertical-align="middle" line-height="0.3cm">
                                  <xsl:value-of select="../@revenu_cadastral"/>
                                </div>
                              </td>
                              <xsl:if test="$type='complet'">
                                <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">

                                  <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                  </div>
                                </td>

                                <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">

                                  <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                  </div>
                                </td>

                                <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">

                                  <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                  </div>
                                </td>

                                <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">

                                  <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                  </div>
                                </td>

                                <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">

                                  <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                  </div>
                                </td>

                                <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">

                                  <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                  </div>
                                </td>
                              </xsl:if>
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                  <xsl:value-of select="../@tx_om"/>
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                            </tr>
<xsl:if test="count(Mj_Exone_Pev) &gt; 0">
							 <xsl:for-each select="Mj_Exone_Pev">
							<tr>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden; border-left: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden; border-left: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden; border-left: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden; border-left: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="padding-right: 0.1cm; border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div text-align="right" vertical-align="middle" line-height="0.3cm">
                                 
                                </div>
                              </td>
                              <xsl:if test="$type='complet'">
                                <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">

                                  <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
									 <xsl:value-of select="@coll"/>
                                  </div>
                                </td>

                                <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">

                                  <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
								  <xsl:value-of select="@nat_exo"/>
                                  </div>
                                </td>

                                <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">

                                  <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
								  <xsl:value-of select="@an_ret"/>
                                  </div>
                                </td>

                                <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">

                                  <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
								   <xsl:value-of select="@an_deb"/>
                                  </div>
                                </td>

                                <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">

                                  <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
								  <xsl:value-of select="@fraction_rc_exo"/>
                                  </div>
                                </td>

                                <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">

                                  <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
									 <xsl:value-of select="@pourc_exo"/>
                                  </div>
                                </td>
                              </xsl:if>
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                  
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                            </tr>
							</xsl:for-each>
							</xsl:if>
                          </xsl:if>
						  <xsl:if test="position() = 1">
							<xsl:if test="count(Mj_Exone_Pev) &gt; 0">
							 <xsl:for-each select="Mj_Exone_Pev">
							<tr>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden; border-left: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden; border-left: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden; border-left: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden; border-left: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                              
                              <td style="padding-right: 0.1cm; border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div text-align="right" vertical-align="middle" line-height="0.3cm">
                                 
                                </div>
                              </td>
                              <xsl:if test="$type='complet'">
                                <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">

                                  <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
									 <xsl:value-of select="@coll"/>
                                  </div>
                                </td>

                                <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">

                                  <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
								  <xsl:value-of select="@nat_exo"/>
                                  </div>
                                </td>

                                <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">

                                  <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
								  <xsl:value-of select="@an_ret"/>
                                  </div>
                                </td>

                                <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">

                                  <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
								   <xsl:value-of select="@an_deb"/>
                                  </div>
                                </td>

                                <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">

                                  <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
								  <xsl:value-of select="@fraction_rc_exo"/>
                                  </div>
                                </td>

                                <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">

                                  <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
									 <xsl:value-of select="@pourc_exo"/>
                                  </div>
                                </td>
                              </xsl:if>
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                  
                                </div>
                              </td>
                              
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
                                
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                            </tr>
							</xsl:for-each>
							</xsl:if>
							</xsl:if>
                        </xsl:for-each>
                      <!--Affichage des Lot_Local s'il y en a -->
                      
                      <xsl:if test="count(Mj_Lot_Local) > 0">
                        
                        <xsl:for-each select="Mj_Lot_Local">
                          
                          <tr>
                            
                            <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                              <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                              </div>
                            </td>
                            
                            <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                              <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                              </div>
                            </td>
                            
                            <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                              <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                              </div>
                            </td>
                            
                            <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                              <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                              </div>
                            </td>
                            
                            <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                              <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                              </div>
                            </td>
                            
                            <td style="padding-left: 0.4cm; border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                              
                              <div vertical-align="middle" line-height="0.3cm">
                                <xsl:value-of select="@lot"/>
                              </div>
                            </td>
                           
                            <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden; border-left: hidden;" valign="top" >
                              <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                              </div>
                            </td>
                            
                            <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                              <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                              </div>
                            </td>
                            
                            <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden; border-left: hidden;" valign="top">
                              <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                              </div>
                            </td>
                            
                            <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden; border-left: hidden;" valign="top">
                              <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                              </div>
                            </td>
                            
                            <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden; border-left: hidden;" valign="top">
                              <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                              </div>
                            </td>
                            
                            <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                              <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                              </div>
                            </td>
                            
                            <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                              <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                              </div>
                            </td>
                            
                            <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                              <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                              </div>
                            </td>
                            
                            <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                              <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                              </div>
                            </td>
                            
                            <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                              <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                              </div>
                            </td>
                            
                            <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                              <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                              </div>
                            </td>
                            
                            <td style="padding-right: 0.1cm; border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                              <div text-align="right" vertical-align="middle" line-height="0.3cm">
                              </div>
                            </td>
                            <xsl:if test="$type='complet'">
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>

                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>

                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>

                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>

                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>

                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                            </xsl:if>
                            
                            <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-right: hidden; border-bottom: hidden; border-top: hidden;" valign="top">
                              <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                              </div>
                            </td>
                            
                            <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
                              <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                              </div>
                            </td>
                          </tr>
                        </xsl:for-each>
                      </xsl:if>
                    </xsl:for-each>
                  </tbody>
                </table>
              </td>
            </tr>
            
            <!-- Affichage du pied du tableau des proprietes baties -->
            
            <tr>
              
              <td>
                
                <div keep-together="always" keep-with-previous="always">
                  
                  <table  table-layout="fixed" width="100%" style="border-collapse: collapse; border-color: black; border-right: 0.5pt; border-left: 0.5pt; border-top: 0pt; border-bottom: 0.5pt; border-style: solid; font-size: 8pt; padding-top: 0.2cm; padding-bottom: 0.1cm;" >
                    <td width="6.21%" />
                    <td width="6.9%" />
                    <td width="8.63%" />
                    <td width="5.18%" />
                    <td width="6.9%" />
                    <td width="8.63%" />
                    <td width="5.18%" />
                    <td width="6.9%" />
                    <td width="8.63%" />
                    <td width="5.18%" />
                    <td width="6.9%" />
                    <td width="23.81%" />
                    
                    <tbody>
                      
                      <xsl:for-each select="Mj/Mj_Compte_Communal | Mj/Mj_Compte_Communal_Parcelle">
                        
                        <tr>
                          <xsl:if test="$type='complet'">
                            <td>
                              <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;"/>
                            </td>

                            <td>
                              <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;"/>
                            </td>

                            <td>
                              <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;"/>
                            </td>

                            <td>
                              <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;">R EXO</div>
                            </td>

                            <td>

                              <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;">
                                <xsl:value-of select="@exo_com_bati_float"/>


                                EUR
                              </div>
                            </td>

                            <td>
                              <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;"/>
                            </td>

                            <td>
                              <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;">R EXO</div>
                            </td>

                            <td>

                              <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;">
                                <xsl:value-of select="@exo_dep_bati_float"/>


                                EUR
                              </div>
                            </td>

                            <td>
                              <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;"/>
                            </td>

                            <td>
                              <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;">R EXO</div>
                            </td>

                            <td>

                              <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;">
                                <xsl:value-of select="@exo_reg_bati_float"/>


                                EUR
                              </div>
                            </td>

                            <td>
                              <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;"/>
                            </td>
                          </xsl:if>
                        </tr>
                        
                        <tr>
                          
                          <td>
                             <div style="text-align: right; line-height: 0.60cm; vertical-align: middle;">REV IMPOSABLE</div>
                          </td>
                          
                          <td>

                            <div style="text-align: right; line-height: 0.60cm; vertical-align: middle;">
                              <xsl:value-of select="@rev_impo_bati_float"/>


                              EUR
                            </div>
                          </td>
                          
                          <td>
                            <div style="text-align: right; line-height: 0.60cm; vertical-align: middle;">COM</div>
                          </td>
                          
                          <td>
                            <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;"/>
                          </td>
                          
                          <td>
                            <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;"/>
                          </td>
                          
                          <td>
                            <div style="text-align: right; line-height: 0.60cm; vertical-align: middle;">DEP</div>
                          </td>
                          
                          <td>
                            <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;"/>
                          </td>
                          
                          <td>
                            <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;"/>
                          </td>
                          
                          <td>
                            <div style="text-align: right; line-height: 0.60cm; vertical-align: middle;">R</div>
                          </td>
                          
                          <td>
                            <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;"/>
                          </td>
                          
                          <td>
                            <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;"/>
                          </td>
                          
                          <td>
                            <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;"/>
                          </td>
                        </tr>
                        
                        <tr>
                          
                          <td>
                            <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;"/>
                          </td>
                          
                          <td>
                            <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;"/>
                          </td>
                          
                          <td>
                            <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;"/>
                          </td>
                          
                          <td>
                            <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;">R IMP</div>
                          </td>
                          
                          <td>

                            <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;">
                              <xsl:value-of select="@rev_impo_com_bati_float"/>


                              EUR
                            </div>
                          </td>
                          
                          <td>
                            <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;"/>
                          </td>
                          
                          <td>
                            <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;">R IMP</div>
                          </td>
                          
                          <td>

                            <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;">
                              <xsl:value-of select="@rev_impo_dep_bati_float"/>


                              EUR
                            </div>
                          </td>
                          
                          <td>
                            <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;"/>
                          </td>
                          
                          <td>
                            <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;">R IMP</div>
                          </td>
                          
                          <td>

                            <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;">
                              <xsl:value-of select="@rev_impo_reg_bati_float"/>


                              EUR
                            </div>
                          </td>
                          
                          <td>
                            <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;"/>
                          </td>
                        </tr>
                      </xsl:for-each>
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
            <!-- Affichage des proprietes non baties -->
            
            <tr>
              
              <td>
                
                <table table-layout="fixed" width="100%" style="border-collapse: collapse; font-size: 10pt;" CELLSPACING="0" CELLPADDING="0">
                  <tr>
                    <td width="2.07%"/>
                    <td width="5.18%"/>
                    <td width="4.14%"/>
                    <td width="4.14%"/>
                    <xsl:if test="$type='complet'">
                      <td width="27.26%"/>
                    </xsl:if>
                    <xsl:if test="not($type='complet')">
                      <td width="41.76%"/>
                    </xsl:if>
                    <td width="3.11%"/>
                    <td width="4.83%"/>
                    <td width="2.07%"/>
                    <td width="2.07%"/>
                    <td width="3.11%"/>
                    <td width="3.80%"/>
                    <td width="3.45%"/>
                    <td width="3.11%"/>
                    <td width="2.42%"/>
                    <td width="2.42%"/>
                    <td width="2.42%"/>
                    <td width="6.9%0"/>
                    <xsl:if test="$type='complet'">
                      <td width="3.11%"/>
                      <td width="2.07%"/>
                      <td width="2.07%"/>
                      <td width="5.18%"/>
                      <td width="2.07%"/>
                    </xsl:if>
                    <td width="2.07%"/>
                  </tr>
                  <!-- Affichage de l'en-tête des proprietes non baties -->
                  
                  <thead>
                    
                    <tr>
                      <xsl:if test="$type='complet'">
                        <td colspan="23" style="border-color: black; border-style: solid; border-right: hidden; border-left: hidden; border-top: hidden; border-width: 0.5pt; padding-top: 1cm; padding-bottom: 0.1cm;">
                          <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">PROPRIETES NON BATIES</div>
                        </td>
                      </xsl:if>
                      <xsl:if test="not($type='complet')">
                        <td colspan="18" style="border-color: black; border-style: solid; border-right: hidden; border-left: hidden; border-top: hidden; border-width: 0.5pt; padding-top: 1cm; padding-bottom: 0.1cm;">
                          <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">PROPRIETES NON BATIES</div>
                        </td>
                      </xsl:if>
                    </tr>
                    
                    <tr>
                      
                      <td colspan="6" style="border-color: black; border-style: solid; border-right: hidden; border-width: 0.5pt;">
                        <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">DESIGNATION DES PROPRIETES</div>
                      </td>

                      <xsl:if test="$type='complet'">
                        <td colspan="17" style="border-color: black; border-style: solid; border-left: hidden; border-width: 0.5pt;">
                          <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">EVALUATION</div>
                        </td>
                      </xsl:if>
                      <xsl:if test="not($type='complet')">
                        <td colspan="12" style="border-color: black; border-style: solid; border-left: hidden; border-width: 0.5pt;">
                          <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">EVALUATION</div>
                        </td>
                      </xsl:if>
                    </tr>
                    
                    <!-- Affichage des titres des colonnes des proprietes non baties -->
                    
                    <tr>
                      
                      <td style="border-color: black; border-width: 0.5pt; border-style: solid;">
                        <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">AN</div>
                      </td>
                      
                      <td style="border-color: black; border-width: 0.5pt; border-style: solid;">
                        <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">SECTION</div>
                      </td>
                      
                      <td style="border-color: black; border-width: 0.5pt; border-style: solid;">
                        <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">N°PLAN</div>
                      </td>
                      
                      <td style="border-color: black; border-width: 0.5pt; border-style: solid;">
                        <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">N° Voirie</div>
                      </td>
                      
                      <td style="border-color: black; border-width: 0.5pt; border-style: solid;">
                        <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">ADRESSE</div>
                      </td>
                      
                      <td style="border-color: black; border-width: 0.5pt; border-style: solid; border-left: hidden;">
                        <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">CODE RIVOLI</div>
                      </td>
                      
                      <td style="border-color: black; border-width: 0.5pt; border-style: solid;">
                        <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">N°PARC PRIM</div>
                      </td>
                      
                      <td style="border-color: black; border-width: 0.5pt; border-style: solid; border-right: hidden; border-left: hidden;">
                        <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">FP DP</div>
                      </td>
                      
                      <td style="border-color: black; border-width: 0.5pt; border-style: solid; border-left: hidden;">
                        <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">S TAR</div>
                      </td>
                      
                      <td style="border-color: black; border-width: 0.5pt; border-style: solid;">
                        <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">SUF</div>
                      </td>
                      
                      <td style="border-color: black; border-width: 0.5pt; border-style: solid;">
                        <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">GR/SS GR</div>
                      </td>
                      
                      <td style="border-color: black; border-width: 0.5pt; border-style: solid;">
                        <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">CLASSE</div>
                      </td>
                      
                      <td style="border-color: black; border-width: 0.5pt; border-style: solid;">
                        <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">NAT CULT</div>
                      </td>
                      
                      <!-- Creation d'une table pour afficher le titre de colonne (CONTENANCE HA A CA) -->
                      
                      <td colspan="3" style="border-color: black; border-width: 0.5pt; border-style: solid;">
                        
                        <table table-layout="fixed" style="font-size: 8pt; border-collapse: collapse;" width="100%">
                          <tbody>
                            
                            <tr>
                              <td colspan="3" style="padding-top: 0.05cm;">
                                <div style="text-align: center; vertical-align: middle; line-height: 0.3cm;">CONTENANCE</div>
                              </td>
                            </tr>
                            
                            <tr>
                              
                              <td width="33%">
                                <div style="text-align: center; vertical-align: middle; line-height: 0.3cm;">HA</div>
                              </td>
                              
                              <td width="33%">
                                <div style="text-align: center; vertical-align: middle; line-height: 0.3cm;">A</div>
                              </td>
                              
                              <td width="33%">
                                <div style="text-align: center; vertical-align: middle; line-height: 0.3cm;">CA</div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                      
                      <!-- Suite de l'affichage des titres des colonnes des proprietes non baties -->
                      
                      <td style="border-color: black; border-width: 0.5pt; border-style: solid;">
                        <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">REVENU CADASTRAL</div>
                      </td>

                      <xsl:if test="$type='complet'">
                        <td style="border-color: black; border-width: 0.5pt; border-style: solid;">
                          <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">COLL</div>
                        </td>

                        <td style="border-color: black; border-width: 0.5pt; border-style: solid;">
                          <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">NAT EXO</div>
                        </td>

                        <td style="border-color: black; border-width: 0.5pt; border-style: solid;">
                          <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">AN RET</div>
                        </td>

                        <td style="border-color: black; border-width: 0.5pt; border-style: solid;">
                          <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">FRACTION RC EXO</div>
                        </td>

                        <td style="border-color: black; border-width: 0.5pt; border-style: solid;">
                          <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">% EXO</div>
                        </td>
                      </xsl:if>
                      
                      <td style="border-color: black; border-width: 0.5pt; border-style: solid;">
                        <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">POS</div>
                      </td>
                    </tr>
                  </thead>
                  
                  <tfoot>
                    
                    <tr>
                      
                      <td style="border-color: black; border-width: 0.5pt; border-style: solid; border-right: hidden; border-left: hidden;">
                        <div>
                        </div>
                      </td>
                      
                      <td style="border-color: black; border-width: 0.5pt; border-style: solid; border-right: hidden; border-left: hidden;">
                        <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                        </div>
                      </td>
                      
                      <td style="border-color: black; border-width: 0.5pt; border-style: solid; border-right: hidden; border-left: hidden;">
                        <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                        </div>
                      </td>
                      
                      <td style="border-color: black; border-width: 0.5pt; border-style: solid; border-right: hidden; border-left: hidden;">
                        <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                        </div>
                      </td>
                      
                      <td style="border-color: black; border-width: 0.5pt; border-style: solid; border-right: hidden; border-left: hidden;">
                        <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                        </div>
                      </td>
                      
                      <td style="border-color: black; border-width: 0.5pt; border-style: solid; border-right: hidden; border-left: hidden;">
                        <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                        </div>
                      </td>
                      
                      <td style="border-color: black; border-width: 0.5pt; border-style: solid; border-right: hidden; border-left: hidden;">
                        <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                        </div>
                      </td>
                      
                      <td style="border-color: black; border-width: 0.5pt; border-style: solid; border-right: hidden; border-left: hidden;">
                        <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                        </div>
                      </td>
                      
                      <td style="border-color: black; border-width: 0.5pt; border-style: solid; border-right: hidden; border-left: hidden;">
                        <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                        </div>
                      </td>
                      
                      <td style="border-color: black; border-width: 0.5pt; border-style: solid; border-right: hidden; border-left: hidden;">
                        <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                        </div>
                      </td>
                      
                      <td style="border-color: black; border-width: 0.5pt; border-style: solid; border-right: hidden; border-left: hidden;">
                        <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                        </div>
                      </td>
                      
                      <td style="border-color: black; border-width: 0.5pt; border-style: solid; border-right: hidden; border-left: hidden;">
                        <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                        </div>
                      </td>
                      
                      <td style="border-color: black; border-width: 0.5pt; border-style: solid; border-right: hidden; border-left: hidden;">
                        <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                        </div>
                      </td>
                      
                      <td colspan="3" style="border-color: black; border-width: 0.5pt; border-style: solid; border-right: hidden; border-left: hidden;">
                        <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                        </div>
                      </td>
                      
                      <td style="border-color: black; border-width: 0.5pt; border-style: solid; border-right: hidden; border-left: hidden;">
                        <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                        </div>
                      </td>

                      <xsl:if test="$type='complet'">
                        <td style="border-color: black; border-width: 0.5pt; border-style: solid; border-right: hidden; border-left: hidden;">
                          <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                          </div>
                        </td>

                        <td style="border-color: black; border-width: 0.5pt; border-style: solid; border-right: hidden; border-left: hidden;">
                          <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                          </div>
                        </td>

                        <td style="border-color: black; border-width: 0.5pt; border-style: solid; border-right: hidden; border-left: hidden;">
                          <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                          </div>
                        </td>

                        <td style="border-color: black; border-width: 0.5pt; border-style: solid; border-right: hidden; border-left: hidden;">
                          <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                          </div>
                        </td>

                        <td style="border-color: black; border-width: 0.5pt; border-style: solid; border-right: hidden; border-left: hidden;">
                          <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                          </div>
                        </td>
                      </xsl:if>
                      
                      <td style="border-color: black; border-width: 0.5pt; border-style: solid; border-right: hidden;  border-left: hidden;">
                        <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                  <!-- Affichage des donnees des proprietes non baties -->
                  
                  <tbody>
                    
                    <tr>
                      
                      <td>
                        <div>
                        </div>
                      </td>
                    </tr>
                    
                    <xsl:for-each select="Mj/Mj_Compte_Communal/Mj_Parcelle | Mj/Mj_Compte_Communal_Parcelle/Mj_Parcelle">
						<xsl:sort select="@section" />
						<xsl:sort select="@num_plan" data-type="number"/>
                      <tr>
                        
                        <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
                          
                          <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                            <xsl:value-of select="@date"/>
                          </div>
                        </td>
                        
                        <td style="padding-right:0.1cm; border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
                          
                          <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                            <xsl:value-of select="@section"/>
                          </div>
                        </td>
                        
                        <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
                          
                          <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                            <xsl:value-of select="@num_plan"/>
                          </div>
                        </td>
                        
                        <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
                          
                          <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                            <xsl:value-of select="@num_voirie"/>
                          </div>
                        </td>
                        
                        <td style="padding-left:0.1cm; border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
                          
                          <div vertical-align="middle" line-height="0.5cm">
                            <xsl:value-of select="@adresse"/>
                          </div>
                        </td>
                        
                        <td style="padding-left:0.1cm; border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden; border-left: hidden;" valign="top">
                          
                          <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                            <xsl:value-of select="@code_rivoli"/>
                          </div>
                        </td>
                        
                        <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
                          
                          <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                            <xsl:value-of select="@num_parc_prim"/>
                          </div>
                        </td>
                        
                        <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden; border-left: hidden;" valign="top">
                          
                          <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                            <xsl:value-of select="@fp_dp"/>
                          </div>
                        </td>
                        
                        <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden; border-left: hidden;" valign="top">
                          
                          <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                            <xsl:value-of select="@s_tar"/>
                          </div>
                        </td>
                        
                        <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
                          
                          <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                            <xsl:value-of select="@suf"/>
                          </div>
                        </td>
                        
                        <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
                          
                          <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                            <xsl:value-of select="@grss_gr"/>
                          </div>
                        </td>
                        
                        <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
                          
                          <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                            <xsl:value-of select="@clas"/>
                          </div>
                        </td>
                        
                        <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
                          
                          <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                            <xsl:value-of select="@nat_cult"/>
                          </div>
                        </td>
                        
                        <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
                          
                          <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                            <xsl:value-of select="@ha"/>
                          </div>
                        </td>
                        
                        <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden; border-left: hidden;" valign="top">
                          
                          <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                            <xsl:value-of select="@a"/>
                          </div>
                        </td>
                        
                        <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden; border-left: hidden;" valign="top">
                          
                          <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                            <xsl:value-of select="@ca"/>
                          </div>
                        </td>
                        
                        <!-- Affichage de la colonne revenu cadastral lorsqu'il a une seule suf -->
                        
                        <xsl:if test="count(Mj_Suf)=1">
                          
                          <td style="padding-right:0.1cm; border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
                            
                            <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                              <xsl:value-of select="@revenu_cadastral"/>
                            </div>
                          </td>
						   <xsl:if test="$type='complet'">
                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>

                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">

                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                  <xsl:value-of select="Mj_Suf/@nat_exo"/>
                                </div>
                              </td>

                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>

                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>

                              <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
                                <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                                </div>
                              </td>
                            </xsl:if>
                            <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;">
                              <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
                              </div>
                            </td>
                        </xsl:if>
                        
                        <!-- Affichage de la colonne revenu cadastral lorsqu'il a plusieurs sufs -->
                        
                        <xsl:if test="count(Mj_Suf) > 1">
                          
                          <td style="padding-right:0.1cm; border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
                            <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                            </div>
                          </td>
						  <xsl:if test="$type='complet'">
                          <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
                            <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                            </div>
                          </td>

                          <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">

                            <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                              <xsl:value-of select="Mj_Suf/@nat_exo"/>
                            </div>
                          </td>

                          <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
                            <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                            </div>
                          </td>

                          <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
                            <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                            </div>
                          </td>

                          <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
                            <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                            </div>
                          </td>
                        </xsl:if>
                        
                        <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;">
                          <div style="text-align: center; line-height: 0.5cm; vertical-align: middle;">
                          </div>
                        </td>
                        </xsl:if>
                        
                        <!-- Suite de l'affichage des donnees des proprietes non baties -->
                        
                      </tr>
					
                      <!-- Affichage des Suf lorsqu'il y en a plusieurs -->
                      <xsl:choose>
							<xsl:when test="count(Mj_Suf) > 1">
                        
								<xsl:for-each select="Mj_Suf">
								  
								  <tr>
									
									<td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
									  <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
									  </div>
									</td>
									
									<td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
									  <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
									  </div>
									</td>
									
									<td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
									  <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
									  </div>
									</td>
									
									<td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
									  <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
									  </div>
									</td>
									
									<td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
									  <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
									  </div>
									</td>
									
									<td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden; border-left: hidden;" valign="top">
									  <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
									  </div>
									</td>
									
									<td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
									  <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
									  </div>
									</td>
									
									<td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden; border-left: hidden;" valign="top">
									  <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
									  </div>
									</td>
									
									<td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden; border-left: hidden;" valign="top">
									  
									  <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
										<xsl:value-of select="@s_tar"/>
									  </div>
									</td>
									
									<td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
									  
									  <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
										<xsl:value-of select="@suf"/>
									  </div>
									</td>
									
									<td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
									  
									  <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
										<xsl:value-of select="@grss_gr"/>
									  </div>
									</td>
									
									<td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
									  
									  <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
										<xsl:value-of select="@clas"/>
									  </div>
									</td>
									
									<td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
									  
									  <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
										<xsl:value-of select="@nat_cult"/>
									  </div>
									</td>
									
									<td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
									  
									  <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
										<xsl:value-of select="@ha"/>
									  </div>
									</td>
									
									<td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden; border-left: hidden;" valign="top">
									  
									  <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
										<xsl:value-of select="@a"/>
									  </div>
									</td>
									
									<td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden; border-left: hidden;" valign="top">
									  
									  <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
										<xsl:value-of select="@ca"/>
									  </div>
									</td>
									
									<td style="padding-right: 0.1cm; border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
									  
									  <div style="text-align: center;line-height: 0.3cm; vertical-align: middle;" >
										<xsl:value-of select="@revenu_cadastral"/>
									  </div>
									</td>
									<xsl:if test="$type='complet'">
									  <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
										<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
										</div>
									  </td>

									  <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">

										<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
										  <xsl:value-of select="@nat_exo"/>
										</div>
									  </td>

									  <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
										<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
										</div>
									  </td>

									  <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
										<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
										</div>
									  </td>

									  <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
										<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
										</div>
									  </td>
									</xsl:if>
									<td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;">
									  <div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
									  </div>
									</td>
								  </tr>
								  <xsl:if test="$type='complet'">
									<!-- Affichage des Exon_Suf lorsqu'il y en a -->
									<xsl:if test="count(Mj_Exon_Suf) &gt; 0">
									  <xsl:for-each select="Mj_Exon_Suf">
										<tr>
										  <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											</div>
										  </td>

										  <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											</div>
										  </td>

										  <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											</div>
										  </td>

										  <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											</div>
										  </td>

										  <td style="border-left: hidden; border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											</div>
										  </td>

										  <td style="padding-right: 0.1cm; border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;border-left: hidden;" valign="top">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											</div>
										  </td>

										  <td style="border-left: hidden; border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;border-right: hidden;">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											</div>
										  </td>

										  <td style="border-left: hidden; padding-right: 0.1cm; border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;border-right: hidden;border-left: hidden;" valign="top">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											</div>
										  </td>

										  <td style="padding-right: 0.1cm; border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											</div>
										  </td>

										  <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											</div>
										  </td>

										  <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											</div>
										  </td>

										  <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											</div>
										  </td>

										  <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											</div>
										  </td>

										  <td style="border-rigth: hidden; border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											</div>
										  </td>

										  <td style="border-rigth: hidden; padding-right: 0.1cm; border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;border-left: hidden;border-right: hidden;" valign="top">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											</div>
										  </td>

										  <td style="border-left: hidden; padding-right: 0.1cm; border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;border-left: hidden;" valign="top">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											</div>
										  </td>

										  <td style="padding-right: 0.1cm; border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											</div>
										  </td>

										  <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											  <xsl:value-of select="@ccolloc" />
											</div>
										  </td>

										  <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											  <xsl:value-of select="@nat_exo" />
											</div>
										  </td>

										  <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											  <xsl:value-of select="@pexn div 100" />
											</div>
										  </td>

										  <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											  <xsl:value-of select="@rcexnba div 100" />
											</div>
										  </td>

										  <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											</div>
										  </td>

										  <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											</div>
										  </td>
										</tr>
									  </xsl:for-each>
									</xsl:if>
								  </xsl:if>
								</xsl:for-each>
							  </xsl:when>
							  <xsl:when test="count(Mj_Suf)>0">
								<xsl:if test="$type='complet'">
								 <xsl:for-each select="Mj_Suf">
									<!-- Affichage des Exon_Suf lorsqu'il y en a -->
									<xsl:if test="count(Mj_Exon_Suf) &gt; 0">
									  <xsl:for-each select="Mj_Exon_Suf">
										<tr>
										  <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											</div>
										  </td>

										  <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											</div>
										  </td>

										  <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											</div>
										  </td>

										  <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											</div>
										  </td>

										  <td style="border-left: hidden; border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											</div>
										  </td>

										  <td style="padding-right: 0.1cm; border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;border-left: hidden;" valign="top">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											</div>
										  </td>

										  <td style="border-left: hidden; border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;border-right: hidden;">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											</div>
										  </td>

										  <td style="border-left: hidden; padding-right: 0.1cm; border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;border-right: hidden;border-left: hidden;" valign="top">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											</div>
										  </td>

										  <td style="padding-right: 0.1cm; border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											</div>
										  </td>

										  <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											</div>
										  </td>

										  <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											</div>
										  </td>

										  <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											</div>
										  </td>

										  <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											</div>
										  </td>

										  <td style="border-rigth: hidden; border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											</div>
										  </td>

										  <td style="border-rigth: hidden; padding-right: 0.1cm; border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;border-left: hidden;border-right: hidden;" valign="top">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											</div>
										  </td>

										  <td style="border-left: hidden; padding-right: 0.1cm; border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;border-left: hidden;" valign="top">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											</div>
										  </td>

										  <td style="padding-right: 0.1cm; border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;" valign="top">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											</div>
										  </td>

										  <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											  <xsl:value-of select="@ccolloc" />
											</div>
										  </td>

										  <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											  <xsl:value-of select="@nat_exo" />
											</div>
										  </td>

										  <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											  <xsl:value-of select="@pexn div 100" />
											</div>
										  </td>

										  <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											  <xsl:value-of select="@rcexnba div 100" />
											</div>
										  </td>

										  <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											</div>
										  </td>

										  <td style="border-style: solid; border-width: 0.5pt; border-color: black; border-bottom: hidden; border-top: hidden;">
											<div style="text-align: center; line-height: 0.3cm; vertical-align: middle;">
											</div>
										  </td>
										</tr>
									  </xsl:for-each>
									</xsl:if>
									</xsl:for-each>
									</xsl:if>
								 </xsl:when>
						</xsl:choose>
                    </xsl:for-each>
                  </tbody>
                </table>
              </td>
            </tr>
            
            <!-- Affichage du pied du tableau des proprietes non baties -->
            
            <tr>
              
              <td>
                
                <div keep-together="always" keep-with-previous="always">
                  
                  <table width="100%" table-layout="fixed" style="border-color: black; border-right: 0.5pt; border-left: 0.5pt; border-top: 0pt; border-bottom: 0.5pt; border-style: solid; border-collapse: collapse; font-size: 8pt; padding-top: 0.2cm; padding-bottom: 0.1cm;">

                    <td width="3.45%" />
                    <td width="3.45%" />
                    <td width="3.45%" />
                    <td width="3.45%" />
                    <td width="13.46%" />
                    <td width="6.9%" />
                    <td width="6.9%" />
                    <td width="5.18%" />
                    <td width="6.9%" />
                    <td width="6.9%" />
                    <td width="5.18%" />
                    <td width="6.9%" />
                    <td width="6.9%" />
                    <td width="5.18%" />
                    <td width="6.9%" />
                    <td width="7.94%" />
                    
                    <tbody>
                      
                      <xsl:for-each select="Mj/Mj_Compte_Communal | Mj/Mj_Compte_Communal_Parcelle">
                        
                        <tr>

                          <td>
                            <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;">
                            </div>
                          </td>
                          
                          <td>
                            <div style="text-align: center; line-height: 0.20cm; vertical-align: middle;">HA</div>
                          </td>
                          
                          <td>
                            <div style="text-align: center; line-height: 0.20cm; vertical-align: middle;">A</div>
                          </td>

                          <td>
                            <div style="text-align: center; line-height: 0.20cm; vertical-align: middle;">CA</div>
                          </td>
                          <xsl:if test="$type='complet'">
                            <td>
                              <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;"/>
                            </td>

                            <td>
                              <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;"/>
                            </td>

                            <td>
                              <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;"/>
                            </td>

                            <td>
                              <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;">R EXO</div>
                            </td>

                            <td>

                              <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;">
                                <xsl:value-of select="@exo_com_par_float"/>


                                EUR
                              </div>
                            </td>

                            <td>
                              <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;"/>
                            </td>

                            <td>
                              <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;">R EXO</div>
                            </td>

                            <td>

                              <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;">
                                <xsl:value-of select="@exo_tax_ad_par_float"/>


                                EUR
                              </div>
                            </td>

                            <td>
                              <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;"/>
                            </td>

                            <td>
                              <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;"></div>
                            </td>

                            <td>

                              <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;">
                              </div>
                            </td>

                            <td>
                              <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;"/>
                            </td>
                          </xsl:if>
                        </tr>
                        
                        <tr>
                          
                          <td>
                            <div style="text-align: right; line-height: 0.60cm; vertical-align: middle;">CONT</div>
                          </td>
                          
                          <td>
                            <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;"/>
                          </td>
                          
                          <td>
                            <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;"/>
                          </td>
                          
                          <td>
                            <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;"/>
                          </td>
                          
                          <td>
                            <div style="text-align: right; line-height: 0.60cm; vertical-align: middle;">REV IMPOSABLE</div>
                          </td>
                          
                          <td>
                            <div style="text-align: right; line-height: 0.60cm; vertical-align: middle;">
                              <xsl:value-of select="@rev_impo_par_float"/>


                              EUR
                            </div>
                          </td>
                          
                          <td>
                            <div style="text-align: right; line-height: 0.60cm; vertical-align: middle;">COM</div>
                          </td>
                          
                          <td>
                            <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;"/>
                          </td>
                          
                          <td>
                            <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;"/>
                          </td>
                          
                          <td>
                            <div style="text-align: right; line-height: 0.60cm; vertical-align: middle;">TAXE AD</div>
                          </td>
                          
                          <td>
                            <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;"/>
                          </td>
                          
                          <td>
                            <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;"/>
                          </td>
                          
                          <td>
                            <div style="text-align: right; line-height: 0.60cm; vertical-align: middle;"></div>
                          </td>
                          
                          <td>
                            <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;"/>
                          </td>
                          
                          <td>
                            <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;"/>
                          </td>
                          
                          <td padding-right="0.8cm">
                            <div style="text-align: right; line-height: 0.60cm; vertical-align: middle;">MAJ POS</div>
                          </td>
                        </tr>
                        
                        <tr>
                          
                          <td>
                            <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;">
                            </div>
                          </td>
                          
                          <td>
                            
                            <div style="text-align: center; line-height: 0.20cm; vertical-align: middle;">
                              <xsl:value-of select="@ha"/>
                            </div>
                          </td>
                          
                          <td>
                            
                            <div style="text-align: center; line-height: 0.20cm; vertical-align: middle;">
                              <xsl:value-of select="@a"/>
                            </div>
                          </td>
                          
                          <td>
                            
                            <div style="text-align: center; line-height: 0.20cm; vertical-align: middle;">
                              <xsl:value-of select="@ca"/>
                            </div>
                          </td>
                          
                          <td>
                            <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;"/>
                          </td>
                          
                          <td>
                            <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;"/>
                          </td>
                          
                          <td>
                            <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;"/>
                          </td>
                          
                          <td>
                            <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;">R IMP</div>
                          </td>
                          
                          <td>
                            
                            <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;">
                              <xsl:value-of select="@rev_impo_com_par_float"/>


                              EUR
                            </div>
                          </td>
                          
                          <td>
                            <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;"/>
                          </td>
                          
                          <td>
                            <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;">R IMP</div>
                          </td>
                          
                          <td>
                            
                            <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;">
                              <xsl:value-of select="@rev_impo_taxe_ad_par_float"/>


                              EUR
                            </div>
                          </td>
                          
                          <td>
                            <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;"/>
                          </td>
                          
                          <td>
                            <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;"></div>
                          </td>
                          
                          <td>
                            
                            <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;">
                            </div>
                          </td>
                          
                          <td>
                            <div style="text-align: right; line-height: 0.20cm; vertical-align: middle;"/>
                          </td>
                        </tr>
                      </xsl:for-each>
                    </tbody>
                    
                    <!-- Fin de la table du pied du tableau des propiétés non baties -->
                  </table>
                </div>
              </td>
            </tr>
            <!-- Fin du corps du tableau global -->
          </tbody>
          <!-- Fin du tableau global -->
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>