var crypto = require('crypto');
var helper = require('sendgrid').mail;

module.exports = {
	md5: function(string) {
        return crypto.createHash('md5').update(string).digest('hex');
    },
	// https://blogs.msdn.microsoft.com/luisguerrero/2014/04/04/envo-de-correos-utilizando-sendgrid-desde-node-js/
	sendEmail: function (from, to, subject, body, callback) {
	
		var fromEmail = new helper.Email(from, 'iCanGo');
		var toEmail = new helper.Email(to);
		var subjectEmail = subject;
		var bodyEmail = new helper.Content("text/html", body);
		var mail = new helper.Mail(fromEmail, subjectEmail, toEmail, bodyEmail);
		
		var sg = require('sendgrid').SendGrid(process.env.SENDGRID_API_KEY);
		var requestBody = mail.toJSON();
		var request = sg.emptyRequest();
		request.method = 'POST';
		request.path = '/v3/mail/send';
		request.body = requestBody;
		sg.API(request, function (response) {
			/*console.log('response -> ', response);
			console.log('response.statusCode -> ', response.statusCode);
			console.log('response.body -> ', response.body);
			console.log('response.headers -> ', response.headers);		
			*/
			callback(response);
		});
	},
	validateParam: function(param, res) {
        if (param.value === undefined) {
            res.status(400).json({
                    totalRows: 0,
                    error: param.name + " param is missing",
                    data: {}
                });
           return false;
        }
		return true;
	},
	GetUserByEmail: function GetUserByEmail(db, email, callback) {
        var query = {
            sql: 'GetUserByEmail @email',
            parameters: [
                { name: 'email', value: email }
            ]
        };
        db.execute(query)
        .then(function (results) {
            callback(results, null);
        })
        .catch(function(err) {
            callback(null, err);
        });
    },
	GetUserByEmailAndPassword: function GetUserByEmail(db, email, password, callback) {
        var query = {
            sql: 'GetUserByEmailAndPassword @email, @password',
            parameters: [
                { name: 'email', value: email },
				{ name: 'password', value: password }
            ]
        };
        db.execute(query)
        .then(function (results) {
            callback(results, null);
        })
        .catch(function(err) {
            callback(null, err);
        });
    }
};