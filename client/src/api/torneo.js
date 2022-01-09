async function getTornei() {
	const response = await fetch("/api/Tornei");
	const Tornei = await response.json();
	if (response.ok) return Tornei.map(t => ({id: t.id, key: t.Nome}));
	else throw Tornei;
}

async function getTorneo(Nome = false) {
	const response = await fetch("/api/thisTorneo" + (Nome ? "/Nome" : ""));
	const Torneo = await response.json();
	if (response.ok) return Torneo[Nome ? "Nome" : "id"];
	else throw Torneo;
}

async function setTorneo(id) {
    return new Promise((resolve, reject) => {
    fetch('/api/thisTorneo/' + id, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'}
    }).then((response) => {
        if (response.ok) {
            resolve(null);
        } 
        else {
        response.json()
            .then(message => { reject(message); }) // error message in the response body
            .catch(() => { reject({ error: "Impossible to read server response." }) }); // something else
        }
    }).catch(() => { reject({ error: "Impossible to communicate with the server." }) }); // connection errors
    });
}

async function addTorneo(nome) {
    return new Promise((resolve, reject) => {
        fetch('/api/Torneo', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(nome)
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

async function updateTorneo(id, nome) {
    return new Promise((resolve, reject) => {
        fetch('/api/Torneo/' + id, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(nome)
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

async function deleteTorneo(id) {
    return new Promise((resolve, reject) => {
        fetch('/api/Torneo/' + id, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
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

async function getSquadreTorneo(id, reg = true) {
	const response = await fetch("/api/Squadre/Torneo/" + (reg ? -id : id));
	const Squadre = await response.json();
	if (response.ok) return Squadre.map(s => ({id: s.id, key: s.Nome}));
	else throw Squadre;
}

async function addIscrizione(torneo, squadra) {
    return new Promise((resolve, reject) => {
        fetch('/api/Torneo/Iscrizione/' + torneo, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({squadra: squadra})
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

async function removeIscrizione(torneo, squadra) {
    return new Promise((resolve, reject) => {
        fetch('/api/Torneo/Iscrizione/' + torneo, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({squadra: squadra})
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

const torneoAPI = {
  getTorneo,
  getTornei,
  setTorneo,
  addTorneo,
  updateTorneo,
  deleteTorneo,
  getSquadreTorneo,
  addIscrizione,
  removeIscrizione
}

export default torneoAPI;