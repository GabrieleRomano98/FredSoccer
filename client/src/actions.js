import API from "./API";

let torneo, squadra;

const a_AreaRiservata = async (openForm, openList, feedback) => {
    const o = await API.getSquadre();
    return [
        {
            n: "Aggiungi Partita",
            f: v => {API.addPartita({ torneo: torneo, ...v }); feedback("Partita aggiunta")}, 
            values: [
                {l: "Squadra di casa", t: "select", k: "id_s1", options: o},
                {l: "Squadra ospite", t: "select", k: "id_s2", options: o},
                {l: "Data", t: "date", k: "Date"},
                {l: "Ora", t: "time", k: "Time"}
            ],
            lt: "Seleziona Torneo", ls: true,
            getValues: API.getTornei,
            select: (id, n) => {torneo = id; openForm(n)}
        },
        {
            n: "Aggiungi Squadra", 
            f: v => {API.addSquadra(v); feedback("Squadra aggiunta")}, 
            values: [
                {l: "Nome", t: "text", k: "Nome"},
                {l: "Link immagine", t: "text", k: "img"}
            ]
        },
        {
            n: "Aggiungi Notizia", 
            f: v => {API.addNotizia(v); feedback("Notizia aggiunta")}, 
            values: [
                {l: "Titolo", t: "text", k: "Titolo"},
                {l: "Data", t: "date", k: "Data"},
                {l: "Testo", t: "Testo", k: "Text"},
                {l: "Link immagine", t: "text", k: "img"},
            ]
        },
        {
            n: "Aggiungi Pubblicità",
            f: v => {API.addAd(v); feedback("Pubblicità aggiunta")},
            values: [
                {l: "Testo", t: "text", k: "txt"},
                {l: "Link immagine", t: "text", k: "img"},
                {l: "Link sito", t: "text", k: "link"},
            ]
        },
        {   
            n: "Crea Torneo", 
            f: v => {API.addTorneo(v); feedback("Torneo creato");}, 
            values: [{l: "Nome", t: "text", k: "Nome"}]
        },
        {
            n: "Rinomina Torneo", 
            f: nome => {API.updateTorneo(torneo, nome); feedback("Torneo modificato");},
            values: [{l: "Nome", t: "text", k: "Nome"}],
            lt: "Seleziona Torneo", ls: true,
            getValues: API.getTornei,
            select: (id, n) => {torneo = id; openForm(n)}
        },
        {
            n: "Elimina Torneo", ban: true,
            f: v => {API.deleteTorneo(torneo); feedback("Torneo eliminato");},
            values: [{l: "", ban: "Vuoi eliminare il torneo? Tutte le sue partite andranno perse!", t: "confirm"}],
            lt: "Seleziona Torneo", ls: true,
            getValues: API.getTornei,
            select: (id, n) => {torneo = id; openForm(n)}
        },
        {
            n: "Aggiungi Iscrizione",
            lt: "Seleziona Torneo", ls: true,
            getValues: API.getTornei, values: [],
            select: (id, n) => {torneo = id; openList(n)},
            lt2: "Seleziona squadra",
            getValues2: () => API.getSquadreTorneo(torneo), 
            select2: id => {API.addIscrizione(torneo, id); feedback("Iscrizione aggiunta")}
        },
        {
            n: "Annulla Iscrizione", ban: true,
            f: v => {API.removeIscrizione(torneo, squadra); feedback("Iscrizione annullata");},
            values: [{l: "", ban: "Vuoi annullare l'iscrizione? Le partite della squadra nel torneo andranno perse!", t: "confirm"}],
            lt: "Seleziona Torneo", ls: true,
            select: (id, n) => {torneo = id; openList(n)},
            getValues: API.getTornei,
            lt2: "Seleziona squadra",
            getValues2: () => API.getSquadreTorneo(torneo, false),
            select2: (id, n) => {squadra = id; openForm(n)}
        },
    ];
}

const updatePartita = async (id, feedback, getID) => {
    const o = await API.getSquadre();
    return [
        {
            n: "Modifica Partita",
            f: v => {API.updatePartita(id, v); feedback("Partita modificata")}, 
            values: [
                {l: "Squadra di casa", t: "select", k: "id_s1", options: o},
                {l: "Squadra ospite", t: "select", k: "id_s2", options: o},
                {l: "Data", t: "date", k: "Date"},
                {l: "Ora", t: "time", k: "Time"}
            ]
        },
        {
            n: "Aggiorna Risultato",
            f: v => {API.updatePartita(id, v); feedback("Risultato aggiornato")}, 
            values: [
                {l: "Reti squadra di casa", t: "number", k: "g_s1"},
                {l: "Reti squadra ospite", t: "number", k: "g_s2"}
            ]
        },
        {
            n: "Modifica Reti",
            f: v => {/*API.updatePartitaMeta(getID, v); feedback("Risultato aggiornato")*/console.log(22)}, 
            values: [
                {l: "Giocatore", t: "select", k: "id_giocatore", options: []},
                {l: "Minuto", t: "number", k: "Minuto"}
            ]
        },
    ];
}



export { a_AreaRiservata, updatePartita };