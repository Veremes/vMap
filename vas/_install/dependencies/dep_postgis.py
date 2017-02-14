# coding: utf-8
import os

def DisplayInfos(self):
	# this function return the file name of the module
	return [0, self.Tools.trad["dep_postgis_1"].format(os.path.basename(__file__))]


def Check(self, mode):
	self.Tools.logger.info(self.Tools.trad["dep_postgis_2"])
	if mode == 'install':
		versionPostgis = None
		result = self.Tools.GetQuery("SELECT default_version FROM pg_available_extensions WHERE name = 'postgis'", "postgres")
		if result[0] == 0:
			versionPostgis = result[1]
		else:
			return result

		if versionPostgis is None:
			return [1, self.Tools.trad["dep_postgis_3"]]
		else:
			tmp = versionPostgis.split('.')
			if 'version' in self.depParams:
				if self.depParams['version'] != "trunk":
					if float(tmp[0] + '.' + tmp[1]) < float(self.depParams['version']):
						return [1, self.Tools.trad["dep_postgis_4"].format(self.depParams['version'])]

		result = self.Tools.ExecuteSql("CREATE EXTENSION IF NOT EXISTS postgis")
		if result[0] != 0:
			return result
	return [0, '']
