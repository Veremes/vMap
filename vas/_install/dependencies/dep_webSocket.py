# coding: utf-8
import os
import platform
import subprocess
import csv

if platform.system() == 'Windows':
	import win32serviceutil
	import win32service

def DisplayInfos(self):
	# this function return the file name of the module
	return [0, self.Tools.trad["dep_webSocket_1"].format(os.path.basename(__file__))]


def Check(self, mode):
	serviceName = 'websocket_vitis' + self.Tools.apache['environmentAlias']
	if mode != 'install':
		if platform.system() == 'Windows':
			try:
				out = subprocess.check_output("wmic service where Name='%s' get /format:csv" % serviceName, universal_newlines=True).strip();
				status = next(csv.DictReader(out.splitlines()));
				processId = status['ProcessId']
				if processId > 0:
					result = self.Tools.RunCommand('taskkill /F /pid ' + processId)
					if result[0] != 0:
						return result
				result = self.Tools.RunCommand('sc delete ' + serviceName)
				if result[0] != 0:
					return result
			except:
				self.Tools.logger.debug("Le service " + serviceName + " n'existe pas")
		else:
			if os.path.isfile('/etc/init.d/' + serviceName):
				result = self.Tools.RunCommand(['/etc/init.d/' + serviceName, 'stop'])
				if result[0] != 0:
					return result
				result = self.Tools.fileManipulator.RecursiveDelete('/etc/init.d/' + serviceName)
				if result[0] != 0:
					return result
		# Suppression des alias du websocket
		result = self.Tools.fileManipulator.RemoveAlias('dependencies', 'websocket')
		if result[0] != 0:
			return result

	if mode != 'uninstall':
		result = self.Tools.fileManipulator.ReplaceInFile(os.path.join(self.Tools.params['vasDirectory'], 'util', 'webSocket', 'server', 'server.php'), 'websocket_vitis', serviceName)
		if result[0] != 0:
			return result
		if platform.system() == 'Windows':
			result = self.Tools.RunCommand([os.path.join(self.Tools.params['vasDirectory'], 'server', 'php', 'php.exe'), os.path.join(self.Tools.params['vasDirectory'], 'util', 'webSocket', 'server', 'server.php'), "install"])
			if result[0] != 0:
				return result
		else:
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
		result = self.Tools.fileManipulator.AddService(serviceName)
		if result[0] != 0:
			return result

		# Ajout des alias du websocket
		result = self.Tools.fileManipulator.AddAlias('dependencies', 'websocket')
		if result[0] != 0:
			return result
	return [0, '']
