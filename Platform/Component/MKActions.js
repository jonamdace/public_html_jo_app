import React, { Component } from 'react';
//var serverUri = "http://192.168.43.42/public_html1/";
var serverUri = "https://www.1stepshop.in/";

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

export async function s4(){
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
}

export async function guid(){
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}


