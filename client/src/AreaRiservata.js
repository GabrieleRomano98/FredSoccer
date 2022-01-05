import { useState, useEffect } from "react";
import { Button, Container, Row, Spinner } from "react-bootstrap";
import API from "./API"
import MyModal from "./MyModal";



function AreaRiservata() {

    const [actions, setActions] = useState(false);
    const selectAction = n => setActions(actions => actions.map(a => a.n === n ? {...a, show: true} : a));
    useEffect(() => {
		const getActions = async () => {
            const o = (await API.getClassifica()).map(s => ({id: s.id, Nome: s.Squadra}));
            const a = [
                {n: "Aggiungi Partita", f: API.addPartita, values: [
                    {l: "Squadra di casa", t: "select", k: "id_s1", options: o},
                    {l: "Squadra ospite", t: "select", k: "id_s2", options: o},
                    {l: "Data", t: "date", k: "Date"},
                    {l: "Ora", t: "time", k: "Time"}
                ]},
                {n: "Aggiungi Squadra", f: API.addSquadra, values: [
                    {l: "Nome", t: "text", k: "Nome"},
                    {l: "Link immagine", t: "text", k: "img"}
                ]},
                {n: "Aggiungi Notizia", f: API.addNotizia, values: [
                    {l: "Titolo", t: "text", k: "Titolo"},
                    {l: "Data", t: "date", k: "Data"},
                    {l: "Testo", t: "Testo", k: "Text"},
                    {l: "Link immagine", t: "text", k: "img"},
                ]},
                {n: "Aggiungi Pubblicità", f: API.addAd, values: [
                    {l: "Testo", t: "text", k: "txt"},
                    {l: "Link immagine", t: "text", k: "img"},
                    {l: "Link sito", t: "text", k: "link"},
                ]},
            ];
            setActions(a);
		};
        if(!actions)
		    getActions().catch((err) => console.log(err));
	}, [actions]);

    return(
        !actions ? <div align="center"><Spinner animation="border" /></div> :
        <Container>
            {actions.map(a =>
                <Row className='justify-content-center'>
                    <MyModal show={!!a.show} hide={() => setActions(false)} action={a}/>
                    <Button className="cardStyle m-3 w-75" size="lg" variant="dark" onClick={() => selectAction(a.n)}>
                        {a.n}
                    </Button>
                </Row>
            )}
        </Container>
    );
}

export default AreaRiservata;