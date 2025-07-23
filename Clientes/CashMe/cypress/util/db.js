const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'cypress_user',
  password: 'senha123',
  database: 'automacao_testes',
});

async function gravarResultadoTeste(nomeTeste, status, mensagem, dataInicio, dataFim) {
  const client = await pool.connect();
  try {
    const res = await client.query(
      `INSERT INTO resultados_testes 
       (nome_teste, status, mensagem, data_inicio, data_fim) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [nomeTeste, status, mensagem, dataInicio, dataFim]
    );
    return res.rows[0];
  } catch (err) {
    console.error('Erro ao gravar no banco:', err);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { gravarResultadoTeste };