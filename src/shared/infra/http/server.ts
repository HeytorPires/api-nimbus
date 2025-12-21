import 'reflect-metadata';
import 'dotenv/config';
import app from './app';

const port = process.env.APP_PORT || process.env.PORT || 3000;

app.listen(port, () => {
  console.log(' ');
  console.log('************************');
  console.log(`Servidor rodando na porta ${port}`);
});

