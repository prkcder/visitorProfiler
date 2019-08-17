var deleteVP = (()=>{
const fs = require('fs'),
      config = require('./.config'),
      https = require('https'),
      qs = require('querystring');

const authData = {
    'username': config.username,
    'key': config.apikey
}

const postHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(qs.stringify(authData)),
    'Accept-Encoding': 'gzip, deflate',
    'Accept': '*/*'
}
const options = {
    hostname : 'api.tealiumiq.com',
    path  : '',
    method : 'DELETE',
    headers : postHeaders
}

return function deleteVisitor(t,k,v){
  return new Promise((resolve, reject) => {
    var data = {};
    data['attributeId'] =k, 
    data['attributeValue']=v;
    var temp = options;
    temp.headers['Authorization'] = "Bearer " + t;
    temp.path = '/v2/visitor/accounts/' + config.account + '/profiles/' + config.profile;
    temp.headers['Content-Length'] = Buffer.byteLength(qs.stringify(data));
	try{
    var del = https.request(temp, function(res){
      res.setEncoding('utf8')
      res.on('data', function(chunk){
        resolve(JSON.parse(chunk));
      })
      res.on('error', function(err){
        reject('error')
      })
    })
	}catch(e){
		resolve({properties:{error:"There was an error processing your delete request"}});
	}
    del.write(qs.stringify(data));
    del.end();
  })
}


})()

module.exports = deleteVP;
