# coding: utf-8
import os
import platform
import zipfile


def DisplayInfos(self):
	# this function return the file name of the module
	return [0, self.Tools.trad["dep_mapserver_1"].format(os.path.basename(__file__))]


def Check(self, mode):
	if mode == 'update':
		if platform.system() == 'Windows':
			result = self.Tools.fileManipulator.RecursiveDelete(os.path.join(self.Tools.params['vasDirectory'], 'server', 'mapserver'))
			if result[0] != 0:
				return result
		else:
			result = self.Tools.fileManipulator.RecursiveDelete("/var/www/vmap/vas/server/mapserver")
			if result[0] != 0:
				return result
		result = self.Tools.fileManipulator.RemoveAlias('dependencies', 'mapserver')
		if result[0] != 0:
			return result
		
	if mode != 'uninstall':
		if platform.system() == 'Windows':
			try:
				zip_ref = zipfile.ZipFile(os.path.join(self.Tools.params['ressourcesPath'], 'dependencies', 'mapserver', 'windows', 'mapserver.zip'), 'r')
				zip_ref.extractall(os.path.join(self.Tools.params['vasDirectory'], 'server'))
				zip_ref.close()
			except Exception as err:
				return [1, str(err)]
			htaccessDest = os.path.join(self.Tools.params['vasDirectory'], 'server', 'mapserver', '.htaccess')
			result = self.Tools.fileManipulator.RecursiveOverwriteCopy(os.path.join(self.Tools.params['ressourcesPath'], 'dependencies', 'mapserver', '.htaccess'), htaccessDest)
			if result[0] != 0:
				return result
			result = self.Tools.fileManipulator.ReplaceInFile(htaccessDest, "[ENV]", self.Tools.apache['environmentAlias'])
			if result[0] != 0:
				return result
			result = self.Tools.fileManipulator.ReplaceInFile(htaccessDest, "[VAS_DIRECTORY]", self.Tools.params['vasDirectory'].replace("\\", "/"))
			if result[0] != 0:
				return result
		else:
			#result = self.Tools.RunCommand(["apt-get", "-y", "update"], False)
			#if result[0] != 0:
			#	return result
			# Pas de vérification d'erreur pour la commande suivante
			#self.Tools.RunCommand(["apt-get", "-y", "install", "libfreetype6-dev", "libfribidi-dev", "libcairo2-dev", "libproj-dev", "libgeos-dev", "libfcgi-dev", "libcurl4-openssl-dev", "libxml2-dev", "libjpeg8-dev", "libpng12-dev", "libgif-dev", "libagg-dev", "libpq-dev", "libharfbuzz-dev"], False)
			if not os.path.isdir("/var/www/vmap/vas/server"):
				os.makedirs("/var/www/vmap/vas/server")			
			result = self.Tools.RunCommand(["tar", "zxvf", os.path.join(self.Tools.params['ressourcesPath'], "dependencies", "mapserver", "linux", "mapserver.tar.gz"), "--directory", "/var/www/vmap/vas/server"])
			if result[0] != 0:
				return result
			result = self.Tools.fileManipulator.ReplaceInFile(os.path.join(self.Tools.params['vasDirectory'], 'rest', 'conf', 'vm4ms', 'properties.inc'), "mapserv.exe", "mapserv")
			if result[0] != 0:
				return result
			htaccessDest = os.path.join('/var/www/vmap/vas/', 'server', 'mapserver', 'bin', '.htaccess')
			result = self.Tools.fileManipulator.RecursiveOverwriteCopy(os.path.join(self.Tools.params['ressourcesPath'], 'dependencies', 'mapserver', '.htaccess'), htaccessDest)
			if result[0] != 0:
				return result
			result = self.Tools.fileManipulator.ReplaceInFile(htaccessDest, "mapserv.exe", "mapserv")
			if result[0] != 0:
				return result
			result = self.Tools.fileManipulator.ReplaceInFile(htaccessDest, "[ENV]", self.Tools.apache['environmentAlias'])
			if result[0] != 0:
				return result
			result = self.Tools.fileManipulator.ReplaceInFile(htaccessDest, "[VAS_DIRECTORY]", self.Tools.params['vasDirectory'].replace("\\", "/"))
			if result[0] != 0:
				return result
		# Flux public
		fluxPublicDirDest = os.path.join(self.Tools.params['vasDirectory'], 'ws_data', 'vm4ms', 'map', 'wms_public')
		if not os.path.isdir(fluxPublicDirDest):
			os.makedirs(fluxPublicDirDest)
		result = self.Tools.fileManipulator.RecursiveOverwriteCopy(os.path.join(self.Tools.params['ressourcesPath'], 'dependencies', 'mapserver', 'FluxPublic.map'), os.path.join(fluxPublicDirDest, 'FluxPublic.map'))
		if result[0] != 0:
			return result
		result = self.Tools.fileManipulator.ReplaceInFile(htaccessDest, "[SERVER_URL]", self.Tools.apache['vasUrl'])
		if result[0] != 0:
			return result
		result = self.Tools.fileManipulator.ReplaceInFile(htaccessDest, "[ENV]", self.Tools.apache['environmentAlias'])
		if result[0] != 0:
			return result
		result = self.Tools.fileManipulator.ReplaceInFile(htaccessDest, "[VAS_DIRECTORY]", self.Tools.params['vasDirectory'].replace("\\", "/"))
		if result[0] != 0:
			return result
		result = self.Tools.fileManipulator.ReplaceInFile(htaccessDest, "[DB_NAME]", self.Tools.params['vasDirectory'].replace("\\", "/"))
		if result[0] != 0:
			return result
		result = self.Tools.fileManipulator.ReplaceInFile(htaccessDest, "[DB_HOST]", self.Tools.params['vasDirectory'].replace("\\", "/"))
		if result[0] != 0:
			return result
		result = self.Tools.fileManipulator.ReplaceInFile(htaccessDest, "[DB_PORT]", self.Tools.params['vasDirectory'].replace("\\", "/"))
		if result[0] != 0:
			return result
			
		result = self.Tools.fileManipulator.AddAlias('dependencies', 'mapserver')
		if result[0] != 0:
			return result
	else:
		result = self.Tools.fileManipulator.RemoveAlias('dependencies', 'mapserver')
		if result[0] != 0:
			return result	

	return [0, '']
