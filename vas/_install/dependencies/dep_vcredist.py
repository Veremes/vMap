# coding: utf-8
import os
import platform


def DisplayInfos(self):
	# this function return the file name of the module
	return [0, self.Tools.trad["dep_vcredist_1"].format(os.path.basename(__file__))]


def Check(self, mode):
	if mode != 'uninstall':
		if platform.system() == 'Windows':
			result = self.Tools.RunCommand([os.path.join(self.Tools.params['ressourcesPath'], "dependencies", "vcredist", "windows", "vcredist.exe"), "/q"])
			if result[0] != 0:
				return result

	return [0, '']
