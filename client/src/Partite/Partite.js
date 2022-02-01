import { useState, useEffect } from "react";
import { Card, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { SquadraRow } from "../SquadraElements";
import  API from "../API";

function Partite(props) {
    const [partite, setPartite] = useState(false);
    useEffect(() => {
		const getPartite = async () => {
            const p = await API.getPartite();
            setPartite(p);
		};
		getPartite().catch((err) => console.log(err));
	}, []);
    return(
        !partite ? <div align="center"><Spinner animation="border" /></div> :
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