'use strict';

async function getUserId(email) {
	const response = await fetch('api/users/' + email);
	const respondeBody = await response.json();
	if (response.ok) {
		return respondeBody;
	}
	else throw respondeBody;
}

async function logIn(credentials) {
	let response = await fetch("/api/sessions", {
	  method: "POST",
	  headers: {
		"Content-Type": "application/json",
	  },
	  body: JSON.stringify(credentials),
	});
	if (response.ok) {
	  const user = await response.json();
	  return user;
	} else {
	  try {
		const errDetail = await response.json();
		throw errDetail.message;
	  } catch (err) {
		throw err;
	  }
	}
}

async function logOut() {
	await fetch("/api/sessions/current", { method: "DELETE" });
}


async function getUserInfo(userID) {
	const response = await (userID ? fetch("/api/user/" + userID) : fetch("/api/sessions/current"));
	const userInfo = await response.json();
	if (response.ok) return userInfo;
	else throw userInfo;
}

async function addUser(newUser) {
    return new Promise((resolve, reject) => {
		fetch('/api/newUser', {
		  	method: 'POST',
		  	headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(newUser)
		}).then((response) => {
			if (response.ok) {
				resolve(null);
			} 
			else {
				response.json()
					.then((message) => { reject(message); }) // error message in the response body
					.catch(() => { reject({ error: "Impossible to read server response." }) }); // something else
			}
		}).catch(() => { reject({ error: "Impossible to communicate with the server." }) }); // connection errors
	});
}

const userAPI = {
	getUserId,
	getUserInfo,
	logIn,
	logOut,
	addUser
}

export default userAPI;