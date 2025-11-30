# Installation

**Note:** [*] - items marked with this are optional, but required if you intend to build the project for testing or production on external servers.

## Requirements

### Developer Machine:

**Operating System:** macOS or Linux (current scripts and tools do not support Windows)

**Node.js**: Version 22 or higher

**Database:** MySQL/MariaDB, or Docker for containerized setup

### Single-Machine Server Setup:

**Operating System:** Linux

**Node.js:** Version 22 or higher

**Process Manager:** PM2

**Web Server / Reverse Proxy:** Nginx

**Database:** MySQL/MariaDB

## Installation

### Core Installation

Clone the repository and run npm install in the following locations:
* The project root directory
* ./apps/audiobook-player-rn-app
* ./apps/audiobook-player-server
* ./tools/build-export
* ./tools/build-import

### Database

1. Install a MySQL/MariaDB server, or use a Docker container to run it (`tools/mysql/Compose.yml`).
2. Create databased called “audiobooks”.
3. Create a user for this database and grant it full permissions.
4. Create the MySQL configuration file `secrets/mysql-config--local.ini`. Its contents should resemble the example below:

```
[client]
user = "user"
password = "password"
host = "127.0.0.1"
port = "3306"
```

5. Create the database tables by executing the SQL script located at
./tools/mysql/sql--create-tables.sql. You can use the run-sql.sh script by providing the SQL file 
path as an argument, for example: `./tools/mysql/run-sql.sh ./tools/mysql/sql--create-tables.sql`.

### Server

1. Create `./apps/audiobook-player-server/.env` (copy it from `./apps/audiobook-player-server/.env.example`).
For a local setup, you will typically only need to update the MySQL credentials.
2. [*] For production and testing environments, create corresponding environment files in the `./secrets` folder, named `server-env--production.ini` and `server-env--testing.ini`.

### Client

Create `./apps/audiobook-player-rn-app/.env` (copy it from `./apps/audiobook-player-rn-app/.env.example`). For a local-only setup, you can leave all values unchanged.

### FFmpeg

This is required only when using the import functionality. Download ffmpeg and ffprobe, then place both executables in the tools/ffmpeg folder.

## First Run:

#### Start the server:
Open a terminal and run:

`npm run dev --prefix apps/audiobook-player-server`

#### Start the client:
Open a new terminal and run:

`npm run start --prefix apps/audiobook-player-rn-app`

Then press `w` to open the app in the browser.

## Demo Data

You can download the demo data (media files and database dump) here:

https://audiobooks.amaxsoftware.com/demo-data/demo-data.zip

You can download the demo import data (spreadsheet, audiobook files - the contents of the `import/` folder) here:

https://audiobooks.amaxsoftware.com/demo-data/demo-data-import.zip

## Production/Testing Server

The project is currently in an early development stage and is not yet ready for production use.
If you would like to run it on your own server, you can use tools/build-export to generate builds/archives that can be imported on the server using tools/build-import.

Nginx can be used to serve the client application and proxy the API server.
A Nginx configuration might look something like this:

```
server {
    listen *:443 ssl;
    server_name yourdomain.com; 

    root /var/www/yourdomain.com/client;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ^~ /files/ {
	    rewrite /files/(.*) /$1 break;
	    root /var/www/yourdomain.com/files/;
    }

    location ^~ /api/ {
        proxy_pass http://localhost:4000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    include /etc/nginx/ssl_params_yourdomain.com; #SSL params
}

server {
    listen *:80;
    server_name yourdomain.com;
    return 301 https://$host$request_uri; # Redirect to https
}
```
