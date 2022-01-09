import { useState, useEffect } from "react";
import { Alert, Button, Container, Row, Spinner } from "react-bootstrap";
import API from "./API"
import { ListModal, MyModal } from "./MyModal";

let torneo, squadra;

function AreaRiservata() {

    const [actions, setActions] = useState(false);
    const [message, setMessage] = useState(false);
    const selectAction = (n, open = true) => setActions(actions => actions.map(a => a.n === n ? {...a, show: open} : a));
    const openList = (n, open = true) => setActions(actions => actions.map(a => a.n === n ? ({...a, list: open}) : a));
    const openList2 = (n, open = true) => setActions(actions => actions.map(a => a.n === n ? ({...a, list2: open}) : a));
    useEffect(() => {
		const getActions = async () => {
            if(!actions) {
                const o = (await API.getClassifica()).map(s => ({id: s.id, Nome: s.Squadra}));
                const a = [
                    {
                        n: "Aggiungi Partita",
                        f: v => {API.addPartita(v); setMessage("Partita aggiunta")}, 
                        values: [
                            {l: "Squadra di casa", t: "select", k: "id_s1", options: o},
                            {l: "Squadra ospite", t: "select", k: "id_s2", options: o},
                            {l: "Data", t: "date", k: "Date"},
                            {l: "Ora", t: "time", k: "Time"}
                        ]
                    },
                    {
                        n: "Aggiungi Squadra", 
                        f: v => {API.addSquadra(v); setMessage("Squadra aggiunta")}, 
                        values: [
                            {l: "Nome", t: "text", k: "Nome"},
                            {l: "Link immagine", t: "text", k: "img"}
                        ]
                    },
                    {
                        n: "Aggiungi Notizia", 
                        f: v => {API.addNotizia(v); setMessage("Notizia aggiunta")}, 
                        values: [
                            {l: "Titolo", t: "text", k: "Titolo"},
                            {l: "Data", t: "date", k: "Data"},
                            {l: "Testo", t: "Testo", k: "Text"},
                            {l: "Link immagine", t: "text", k: "img"},
                        ]
                    },
                    {
                        n: "Aggiungi Pubblicità",
                        f: v => {API.addAd(v); setMessage("Pubblicità aggiunta")},
                        values: [
                            {l: "Testo", t: "text", k: "txt"},
                            {l: "Link immagine", t: "text", k: "img"},
                            {l: "Link sito", t: "text", k: "link"},
                        ]
                    },
                    {   
                        n: "Crea Torneo", 
                        f: v => {API.addTorneo(v); setMessage("Torneo creato");}, 
                        values: [{l: "Nome", t: "text", k: "Nome"}]
                    },
                    {
                        n: "Rinomina Torneo", 
                        f: nome => {API.updateTorneo(torneo, nome); setMessage("Torneo modificato");},
                        values: [{l: "Nome", t: "text", k: "Nome"}],
                        lt: "Seleziona Torneo", ls: true,
                        getValues: API.getTornei,
                        select: (id, n) => {torneo = id; selectAction(n)}
                    },
                    {
                        n: "Elimina Torneo", ban: true,
                        f: v => {API.deleteTorneo(torneo); setMessage("Torneo eliminato");},
                        values: [{l: "", ban: "Vuoi eliminare il torneo? Tutte le sue partite andranno perse!", t: "confirm"}],
                        lt: "Seleziona Torneo", ls: true,
                        getValues: API.getTornei,
                        select: (id, n) => {torneo = id; selectAction(n)}
                    },
                    {
                        n: "Aggiungi Iscrizione",
                        lt: "Seleziona Torneo", ls: true,
                        getValues: API.getTornei, values: [],
                        select: (id, n) => {torneo = id; openList2(n)},
                        lt2: "Seleziona squadra",
                        getValues2: () => API.getSquadreTorneo(torneo), 
                        select2: id => {API.addIscrizione(torneo, id); setMessage("Iscrizione aggiunta")}
                    },
                    {
                        n: "Annulla Iscrizione", ban: true,
                        f: v => {API.removeIscrizione(torneo, squadra); setMessage("Iscrizione annullata");},
                        values: [{l: "", ban: "Vuoi annullare l'iscrizione? Le partite della squadra nel torneo andranno perse!", t: "confirm"}],
                        lt: "Seleziona Torneo", ls: true,
                        select: (id, n) => {torneo = id; openList2(n)},
                        getValues: API.getTornei,
                        lt2: "Seleziona squadra",
                        getValues2: () => API.getSquadreTorneo(torneo, false),
                        select2: (id, n) => {squadra = id; selectAction(n)}
                    },
                ];
                setActions(a);
            }
		};
        getActions().catch((err) => console.log(err));
	}, [actions]);

    return(
        !actions ? <div align="center"><Spinner animation="border" /></div> :
        <Container>
            {message && <Alert variant="success" onClose={() => setMessage('')} dismissible>{message}</Alert>}
            {actions.map(a =>
                <Row className='justify-content-center'>
                    <MyModal show={!!a.show} hide={() => selectAction(a.n, false)} action={a}/>
                    <ListModal title = {a.lt} show={a.list} hide={() => openList(a.n, false)} getValues={a.getValues} select={id => a.select(id, a.n)}/>
                    <ListModal title = {a.lt2} show={a.list2} hide={() => openList2(a.n, false)} getValues={a.getValues2} select={id => a.select2(id, a.n)}/>
                    <Button className="cardStyle m-3 w-75" size="lg" variant="dark" onClick={() => !a.ls ? selectAction(a.n) : openList(a.n)}>
                        {a.n}
                    </Button>
                </Row>
            )}
        </Container>
    );
}

export default AreaRiservata;