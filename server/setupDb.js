import pkg from 'pg';
const { Pool } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setup() {
  console.log('Iniciando configuracion de base de datos...');
  
  // Conectar a la base de datos por defecto 'postgres'
  const poolDefault = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'postgres',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  try {
    // Intentar crear la base de datos 'fixit'
    await poolDefault.query(`CREATE DATABASE ${process.env.DB_NAME}`);
    console.log(`Base de datos '${process.env.DB_NAME}' creada exitosamente.`);
  } catch (err) {
    if (err.code === '42P04') {
      console.log(`La base de datos '${process.env.DB_NAME}' ya existe. Continuando...`);
    } else {
      console.error('Error creando base de datos:', err.message);
      await poolDefault.end();
      return;
    }
  }
  await poolDefault.end();

  // Conectar a la nueva base de datos 'fixit'
  const poolFixit = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  try {
    // Leer el archivo init.sql y ejecutarlo
    const sqlPath = path.join(__dirname, 'init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('Ejecutando script init.sql...');
    await poolFixit.query(sql);
    console.log('Tablas creadas exitosamente.');
  } catch (err) {
    console.error('Error ejecutando init.sql:', err.message);
  } finally {
    await poolFixit.end();
    console.log('Configuracion completada.');
  }
}

setup();
