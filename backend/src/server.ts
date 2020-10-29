import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import path from 'path';

import './database/connection';

import routes from './routes';
import errorHandler from './errors/handler';

const app = express();

// Configurando cors no express
app.use(cors());

// Configurando express para receber dados em formato JSON
app.use(express.json());

// Configurando para utilizar as rotas definidas em outro arquivo
app.use(routes);

// Configurando express para servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Utiliando nosso manipulador de exceções
app.use(errorHandler);

app.listen(3333);