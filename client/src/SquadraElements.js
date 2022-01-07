import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

const SquadraRow = props => (
    <Row>
        <Col xs="8"><div className="m-2">{props.s.t}</div></Col>
        <Col xs="4"><div className="m-2">{props.s.g}</div></Col>
    </Row>
);

const Statistiche = props => (
    <Card className="cardStyle">
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
    <Link to={'/Partita/'+p.id} id={p.id}><Card className="mb-4 cardStyle"> <Row>
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

const Giocatori = props => (
    <div style={{display: "grid", gridTemplateColumns: "140px 140px", columnGap: "10px", justifyContent: "space-around"}}>
        {props.giocatori.map(g => <Link to={'/Giocatore/'+g.id} id={g.id}>
            <Card className="mb-4 cardStyle">
                <div style={{textAlign: "center"}}><img className="mt-2" style={{display: "block",  marginLeft: "auto", marginRight: "auto", maxHeight: "80px", maxWidth: "80px"}} src={g.i} /></div>
                <h4 className="ml-2 mr-2 mb-2">{g.nome}</h4>
                <h6 className="ml-2">Goal segnati: {g.g}</h6>
                <h6 className="ml-2">Media voti: {g.m}</h6>
                <h6 className="ml-2">Presenze: {g.p}</h6>
            </Card>
        </Link> )}
    </div>
);

export { SquadraRow, Statistiche, Partite, Giocatori }