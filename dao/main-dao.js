"use strict";

const { getQuerySQL, runQuerySQL } = require("./utility");
const db = require("../db");

exports.getArticolo = async id => {
    return await getQuerySQL(db, "SELECT * FROM Articoli WHERE id = ?", [id], {id: 0, Titolo: "", Data: "", Text: "", img: ""}, false, true);
}

exports.getNotizie = async () => {
    return await getQuerySQL(db, "SELECT id, Titolo, Data FROM Articoli ORDER BY Data", [], {id: 0, Titolo: "", Data: ""}, false, false);
}

exports.getClassifica = async (t, id = false) => {
    let [cond, par] = !!id ? [" AND id = ?", [id]] : ["", []];
    const base = "(SELECT COUNT(*) FROM Partite p WHERE id_tournament = ? AND ";
    const sql = "SELECT s.id, s.Nome, " + (!!id ? "s.img, " : "")
        + "3*" + base + "(p.id_s1 = s.id AND p.g_s1 > p.g_s2 OR p.id_s2 = s.id AND p.g_s2 > p.g_s1)) +"
        + base + " (p.id_s1 = s.id OR p.id_s2 = s.id) AND p.g_s1 = p.g_s2) AS PT,"
        + base + " (p.id_s1 = s.id OR p.id_s2 = s.id) AND NOT g_s1 ISNULL) AS PG,"
        + base + " (p.id_s1 = s.id AND p.g_s1 > p.g_s2 OR p.id_s2 = s.id AND p.g_s2 > p.g_s1)) AS V,"
        + base + " (p.id_s1 = s.id OR p.id_s2 = s.id) AND p.g_s1 = p.g_s2) AS P,"
        + base + " (p.id_s1 = s.id AND p.g_s1 < p.g_s2 OR p.id_s2 = s.id AND p.g_s2 < p.g_s1)) AS S,"
        + "(SELECT IFNULL(SUM(p.g_s1), 0) FROM Partite p WHERE id_tournament = ? AND p.id_s1 = s.id) +"
        + "(SELECT IFNULL(SUM(p.g_s2), 0) FROM Partite p WHERE id_tournament = ? AND p.id_s2 = s.id) AS GF,"
        + "(SELECT IFNULL(SUM(p.g_s1), 0) FROM Partite p WHERE id_tournament = ? AND p.id_s2 = s.id) + "
        + "(SELECT IFNULL(SUM(p.g_s2), 0) FROM Partite p WHERE id_tournament = ? AND p.id_s1 = s.id) AS GS "
        + "FROM Squadre s WHERE s.id IN (SELECT Squadra FROM Iscrizioni WHERE Torneo = ?)";
    par = [t, t, t, t, t, t, t, t, t, t, t, ...par];
    const obj = { id: 0, Nome: "", img: "", PT: 0, PG: 0, V: 0, P: 0, S: 0, GF: 0, GS: 0 };
    return await getQuerySQL(db, sql + cond, par, obj, false, !!id);
}

exports.getSquadre = async () => {
    return await getQuerySQL(db, "SELECT id, Nome FROM Squadre", [], {id: 0, Nome: ""}, false, false);
}

exports.getGiocatori = async (id = false) => {
    const sql = !id ? "SELECT id, Cognome, Squadra FROM Giocatori" 
        : "SELECT id, Nome, Cognome, img, "
        + "(SELECT COUNT(*) FROM Partita_meta WHERE Key = 'Rete' AND id_giocatore = id) AS Reti, "
        + "(SELECT COUNT(*) FROM Partita_meta WHERE Key = 'Voto' AND id_giocatore = id) AS Presenze, "
        + "(SELECT AVG(VALUE) FROM Partita_meta WHERE Key = 'Voto' AND id_giocatore = id) AS Media "
        + "FROM Giocatori WHERE Squadra = ? ";
    const obj = !id ? {id:0, Cognome: "", Squadra: 0} : { id: 0, Nome: "", Cognome: "", img: "", Reti: 0, Presenze: 0, Media: 0 };
    const par = !id ? [] : [id];
    return await getQuerySQL(db, sql, par, obj, false, false);
}

exports.addSquadra = async Squadra => {
    const sql = "INSERT INTO Squadre(Nome, img) VALUES(?, ?)";
    const par = Object.values(Squadra);
    return await runQuerySQL(db, sql, par, false);
}