<?xml version="1.0" encoding="iso-8859-1"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/">
    <fo:root xmlns:fo="http://www.w3.org/1999/XSL/Format">
      <fo:layout-master-set>
        <fo:simple-page-master master-name="simple" page-width="21cm" page-height="29.7cm" margin-top="0.5cm" margin-bottom="0.5cm" margin-left="0.5cm" margin-right="0.5cm">
          <fo:region-body margin-top="0cm" margin-bottom="0cm" margin-left="0.5cm" margin-right="0.5cm" />
        </fo:simple-page-master>
      </fo:layout-master-set>

      <fo:page-sequence master-reference="simple" font-family="Times">
        <!-- Tableau global basé sur la structure de la première ligne du relevé de propriété -->
        <fo:flow flow-name="xsl-region-body">

          <fo:block >
            <fo:external-graphic >
              <xsl:attribute name="src">
                file:///C:\serveurs\Apache2\htdocs\rgd\images\bandeau.jpg
              </xsl:attribute>
            </fo:external-graphic>
          </fo:block>

          <fo:block color="#F1B4B4">
            <fo:leader leader-length="100%" leader-pattern="rule"/>
          </fo:block>
          <fo:block text-align="left" vertical-align="middle" font-size="19pt" color="#008393">
            <xsl:for-each select="Mj/Mj_Compte_Communal_Parcelle/Mj_Parcelle">
              Parcelle <xsl:value-of select="@section" /><xsl:value-of select="format-number(@num_parc, '0000')"/> 
            </xsl:for-each>
          </fo:block>
          <fo:block color="#F1B4B4">
            <fo:leader leader-length="100%" leader-pattern="rule"/>
          </fo:block>
          <fo:table margin-bottom="35px" table-layout="fixed" width="100%" border-separation="2" >
            <fo:table-column column-width="17%" />
            <fo:table-column column-width="83%" />
            <fo:table-body>
              <fo:table-row>
                <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5" >
                  <fo:block text-align="left" vertical-align="middle" font-size="9pt">Adresse :</fo:block>
                </fo:table-cell>
                <fo:table-cell background-color="#F7F7F7" text-align="left"  padding-left="5" padding-top="5" padding-bottom="5" padding-right="5" >
                  <xsl:for-each select="Mj/Mj_Compte_Communal_Parcelle/Mj_Parcelle">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                      <xsl:value-of select="@num_voirie" />
                      <xsl:value-of select="@adresse" />
                    </fo:block>
                  </xsl:for-each>
                </fo:table-cell>
              </fo:table-row>
              <fo:table-row>
                <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5" >
                  <fo:block text-align="left" vertical-align="middle" font-size="9pt">Commune :</fo:block>
                </fo:table-cell>
                <fo:table-cell background-color="#F7F7F7" text-align="left"  padding-left="5" padding-top="5" padding-bottom="5" padding-right="5" >
                  <xsl:for-each select="Mj/Mj_Compte_Communal_Parcelle">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                      <xsl:value-of select="@libcom" />
                    </fo:block>
                  </xsl:for-each>
                </fo:table-cell>
              </fo:table-row>
              <fo:table-row>
                <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5" >
                  <fo:block text-align="left" vertical-align="middle" font-size="9pt">Code Commune (Insee) :</fo:block>
                </fo:table-cell>
                <fo:table-cell background-color="#F7F7F7" text-align="left"  padding-left="5" padding-top="5" padding-bottom="5" padding-right="5" >
                  <xsl:for-each select="Mj/Mj_Compte_Communal_Parcelle">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                      <xsl:value-of select="@codeinsee" />
                    </fo:block>
                  </xsl:for-each>
                </fo:table-cell>
              </fo:table-row>
              <fo:table-row>
                <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5" >
                  <fo:block text-align="left" vertical-align="middle" font-size="9pt">Cpte Propriétaire :</fo:block>
                </fo:table-cell>
                <fo:table-cell background-color="#F7F7F7" text-align="left"  padding-left="5" padding-top="5" padding-bottom="5" padding-right="5" >
                  <xsl:for-each select="Mj/Mj_Compte_Communal_Parcelle">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                      <xsl:value-of select="Mj_Parcelle/@dnupro" />
                    </fo:block>
                    <!-- retour chariot -->
                  </xsl:for-each>
                </fo:table-cell>
              </fo:table-row>
              <fo:table-row>
                <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5" >
                  <fo:block text-align="left" vertical-align="middle" font-size="9pt">Surface cadastrale (m²) :</fo:block>
                </fo:table-cell>
                <fo:table-cell background-color="#F7F7F7" text-align="left"  padding-left="5" padding-top="5" padding-bottom="5" padding-right="5" >
                  <xsl:for-each select="Mj/Mj_Compte_Communal_Parcelle">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                      <xsl:value-of select="@total_contenance_m2" />
                    </fo:block>
                  </xsl:for-each>
                </fo:table-cell>
              </fo:table-row>
            </fo:table-body>
          </fo:table>

          <!--<fo:block>
            <fo:external-graphic>
              <xsl:attribute name="src">
                http://mapsrv.rgd74.fr/geomap70/mg/net/ggGetMapImage.aspx?USER=Administrator&amp;PWD=admin&amp;MAPNAME=Library://RISNET_GESTION/Cartes/RGD 73-74 - RISNET_GESTION_73_74.MapDefinition&amp;SELOBJS=PARCELLE%2C<xsl:for-each select="Mj/Mj_Compte_Communal_Parcelle/Mj_Parcelle">
                  <xsl:value-of select='substring(@idpar,1,2)'/>
                  <xsl:value-of select='substring(@idpar,4,3)'/>
                  <xsl:if test ="substring(@idpar,7,3)='000'">
                    <xsl:text disable-output-escaping="yes">-.-.-</xsl:text>
                  </xsl:if>
                  <xsl:if test ="not(substring(@idpar,7,3)='000')">
                    <xsl:value-of select='substring(@idpar,7,3)'/>
                  </xsl:if>
                  <xsl:if test ="substring(@idpar,10,1)='0'">
                    <xsl:text disable-output-escaping="yes">-</xsl:text>
                  </xsl:if>
                  <xsl:if test ="not(substring(@idpar,10,1)='0')">
                    <xsl:value-of select='substring(@idpar,10,1)'/>
                  </xsl:if>
                  <xsl:value-of select='substring(@idpar,11,1)'/>
                  <xsl:value-of select='substring(@idpar,12)'/>
                </xsl:for-each>-&amp;CENTERX=&amp;CENTERY=&amp;SCALE=*8&amp;HEIGHT=400&amp;WIDTH=575&amp;RESULTTYPE=JPG
              </xsl:attribute>
            </fo:external-graphic>
          </fo:block>-->
          <fo:block text-align="left" vertical-align="middle" font-size="13pt" color="#990000">
            Urbanisme : POS/PLU
          </fo:block>
            
          <fo:table margin-bottom="35px" table-layout="fixed" width="100%" border-separation="2">
            <fo:table-column column-width="9%" />
            <fo:table-column column-width="27.48%" />
            <fo:table-column column-width="15.38%" />
            <fo:table-column column-width="7.29%" />
            <fo:table-column column-width="7.29%" />
            <fo:table-column column-width="9.79%" />
            <fo:table-column column-width="23.77%" />

            <fo:table-body>
              <fo:table-row>
                <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                  <fo:block text-align="left" vertical-align="middle" font-size="9pt">Zonage</fo:block>
                </fo:table-cell>
                <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                  <fo:block text-align="left" vertical-align="middle" font-size="9pt">Libellé</fo:block>
                </fo:table-cell>
                <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                  <fo:block text-align="left" vertical-align="middle" font-size="9pt">Surface (m2)*</fo:block>
                </fo:table-cell>
                <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                  <fo:block text-align="left" vertical-align="middle" font-size="9pt">COS</fo:block>
                </fo:table-cell>
                <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                  <fo:block text-align="left" vertical-align="middle" font-size="9pt">CES</fo:block>
                </fo:table-cell>
                <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                  <fo:block text-align="left" vertical-align="middle" font-size="9pt">Hauteur</fo:block>
                </fo:table-cell>
                <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                  <fo:block text-align="left" vertical-align="middle" font-size="9pt">Réglement de la zone</fo:block>
                </fo:table-cell>
              </fo:table-row>
              <xsl:for-each select="Mj/Mj_Compte_Communal_Parcelle/Mj_Parcelle/Mj_PosPlu">
                <fo:table-row>
                  <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                      <xsl:value-of select="@zonage" />
                    </fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                      <xsl:value-of select="@lib_zonage" />
                    </fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                      <xsl:value-of select="@surface" />
                    </fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                      <xsl:value-of select="@cos" />
                    </fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                      <xsl:value-of select="@ces" />
                    </fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                      <xsl:value-of select="@hauteur" />
                    </fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block color="blue" text-decoration="underline" text-align="left" vertical-align="middle" font-size="9pt">
                      <fo:basic-link>
                        <xsl:attribute name="external-destination">
                          http://mapris.rgd74.fr/DocumentsPartenaires/Reglement_POS/ <xsl:value-of select="@idreg" />.pdf
                        </xsl:attribute>Consulter le réglement
                      </fo:basic-link>
                    </fo:block>
                  </fo:table-cell>
                </fo:table-row>
              </xsl:for-each>
            </fo:table-body>
          </fo:table>
          <fo:block text-align="left" vertical-align="middle" font-size="8pt">
            *calcul sur la surface graphique, exclusion si surf &#139; 2 m²
          </fo:block>
          <xsl:for-each select="Mj/Mj_Compte_Communal_Parcelle/Mj_Parcelle/Mj_PosPlu">
            <fo:block color="blue" text-decoration="underline" text-align="left" vertical-align="middle" font-size="9pt">
              <fo:basic-link>
                <xsl:attribute name="external-destination">
                  http://mapris.rgd74.fr/Risnet_Gestion/Application/Rapport/etat_pos_plu/fiche_pos.asp?codcom=<xsl:value-of select="@codecom" />
                </xsl:attribute>Avancement de l'actualisation/mise en ligne du POS/PLU de cette commune
              </fo:basic-link>
            </fo:block>
          </xsl:for-each>

          <fo:block color="#F1B4B4">
            <fo:leader leader-length="100%" leader-pattern="rule"/>
          </fo:block>
          <fo:block text-align="left" vertical-align="middle" font-size="13pt" color="#990000">
            Propriétaire(s) de la parcelle
          </fo:block>
          <fo:block text-align="left" vertical-align="middle" font-size="8pt">
            *Cliquer sur le n° de compte pour accéder à son relevé de propriété
          </fo:block>
          <fo:table margin-bottom="35px" table-layout="fixed" width="100%" border-separation="2">
            <fo:table-column column-width="12.5%" />
            <fo:table-column column-width="12.5%" />
            <fo:table-column column-width="30%" />
            <fo:table-column column-width="30%" />
            <fo:table-column column-width="15%" />

            <fo:table-body>
              <fo:table-row>
                <fo:table-cell number-columns-spanned="2" background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                  <fo:block text-align="left" vertical-align="middle" font-size="9pt">Compte</fo:block>
                </fo:table-cell>
                <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                  <fo:block text-align="left" vertical-align="middle" font-size="9pt">Nom</fo:block>
                </fo:table-cell>
                <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                  <fo:block text-align="left" vertical-align="middle" font-size="9pt">Adresse</fo:block>
                </fo:table-cell>
                <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                  <fo:block text-align="left" vertical-align="middle" font-size="9pt">Type</fo:block>
                </fo:table-cell>
              </fo:table-row>
              <xsl:for-each select="Mj/Mj_Compte_Communal_Parcelle/Mj_Proprietaire">
                <fo:table-row>
                  <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block color="blue" text-decoration="underline" text-align="left" vertical-align="middle" font-size="9pt">
                      <fo:basic-link>
                        <xsl:attribute name="external-destination">
                          http://localhost/rgd/rgdservices.phtml?operation=GetReleveprop&amp;compte=<xsl:value-of select="@dnupro"/>&amp;type=restreint&amp;format=pdf&amp;version=1.0
                        </xsl:attribute>
                        <xsl:value-of select="@dnupro" />
                      </fo:basic-link>
                    </fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                      <xsl:value-of select="@proprietaire_nom_tiers" />
                    </fo:block>
                  </fo:table-cell>

                  <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                      <xsl:value-of select="@proprietaire_adresse" />
                    </fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                      <xsl:value-of select="@l_ccodro" />
                    </fo:block>
                  </fo:table-cell>
                </fo:table-row>
                <xsl:if test ="..//Mj_Parcelle/Mj_Suf/Mj_Proprietaire[@dnupro]">
                  <fo:table-row>
                    <fo:table-cell number-columns-spanned="5" background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                      <fo:block text-align="left" vertical-align="middle" font-size="9pt">Détail</fo:block>
                    </fo:table-cell>
                  </fo:table-row>
                  <fo:table-row>
                    <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                      <fo:block text-align="left" vertical-align="middle" font-size="9pt">Numéro du lot</fo:block>
                    </fo:table-cell>
                    <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                      <fo:block text-align="left" vertical-align="middle" font-size="9pt">Compte</fo:block>
                    </fo:table-cell>
                    <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                      <fo:block text-align="left" vertical-align="middle" font-size="9pt">Nom</fo:block>
                    </fo:table-cell>
                    <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                      <fo:block text-align="left" vertical-align="middle" font-size="9pt">Adresse</fo:block>
                    </fo:table-cell>
                    <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                      <fo:block text-align="left" vertical-align="middle" font-size="9pt">Type</fo:block>
                    </fo:table-cell>
                  </fo:table-row>
                  <xsl:for-each select="../Mj_Parcelle/Mj_Suf/Mj_Proprietaire">
                    <fo:table-row>
                      <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                        <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                          <xsl:value-of select="../@dnulot" />
                        </fo:block>
                      </fo:table-cell>
                      <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                        <fo:block color="blue" text-decoration="underline" text-align="left" vertical-align="middle" font-size="9pt">
                          <fo:basic-link>
                            <xsl:attribute name="external-destination">
                              http://localhost/rgd/rgdservices.phtml?operation=GetReleveprop&amp;compte=<xsl:value-of select="@dnupro"/>&amp;type=restreint&amp;format=pdf&amp;version=1.0
                            </xsl:attribute>
                            <xsl:value-of select="@dnupro" />
                          </fo:basic-link>
                        </fo:block>
                      </fo:table-cell>
                      <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                        <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                          <xsl:value-of select="@proprietaire_nom" />
                        </fo:block>
                      </fo:table-cell>
                      <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                        <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                          <xsl:value-of select="@proprietaire_adresse" />
                        </fo:block>
                      </fo:table-cell>
                      <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                        <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                          <xsl:value-of select="@l_ccodro" />
                        </fo:block>
                      </fo:table-cell>
                    </fo:table-row>
                  </xsl:for-each>
                </xsl:if>
              </xsl:for-each>
            </fo:table-body>
          </fo:table>

          <fo:block text-align="left" vertical-align="middle" font-size="13pt" color="#990000">
            Subdivision(s) fiscale(s)
          </fo:block>
          <fo:table margin-bottom="35px" table-layout="fixed" width="100%" border-separation="2">

            <fo:table-column column-width="12.4%" />
            <fo:table-column column-width="12.4%" />
            <fo:table-column column-width="12.4%" />
            <fo:table-column column-width="12.6%" />
            <fo:table-column column-width="12.4%" />
            <fo:table-column column-width="12.6%" />
            <fo:table-column column-width="12.6%" />
            <fo:table-column column-width="12.6%" />

            <fo:table-body>
              <fo:table-row>
                <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                  <fo:block text-align="left" vertical-align="middle" font-size="9pt">Lettre</fo:block>
                </fo:table-cell>
                <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                  <fo:block text-align="left" vertical-align="middle" font-size="9pt">Groupe</fo:block>
                </fo:table-cell>
                <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                  <fo:block text-align="left" vertical-align="middle" font-size="9pt">Nature</fo:block>
                </fo:table-cell>
                <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                  <fo:block text-align="left" vertical-align="middle" font-size="9pt">Occupation</fo:block>
                </fo:table-cell>
                <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                  <fo:block text-align="left" vertical-align="middle" font-size="9pt">Classe</fo:block>
                </fo:table-cell>
                <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                  <fo:block text-align="left" vertical-align="middle" font-size="9pt">Compte</fo:block>
                </fo:table-cell>
                <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                  <fo:block text-align="left" vertical-align="middle" font-size="9pt">Surface (m²)</fo:block>
                </fo:table-cell>
                <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                  <fo:block text-align="left" vertical-align="middle" font-size="9pt">Référence</fo:block>
                </fo:table-cell>
              </fo:table-row>
              <xsl:for-each select="Mj/Mj_Compte_Communal_Parcelle/Mj_Parcelle/Mj_Suf">
                <fo:table-row>
                  <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                      <xsl:if test="not(@suf = '')">
                        <xsl:value-of select="@suf" />
                      </xsl:if>
                      <xsl:if test="@suf = ''">
                        -
                      </xsl:if>
                    </fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                      <xsl:if test="not(@groupe = '')">
                        <xsl:value-of select="@groupe" />
                      </xsl:if>
                      <xsl:if test="@groupe = ''">
                        -
                      </xsl:if>
                    </fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                      <xsl:if test="not(@nature = '')">
                        <xsl:value-of select="@nature" />
                      </xsl:if>
                      <xsl:if test="@nature = ''">
                        -
                      </xsl:if>
                    </fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">-</fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                      <xsl:if test="not(@clas = '')">
                        <xsl:value-of select="@clas" />
                      </xsl:if>
                      <xsl:if test="@clas = ''">
                        -
                      </xsl:if>
                    </fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                      <xsl:value-of select="@dnupro" />
                    </fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                      <xsl:value-of select="@contenance_suf" />
                    </fo:block>
                  </fo:table-cell>

                  <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                      <xsl:value-of select="@revenu_reference_txt" />
                    </fo:block>
                  </fo:table-cell>
                </fo:table-row>
              </xsl:for-each>
            </fo:table-body>
          </fo:table>

          <xsl:if test="count(Mj/Mj_Compte_Communal_Parcelle/Mj_Bati) &gt; 0">
            <fo:block color="#F1B4B4">
              <fo:leader leader-length="100%" leader-pattern="rule"/>
            </fo:block>
            <fo:block text-align="left" vertical-align="middle" font-size="13pt" color="#990000">
              Elément(s) bâti(s)
            </fo:block>
            <fo:table margin-bottom="35px" table-layout="fixed" width="100%" border-separation="2">

              <fo:table-column column-width="15%" />
              <fo:table-column column-width="15%" />
              <fo:table-column column-width="15%" />
              <fo:table-column column-width="55%" />

              <fo:table-body>
                <fo:table-row>
                  <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">Ref. local</fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">Nature</fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">Etages</fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">Propriétaire(s)</fo:block>
                  </fo:table-cell>
                </fo:table-row>
                <xsl:for-each select="Mj/Mj_Compte_Communal_Parcelle/Mj_Bati">
                  <xsl:for-each select="Mj_Proprietaire">
                    <fo:table-row>
                      <xsl:if test="position()='1'">
                        <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                          <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                            <xsl:value-of select="../@num_invar" />
                          </fo:block>
                        </fo:table-cell>
                        <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                          <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                            <xsl:value-of select="../@lib_nature" />
                          </fo:block>
                        </fo:table-cell>
                        <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                          <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                            <xsl:value-of select="../@niv" />
                          </fo:block>
                        </fo:table-cell>
                      </xsl:if>
                      <xsl:if test="position() &gt; '1'">
                        <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                          <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                          </fo:block>
                        </fo:table-cell>
                        <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                          <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                          </fo:block>
                        </fo:table-cell>
                        <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                          <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                          </fo:block>
                        </fo:table-cell>
                      </xsl:if>
                      <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                        <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                          <xsl:value-of select="@dnupro" />
                        </fo:block>
                      </fo:table-cell>
                    </fo:table-row>
                  </xsl:for-each>
                </xsl:for-each>
              </fo:table-body>
            </fo:table>
          </xsl:if>
          <!-- .........................................Propriétaire de Bâtis, mode Restreint................................................. -->
          <fo:block color="#F1B4B4">
            <fo:leader leader-length="100%" leader-pattern="rule"/>
          </fo:block>
          <fo:block text-align="left" vertical-align="middle" font-size="13pt" color="#990000">
            Propriétaire(s) du local
          </fo:block>

          <fo:table margin-bottom="35px" table-layout="fixed" width="100%" border-separation="2" >
            
            <fo:table-column column-width="15%" />
            <fo:table-column column-width="35%" />
            <fo:table-column column-width="35%" />
            <fo:table-column column-width="15%" />

            <fo:table-body>
              <fo:table-row>
                <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                  <fo:block text-align="left" vertical-align="middle" font-size="9pt">Compte</fo:block>
                </fo:table-cell>
                <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                  <fo:block text-align="left" vertical-align="middle" font-size="9pt">Nom</fo:block>
                </fo:table-cell>
                <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                  <fo:block text-align="left" vertical-align="middle" font-size="9pt">Adresse</fo:block>
                </fo:table-cell>
                <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                  <fo:block text-align="left" vertical-align="middle" font-size="9pt">Type</fo:block>
                </fo:table-cell>
              </fo:table-row>
              <xsl:for-each select="Mj/Mj_Compte_Communal_Parcelle/Mj_Bati/Mj_Proprietaire">
                <fo:table-row>
                  <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block color="blue" text-decoration="underline" text-align="left" vertical-align="middle" font-size="9pt">
                      <fo:basic-link>
                        <xsl:attribute name="external-destination">
                          http://localhost/rgd/rgdservices.phtml?operation=GetReleveprop&amp;compte=<xsl:value-of select="@dnupro"/>&amp;type=restreint&amp;format=pdf&amp;version=1.0
                        </xsl:attribute>
                        <xsl:value-of select="@dnupro" />
                      </fo:basic-link>
                    </fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                      <xsl:value-of select="@proprietaire_nom_tiers" />
                    </fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                      <xsl:value-of select="@proprietaire_adresse" />
                    </fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                      <xsl:value-of select="@l_ccodro" />
                    </fo:block>
                  </fo:table-cell>
                </fo:table-row>
              </xsl:for-each>
            </fo:table-body>
          </fo:table>
        </fo:flow>
      </fo:page-sequence>
    </fo:root>
  </xsl:template>
</xsl:stylesheet>


