# coding: utf-8
import platform
import os


def DisplayInfos(self):
	# this function return the file name of the module
	return [0, self.Tools.trad["dep_phantomjs_1"].format(os.path.basename(__file__))]


def Check(self, mode):
	if mode == 'update':
		result = self.Tools.fileManipulator.RecursiveDelete(os.path.join(self.Tools.params['vasDirectory'], 'server', 'phantomjs'))

	if mode != 'uninstall':
		if platform.system() == 'Windows':
			result = self.Tools.fileManipulator.RecursiveOverwriteCopy(os.path.join(self.Tools.params['ressourcesPath'], 'dependencies', 'phantomjs', 'windows'), os.path.join(self.Tools.params['vasDirectory'], 'server', 'phantomjs'))
			if result[0] != 0:
				return result
		else:
			if not os.path.isdir(os.path.join(self.Tools.params['vasDirectory'], 'server')):
				os.mkdir(os.path.join(self.Tools.params['vasDirectory'], 'server'))

			result = self.Tools.RunCommand(["tar", "jxvf", os.path.join(self.Tools.params['ressourcesPath'], 'dependencies', 'phantomjs', 'linux', 'phantomjs.tar.bz2'), "--directory", os.path.join(self.Tools.params['vasDirectory'], 'server')])
			if result[0] != 0:
				return result

	return [0, '']
