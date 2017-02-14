<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="Rapport_Parcelle">
	<fo:root xmlns:fo="http://www.w3.org/1999/XSL/Format">
		<fo:layout-master-set>
			<fo:simple-page-master master-name="simple" page-height="29.7cm" page-width="21cm" margin-top="0.5cm" margin-bottom="0.5cm" margin-left="0.2cm" margin-right="0.2cm">
				<fo:region-body region-name="Content" margin="0.2cm 0.2cm 0.2cm 0.2cm"></fo:region-body>
				<fo:region-after region-name="Footer" extent="0.5in"></fo:region-after>
			</fo:simple-page-master>
		</fo:layout-master-set>
	<fo:page-sequence master-reference="simple" font-family="Helvetica">

	<!-- Début du pied de page qui se retrouvera sur chaque page -->
		<fo:static-content flow-name="Footer">
			<fo:block text-align="right" font-size="6pt">
				Page <fo:page-number />
			</fo:block>

			<fo:block text-align="right" font-size="6pt">
				<xsl:value-of select="Mj_Compte_Communal_Parcelles/Mj_Compte_Communal_Parcelle/Mj_Parcelle/@dateheure" />
			</fo:block>
		</fo:static-content>
	<!-- Fin du pied de page -->

	<fo:flow flow-name="Content">

	<fo:block>

	<!-- Création du contenu de la page pour chaque Mj_Compte_Communal_Parcelle trouvé -->

	<xsl:for-each select="Mj_Compte_Communal_Parcelles">

	<fo:table table-layout="fixed" border-collapse="collapse">
	<fo:table-body>
		<fo:table-row height="4cm">
			<!--fo:table-cell><fo:block><fo:external-graphic src="C:/serveurs/Apache2/htdocs/lib/majic_lib/pics_for_xsl/blason.bmp" content-height="2.5cm"/></fo:block></fo:table-cell-->
			<fo:table-cell><fo:block  font-weight="bold" text-align="center" font-size="14pt">Rapport de parcelles</fo:block></fo:table-cell>
		</fo:table-row>
	</fo:table-body>
	</fo:table>
	<xsl:for-each select="./Mj_Compte_Communal_Parcelle">
	<fo:block border-color="black" border-style="double" border-width="1pt">

	<fo:table table-layout="fixed" width="100%" border-collapse="collapse" font-size="10pt">

	<fo:table-body>

		<!-- Tableau d'affichage des informations de la parcelle -->
		<fo:table-row height="1cm">
			<fo:table-cell><fo:block font-weight="bold">PARCELLE</fo:block></fo:table-cell>
			<fo:table-cell><fo:block><xsl:value-of select="./Mj_Parcelle/@idpar" /></fo:block></fo:table-cell>
		</fo:table-row>
		<fo:table-row>
			<fo:table-cell><fo:block>Adresse</fo:block></fo:table-cell>
			<fo:table-cell>
				<xsl:if test="normalize-space(./Mj_Parcelle/@num_voirie) != '' ">
					<fo:block><xsl:value-of select="./Mj_Parcelle/@num_voirie" />, </fo:block>
				</xsl:if>
				<fo:block> <xsl:value-of select="./Mj_Parcelle/@adresse" />, </fo:block>
				<fo:block> <xsl:value-of select="@libcom" /></fo:block>
			</fo:table-cell>
		</fo:table-row>
		<fo:table-row>
			<fo:table-cell><fo:block>Surface cadastrale</fo:block></fo:table-cell>
			<fo:table-cell><fo:block><xsl:value-of select="./Mj_Parcelle/@contenance" /> m²</fo:block></fo:table-cell>
		</fo:table-row>
		<fo:table-row>
			<fo:table-cell><fo:block>Emprise batie</fo:block></fo:table-cell>
			<fo:table-cell>
				<xsl:if test="./Mj_Parcelle/Mj_Emprises/@titre = 'Emprise Bati' ">
					<xsl:if test="./Mj_Parcelle/Mj_Emprises[@titre='Emprise Bati']/@emprise_totale_intersect != '' ">
						<fo:block><xsl:value-of select="./Mj_Parcelle/Mj_Emprises[@titre='Emprise Bati']/@emprise_totale_intersect" /> m² = <xsl:value-of select="./Mj_Parcelle/Mj_Emprises[@titre='Emprise Bati']/@emprise_totale_ratio" /> % </fo:block>
					</xsl:if>
				</xsl:if>
				<fo:block></fo:block>
			</fo:table-cell>
		</fo:table-row>
		<fo:table-row>
			<fo:table-cell><fo:block>Emprise non-batie</fo:block></fo:table-cell>
			<fo:table-cell>
				<xsl:if test="./Mj_Parcelle/Mj_Emprises/@titre = 'Emprise Bati' ">
					<xsl:if test="./Mj_Parcelle/Mj_Emprises[@titre='Emprise Bati']/@emprise_totale_intersect != '' ">
						<fo:block>
						<xsl:variable name="surf_parcelle" select="./Mj_Parcelle/@contenance"/>
						<xsl:variable name="surf_emprisebati" select="./Mj_Parcelle/Mj_Emprises[@titre='Emprise Bati']/@emprise_totale_intersect"/>
						<xsl:variable name="res" select="round((($surf_parcelle - $surf_emprisebati)*100))*0.01"/>

						<xsl:variable name="ratio_emprisebati" select="./Mj_Parcelle/Mj_Emprises[@titre='Emprise Bati']/@emprise_totale_ratio"/>
						<xsl:variable name="resratio" select="100 - $ratio_emprisebati"/>

						<xsl:value-of select="$res" /> m² = <xsl:value-of select="$resratio" /> %</fo:block>
					</xsl:if>
				</xsl:if>
				<fo:block></fo:block>
			</fo:table-cell>
		</fo:table-row>
		<fo:table-row height="1cm">
			<fo:table-cell><fo:block>Compte propriétaire</fo:block></fo:table-cell>
			<fo:table-cell><fo:block><xsl:value-of select="./Mj_Parcelle/@dnupro" /></fo:block></fo:table-cell>
		</fo:table-row>

		<!-- Tableau d'affichage des propriétaires de la parcelle -->
		<fo:table-row height="1cm">
			<fo:table-cell><fo:block font-weight="bold">PROPRIÉTAIRE</fo:block></fo:table-cell>
			<fo:table-cell><fo:block></fo:block></fo:table-cell>
		</fo:table-row>
		<xsl:for-each select="./Mj_Proprietaire">
			<fo:table-row>
				<fo:table-cell><fo:block>Nom</fo:block></fo:table-cell>
				<fo:table-cell><fo:block><xsl:value-of select="@proprietaire_nom" /></fo:block></fo:table-cell>
			</fo:table-row>
			<fo:table-row height="1cm">
				<fo:table-cell><fo:block>Adresse</fo:block></fo:table-cell>
				<fo:table-cell><fo:block><xsl:value-of select="@proprietaire_adresse" /></fo:block></fo:table-cell>
			</fo:table-row>
		</xsl:for-each>

		<!-- Tableau d'affichage des informations de la subdi. fiscale de la parcelle -->
		<fo:table-row height="1cm">
			<fo:table-cell><fo:block font-weight="bold">SUBDIVISION FISCALE</fo:block></fo:table-cell>
			<fo:table-cell><fo:block></fo:block></fo:table-cell>
		</fo:table-row>
		<fo:table-row>
			<fo:table-cell><fo:block>Revenu</fo:block></fo:table-cell>
			<fo:table-cell><fo:block><xsl:value-of select="./Mj_Parcelle/@revenu_cadastral" /> &#x20AC;</fo:block></fo:table-cell>
		</fo:table-row>
		<fo:table-row>
			<fo:table-cell><fo:block>Surface</fo:block></fo:table-cell>
			<fo:table-cell><fo:block><xsl:value-of select="./Mj_Parcelle/@contenance" /> m²</fo:block></fo:table-cell>
		</fo:table-row>
		<fo:table-row height="1cm">
			<fo:table-cell><fo:block>Occupation</fo:block></fo:table-cell>
			<fo:table-cell><fo:block><xsl:value-of select="./Mj_Parcelle/@grss_gr" /></fo:block></fo:table-cell>
		</fo:table-row>

		<!-- Tableau d'affichage des emprises de la parcelle -->
		<fo:table-row height="1cm">
			<fo:table-cell><fo:block font-weight="bold">EMPRISES</fo:block></fo:table-cell>
			<fo:table-cell><fo:block></fo:block></fo:table-cell>
		</fo:table-row>

		<xsl:for-each select="./Mj_Parcelle/Mj_Emprises">
			<xsl:if test="./@emprise_totale_intersect != 0 ">
				<fo:table-row>
					<fo:table-cell>
						<fo:block><xsl:value-of select="./@titre" /></fo:block>
					</fo:table-cell>
					<fo:table-cell><fo:block></fo:block></fo:table-cell>
				</fo:table-row>
				<xsl:for-each select="./Mj_Emprise">
					<fo:table-row>
						<fo:table-cell><fo:block></fo:block></fo:table-cell>
						<fo:table-cell>
							<fo:block>
								Pourcentage de la parcelle intersectée : <xsl:value-of select="./@emprise_ratio_label" />
							</fo:block>
						</fo:table-cell>
					</fo:table-row>
					<xsl:for-each select="./Mj_Attributes/Mj_Attribute">
						<xsl:if test="./@title != '' ">
							<fo:table-row>
								<fo:table-cell><fo:block></fo:block></fo:table-cell>
								<fo:table-cell>
									<fo:block>
										<xsl:value-of select="./@title" /> : <xsl:value-of select="./@value" />
										<xsl:if test="./@label = 'intersect' "> m² </xsl:if>
									</fo:block>
								</fo:table-cell>
							</fo:table-row>
						</xsl:if>
					</xsl:for-each>
					<fo:table-row height="0.5cm">
						<fo:table-cell><fo:block></fo:block></fo:table-cell>
					</fo:table-row>
				</xsl:for-each>
			</xsl:if>
		</xsl:for-each>

		<fo:table-row height="1cm">
			<fo:table-cell><fo:block></fo:block></fo:table-cell>
		</fo:table-row>

		<!-- Tableau d'affichage des locaux de la parcelle -->
		<fo:table-row height="1cm">
			<fo:table-cell><fo:block font-weight="bold">LOCAL</fo:block></fo:table-cell>
			<fo:table-cell><fo:block></fo:block></fo:table-cell>
		</fo:table-row>

		<xsl:for-each select="./Mj_Bati">

			<fo:table-row>
				<fo:table-cell><fo:block>Adresse</fo:block></fo:table-cell>
				<fo:table-cell><fo:block>Batiment <xsl:value-of select="@bat" />,Etage <xsl:value-of select="@niv" />,Porte <xsl:value-of select="@num_de_porte" />,<xsl:value-of select="voirie" />,<xsl:value-of select="@adresse" /></fo:block></fo:table-cell>
			</fo:table-row>
			<fo:table-row>
				<fo:table-cell><fo:block>Type de local</fo:block></fo:table-cell>
				<fo:table-cell><fo:block><xsl:value-of select="@nat_loc" /></fo:block></fo:table-cell>
			</fo:table-row>
			<fo:table-row>
				<fo:table-cell><fo:block>Valeur locative</fo:block></fo:table-cell>
				<fo:table-cell><fo:block><xsl:value-of select="@dvlpera" /> &#x20AC;</fo:block></fo:table-cell>
			</fo:table-row>
			<fo:table-row>
				<fo:table-cell><fo:block>Millièmes et lots</fo:block></fo:table-cell>
				<fo:table-cell><fo:block></fo:block></fo:table-cell>
			</fo:table-row>
			<fo:table-row height="1cm">
				<fo:table-cell><fo:block>Compte propriétaire</fo:block></fo:table-cell>
				<fo:table-cell><fo:block><xsl:value-of select="@b_dnupro" /></fo:block></fo:table-cell>
			</fo:table-row>

			<!-- affichage en tableau des propriétaires des locaux -->
			<xsl:for-each select="./Mj_Proprietaire">
				<fo:table-row>
					<fo:table-cell>
						<fo:table>
						<fo:table-body>
							<fo:table-row height="1.5cm">
								<fo:table-cell width="2cm"><fo:block></fo:block></fo:table-cell>
								<fo:table-cell width="5cm" font-size="9pt"><fo:block>Propriétaire local</fo:block></fo:table-cell>
								<fo:table-cell width="13cm" font-size="9pt"><fo:block><xsl:value-of select="@proprietaire_nom" /> ; <xsl:value-of select="@proprietaire_adresse" /></fo:block></fo:table-cell>
							</fo:table-row>
						</fo:table-body>
						</fo:table>
					</fo:table-cell>
				</fo:table-row>
			</xsl:for-each>

		</xsl:for-each>


	</fo:table-body>

	</fo:table>

	</fo:block>

	<!-- permet de sauter une page -->
	<fo:block break-after="page"/>

	</xsl:for-each>

	<fo:block>
		<fo:table>
			<fo:table-body>
				<fo:table-row height="1.5cm">
					<fo:table-cell width="2cm"><fo:block></fo:block></fo:table-cell>
					<fo:table-cell width="5cm" font-size="9pt"><fo:block font-weight="bold" >Totaux</fo:block></fo:table-cell>
				</fo:table-row>
			</fo:table-body>
		</fo:table>
	</fo:block>

	<fo:block>
		<fo:table>
			<fo:table-body>
				<fo:table-row height="1.5cm">
					<fo:table-cell width="2cm"><fo:block></fo:block></fo:table-cell>
					<fo:table-cell width="5cm" font-size="9pt"><fo:block>Surface cadastrale</fo:block></fo:table-cell>
					<fo:table-cell width="13cm" font-size="9pt"><fo:block><xsl:value-of select="@Sum_contenance" /> m²</fo:block></fo:table-cell>
				</fo:table-row>
			</fo:table-body>
		</fo:table>
	</fo:block>

	<fo:block>
		<fo:table>
			<fo:table-body>
				<fo:table-row height="1.5cm">
					<fo:table-cell width="2cm"><fo:block></fo:block></fo:table-cell>
					<fo:table-cell width="5cm" font-size="9pt"><fo:block>Revenu</fo:block></fo:table-cell>
					<fo:table-cell width="13cm" font-size="9pt"><fo:block><xsl:value-of select="@Sum_revenu" /> &#x20AC;</fo:block></fo:table-cell>
				</fo:table-row>
			</fo:table-body>
		</fo:table>
	</fo:block>

	<fo:block>
		<fo:table>
			<fo:table-body>
				<fo:table-row height="1.5cm">
					<fo:table-cell width="2cm"><fo:block></fo:block></fo:table-cell>
					<fo:table-cell width="5cm" font-size="9pt"><fo:block>Valeur locative</fo:block></fo:table-cell>
					<fo:table-cell width="13cm" font-size="9pt"><fo:block><xsl:value-of select="@Sum_valeur_locative" /> &#x20AC;</fo:block></fo:table-cell>
				</fo:table-row>
			</fo:table-body>
		</fo:table>
	</fo:block>

	</xsl:for-each>

	</fo:block>

	</fo:flow>

	</fo:page-sequence>

	</fo:root>

</xsl:template>

</xsl:stylesheet>