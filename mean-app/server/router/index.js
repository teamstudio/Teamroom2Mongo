// server/router/index.js

module.exports = function (app) {

	//all calls to the API
    app.use('/api', require('./routes/api'));

};
