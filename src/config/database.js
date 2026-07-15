const sql = require('mssql');

const config = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'SuaSenhaForte123!',
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'blog_educacional',
  port: parseInt(process.env.DB_PORT || '1433'),
  authentication: {
    type: 'default'
  },
  options: {
    encrypt: true,
    trustServerCertificate: true,
    connectionTimeout: 30000,
    requestTimeout: 30000
  }
};

let pool = null;

const getPool = async () => {
  if (pool) {
    return pool;
  }

  try {
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
