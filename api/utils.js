var crypto = require('crypto');

module.exports = {
	 md5: function(string) {
        return crypto.createHash('md5').update(string).digest('hex');
    }
}