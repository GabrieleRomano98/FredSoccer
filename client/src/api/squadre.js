import dayjs from "dayjs";

async function getSquadre() {
	const response = await fetch("/api/Squadre");
	const Squadre = await response.json();
	if (response.ok) return Squadre;
	else throw Squadre;
}

async function getClassifica() {
	const response = await fetch("/api/Classifica");
	const Classifica = await response.json();
	if (response.ok) return Classifica.map(s => {
        return Object.fromEntries(Object.entries(s).filter(v => v[0] !== "img"))}
    );
	else throw Classifica;
}

async function getSquadra(id) {
	const response = await fetch("/api/Squadra/" + id);
	const Squadra = await response.json();
	if (response.ok) return Squadra;
	else throw Squadra;
}

async function getPartiteSquadra(id) {
	const response = await fetch("/api/Squadra/Partite/" + id);
	const Partite = await response.json();
	if (response.ok) return Partite.map(p => ({id: p.id, s1: {t: p.s1, g: p.g_s1}, s2:{t: p.s2, g: p.g_s2}, date: dayjs(p.Date).format("DD/MM/YYYY"), time: p.Time}));
	else throw Partite;
}


async function getGiocatori(id = "") {
	const response = await fetch("/api/Giocatori/" + id);
	const Giocatori = await response.json();
	if (response.ok) return (
        id === "" ? Giocatori.map(g => ({Nome: g.Cognome, id: g.id, Squadra: g.Squadra}))
        : Giocatori.map(g => ({id: g.id, nome: g.Nome+" "+g.Cognome, m: g.Media, p: g.Presenze, g: g.Reti, i: g.img})));
	else throw Giocatori;
}

async function addSquadra(squadra) {
  return new Promise((resolve, reject) => {
    fetch('/api/Squadra', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(squadra)
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

const squadreAPI = {
    getSquadre,
    getClassifica,
    getSquadra,
    getPartiteSquadra,
    getGiocatori,
    addSquadra,
}

export default squadreAPI;