import { useState, useEffect } from "react";
import { Button, Card, Carousel, Spinner } from "react-bootstrap";
import { Container, Row, Col } from "react-bootstrap";
import { AiOutlineDelete, AiOutlineEdit, AiFillMobile } from "react-icons/ai";
import { Link } from "react-router-dom";
import { MyModal } from "./MyModal";
import { updatePartita, putSquadra } from "./actions";
import  API from "./API";

const PartitaRow = props => (<>
    <Link to={"/Squadra/" + props.id} className="squadra"><u><h5>{props.t}</h5></u></Link><h3>{props.g}</h3>
</>);

const BaseCard = props => (
    <Card className="cardStyle mt-4 mb-3">
        <Row className="mt-2">
            <Col align="center"><props.title/></Col>
        </Row>
        <Row className="mt-1 mb-4">
            <Col align="center" xs="5"><props.left/></Col>
            <Col align="center"><props.center/></Col>
            <Col align="center" xs="5"><props.right/></Col>
        </Row>
    </Card>
);

const cardElements = [
    {t: "Reti", k: "reti", m: true},
];
let idSquadra;
let id;

function Partita(props) {

    const [partita, setPartita] = useState(false);
    const [actions, setActions] = useState(false);
    const [dirty, setDirty] = useState(false);
    const getID = () => id;

    const selectAction = (n, open = true) => setActions(actions => actions.map(a => a.n === n ? {...a, show: open} : a));

    const editF = (Id, k, s) => {id = Id; idSquadra = partita[s].id; selectAction("Modifica " + k);};
    const deleteF = (Id, k, s) => {id = Id; idSquadra = partita[s].id; selectAction("Elimina Informazioni");};

    useEffect(() => {
		const getPartita = async () => {
            const p =  await API.getPartita(props.id);console.log(p);
            setPartita(p);
		};
        const getActions = async () => {
            if(!actions) {
                const a = await updatePartita(props.id, g => g.Squadra === idSquadra, a => 1, getID);
                setActions(a);
            }
		};
        getActions().catch((err) => console.log(err));
		getPartita().catch((err) => console.log(err));
	}, [actions, dirty]);
    
    return( !partita ? <div align="center"><Spinner animation="border" /></div> :
        <Container className="justify-content-center">
            {!!actions && actions.map(a => <MyModal show={!!a.show} hide={() => selectAction(a.n, false)} action={a}/>)}
            <Row className="justify-content-center">
                <span onClick = {() => selectAction("Modifica Partita")}><AiOutlineEdit size="2em" className="mr-3"/></span>
                <span onClick = {() => selectAction("Elimina Partita")}><AiOutlineDelete size="2em" className="mr-3"/></span>
            </Row>
            <BaseCard
                title={() => <><h6>{partita.date} {partita.time} </h6></>}
                left={() => <PartitaRow id={partita.s1.id} t={partita.s1.t} g={partita.s1.g} />}
                center = {() => <h1 className="mt-2">-</h1>}
                right = {() => <PartitaRow id={partita.s2.id} t={partita.s2.t} g={partita.s2.g} />}
            />
            <Row inline className="justify-content-center"> 
                <Button className="cardStyle m-1" size="lg" variant="dark" onClick={() => selectAction("Aggiorna Risultato")}>
                    Modifica Risultato
                </Button>
                <Button className="cardStyle m-1" size="lg" variant="dark" onClick={() => {setDirty(d => !d); API.updatePartita(props.id, {g_s1: null, g_s2:  null});}}>
                    Rimuovi Risultato
                </Button>
            </Row>
            <Carousel controls={false}>
                {partita.s1.g !== null && cardElements.map(e =>
                    <Carousel.Item>
                        <BaseCard
                            title = {() => <h5>{e.t}</h5>}
                            left = {() => <>{partita.s1[e.k].map(r => <h6>
                                {r.k}{e.c && ":"} {r.v}{e.m && "'"} {e.i && <AiFillMobile color={r.y? "yellow" : "red"}/>}
                                <span onClick={() => editF(r.id, e.t, "s1")}><AiOutlineEdit size="1.4em" className="ml-1"/></span>
                                <span onClick={() => deleteF(r.id, e.t, "s1")}><AiOutlineDelete size="1.4em" className="ml-2"/></span>
                            </h6>)}</>}
                            center = {() => <div style={{height: '100%', width: 1, backgroundColor: '#97fb57'}}></div>}
                            right = {() => <>{partita.s2[e.k].map(r => <h6>
                                {r.k} {r.v}{e.m && "'"} {e.i && <AiFillMobile color={r.y? "yellow" : "red"}/>}
                                <span onClick={() => editF(r.id, e.t, "s2")}><AiOutlineEdit size="1.4em" className="ml-1"/></span>
                                <span onClick={() => deleteF(r.id, e.t, "s2")}><AiOutlineDelete size="1.4em" className="ml-2"/></span>
                            </h6>)}</>}
                        />
                    </Carousel.Item>
                )}
            </Carousel>
            
            
            
        </Container>
    );
}

export default Partita;