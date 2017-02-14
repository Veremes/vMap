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
			<Style ss:ID="s61">
				<Alignment ss:Vertical="Bottom" ss:WrapText="1"/>
			</Style>
			<Style ss:ID="s62">
				<Alignment ss:Horizontal="Center" ss:WrapText="1"/>
			</Style>
			<Style ss:ID="s63">
				<Alignment ss:Horizontal="Center" ss:Vertical="Bottom"/>
				<Borders>
					<Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2"/>
					<Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="2"/>
					<Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2"/>
				</Borders>
			</Style>
			<Style ss:ID="s64">
				<Alignment ss:Horizontal="Center" ss:Vertical="Bottom"/>
				<Borders>
					<Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2"/>
					<Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="2"/>
					<Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="2"/>
					<Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2"/>
				</Borders>
			</Style>
			<Style ss:ID="s65">
				<Alignment ss:Horizontal="Center" ss:Vertical="Bottom"/>
			</Style>

		</Styles>
		<Worksheet ss:Name="Feuil1">
			<Table ss:ExpandedColumnCount="40" x:FullColumns="1" x:FullRows="1" ss:DefaultColumnWidth="60" ss:DefaultRowHeight="15">
				<Column ss:AutoFitWidth="0" ss:Width="103.5"/>
				<Column ss:AutoFitWidth="0" ss:Width="105"/>
				<Column ss:AutoFitWidth="0" ss:Width="70"/>
				<Column ss:AutoFitWidth="0" ss:Width="70"/>
				<Column ss:AutoFitWidth="0" ss:Width="70"/>
				<Column ss:AutoFitWidth="0" ss:Width="70"/>
				<Column ss:AutoFitWidth="0" ss:Width="70"/>
				<Column ss:AutoFitWidth="0" ss:Width="70"/>
				<Column ss:AutoFitWidth="0" ss:Width="70"/>
				<Column ss:AutoFitWidth="0" ss:Width="70"/>
				<Column ss:AutoFitWidth="0" ss:Width="70"/>
				<Column ss:AutoFitWidth="0" ss:Width="70"/>
				<Column ss:AutoFitWidth="0" ss:Width="70"/>
				<Column ss:AutoFitWidth="0" ss:Width="70"/>
				<Column ss:AutoFitWidth="0" ss:Width="70"/>
				<Column ss:AutoFitWidth="0" ss:Width="70"/>
				<Column ss:AutoFitWidth="0" ss:Width="70"/>
				<Column ss:AutoFitWidth="0" ss:Width="70"/>
				<Column ss:AutoFitWidth="0" ss:Width="70"/>
				<Column ss:AutoFitWidth="0" ss:Width="70"/>
				<Column ss:AutoFitWidth="0" ss:Width="70"/>
				<Column ss:AutoFitWidth="0" ss:Width="70"/>
				<Column ss:AutoFitWidth="0" ss:Width="70"/>
				<Column ss:AutoFitWidth="0" ss:Width="70"/>
				<Column ss:AutoFitWidth="0" ss:Width="70"/>
				<Column ss:AutoFitWidth="0" ss:Width="70"/>
				<Column ss:AutoFitWidth="0" ss:Width="70"/>
				<Column ss:AutoFitWidth="0" ss:Width="70"/>
				<Column ss:AutoFitWidth="0" ss:Width="70"/>
				<Column ss:AutoFitWidth="0" ss:Width="70"/>
				<Column ss:AutoFitWidth="0" ss:Width="70"/>
				<Column ss:AutoFitWidth="0" ss:Width="70"/>
				<Column ss:AutoFitWidth="0" ss:Width="70"/>
				<Column ss:AutoFitWidth="0" ss:Width="70"/>
				<Column ss:AutoFitWidth="0" ss:Width="70"/>
				<Column ss:AutoFitWidth="0" ss:Width="70"/>
				<Column ss:AutoFitWidth="0" ss:Width="70"/>
				<Column ss:AutoFitWidth="0" ss:Width="70"/>
				<Column ss:AutoFitWidth="0" ss:Width="70"/>
				<Column ss:AutoFitWidth="0" ss:Width="70"/>
				<Row>
					<Cell ss:MergeAcross="2" ss:StyleID="s64"><Data ss:Type="String">PARCELLES</Data></Cell>
					<Cell ss:MergeAcross="6" ss:StyleID="s64"><Data ss:Type="String">EMPRISES</Data></Cell>
				</Row>
				<Row ss:AutoFitHeight="0">
					<Cell ss:StyleID="s65"><Data ss:Type="String">Parcelle</Data></Cell>
					<Cell ss:StyleID="s65"><Data ss:Type="String">Adresse</Data></Cell>
					<Cell ss:StyleID="s65"><Data ss:Type="String">Surface cadastrale (m²)</Data></Cell>
					<Cell ss:StyleID="s65"><Data ss:Type="String"></Data></Cell>
					<Cell ss:StyleID="s65"><Data ss:Type="String"></Data></Cell>
					<Cell ss:StyleID="s65"><Data ss:Type="String"></Data></Cell>
					<Cell ss:StyleID="s65"><Data ss:Type="String"></Data></Cell>
					<Cell ss:StyleID="s65"><Data ss:Type="String"></Data></Cell>
					<Cell ss:StyleID="s65"><Data ss:Type="String"></Data></Cell>
					<Cell ss:StyleID="s65"><Data ss:Type="String"></Data></Cell>
				</Row>

				<xsl:for-each select="Mj_Compte_Communal_Parcelles/Mj_Compte_Communal_Parcelle">
					<Row ss:AutoFitHeight="0">
						<Cell><Data ss:Type="String"><xsl:value-of select="./Mj_Parcelle/@idpar" /></Data></Cell>
						<Cell><Data ss:Type="String"><xsl:value-of select="./Mj_Parcelle/@adresse" /></Data></Cell>
						<Cell><Data ss:Type="Number"><xsl:value-of select="./Mj_Parcelle/@contenance" /></Data></Cell>
						<xsl:for-each select="./Mj_Parcelle/Mj_Emprises">
							<Cell><Data ss:Type="String"><xsl:value-of select="./@titre" /> :</Data></Cell>
							<xsl:for-each select="./Mj_Emprise">
								<Cell>
									<Data ss:Type="String">Pourcentage de la parcelle intersectée : <xsl:value-of select="./@emprise_ratio_label" />,
<xsl:for-each select="./Mj_Attributes/Mj_Attribute">
											<xsl:if test="./@title != '' ">
<xsl:value-of select="./@title" /> : <xsl:value-of select="./@value" /><xsl:if test="./@label = 'intersect' "> m²</xsl:if>,
</xsl:if>
										</xsl:for-each>
									</Data>
								</Cell>
							</xsl:for-each>
						</xsl:for-each>
					</Row>
				</xsl:for-each>

				<Row ss:AutoFitHeight="0">
					<Cell><Data ss:Type="String">TOTAUX</Data></Cell>
					<Cell><Data ss:Type="String"></Data></Cell>
					<Cell><Data ss:Type="Number"><xsl:value-of select="./Mj_Compte_Communal_Parcelles/@Sum_contenance_m2" /></Data></Cell>
					<Cell><Data ss:Type="String"></Data></Cell>
					<Cell><Data ss:Type="String"></Data></Cell>
					<Cell><Data ss:Type="String"></Data></Cell>
					<Cell><Data ss:Type="String"></Data></Cell>
					<Cell><Data ss:Type="String"></Data></Cell>
					<Cell><Data ss:Type="String"></Data></Cell>
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