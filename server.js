import express from 'express';
import path from 'path';

const app = express();

app.use('/dist', express.static(path.resolve('dist')));
app.use('/', express.static(path.resolve('public')));

export default app;
