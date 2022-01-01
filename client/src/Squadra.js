import { useState, useEffect } from "react";
import { Card, Spinner, Button, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

const b1Style = {color: "#97fb57", background: "#151515", "box-shadow": "0 4px 8px 0 rgba(0, 0, 0, 0.7), 0 6px 20px 0 rgba(0, 0, 0, 0.5)"}
const b2Style = {color: "black", background: "#f6f2f2", "box-shadow": "0 4px 8px 0 rgba(0, 0, 0, 0.7), 0 6px 20px 0 rgba(0, 0, 0, 0.5)"}

const SquadraRow = props => <Row>
    <Col xs="8"><div className="m-2">{props.s.t}</div></Col>
    <Col xs="4"><div className="m-2">{props.s.g}</div></Col>
</Row>

function Squadra(props) {
    const [squadra, setSquadra] = useState(false);
    const [partite, setPartite] = useState(false);
    const [giocatori, setGiocatori] = useState(false);
    const [selected, setSelected] = useState(0);
    const options = ["Statistiche", "Partite", "Giocatori"];
    useEffect(() => {
		const getSquadra = async () => {
            const s = {nome: "Napoli", pt: 21, pg: 10, v: 6, p: 3, s: 1, gf: 20, gs: 6}//await API.getSquadra(props.nome);
            setSquadra(s);
            const p = [
                {s1: {t: "Napoli", g: 3}, s2: {t: "Juventus", g: 0}, date:'05/06/2021', time: "15:30", id: 0},
                {s1: {t: "Empoli", g: 1}, s2: {t: "Napoi", g: 1}, date: '26/12/2021', time: "18:45", id: 1},
                {s1: {t: "Napoli", g: 2}, s2: {t: "Arsenal", g: 0}, date: '16/12/2021', time: '16:00', id: 2},
                {s1: {t: "Roma", g: 2}, s2: {t: "Napoli", g: 1}, date: '31/03/2022', time: '17:30', id: 3},
            ] //await API.getPartite(props.nome);
            setPartite(p)
            const g = [
                {id: 0, nome: "Gabri", m: 10.0, p: 120, g: 15},
                {id: 1, nome: "Fred", m: 5.5, p: 120, g: 0},
                {id: 2, nome: "Davide", m: 6.0, p: 120, g: 8},
                {id: 3, nome: "Guido", m: 7.0, p: 120, g: 7}
            ]; //await API.getGiocatori(props.nome);
            setGiocatori(g);
		};
		getSquadra().catch((err) => console.log(err));
	}, []);
    return (
        !(squadra && partite && giocatori) ? <Spinner/> : 
        <Container>
            <h1 className="ml-2 mb-3 nomeSquadra">{squadra.nome}</h1>
            <Row style= {{justifyContent:"space-around"}}>{options.map((e, i) => 
                    <Button className="m-2 mb-4" variant="dark" style={selected !== i ? b1Style : b2Style} onClick={() => setSelected(i)}>
                        {e}
                    </Button>
                )}</Row>
            {selected === 0 && <Card className="cardStyle">
                <h3 className="ml-4 mb-3">Statistiche</h3>
                <Row>
                    <Col className="ml-5 mb-5">
                        <h5 >Punti: {squadra.pt}</h5>
                        <h5>Partite: {squadra.pg}</h5>
                        <h5 className="">Goal fatti: {squadra.gf}</h5>
                        <h5 className="">Goal subiti: {squadra.gs}</h5>
                    </Col>
                    <Col>
                        <h5>Vittorie: {squadra.v}</h5>
                        <h5>Pareggi: {squadra.p}</h5>
                        <h5>Sconfitte: {squadra.s}</h5>
                    </Col>
                </Row>
            </Card>}

            {selected === 1 && partite.map(p => 
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
            )}

            <div style={{display: "grid", gridTemplateColumns: "140px 140px", columnGap: "10px", justifyContent: "space-around"}}>{selected === 2 && giocatori.map(g => 
                <Link to={'/Giocatore/'+g.id} id={g.id}><Card className="mb-4 cardStyle">
                    <h4 className="m-2">{g.nome}</h4>
                    <h6 className="ml-2">Goal segnati: {g.g}</h6>
                    <h6 className="ml-2">Media voti: {g.m}</h6>
                    <h6 className="ml-2">Presenze: {g.p}</h6>
                    </Card> </Link>
            )}</div>
        </Container>
    );
}

export default Squadra;