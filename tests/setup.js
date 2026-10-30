// Roda antes de cada arquivo de teste.
// Os testes não usam o .env nem o banco: o segredo do token é fixo aqui.
process.env.JWT_SECRET = 'segredo-usado-so-nos-testes';
