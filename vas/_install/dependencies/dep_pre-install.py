# coding: utf-8
import os
import platform
import subprocess

if platform.system() == 'Windows':
	import win32serviceutil
	import win32service
	import csv

def DisplayInfos(self):
	# this function return the file name of the module
	return [0, self.Tools.trad["dep_pre-install_1"].format(os.path.basename(__file__))]


def Check(self, mode):

	self.Tools.logger.info("PRE-INSTALL WEBSOCKET")
	serviceNameVitis = 'websocket_vitis' + self.Tools.apache['environmentAlias']
	serviceName = 'websocket' + self.Tools.apache['environmentAlias']

	if mode != 'install':
		if platform.system() == 'Windows':
			try:
				out = subprocess.check_output("wmic service where Name='%s' get /format:csv" % serviceNameVitis, universal_newlines=True).strip();
				status = next(csv.DictReader(out.splitlines()));
				processId = status['ProcessId']

				self.Tools.logger.info("processId " + processId)

				result = self.Tools.RunCommand('taskkill /F /pid ' + processId)
				if result[0] != 0:
					return result

				result = self.Tools.RunCommand('sc delete ' + serviceNameVitis)
				self.Tools.logger.info('sc delete ok ' + serviceNameVitis)
				if result[0] != 0:
					return result

			except:
				self.Tools.logger.debug("Le service " + serviceNameVitis + " n'existe pas")
			try:
				out = subprocess.check_output("wmic service where Name='%s' get /format:csv" % serviceName, universal_newlines=True).strip();
				status = next(csv.DictReader(out.splitlines()));
				processId = status['ProcessId']

				self.Tools.logger.info("processId " + processId)

				result = self.Tools.RunCommand('taskkill /F /pid ' + processId)
				if result[0] != 0:
					return result

				result = self.Tools.RunCommand('sc delete ' + serviceName)
				self.Tools.logger.info('sc delete ok ' + serviceName)
				if result[0] != 0:
					return result

			except:
				self.Tools.logger.debug("Le service " + serviceName + " n'existe pas")
		else:
			if os.path.isfile('/etc/init.d/' + serviceNameVitis):
				result = self.Tools.RunCommand(['/etc/init.d/' + serviceNameVitis, 'stop'], False)
				if result[0] != 0:
					return result
				result = self.Tools.RunCommand(['update-rc.d', '-f', serviceNameVitis, 'remove'], False)
				if result[0] != 0:
					return result
				result = self.Tools.fileManipulator.RecursiveDelete('/etc/init.d/' + serviceNameVitis)
				if result[0] != 0:
					return result
			if os.path.isfile('/etc/init.d/' + serviceName):
				result = self.Tools.RunCommand(['/etc/init.d/' + serviceName, 'stop'], False)
				if result[0] != 0:
					return result
				result = self.Tools.RunCommand(['update-rc.d', '-f', serviceName, 'remove'], False)
				if result[0] != 0:
					return result
				result = self.Tools.fileManipulator.RecursiveDelete('/etc/init.d/' + serviceName)
				if result[0] != 0:
					return result

	return [0, '']
