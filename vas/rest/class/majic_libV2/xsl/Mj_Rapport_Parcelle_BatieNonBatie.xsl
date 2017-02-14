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

			<Style	ss:ID="s63">
				<Alignment	ss:Horizontal="Center"	ss:Vertical="Bottom"/>
				<Borders>
					<Border	ss:Position="Bottom"	ss:LineStyle="Continuous"	ss:Weight="2"/>
					<Border	ss:Position="Left"	ss:LineStyle="Continuous"	ss:Weight="2"/>
					<Border	ss:Position="Top"	ss:LineStyle="Continuous"	ss:Weight="2"/>
				</Borders>
			</Style>
			<Style	ss:ID="s64">
				<Alignment	ss:Horizontal="Center"	ss:Vertical="Bottom"/>
				<Borders>
					<Border	ss:Position="Bottom"	ss:LineStyle="Continuous"	ss:Weight="2"/>
					<Border	ss:Position="Left"	ss:LineStyle="Continuous"	ss:Weight="2"/>
					<Border	ss:Position="Right"	ss:LineStyle="Continuous"	ss:Weight="2"/>
					<Border	ss:Position="Top"	ss:LineStyle="Continuous"	ss:Weight="2"/>
				</Borders>
			</Style>
			<Style	ss:ID="s65">
				<Alignment	ss:Horizontal="Center"	ss:Vertical="Bottom"/>
			</Style>

		</Styles>
		 <Worksheet ss:Name="Feuil1">
			<!--<xsl:variable name="nb_ligne"><xsl:value-of select="./XmlMapLog/XmlLog/@nb_ligne" /></xsl:variable>-->
			<Table ss:ExpandedColumnCount="7" x:FullColumns="1" x:FullRows="1" ss:DefaultColumnWidth="60" ss:DefaultRowHeight="15">
				<!--<xsl:attribute name="ss:ExpandedRowCount"><xsl:value-of select="1000" /></xsl:attribute>-->
				<Column ss:AutoFitWidth="0" ss:Width="103.5"/>
				<Column ss:AutoFitWidth="0" ss:Width="105"/>
				<Column ss:AutoFitWidth="0" ss:Width="119.25"/><!--<Column ss:Index="4" ss:AutoFitWidth="0" ss:Width="63.75"/>-->
				<Column ss:AutoFitWidth="0" ss:Width="119.25"/>
				<Column ss:AutoFitWidth="0" ss:Width="127.5"/>
				<Column ss:AutoFitWidth="0" ss:Width="119.25"/>
				<Column ss:AutoFitWidth="0" ss:Width="127.5"/>

					<Row	ss:AutoFitHeight="0"	ss:Height="15.75">
						<Cell	ss:MergeAcross="2"	ss:StyleID="s63"><Data ss:Type="String">PARCELLES</Data></Cell>
						<Cell	ss:MergeAcross="3"	ss:StyleID="s64"><Data ss:Type="String">EMPRISES</Data></Cell>
					</Row>

					<Row ss:AutoFitHeight="0">
						<Cell	ss:StyleID="s65"><Data ss:Type="String">Parcelle</Data></Cell>
						<Cell	ss:StyleID="s65"><Data ss:Type="String">Adresse</Data></Cell> 
						<Cell	ss:StyleID="s65"><Data ss:Type="String">Surface cadastrale (m²)</Data></Cell>
						<Cell	ss:StyleID="s65"><Data ss:Type="String">Emprise bâtie (m²)</Data></Cell>
						<Cell	ss:StyleID="s65"><Data ss:Type="String">Emprise bâtie (%)</Data></Cell>
						<Cell	ss:StyleID="s65"><Data ss:Type="String">Emprise non bâtie (m²)</Data></Cell>
						<Cell	ss:StyleID="s65"><Data ss:Type="String">Emprise non bâtie (%)</Data></Cell>
					</Row>
					<xsl:for-each select="Mj_Compte_Communal_Parcelles/Mj_Compte_Communal_Parcelle">

						<Row ss:AutoFitHeight="0"> 
							<Cell><Data ss:Type="String"><xsl:value-of select="./Mj_Parcelle/@idpar" /></Data></Cell>
							<Cell><Data ss:Type="String"><xsl:value-of select="./Mj_Parcelle/@adresse" /></Data></Cell>
							<Cell><Data ss:Type="Number"><xsl:value-of select="./Mj_Parcelle/@contenance" /></Data></Cell>
							<Cell>
								<Data ss:Type="Number">
									<xsl:if test="./Mj_Parcelle/Mj_Emprises/@titre = 'Emprise Bati' ">
										<xsl:if test="./Mj_Parcelle/Mj_Emprises[@titre='Emprise Bati']/@emprise_totale_intersect != '' ">
											<xsl:value-of select="./Mj_Parcelle/Mj_Emprises[@titre='Emprise Bati']/@emprise_totale_intersect" />
										</xsl:if>
									</xsl:if>
								</Data>
							</Cell>	
							<Cell>
								<Data ss:Type="Number">

									<xsl:if test="./Mj_Parcelle/Mj_Emprises/@titre = 'Emprise Bati' ">
										<xsl:if test="./Mj_Parcelle/Mj_Emprises[@titre='Emprise Bati']/@emprise_totale_intersect != '' ">
											<xsl:value-of select="./Mj_Parcelle/Mj_Emprises[@titre='Emprise Bati']/@emprise_totale_ratio" />
										</xsl:if>
									</xsl:if>
								</Data>
							</Cell>

							<Cell>
								<Data ss:Type="Number">
									<xsl:if test="./Mj_Parcelle/Mj_Emprises/@titre = 'Emprise Bati' ">
										<xsl:if test="./Mj_Parcelle/Mj_Emprises[@titre='Emprise Bati']/@emprise_totale_intersect != '' ">
											<xsl:variable name="surf_parcelle" select="./Mj_Parcelle/@contenance"/>
											<xsl:variable name="surf_emprisebati" select="./Mj_Parcelle/Mj_Emprises[@titre='Emprise Bati']/@emprise_totale_intersect"/>
											<xsl:variable name="res" select="round((($surf_parcelle - $surf_emprisebati)*100))*0.01"/>
											<xsl:value-of select="$res" />
										</xsl:if>
									</xsl:if>
								</Data>
							</Cell>

							<Cell>
								<Data ss:Type="Number">
								
									<xsl:if test="./Mj_Parcelle/Mj_Emprises/@titre = 'Emprise Bati' ">
										<xsl:if test="./Mj_Parcelle/Mj_Emprises[@titre='Emprise Bati']/@emprise_totale_intersect != '' ">
											<xsl:variable name="ratio_emprisebati" select="./Mj_Parcelle/Mj_Emprises[@titre='Emprise Bati']/@emprise_totale_ratio"/>
											<xsl:variable name="resratio" select="100 - $ratio_emprisebati"/>
											<xsl:value-of select="$resratio" />
										</xsl:if>
									</xsl:if>
								</Data>
							</Cell>
						</Row>
						

					</xsl:for-each>

					<Row ss:AutoFitHeight="0">	
						<Cell><Data ss:Type="String">TOTAUX</Data></Cell>
						<Cell><Data ss:Type="String"></Data></Cell>
						<Cell><Data ss:Type="Number"><xsl:value-of select="./Mj_Compte_Communal_Parcelles/@Sum_contenance_m2" /></Data></Cell>
						<Cell><Data ss:Type="Number"><xsl:value-of select="./Mj_Compte_Communal_Parcelles/@Sum_contenance_bati" /></Data></Cell>
						<Cell><Data ss:Type="String"></Data></Cell>
						<Cell>
							<Data ss:Type="String">
								<xsl:variable name="sum_contenance" select="./Mj_Compte_Communal_Parcelles/@Sum_contenance_m2"/>
								<xsl:variable name="sum_contenance_bati" select="./Mj_Compte_Communal_Parcelles/@Sum_contenance_bati"/>
								<xsl:variable name="sum_contenance_non_bati" select="$sum_contenance - $sum_contenance_bati"/>
								<xsl:value-of select="$sum_contenance_non_bati" />	
							</Data>
						</Cell>
						<Cell><Data ss:Type="String"></Data></Cell>	
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