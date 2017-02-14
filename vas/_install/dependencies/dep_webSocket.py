# coding: utf-8
import os

def DisplayInfos(self):
	# this function return the file name of the module
	return [0, self.Tools.trad["dep_webSocket_1"].format(os.path.basename(__file__))]


def Check(self, mode):
	return [0, '']
