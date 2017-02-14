# coding: utf-8
import os

def DisplayInfos(self):
	# this function return the file name of the module
	return [0, self.Tools.trad["dep_apache_1"].format(os.path.basename(__file__))]


def Check(self, mode):
	self.Tools.logger.info(self.Tools.trad["dep_apache_2"])
	if mode != 'uninstall':
		versionApache = None

		result = self.Tools.RunCommand([self.Tools.apache['exePath'], '-v'])
		if result[0] == 0:
			version = result[1]
		else:
			return result

		versionApache = version[0].split('/')[1].split(' ')[0]
		tmp = versionApache.split('.')

		if 'version' in self.depParams:
			if self.depParams['version'] != "trunk":
				if float(tmp[0] + '.' + tmp[1]) < float(self.depParams['version']):
					return [1, self.Tools.trad["dep_apache_3"].format(self.depParams['version'])]

	return [0, '']
