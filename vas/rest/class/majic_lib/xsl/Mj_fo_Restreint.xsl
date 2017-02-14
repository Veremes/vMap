<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
   <xsl:template match="/">
      <fo:root xmlns:fo="http://www.w3.org/1999/XSL/Format">
         <fo:layout-master-set>
            <fo:simple-page-master master-name="simple" page-height="21cm" page-width="29.7cm" margin-top="0.5cm" margin-bottom="0.5cm" margin-left="0.5cm" margin-right="0.5cm">
               <fo:region-body margin="0.5cm 0 0.5cm 0" />
            </fo:simple-page-master>
         </fo:layout-master-set>

         <fo:page-sequence master-reference="simple" font-family="Times">
<!-- Tableau global basé sur la structure de la première ligne du relevé de propriété -->
            <fo:flow flow-name="xsl-region-body">
               <fo:table table-layout="fixed" width="100%" border-collapse="collapse" font-size="7pt">
                  <fo:table-column column-width="28.7" />

<!-- Début de l'en-tête qui se retrouvera sur chaque page du RP -->
                  <fo:table-header>
				  <fo:table-row>
                  <fo:table-cell>
                  <fo:table table-layout="fixed" width="100%" border-collapse="collapse" font-size="7pt">
				  <fo:table-column column-width="1.2cm" />

                  <fo:table-column column-width="0.6cm" />

                  <fo:table-column column-width="0.6cm" />

                  <fo:table-column column-width="0.9cm" />

                  <fo:table-column column-width="0.9cm" />

                  <fo:table-column column-width="6.4cm" />

                  <fo:table-column column-width="15.4cm" />

                  <fo:table-column column-width="1.8cm" />

                  <fo:table-column column-width="0.9cm" />
				  <fo:table-body>
                     <xsl:for-each select="Mj/Mj_Compte_Communal | Mj/Mj_Compte_Communal_Parcelle">
                        <fo:table-row>
                           <fo:table-cell border-color="black" border-style="solid" border-right="hidden" border-width="0.5pt">
                              <fo:block text-align="center" line-height="0.25cm" vertical-align="middle">ANNEE DE MAJ</fo:block>
                           </fo:table-cell>

                           <fo:table-cell border-color="black" border-style="solid" border-right="hidden" border-width="0.5pt">
                              <fo:block text-align="center" line-height="0.5cm" vertical-align="middle">
                                 <xsl:value-of select="@annee_de_maj" />
                              </fo:block>
                           </fo:table-cell>

                           <fo:table-cell border-color="black" border-style="solid" border-right="hidden" border-width="0.5pt">
                              <fo:block text-align="center" line-height="0.25cm" vertical-align="middle">DEP DIR</fo:block>
                           </fo:table-cell>

                           <fo:table-cell border-color="black" border-style="solid" border-right="hidden" border-width="0.5pt">
                              <fo:block text-align="center" line-height="0.5cm" vertical-align="middle">
                                 <xsl:value-of select="@dep_dir" />
                              </fo:block>
                           </fo:table-cell>

                           <fo:table-cell border-color="black" border-style="solid" border-right="hidden" border-width="0.5pt">
                              <fo:block text-align="center" line-height="0.5cm" vertical-align="middle">COM</fo:block>
                           </fo:table-cell>

                           <fo:table-cell border-color="black" border-style="solid" padding-left="0.1cm" border-width="0.5pt">
                              <fo:block line-height="0.5cm" vertical-align="middle">
                                 <xsl:value-of select="@com" />
                              </fo:block>
                           </fo:table-cell>

                           <fo:table-cell>
                              <fo:block text-align="center" line-height="0.5cm" vertical-align="middle" font-size="16pt" font-style="italic">RELEVE DE PROPRIETE ( 
                              <fo:page-number />

                              / 
                              <fo:page-number-citation ref-id="theEnd" />

                              )</fo:block>
                           </fo:table-cell>

                           <fo:table-cell border-color="black" border-style="solid" border-right="hidden" border-width="0.5pt">
                              <fo:block text-align="center" line-height="0.25cm" vertical-align="middle">NUMERO COMMUNAL</fo:block>
                           </fo:table-cell>

                           <fo:table-cell border-color="black" border-style="solid" border-width="0.5pt">
                              <fo:block text-align="center" line-height="0.5cm" vertical-align="middle">
                                 <xsl:value-of select="substring(@numero_communal,6)" />
                              </fo:block>
                           </fo:table-cell>
                        </fo:table-row>
                     </xsl:for-each>
					 </fo:table-body>
					 </fo:table>
					 </fo:table-cell>
                     </fo:table-row>

<!-- Affichage de la ligne titre "PROPRIETAIRE" -->
                     <fo:table-row>
                        <fo:table-cell>
                           <fo:table table-layout="fixed" width="100%" border-collapse="collapse" font-size="7pt">
                              <fo:table-column column-width="28.7cm" />

                              <fo:table-body>
                                 <fo:table-row>
                                    <fo:table-cell padding-top="0.5cm" padding-bottom="0.1cm">
                                       <fo:block font-size="8pt" text-align="center">PROPRIETAIRE</fo:block>
                                    </fo:table-cell>
                                 </fo:table-row>
                              </fo:table-body>
                           </fo:table>
                        </fo:table-cell>
                     </fo:table-row>

<!-- Affichage du tableau proprietaire -->
                     <fo:table-row>
                        <fo:table-cell>
                           <fo:table table-layout="fixed" border-color="black" border="0.5pt" border-style="solid" border-collapse="collapse" width="100%" font-size="8pt" padding-top="0.2cm" padding-bottom="0.1cm">
                              <fo:table-column column-width="28.7cm" />

                              

                              <fo:table-body>
                                 <xsl:for-each select="Mj/Mj_Compte_Communal/Mj_Proprietaire | Mj/Mj_Compte_Communal_Parcelle/Mj_Proprietaire">
                                    <fo:table-row>
                                       <fo:table-cell>
                                          <fo:block>
                                          <xsl:value-of select="@l_ccodro" />

                                            
                                          <xsl:value-of select="@l_ccodem" />

                                            
                                          <xsl:value-of select="@dnuper" />

                                            
                                          <xsl:value-of select="@proprietaire_nom_tiers" />
                                          </fo:block>
                                       </fo:table-cell>
                                    </fo:table-row>

                                    <fo:table-row>
                                       <fo:table-cell padding-left="0.3cm">
                                          <fo:block>
                                             <xsl:value-of select="@proprietaire_adresse" />
                                          </fo:block>
                                       </fo:table-cell>
                                    </fo:table-row>
                                 </xsl:for-each>
                              </fo:table-body>
                           </fo:table>
                        </fo:table-cell>
                     </fo:table-row>
                  </fo:table-header>

<!-- Fin de l'en-tête -->
<!-- Début du corps du tableau global -->
                  <fo:table-body>
<!-- Affichage des poprietes baties -->
                     <fo:table-row>
                        <fo:table-cell>
                           <fo:table table-layout="fixed" width="100%" border-collapse="collapse" font-size="7pt">
                              <fo:table-column column-width="0.6cm" />

                              <fo:table-column column-width="1.2cm" />

                              <fo:table-column column-width="1cm" />

                              <fo:table-column column-width="0.4cm" />

                              <fo:table-column column-width="1.2cm" />

                              <fo:table-column column-width="11.3cm" />

                              <fo:table-column column-width="0.9cm" />

                              <fo:table-column column-width="0.6cm" />

                              <fo:table-column column-width="0.6cm" />

                              <fo:table-column column-width="0.6cm" />

                              <fo:table-column column-width="1.2cm" />

                              <fo:table-column column-width="1.8cm" />

                              <fo:table-column column-width="0.7cm" />

                              <fo:table-column column-width="0.7cm" />

                              <fo:table-column column-width="0.4cm" />

                              <fo:table-column column-width="1.2cm" />

                              <fo:table-column column-width="0.6cm" />

                              <fo:table-column column-width="2.4cm" />

                              <fo:table-column column-width="0.6cm" />

                              <fo:table-column column-width="0.7cm" />

<!-- Affichage de l'en-tête des propriétés baties -->
                              <fo:table-header>
                                 <fo:table-row>
                                    <fo:table-cell border-color="black" border-style="solid" number-columns-spanned="20" border-left="hidden" border-right="hidden" border-top="hidden" border-bottom="hidden" border-width="0.5pt" padding-top="1cm" padding-bottom="0.1cm">
                                       <fo:block text-align="center" font-size="8pt" line-height="0.5cm" vertical-align="middle">PROPRIETES BATIES</fo:block>
                                    </fo:table-cell>
                                 </fo:table-row>

                                 <fo:table-row>
                                    <fo:table-cell border-color="black" border-style="solid" number-columns-spanned="7" border-right="hidden" border-bottom="hidden" border-width="0.5pt">
                                       <fo:block text-align="center" font-size="8pt" line-height="0.5cm" vertical-align="middle">DESIGNATION DES PROPRIETES</fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-style="solid" number-columns-spanned="5" border-left="hidden" border-bottom="hidden" border-right="hidden" border-width="0.5pt">
                                       <fo:block text-align="center" font-size="8pt" line-height="0.5cm" vertical-align="middle">IDENTIFICATION DU LOCAL</fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-style="solid" number-columns-spanned="8" border-left="hidden" border-bottom="hidden" border-width="0.5pt">
                                       <fo:block text-align="center" font-size="8pt" line-height="0.5cm" vertical-align="middle">EVALUATION DU LOCAL</fo:block>
                                    </fo:table-cell>
                                 </fo:table-row>

<!-- Affichage des titres des colonnes des propriétés baties -->
                                 <fo:table-row>
                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden">
                                      <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">AN</fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">SECTION</fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">N°PLAN</fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">CP</fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">N° Voirie</fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">ADRESSE</fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-left="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">CODE RIVOLI</fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">BAT</fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">ENT</fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">NIV</fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">N°PORTE</fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">N°INVAR</fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">S TAR</fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">M EVAL</fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">AF</fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">NAT LOC</fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">CAT</fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">REVENU CADASTRAL</fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">TX OM</fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">COEF</fo:block>
                                    </fo:table-cell>
                                 </fo:table-row>
                              </fo:table-header>

                              <fo:table-footer>
                                 <fo:table-row>
                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-left="hidden">
                                       <fo:block>
                                       </fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-left="hidden">
                                       <fo:block>
                                       </fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-left="hidden">
                                       <fo:block>
                                       </fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-left="hidden">
                                       <fo:block>
                                       </fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-left="hidden">
                                       <fo:block>
                                       </fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-left="hidden">
                                       <fo:block>
                                       </fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-left="hidden">
                                       <fo:block>
                                       </fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-left="hidden">
                                       <fo:block>
                                       </fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-left="hidden">
                                       <fo:block>
                                       </fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-left="hidden">
                                       <fo:block>
                                       </fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-left="hidden">
                                       <fo:block>
                                       </fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-left="hidden">
                                       <fo:block>
                                       </fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-left="hidden">
                                       <fo:block>
                                       </fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-left="hidden">
                                       <fo:block>
                                       </fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-left="hidden">
                                       <fo:block>
                                       </fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-left="hidden">
                                       <fo:block>
                                       </fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-left="hidden">
                                       <fo:block>
                                       </fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-left="hidden">
                                       <fo:block>
                                       </fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-left="hidden">
                                       <fo:block>
                                       </fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-left="hidden">
                                       <fo:block>
                                       </fo:block>
                                    </fo:table-cell>
                                 </fo:table-row>
                              </fo:table-footer>

<!-- Affichage des données des propriétés baties -->
                              <fo:table-body>
                                 <fo:table-row>
                                    <fo:table-cell>
                                       <fo:block>
                                       </fo:block>
                                    </fo:table-cell>
                                 </fo:table-row>

                                 <xsl:for-each select="Mj/Mj_Compte_Communal/Mj_Bati | Mj/Mj_Compte_Communal_Parcelle/Mj_Bati">
								  <xsl:sort select="@section" />
									<xsl:sort select="@num_plan" data-type="number"/>
                                    <fo:table-row>
                                       <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                          <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">
                                             <xsl:value-of select="@date" />
                                          </fo:block>
                                       </fo:table-cell>

                                       <fo:table-cell padding-right="0.1cm" border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                          <fo:block text-align="right" vertical-align="middle" line-height="0.5cm">
                                             <xsl:value-of select="@section" />
                                          </fo:block>
                                       </fo:table-cell>

                                       <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                          <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">
                                             <xsl:value-of select="@num_plan" />
                                          </fo:block>
                                       </fo:table-cell>

                                       <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                          <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">
                                             <xsl:value-of select="@cp" />
                                          </fo:block>
                                       </fo:table-cell>

                                       <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                          <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">
                                             <xsl:value-of select="@voirie" />
                                          </fo:block>
                                       </fo:table-cell>

                                       <fo:table-cell padding-left="0.1cm" border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                          <fo:block vertical-align="middle" line-height="0.5cm">
                                             <xsl:value-of select="@adresse" />
                                          </fo:block>
                                       </fo:table-cell>

                                       <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-left="hidden" border-bottom="hidden" border-top="hidden">
                                          <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">
                                             <xsl:value-of select="@code_rivoli" />
                                          </fo:block>
                                       </fo:table-cell>

                                       <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                          <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">
                                             <xsl:value-of select="@bat" />
                                          </fo:block>
                                       </fo:table-cell>

                                       <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden" border-left="hidden">
                                          <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">
                                             <xsl:value-of select="@ent" />
                                          </fo:block>
                                       </fo:table-cell>

                                       <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden" border-left="hidden">
                                          <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">
                                             <xsl:value-of select="@niv" />
                                          </fo:block>
                                       </fo:table-cell>

                                       <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden" border-left="hidden">
                                          <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">
                                             <xsl:value-of select="@num_de_porte" />
                                          </fo:block>
                                       </fo:table-cell>

                                       <fo:table-cell padding-left="0.1cm" border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                          <fo:block vertical-align="middle" line-height="0.5cm">
                                             <xsl:value-of select="@num_invar" />
                                          </fo:block>
                                       </fo:table-cell>

<!--Affichage du PEV lorsqu'il n'y en a qu'un (même ligne) -->
                                       <xsl:if test="count(Mj_Pev) = 1">
                                          <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                             <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">
                                                <xsl:value-of select="@s_tar" />
                                             </fo:block>
                                          </fo:table-cell>

                                          <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                             <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">
                                                <xsl:value-of select="@m_eva" />
                                             </fo:block>
                                          </fo:table-cell>

                                          <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                             <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">
                                                <xsl:value-of select="@af" />
                                             </fo:block>
                                          </fo:table-cell>

                                          <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                             <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">
                                                <xsl:value-of select="@nat_loc" />
                                             </fo:block>
                                          </fo:table-cell>

                                          <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                             <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">
                                                <xsl:value-of select="@cat" />
                                             </fo:block>
                                          </fo:table-cell>

                                          <fo:table-cell padding-right="0.1cm" border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                             <fo:block text-align="right" vertical-align="middle" line-height="0.5cm">
                                                <xsl:value-of select="@revenu_cadastral" />
                                             </fo:block>
                                          </fo:table-cell>

                                          <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                             <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">
                                                <xsl:value-of select="@tx_om" />
                                             </fo:block>
                                          </fo:table-cell>

                                          <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-bottom="hidden" border-top="hidden">
                                             <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">
                                             </fo:block>
                                          </fo:table-cell>
                                       </xsl:if>

<!--Affichage du premier PEV lorsqu'il y en a plusieurs (même ligne) -->
                                       <xsl:if test="count(Mj_Pev) &gt; 1">
                                          <xsl:for-each select="Mj_Pev">
                                             <xsl:if test="position()=1">
                                                <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">
                                                      <xsl:value-of select="@s_tar" />
                                                   </fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">
                                                      <xsl:value-of select="../@m_eva" />
                                                   </fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">
                                                      <xsl:value-of select="@af" />
                                                   </fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">
                                                      <xsl:value-of select="../@nat_loc" />
                                                   </fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">
                                                      <xsl:value-of select="@cat" />
                                                   </fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell padding-right="0.1cm" border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                   <fo:block text-align="right" vertical-align="middle" line-height="0.5cm">
                                                      <xsl:value-of select="@revenu_cadastral" />
                                                   </fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">
                                                   </fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-bottom="hidden" border-top="hidden">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">
                                                   </fo:block>
                                                </fo:table-cell>
                                             </xsl:if>
                                          </xsl:for-each>
                                       </xsl:if>
                                    </fo:table-row>

<!--Affichage des PEV suivants (lignes suivantes) -->
                                    <xsl:if test="count(Mj_Pev) &gt; 1">
                                       <xsl:for-each select="Mj_Pev">
                                          <xsl:if test="position()&gt;1">
                                             <fo:table-row>
                                                <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                   </fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                   </fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                   </fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                   </fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                   </fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                   </fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden" border-left="hidden">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                   </fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                   </fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden" border-left="hidden">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                   </fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden" border-left="hidden">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                   </fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden" border-left="hidden">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                   </fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                   </fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                      <xsl:value-of select="@s_tar" />
                                                   </fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                      <xsl:value-of select="../@m_eva" />
                                                   </fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                      <xsl:value-of select="@af" />
                                                   </fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                      <xsl:value-of select="../@nat_loc" />
                                                   </fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                      <xsl:value-of select="@cat" />
                                                   </fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell padding-right="0.1cm" border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                   <fo:block text-align="right" vertical-align="middle" line-height="0.25cm">
                                                      <xsl:value-of select="@revenu_cadastral" />
                                                   </fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                   </fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-bottom="hidden" border-top="hidden">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                   </fo:block>
                                                </fo:table-cell>
                                             </fo:table-row>

                                             <fo:table-row>
                                                <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                   </fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                   </fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                   </fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                   </fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                   </fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                   </fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden" border-left="hidden">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                   </fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                   </fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden" border-left="hidden">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                   </fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden" border-left="hidden">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                   </fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden" border-left="hidden">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                   </fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                   </fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                   </fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                   </fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                   </fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                   </fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                   </fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell padding-right="0.1cm" border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                   <fo:block text-align="right" vertical-align="middle" line-height="0.25cm">
                                                      <xsl:value-of select="../@revenu_cadastral" />
                                                   </fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                      <xsl:value-of select="../@tx_om" />
                                                   </fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-bottom="hidden" border-top="hidden">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                   </fo:block>
                                                </fo:table-cell>
                                             </fo:table-row>
                                          </xsl:if>
                                       </xsl:for-each>
                                    </xsl:if>

<!--Affichage des Lot_Local s'il y en a -->
                                    <xsl:if test="count(Mj_Lot_Local) &gt; 0">
                                       <xsl:for-each select="Mj_Lot_Local">
                                          <fo:table-row>
                                             <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                </fo:block>
                                             </fo:table-cell>

                                             <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                </fo:block>
                                             </fo:table-cell>

                                             <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                </fo:block>
                                             </fo:table-cell>

                                             <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                </fo:block>
                                             </fo:table-cell>

                                             <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                </fo:block>
                                             </fo:table-cell>

                                             <fo:table-cell padding-left="0.4cm" border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                <fo:block vertical-align="middle" line-height="0.25cm">
                                                   <xsl:value-of select="@lot" />
                                                </fo:block>
                                             </fo:table-cell>

                                             <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden" border-left="hidden">
                                                <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                </fo:block>
                                             </fo:table-cell>

                                             <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                </fo:block>
                                             </fo:table-cell>

                                             <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden" border-left="hidden">
                                                <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                </fo:block>
                                             </fo:table-cell>

                                             <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden" border-left="hidden">
                                                <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                </fo:block>
                                             </fo:table-cell>

                                             <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden" border-left="hidden">
                                                <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                </fo:block>
                                             </fo:table-cell>

                                             <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                </fo:block>
                                             </fo:table-cell>

                                             <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                </fo:block>
                                             </fo:table-cell>

                                             <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                </fo:block>
                                             </fo:table-cell>

                                             <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                </fo:block>
                                             </fo:table-cell>

                                             <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                </fo:block>
                                             </fo:table-cell>

                                             <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                </fo:block>
                                             </fo:table-cell>

                                             <fo:table-cell padding-right="0.1cm" border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                <fo:block text-align="right" vertical-align="middle" line-height="0.25cm">
                                                </fo:block>
                                             </fo:table-cell>

                                             <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                </fo:block>
                                             </fo:table-cell>

                                             <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-bottom="hidden" border-top="hidden">
                                                <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                </fo:block>
                                             </fo:table-cell>
                                          </fo:table-row>
                                       </xsl:for-each>
                                    </xsl:if>
                                 </xsl:for-each>
                              </fo:table-body>
                           </fo:table>
                        </fo:table-cell>
                     </fo:table-row>

<!-- Affichage du pied du tableau des proprietes baties -->
                     <fo:table-row>
                        <fo:table-cell>
                           <fo:block keep-together="always" keep-with-previous="always">
                              <fo:table table-layout="fixed" border-collapse="collapse" width="28.7cm" border-color="black" border-right="0.5pt" border-left="0.5pt" border-top="0pt" border-bottom="0.5pt" border-style="solid" font-size="6pt" padding-top="0.2cm" padding-bottom="0.1cm">
                                 <fo:table-column column-width="1.8cm" />

                                 <fo:table-column column-width="2cm" />

                                 <fo:table-column column-width="2.5cm" />

                                 <fo:table-column column-width="1.5cm" />

                                 <fo:table-column column-width="2cm" />

                                 <fo:table-column column-width="2.5cm" />

                                 <fo:table-column column-width="1.5cm" />

                                 <fo:table-column column-width="2cm" />

                                 <fo:table-column column-width="2.5cm" />

                                 <fo:table-column column-width="1.5cm" />

                                 <fo:table-column column-width="2cm" />

                                 <fo:table-column column-width="6.9cm" />

                                 <fo:table-body>
                                    <xsl:for-each select="Mj/Mj_Compte_Communal | Mj/Mj_Compte_Communal_Parcelle">
                                       
                                       <fo:table-row>
                                          <fo:table-cell>
                                             <fo:block text-align="left" line-height="0.60cm" vertical-align="middle">REV IMPOSABLE</fo:block>
                                          </fo:table-cell>

                                          <fo:table-cell>
                                             <fo:block text-align="right" line-height="0.60cm" vertical-align="middle">
                                             <xsl:value-of select="@rev_impo_bati_float" />

                                             EUR</fo:block>
                                          </fo:table-cell>

                                          <fo:table-cell>
                                             <fo:block text-align="right" line-height="0.60cm" vertical-align="middle">COM</fo:block>
                                          </fo:table-cell>
										  
										  <fo:table-cell>
                                             <fo:block text-align="right" line-height="0.20cm" vertical-align="middle"></fo:block>
                                          </fo:table-cell>
										  
										  <fo:table-cell>
                                             <fo:block text-align="right" line-height="0.20cm" vertical-align="middle"></fo:block>
                                          </fo:table-cell>

                                          <fo:table-cell >
                                             <fo:block text-align="right" line-height="0.60cm" vertical-align="middle">DEP</fo:block>
                                          </fo:table-cell>
										  
										  <fo:table-cell>
                                             <fo:block text-align="right" line-height="0.20cm" vertical-align="middle"></fo:block>
                                          </fo:table-cell>
										  
										  <fo:table-cell>
                                             <fo:block text-align="right" line-height="0.20cm" vertical-align="middle"></fo:block>
                                          </fo:table-cell>

                                          <fo:table-cell>
                                             <fo:block text-align="right" line-height="0.60cm" vertical-align="middle">R</fo:block>
                                          </fo:table-cell>
										  
										  <fo:table-cell>
                                             <fo:block text-align="right" line-height="0.20cm" vertical-align="middle"></fo:block>
                                          </fo:table-cell>
										  
										  <fo:table-cell>
                                             <fo:block text-align="right" line-height="0.20cm" vertical-align="middle"></fo:block>
                                          </fo:table-cell>
										  
										  <fo:table-cell>
                                             <fo:block text-align="right" line-height="0.20cm" vertical-align="middle"></fo:block>
                                          </fo:table-cell>
                                       </fo:table-row>

                                       <fo:table-row>
										  <fo:table-cell>
                                             <fo:block text-align="right" line-height="0.20cm" vertical-align="middle"></fo:block>
                                          </fo:table-cell>
										  
										  <fo:table-cell>
                                             <fo:block text-align="right" line-height="0.20cm" vertical-align="middle"></fo:block>
                                          </fo:table-cell>
										  
										  <fo:table-cell>
                                             <fo:block text-align="right" line-height="0.20cm" vertical-align="middle"></fo:block>
                                          </fo:table-cell>
										  
                                          <fo:table-cell >
                                             <fo:block text-align="right" line-height="0.20cm" vertical-align="middle">R IMP</fo:block>
                                          </fo:table-cell>

                                          <fo:table-cell>
                                             <fo:block text-align="right" line-height="0.20cm" vertical-align="middle">
                                             <xsl:value-of select="@rev_impo_com_bati_float" />

                                             EUR</fo:block>
                                          </fo:table-cell>
										  
										  <fo:table-cell>
                                             <fo:block text-align="right" line-height="0.20cm" vertical-align="middle"></fo:block>
                                          </fo:table-cell>

                                          <fo:table-cell >
                                             <fo:block text-align="right" line-height="0.20cm" vertical-align="middle">R IMP</fo:block>
                                          </fo:table-cell>

                                          <fo:table-cell>
                                             <fo:block text-align="right" line-height="0.20cm" vertical-align="middle">
                                             <xsl:value-of select="@rev_impo_dep_bati_float" />

                                             EUR</fo:block>
                                          </fo:table-cell>
										  
										  <fo:table-cell>
                                             <fo:block text-align="right" line-height="0.20cm" vertical-align="middle"></fo:block>
                                          </fo:table-cell>

                                          <fo:table-cell >
                                             <fo:block text-align="right" line-height="0.20cm" vertical-align="middle">R IMP</fo:block>
                                          </fo:table-cell>

                                          <fo:table-cell>
                                             <fo:block text-align="right" line-height="0.20cm" vertical-align="middle">
                                             <xsl:value-of select="@rev_impo_reg_bati_float" />

                                             EUR</fo:block>
                                          </fo:table-cell>
										  
										  <fo:table-cell>
                                             <fo:block text-align="right" line-height="0.20cm" vertical-align="middle"></fo:block>
                                          </fo:table-cell>
                                       </fo:table-row>
                                    </xsl:for-each>
                                 </fo:table-body>
                              </fo:table>
                           </fo:block>
                        </fo:table-cell>
                     </fo:table-row>

<!-- Affichage des proprietes non baties -->
                     <fo:table-row>
                        <fo:table-cell>
                           <fo:table table-layout="fixed" width="100%" border-collapse="collapse" font-size="7pt">
                              <fo:table-column column-width="0.6cm" />

                              <fo:table-column column-width="1.5cm" />

                              <fo:table-column column-width="1.2cm" />

                              <fo:table-column column-width="1.2cm" />

                              <fo:table-column column-width="12.1cm" />

                              <fo:table-column column-width="0.9cm" />

                              <fo:table-column column-width="1.4cm" />

                              <fo:table-column column-width="0.6cm" />

                              <fo:table-column column-width="0.6cm" />

                              <fo:table-column column-width="0.9cm" />

                              <fo:table-column column-width="1.1cm" />

                              <fo:table-column column-width="1cm" />

                              <fo:table-column column-width="0.9cm" />

                              <fo:table-column column-width="0.7cm" />

                              <fo:table-column column-width="0.7cm" />

                              <fo:table-column column-width="0.7cm" />

                              <fo:table-column column-width="2cm" />

                              <fo:table-column column-width="0.6cm" />

<!-- Affichage de l'en-tête des proprietes non baties -->
                              <fo:table-header>
                                 <fo:table-row>
                                    <fo:table-cell border-color="black" border-style="solid" number-columns-spanned="18" border-right="hidden" border-bottom="hidden" border-left="hidden" border-top="hidden" border-width="0.5pt" padding-top="1cm" padding-bottom="0.1cm">
                                       <fo:block text-align="center" font-size="8pt" line-height="0.5cm" vertical-align="middle">PROPRIETES NON BATIES</fo:block>
                                    </fo:table-cell>
                                 </fo:table-row>

                                 <fo:table-row>
                                    <fo:table-cell border-color="black" border-style="solid" number-columns-spanned="6" border-right="hidden" border-bottom="hidden" border-width="0.5pt">
                                       <fo:block text-align="center" font-size="8pt" line-height="0.5cm" vertical-align="middle">DESIGNATION DES PROPRIETES</fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-style="solid" number-columns-spanned="12" border-left="hidden" border-bottom="hidden" border-width="0.5pt">
                                       <fo:block text-align="center" font-size="8pt" line-height="0.5cm" vertical-align="middle">EVALUATION</fo:block>
                                    </fo:table-cell>
                                 </fo:table-row>

<!-- Affichage des titres des colonnes des proprietes non baties -->
                                 <fo:table-row>
                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden">
                                      <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">AN</fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">SECTION</fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">N°PLAN</fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">N° Voirie</fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">ADRESSE</fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-left="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">CODE RIVOLI</fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">N°PARC PRIM</fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-left="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">FP DP</fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-left="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">S TAR</fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">SUF</fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">GR/SS GR</fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">CLASSE</fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">NAT CULT</fo:block>
                                    </fo:table-cell>

<!-- Creation d'une table pour afficher le titre de colonne (CONTENANCE HA A CA) -->
                                    <fo:table-cell number-columns-spanned="3" border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden">
                                       <fo:table table-layout="fixed" border-collapse="collapse" font-size="6pt" width="100%">
                                          <fo:table-body>
                                             <fo:table-row>
                                                <fo:table-cell number-columns-spanned="3" padding-top="0.05cm">
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">CONTENANCE</fo:block>
                                                </fo:table-cell>
                                             </fo:table-row>

                                             <fo:table-row>
                                                <fo:table-cell>
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">HA</fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell>
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">A</fo:block>
                                                </fo:table-cell>

                                                <fo:table-cell>
                                                   <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">CA</fo:block>
                                                </fo:table-cell>
                                             </fo:table-row>
                                          </fo:table-body>
                                       </fo:table>
                                    </fo:table-cell>

<!-- Suite de l'affichage des titres des colonnes des proprietes non baties -->
                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">REVENU CADASTRAL</fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">POS</fo:block>
                                    </fo:table-cell>
                                 </fo:table-row>
                              </fo:table-header>

                              <fo:table-footer>
                                 <fo:table-row>
                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-left="hidden">
                                       <fo:block>
                                       </fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-left="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">
                                       </fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-left="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">
                                       </fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-left="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">
                                       </fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-left="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">
                                       </fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-left="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                       </fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-left="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                       </fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-left="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                       </fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-left="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                       </fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-left="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">
                                       </fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-left="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                       </fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-left="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">
                                       </fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-left="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                       </fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell number-columns-spanned="3" border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-left="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                       </fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-left="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                       </fo:block>
                                    </fo:table-cell>

                                    <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-left="hidden">
                                       <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">
                                       </fo:block>
                                    </fo:table-cell>
                                 </fo:table-row>
                              </fo:table-footer>

<!-- Affichage des donnees des proprietes non baties -->
                              <fo:table-body>
                                 <fo:table-row>
                                    <fo:table-cell>
                                       <fo:block>
                                       </fo:block>
                                    </fo:table-cell>
                                 </fo:table-row>

                                 <xsl:for-each select="Mj/Mj_Compte_Communal/Mj_Parcelle | Mj/Mj_Compte_Communal_Parcelle/Mj_Parcelle">
								  <xsl:sort select="@section" />
									<xsl:sort select="@num_plan" data-type="number"/>
                                    <fo:table-row>
                                       <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                          <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">
                                             <xsl:value-of select="@date" />
                                          </fo:block>
                                       </fo:table-cell>

                                       <fo:table-cell padding-right="0.1cm" border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                          <fo:block text-align="right" vertical-align="middle" line-height="0.5cm">
                                             <xsl:value-of select="@section" />
                                          </fo:block>
                                       </fo:table-cell>

                                       <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                          <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">
                                             <xsl:value-of select="@num_plan" />
                                          </fo:block>
                                       </fo:table-cell>

                                       <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                          <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">
                                             <xsl:value-of select="@num_voirie" />
                                          </fo:block>
                                       </fo:table-cell>

                                       <fo:table-cell padding-left="0.1cm" border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                          <fo:block vertical-align="middle" line-height="0.5cm">
                                             <xsl:value-of select="@adresse" />
                                          </fo:block>
                                       </fo:table-cell>

                                       <fo:table-cell padding-left="0.1cm" border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden" border-left="hidden">
                                          <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">
                                             <xsl:value-of select="@code_rivoli" />
                                          </fo:block>
                                       </fo:table-cell>

                                       <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                          <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">
                                             <xsl:value-of select="@num_parc_prim" />
                                          </fo:block>
                                       </fo:table-cell>

                                       <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden" border-left="hidden">
                                          <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">
                                             <xsl:value-of select="@fp_dp" />
                                          </fo:block>
                                       </fo:table-cell>

                                       <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden" border-left="hidden">
                                          <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">
                                             <xsl:value-of select="@s_tar" />
                                          </fo:block>
                                       </fo:table-cell>

                                       <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                          <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">
                                             <xsl:value-of select="@suf" />
                                          </fo:block>
                                       </fo:table-cell>

                                       <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                          <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">
                                             <xsl:value-of select="@grss_gr" />
                                          </fo:block>
                                       </fo:table-cell>

                                       <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                          <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">
                                             <xsl:value-of select="@clas" />
                                          </fo:block>
                                       </fo:table-cell>

                                       <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                          <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">
                                             <xsl:value-of select="@nat_cult" />
                                          </fo:block>
                                       </fo:table-cell>

                                       <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                          <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">
                                             <xsl:value-of select="@ha" />
                                          </fo:block>
                                       </fo:table-cell>

                                       <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden" border-left="hidden">
                                          <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">
                                             <xsl:value-of select="@a" />
                                          </fo:block>
                                       </fo:table-cell>

                                       <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden" border-left="hidden">
                                          <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">
                                             <xsl:value-of select="@ca" />
                                          </fo:block>
                                       </fo:table-cell>

<!-- Affichage de la colonne revenu cadastral lorsqu'il a une seule suf -->
                                       <xsl:if test="count(Mj_Suf)=1">
                                          <fo:table-cell padding-right="0.1cm" border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                             <fo:block text-align="right" vertical-align="middle" line-height="0.5cm">
                                                <xsl:value-of select="@revenu_cadastral" />
                                             </fo:block>
                                          </fo:table-cell>
                                       </xsl:if>

<!-- Affichage de la colonne revenu cadastral lorsqu'il a plusieurs sufs -->
                                       <xsl:if test="count(Mj_Suf) &gt; 1">
                                          <fo:table-cell padding-right="0.1cm" border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                             <fo:block text-align="right" vertical-align="middle" line-height="0.5cm">
                                             </fo:block>
                                          </fo:table-cell>
                                       </xsl:if>

<!-- Suite de l'affichage des donnees des proprietes non baties -->
                                       <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-bottom="hidden" border-top="hidden">
                                          <fo:block text-align="center" vertical-align="middle" line-height="0.5cm">
                                          </fo:block>
                                       </fo:table-cell>
                                    </fo:table-row>

<!-- Affichage des Suf lorsqu'il y en a plusieurs -->
                                    <xsl:if test="count(Mj_Suf) &gt; 1">
                                       <xsl:for-each select="Mj_Suf">
                                          <fo:table-row>
                                             <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                </fo:block>
                                             </fo:table-cell>

                                             <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                </fo:block>
                                             </fo:table-cell>

                                             <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                </fo:block>
                                             </fo:table-cell>

                                             <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                </fo:block>
                                             </fo:table-cell>

                                             <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                </fo:block>
                                             </fo:table-cell>

                                             <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden" border-left="hidden">
                                                <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                </fo:block>
                                             </fo:table-cell>

                                             <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                </fo:block>
                                             </fo:table-cell>

                                             <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden" border-left="hidden">
                                                <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                </fo:block>
                                             </fo:table-cell>

                                             <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden" border-left="hidden">
                                                <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                   <xsl:value-of select="@s_tar" />
                                                </fo:block>
                                             </fo:table-cell>

                                             <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                   <xsl:value-of select="@suf" />
                                                </fo:block>
                                             </fo:table-cell>

                                             <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                   <xsl:value-of select="@grss_gr" />
                                                </fo:block>
                                             </fo:table-cell>

                                             <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                   <xsl:value-of select="@clas" />
                                                </fo:block>
                                             </fo:table-cell>

                                             <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                   <xsl:value-of select="@nat_cult" />
                                                </fo:block>
                                             </fo:table-cell>

                                             <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                   <xsl:value-of select="@ha" />
                                                </fo:block>
                                             </fo:table-cell>

                                             <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden" border-left="hidden">
                                                <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                   <xsl:value-of select="@a" />
                                                </fo:block>
                                             </fo:table-cell>

                                             <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden" border-left="hidden">
                                                <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                   <xsl:value-of select="@ca" />
                                                </fo:block>
                                             </fo:table-cell>

                                             <fo:table-cell padding-right="0.1cm" border-color="black" border-width="0.5pt" border-style="solid" border-right="hidden" border-bottom="hidden" border-top="hidden">
                                                <fo:block text-align="right" vertical-align="middle" line-height="0.25cm">
                                                   <xsl:value-of select="@revenu_cadastral" />
                                                </fo:block>
                                             </fo:table-cell>

                                             <fo:table-cell border-color="black" border-width="0.5pt" border-style="solid" border-bottom="hidden" border-top="hidden">
                                                <fo:block text-align="center" vertical-align="middle" line-height="0.25cm">
                                                </fo:block>
                                             </fo:table-cell>
                                          </fo:table-row>
                                       </xsl:for-each>
                                    </xsl:if>
                                 </xsl:for-each>
                              </fo:table-body>
                           </fo:table>
                        </fo:table-cell>
                     </fo:table-row>

<!-- Affichage du pied du tableau des proprietes non baties -->
                     <fo:table-row>
                        <fo:table-cell>
                           <fo:block keep-together="always" keep-with-previous="always">
                              <fo:table width="26.6cm" table-layout="fixed" border-color="black" border-right="0.5pt" border-left="0.5pt" border-top="0pt" border-bottom="0.5pt" border-style="solid" border-collapse="collapse" font-size="6pt" padding-top="0.2cm" padding-bottom="0.1cm">
                                 <fo:table-column column-width="1cm" />

                                 <fo:table-column column-width="1cm" />

                                 <fo:table-column column-width="1cm" />

                                 <fo:table-column column-width="1cm" />

                                 <fo:table-column column-width="3.9cm" />

                                 <fo:table-column column-width="2cm" />

                                 <fo:table-column column-width="2cm" />

                                 <fo:table-column column-width="1.5cm" />

                                 <fo:table-column column-width="2cm" />

                                 <fo:table-column column-width="2cm" />

                                 <fo:table-column column-width="1.5cm" />

                                 <fo:table-column column-width="2cm" />

                                 <fo:table-column column-width="2cm" />

                                 <fo:table-column column-width="1.5cm" />

                                 <fo:table-column column-width="2cm" />

                                 <fo:table-column column-width="2.3cm" />

                                 <fo:table-body>
                                    <xsl:for-each select="Mj/Mj_Compte_Communal | Mj/Mj_Compte_Communal_Parcelle">
                                       <fo:table-row>
                                          <fo:table-cell>
                                             <fo:block text-align="right" line-height="0.20cm" vertical-align="middle">
                                             </fo:block>
                                          </fo:table-cell>

                                          <fo:table-cell>
                                             <fo:block text-align="center" line-height="0.20cm" vertical-align="middle">HA</fo:block>
                                          </fo:table-cell>

                                          <fo:table-cell>
                                             <fo:block text-align="center" line-height="0.20cm" vertical-align="middle">A</fo:block>
                                          </fo:table-cell>

                                          <fo:table-cell>
                                             <fo:block text-align="center" line-height="0.20cm" vertical-align="middle">CA</fo:block>
                                          </fo:table-cell>
										  
										  
                                       </fo:table-row>

                                       <fo:table-row>
                                          <fo:table-cell>
                                             <fo:block text-align="left" line-height="0.60cm" vertical-align="middle">CONT</fo:block>
                                          </fo:table-cell>
										  
										  <fo:table-cell>
                                             <fo:block text-align="right" line-height="0.20cm" vertical-align="middle"></fo:block>
                                          </fo:table-cell>
										  
										  <fo:table-cell>
                                             <fo:block text-align="right" line-height="0.20cm" vertical-align="middle"></fo:block>
                                          </fo:table-cell>
										  
									      <fo:table-cell>
                                             <fo:block text-align="right" line-height="0.20cm" vertical-align="middle"></fo:block>
                                          </fo:table-cell>

                                          <fo:table-cell >
                                             <fo:block text-align="right" line-height="0.60cm" vertical-align="middle">REV IMPOSABLE</fo:block>
                                          </fo:table-cell>

                                          <fo:table-cell>
                                             <fo:block text-align="right" line-height="0.60cm" vertical-align="middle">
                                             <xsl:value-of select="@rev_impo_par_float" />

                                             EUR</fo:block>
                                          </fo:table-cell>

                                          <fo:table-cell>
                                             <fo:block text-align="right" line-height="0.60cm" vertical-align="middle">COM</fo:block>
                                          </fo:table-cell>
										  
										  <fo:table-cell>
                                             <fo:block text-align="right" line-height="0.20cm" vertical-align="middle"></fo:block>
                                          </fo:table-cell>
										  
										  <fo:table-cell>
                                             <fo:block text-align="right" line-height="0.20cm" vertical-align="middle"></fo:block>
                                          </fo:table-cell>

                                          <fo:table-cell >
                                             <fo:block text-align="right" line-height="0.60cm" vertical-align="middle">TAXE AD</fo:block>
                                          </fo:table-cell>
										  
										  <fo:table-cell>
                                             <fo:block text-align="right" line-height="0.20cm" vertical-align="middle"></fo:block>
                                          </fo:table-cell>
										  
										  <fo:table-cell>
                                             <fo:block text-align="right" line-height="0.20cm" vertical-align="middle"></fo:block>
                                          </fo:table-cell>

                                          <fo:table-cell >
                                             <fo:block text-align="right" line-height="0.60cm" vertical-align="middle"></fo:block>
                                          </fo:table-cell>
										  
										  <fo:table-cell>
                                             <fo:block text-align="right" line-height="0.20cm" vertical-align="middle"></fo:block>
                                          </fo:table-cell>
										  
										  <fo:table-cell>
                                             <fo:block text-align="right" line-height="0.20cm" vertical-align="middle"></fo:block>
                                          </fo:table-cell>

                                          <fo:table-cell padding-right="0.8cm">
                                             <fo:block text-align="right" line-height="0.60cm" vertical-align="middle">MAJ POS</fo:block>
                                          </fo:table-cell>
                                       </fo:table-row>

                                       <fo:table-row>
                                          <fo:table-cell>
                                             <fo:block text-align="right" line-height="0.20cm" vertical-align="middle">
                                             </fo:block>
                                          </fo:table-cell>

                                          <fo:table-cell>
                                             <fo:block text-align="center" line-height="0.20cm" vertical-align="middle">
                                                <xsl:value-of select="@ha" />
                                             </fo:block>
                                          </fo:table-cell>

                                          <fo:table-cell>
                                             <fo:block text-align="center" line-height="0.20cm" vertical-align="middle">
                                                <xsl:value-of select="@a" />
                                             </fo:block>
                                          </fo:table-cell>

                                          <fo:table-cell>
                                             <fo:block text-align="center" line-height="0.20cm" vertical-align="middle">
                                                <xsl:value-of select="@ca" />
                                             </fo:block>
                                          </fo:table-cell>
										  
										  <fo:table-cell>
                                             <fo:block text-align="right" line-height="0.20cm" vertical-align="middle"></fo:block>
                                          </fo:table-cell>
										  
										  <fo:table-cell>
                                             <fo:block text-align="right" line-height="0.20cm" vertical-align="middle"></fo:block>
                                          </fo:table-cell>
										  
										  <fo:table-cell>
                                             <fo:block text-align="right" line-height="0.20cm" vertical-align="middle"></fo:block>
                                          </fo:table-cell>

                                          <fo:table-cell>
                                             <fo:block text-align="right" line-height="0.20cm" vertical-align="middle">R IMP</fo:block>
                                          </fo:table-cell>

                                          <fo:table-cell>
                                             <fo:block text-align="right" line-height="0.20cm" vertical-align="middle">
                                             <xsl:value-of select="@rev_impo_com_par_float" />

                                             EUR</fo:block>
                                          </fo:table-cell>
										  
										  <fo:table-cell>
                                             <fo:block text-align="right" line-height="0.20cm" vertical-align="middle"></fo:block>
                                          </fo:table-cell>

                                          <fo:table-cell>
                                             <fo:block text-align="right" line-height="0.20cm" vertical-align="middle">R IMP</fo:block>
                                          </fo:table-cell>

                                          <fo:table-cell>
                                             <fo:block text-align="right" line-height="0.20cm" vertical-align="middle">
                                             <xsl:value-of select="@rev_impo_tax_ad_par_float" />

                                             EUR</fo:block>
                                          </fo:table-cell>
										  
										  <fo:table-cell>
                                             <fo:block text-align="right" line-height="0.20cm" vertical-align="middle"></fo:block>
                                          </fo:table-cell>

                                          <fo:table-cell>
                                             <fo:block text-align="right" line-height="0.20cm" vertical-align="middle"></fo:block>
                                          </fo:table-cell>

                                          <fo:table-cell>
                                             <fo:block text-align="right" line-height="0.20cm" vertical-align="middle">
											</fo:block>
                                          </fo:table-cell>
										  
										  <fo:table-cell>
                                             <fo:block text-align="right" line-height="0.20cm" vertical-align="middle"></fo:block>
                                          </fo:table-cell>
                                       </fo:table-row>
                                    </xsl:for-each>
                                 </fo:table-body>

<!-- Fin de la table du pied du tableau des propiétés non baties -->
                              </fo:table>
                           </fo:block>
                        </fo:table-cell>
                     </fo:table-row>

<!-- Fin du corps du tableau global -->
                  </fo:table-body>

<!-- Fin du tableau global -->
               </fo:table>

               <fo:block id="theEnd" />
            </fo:flow>
         </fo:page-sequence>
      </fo:root>
   </xsl:template>
</xsl:stylesheet>

