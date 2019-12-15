/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { renderToString } from 'react-dom/server';
import cors from 'cors';
import express from 'express';
import { App } from '../shared/App';

const app = express();

app.use(cors());

app.use(express.static('dist'));
// app.use('/static', express.static('static'));
//   <link rel="stylesheet" href="/theme.bundle.css">
// <link rel="stylesheet" href="/main.bundle.css">

app.get('*', (req, res) => {
  var markup = renderToString(<App />);

  res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>SSR with RR</title>

          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:400,500,700,900">
        </head>

        <body>
          <div id="app">
          <script src="/bundle.js" defer></script>
            ${markup}</div>
        </body>
      </html>
    `);
});

app.listen(3000, () => {
  console.log('Server is listening on port: 3000');
});
