# coding: utf-8
import platform
import os
import zipfile


def DisplayInfos(self):
	# this function return the file name of the module
	return [0, self.Tools.trad["dep_php_1"].format(os.path.basename(__file__))]


def Check(self, mode):
	if mode == 'update':
		result = self.Tools.fileManipulator.RecursiveDelete(os.path.join(self.Tools.params['vasDirectory'], 'server', 'php'))
		if result[0] != 0:
			return result
		result = self.Tools.fileManipulator.RemoveAlias('dependencies', 'php')
		if result[0] != 0:
			return result

	if mode != 'uninstall':
		if platform.system() == 'Windows':
			try:
				zip_ref = zipfile.ZipFile(os.path.join(self.Tools.params['ressourcesPath'], 'dependencies', 'php', 'windows', 'php.zip'), 'r')
				zip_ref.extractall(os.path.join(self.Tools.params['vasDirectory'], 'server'))
				zip_ref.close()
			except Exception as err:
				return [1, str(err)]

			phpIniDest = os.path.join(self.Tools.params['vasDirectory'], 'server', 'php', 'php.ini')
			result = self.Tools.fileManipulator.RecursiveOverwriteCopy(os.path.join(self.Tools.params['ressourcesPath'], 'dependencies', 'php', 'php.ini'), phpIniDest)
			if result[0] != 0:
				return result
		else:
			if not os.path.isdir(os.path.join(self.Tools.params['vasDirectory'], 'server')):
				os.mkdir(os.path.join(self.Tools.params['vasDirectory'], 'server'))

			result = self.Tools.RunCommand(["apt-get", "-y", "update"], False)
			if result[0] != 0:
				return result
			result = self.Tools.RunCommand(["apt-get", "-y", "install", "libxml2-dev"])
			if result[0] != 0:
				return result
			# Pas de vérification d'erreur pour la commande suivante
			self.Tools.RunCommand(["apt-get", "-y", "install", "zlib1g-dev", "libcurl4-openssl-dev", "libpq-dev", "libxslt1-dev"], False)

			result = self.Tools.RunCommand(["tar", "zxvf", os.path.join(self.Tools.params['ressourcesPath'], "dependencies", "php", "linux", "php.tar.gz"), "--directory", os.path.join(self.Tools.params['vasDirectory'], "server")])
			if result[0] != 0:
				return result
			phpIniDest = os.path.join(self.Tools.params['vasDirectory'], 'server', 'php', 'bin', 'php.ini')
			result = self.Tools.fileManipulator.RecursiveOverwriteCopy(os.path.join(self.Tools.params['ressourcesPath'], 'dependencies', 'php', 'php.ini'), phpIniDest)
			if result[0] != 0:
				return result

			phpIniSrc = os.path.join(self.Tools.params['ressourcesPath'], 'dependencies', 'php', 'php.ini')

			with open(phpIniSrc, 'r') as f_in:
				with open(phpIniDest, 'w') as f_out:
					for line in f_in:
						if not line.rstrip().lower().startswith('extension'):
							# if line.rstrip().lower().startswith('include_path'):
							# line = line.replace(';', ':')
							f_out.write(line)

		if not os.path.isdir(os.path.join(self.Tools.params['vasDirectory'], 'server', 'php', 'log')):
			os.mkdir(os.path.join(self.Tools.params['vasDirectory'], 'server', 'php', 'log'))
		if not os.path.isdir(os.path.join(self.Tools.params['vasDirectory'], 'server', 'php', 'php_session')):
			os.mkdir(os.path.join(self.Tools.params['vasDirectory'], 'server', 'php', 'php_session'))

		result = self.Tools.fileManipulator.ReplaceInFile(phpIniDest, "[VAS_DIRECTORY]", self.Tools.params['vasDirectory'].replace("\\", "/"))
		if result[0] != 0:
			return result
		result = self.Tools.fileManipulator.AddAlias('dependencies', 'php')
		if result[0] != 0:
			return result
	else:
		result = self.Tools.fileManipulator.RemoveAlias('dependencies', 'php')
		if result[0] != 0:
			return result
	return [0, '']
