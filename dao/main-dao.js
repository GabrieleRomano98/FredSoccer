"use strict";

const { getQuerySQL } = require("./utility");
const db = require("../db");

exports.getAds = async () => {
    return await getQuerySQL(db, "SELECT * FROM Ads", [], {id: 0, txt: "", img: "", link: ""}, false, false);
}

exports.getArticolo = async id => {
    return await getQuerySQL(db, "SELECT * FROM Articoli WHERE id = ?", [id], {id: 0, Titolo: "", Data: "", Text: "", img: ""}, false, true);
}

exports.getNotizie = async () => {
    return await getQuerySQL(db, "SELECT id, Titolo, Data FROM Articoli", [], {id: 0, Titolo: "", Data: ""}, false, false);
}

exports.getSquadre = async (id = false) => {
    const [cond, par] = !!id ? ["WHERE id = ?", [id]] : ["", []];
    const sql = "SELECT s.id, s.Nome,"
        + "3*(SELECT COUNT(*) FROM Partite p WHERE p.id_s1 = s.id AND p.g_s1 > p.g_s2 OR p.id_s2 = s.id AND p.g_s2 > p.g_s1) +"
        + "(SELECT COUNT(*) FROM PARTITE p WHERE (p.id_s1 = s.id OR p.id_s2 = s.id) AND p.g_s1 = p.g_s2) AS PT,"
        + "(SELECT COUNT(*) FROM Partite p WHERE p.id_s1 = s.id OR p.id_s2 = s.id) AS PG,"
        + "(SELECT COUNT(*) FROM Partite p WHERE p.id_s1 = s.id AND p.g_s1 > p.g_s2 OR p.id_s2 = s.id AND p.g_s2 > p.g_s1) AS V,"
        + "(SELECT COUNT(*) FROM PARTITE p WHERE (p.id_s1 = s.id OR p.id_s2 = s.id) AND p.g_s1 = p.g_s2) AS P,"
        + "(SELECT COUNT(*) FROM Partite p WHERE p.id_s1 = s.id AND p.g_s1 < p.g_s2 OR p.id_s2 = s.id AND p.g_s2 < p.g_s1) AS S,"
        + "(SELECT IFNULL(SUM(p.g_s1), 0) FROM Partite p WHERE p.id_s1 = s.id) +"
        + "(SELECT IFNULL(SUM(p.g_s2), 0) FROM Partite p WHERE p.id_s2 = s.id) AS GF,"
        + "(SELECT IFNULL(SUM(p.g_s1), 0) FROM Partite p WHERE p.id_s2 = s.id) + "
        + "(SELECT IFNULL(SUM(p.g_s2), 0) FROM Partite p WHERE p.id_s1 = s.id) AS GS "
        + "FROM Squadre s ";
    const obj = { id: 0, Nome: "", PT: 0, PG: 0, V: 0, P: 0, S: 0, GF: 0, GS: 0 };
    return await getQuerySQL(db, sql + cond, par, obj, false, !!id);
}

exports.getPartite = async (idP = false, idS = false) => {
    const [cond, par] = !!idP ? ["WHERE id = ?", [idP]] : !!idS ? ["WHERE id_s1 = ? OR id_s2 = ?", [idS, idS]] : ["", []];
    const sql = "SELECT id, (SELECT Nome FROM Squadre s WHERE id_s1 = s.id ) AS s1, "
        + "(SELECT Nome FROM Squadre s WHERE id_s2 = s.id ) AS s2, g_s1, g_s2, Date, Time FROM Partite ";
        console.log(sql+cond, par)
    const obj = { id: 0, s1: 0, s2: 0, g_s1: 0, g_s2: 0, Date: "", Time: "" };
    return await getQuerySQL(db, sql + cond, par, obj, false, !!idP);
}

exports.getInfoPartita = async id => {
    const sql = "SELECT (SELECT Cognome FROM Giocatori WHERE id = id_giocatore) AS Giocatore, Key, Minuto, Value, "
        + "(SELECT id_s1 FROM Partite WHERE id = ?) = (SELECT Squadra FROM Giocatori WHERE id = id_giocatore) AS s1 "
        + "FROM Partita_meta WHERE id_partita = ? ";
    const obj = { Giocatore: "", Key: "", Minuto: 0, Value: 0, s1: 0 };
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