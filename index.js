const express = require('express'),
	app = express(),
	url = require('url'),
	fs = require('fs'),
	includeKeys = require('./.config')['includeKeys'],
	getToken = require('./token.js'),
	deleteVP = require('./deleteVP.js'),
	requestVP = require('./requestVP.js'),
	axios = require('axios'),
	mockData = require('./allusersprofiledata.json')
;

const index = fs.readFileSync('index.html');

const attributeMappings ={
	"email" : 5088,
	"tealium first party id" : 76
}

app.use(express.json());

async function n(k, v, res, type){
	// get token that is required for requesting VP or deleting VP
	try{
	//if promise is rejected an error will be thrown
	var token = await getToken();
	if(type == "getVP"){
		var result =  await requestVP(token, k, v);
		if(typeof result === 'object'){
			//filter and send results to client
			res.end(JSON.stringify(filtArray(result, includeKeys)));
		}
		res.end(JSON.stringify({properties:{result: "no visitor profile found the Visitor ID: " + v}}));
	}
	
	if(type == "deleteVP"){
		var result = await deleteVP(token, k, v);			
		res.end(JSON.stringify({properties:result}));
	}
	//message sent if we are unable to retrieve token
	res.end(JSON.stringify({properties:{Error : 'There was an issue processing your request, please try again later'}}))
	} catch(e){
		res.end(JSON.stringify({properties:{Error : 'There was an issue processing your request, please try again later'}}))
	}
	
}

function filtArray(arr, filt){
  let temp = {};
  filt.forEach((i) => {
        temp[i] = arr[i]
    })
  return temp;  
}

function getParts(r){
	return [url.parse(r.url, true), 
		url.parse(r.url,true).query,
		attributeMappings[url.parse(r.url,true).query['attr'].toLowerCase()],
		url.parse(r.url,true).query['value']
		]
}




app.use('/public',express.static('public'));

app.get('/', (req, res) => res.end(index))

app.get('/mockData', (req, res) => {
	res.json(mockData);
});

app.get('/getData', (req,res) => {
	let [url_parts, query, key, value] = getParts(req);
	n(key, value, res, "getVP");
})

app.get('/deleteData', (req, res) =>{
	let [url_parts, query, key, value] = getParts(req);
	n(key, value, res, "deleteVP");
})

app.listen(1337, () => console.log('Listening on 1337'));
