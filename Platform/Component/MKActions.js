import React, { Component } from 'react';
var serverUri = "http://192.168.43.42/public_html1/";
//var serverUri = "https://www.1stepshop.in/";

export async function doPost(subUrl, postJsonData){
	var url = serverUri + subUrl;
	let response = await fetch(url, {
		method: 'POST',
		headers: {
  			'Accept': 'application/json',
  			'Content-Type': 'multipart/form-data;'		},
		body: postJsonData
	}).then((response) => response.json()).then((responseJson) => { return responseJson; })
	return response; 
}

