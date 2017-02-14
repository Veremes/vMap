# coding: utf-8
import os

def DisplayInfos(self):
	# this function return the file name of the module
	return [0, self.Tools.trad["dep_postgres_1"].format(os.path.basename(__file__))]


def Check(self, mode):
	self.Tools.logger.info(self.Tools.trad["dep_postgres_2"])
	if mode != 'uninstall':
		versionPostgres = None
		result = self.Tools.GetQuery("SHOW server_version", "postgres")
		if result[0] == 0:
			versionPostgres = result[1]
		else:
			return result

		tmp = versionPostgres.split('.')
		if 'version' in self.depParams:
			if self.depParams['version'] != "trunk":
				if float(tmp[0] + '.' + tmp[1]) < float(self.depParams['version']):
					return [1, self.Tools.trad["dep_postgres_3"].format(self.depParams['version'])]

	return [0, '']
