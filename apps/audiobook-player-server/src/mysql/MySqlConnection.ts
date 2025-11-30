import dotenv from 'dotenv';
dotenv.config();

import {createPool, PoolConnection} from "mysql2/promise";

export const mysqlPool = createPool({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

export const getMySqlConnection = async (): Promise<PoolConnection> => {
    return mysqlPool.getConnection();
}
