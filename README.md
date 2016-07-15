[![License badge](https://img.shields.io/badge/license-Apache2-orange.svg)](http://www.apache.org/licenses/LICENSE-2.0)

[![][KurentoImage]][Kurento]

Copyright © 2016-2016 [Kurento]. Licensed under [Apache 2.0 License].

Generate Kurento Jenkins Report
===============================

Installation instructions
-------------------------

### Node.js

Be sure to have installed [Node.js] in your system:

```bash
curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get install -y nodejs
```

```bash
npm install
```

Jenkins authentication
----------------------

You need the jenkins' token 

https://ci.kurento.org/jenkins/user/YOUR_USER/configure
	Clave del API (Token)
 		Show API Token ... (Click there and the value will be the token)


Redmine authentication
----------------------

Use your user and password 

Steps
-----

```bash
cd kurento-generate-jenkins-report
npm install
npm start -- --authJenkins=user:tokenJenkins --authRedmine=user:password
```

