<?xml version="1.0" encoding="UTF-8"?>

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
      <head>
        <style type="text/css">
          body {
          font-family:arial, "sans-serif";
          padding:100px 20px 20px 20px;
          background-image:url(http://img15.hostingpics.net/pics/500812bandeau.jpg);
          background-repeat:no-repeat;
          background-position:center top;
          }

          hr {
          text-align: center;
          width:100%;
          color:#F1B4B4;
          }

          table {
          text-align:left;
          width:100%;
          font-size:12px;
          margin-bottom:35px;
          }

          td {
          text-align:left;

          background-color:#F7F7F7 ;
          }

          h1 {
          font-family:tahoma;
          color: #008393;
          }

          th {
          text-align:left;

          background-color:#eeeeee;
          }

          h4 {
          font-family:tahoma;
          color: #990000;
          }

          h5 {
          font-family:tahoma;
          }
        </style>
      </head>
      <body>
        <hr size="5"/>
        <h1>
          <xsl:for-each select="Mj/Mj_Compte_Communal_Parcelle/Mj_Parcelle">
            Parcelle <xsl:value-of select="@section" /><xsl:value-of select="format-number(@num_parc, '0000')"/>
          </xsl:for-each>
        </h1>
        <hr size="10"/>
        <Table cellspacing="2" cellpadding="5" >
          <TR>
            <TH align="left" width ="15%">
              Adresse :
            </TH>
            <TD align="left" width ="85%">
              <xsl:for-each select="Mj/Mj_Compte_Communal_Parcelle/Mj_Parcelle">
                <xsl:value-of select="@num_voirie" />
                <xsl:text disable-output-escaping="yes">&amp;nbsp;</xsl:text>
                <xsl:value-of select="@adresse" />
              </xsl:for-each>
            </TD>
          </TR>
          <TR>
            <TH align="left" width ="15%">
              Commune :
            </TH>
            <TD align="left" width ="85%">
              <xsl:for-each select="Mj/Mj_Compte_Communal_Parcelle">
                <xsl:value-of select="@libcom" />
              </xsl:for-each>
            </TD>
          </TR>
          <TR>
            <TH align="left" width ="15%">
              Code Commune (Insee) :
            </TH>
            <TD align="left" width ="85%">
              <xsl:for-each select="Mj/Mj_Compte_Communal_Parcelle">
                <xsl:value-of select="@codeinsee" />
              </xsl:for-each>
            </TD>
          </TR>
          <TR>
            <TH align="left" width ="15%">
              Compte Propriétaire :
            </TH>
            <TD align="left" width ="85%">
              <xsl:for-each select="Mj/Mj_Compte_Communal_Parcelle">
                <xsl:value-of select="Mj_Parcelle/@dnupro" />
                <BR/>
              </xsl:for-each>
            </TD>
          </TR>
          <TR>
            <TH align="left" width ="15%">
              Surface cadastrale (m²) :
            </TH>
            <TD align="left" width ="85%">
              <xsl:for-each select="Mj/Mj_Compte_Communal_Parcelle">
                <xsl:value-of select="@total_contenance_m2" />
              </xsl:for-each>
            </TD>
          </TR>
          <xsl:if test="not($type='restreint')">
            <TR>
              <TH align="left" width ="15%">
                Urbaine :
              </TH>
              <TD align="left" width ="85%">
                <xsl:for-each select="Mj/Mj_Compte_Communal_Parcelle/Mj_Parcelle">
                  <xsl:value-of select="@gurbpa" />
                </xsl:for-each>
              </TD>
            </TR>
            <TR>
              <TH align="left" width ="15%">
                Bâtie :
              </TH>
              <TD align="left" width ="85%">
                <xsl:for-each select="Mj/Mj_Compte_Communal_Parcelle/Mj_Parcelle">
                  <xsl:value-of select="@gparbat" />
                </xsl:for-each>
              </TD>
            </TR>
            <TR>
              <TH align="left" width ="15%">
                Parcelle primitive :
              </TH>
              <TD align="left" width ="85%">
                <xsl:for-each select="Mj/Mj_Compte_Communal_Parcelle/Mj_Parcelle">
                  <xsl:if test="not(@num_parc_prim = '')">
                    <xsl:value-of select="@num_parc_prim" />
                  </xsl:if>
                  <xsl:if test="@num_parc_prim = ''">
                    -
                  </xsl:if>
                </xsl:for-each>
              </TD>
            </TR>
          </xsl:if>
        </Table>
        <xsl:if test="$poste='internet'">
          <img>
            <xsl:attribute name="src">http://mapsrv.rgd74.fr/geomap70/mg/net/ggGetMapImage.aspx?USER=Administrator&amp;PWD=admin&amp;MAPNAME=Library://RISNET_GESTION/Cartes/RGD 73-74 - RISNET_GESTION_73_74.MapDefinition&amp;SELOBJS=PARCELLE%2C<xsl:for-each select="Mj/Mj_Compte_Communal_Parcelle/Mj_Parcelle">
                <xsl:value-of select='substring(@idpar,1,2)'/>
                <xsl:value-of select='substring(@idpar,4,3)'/>
                <xsl:if test ="substring(@idpar,7,3)='000'">
                  <xsl:text disable-output-escaping="yes">---</xsl:text>
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
              </xsl:for-each>-&amp;CENTERX=&amp;CENTERY=&amp;SCALE=*8&amp;HEIGHT=400&amp;WIDTH=575&amp;RESULTTYPE=JPG</xsl:attribute>
          </img>
          <h4>
            Urbanisme : POS/PLU
          </h4>
          <Table cellspacing="2" cellpadding="5">
            <TR>
              <TH>
                Zonage
              </TH>
              <TH>
                Libellé
              </TH>
              <TH>
                Surface (m²)*
              </TH>
              <TH>
                COS
              </TH>
              <TH>
                CES
              </TH>
              <TH>
                Hauteur
              </TH>
              <TH>
                Réglement de la zone
              </TH>
            </TR>
            <xsl:for-each select="Mj/Mj_Compte_Communal_Parcelle/Mj_Parcelle/Mj_PosPlu">
              <TR>
                <TD>
                  <xsl:value-of select="@zonage" />&nbsp;
                </TD>
                <TD>
                  <xsl:value-of select="@lib_zonage" />&nbsp;
                </TD>
                <TD>
                  <xsl:value-of select="@surface" />&nbsp;
                </TD>
                <TD>
                  <xsl:value-of select="@cos" />&nbsp;
                </TD>
                <TD>
                  <xsl:value-of select="@ces" />&nbsp;
                </TD>
                <TD>
                  <xsl:value-of select="@hauteur" /> &nbsp;
                </TD>
                <TD>
                  <a>
                    <xsl:attribute name="href">http://mapris.rgd74.fr/DocumentsPartenaires/Reglement_POS/<xsl:value-of select="@idreg" />.pdf</xsl:attribute>Consulter le réglement
                  </a> &nbsp;
                </TD>
              </TR>
            </xsl:for-each>
          </Table>
          <h6>*calcul sur la surface graphique, exclusion si surface &#139; 2 m² </h6>
          <xsl:for-each select="Mj/Mj_Compte_Communal_Parcelle/Mj_Parcelle/Mj_PosPlu">
            <a>
              <xsl:attribute name="href">http://mapris.rgd74.fr/Risnet_Gestion/Application/Rapport/etat_pos_plu/fiche_pos.asp?codcom=<xsl:value-of select="@codecom" /></xsl:attribute>Avancement de l'actualisation/mise en ligne du POS/PLU de cette commune
            </a> &nbsp;
          </xsl:for-each>
        </xsl:if>
        <xsl:if test="not($type='sansnom')">
          <hr size="5"/>
          <h4>
            Propriétaire(s) de la parcelle
          </h4>
          <h6>*Cliquer sur le n° de compte pour accéder à son relevé de propriété </h6>
          <Table cellspacing="2" cellpadding="5">
            <TR>
              <TH colspan="2">
                Compte
              </TH>
              <TH>
                Nom
              </TH>
              <xsl:if test="$type='complet'">
                <TH>
                  Etat Civil
                </TH>
              </xsl:if>
              <TH>
                Adresse
              </TH>
              <TH>
                Type
              </TH>
            </TR>
            <xsl:for-each select="Mj/Mj_Compte_Communal_Parcelle/Mj_Proprietaire">
              <TR>
                <TD colspan="2">
                  <xsl:if test="$type='complet'">
                    <a>
                      <xsl:attribute name="href">http://ns227471.ovh.net/rgd/rgdservices.phtml?operation=GetReleveprop&amp;compte=<xsl:value-of select="@dnupro"/>&amp;type=complet&amp;format=pdf&amp;version=1.0</xsl:attribute><xsl:value-of select="@dnupro" />
                    </a>
                  </xsl:if>
                  <xsl:if test="$type='restreint'">
                    <a>
                      <xsl:attribute name="href">http://ns227471.ovh.net/rgd/rgdservices.phtml?operation=GetReleveprop&amp;compte=<xsl:value-of select="@dnupro"/>&amp;type=restreint&amp;format=pdf&amp;version=1.0</xsl:attribute><xsl:value-of select="@dnupro" />
                    </a>
                  </xsl:if>
                  <xsl:if test="$type='sansnom'">
                    <xsl:value-of select="@dnupro" />&nbsp;
                  </xsl:if>
                </TD>
                <TD>
                  <xsl:if test="$type='complet'">
                    <xsl:value-of select="@proprietaire_nom" />&nbsp;
                  </xsl:if>
                  <xsl:if test="$type='restreint'">
                    <xsl:value-of select="@proprietaire_nom_tiers" />&nbsp;
                  </xsl:if>
                </TD>
                <xsl:if test="$type='complet'">
                  <TD>
                    <xsl:value-of select="@jdatnss" />
                    <BR/>
                    <xsl:value-of select="@dldnss" />&nbsp;
                  </TD>
                </xsl:if>
                <TD>
                  <xsl:value-of select="@proprietaire_adresse" />&nbsp;
                </TD>
                <TD>
                  <xsl:value-of select="@l_ccodro" /> &nbsp;
                </TD>
              </TR>
              <xsl:if test ="..//Mj_Parcelle/Mj_Suf/Mj_Proprietaire[@dnupro]">
                <tr>
                  <th colspan="6">
                    Détail
                  </th>
                </tr>
                <TR>
                  <TH>
                    Numéro du lot
                  </TH>
                  <TH>
                    Compte
                  </TH>
                  <TH>
                    Nom
                  </TH>
                  <xsl:if test="$type='complet'">
                    <TH>
                      Etat Civil
                    </TH>
                  </xsl:if>
                  <TH>
                    Adresse
                  </TH>
                  <TH>
                    Type
                  </TH>
                </TR>
                <xsl:for-each select="../Mj_Parcelle/Mj_Suf/Mj_Proprietaire">
                  <tr>
                    <td>
                      <xsl:value-of select="../@dnulot" /> &nbsp;
                    </td>
                    <td>
                      <xsl:if test="$type='complet'">
                        <a>
                          <xsl:attribute name="href">http://ns227471.ovh.net/rgd/rgdservices.phtml?operation=GetReleveprop&amp;compte=<xsl:value-of select="@dnupro"/>&amp;type=complet&amp;format=pdf&amp;version=1.0</xsl:attribute><xsl:value-of select="@dnupro" />
                        </a>
                      </xsl:if>
                      <xsl:if test="$type='restreint'">
                        <a>
                          <xsl:attribute name="href">http://ns227471.ovh.net/rgd/rgdservices.phtml?operation=GetReleveprop&amp;compte=<xsl:value-of select="@dnupro"/>&amp;type=restreint&amp;format=pdf&amp;version=1.0</xsl:attribute><xsl:value-of select="@dnupro" />
                        </a>
                      </xsl:if>
                      <xsl:if test="$type='sansnom'">
                        <xsl:value-of select="@dnupro" />&nbsp;
                      </xsl:if>
                    </td>
                    <td>
                      <xsl:if test="$type='complet'">
                        <xsl:value-of select="@proprietaire_nom" />&nbsp;
                      </xsl:if>
                      <xsl:if test="$type='restreint'">
                        <xsl:value-of select="@proprietaire_nom_tiers" />&nbsp;
                      </xsl:if>
                    </td>
                    <xsl:if test="$type='complet'">
                    <td>
                        <xsl:value-of select="@jdatnss" />
                        <BR/>
                        <xsl:value-of select="@dldnss" />&nbsp;   
                    </td>
                    </xsl:if>
                    <td>
                      <xsl:value-of select="@proprietaire_adresse" />&nbsp;
                    </td>
                    <td>
                      <xsl:value-of select="@l_ccodro" /> &nbsp;
                    </td>
                  </tr>
                </xsl:for-each>
              </xsl:if>
            </xsl:for-each>
          </Table>
        </xsl:if>
        <hr size="5"/>
        <h4>
          Subdivision(s) fiscale(s)
        </h4>
        <Table cellspacing="2" cellpadding="5">
          <TR>
            <TH>
              Lettre
            </TH>
            <TH>
              Groupe
            </TH>
            <TH>
              Nature
            </TH>
            <TH>
              Classe
            </TH>
            <TH>
              Compte
            </TH>
            <TH>
              Surface (m²)
            </TH>
            <xsl:if test="not($type='restreint')">
              <TH>
                Revenu (€)
              </TH>
            </xsl:if>
            <TH>
              Référence
            </TH>
          </TR>
          <xsl:for-each select="Mj/Mj_Compte_Communal_Parcelle/Mj_Parcelle/Mj_Suf">
            <TR>
              <TD>
                <xsl:if test="not(@suf = '')">
                  <xsl:value-of select="@suf" />&nbsp;
                </xsl:if>
                <xsl:if test="@suf = ''">
                  -
                </xsl:if>
              </TD>
              <TD>
                <xsl:if test="not(@groupe = '')">
                  <xsl:value-of select="@groupe" />&nbsp;
                </xsl:if>
                <xsl:if test="@groupe = ''">
                  -
                </xsl:if>
              </TD>
              <TD>
                <xsl:if test="not(@nature = '')">
                  <xsl:value-of select="@nature" />&nbsp;
                </xsl:if>
                <xsl:if test="@nature = ''">
                  -
                </xsl:if>
              </TD>
              <TD>
                <xsl:if test="not(@clas = '')">
                  <xsl:value-of select="@clas" />&nbsp;
                </xsl:if>
                <xsl:if test="@clas = ''">
                  -
                </xsl:if>
              </TD>
              <TD>
                <xsl:value-of select="@dnupro" />&nbsp;
              </TD>
              <TD>
                <xsl:value-of select="@contenance_suf" />&nbsp;
              </TD>
              <xsl:if test="not($type='restreint')">
                <TD>
                  <xsl:value-of select="@revenu_cadastral_txt" />&nbsp;
                </TD>
              </xsl:if>
              <TD>
                <xsl:value-of select="@revenu_reference_txt" />&nbsp;
              </TD>
            </TR>
          </xsl:for-each>
        </Table>
        <xsl:if test="not($type='sansnom')">
          <xsl:if test="count(Mj/Mj_Compte_Communal_Parcelle/Mj_Bati) &gt; 0">
            <hr size="5"/>
            <h4>
              Elément(s) bâti(s)
            </h4>
            <xsl:if test="$type='complet'">
              <h6>*Cliquer sur la référence du local pour accéder à sa description</h6>
            </xsl:if>
            <Table cellspacing="2" cellpadding="5">
              <TR>
                <TH>
                  Ref. local
                </TH>
                <TH>
                  Nature
                </TH>
                <TH>
                  <xsl:if test="$type='restreint'">
                    Etages
                  </xsl:if>
                  <xsl:if test="$type='complet'">
                    Date mutation
                  </xsl:if>
                </TH>
                <TH>
                  Propriétaire(s)
                </TH>
              </TR>
              <xsl:for-each select="Mj/Mj_Compte_Communal_Parcelle/Mj_Bati">
                <xsl:for-each select="Mj_Proprietaire">
                  <TR>
                    <xsl:if test="position()='1'">
                      <TD>
                        <xsl:if test="$type='restreint'">
                          <xsl:value-of select="../@num_invar" />
                        </xsl:if>
                        <xsl:if test="$type='complet'">
                          <a href="#{../@num_invar}">
                            <xsl:value-of select="../@num_invar" />
                          </a>&nbsp;
                        </xsl:if>
                      </TD>
                      <TD>
                        <xsl:value-of select="../@lib_nature" />&nbsp;
                      </TD>
                      <TD>
                        <xsl:if test="$type='restreint'">
                          <xsl:value-of select="../@niv" />&nbsp;
                        </xsl:if>
                        <xsl:if test="$type='complet'">
                          <xsl:value-of select="../@date_mut" />&nbsp;
                        </xsl:if>
                      </TD>
                    </xsl:if>
                    <xsl:if test="position() &gt; '1'">
                      <TD>
                      </TD>
                      <TD>
                      </TD>
                      <TD>
                      </TD>
                    </xsl:if>
                    <TD>
                      <xsl:if test="$type='restreint'">
                        <xsl:value-of select="@dnupro" />&nbsp;
                      </xsl:if>
                      <xsl:if test="$type='complet'">
                        <xsl:value-of select="@proprietaire_nom" />&nbsp;
                      </xsl:if>
                    </TD>
                  </TR>
                </xsl:for-each>
              </xsl:for-each>
            </Table>
          </xsl:if>
          <!-- .........................................Propriétaire de Bâtis, mode restreint................................................. -->
          <xsl:if test="$type='restreint'">
            <hr size="5"/>
            <h4>
              Propriétaire(s) du local
            </h4>

            <Table cellspacing="2" cellpadding="5">
              <TR>
                <TH>
                  Compte
                </TH>
                <TH>
                  Nom
                </TH>
                <TH>
                  Adresse
                </TH>
                <TH>
                  Type
                </TH>
              </TR>
              <xsl:for-each select="Mj/Mj_Compte_Communal_Parcelle/Mj_Bati/Mj_Proprietaire">
                <TR>
                  <TD>
                    <a>
                      <xsl:attribute name="href">http://ns227471.ovh.net/rgd/rgdservices.phtml?operation=GetReleveprop&amp;compte=<xsl:value-of select="@dnupro"/>&amp;type=restreint&amp;format=pdf&amp;version=1.0</xsl:attribute><xsl:value-of select="@dnupro" />
                    </a>
                  </TD>
                  <TD>
                    <xsl:value-of select="@proprietaire_nom" />&nbsp;
                  </TD>
                  <TD>
                    <xsl:value-of select="@proprietaire_adresse" />&nbsp;
                  </TD>
                  <TD>
                    <xsl:value-of select="@l_ccodro" />&nbsp;
                  </TD>
                </TR>
              </xsl:for-each>
            </Table>

          </xsl:if>
          <!-- .........................................Description du local, mode complet................................................. -->
          <xsl:if test="$type='complet'">
            <xsl:for-each select="Mj/Mj_Compte_Communal_Parcelle/Mj_Bati">
              <hr size="15"/>
              <h1>

                <a name="{@num_invar}">
                  Local n° <xsl:value-of select="@num_invar" />
                </a>

              </h1>
              <hr size="10"/>
              <Table cellspacing="2" cellpadding="5">
                <TR>
                  <TH align="left" width="39%">

                  </TH>
                  <TH align="left" width="40%">

                  </TH>
                  <TH align="center" width="7%">
                    Bat
                  </TH>
                  <TH align="center" width="7%">
                    Esc
                  </TH>
                  <TH align="center" width="7%">
                    Etage
                  </TH>
                </TR>

                <TR>
                  <TH align="left" width="39%">
                    Adresse :
                  </TH>
                  <TD align="left" width="40%">
                    <xsl:value-of select="@voirie" />&nbsp;<xsl:value-of select="@adresse" />&nbsp;
                  </TD>
                  <TD align="center" width="7%">
                    <xsl:value-of select="@bat" />&nbsp;
                  </TD>
                  <TD align="center" width="7%">
                    <xsl:value-of select="@ent" />&nbsp;
                  </TD>
                  <TD align="center" width="7%">
                    <xsl:value-of select="@niv" />&nbsp;
                  </TD>
                </TR>
                <TR>
                  <TH align="left" width="39%">
                    Commune :
                  </TH>
                  <TD align="left" width="40%">
                    <xsl:value-of select="@libcom" />&nbsp;
                  </TD>
                  <TD align="center" width="7%">

                  </TD>
                  <TD align="center" width="7%">

                  </TD>
                  <TD align="center" width="7%">

                  </TD>
                </TR>
                <TR>
                  <TH align="left" width="39%">
                    Type :
                  </TH>
                  <TD align="left" width="40%">
                    <xsl:value-of select="@dteloc" />&nbsp;
                  </TD>
                  <TD align="center" width="7%">

                  </TD>
                  <TD align="center" width="7%">

                  </TD>
                  <TD align="center" width="7%">

                  </TD>
                </TR>
                <TR>
                  <TH align="left" width="39%">
                    Occupation :
                  </TH>
                  <TD align="left" width="40%">
                    <xsl:value-of select="@lib_occupation" />&nbsp;
                  </TD>
                  <TD align="center" width="7%">

                  </TD>
                  <TD align="center" width="7%">

                  </TD>
                  <TD align="center" width="7%">

                  </TD>
                </TR>
                <TR>
                  <TH align="left" width="39%">
                    Nature :
                  </TH>
                  <TD align="left" width="40%">
                    <xsl:value-of select="@lib_nature" />&nbsp;
                  </TD>
                  <TD align="center" width="7%">

                  </TD>
                  <TD align="center" width="7%">

                  </TD>
                  <TD align="center" width="7%">

                  </TD>
                </TR>
                <TR>
                  <TH align="left" width="39%">
                    Année de construction :
                  </TH>
                  <TD align="left" width="40%">
                    <xsl:if test="not(@annee_constr = '0')">
                      <xsl:value-of select="@annee_constr" />&nbsp;
                    </xsl:if>
                    <xsl:if test="@annee_constr = '0'">
                      -
                    </xsl:if>
                  </TD>
                  <TD align="center" width="7%">

                  </TD>
                  <TD align="center" width="7%">

                  </TD>
                  <TD align="center" width="7%">

                  </TD>
                </TR>
                <TR>
                  <TH align="left" width="39%">
                    Date de mutation :
                  </TH>
                  <TD align="left" width="40%">
                    <xsl:value-of select="@date_mut" />&nbsp;
                  </TD>
                  <TD align="center" width="7%">

                  </TD>
                  <TD align="center" width="7%">

                  </TD>
                  <TD align="center" width="7%">

                  </TD>
                </TR>
                <TR>
                  <TH align="left" width="39%">
                    Valeur cadastrale (€) :
                  </TH>
                  <TD align="left" width="40%">
                    <xsl:value-of select="Mj_Pev/@revenu_cadastral" />&nbsp;
                  </TD>
                  <TD align="center" width="7%">

                  </TD>
                  <TD align="center" width="7%">

                  </TD>
                  <TD align="center" width="7%">

                  </TD>
                </TR>
                <TR>
                  <TH align="left" width="39%">
                    Niveaux :
                  </TH>
                  <TD align="left" width="40%">
                    <xsl:value-of select="@niveaux" />&nbsp;
                  </TD>
                  <TD align="center" width="7%">

                  </TD>
                  <TD align="center" width="7%">

                  </TD>
                  <TD align="center" width="7%">

                  </TD>
                </TR>

              </Table>
              <hr size="5"/>
              <h4>
                Propriétaire(s) du local
              </h4>
              <Table cellspacing="2" cellpadding="5">
                <TR>
                  <TH>
                    Compte
                  </TH>
                  <TH>
                    Nom
                  </TH>
                  <TH>
                    État Civil
                  </TH>
                  <TH>
                    Adresse
                  </TH>
                  <TH>
                    Type
                  </TH>
                </TR>

                <xsl:for-each select="Mj_Proprietaire">
                  <TR>
                    <TD>
                      <a>
                        <xsl:attribute name="href">http://ns227471.ovh.net/rgd/rgdservices.phtml?operation=GetReleveprop&amp;compte=<xsl:value-of select="@dnupro"/>&amp;type=complet&amp;format=pdf&amp;version=1.0</xsl:attribute><xsl:value-of select="@dnupro" />
                      </a>
                    </TD>
                    <TD>
                      <xsl:value-of select="@proprietaire_nom" />&nbsp;
                    </TD>
                    <TD>
                      <xsl:value-of select="@jdatnss" />
                      <BR/>
                      <xsl:value-of select="@dldnss" />&nbsp;
                    </TD>
                    <TD>
                      <xsl:value-of select="@proprietaire_adresse" />&nbsp;
                    </TD>
                    <TD>
                      <xsl:value-of select="@l_ccodro" />&nbsp;
                    </TD>
                  </TR>
                </xsl:for-each>

              </Table>
              <hr size="5"/>
              <h4>
                P.E.V
              </h4>
              <Table cellspacing="2" cellpadding="5">
                <TR>
                  <TH>
                    N°
                  </TH>
                  <TH>
                    Nature
                  </TH>
                  <TH>
                    Catégorie fiscale
                  </TH>
                  <TH>
                    Série Tarif batie
                  </TH>
                  <TH>
                    Local Type
                  </TH>
                  <TH>
                    Val. Loc. Ref. (€)
                  </TH>
                  <TH>
                    Val. Loc. Ann. (€)
                  </TH>
                  <TH>
                    Nature exonération
                  </TH>
                </TR>

                <xsl:for-each select="Mj_Pev">
                  <TR>
                    <TD>
                      <xsl:if test="not(@num_pev = '')">
                        <xsl:value-of select="@num_pev" />&nbsp;
                      </xsl:if>
                      <xsl:if test="@num_pev = ''">
                        -
                      </xsl:if>
                    </TD>
                    <TD>
                      <xsl:if test="not(@l_nature = '')">
                        <xsl:value-of select="@l_nature" />&nbsp;
                      </xsl:if>
                      <xsl:if test="@l_nature = ''">
                        -
                      </xsl:if>
                    </TD>
                    <TD>
                      <xsl:if test="not(@cat = '')">
                        <xsl:value-of select="@cat" />&nbsp;
                      </xsl:if>
                      <xsl:if test="@cat = ''">
                        -
                      </xsl:if>
                    </TD>
                    <TD>
                      <xsl:if test="not(@s_tar = '')">
                        <xsl:value-of select="@s_tar" />&nbsp;
                      </xsl:if>
                      <xsl:if test="@s_tar = ''">
                        -
                      </xsl:if>
                    </TD>
                    <TD>
                      <xsl:if test="not(@local_type = '')">
                        <xsl:value-of select="@local_type" />&nbsp;
                      </xsl:if>
                      <xsl:if test="@local_type = ''">
                        -
                      </xsl:if>
                    </TD>
                    <TD>
                      <xsl:if test="not(@val_loc_ref = '')">
                        <xsl:value-of select="@val_loc_ref" />&nbsp;
                      </xsl:if>
                      <xsl:if test="@val_loc_ref = ''">
                        -
                      </xsl:if>
                    </TD>
                    <TD>
                      <xsl:if test="not(@val_loc_ann = '')">
                        <xsl:value-of select="@val_loc_ann" />&nbsp;
                      </xsl:if>
                      <xsl:if test="@val_loc_ann = ''">
                        -
                      </xsl:if>
                    </TD>
                    <TD>
                      <xsl:if test="not(@l_nat_exon = '')">
                        <xsl:value-of select="@l_nat_exon" />&nbsp;
                      </xsl:if>
                      <xsl:if test="@l_nat_exon = ''">
                        -
                      </xsl:if>
                    </TD>
                  </TR>
                </xsl:for-each>
              </Table>

              <xsl:if test ="Mj_Pev/Mj_Habit_Descr[@num_pev]">
                <hr size="5"/>
                <h4>
                  Habitation principale
                  <BR/>
                </h4>
                <h5>
                  N° P.E.V : <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@num_pev" />
                </h5>
                <Table cellspacing="2" cellpadding="5">
                  <TR>
                    <TH width="30%">
                      Divers
                    </TH>
                    <TH width="40%">
                      Eléments de confort
                    </TH>
                    <TH width="10%">
                      Pièces
                    </TH>
                    <TH width="20">
                      Surfaces (m²)
                    </TH>
                  </TR>
                  <TR>
                    <TD width="30%">
                      <Table cellspacing="2" cellpadding="5">
                        <TR>
                          <TD align ="left">
                            Surface (m²) :
                          </TD>

                          <TD align ="right">
                            <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@suf_piece_total" />&nbsp;
                          </TD>

                        </TR>
                        <TR>
                          <TD align ="left">
                            Nbr pièces :
                          </TD>

                          <TD align ="right">
                            <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@nb_piece_total" />&nbsp;
                          </TD>

                        </TR>
                        <TR>
                          <TD align ="left">
                            Nbr pièces princ. :
                          </TD>

                          <TD align ="right">
                            <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@nb_piece_principal" />&nbsp;
                          </TD>

                        </TR>
                        <TR>
                          <TD align ="left">
                            Entretien :
                          </TD>

                          <TD align ="right">
                            <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@l_Etat" />&nbsp;
                          </TD>

                        </TR>
                        <TR>
                          <TD align ="left">
                            Année de Constr. :
                          </TD>

                          <TD align ="right">
                            <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@annee_constr" />&nbsp;
                          </TD>

                        </TR>
                        <TR>
                          <TD align ="left">
                            Nbr Niveaux :
                          </TD>

                          <TD align ="right">
                            <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@nb_niveaux" />&nbsp;
                          </TD>

                        </TR>
                        <TR>
                          <TD align ="left">
                            Gros murs :
                          </TD>

                          <TD align ="right">
                            <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@lib_mat_gros_mur" />&nbsp;
                          </TD>

                        </TR>
                        <TR>
                          <TD align ="left">
                            Toitures :
                          </TD>

                          <TD align ="right">
                            <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@lib_mat_toiture" />&nbsp;
                          </TD>

                        </TR>
                      </Table>
                    </TD>
                    <TD width="40%">
                      <Table cellspacing="2" cellpadding="5">
                        <xsl:if test="Mj_Pev/Mj_Habit_Descr/@nb_baignoires &gt; 0">
                          <TR>
                            <TD align ="left">
                              <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@nb_baignoires" />&nbsp;
                            </TD>
                            <TD align ="left" width ="75%">
                              Baignoire(s)
                            </TD>
                          </TR>
                        </xsl:if>

                        <xsl:if test="Mj_Pev/Mj_Habit_Descr/@nb_douches &gt; 0">
                          <TR>
                            <TD align ="left">
                              <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@nb_douches" />&nbsp;
                            </TD>
                            <TD align ="left" width ="75%">
                              Douche(s)
                            </TD>
                          </TR>
                        </xsl:if>

                        <xsl:if test="Mj_Pev/Mj_Habit_Descr/@nb_lavabos &gt; 0">
                          <TR>
                            <TD align ="left">
                              <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@nb_lavabos" />&nbsp;
                            </TD>
                            <TD align ="left" width ="75%">
                              Lavabo(s)
                            </TD>
                          </TR>
                        </xsl:if>

                        <xsl:if test="Mj_Pev/Mj_Habit_Descr/@nb_wc &gt; 0">
                          <TR>
                            <TD align ="left">
                              <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@nb_wc" />&nbsp;
                            </TD>
                            <TD align ="left" width ="75%">
                              W.C.
                            </TD>
                          </TR>
                        </xsl:if>
                        
                        
                        <TR>
                          <TD align ="left">
                            Eau :
                          </TD>
                          <TD align ="left" width ="75%">
                            <xsl:if test ="Mj_Pev/Mj_Habit_Descr/@eau = 'EAU'">
                              Oui
                            </xsl:if>
                            <xsl:if test ="Mj_Pev/Mj_Habit_Descr/@eau = ''">
                              -
                            </xsl:if>
                          </TD>
                        </TR>
                        <TR>
                          <TD align ="left">
                            Electricité :
                          </TD>
                          <TD align ="left" width ="75%">
                            <xsl:if test ="Mj_Pev/Mj_Habit_Descr/@elect = 'ELECT'">
                              Oui
                            </xsl:if>
                            <xsl:if test ="Mj_Pev/Mj_Habit_Descr/@elect = ''">
                              -
                            </xsl:if>
                          </TD>
                        </TR>
                        <TR>
                          <TD align ="left">
                            Gaz :
                          </TD>
                          <TD align ="left" width ="75%">
                            <xsl:if test ="Mj_Pev/Mj_Habit_Descr/@gaz = 'GAZ'">
                              Oui
                            </xsl:if>
                            <xsl:if test ="Mj_Pev/Mj_Habit_Descr/@gaz = ''">
                              -
                            </xsl:if>
                          </TD>
                        </TR>
                        <TR>
                          <TD align ="left">
                            Esc. de service :
                          </TD>
                          <TD align ="left" width ="75%">
                            <xsl:if test ="Mj_Pev/Mj_Habit_Descr/@esc_serv = 'ESC_SERV'">
                              Oui
                            </xsl:if>
                            <xsl:if test ="Mj_Pev/Mj_Habit_Descr/@esc_serv = ''">
                              -
                            </xsl:if>
                          </TD>
                        </TR>
                        <TR>
                          <TD align ="left">
                            Ascenseur :
                          </TD>
                          <TD align ="left" width ="75%">
                            <xsl:if test ="Mj_Pev/Mj_Habit_Descr/@asc = 'ASC'">
                              Oui
                            </xsl:if>
                            <xsl:if test ="Mj_Pev/Mj_Habit_Descr/@asc = ''">
                              -
                            </xsl:if>
                          </TD>
                        </TR>
                        <TR>
                          <TD align ="left">
                            Chauffage :
                          </TD>
                          <TD align ="left" width ="75%">
                            <xsl:if test ="Mj_Pev/Mj_Habit_Descr/@chauf = 'CHAUF'">
                              Oui
                            </xsl:if>
                            <xsl:if test ="Mj_Pev/Mj_Habit_Descr/@chauf = ''">
                              -
                            </xsl:if>
                          </TD>
                        </TR>
                        <TR>
                          <TD align ="left">
                            Vide ordure :
                          </TD>
                          <TD align ="left" width ="75%">
                            <xsl:if test ="Mj_Pev/Mj_Habit_Descr/@vide_ord = 'VIDE_ORD'">
                              Oui
                            </xsl:if>
                            <xsl:if test ="Mj_Pev/Mj_Habit_Descr/@vide_ord = ''">
                              -
                            </xsl:if>
                          </TD>
                        </TR>
                        <TR>
                          <TD align ="left">
                            Égout :
                          </TD>
                          <TD align ="left" width ="75%">
                            <xsl:if test ="Mj_Pev/Mj_Habit_Descr/@egout = 'EGOUT'">
                              Oui
                            </xsl:if>
                            <xsl:if test ="Mj_Pev/Mj_Habit_Descr/@egout = ''">
                              -
                            </xsl:if>
                          </TD>
                        </TR>
                      </Table>
                    </TD>
                    <TD width="15%">
                      <Table cellspacing="2" cellpadding="5">
                        <TR>

                          <TD align ="left">
                            <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@nb_sam" />&nbsp;
                          </TD>

                          <TD align ="left" width ="75%">
                            S. a manger
                          </TD>
                        </TR>
                        <TR>

                          <TD align ="left">
                            <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@nb_chambre" />&nbsp;
                          </TD>

                          <TD align ="left" width ="75%">
                            Chambre
                          </TD>
                        </TR>
                        <TR>

                          <TD align ="left">
                            <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@nb_cuisine_m9" />&nbsp;
                          </TD>

                          <TD align ="left" width ="75%">
                            Cuisine (inf.9m2)
                          </TD>
                        </TR>
                        <TR>

                          <TD align ="left">
                            <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@nb_cuisine_p9" />&nbsp;
                          </TD>

                          <TD align ="left" width ="75%">
                            Cuisine (sup.9m2)
                          </TD>
                        </TR>
                        <TR>

                          <TD align ="left">
                            <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@nb_salle_eau" />&nbsp;
                          </TD>

                          <TD align ="left" width ="75%">
                            S. de bain
                          </TD>
                        </TR>
                        <TR>

                          <TD align ="left">
                            <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@nb_annexe" />&nbsp;
                          </TD>

                          <TD align ="left" width ="75%">
                            Annexe
                          </TD>
                        </TR>
                      </Table>
                    </TD>
                    <TD width="15%">
                      <Table cellspacing="2" cellpadding="5">
                        <TR>

                          <TD align ="left">
                            <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@suf_cave" />&nbsp;
                          </TD>
                          <TD align ="left" width ="75%">
                            Cave(s)&nbsp;
                          </TD>

                        </TR>
                        <TR>

                          <TD align ="left">
                            <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@suf_grenier" />&nbsp;
                          </TD>
                          <TD align ="left" width ="75%">
                            Grenier(s)&nbsp;
                          </TD>

                        </TR>
                        <TR>

                          <TD align ="left">
                            <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@suf_terrasse" />&nbsp;
                          </TD>
                          <TD align ="left" width ="75%">
                            Terrasse(s)&nbsp;
                          </TD>

                        </TR>
                        <TR>

                          <TD align ="left">
                            <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@suf_garage" />&nbsp;
                          </TD>
                          <TD align ="left" width ="75%">
                            Garage(s)&nbsp;
                          </TD>

                        </TR>
                      </Table>
                    </TD>
                  </TR>
                </Table>
              </xsl:if>
              <xsl:if test ="Mj_Pev/Mj_Depend_Descr[@num_pev]">
                <hr size="5"/>
                <h4>
                  Dépendance(s)
                </h4>
                <Table cellspacing="2" cellpadding="5">
                  <TR>
                    <TH>
                      N°
                    </TH>
                    <TH>
                      Nature
                    </TH>
                    <TH>
                      Surface (m²)
                    </TH>
                    <TH>
                      Pondération
                    </TH>
                    <TH>
                      Entretien
                    </TH>
                    <TH>
                      Gros murs
                    </TH>
                    <TH>
                      Toitures
                    </TH>
                    <TH>
                      Elt. confort
                    </TH>
                  </TR>
                  <TR>

                    <TD>
                      <xsl:value-of select="Mj_Pev/Mj_Depend_Descr/@num_pev" />&nbsp;
                    </TD>
                    <TD>
                      <xsl:value-of select="Mj_Pev/Mj_Depend_Descr/@nature" />&nbsp;
                    </TD>
                    <TD>
                      <xsl:value-of select="Mj_Pev/Mj_Depend_Descr/@surface" />&nbsp;
                    </TD>
                    <TD>
                      <xsl:value-of select="Mj_Pev/Mj_Depend_Descr/@ponderation" />&nbsp;
                    </TD>
                    <TD>
                      <xsl:value-of select="Mj_Pev/Mj_Depend_Descr/@l_Etat" />&nbsp;
                    </TD>
                    <TD>
                      <xsl:value-of select="Mj_Pev/Mj_Depend_Descr/@lib_mat_gros_mur" />&nbsp;
                    </TD>
                    <TD>
                      <xsl:value-of select="Mj_Pev/Mj_Depend_Descr/@lib_mat_toiture" />&nbsp;
                    </TD>

                    <TD>
                      <Table cellspacing="2" cellpadding="5">
                        <xsl:if test="Mj_Pev/Mj_Depend_Descr/@nb_baignoires &gt; 0">
                          <TR>
                            <TD align ="left">
                              <xsl:value-of select="Mj_Pev/Mj_Depend_Descr/@nb_baignoires" />&nbsp;
                            </TD>
                            <TD align ="left" width ="75%">
                              Baignoire(s)
                            </TD>
                          </TR>
                        </xsl:if>

                        <xsl:if test="Mj_Pev/Mj_Depend_Descr/@nb_douches &gt; 0">
                          <TR>
                            <TD align ="left">
                              <xsl:value-of select="Mj_Pev/Mj_Depend_Descr/@nb_douches" />&nbsp;
                            </TD>
                            <TD align ="left" width ="75%">
                              Douche(s)
                            </TD>
                          </TR>
                        </xsl:if>

                        <xsl:if test="Mj_Pev/Mj_Depend_Descr/@nb_lavabos &gt; 0">
                          <TR>
                            <TD align ="left">
                              <xsl:value-of select="Mj_Pev/Mj_Depend_Descr/@nb_lavabos" />&nbsp;
                            </TD>
                            <TD align ="left" width ="75%">
                              Lavabo(s)
                            </TD>
                          </TR>
                        </xsl:if>

                        <xsl:if test="Mj_Pev/Mj_Depend_Descr/@nb_wc &gt; 0">
                          <TR>
                            <TD align ="left">
                              <xsl:value-of select="Mj_Pev/Mj_Depend_Descr/@nb_wc" />&nbsp;
                            </TD>
                            <TD align ="left" width ="75%">
                              W.C.
                            </TD>
                          </TR>
                        </xsl:if>
                        <TR>
                          <TD align ="left">
                            Eau :
                          </TD>
                          <TD align ="left" width ="75%">
                            <xsl:if test ="Mj_Pev/Mj_Depend_Descr/@eau = 'EAU'">
                              Oui
                            </xsl:if>
                            <xsl:if test ="Mj_Pev/Mj_Depend_Descr/@eau = ''">
                              -
                            </xsl:if>
                          </TD>
                        </TR>
                        <TR>
                          <TD align ="left">
                            Chauffage :
                          </TD>
                          <TD align ="left" width ="75%">
                            <xsl:if test ="Mj_Pev/Mj_Depend_Descr/@chauf = 'CHAUF'">
                              Oui
                            </xsl:if>
                            <xsl:if test ="Mj_Pev/Mj_Depend_Descr/@chauf = ''">
                              -
                            </xsl:if>
                          </TD>
                        </TR>
                        <TR>
                          <TD align ="left">
                            Electricité :
                          </TD>
                          <TD align ="left" width ="75%">
                            <xsl:if test ="Mj_Pev/Mj_Depend_Descr/@elect = 'ELECT'">
                              Oui
                            </xsl:if>
                            <xsl:if test ="Mj_Pev/Mj_Depend_Descr/@elect = ''">
                              -
                            </xsl:if>
                          </TD>
                        </TR>
                      </Table>
                    </TD>
                  </TR>
                </Table>
              </xsl:if>
              <xsl:if test ="Mj_Pev/Mj_Prof_Descr[@num_pev]">
                <hr size="5"/>
                <h4>
                  Locaux Professionnels
                </h4>
                <Table cellspacing="2" cellpadding="5">
                  <TR>
                    <TH>
                      N°
                    </TH>
                    <TH>
                      Surface (m²)
                    </TH>
                  </TR>
                  <TR>
                    <TD>
                      <xsl:value-of select="Mj_Pev/Mj_Prof_Descr/@num_pev" />
                    </TD>
                    <TD>
                      <xsl:value-of select="Mj_Pev/Mj_Prof_Descr/@surface" />
                    </TD>
                  </TR>
                </Table>
              </xsl:if>
            </xsl:for-each>
          </xsl:if>
        </xsl:if>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>

