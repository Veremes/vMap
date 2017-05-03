# coding: utf-8
import os
import platform

def DisplayInfos(self):
	# this function return the file name of the module
	return [0, self.Tools.trad["dep_post-install_1"].format(os.path.basename(__file__))]


def Check(self, mode):
	if mode == 'update':
		# Ajout de selected_propeties dans properties.inc
		pathProperties = os.path.join(self.Tools.params['vasDirectory'], 'rest', 'conf', 'properties.inc')
		
		needToUpdate = True
		with open(pathProperties, "r") as file:
			for line in file:
				if 'selected_propeties' in line:
					needToUpdate = False
					break
		if needToUpdate:
			self.Tools.fileManipulator.traceBack.Edit(pathProperties)
			propertiesFile = open(pathProperties, 'r', encoding="utf-8")
			propertiesData = propertiesFile.readlines()
			propertiesFile.close()
		
			# finding end of file
			EOFindex = 0
			for index, line in enumerate(propertiesData):
				if "$properties" in line:
					EOFindex = index
					break
		
			# adding selected to the file
			propertiesData.insert(EOFindex, 'require "selected_properties.inc";\n')
		
			propertiesFile = open(pathProperties, 'w', encoding="utf-8")
			propertiesFile.writelines(propertiesData)
			propertiesFile.close()
	return [0, '']
