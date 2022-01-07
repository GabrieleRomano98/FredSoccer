import userAPI from "./api/user.js";
import dayjs from "dayjs";

function getJson(httpResponsePromise) {
  return new Promise((resolve, reject) => {
    httpResponsePromise
      .then((response) => {
        if (response.ok) {
          // always return {} from server, never null or non json, otherwise it will fail
          response
            .json()
            .then((json) => resolve(json))
            .catch((err) => reject({ error: "Cannot parse server response" }));
        } else {
          // analyze the cause of error
          response
            .json()
            .then((obj) => reject(obj)) // error msg in the response body
            .catch((err) => reject({ error: "Cannot parse server response" })); // something else
        }
      })
      .catch((err) => reject({ error: "Cannot communicate" })); // connection error
  });
}

async function getTornei() {
	const response = await fetch("/api/Tornei");
	const Tornei = await response.json();
	if (response.ok) return Tornei.map(t => ({id: t.id, key: t.Nome}));
	else throw Tornei;
}

async function getTorneo(Nome = false) {
	const response = await fetch("/api/Torneo" + (Nome ? "/Nome" : ""));
	const Torneo = await response.json();
	if (response.ok) return Torneo[Nome ? "Nome" : "id"];
	else throw Torneo;
}

async function setTorneo(id) {
  return new Promise((resolve, reject) => {
  fetch('/api/Torneo/' + id, {
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

async function getAds() {
	const response = await fetch("/api/ads");
	const Ads = await response.json();
	if (response.ok) return Ads.map(a => ({id: a.id, t: a.txt, i: a.img, l: a.link}));
	else throw Ads;
}

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

async function getClassifica() {
	const response = await fetch("/api/Classifica");
	const Classifica = await response.json();
	if (response.ok) return Classifica.map(s => {
    let o = Object.entries(s); 
    o.splice(1, 1, ["Squadra", s.Nome]); 
    return Object.fromEntries(o)}
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
      reti: R[1].filter(r => !r.s1 && r.Key === "Rete").map(e => ({k: e.Giocatore, v: e.Minuto})),
      cartellini: R[1].filter(r => !r.s1 && r.Key === "Cartellino").map(e => ({k: e.Giocatore, v: e.Minuto, y: !!e.Value})),
      pagelle: R[1].filter(r => !r.s1 && r.Key === "Voto").map(e => ({k: e.Giocatore, v: e.Value})),
    },
    date: dayjs(R[0].Date).format("DD/MM/YYYY"), time: R[0].Time};
	else throw R;
}

async function getGiocatori(id) {
	const response = await fetch("/api/Giocatori/" + id);
	const Giocatori = await response.json();
	if (response.ok) return Giocatori.map(g => ({id: g.id, nome: g.Nome+" "+g.Cognome, m: g.Media, p: g.Presenze, g: g.Reti, i: g.img}));
	else throw Giocatori;
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

async function addNotizia(Notizia) {
  return new Promise((resolve, reject) => {
  fetch('/api/Notizia', {
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

async function addAd(Ad) {
  return new Promise((resolve, reject) => {
  fetch('/api/Ad', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(Ad)
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

const API = {
  ...userAPI,
  getTorneo,
  getTornei,
  setTorneo,
  getAds,
  getArticolo,
  getNotizie,
  getClassifica,
  getSquadra,
  getPartiteSquadra,
  getGiocatori,
  getPartite,
  getPartita,
  addPartita,
  addSquadra,
  addNotizia,
  addAd
};

export default API;