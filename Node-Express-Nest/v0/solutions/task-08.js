
const express = require('express');
const path = require('path');

function staticFilesMiddleware() {
  const publicPath = path.join(__dirname, 'public');
  return express.static(publicPath, { prefix: '/static' });
}

module.exports = staticFilesMiddleware;
