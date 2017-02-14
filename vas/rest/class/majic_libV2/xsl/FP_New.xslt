<?xsl version="1.0" encoding="utf-8" standalone="no"?>
<!DOCTYPE xsl:stylesheet [
  <!ENTITY nbsp "&#160;">
]>
<html xsl:version="1.0"
      xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
      lang="fr"
      
      >
     
      
        <head>
          <!--<link rel="stylesheet" href="C:\\svn\\lib\\majic_lib\\xsl\\style.css" type="text/css" />-->
          <link href="style.css" type="text/css" rel="stylesheet" />
          
        </head>
		    <body>
          <hr size="5"/>
          <h1>
            <xsl:for-each select="Mj/Mj_Compte_Communal_Parcelle/Mj_Parcelle">
              Parcelle <xsl:value-of select="@section" /><xsl:value-of select="@num_parc" />
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
                Cpte Propriétaire :
              </TH>
              <TD align="left" width ="85%">
                <xsl:for-each select="Mj/Mj_Compte_Communal_Parcelle">
                  <xsl:value-of select="Mj_Parcelle/@dnupro" /> <BR/>
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
            <TR>
              <TH align="left" width ="15%">
                Urbaine :
              </TH>
              <TD align="left" width ="85%">
                A Chercher ???
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
                A Chercher ???
              </TD>
            </TR>
           </Table>
          <img>
            <xsl:attribute name="src">
              <xsl:value-of select = "concat('http://www.maison-passive-nice.fr/images/','parcelle.gif')"/>
            </xsl:attribute>
          </img>          
            <hr size="5"/>
            <h4>
              Propriétaire(s) de la parcelle
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
                Etat Civil
              </TH>
              <TH>
                Adresse
              </TH>
              <TH>
                Type
              </TH>
            </TR>
            <xsl:for-each select="Mj/Mj_Compte_Communal_Parcelle/Mj_Proprietaire">
            <TR>
              <TD>
                <xsl:value-of select="@dnupro" />&nbsp;
              </TD>
              <TD>
                <xsl:value-of select="@proprietaire_nom_tiers" />&nbsp;
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
                <xsl:value-of select="@l_ccodro" /> &nbsp;
              </TD>
            </TR>
            </xsl:for-each>
          </Table>
          <hr size="5"/>
          <h4>
            Subdivision(s) Fiscale(s)
          </h4>
          <Table cellspacing="2" cellpadding="5">
            <TR>
              <TH>
                Lettre
              </TH>
              <TH>
                groupe
              </TH>
              <TH>
                Nature
              </TH>
              <TH>
                Occupation
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
              <TH>
                Revenu (€)
              </TH>
              <TH>
                Référence
              </TH>
            </TR>
            <xsl:for-each select="Mj/Mj_Compte_Communal_Parcelle/Mj_Parcelle/Mj_Suf">
              <TR>
                <TD>
                  <xsl:value-of select="@suf" />&nbsp;
                </TD>
                <TD>
                  <xsl:value-of select="@grss_gr" />&nbsp;
                </TD>
                <TD>
                  <xsl:value-of select="@nat_cult" />&nbsp;
                </TD>
                <TD>
                  ???
                </TD>
                <TD>
                  <xsl:value-of select="@clas" />&nbsp;
                </TD>
                <TD>
                  <xsl:value-of select="@dnupro" />&nbsp;
                </TD>
                <TD>
                  <xsl:value-of select="@contenance_suf" />&nbsp;
                </TD>
                <TD>
                  <xsl:value-of select="@revenu_cadastral_txt" />&nbsp;
                </TD>
                <TD>
                  <xsl:value-of select="@revenu_reference_txt" />&nbsp;
                </TD>
              </TR>
            </xsl:for-each>
          </Table>
          <hr size="5"/>
          <h4>
            Elément(s) Bâti(s)
          </h4>
          <Table cellspacing="2" cellpadding="5">
            <TR>
              <TH>
                Ref. local
              </TH>
              <TH>
                Nature
              </TH>
              <TH>
                Date mutation
              </TH>
              <TH>
                Propriétaire(s)
              </TH>
            </TR>
            <xsl:for-each select="Mj/Mj_Compte_Communal_Parcelle/Mj_Bati">
            <TR>
              <TD>
					<a href="<xsl:value-of select="@num_invar" />"><xsl:value-of select="@num_invar" /></a>&nbsp;
              </TD>
              <TD>
                <xsl:value-of select="@nature" />&nbsp;
              </TD>
              <TD>
                <xsl:value-of select="@date_mut" />&nbsp;
              </TD>
              <TD>
                <xsl:value-of select="Mj_Proprietaire/@proprietaire_nom" />&nbsp;
              </TD>
            </TR>
            </xsl:for-each>
          </Table>
          <xsl:for-each select="Mj/Mj_Compte_Communal_Parcelle/Mj_Bati">
          <hr size="15"/>
          <h1>
            
            <a name="<xsl:value-of select="@num_invar" />">Local n° <xsl:value-of select="@num_invar" /></a>
            
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
                <xsl:value-of select="@occupation" />&nbsp;
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
                <xsl:value-of select="@nature" />&nbsp;
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
                <xsl:value-of select="@annee_constr" />&nbsp;
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
                ????
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

              <TR>
                <TD>
                  <xsl:value-of select="Mj_Proprietaire/@dnupro" />&nbsp;
                </TD>
                <TD>
                  <xsl:value-of select="Mj_Proprietaire/@proprietaire_nom" />&nbsp;
                </TD>
                <TD>
                  <xsl:value-of select="Mj_Proprietaire/@jdatnss" />
                  <BR/>
                  <xsl:value-of select="Mj_Proprietaire/@dldnss" />&nbsp;
                </TD>
                <TD>
                  <xsl:value-of select="Mj_Proprietaire/@proprietaire_adresse" />&nbsp;
                </TD>
                <TD>
                  <xsl:value-of select="Mj_Proprietaire/@l_ccodro" />&nbsp;
                </TD>
              </TR>

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
                Catégorie
              </TH>
              <TH>
                Tarif
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
                Nat. Exemp.
              </TH>
            </TR>
            
            <TR>
              <TD>
                <xsl:value-of select="Mj_Pev/@num_pev" />&nbsp;
              </TD>
              <TD>
                <xsl:value-of select="Mj_Pev/@af" />&nbsp;
              </TD>
              <TD>
                <xsl:value-of select="Mj_Pev/@cat" />&nbsp;
              </TD>
              <TD>
                <xsl:value-of select="Mj_Pev/@s_tar" />&nbsp;
              </TD>
              <TD>
                <xsl:value-of select="Mj_Pev/@local_type" />&nbsp;
              </TD>
              <TD>
                <xsl:value-of select="Mj_Pev/@val_loc_ref" />&nbsp;
              </TD>
              <TD>
                <xsl:value-of select="Mj_Pev/@val_loc_ann" />&nbsp;
              </TD>
              <TD>
                <xsl:value-of select="Mj_Pev/@nature" />&nbsp;
              </TD>
            </TR>            
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
                        <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@Etat" />&nbsp;
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
                        <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@mat_gros_mur" />&nbsp;
                      </TD>
                    
                  </TR>
                  <TR>
                    <TD align ="left">
                      Toitures : 
                    </TD>
                    
                      <TD align ="right">
                        <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@mat_toiture" />&nbsp;
                      </TD>
                    
                  </TR>
                </Table>
              </TD> 
              <TD width="40%">
                <Table cellspacing="2" cellpadding="5">
                  <TR>
                    <TD align ="left">
                      <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@nb_baignoires" />&nbsp;
                    </TD>
                    <TD align ="left" width ="75%">
                      Baignoire(s)
                    </TD>
                  </TR>
                  <TR>
                    
                      <TD align ="left">
                        <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@nb_douches" />&nbsp;
                      </TD>
                    
                    <TD align ="left" width ="75%">
                      Douche(s)
                    </TD>
                  </TR>
                  <TR>
                    
                      <TD align ="left">
                        <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@nb_lavabos" />&nbsp;
                      </TD>
                    
                    <TD align ="left" width ="75%">
                      Lavabo(s)
                    </TD>  
                  </TR>
                  <TR>
                    
                      <TD align ="left">
                        <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@nb_wc" />&nbsp;
                      </TD>
                  
                    <TD align ="left" width ="75%">
                      W.C.
                    </TD>
                  </TR>
                  <TR>
                    <TD align ="left">
                       Eau :
                    </TD>
                    <TD align ="left" width ="75%">
                       <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@eau" />&nbsp;
                    </TD>
                  </TR>
                  <TR>
                    <TD align ="left">
                      Electricité :
                    </TD>
                    <TD align ="left" width ="75%">
                      <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@elect" />&nbsp;
                    </TD>
                  </TR>
                  <TR>
                    <TD align ="left">
                      Gaz :
                    </TD>
                    <TD align ="left" width ="75%">
                      <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@gaz" />&nbsp;
                    </TD>
                  </TR>
                  <TR>
                    <TD align ="left">
                      Esc. de service :
                    </TD>
                    <TD align ="left" width ="75%">
                      <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@esc_serv" />&nbsp;
                    </TD>
                  </TR>
                  <TR>
                    <TD align ="left">
                      Ascenseur :
                    </TD>
                    <TD align ="left" width ="75%">
                      <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@asc" />&nbsp;
                    </TD>
                  </TR>
                  <TR>
                    <TD align ="left">
                      Chauffage :
                    </TD>
                    <TD align ="left" width ="75%">
                      <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@chauf" />&nbsp;
                    </TD>
                  </TR>
                  <TR>
                    <TD align ="left">
                      Vide ordure :
                    </TD>
                    <TD align ="left" width ="75%">
                      <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@vide_ord" />&nbsp;
                    </TD>
                  </TR>
                  <TR>
                    <TD align ="left">
                      Égout :
                    </TD>
                    <TD align ="left" width ="75%">
                      <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@egout" />&nbsp;
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
                        <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@cave" />&nbsp;
                      </TD>
                    
                  </TR>
                  <TR>
                    
                      <TD align ="left">
                        <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@suf_grenier" />&nbsp;
                      </TD>
                      <TD align ="left" width ="75%">
                        <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@grenier" />&nbsp;
                      </TD>
                    
                  </TR>
                  <TR>
                    
                      <TD align ="left">
                        <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@suf_terrasse" />&nbsp;
                      </TD>
                      <TD align ="left" width ="75%">
                        <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@terrasse" />&nbsp;
                      </TD>
                    
                  </TR>
                  <TR>
                   
                      <TD align ="left">
                        <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@suf_garage" />&nbsp;
                      </TD>
                      <TD align ="left" width ="75%">
                        <xsl:value-of select="Mj_Pev/Mj_Habit_Descr/@garage" />&nbsp;
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
                  <xsl:value-of select="Mj_Pev/Mj_Depend_Descr/@num_depend" />&nbsp;
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
                  <xsl:value-of select="Mj_Pev/Mj_Depend_Descr/@Etat" />&nbsp;
                </TD>
                <TD>
                  <xsl:value-of select="Mj_Pev/Mj_Depend_Descr/@mat_gros_mur" />&nbsp;
                </TD>
                <TD>
                  <xsl:value-of select="Mj_Pev/Mj_Depend_Descr/@mat_toiture" />&nbsp;
                </TD>

                <TD>

                  (<xsl:value-of select="Mj_Pev/Mj_Depend_Descr/@eau" />) (<xsl:value-of select="Mj_Pev/Mj_Depend_Descr/@elect" />) (<xsl:value-of select="Mj_Pev/Mj_Depend_Descr/@chauf" />)&nbsp;

                  <Table cellspacing="2" cellpadding="5">
                    <TR>

                      <TD align ="left">
                        <xsl:value-of select="Mj_Pev/Mj_Depend_Descr/@nb_baignoires" />&nbsp;
                      </TD>

                      <TD align ="left" width ="75%">
                        Baignoire(s)
                      </TD>
                    </TR>
                    <TR>

                      <TD align ="left">
                        <xsl:value-of select="Mj_Pev/Mj_Depend_Descr/@nb_douches" />&nbsp;
                      </TD>

                      <TD align ="left" width ="75%">
                        Douche(s)
                      </TD>

                    </TR>
                    <TR>

                      <TD align ="left">
                        <xsl:value-of select="Mj_Pev/Mj_Depend_Descr/@nb_lavabos" />&nbsp;
                      </TD>

                      <TD align ="left" width ="75%">
                        Lavabo(s)
                      </TD>
                    </TR>
                    <TR>

                      <TD align ="left">
                        <xsl:value-of select="Mj_Pev/Mj_Depend_Descr/@nb_wc" />&nbsp;
                      </TD>

                      <TD align ="left" width ="75%">
                        W.C.
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
        </body> 
   </html>
    
