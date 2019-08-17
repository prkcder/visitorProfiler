var requestVP = (()=>{
const fs = require('fs'),
      config = require('./.config'),
      https = require('https'),
      qs = require('querystring');


const options  = {
      hostname: 'api.tealiumiq.com',
      path: '',
      method: "GET",
      headers: {
        'Accept-Encoding': 'gzip, deflate',
        'Accept': '*/*',
        'Authorization' : ''
      }
    }

return function(t, key, value){
  return new Promise((resolve, reject) => {
	try{
    var temp = options;
    temp.headers['Authorization'] = "Bearer " + t;
    temp.path = '/v2/visitor/accounts/' + config.account + '/profiles/' + config.profile + '?attributeId=' + key + "&attributeValue=" + encodeURIComponent(value) + '&prettyName=true';
    var str = ""
    var getit = https.request(temp, function(res){
        res.setEncoding('utf8')
        res.on('data', function(chunk){
      		str += chunk
        })
    	res.on('end', function(){
			var {visitor, transactionId} = JSON.parse(str.toString())
      		resolve(visitor || transactionId || "undefined");
    	})
      	res.on('error', function(err){
      		reject("error");
      	})
  	})
  	//without this end the call will hang
    getit.end();
	}catch(e){
		resolve({properties:{error:"There was an error processing your request to get the visitor profile"}});
	}
  })
}
})()

module.exports = requestVP;
