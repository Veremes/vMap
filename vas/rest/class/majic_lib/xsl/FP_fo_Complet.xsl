<?xml version="1.0" encoding="utf-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/">
    <fo:root xmlns:fo="http://www.w3.org/1999/XSL/Format" font-family="Helvetica">
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
          <fo:block text-align="left" vertical-align="middle" font-size="17pt" color="#008393">
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

              <fo:table-row>
                <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5" >
                  <fo:block text-align="left" vertical-align="middle" font-size="9pt">Urbaine :</fo:block>
                </fo:table-cell>
                <fo:table-cell background-color="#F7F7F7" text-align="left"  padding-left="5" padding-top="5" padding-bottom="5" padding-right="5" >
                  <xsl:for-each select="Mj/Mj_Compte_Communal_Parcelle/Mj_Parcelle">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                      <xsl:value-of select="@gurbpa" />
                    </fo:block>
                  </xsl:for-each>
                </fo:table-cell>
              </fo:table-row>
              <fo:table-row>
                <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5" >
                  <fo:block text-align="left" vertical-align="middle" font-size="9pt">Bâtie :</fo:block>
                </fo:table-cell>
                <fo:table-cell background-color="#F7F7F7" text-align="left"  padding-left="5" padding-top="5" padding-bottom="5" padding-right="5" >
                  <xsl:for-each select="Mj/Mj_Compte_Communal_Parcelle/Mj_Parcelle">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                      <xsl:value-of select="@gparbat" />
                    </fo:block>
                  </xsl:for-each>
                </fo:table-cell>
              </fo:table-row>
              <fo:table-row>
                <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5" >
                  <fo:block text-align="left" vertical-align="middle" font-size="9pt">Parcelle primitive :</fo:block>
                </fo:table-cell>
                <fo:table-cell background-color="#F7F7F7" text-align="left"  padding-left="5" padding-top="5" padding-bottom="5" padding-right="5" >
                  <xsl:for-each select="Mj/Mj_Compte_Communal_Parcelle/Mj_Parcelle">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                      <xsl:if test="not(@num_parc_prim = '')">
                        <xsl:value-of select="@num_parc_prim" />
                      </xsl:if>
                      <xsl:if test="@num_parc_prim = ''">
                        -
                      </xsl:if>
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
            <fo:table-column column-width="12%" />
            <fo:table-column column-width="12%" />
            <fo:table-column column-width="20%" />
            <fo:table-column column-width="15%" />
            <fo:table-column column-width="26%" />
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
                  <fo:block text-align="left" vertical-align="middle" font-size="9pt">Etat Civil</fo:block>
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
                  <fo:table-cell number-columns-spanned="2" background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                      <fo:block color="blue" text-decoration="underline" text-align="left" vertical-align="middle" font-size="9pt">
                        <fo:basic-link>
                          <xsl:attribute name="external-destination">
                            http://localhost/rgd/rgdservices.phtml?operation=GetReleveprop&amp;compte=<xsl:value-of select="@dnupro"/>&amp;type=complet&amp;format=pdf&amp;version=1.0
                          </xsl:attribute><xsl:value-of select="@dnupro" />
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
                      <xsl:value-of select="@jdatnss" />
                    </fo:block>
                    <!-- retour chariot -->
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                      <xsl:value-of select="@dldnss" />
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
                    <fo:table-cell number-columns-spanned="6" background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
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
                      <fo:block text-align="left" vertical-align="middle" font-size="9pt">Etat Civil</fo:block>
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
                              http://localhost/rgd/rgdservices.phtml?operation=GetReleveprop&amp;compte=<xsl:value-of select="@dnupro"/>&amp;type=complet&amp;format=pdf&amp;version=1.0
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
                          <xsl:value-of select="@jdatnss" />
                        </fo:block>
                        <!-- retour chariot -->
                        <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                          <xsl:value-of select="@dldnss" />
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

            <fo:table-column column-width="11%" />
            <fo:table-column column-width="11%" />
            <fo:table-column column-width="11%" />
            <fo:table-column column-width="11.2%" />
            <fo:table-column column-width="11%" />
            <fo:table-column column-width="11.2%" />
            <fo:table-column column-width="11.2%" />
            <fo:table-column column-width="11.2%" />
            <fo:table-column column-width="11.2%" />

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
                  <fo:block text-align="left" vertical-align="middle" font-size="9pt">Revenu (€)</fo:block>
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
                      <xsl:value-of select="@revenu_cadastral_txt" />
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
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">Date mutation</fo:block>
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
                            <xsl:value-of select="../@date_mut" />
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
                          <xsl:value-of select="@proprietaire_nom" />
                        </fo:block>
                      </fo:table-cell>
                    </fo:table-row>
                  </xsl:for-each>
                </xsl:for-each>
              </fo:table-body>
            </fo:table>
          </xsl:if>
          <!-- .........................................Description du local, mode Complet................................................. -->
          <xsl:for-each select="Mj/Mj_Compte_Communal_Parcelle/Mj_Bati">
            <fo:block color="#F1B4B4">
              <fo:leader leader-length="100%" leader-pattern="rule"/>
            </fo:block>
            <fo:block text-align="left" vertical-align="middle" font-size="15pt" color="#008393">
              Local n° <xsl:value-of select="@num_invar" />
            </fo:block>

            <fo:block color="#F1B4B4">
              <fo:leader leader-length="100%" leader-pattern="rule"/>
            </fo:block>
            <fo:table margin-bottom="35px" table-layout="fixed" width="100%" border-separation="2" >

              <fo:table-column column-width="39%" />
              <fo:table-column column-width="40%" />
              <fo:table-column column-width="7%" />
              <fo:table-column column-width="7%" />
              <fo:table-column column-width="7%" />

              <fo:table-body>
                <fo:table-row>
                  <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt"></fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt"></fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#eeeeee" text-align="center" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">Bat</fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#eeeeee" text-align="center" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">Esc</fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#eeeeee" text-align="center" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">Etage</fo:block>
                  </fo:table-cell>
                </fo:table-row>

                <fo:table-row>
                  <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">Adresse :</fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                      <xsl:value-of select="@voirie" />
                      <xsl:value-of select="@adresse" />
                    </fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="center" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                      <xsl:value-of select="@bat" />
                    </fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="center" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                      <xsl:value-of select="@ent" />
                    </fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="center" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                      <xsl:value-of select="@niv" />
                    </fo:block>
                  </fo:table-cell>
                </fo:table-row>
                <fo:table-row>
                  <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">Commune :</fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                      <xsl:value-of select="@libcom" />
                    </fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="center" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt"></fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="center" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt"></fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="center" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt"></fo:block>
                  </fo:table-cell>
                </fo:table-row>
                <fo:table-row>
                  <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">Type :</fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                      <xsl:value-of select="@dteloc" />
                    </fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="center" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt"></fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="center" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt"></fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="center" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt"></fo:block>
                  </fo:table-cell>
                </fo:table-row>
                <fo:table-row>
                  <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">Occupation :</fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                      <xsl:value-of select="@lib_occupation" />
                    </fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="center" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt"></fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="center" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt"></fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="center" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt"></fo:block>
                  </fo:table-cell>
                </fo:table-row>
                <fo:table-row>
                  <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">Nature :</fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                      <xsl:value-of select="@lib_nature" />
                    </fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="center" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt"></fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="center" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt"></fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="center" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt"></fo:block>
                  </fo:table-cell>
                </fo:table-row>
                <fo:table-row>
                  <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">Année de construction :</fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                      <xsl:if test="not(@annee_constr = '0')">
                        <xsl:value-of select="@annee_constr" />
                      </xsl:if>
                      <xsl:if test="@annee_constr = '0'">
                        -
                      </xsl:if>
                    </fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="center" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt"></fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="center" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt"></fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="center" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt"></fo:block>
                  </fo:table-cell>
                </fo:table-row>
                <fo:table-row>
                  <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">Date de mutation :</fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                      <xsl:value-of select="@date_mut" />
                    </fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="center" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt"></fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="center" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt"></fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="center" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt"></fo:block>
                  </fo:table-cell>
                </fo:table-row>
                <fo:table-row>
                  <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">Valeur cadastrale (?) :</fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                      <xsl:value-of select="Mj_Pev/@revenu_cadastral" />
                    </fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="center" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt"></fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="center" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt"></fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="center" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt"></fo:block>
                  </fo:table-cell>
                </fo:table-row>
                <fo:table-row>
                  <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">Niveaux :</fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                      <xsl:value-of select="@niveaux" />
                    </fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="center" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt"></fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="center" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt"></fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#F7F7F7" text-align="center" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt"></fo:block>
                  </fo:table-cell>
                </fo:table-row>
              </fo:table-body>
            </fo:table>

            <fo:block color="#F1B4B4">
              <fo:leader leader-length="100%" leader-pattern="rule"/>
            </fo:block>

            <fo:block text-align="left" vertical-align="middle" font-size="13pt" color="#990000">
              Propriétaire(s) du local
            </fo:block>

            <fo:table margin-bottom="35px" table-layout="fixed" width="100%" border-separation="2">
              <fo:table-column column-width="15%" />
              <fo:table-column column-width="27.5%" />
              <fo:table-column column-width="15%" />
              <fo:table-column column-width="27.5%" />
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
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">État Civil</fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">Adresse</fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">Type</fo:block>
                  </fo:table-cell>
                </fo:table-row>

                <xsl:for-each select="Mj_Proprietaire">
                  <fo:table-row>
                    <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                      <fo:block color="blue" text-decoration="underline" text-align="left" vertical-align="middle" font-size="9pt">
                        <fo:basic-link>
                          <xsl:attribute name="external-destination">
                            http://localhost/rgd/rgdservices.phtml?operation=GetReleveprop&amp;compte=<xsl:value-of select="@dnupro"/>&amp;type=complet&amp;format=pdf&amp;version=1.0
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
                        <xsl:value-of select="@jdatnss" />
                        <!-- retour chariot -->
                        <xsl:value-of select="@dldnss" />
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

            <fo:block color="#F1B4B4">
              <fo:leader leader-length="100%" leader-pattern="rule"/>
            </fo:block>
            <fo:block text-align="left" vertical-align="middle" font-size="13pt" color="#990000">
              P.E.V
            </fo:block>
            <fo:table margin-bottom="35px" table-layout="fixed" width="100%" border-separation="2">

              <fo:table-column column-width="12.5%" />
              <fo:table-column column-width="12.5%" />
              <fo:table-column column-width="12.5%" />
              <fo:table-column column-width="12.5%" />
              <fo:table-column column-width="12.5%" />
              <fo:table-column column-width="12.5%" />
              <fo:table-column column-width="12.5%" />
              <fo:table-column column-width="12.5%" />

              <fo:table-body>
                <fo:table-row>
                  <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">N°</fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">Nature</fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">Catégorie</fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">Tarif</fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">Local Type</fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">Val. Loc. Ref. (?)</fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">Val. Loc. Ann. (?)</fo:block>
                  </fo:table-cell>
                  <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                    <fo:block text-align="left" vertical-align="middle" font-size="9pt">Nat. Exemp.</fo:block>
                  </fo:table-cell>
                </fo:table-row>

                <xsl:for-each select="Mj_Pev">
                  <fo:table-row>
                    <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                      <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                        <xsl:if test="not(@num_pev = '')">
                          <xsl:value-of select="@num_pev" />
                        </xsl:if>
                        <xsl:if test="@num_pev = ''">
                          -
                        </xsl:if>
                      </fo:block>
                    </fo:table-cell>
                    <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                      <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                        <xsl:if test="not(@l_nature = '')">
                          <xsl:value-of select="@l_nature" />
                        </xsl:if>
                        <xsl:if test="@l_nature = ''">
                          -
                        </xsl:if>
                      </fo:block>
                    </fo:table-cell>
                    <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                      <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                        <xsl:if test="not(@cat = '')">
                          <xsl:value-of select="@cat" />
                        </xsl:if>
                        <xsl:if test="@cat = ''">
                          -
                        </xsl:if>
                      </fo:block>
                    </fo:table-cell>
                    <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                      <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                        <xsl:if test="not(@s_tar = '')">
                          <xsl:value-of select="@s_tar" />
                        </xsl:if>
                        <xsl:if test="@s_tar = ''">
                          -
                        </xsl:if>
                      </fo:block>
                    </fo:table-cell>
                    <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                      <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                        <xsl:if test="not(@local_type = '')">
                          <xsl:value-of select="@local_type" />
                        </xsl:if>
                        <xsl:if test="@local_type = ''">
                          -
                        </xsl:if>
                      </fo:block>
                    </fo:table-cell>
                    <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                      <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                        <xsl:if test="not(@val_loc_ref = '')">
                          <xsl:value-of select="@val_loc_ref" />
                        </xsl:if>
                        <xsl:if test="@val_loc_ref = ''">
                          -
                        </xsl:if>
                      </fo:block>
                    </fo:table-cell>
                    <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                      <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                        <xsl:if test="not(@val_loc_ann = '')">
                          <xsl:value-of select="@val_loc_ann" />
                        </xsl:if>
                        <xsl:if test="@val_loc_ann = ''">
                          -
                        </xsl:if>
                      </fo:block>
                    </fo:table-cell>
                    <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                      <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                        <xsl:if test="not(@l_nat_exon = '')">
                          <xsl:value-of select="@l_nat_exon" />
                        </xsl:if>
                        <xsl:if test="@l_nat_exon = ''">
                          -
                        </xsl:if>
                      </fo:block>
                    </fo:table-cell>
                  </fo:table-row>
                </xsl:for-each>
              </fo:table-body>
            </fo:table>

            <xsl:if test ="Mj_Pev/Mj_Habit_Descr[@num_pev]">
              <fo:block color="#F1B4B4">
                <fo:leader leader-length="100%" leader-pattern="rule"/>
              </fo:block>
              <fo:block text-align="left" vertical-align="middle" font-size="13pt" color="#990000">
                Habitation principale
                <!-- retour chariot -->
              </fo:block>
              <fo:block text-align="left" vertical-align="middle" font-size="8pt">
                N° P.E.V : <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@num_pev" />
              </fo:block>
              <fo:table margin-bottom="35px" table-layout="fixed" width="100%" border-separation="2">

                <fo:table-column column-width="30%" />
                <fo:table-column column-width="30%" />
                <fo:table-column column-width="20%" />
                <fo:table-column column-width="20%" />

                <fo:table-body>
                  <fo:table-row>
                    <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                      <fo:block text-align="left" vertical-align="middle" font-size="9pt">Divers</fo:block>
                    </fo:table-cell>
                    <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                      <fo:block text-align="left" vertical-align="middle" font-size="9pt">Eléments de confort</fo:block>
                    </fo:table-cell>
                    <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                      <fo:block text-align="left" vertical-align="middle" font-size="9pt">Pièces</fo:block>
                    </fo:table-cell>
                    <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                      <fo:block text-align="left" vertical-align="middle" font-size="9pt">Surfaces (m²)</fo:block>
                    </fo:table-cell>
                  </fo:table-row>
                  <fo:table-row>
                    <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                      <fo:table table-layout="fixed" width="100%" border-separation="2">

                        <fo:table-column column-width="60%" />
                        <fo:table-column column-width="40%" />

                        <fo:table-body>
                          <fo:table-row>
                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">Surface (m²) :</fo:block>
                            </fo:table-cell>

                            <fo:table-cell background-color="#F7F7F7" text-align ="right" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@suf_piece_total" />
                              </fo:block>
                            </fo:table-cell>

                          </fo:table-row>
                          <fo:table-row>
                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">Nbr pièces :</fo:block>
                            </fo:table-cell>

                            <fo:table-cell background-color="#F7F7F7" text-align ="right" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@nb_piece_total" />
                              </fo:block>
                            </fo:table-cell>

                          </fo:table-row>
                          <fo:table-row>
                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">Nbr pièces princ. :</fo:block>
                            </fo:table-cell>

                            <fo:table-cell background-color="#F7F7F7" text-align ="right" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@nb_piece_principal" />
                              </fo:block>
                            </fo:table-cell>

                          </fo:table-row>
                          <fo:table-row>
                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">Entretien :</fo:block>
                            </fo:table-cell>

                            <fo:table-cell background-color="#F7F7F7" text-align ="right" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@l_Etat" />
                              </fo:block>
                            </fo:table-cell>

                          </fo:table-row>
                          <fo:table-row>
                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">Année de Constr. :</fo:block>
                            </fo:table-cell>

                            <fo:table-cell background-color="#F7F7F7" text-align ="right" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@annee_constr" />
                              </fo:block>
                            </fo:table-cell>

                          </fo:table-row>
                          <fo:table-row>
                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">Nbr Niveaux :</fo:block>
                            </fo:table-cell>

                            <fo:table-cell background-color="#F7F7F7" text-align ="right" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@nb_niveaux" />
                              </fo:block>
                            </fo:table-cell>

                          </fo:table-row>
                          <fo:table-row>
                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">Gros murs :</fo:block>
                            </fo:table-cell>

                            <fo:table-cell background-color="#F7F7F7" text-align ="right" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@lib_mat_gros_mur" />
                              </fo:block>
                            </fo:table-cell>

                          </fo:table-row>
                          <fo:table-row>
                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">Toitures :</fo:block>
                            </fo:table-cell>

                            <fo:table-cell background-color="#F7F7F7" text-align ="right" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@lib_mat_toiture" />
                              </fo:block>
                            </fo:table-cell>

                          </fo:table-row>
                        </fo:table-body>
                      </fo:table>
                    </fo:table-cell>
                    <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                      <fo:table table-layout="fixed" width="100%" border-separation="2">

                        <fo:table-column column-width="50%" />
                        <fo:table-column column-width="50%" />

                        <fo:table-body>
                          <xsl:if test="Mj_Pev/Mj_Habit_Descr/@nb_baignoires &gt; 0">
                            <fo:table-row>
                              <fo:table-cell background-color="#F7F7F7" text-align ="left"  padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                                <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                  <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@nb_baignoires" />
                                </fo:block>
                              </fo:table-cell>
                              <fo:table-cell background-color="#F7F7F7" text-align ="left"  padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                                <fo:block text-align="left" vertical-align="middle" font-size="9pt">Baignoire(s)</fo:block>
                              </fo:table-cell>
                            </fo:table-row>
                          </xsl:if>
                          <xsl:if test="Mj_Pev/Mj_Habit_Descr/@nb_douches &gt; 0">
                            <fo:table-row>
                              <fo:table-cell background-color="#F7F7F7" text-align ="left"  padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                                <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                  <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@nb_douches" />
                                </fo:block>
                              </fo:table-cell>
                              <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                                <fo:block text-align="left" vertical-align="middle" font-size="9pt">Douche(s)</fo:block>
                              </fo:table-cell>
                            </fo:table-row>
                          </xsl:if>
                          <xsl:if test="Mj_Pev/Mj_Habit_Descr/@nb_lavabos &gt; 0">
                            <fo:table-row>
                              <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                                <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                  <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@nb_lavabos" />
                                </fo:block>
                              </fo:table-cell>
                              <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                                <fo:block text-align="left" vertical-align="middle" font-size="9pt">Lavabo(s)</fo:block>
                              </fo:table-cell>
                            </fo:table-row>
                          </xsl:if>
                          <xsl:if test="Mj_Pev/Mj_Habit_Descr/@nb_wc &gt; 0">
                            <fo:table-row>
                              <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                                <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                  <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@nb_wc" />
                                </fo:block>
                              </fo:table-cell>
                              <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                                <fo:block text-align="left" vertical-align="middle" font-size="9pt">W.C.</fo:block>
                              </fo:table-cell>
                            </fo:table-row>
                          </xsl:if>
                          <fo:table-row>
                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">Eau :</fo:block>
                            </fo:table-cell>
                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                <xsl:if test ="Mj_Pev/Mj_Habit_Descr/@eau = 'EAU'">
                                  Oui
                                </xsl:if>
                              </fo:block>
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                <xsl:if test ="Mj_Pev/Mj_Habit_Descr/@eau = ''">
                                  -
                                </xsl:if>
                              </fo:block>
                            </fo:table-cell>
                          </fo:table-row>
                          <fo:table-row>
                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">Electricité :</fo:block>
                            </fo:table-cell>
                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                <xsl:if test ="Mj_Pev/Mj_Habit_Descr/@elect = 'ELECT'">
                                  Oui
                                </xsl:if>
                              </fo:block>
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                <xsl:if test ="Mj_Pev/Mj_Habit_Descr/@elect = ''">
                                  -
                                </xsl:if>
                              </fo:block>
                            </fo:table-cell>
                          </fo:table-row>
                          <fo:table-row>
                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">Gaz :</fo:block>
                            </fo:table-cell>
                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                <xsl:if test ="Mj_Pev/Mj_Habit_Descr/@gaz = 'GAZ'">
                                  Oui
                                </xsl:if>
                              </fo:block>
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                <xsl:if test ="Mj_Pev/Mj_Habit_Descr/@gaz = ''">
                                  -
                                </xsl:if>
                              </fo:block>
                            </fo:table-cell>
                          </fo:table-row>
                          <fo:table-row>
                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">Esc. de service :</fo:block>
                            </fo:table-cell>
                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                <xsl:if test ="Mj_Pev/Mj_Habit_Descr/@esc_serv = 'ESC_SERV'">
                                  Oui
                                </xsl:if>
                              </fo:block>
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                <xsl:if test ="Mj_Pev/Mj_Habit_Descr/@esc_serv = ''">
                                  -
                                </xsl:if>
                              </fo:block>
                            </fo:table-cell>
                          </fo:table-row>
                          <fo:table-row>
                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">Ascenseur :</fo:block>
                            </fo:table-cell>
                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                <xsl:if test ="Mj_Pev/Mj_Habit_Descr/@asc = 'ASC'">
                                  Oui
                                </xsl:if>
                              </fo:block>
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                <xsl:if test ="Mj_Pev/Mj_Habit_Descr/@asc = ''">
                                  -
                                </xsl:if>
                              </fo:block>
                            </fo:table-cell>
                          </fo:table-row>
                          <fo:table-row>
                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">Chauffage :</fo:block>
                            </fo:table-cell>
                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                <xsl:if test ="Mj_Pev/Mj_Habit_Descr/@chauf = 'CHAUF'">
                                  Oui
                                </xsl:if>
                              </fo:block>
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                <xsl:if test ="Mj_Pev/Mj_Habit_Descr/@chauf = ''">
                                  -
                                </xsl:if>
                              </fo:block>
                            </fo:table-cell>
                          </fo:table-row>
                          <fo:table-row>
                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">Vide ordure :</fo:block>
                            </fo:table-cell>
                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                <xsl:if test ="Mj_Pev/Mj_Habit_Descr/@vide_ord = 'VIDE_ORD'">
                                  Oui
                                </xsl:if>
                              </fo:block>
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                <xsl:if test ="Mj_Pev/Mj_Habit_Descr/@vide_ord = ''">
                                  -
                                </xsl:if>
                              </fo:block>
                            </fo:table-cell>
                          </fo:table-row>
                          <fo:table-row>
                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">Égout :</fo:block>
                            </fo:table-cell>
                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                <xsl:if test ="Mj_Pev/Mj_Habit_Descr/@egout = 'EGOUT'">
                                  Oui
                                </xsl:if>
                              </fo:block>
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                <xsl:if test ="Mj_Pev/Mj_Habit_Descr/@egout = ''">
                                  -
                                </xsl:if>
                              </fo:block>
                            </fo:table-cell>
                          </fo:table-row>
                        </fo:table-body>
                      </fo:table>
                    </fo:table-cell>
                    <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                      <fo:table table-layout="fixed" width="100%" border-separation="2">

                        <fo:table-column column-width="30%" />
                        <fo:table-column column-width="70%" />

                        <fo:table-body>
                          <fo:table-row>

                            <fo:table-cell background-color="#F7F7F7" text-align ="left"  padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@nb_sam" />
                              </fo:block>
                            </fo:table-cell>

                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">S. a manger</fo:block>
                            </fo:table-cell>
                          </fo:table-row>
                          <fo:table-row>

                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@nb_chambre" />
                              </fo:block>
                            </fo:table-cell>

                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">Chambre</fo:block>
                            </fo:table-cell>
                          </fo:table-row>
                          <fo:table-row>

                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@nb_cuisine_m9" />
                              </fo:block>
                            </fo:table-cell>

                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">Cuisine (inf.9m2)</fo:block>
                            </fo:table-cell>
                          </fo:table-row>
                          <fo:table-row>

                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@nb_cuisine_p9" />
                              </fo:block>
                            </fo:table-cell>

                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">Cuisine (sup.9m2)</fo:block>
                            </fo:table-cell>
                          </fo:table-row>
                          <fo:table-row>

                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@nb_salle_eau" />
                              </fo:block>
                            </fo:table-cell>

                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">S. de bain</fo:block>
                            </fo:table-cell>
                          </fo:table-row>
                          <fo:table-row>

                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@nb_annexe" />
                              </fo:block>
                            </fo:table-cell>

                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">Annexe</fo:block>
                            </fo:table-cell>
                          </fo:table-row>
                        </fo:table-body>
                      </fo:table>
                    </fo:table-cell>
                    <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                      <fo:table table-layout="fixed" width="100%" border-separation="2">

                        <fo:table-column column-width="30%" />
                        <fo:table-column column-width="70%" />

                        <fo:table-body>
                          <fo:table-row>

                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@suf_cave" />
                              </fo:block>
                            </fo:table-cell>
                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                Cave(s)
                              </fo:block>
                            </fo:table-cell>

                          </fo:table-row>
                          <fo:table-row>

                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@suf_grenier" />
                              </fo:block>
                            </fo:table-cell>
                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                Grenier(s)
                              </fo:block>
                            </fo:table-cell>

                          </fo:table-row>
                          <fo:table-row>

                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@suf_terrasse" />
                              </fo:block>
                            </fo:table-cell>
                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                Terrasse(s)
                              </fo:block>
                            </fo:table-cell>

                          </fo:table-row>
                          <fo:table-row>

                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@suf_garage" />
                              </fo:block>
                            </fo:table-cell>
                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                Garage(s)
                              </fo:block>
                            </fo:table-cell>

                          </fo:table-row>
                        </fo:table-body>
                      </fo:table>
                    </fo:table-cell>
                  </fo:table-row>
                </fo:table-body>
              </fo:table>
            </xsl:if>
            <xsl:if test ="Mj_Pev/Mj_Depend_Descr[@num_pev]">
              <fo:block color="#F1B4B4">
                <fo:leader leader-length="100%" leader-pattern="rule"/>
              </fo:block>
              <fo:block text-align="left" vertical-align="middle" font-size="13pt" color="#990000">
                Dépendance(s)
              </fo:block>
              <fo:table margin-bottom="35px" table-layout="fixed" width="100%" border-separation="2">

                <fo:table-column column-width="10%" />
                <fo:table-column column-width="12.5%" />
                <fo:table-column column-width="11%" />
                <fo:table-column column-width="11%" />
                <fo:table-column column-width="11%" />
                <fo:table-column column-width="12.5%" />
                <fo:table-column column-width="12.5%" />
                <fo:table-column column-width="19.5%" />

                <fo:table-body>
                  <fo:table-row>
                    <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                      <fo:block text-align="left" vertical-align="middle" font-size="9pt">N°</fo:block>
                    </fo:table-cell>
                    <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                      <fo:block text-align="left" vertical-align="middle" font-size="9pt">Nature</fo:block>
                    </fo:table-cell>
                    <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                      <fo:block text-align="left" vertical-align="middle" font-size="9pt">Surface (m²)</fo:block>
                    </fo:table-cell>
                    <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                      <fo:block text-align="left" vertical-align="middle" font-size="9pt">Pondération</fo:block>
                    </fo:table-cell>
                    <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                      <fo:block text-align="left" vertical-align="middle" font-size="9pt">Entretien</fo:block>
                    </fo:table-cell>
                    <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                      <fo:block text-align="left" vertical-align="middle" font-size="9pt">Gros murs</fo:block>
                    </fo:table-cell>
                    <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                      <fo:block text-align="left" vertical-align="middle" font-size="9pt">Toitures</fo:block>
                    </fo:table-cell>
                    <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                      <fo:block text-align="left" vertical-align="middle" font-size="9pt">Elt. confort</fo:block>
                    </fo:table-cell>
                  </fo:table-row>
                  <fo:table-row>

                    <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                      <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                        <xsl:value-of select="Mj_Pev/Mj_Depend_Descr/@num_pev" />
                      </fo:block>
                    </fo:table-cell>
                    <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                      <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                        <xsl:value-of select="Mj_Pev/Mj_Depend_Descr/@nature" />
                      </fo:block>
                    </fo:table-cell>
                    <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                      <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                        <xsl:value-of select="Mj_Pev/Mj_Depend_Descr/@surface" />
                      </fo:block>
                    </fo:table-cell>
                    <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                      <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                        <xsl:value-of select="Mj_Pev/Mj_Depend_Descr/@ponderation" />
                      </fo:block>
                    </fo:table-cell>
                    <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                      <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                        <xsl:value-of select="Mj_Pev/Mj_Depend_Descr/@l_Etat" />
                      </fo:block>
                    </fo:table-cell>
                    <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                      <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                        <xsl:value-of select="Mj_Pev/Mj_Depend_Descr/@lib_mat_gros_mur" />
                      </fo:block>
                    </fo:table-cell>
                    <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                      <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                        <xsl:value-of select="Mj_Pev/Mj_Depend_Descr/@lib_mat_toiture" />
                      </fo:block>
                    </fo:table-cell>

                    <fo:table-cell>
                      <fo:table table-layout="fixed" width="100%" border-separation="2">

                        <fo:table-column column-width="45%" />
                        <fo:table-column column-width="55%" />

                        <fo:table-body>
                          <xsl:if test="Mj_Pev/Mj_Depend_Descr/@nb_baignoires &gt; 0">
                            <fo:table-row>
                              <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                                <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                  <xsl:value-of select="Mj_Pev/Mj_Depend_Descr/@nb_baignoires" />
                                </fo:block>
                              </fo:table-cell>
                              <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                                <fo:block text-align="left" vertical-align="middle" font-size="9pt">Baignoire(s)</fo:block>
                              </fo:table-cell>
                            </fo:table-row>
                          </xsl:if>
                          <xsl:if test="Mj_Pev/Mj_Depend_Descr/@nb_douches &gt; 0">
                            <fo:table-row>
                              <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                                <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                  <xsl:value-of select="Mj_Pev/Mj_Depend_Descr/@nb_douches" />
                                </fo:block>
                              </fo:table-cell>
                              <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                                <fo:block text-align="left" vertical-align="middle" font-size="9pt">Douche(s)</fo:block>
                              </fo:table-cell>
                            </fo:table-row>
                          </xsl:if>
                          <xsl:if test="Mj_Pev/Mj_Depend_Descr/@nb_lavabos &gt; 0">
                            <fo:table-row>
                              <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                                <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                  <xsl:value-of select="Mj_Pev/Mj_Depend_Descr/@nb_lavabos" />
                                </fo:block>
                              </fo:table-cell>
                              <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                                <fo:block text-align="left" vertical-align="middle" font-size="9pt">Lavabo(s)</fo:block>
                              </fo:table-cell>
                            </fo:table-row>
                          </xsl:if>
                          <xsl:if test="Mj_Pev/Mj_Depend_Descr/@nb_wc &gt; 0">
                            <fo:table-row>
                              <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                                <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                  <xsl:value-of select="Mj_Pev/Mj_Depend_Descr/@nb_wc" />
                                </fo:block>
                              </fo:table-cell>
                              <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                                <fo:block text-align="left" vertical-align="middle" font-size="9pt">W.C.</fo:block>
                              </fo:table-cell>
                            </fo:table-row>
                          </xsl:if>
                          <fo:table-row>
                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">Eau :</fo:block>
                            </fo:table-cell>
                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                <xsl:if test ="Mj_Pev/Mj_Depend_Descr/@eau = 'EAU'">
                                  Oui
                                </xsl:if>
                              </fo:block>
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                <xsl:if test ="Mj_Pev/Mj_Depend_Descr/@eau = ''">
                                  -
                                </xsl:if>
                              </fo:block>
                            </fo:table-cell>
                          </fo:table-row>
                          <fo:table-row>
                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">Chauffage :</fo:block>
                            </fo:table-cell>
                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                <xsl:if test ="Mj_Pev/Mj_Depend_Descr/@chauf = 'CHAUF'">
                                  Oui
                                </xsl:if>
                              </fo:block>
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                <xsl:if test ="Mj_Pev/Mj_Depend_Descr/@chauf = ''">
                                  -
                                </xsl:if>
                              </fo:block>
                            </fo:table-cell>
                          </fo:table-row>
                          <fo:table-row>
                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">Electricité :</fo:block>
                            </fo:table-cell>
                            <fo:table-cell background-color="#F7F7F7" text-align ="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                <xsl:if test ="Mj_Pev/Mj_Depend_Descr/@elect = 'ELECT'">
                                  Oui
                                </xsl:if>
                              </fo:block>
                              <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                                <xsl:if test ="Mj_Pev/Mj_Depend_Descr/@elect = ''">
                                  -
                                </xsl:if>
                              </fo:block>
                            </fo:table-cell>
                          </fo:table-row>
                        </fo:table-body>
                      </fo:table>
                    </fo:table-cell>
                  </fo:table-row>
                </fo:table-body>
              </fo:table>
            </xsl:if>
            <xsl:if test ="Mj_Pev/Mj_Prof_Descr[@num_pev]">
              <fo:block color="#F1B4B4">
                <fo:leader leader-length="100%" leader-pattern="rule"/>
              </fo:block>
              <fo:block text-align="left" vertical-align="middle" font-size="13pt" color="#990000">
                Locaux Professionnels
              </fo:block>
              <fo:table margin-bottom="35px" table-layout="fixed" width="100%" border-separation="2">

                <fo:table-column column-width="15%" />
                <fo:table-column column-width="85%" />

                <fo:table-body>
                  <fo:table-row>
                    <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                      <fo:block text-align="left" vertical-align="middle" font-size="9pt">N°</fo:block>
                    </fo:table-cell>
                    <fo:table-cell background-color="#eeeeee" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                      <fo:block text-align="left" vertical-align="middle" font-size="9pt">Surface (m²)</fo:block>
                    </fo:table-cell>
                  </fo:table-row>
                  <fo:table-row>
                    <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                      <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                        <xsl:value-of select="Mj_Pev/Mj_Prof_Descr/@num_pev" />
                      </fo:block>
                    </fo:table-cell>
                    <fo:table-cell background-color="#F7F7F7" text-align="left" padding-left="5" padding-top="5" padding-bottom="5" padding-right="5">
                      <fo:block text-align="left" vertical-align="middle" font-size="9pt">
                        <xsl:value-of select="Mj_Pev/Mj_Prof_Descr/@surface" />
                      </fo:block>
                    </fo:table-cell>
                  </fo:table-row>
                </fo:table-body>
              </fo:table>
            </xsl:if>
          </xsl:for-each>
        </fo:flow>
      </fo:page-sequence>
    </fo:root>
  </xsl:template>
</xsl:stylesheet>


