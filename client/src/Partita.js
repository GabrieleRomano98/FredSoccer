import { useState, useEffect } from "react";
import { Card, Carousel } from "react-bootstrap";
import { Container, Row, Col } from "react-bootstrap";
import { AiFillMobile } from "react-icons/ai";
import  API from "./API";

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

const cardElements = [{t: "Reti", k: "reti"}, {t: "Cartellini", k: "cartellini", i: true},{t: "Pagelle", k: "pagelle", c: true}];

function Partita(props) {

    const [partita, setPartita] = useState(false);
    useEffect(() => {
		const getPartita = async () => {
            const p =  await API.getPartita(props.id);
            setPartita(p);
		};
		getPartita().catch((err) => console.log(err));
	}, []);

    
    return( !partita ? <></> : 
        <Container>
            <BaseCard
                title={() => <>{partita.date} {partita.time}</>}
                left={() => <><h5>{partita.s1.t}</h5><h3>{partita.s1.g}</h3></>}
                center = {() => <h1 className="mt-2">-</h1>}
                right = {() => <><h5>{partita.s2.t}</h5><h3>{partita.s2.g}</h3></>}
            />
            <Carousel controls={false}>
                {cardElements.map(e =>
                    <Carousel.Item>
                        <BaseCard
                            title = {() => <h5>{e.t}</h5>}
                            left = {() => <>{partita.s1[e.k].map(r => <h6>{r.k}{e.c && ":"} {r.v}' {e.i && <AiFillMobile color={r.y? "yellow" : "red"}/>}</h6>)}</>}
                            center = {() => <div style={{height: '100%', width: 1, backgroundColor: '#97fb57'}}></div>}
                            right = {() => <>{partita.s2[e.k].map(r => <h6>{r.k} {r.v}' {e.i && <AiFillMobile color={r.y? "yellow" : "red"}/>}</h6>)}</>}
                        />
                    </Carousel.Item>
                )}
            </Carousel>
            
            
            
        </Container>
    );
}

export default Partita;