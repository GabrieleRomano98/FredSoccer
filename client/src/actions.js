import { useHistory } from "react-router-dom";
import API from "./API";

let torneo, squadra, tipo;
const putSquadra = s => squadra = s;

const a_AreaRiservata = async (openForm, openList, feedback) => {
    const o = await API.getSquadre();
    const g = await API.getGiocatori();
    return [
        {
            n: "Aggiungi Partita",
            f: v => {API.addPartita({ torneo: torneo, ...v }); feedback("Partita aggiunta")}, 
            values: [
                {l: "Squadra di casa", t: "select", k: "id_s1", options: o, filt: () => 1},
                {l: "Squadra ospite", t: "select", k: "id_s2", options: o, filt: () => 1},
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

const updatePartita = async (id, checkSquadra, feedback, getID, goBack) => {
    const o = await API.getSquadre();
    const g = await API.getGiocatori();
    return [
        {
            n: "Modifica Partita",
            f: v => {API.updatePartita(id, v); feedback("Partita modificata")}, 
            values: [
                {l: "Squadra di casa", t: "select", k: "id_s1", options: o, filt: () => 1},
                {l: "Squadra ospite", t: "select", k: "id_s2", options: o, filt: () => 1},
                {l: "Data", t: "date", k: "Date"},
                {l: "Ora", t: "time", k: "Time"}
            ]
        },
        {
            n: "Elimina Partita", ban: true,
            f: v => {API.deletePartita(id); goBack();},
            values: [{l: "", ban: "Vuoi eliminare la partita e tutte le informazioni associate?", t: "confirm"}]
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
            n: "Aggiungi Reti",
            f: v => {API.addPartitaMeta({id: id, id_partita: getID(), Key: "Rete", ...v}); feedback("Rete aggiunta")}, 
            values: [
                {l: "Minuto", t: "number", k: "Minuto"},
                {l: "Giocatore", t: "select", k: "id_giocatore", options: g, filt: checkSquadra},
            ]
        },
        {
            n: "Modifica Reti",
            f: v => {API.updatePartitaMeta(getID(), v); feedback("Rete modificata");}, 
            values: [
                {l: "Giocatore", t: "select", k: "id_giocatore", options: g, filt: checkSquadra},
                {l: "Minuto", t: "number", k: "Minuto"}
            ]
        },
        {
            n: "Aggiungi Cartellini",
            f: v => {API.addPartitaMeta({id: id, id_partita: getID(), Key: "Cartellino", ...v}); feedback("Cartellino aggiunto")}, 
            values: [
                {l: "Minuto", t: "number", k: "Minuto"},
                {l: "Giocatore", t: "select", k: "id_giocatore", options: g, filt: checkSquadra},
                {l: "Tipo", t: "select", k: "Value", options: [{id: '0', Nome: "Rosso"}, {id: '1', Nome: "Giallo"}], filt: () => 1},
            ]
        },
        {
            n: "Modifica Cartellini",
            f: v => {API.updatePartitaMeta(getID(), v); feedback("Cartellino modificato");}, 
            values: [
                {l: "Giocatore", t: "select", k: "id_giocatore", options: g, filt: checkSquadra},
                {l: "Minuto", t: "number", k: "Minuto"},
                {l: "Tipo", t: "select", k: "Value", options: [{id: 1, Nome: "Giallo"}, {id: 0, Nome: "Rosso"}], filt: () => 1},
            ]
        },
        {
            n: "Aggiungi Pagelle",
            f: v => {API.addPartitaMeta({id: id, id_partita: getID(), Key: "Voto", ...v}); feedback("Voto aggiunto")}, 
            values: [
                {l: "Giocatore", t: "select", k: "id_giocatore", options: g, filt: checkSquadra},
                {l: "Voto", t: "number", k: "Value"},
            ]
        },
        {
            n: "Modifica Pagelle",
            f: v => {API.updatePartitaMeta(getID(), v); feedback("Voto modificatao");}, 
            values: [
                {l: "Giocatore", t: "select", k: "id_giocatore", options: g, filt: checkSquadra},
                {l: "Voto", t: "number", k: "Value"},
            ]
        },
        {
            n: "Elimina Informazioni", ban: true,
            f: v => {API.deletePartitaMeta(getID()); feedback("Informazione eliminata");},
            values: [{l: "", ban: "Vuoi eliminare l'informazione selezionata?", t: "confirm"}]
        },
    ];
}

const updateNotizia = async (id, feedback, goBack) => {
    return [
        {
            n: "Modifica Notizia",
            f: v => {API.updateNotizia(id, v); feedback("Voto modificatao");}, 
            values: [
                {l: "Titolo", t: "text", k: "Titolo"},
                {l: "Data", t: "date", k: "Data"},
                {l: "Testo", t: "text", k: "Text"},
                {l: "Link immagine", t: "text", k: "img"},
            ]
        },
        {
            n: "Elimina Notizia", ban: true,
            f: v => {API.deleteNotizia(id); goBack();},
            values: [{l: "", ban: "Vuoi eliminare la notizia?", t: "confirm"}]
        },
    ];
}



export { a_AreaRiservata, updatePartita, putSquadra, updateNotizia };