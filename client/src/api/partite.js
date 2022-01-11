import dayjs from "dayjs";

async function getPartite() {
	const response = await fetch("/api/Partite");
	const Partite = await response.json();
	if (response.ok) return Partite.map(p => ({id: p.id, s1: {t: p.s1, g: p.g_s1}, s2:{t: p.s2, g: p.g_s2}, date: dayjs(p.Date).format("DD/MM/YYYY"), time: p.Time}));
	else throw Partite;
}

async function getPartita(id) {
	const response = await fetch("/api/Partita/" + id);
	const R = await response.json();
	if (response.ok) return {
    id: R[0].id, 
    s1: {
        id: R[0].id_s1, t: R[0].s1, g: R[0].g_s1,
        reti: R[1].filter(r => !!r.s1 && r.Key === "Rete").map(e => ({id: e.id, k: e.Giocatore, v: e.Minuto})),
        cartellini: R[1].filter(r => !!r.s1 && r.Key === "Cartellino").map(e => ({id: e.id, k: e.Giocatore, v: e.Minuto, y: !!e.Value})),
        pagelle: R[1].filter(r => !!r.s1 && r.Key === "Voto").map(e => ({id: e.id, k: e.Giocatore, v: e.Value})),
    },
    s2:{
        id: R[0].id_s2, t: R[0].s2, g: R[0].g_s2, 
        reti: R[1].filter(r => !r.s1 && r.Key === "Rete").map(e => ({id: e.id, k: e.Giocatore, v: e.Minuto})),
        cartellini: R[1].filter(r => !r.s1 && r.Key === "Cartellino").map(e => ({id: e.id, k: e.Giocatore, v: e.Minuto, y: !!e.Value})),
        pagelle: R[1].filter(r => !r.s1 && r.Key === "Voto").map(e => ({id: e.id, k: e.Giocatore, v: e.Value})),
    },
    date: dayjs(R[0].Date).format("DD/MM/YYYY"), time: R[0].Time};
	else throw R;
}


async function addPartita(partita) {
    return new Promise((resolve, reject) => {
        fetch('/api/Partita', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(partita)
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


async function updatePartita(id, partita) {console.log(id, partita)
    return new Promise((resolve, reject) => {
        fetch('/api/Partita/' + id, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(partita)
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

const partiteAPI = {
    getPartite,
    getPartita,
    addPartita,
    updatePartita
}

export default partiteAPI;