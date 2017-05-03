# coding: utf-8
import os
import platform
import zipfile


def DisplayInfos(self):
	# this function return the file name of the module
	return [0, self.Tools.trad["dep_fop_1"].format(os.path.basename(__file__))]


def Check(self, mode):
	if mode == 'update':
		result = self.Tools.fileManipulator.RecursiveDelete(os.path.join(self.Tools.params['vasDirectory'], 'server', 'fop'))
		if result[0] != 0:
			return result

	if mode != 'uninstall':
		try:
			zip_ref = zipfile.ZipFile(os.path.join(self.Tools.params['ressourcesPath'], 'dependencies', 'fop', 'fop.zip'), 'r')
			zip_ref.extractall(os.path.join(self.Tools.params['vasDirectory'], 'server'))
			zip_ref.close()
		except Exception as err:
			return [1, str(err)]
		if platform.system() == 'Windows':
			result = self.Tools.fileManipulator.ReplaceInFile(os.path.join(self.Tools.params['vasDirectory'], 'server', 'fop', 'fop.bat'), 'set LOCAL_FOP_HOME=\n', 'set LOCAL_FOP_HOME=' + os.path.join(self.Tools.params['vasDirectory'], 'server', 'fop') + '\\' + '\nset JAVA_HOME=' + os.path.join(self.Tools.params['vasDirectory'], 'server', 'jre') + '\n')
			if result[0] != 0:
				return result
		else:
			result = self.Tools.fileManipulator.ReplaceInFile(os.path.join(self.Tools.params['vasDirectory'], 'server', 'fop', 'fop'), 'show_help=false', 'show_help=false\nJAVA_HOME=' + os.path.join(self.Tools.params['vasDirectory'], 'server', 'jre'))
			if result[0] != 0:
				return result
			result = self.Tools.RunCommand(["chmod", "754", os.path.join(self.Tools.params['vasDirectory'], 'server', 'fop', 'fop')])
			if result[0] != 0:
				return result

	return [0, '']
