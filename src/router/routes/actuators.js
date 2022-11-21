const defineHealthcheck = (req, res, next) => {
  res.contentType = 'application/json';
  res.header('content-type', 'application/json');
  res.send(200, { status: 'UP' });
  next();
};

module.exports = (server) => {
  server.get('/health', defineHealthcheck);
};
