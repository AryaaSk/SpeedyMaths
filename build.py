#Run this to build the entire project into a single dist folder
#Make sure the latest version of the TS files are compiled to the _JS folder
#Also make sure that no files have the same name, since they all end up in a singular directory

import os
import fnmatch

class File:
    path: str
    name: str
    type: str
    def __init__(self, path, name, type):
        self.path = path
        self.name = name
        self.type = type

filePaths: list[File] = []

#Get files from Src folder and _JS folder
for path,dirs,files in os.walk('./Src'):
    for file in fnmatch.filter(files, '*.html'):
        filePaths.append(File(f"{path}/{file}", file, "html"))
    for file in fnmatch.filter(files, '*.css'):
        filePaths.append(File(f"{path}/{file}", file, "css"))
for path,dirs,files in os.walk('./_JS'):
    for file in fnmatch.filter(files, '*.js'):
        filePaths.append(File(f"{path}/{file}", file, "js"))



#Generate SearchFor and ReplaceWith strings (just the file paths to be replaced)


#Add / Modify files, into a dist folder
for file in filePaths:
    srcPath = file.path
    destPath = f"dist/{file.name}"

    f = open(srcPath, "r")
    lines = f.readlines()
    f.close()

    #we need to modify this data, especially the <script> tags in the HTML
    searchForPath = file.path[1:]
    replaceWithPath = file.name
    print(searchForPath, replaceWithPath)

    fileString = ""
    for line in lines:
        #fileString += line.replace(sear)

        fileString += line

    f = open(destPath, 'w')
    f.write(fileString)
    f.close()