const sql = require('mssql');

const config = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'blog-educacional-db-FIAP',
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'BlogEducacional',
  port: parseInt(process.env.DB_PORT || '1433'),
  authentication: {
    type: 'default'
  },
  options: {
    encrypt: false,
    trustServerCertificate: true,
    connectionTimeout: 30000,
    requestTimeout: 30000
  }
};

let pool = null;

const ensureDatabase = async () => {
  const masterPool = new sql.ConnectionPool({ ...config, database: 'master' });

  try {
    await masterPool.connect();
    await masterPool.request().query(`
      IF NOT EXISTS (SELECT 1 FROM sys.databases WHERE name = '${config.database}')
      BEGIN
          CREATE DATABASE [${config.database}];
      END
    `);
    console.log(`Database '${config.database}' disponivel`);
  } finally {
    await masterPool.close();
  }
};

const getPool = async () => {
  if (pool) {
    return pool;
  }

  try {
    await ensureDatabase();
    pool = new sql.ConnectionPool(config);
    await pool.connect();
    console.log('✅ Conectado ao banco de dados SQL Server');
    return pool;
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error.message);
    throw error;
  }
};

const closePool = async () => {
  if (pool) {
    await pool.close();
    pool = null;
    console.log('Desconectado do banco de dados');
  }
};

module.exports = { getPool, closePool, sql };
