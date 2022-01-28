import dayjs from "dayjs";

async function getArticolo(id) {
	const response = await fetch("/api/Articolo/" + id);
	const Articolo = await response.json();
	if (response.ok) return {id: Articolo.id, t: Articolo.Titolo, text: Articolo.Text, date: dayjs(Articolo.Data).format("DD/MM/YYYY"), img: Articolo.img};
	else throw Articolo;
}

async function getNotizie() {
	const response = await fetch("/api/Notizie");
	const Notizie = await response.json();
	if (response.ok) return Notizie.map(n => ({id: n.id, t: n.Titolo, data: dayjs(n.Data).format("DD/MM/YYYY")}));
	else throw Notizie;
}

async function addNotizia(Notizia) {
    return new Promise((resolve, reject) => {
        fetch('/api/Notizie', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(Notizia)
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

async function updateNotizia(id, Notizia) {
    return new Promise((resolve, reject) => {
        fetch('/api/Notizie/' + id, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(Notizia)
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

async function deleteNotizia(id) {
    return new Promise((resolve, reject) => {
        fetch('/api/Notizie/' + id, {method: 'DELETE'})
            .then((response) => {
                if (response.ok) {
                    resolve(null);
                } 
                else {
                    response.json()
                        .then((message) => { reject(message); }) // error message in the response body
                        .catch(() => { reject({ error: "Impossible to read server response." }) }); // something else
                }
            })
            .catch(() => { reject({ error: "Impossible to communicate with the server." }) }); // connection errors
    });
}

const notizieAPI = {
    getArticolo,
    getNotizie,
    addNotizia,
    updateNotizia,
    deleteNotizia
}

export default notizieAPI;