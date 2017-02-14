# coding: utf-8
#####
#####	Template for dependence checking module
#####
#####	dependence checking module must:
#####		- be named like this: dep_[dependence].py, where [dependence] is the name of the dependence, the same used in the installation configuration file
#####			WARNING: no underscore ("_") are allowed in the dependences name
#####		- be placed in the "dependencies" directory, this directory must be next to the installer exe
#####		- have functions corresponding to functions below (same name, same role, same return)
#####
#####	for practicity, copy this file, rename it and used it to create your dependence checking module
#####
#####


def DisplayInfos(self):
	# this function return the file name of the module
	return [0, "Dependence module : dep_template.py"]


def Check(self, mode):
	# function launch to check if dependence is installed
	# return True if installed,
	# return False if not able to find dependence
	if mode == 'install':
		# Mode install
		return [0, '']
	elif mode == 'update':
		# Mode UPDATE
		return [0, '']
	else:
		# Mode DELETE
		return [0, '']
