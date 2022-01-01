import { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

const SquadraRow = props => <Row style= {{justifyContent:"space-between"}}>
    <Col xs="8" className="ml-3" style={{paddingLeft: 0, paddingRight: 0}}><div className="m-2">{props.s.t}</div></Col>
    <Col style={{paddingLeft: 0, paddingRight: 0}}><div className="m-2">{props.s.g}</div></Col>
</Row>

function Partite(props) {
    const [partite, setPartite] = useState([]);
    useEffect(() => {
		const getPartite = async () => {
            const p = [{s1: {t: "Napoli", g: 2}, s2: {t: "Juventuuus", g: 10}, date: '05/06/2021', time: '15:30', id: 0},
            {s1: {t: "Napoli", g: 2}, s2: {t: "Juventus", g: 10}, date: '05/06/2021', time: '15:30', id: 1},
            {s1: {t: "Empoli", g: 2}, s2: {t: "Torino", g: 10}, date: '05/06/2021', time: '15:30', id:2},
            {s1: {t: "Empoli", g: 2}, s2: {t: "Torino", g: 10}, date: '05/06/2021', time: '15:30', id:3},
            {s1: {t: "Empoli", g: 2}, s2: {t: "Torino", g: 10}, date: '05/06/2021', time: '15:30', id:4},
            {s1: {t: "Empoli", g: 2}, s2: {t: "Torino", g: 10}, date: '05/06/2021', time: '15:30', id:5},
            {s1: {t: "Empoli", g: 2}, s2: {t: "Torino", g: 10}, date: '05/06/2021', time: '15:30', id:6},
            {s1: {t: "Empoli", g: 2}, s2: {t: "Torino", g: 10}, date: '05/06/2021', time: '15:30', id:7},
            {s1: {t: "Empoli", g: 2}, s2: {t: "Torino", g: 10}, date: '05/06/2021', time: '15:30', id:8},
            {s1: {t: "Empoli", g: 2}, s2: {t: "Torino", g: 10}, date: '05/06/2021', time: '15:30', id:9},
            {s1: {t: "Empoli", g: 2}, s2: {t: "Torino", g: 10}, date: '05/06/2021', time: '15:30', id:10}]//await API.getPartite();
            setPartite(p);
		};
		getPartite().catch((err) => console.log(err));
	}, []);
    return(
        <Container fluid>
            {partite.map(p => 
                    <Link to={'Partita/'+p.id} id={p.id}><Card className="cardStyle mb-4"> <Row>
                        <Col xs="6">
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
        </Container>
    );
}

export default Partite;