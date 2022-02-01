import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

const SquadraRow = props => (
    <Row>
        <Col xs="8"><div className="m-2">{props.s.t}</div></Col>
        <Col xs="4"><div className="m-2">{props.s.g}</div></Col>
    </Row>
);

const Statistiche = props => (
    <Card className="mb-4 cardStyle">
        <h3 className="ml-4 mb-3">Statistiche</h3>
        <Row>
            <Col className="ml-5">
                <h5 >Punti: {props.squadra.PT}</h5>
                <h5>Partite: {props.squadra.PG}</h5>
                <h5>Goal fatti: {props.squadra.GF}</h5>
                <h5>Goal subiti: {props.squadra.GS}</h5>
            </Col>
            <Col>
                <h5>Vittorie: {props.squadra.V}</h5>
                <h5>Pareggi: {props.squadra.P}</h5>
                <h5>Sconfitte: {props.squadra.S}</h5>
            </Col>
        </Row>
    </Card>
);

const Partite = props => props.partite.map(p => 
    <Link to={'/Partita/'+p.id} id={p.id} className="mb-4"><Card className="mb-4 cardStyle"> <Row>
        <Col xs="7">
            <SquadraRow s={p.s1} />
            <SquadraRow s={p.s2} />
        </Col>
        <Col xs="1">
        <div style={{height: '100%', width: 1, backgroundColor: '#97fb57'}}></div>
        </Col>
        <Col align="center">
            <div className="mt-3">{p.date}</div>
            <div>{p.time}</div>
        </Col>
    </Row> </Card> </Link>
);

const Giocatori = props => {

    const fun = (id, action) => {props.setGiocatore(id); props.selectAction(action);}

    return (<div align="center">
        {props.logged && <Button className="m-2 mb-3 cardStyle" variant="dark" onClick={() => props.selectAction("Aggiungi Giocatore")}>
            Aggiungi giocatore
        </Button>}
        <div style={{display: "grid", gridTemplateColumns: "140px 140px", columnGap: "10px", justifyContent: "space-around"}}>
            {props.giocatori.map(g =>
                <Card className="mb-4 cardStyle">
                    <div style={{textAlign: "center"}}><img className="mt-2" style={{display: "block",  marginLeft: "auto", marginRight: "auto", maxHeight: "80px", maxWidth: "80px"}} src={g.i} /></div>
                    <h4 className="ml-2 mr-2 mb-2">{g.nome}</h4>
                    <h6 className="ml-2">Goal segnati: {g.g}</h6>
                    <h6 className="ml-2">Media voti: {g.m}</h6>
                    <h6 className="ml-2">Presenze: {g.p}</h6>
                    {props.logged && <h6>
                        <span onClick = {() => fun(g.id, "Modifica Giocatore")}><AiOutlineEdit size="1.5em" className="mr-3"/></span>
                        <span onClick = {() => fun(g.id, "Elimina Giocatore")}><AiOutlineDelete size="1.5em" className="mr-3"/></span>
                    </h6>}
                </Card>
            )}
        </div>
    </div>
    );
}

export { SquadraRow, Statistiche, Partite, Giocatori }