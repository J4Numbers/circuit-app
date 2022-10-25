const uuid = require('uuid');

const requestId = (req, res, next) => {
  req.log.fields.request_id = uuid.v4();
  next();
};

module.exports = requestId;
