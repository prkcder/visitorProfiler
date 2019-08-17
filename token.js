var getToken = (()=>{
const fs = require('fs'),
      pw = require('./.auth'),
      https = require('https'),
      qs = require('querystring');


const authData = {
    'username': pw.username,
    'key': pw.apikey
}

const postHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(qs.stringify(authData)),
    'Accept-Encoding': 'gzip, deflate',
    'Accept': '*/*'
}

const options = {
    hostname: 'api.tealiumiq.com',
    path: '/v2/auth',
    method: "POST",
    headers: postHeaders
}

return function getToken(){
  return new Promise((resolve,reject) => {
	//console.log("INSIDE GET TOKEN", pw);
  var auth = https.request(options, function(res){
    res.setEncoding('utf8');
    res.on('data', function(chunk){
      resolve(JSON.parse(chunk).token);
    })
    res.on('error', function(err){
      console.log("Error retrieving token: " + err);
      reject("false");
    })
  })
  auth.write(qs.stringify(authData));
  auth.end()
  })
}
})()

module.exports = getToken;
