# coding: utf-8
import os
import platform
import tempfile
import zipfile
import time


def DisplayInfos(self):
	# this function return the file name of the module
	return [0, self.Tools.trad["dep_vcredist_1"].format(os.path.basename(__file__))]


def Check(self, mode):
	if mode != 'uninstall':
		if platform.system() == 'Windows':
			try:
				tempDir = str(time.time()).split(".")[0]
				zip_ref = zipfile.ZipFile(os.path.join(self.Tools.params['ressourcesPath'], 'dependencies', 'vcredist', 'windows', 'vcredist.zip'), 'r')
				zip_ref.extractall(os.path.join(tempfile.gettempdir(), tempDir))
				zip_ref.close()
			except Exception as err:
				return [1, str(err)]

			result = self.Tools.RunCommand([os.path.join(tempfile.gettempdir(), tempDir, "vcredist.exe"), "/q"])
			if result[0] != 0:
				return result

	return [0, '']
