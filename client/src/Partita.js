import { useState, useEffect } from "react";
import { Card, Carousel } from "react-bootstrap";
import { Container, Row, Col } from "react-bootstrap";
import { AiFillMobile } from "react-icons/ai"

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

function Partita(props) {

    const [partita, setPartita] = useState(false);
    useEffect(() => {
		const getPartita = async () => {
            const p = {
                s1: {
                    t: "Napoli", g: 4, 
                    reti:[{k: "Gabri", v: 5}, {k: "Fred", v: 15}], 
                    cartellini: [{k:"Fred", v: 5, y: true}, {k:"Zack", v: 10, y: true}],
                    pagelle: [{k: "Gabri", v: 10}, {k: "Stefano", v: 4}, {k: "Enzo", v: 9}, {k: "Zack", v: -3}, {k: "Fred", v: 2}]
                },
                s2: {
                    t: "Juventuuus", g: 0, 
                    reti: [{k: "Guido", v: 4}, {k: "Stefano", v: 20}, {k: "Davide", v: 57}, {k: "Gianni", v: 6.5}], 
                    cartellini: [{k:"Guido", v: 30, y: false}],
                    pagelle: [{k: "Guido", v: 6}, {k: "Davide", v: 6.5}, {k: "Enzo", v: 9}, {k: "Gianni", v: 7}, {k: "Andrea", v: 6}]
                },
                date: '05/06/2021', time: '15:30', id: 0}//await AkI.getkartita(kroks.id);
            setPartita(p);
		};
		getPartita().catch((err) => console.log(err));
	}, []);

    const cardElements = [{t: "Reti", k: "reti"}, {t: "Cartellini", k: "cartellini", i: true},{t: "Pagelle", k: "pagelle", c: true}]

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