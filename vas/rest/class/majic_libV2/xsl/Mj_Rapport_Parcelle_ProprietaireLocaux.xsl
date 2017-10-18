<?xml version="1.0" encoding='utf-8' ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="xml" indent="yes"/>
<xsl:template match="Rapport_Parcelle">
<?mso-application progid="Excel.Sheet"?>
	<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
		xmlns:o="urn:schemas-microsoft-com:office:office"
		xmlns:x="urn:schemas-microsoft-com:office:excel"
		xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
		xmlns:html="http://www.w3.org/TR/REC-html40">
		<DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
			<Author>Veremap.pro</Author>
			<LastAuthor>Veremap.pro</LastAuthor>
			<Company>Veremes</Company>
		</DocumentProperties>
		<ExcelWorkbook xmlns="urn:schemas-microsoft-com:office:excel">
			<WindowHeight>12300</WindowHeight>
			<WindowWidth>18915</WindowWidth>
			<WindowTopX>120</WindowTopX>
			<WindowTopY>105</WindowTopY>
			<ProtectStructure>False</ProtectStructure>
			<ProtectWindows>False</ProtectWindows>
		</ExcelWorkbook>
		<Styles>
			<Style ss:ID="Default" ss:Name="Normal">
				<Alignment ss:Vertical="Bottom"/>
				<Borders/>
				<Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#000000"/>
				<Interior/>
				<NumberFormat/>
				<Protection/>
			</Style>
			<Style	ss:ID="s64">
				<Alignment	ss:Horizontal="Center"	ss:Vertical="Top"/>
				<Borders>
					<Border	ss:Position="Bottom"	ss:LineStyle="Continuous"	ss:Weight="2"/>
					<Border	ss:Position="Left"	ss:LineStyle="Continuous"	ss:Weight="2"/>
					<Border	ss:Position="Right"	ss:LineStyle="Continuous"	ss:Weight="2"/>
					<Border	ss:Position="Top"	ss:LineStyle="Continuous"	ss:Weight="2"/>
				</Borders>
			</Style>
			<Style ss:ID="s65">
				<Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
			</Style>
		</Styles>

		<Worksheet ss:Name="Feuil1">
			<!--<xsl:variable name="nb_ligne"><xsl:value-of select="./XmlMapLog/XmlLog/@nb_ligne" /></xsl:variable>-->
			<Table ss:DefaultColumnWidth="60" ss:DefaultRowHeight="15">
				<!--<xsl:attribute name="ss:ExpandedRowCount"><xsl:value-of select="1000" /></xsl:attribute>-->
				<Column ss:AutoFitWidth="0" ss:Width="100"/>
				<Column ss:AutoFitWidth="0" ss:Width="100"/>
				<Column ss:AutoFitWidth="0" ss:Width="200"/>
				<Column ss:AutoFitWidth="0" ss:Width="55"/>
				<Column ss:AutoFitWidth="0" ss:Width="60"/>
				<Column ss:AutoFitWidth="0" ss:Width="70"/>
				<Column ss:AutoFitWidth="0" ss:Width="70"/>
				<Column ss:AutoFitWidth="0" ss:Width="70"/>
				<Column ss:AutoFitWidth="0" ss:Width="90"/>
				<Column ss:AutoFitWidth="0" ss:Width="70"/>
				<Column ss:AutoFitWidth="0" ss:Width="45"/>
				<Column ss:AutoFitWidth="0" ss:Width="200"/>
				<Column ss:AutoFitWidth="0" ss:Width="80"/>
				<Column ss:AutoFitWidth="0" ss:Width="115"/>
				<Column ss:AutoFitWidth="0" ss:Width="200"/>
				<Column ss:AutoFitWidth="0" ss:Width="70"/>
				<Column ss:AutoFitWidth="0" ss:Width="80"/>
				<Row ss:AutoFitHeight="0" ss:Height="15.75" ss:StyleID="s64">
					<Cell ss:MergeAcross="3"><Data ss:Type="String">PARCELLES</Data></Cell>
					<Cell ss:MergeAcross="12"><Data ss:Type="String">LOCAUX</Data></Cell>
				</Row>

				<Row ss:AutoFitHeight="0" ss:Height="30" ss:StyleID="s65">
					<Cell><Data ss:Type="String">Parcelle</Data></Cell>
					<Cell><Data ss:Type="String">Commune</Data></Cell>
					<Cell><Data ss:Type="String">Adresse parcelle</Data></Cell>
					<Cell><Data ss:Type="String">Superficie parcelle(m²)</Data></Cell>
					<Cell><Data ss:Type="String">Invariant</Data></Cell>
					<Cell><Data ss:Type="String">Superficie local(m²)</Data></Cell>
					<Cell><Data ss:Type="String">Type</Data></Cell>
					<Cell><Data ss:Type="String">Nature</Data></Cell>
					<Cell><Data ss:Type="String">Occupation</Data></Cell>
					<Cell><Data ss:Type="String">Année construction</Data></Cell>
					<Cell><Data ss:Type="String">Étage</Data></Cell>
					<Cell><Data ss:Type="String">Adresse local</Data></Cell>
					<Cell><Data ss:Type="String">Compte propriétaire</Data></Cell>
					<Cell><Data ss:Type="String">Propriétaire</Data></Cell>
					<Cell><Data ss:Type="String">Adresse propriétaire</Data></Cell>
					<Cell><Data ss:Type="String">Indivision</Data></Cell>
					<Cell><Data ss:Type="String">Droit</Data></Cell>
				</Row>

				<xsl:for-each select="Mj_Bati_Parcelles/Mj_Bati_Parcelle">
					<Row ss:AutoFitHeight="0">
						<Cell><Data ss:Type="String"><xsl:value-of select="@id_par" /></Data></Cell>
						<Cell><Data ss:Type="String"><xsl:value-of select="@com" /></Data></Cell>
						<Cell><Data ss:Type="String"><xsl:value-of select="@adresse" /></Data></Cell>
						<Cell><Data ss:Type="Number"><xsl:value-of select="@contenance" /></Data></Cell>
						<xsl:if test="./Mj_Bati/@bat != '' ">
							<Cell><Data ss:Type="String"><xsl:value-of select="./Mj_Bati/@num_invar" /></Data></Cell>
							<Cell><Data ss:Type="Number"><xsl:value-of select="./Mj_Bati/Mj_Pev/Mj_Habit_Descr/@suf_piece_total" /></Data></Cell>
							<Cell><Data ss:Type="String"><xsl:value-of select="./Mj_Bati/@local_type" /></Data></Cell>
							<Cell><Data ss:Type="String"><xsl:value-of select="./Mj_Bati/@lib_nature" /></Data></Cell>
							<Cell><Data ss:Type="String"><xsl:value-of select="./Mj_Bati/@lib_occupation" /></Data></Cell>
							<Cell><Data ss:Type="String"><xsl:value-of select="./Mj_Bati/@annee_constr" /></Data></Cell>
							<Cell><Data ss:Type="String"><xsl:value-of select="./Mj_Bati/@niv" /></Data></Cell>
							<Cell><Data ss:Type="String">Batiment <xsl:value-of select="./Mj_Bati/@bat" /> <xsl:value-of select="./Mj_Bati/@ent" />, Etage <xsl:value-of select="./Mj_Bati/@niv" />, Porte  <xsl:value-of select="./Mj_Bati/@num_de_porte" />,, <xsl:value-of select="./Mj_Bati/@adresse" /></Data></Cell>
						</xsl:if>
						<xsl:if test="./Mj_Bati/@bat = '' ">
							<Cell><Data ss:Type="String"></Data></Cell>
							<Cell><Data ss:Type="String"></Data></Cell>
							<Cell><Data ss:Type="String"></Data></Cell>
							<Cell><Data ss:Type="String"></Data></Cell>
							<Cell><Data ss:Type="String"></Data></Cell>
							<Cell><Data ss:Type="String"></Data></Cell>
							<Cell><Data ss:Type="String"></Data></Cell>
							<Cell><Data ss:Type="String"></Data></Cell>
						</xsl:if>
						<Cell><Data ss:Type="String"><xsl:value-of select="./Mj_Bati/Mj_Proprietaire/@dnupro" /></Data></Cell>
						<Cell><Data ss:Type="String"><xsl:value-of select="./Mj_Bati/Mj_Proprietaire/@proprietaire_nom" /></Data></Cell>
						<Cell><Data ss:Type="String"><xsl:value-of select="./Mj_Bati/Mj_Proprietaire/@proprietaire_adresse" /></Data></Cell>
						<Cell><Data ss:Type="String"><xsl:value-of select="./Mj_Bati/Mj_Proprietaire/@l_ccodem" /></Data></Cell>
						<Cell><Data ss:Type="String"><xsl:value-of select="./Mj_Bati/Mj_Proprietaire/@l_ccodro" /></Data></Cell>
					</Row>

					<xsl:for-each select="./Mj_Bati/Mj_Proprietaire">
						<xsl:if test="position()!=1">
							<Row ss:AutoFitHeight="0">
								<Cell><Data ss:Type="String"></Data></Cell>
								<Cell><Data ss:Type="String"></Data></Cell>
								<Cell><Data ss:Type="String"></Data></Cell>
								<Cell><Data ss:Type="String"></Data></Cell>
								<Cell><Data ss:Type="String"><xsl:value-of select="../@num_invar" /></Data></Cell>
								<Cell><Data ss:Type="Number"><xsl:value-of select="../Mj_Pev/Mj_Habit_Descr/@suf_piece_total" /></Data></Cell>
								<Cell><Data ss:Type="String"><xsl:value-of select="../@local_type" /></Data></Cell>
								<Cell><Data ss:Type="String"><xsl:value-of select="../@lib_nature" /></Data></Cell>
								<Cell><Data ss:Type="String"><xsl:value-of select="../@lib_occupation" /></Data></Cell>
								<Cell><Data ss:Type="String"><xsl:value-of select="../@annee_constr" /></Data></Cell>
								<Cell><Data ss:Type="String"><xsl:value-of select="../@niv" /></Data></Cell>
								<Cell><Data ss:Type="String">Batiment <xsl:value-of select="../@bat" /> <xsl:value-of select="../@ent" />, Etage <xsl:value-of select="../@niv" />, Porte  <xsl:value-of select="../@num_de_porte" />,, <xsl:value-of select="../@adresse" /></Data></Cell>
								<Cell><Data ss:Type="String"><xsl:value-of select="./@dnupro" /></Data></Cell>
								<Cell><Data ss:Type="String"><xsl:value-of select="./@proprietaire_nom" /></Data></Cell>
								<Cell><Data ss:Type="String"><xsl:value-of select="./@proprietaire_adresse" /></Data></Cell>
								<Cell><Data ss:Type="String"><xsl:value-of select="./@l_ccodem" /></Data></Cell>
								<Cell><Data ss:Type="String"><xsl:value-of select="./@l_ccodro" /></Data></Cell>
							</Row>
						</xsl:if>
					</xsl:for-each>
				</xsl:for-each>

				<Row ss:AutoFitHeight="0">
					<Cell><Data ss:Type="String">TOTAUX</Data></Cell>
					<Cell><Data ss:Type="String"></Data></Cell>
					<Cell><Data ss:Type="String"></Data></Cell>
					<Cell><Data ss:Type="Number"><xsl:value-of select="./Mj_Bati_Parcelles/@sum_contenance_m2" /></Data></Cell>
				</Row>

			</Table>
			<WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
				<PageSetup>
					<Header x:Margin="0.3"/>
					<Footer x:Margin="0.3"/>
					<PageMargins x:Bottom="0.75" x:Left="0.7" x:Right="0.7" x:Top="0.75"/>
				</PageSetup>
				<Unsynced/>
				<Print>
					<ValidPrinterInfo/>
					<PaperSizeIndex>9</PaperSizeIndex>
					<HorizontalResolution>600</HorizontalResolution>
					<VerticalResolution>600</VerticalResolution>
				</Print>
				<Selected/>
				<ProtectObjects>False</ProtectObjects>
				<ProtectScenarios>False</ProtectScenarios>
			</WorksheetOptions>
		 </Worksheet>
	</Workbook>
</xsl:template>
</xsl:stylesheet>