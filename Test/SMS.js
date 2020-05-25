// var request = require("request");
var request = require("request-promise");

var options = { method: 'POST',
url: 'http://enterprise.smsgupshup.com/GatewayAPI/rest',
form:
{ method: 'sendMessage',
send_to: '918976752466',
msg: 'Your OTP to play CliQbola is 2829. Best of luck!',
msg_type: 'TEXT',
userid: '2000192300',
auth_scheme: 'PLAIN',
password: 'Ako9xBEfd',
format: 'JSON' } };
// request(options, function (error, response, body) {
// if (error) throw new Error(error);
// console.log(body);
// });

const server_Respone = request(options)
.then((htmlString) => {
    console.log(htmlString)
    // return { Success: true, Data: htmlString };
})
.catch((err) => {
    console.log(err)
    // return { Success: false, Data: err };
});


// console.log(server_Respone)