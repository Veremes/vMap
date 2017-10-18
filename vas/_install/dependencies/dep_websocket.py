# coding: utf-8
import os
import platform
import subprocess
import zipfile

if platform.system() == 'Windows':
	import win32serviceutil
	import win32service
	import csv

def DisplayInfos(self):
	# this function return the file name of the module
	return [0, self.Tools.trad["dep_webSocket_1"].format(os.path.basename(__file__))]


def Check(self, mode):
	serviceName = 'websocket_vitis' + self.Tools.apache['environmentAlias']
	if mode != 'install':
		# Suppression des alias du websocket
		result = self.Tools.fileManipulator.RemoveAlias('dependencies', 'websocket')
		if result[0] != 0:
			return result

	if mode != 'uninstall':
		if platform.system() == 'Windows':
			try:
				zip_ref = zipfile.ZipFile(os.path.join(self.Tools.params['ressourcesPath'], 'dependencies', 'websocket', 'windows', 'websocket.zip'), 'r')
				zip_ref.extractall(os.path.join(self.Tools.params['vasDirectory'], 'server'))
				zip_ref.close()
			except Exception as err:
				return [1, str(err)]
			websocketCfgDest = os.path.join(self.Tools.params['vasDirectory'], 'server', 'websocket', 'websocket.cfg')
			result = self.Tools.fileManipulator.RecursiveOverwriteCopy(os.path.join(self.Tools.params['ressourcesPath'], 'dependencies', 'websocket', 'websocket.cfg'), websocketCfgDest)
			if result[0] != 0:
				return result
			result = self.Tools.fileManipulator.ReplaceInFile(websocketCfgDest, '[VAS_HOME]', self.Tools.params['vasDirectory'])
			if result[0] != 0:
				return result
			result = self.Tools.fileManipulator.ReplaceInFile(websocketCfgDest, '[PHP_PATH]', os.path.join(self.Tools.params['vasDirectory'], 'server', 'php', 'php.exe'))
			if result[0] != 0:
				return result

			result = self.Tools.RunCommand([os.path.join(self.Tools.params['vasDirectory'], 'server', 'websocket', 'WebsocketService.exe'), "--startup=auto", "install"])
			if result[0] != 0:
				return result
		else:
			result = self.Tools.RunCommand(["tar", "zxvf", os.path.join(self.Tools.params['ressourcesPath'], "dependencies", "websocket", "linux", "websocket.tar.gz"), "--directory", os.path.join(self.Tools.params['vasDirectory'], "server")])
			if result[0] != 0:
				return result
			websocketCfgDest = os.path.join(self.Tools.params['vasDirectory'], 'server', 'websocket', 'websocket.cfg')
			result = self.Tools.fileManipulator.RecursiveOverwriteCopy(os.path.join(self.Tools.params['ressourcesPath'], 'dependencies', 'websocket', 'websocket.cfg'), websocketCfgDest)
			if result[0] != 0:
				return result
			result = self.Tools.fileManipulator.ReplaceInFile(websocketCfgDest, '[VAS_HOME]', self.Tools.params['vasDirectory'])
			if result[0] != 0:
				return result
			result = self.Tools.fileManipulator.ReplaceInFile(websocketCfgDest, '[PHP_PATH]', os.path.join(self.Tools.params['vasDirectory'], 'server', 'php', 'bin', 'php'))
			if result[0] != 0:
				return result

			result = self.Tools.fileManipulator.RecursiveOverwriteCopy(os.path.join(self.Tools.params['ressourcesPath'], 'dependencies', 'websocket', 'linux', 'websocket_vitis'), '/etc/init.d/' + serviceName)
			if result[0] != 0:
				return result
			result = self.Tools.fileManipulator.ReplaceInFile('/etc/init.d/' + serviceName, 'websocket_vitis', serviceName)
			if result[0] != 0:
				return result
			result = self.Tools.fileManipulator.ReplaceInFile('/etc/init.d/' + serviceName, '[VAS_HOME]', self.Tools.params['vasDirectory'])
			if result[0] != 0:
				return result
			result = self.Tools.RunCommand(['chmod', '+x', '/etc/init.d/' + serviceName])
			if result[0] != 0:
				return result
			result = self.Tools.RunCommand(['update-rc.d', serviceName, 'defaults'], False)
			if result[0] != 0:
				return result
		result = self.Tools.fileManipulator.AddService(serviceName)
		if result[0] != 0:
			return result

		# Ajout des alias du websocket
		result = self.Tools.fileManipulator.AddAlias('dependencies', 'websocket')
		if result[0] != 0:
			return result
	return [0, '']
