# coding: utf-8
import os
import platform


def DisplayInfos(self):
	# this function return the file name of the module
	return [0, self.Tools.trad["dep_jre_1"].format(os.path.basename(__file__))]


def Check(self, mode):
	if mode == 'update':
		result = self.Tools.fileManipulator.RecursiveDelete(os.path.join(self.Tools.params['vasDirectory'], 'server', 'jre'))

	if mode != 'uninstall':
		if platform.system() == 'Windows':
			result = self.Tools.fileManipulator.RecursiveOverwriteCopy(os.path.join(self.Tools.params['ressourcesPath'], 'dependencies', 'jre', 'windows'), os.path.join(self.Tools.params['vasDirectory'], 'server', 'jre'))
			if result[0] != 0:
				return result
		else:
			result = self.Tools.RunCommand(["tar", "zxvf", os.path.join(self.Tools.params['ressourcesPath'], 'dependencies', 'jre', 'linux', 'jre.tar.gz'), "--directory", os.path.join(self.Tools.params['vasDirectory'], 'server')])
			if result[0] != 0:
				return result

	return [0, '']
