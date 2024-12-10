import os
import sys

class Colors:
	RED		= "\033[31m"
	GREEN	= "\033[32m"
	YELLOW	= "\033[33m"
	BLUE	= "\033[34m"
	MAGENTA	= "\033[35m"
	CYAN	= "\033[36m"
	WHITE	= "\033[37m"
	RESET	= "\033[0m"

class Log:
	NAME	= "pbuilder.py: "

	@staticmethod
	def default(value: str):
		print(Log.NAME + value + Colors.RESET)

	@staticmethod
	def error(value: str):
		print(Colors.RED + Log.NAME + value + Colors.RESET)

	@staticmethod
	def success(value: str):
		print(Colors.GREEN + Log.NAME + value + Colors.RESET)

def	get_include_data(value: str):
	result = ""

	try:
		with open(value, "r") as file:
			for line in file:
				result += "\t\t" + line
			result += "\n"
	except:
		Log.error("file error: " + value)
	return (result)

def	main(argv: list[str]):
	result_name = "result.html"
	result = ""
	path = ""

	if (len(argv) != 2 and len(argv) != 3):
		Log.error("wrong number of arguments")
	if (len(argv) == 3):
		result_name = argv[2]
	path = os.path.dirname(argv[1]) + "/"
	with open(argv[1], "r") as file:
		for line in file:
			if (line.startswith("\t\t$include")):
				include = line.split(" ")[1][:-1]
				Log.default("including: " + path + include)
				result += get_include_data(path + include)
			else:
				result += line
	with open(result_name, "w") as file:
		file.write(result)
	Log.success("successfully generated: " + result_name)

if __name__ == "__main__":
	main(sys.argv)