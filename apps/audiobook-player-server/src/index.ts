import dotenv from 'dotenv';
dotenv.config();
import express, {Express, json} from 'express';
import cors from 'cors';
import * as https from "https"
import {apiRouter} from "./web-service/api/ApiRoute";
import fs from "fs";

const WEB_SERVICE_ROOT = process.env.WEB_SERVICE_ROOT || "";
const WEB_SERVICE_PORT = process.env.WEB_SERVICE_PORT || 4000;

const app: Express = express();
app.use(json());
app.use(cors());
app.use(WEB_SERVICE_ROOT, apiRouter)

// Media files
const filesPath = process.env.FILE_STORAGE_LOCAL_PATH ?? null
if (filesPath !== null) {
    if (!fs.existsSync(filesPath)) {
        console.error("Files directory does not exist", filesPath);
        process.exit(1);
    }
    app.use('/files', express.static(filesPath))
}

// HTTPS
if (process.env.SSL_ENABLED) {
    const options = {
        key: fs.readFileSync(process.env.SSL_KEY_PATH!).toString(),
        cert: fs.readFileSync(process.env.SSL_CERT_PATH!).toString(),
    }
    const server = https.createServer(options, app);
    server.listen(WEB_SERVICE_PORT, () => {
        console.log(`Web service started on port ${process.env.WEB_SERVICE_PORT} in HTTPS mode`);
    })
}

// HTTP
else {
    app.listen(WEB_SERVICE_PORT, () => {
        console.log(`Web service started on port ${process.env.WEB_SERVICE_PORT} in HTTP mode`);
    });
}


