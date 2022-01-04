import { useState } from "react";
import { Button, Container, Row } from "react-bootstrap";
import MyModal from "./MyModal";

const ActionsS = [
    {n: "Aggiungi Partita", f: () => 1, values: [
        {l: "Squadra di casa", t: "select", k: "id_s1"},
        {l: "Squadra ospite", t: "select", k: "id_s2"},
        {l: "Data", t: "number", k: "Date"},
        {l: "Ora", t: "number", k: "Time"}
    ]},
    {n: "Aggiungi Squadra", f: () => 1, values: [
        {l: "Nome", t: "text", k: "Nome"},
        {l: "Link immagine", t: "text", k: "img"}
    ]},
    {n: "Aggiungi Notizia", f: () => 1, values: [

    ]},
    {n: "Aggiungi Pubblicità", f: () => 1, values: [
        
    ]},
];

function AreaRiservata() {
    const [actions, setActions] = useState(ActionsS);
    const selectAction = n => setActions(actions => actions.map(a => a.n === n ? {...a, show: true} : a)); 
    return(
        <Container>
            {actions.map(a =>
                <Row className='justify-content-center'>
                    <MyModal show={!!a.show} hide={() => setActions(ActionsS)} action={a}/>
                    <Button className="cardStyle m-3 w-75" size="lg" variant="dark" onClick={() => selectAction(a.n)}>
                        {a.n}
                    </Button>
                </Row>
            )}
        </Container>
    );
}

export default AreaRiservata;