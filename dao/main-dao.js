"use strict";

const { getQuerySQL, runQuerySQL } = require("./utility");
const db = require("../db");

exports.getAds = async () => {
    return await getQuerySQL(db, "SELECT * FROM Ads", [], {id: 0, txt: "", img: "", link: ""}, false, false);
}

exports.getArticolo = async id => {
    return await getQuerySQL(db, "SELECT * FROM Articoli WHERE id = ?", [id], {id: 0, Titolo: "", Data: "", Text: "", img: ""}, false, true);
}

exports.getNotizie = async () => {
    return await getQuerySQL(db, "SELECT id, Titolo, Data FROM Articoli ORDER BY Data", [], {id: 0, Titolo: "", Data: ""}, false, false);
}

exports.getSquadre = async (t, id = false) => {
    let [cond, par] = !!id ? [" AND id = ?", [id]] : ["", []];
    const base = "(SELECT COUNT(*) FROM Partite p WHERE id_tournament = ? AND ";
    const sql = "SELECT s.id, s.Nome, " + (!!id ? "s.img, " : "")
        + "3*" + base + "(p.id_s1 = s.id AND p.g_s1 > p.g_s2 OR p.id_s2 = s.id AND p.g_s2 > p.g_s1)) +"
        + base + " (p.id_s1 = s.id OR p.id_s2 = s.id) AND p.g_s1 = p.g_s2) AS PT,"
        + base + " (p.id_s1 = s.id OR p.id_s2 = s.id)) AS PG,"
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

exports.getPartite = async (tournament = 1, idP = false, idS = false) => {
    const [cond, par] = !!idP ? ["WHERE id = ?", [idP]] 
        : !!idS ? ["WHERE id_tournament = ? AND id_s1 = ? OR id_s2 = ?", [tournament, idS, idS]] 
        : ["WHERE id_tournament = ?", [tournament]];
    const sql = "SELECT id, (SELECT Nome FROM Squadre s WHERE id_s1 = s.id ) AS s1, id_s1, "
        + "(SELECT Nome FROM Squadre s WHERE id_s2 = s.id ) AS s2, id_s2, g_s1, g_s2, Date, Time FROM Partite ";
    const obj = { id: 0, s1: "", id_s1: 0, s2: "", id_s2: 0, g_s1: 0, g_s2: 0, Date: "", Time: "" };
    return await getQuerySQL(db, sql + cond + " ORDER BY Date", par, obj, false, !!idP);
}

exports.getInfoPartita = async id => {
    const sql = "SELECT id, (SELECT Cognome FROM Giocatori WHERE id = id_giocatore) AS Giocatore, Key, Minuto, Value, "
        + "(SELECT id_s1 FROM Partite WHERE id = ?) = (SELECT Squadra FROM Giocatori WHERE id = id_giocatore) AS s1 "
        + "FROM Partita_meta WHERE id_partita = ? ";
    const obj = { id: 0, Giocatore: "", Key: "", Minuto: 0, Value: 0, s1: 0 };
    return await getQuerySQL(db, sql, [id, id], obj, false, false);
}

exports.getGiocatori = async id => {
    const sql = "SELECT id, Nome, Cognome, img, "
        + "(SELECT COUNT(*) FROM Partita_meta WHERE Key = 'Rete' AND id_giocatore = id) AS Reti, "
        + "(SELECT COUNT(*) FROM Partita_meta WHERE Key = 'Voto' AND id_giocatore = id) AS Presenze, "
        + "(SELECT AVG(VALUE) FROM Partita_meta WHERE Key = 'Voto' AND id_giocatore = id) AS Media "
        + "FROM Giocatori WHERE Squadra = ? ";
    const obj = { id: 0, Nome: "", Cognome: "", img: "", Reti: 0, Presenze: 0, Media: 0 };
    return await getQuerySQL(db, sql, [id], obj, false, false);
}

exports.addPartita = async (Tournament, Partita) => {
    const sql = "INSERT INTO Partite(id_tournament, id_s1, id_s2, Date, Time) VALUES(?, ?, ?, ?, ?)";
    const par = [Tournament, ...Object.values(Partita)];
    return await runQuerySQL(db, sql, par, false);
}

exports.addSquadra = async Squadra => {
    const sql = "INSERT INTO Squadre(Nome, img) VALUES(?, ?)";
    const par = Object.values(Squadra);
    return await runQuerySQL(db, sql, par, false);
}

exports.addNotizia = async Notizia => {
    const sql = "INSERT INTO Articoli(Titolo, Data, Text, img) VALUES(?, ?, ?, ?)";
    const par = Object.values(Notizia);
    return await runQuerySQL(db, sql, par, false);
}

exports.addAd = async Ad => {
    const sql = "INSERT INTO Ads(txt, img, link) VALUES(?, ?, ?)";
    const par = Object.values(Ad);
    return await runQuerySQL(db, sql, par, false);
}