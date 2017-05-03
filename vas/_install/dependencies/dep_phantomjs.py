# coding: utf-8
import platform
import os
import zipfile


def DisplayInfos(self):
	# this function return the file name of the module
	return [0, self.Tools.trad["dep_phantomjs_1"].format(os.path.basename(__file__))]


def Check(self, mode):
	if mode == 'update':
		result = self.Tools.fileManipulator.RecursiveDelete(os.path.join(self.Tools.params['vasDirectory'], 'server', 'phantomjs'))

	if mode != 'uninstall':
		if platform.system() == 'Windows':
			try:
				zip_ref = zipfile.ZipFile(os.path.join(self.Tools.params['ressourcesPath'], 'dependencies', 'phantomjs', 'windows', 'phantomjs.zip'), 'r')
				zip_ref.extractall(os.path.join(self.Tools.params['vasDirectory'], 'server'))
				zip_ref.close()
			except Exception as err:
				return [1, str(err)]
		else:
			if not os.path.isdir(os.path.join(self.Tools.params['vasDirectory'], 'server')):
				os.mkdir(os.path.join(self.Tools.params['vasDirectory'], 'server'))

			result = self.Tools.RunCommand(["tar", "zxvf", os.path.join(self.Tools.params['ressourcesPath'], 'dependencies', 'phantomjs', 'linux', 'phantomjs.tar.gz'), "--directory", os.path.join(self.Tools.params['vasDirectory'], 'server')])
			if result[0] != 0:
				return result

	return [0, '']
