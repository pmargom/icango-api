var crypto = require('crypto');
var helper = require('sendgrid').mail;

module.exports = {
	md5: function(string) {
        return crypto.createHash('md5').update(string).digest('hex');
    },
	// https://blogs.msdn.microsoft.com/luisguerrero/2014/04/04/envo-de-correos-utilizando-sendgrid-desde-node-js/
	sendEmail: function (from, to, subject, body) {
	
		var fromEmail = new helper.Email(from);
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
			console.log(response.statusCode);
			console.log(response.body);
			console.log(response.headers);
		});
		return true;
	}
};