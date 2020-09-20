# Step by step installation instructions

## Requirements

1. Prerequisites

	1. [MongoDB](https://www.mongodb.com/).
	2. [Redis](https://redis.io/).
	3. [MinIO](https://min.io/).
	4. ClamAV (Optional)
	5. [Node.js](https://nodejs.org/) v12 or later.
	6. `carbon-now-cli` npm package
	7. [Web Authentication Provider](https://github.com/femto-apps/web-authentication-provider)
	8. [Web Authentication Token Service](https://github.com/femto-apps/web-authentication-token-service)

### Explanatory Notes.

1. Pulibc URL of Web-File-Uploader in this document is `www.example.com`
2. Public URL of Web Authentication Provider in this document is `auth.example.com`
3. Public URL of Web Authentication Token Service in this document is `token.example.com`

## Prepare MongoDB

1. If you want to run MongoDB locally, you can use [the official binary repository](https://docs.mongodb.com/manual/installation/) or docker.

	```
	docker volume create --name=mongodata
	docker run -p 27017:27017 --name mongo -v mongodata:/data/db -d mongo
	```
2. Or you can also use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas?tck=docs_server)


## Prepare Redis

You can use your distribution package or docker.

```
docker volume create --name=redisdata
docker run -p 6379:6379 --name redis -v redisdata:/data -d redis redis-server --appendonly yes
```


## Prepare MinIO

You can use [the official binary](https://min.io/download) or docker.

```
docker volume create --name=miniodata
docker run -p 9000:9000 -e MINIO_ACCESS_KEY=CHANGE_ME_ACCESS_KEY -e MINIO_SECRET_KEY=CHANGE_ME_SECRET_KEY --name minio -v miniodata:/data -d minio/minio server /data
```

## Prepare Node.js and npm

Refer to [the official page](https://nodejs.org/en/download/package-manager/).

## Prepare ClamAV (Optional)

If you want to scan any uploaded files, you can use ClamAV of your distribution package or docker.

```
# the port is set to 9001 because 9000 is used by minio by default
docker run -p 9001:9000 --name clamav -d niilo/clamav-rest
# this takes a while to start up, monitor progress with `docker logs clamav`
```

## Install Authentication Provider

1. Clone the repository of Authentication Provider.
	```
	git clone https://github.com/femto-apps/web-authentication-provider.git provider
	```
2. `cd provider`
3. Copy `config.default.js` to `config.js`
4. Edit `config.js`. Change the Mongo URI to point to your MongoDB server, and replace all secrets with random strings.

	- Example
	```js
	module.exports = {
	  port: 3001,
	  mongo: {
	    uri: 'mongodb://user:password@localhost:27017/',
	    db: 'authenticationProvider'
	  },
	  redis: {
	    session: 'sessions'
	  },
	  cookie: {
	    maxAge: 1000 * 60 * 60 * 24 * 7 * 4, // 28 days
	    secret: 'REPLACE THIS WITH A RANDOM STRING',
	    name: 'provider'
	  },
	  session: {
	    secret: 'REPLACE THIS WITH A RANDOM STRING'
	  },
	  title: {
	    suffix: 'Femto Authentication Provider' // You can replace this with your favorite title
	  },
	  favicon: 'public/images/favicon/favicon.ico',
	}
	```

5. Run `npm install`

6. Run `node index.js`

	When your system uses systemd, refer the following sample.

	```systemd
	[Unit]
	Description=Web Authentication Provider
	After=network.target
	Before=apache2.service

	[Service]
	User=user
	WorkingDirectory=/path/to/provider
	Environment=NODE_ENV=production
	ExecStart=/usr/bin/node index.js
	Restart=always

	[Install]
	WantedBy=multi-user.target
	```

7. Configure your web server.

	- Example for Apache
	```apache
	<IfModule mod_ssl.c>
	<VirtualHost *:443>

		ServerName auth.example.com
		ServerAdmin webmaster@example.com

		SSLCertificateFile /etc/letsencrypt/live/example.com/fullchain.pem
		SSLCertificateKeyFile /etc/letsencrypt/live/example.com/privkey.pem
		Include /etc/letsencrypt/options-ssl-apache.conf

		RequestHeader set X-Forwarded-Proto "https"
		ProxyPreserveHost On

		ProxyPass / http://127.0.0.1:3001/
		ProxyPassReverse / http://127.0.0.1:3001/

		ErrorLog ${APACHE_LOG_DIR}/error.log
		CustomLog ${APACHE_LOG_DIR}/access.log combined

	</VirtualHost>
	</IfModule>
	```
	
	- Example for Caddy
	```caddy
		auth.example.com {
			proxy / localhost:3001
		}
	```
8. Access `https://auth.example.com/consumer/add` via your browser.
9. Enter `Name`, `Description` and `Redirects` but `Redirects` is as below:
	```
	https://www.example.com/login_callback
	```
10. When submitting above, you'll get authentication informations as JSON format. You **MUST** pick up `uuid` as `ConsumerId`

## Install Web Authentication Token Service
1. clone the repository of Web Authntication Token Service
	```
	git clone https://github.com/femto-apps/web-authentication-token-service.git token
	```
2. `cd token`
3. Copy `config.default.js` to `config.js`
4. Edit `config.js` if needed
5. Run `npm install`
6. Run `node index.js`
	When your system uses systemd, refer the following sample.

	```systemd
	[Unit]
	Description=Authentication Token Service
	After=network.target
	Before=apache2.service

	[Service]
	User=user
	WorkingDirectory=/path/to/token
	Environment=NODE_ENV=production
	ExecStart=/usr/bin/node index.js
	Restart=always

	[Install]
	WantedBy=multi-user.target
	```
7. Configure your web server
	- Example for Apache
	```apache
	<IfModule mod_ssl.c>
	<VirtualHost *:443>

		ServerName token.example.com
		ServerAdmin webmaster@example.com

		SSLCertificateFile /etc/letsencrypt/live/example.com/fullchain.pem
		SSLCertificateKeyFile /etc/letsencrypt/live/example.com/privkey.pem
		Include /etc/letsencrypt/options-ssl-apache.conf

		RequestHeader set X-Forwarded-Proto "https"
		ProxyPreserveHost On

		ProxyPass / http://127.0.0.1:4500/
		ProxyPassReverse / http://127.0.0.1:4500/

		ErrorLog ${APACHE_LOG_DIR}/error.log
		CustomLog ${APACHE_LOG_DIR}/access.log combined

	</VirtualHost>
	</IfModule>
	```
	- Example for Caddy
	```caddy
		token.example.com {
			proxy / localhost:4500
		}
	```

## Install Web-File-Uploader
1. Install `carbon-now-cli`.

	e.g. `yarn global add carbon-now-cli` or `npm install -g carbon-now-cli`
2. Clone the repository
	```
	git clone https://github.com/femto-apps/web-file-uploader.git uploader
	```
3. `cd uploader`
4. Copy `config.default.hjson` to `config.hjson`
5. Edit `config.hjson`. Specially you must change `minio.accessKey`, `minio.secretKey`, `session.secret` and `authenticationProvider.consumerId` and each `endpoint`.

	For example:
	```hjson
	{
	    port: 3005
	    dev: false
	    title: {
	        name: Femto Uploader // You can replae this with your favorite name
	        shortener: Femto Shortener // You can replae this with your favorite name
	        suffix: Femto Uploader // You can replae this with your favorite name
	    }
	    url: {
	        origin: https://www.example.com/
	    }
	    carbon: {
	    	// you can find this installation directory with `which carbon-now`
	        path: /path/to/.yarn/bin/carbon-now
	    }
	    mongo: {
	        uri: mongodb://user:password@localhost:27017/
	        db: fileUploader
	    }
	    minio: {
	        host: 127.0.0.1
	        port: 9000
		itemBucket: BUCKET NAME YOU CREATED ON MINIO
	        accessKey: ACCESSKEY
	        secretKey: SECRETKEY
	    }
	    clamav: {
	        url: http://localhost:9001
	    }
	    session: {
	        secret: REPLACE THIS WITH A RAMDOM STRING
	    }
	    redis: {
	        host: localhost
	        port: 6379
	    }
	    cookie: {
	        name: file-uploader
	        maxAge: 15552000000 // 1000 * 60 * 60 * 24 * 180 (6 months)
	    }
	    tokenService: {
	        endpoint: https://token.example.com
	    }
	    authenticationProvider: {
	        endpoint: https://auth.example.com
	        consumerId: REPLACE THIS WITH YOUR CONSUMER ID // You got this in the installation step 10 for Web Authentication Provider
	    }
	    authenticationConsumer: {
	        endpoint: https://www.example.com
	    }
	    experimental: {
	        profiling: false
	        statsTimer: 86400000 // 1000 * 60 * 60 * 24 (1 day)
	    }
	}
	```
6. Run `npm install`
7. Run `node index.js`
	When your system uses systemd, refer the following sample.
	
	```systemd
	[Unit]
	Description=Web-File-Uploader
	After=network.target
	Before=apache2.service

	[Service]
	User=user
	WorkingDirectory=/path/to/uploader
	Environment=NODE_ENV=production
	ExecStart=/usr/bin/node index.js
	Restart=always

	[Install]
	WantedBy=multi-user.target
	```
8. Configure your web server
	- Example for Apache

	```apache
	<IfModule mod_ssl.c>
	<VirtualHost *:443>

		ServerName www.example.com
		ServerAdmin webmaster@example.com

		SSLCertificateFile /etc/letsencrypt/live/example.com/fullchain.pem
		SSLCertificateKeyFile /etc/letsencrypt/live/example.com/privkey.pem
		Include /etc/letsencrypt/options-ssl-apache.conf

		RequestHeader set X-Forwarded-Proto "https"
		ProxyPreserveHost On

		ProxyPass / http://127.0.0.1:3005/
		ProxyPassReverse / http://127.0.0.1:3005/

		ErrorLog ${APACHE_LOG_DIR}/error.log
		CustomLog ${APACHE_LOG_DIR}/access.log combined

	</VirtualHost>
	</IfModule>
	```
	- Example for Caddy
	```caddy
	www.example.com {
		proxy / localhost:3005
	}
	```
9. Access `https://www.example.com` and you can register as many users as you wish! :)
