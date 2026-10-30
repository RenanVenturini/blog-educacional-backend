const express = require('express');

const router = express.Router();

const { getPool } = require('../config/database');

// Lista as matérias para os formulários de postagem (seletor de matéria)
router.get('/', async (req, res, next) => {
  try {
    const pool = await getPool();

    const result = await pool
      .request()
      .query('SELECT idMateria, nome FROM Materias ORDER BY nome');

    return res.status(200).json(result.recordset);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
