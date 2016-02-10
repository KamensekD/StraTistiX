Install StraTistiX from Chrome Store
==========
Go to http://goo.gl/8Ss6Sg

Install/Develop from sources
======
**Requirements**
* You need [**node package manager and nodejs**](http://nodejs.org/) to fetch nodejs dependencies and distribute the extension.

* To develop, you must initialize nodejs dependencies before loading extension from **chrome://extensions** as a developer. View **Install extension dependencies** below step

## Install extension dependencies
```
node make init
```
This will download required node modules. Development must be done inside **hook/extension/** folder.
You can now load extension from **chrome://extensions** chrome tab:

* Open new tab and type **chrome://extensions** then enter
* Tick **Developer Mode** checkbox
* Click **Load Unpacked Extension** button, then choose **hook/extension/** folder (this is where **manifest.json** file is)
* You can develop in !

## Create distribution folder 
```
node make dist
```
This will create **dist/** folder. This folder is used for a release.

## Create archive package 
```
node make build
```
This will create zip archive of **dist/** folder in **builds/StraTistiX\_vX.X.X\_[date].zip**
