import { useState, useEffect } from "react";
import { Card, Carousel } from "react-bootstrap";
import { Redirect, Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { AiFillMobile } from "react-icons/ai"

const cardStyle = {color: "#97fb57", backgroundColor: "#151515", "box-shadow": "0 4px 8px 0 rgba(0, 0, 0, 0.7), 0 6px 20px 0 rgba(0, 0, 0, 0.5)"}

const BaseCard = props => (
    <Card style={cardStyle} className="mt-4 mb-3">
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
                    reti:[{p: "Gabri", m: 5}, {p: "Fred", m: 15}], 
                    cartellini: [{p:"Fred", m: 5, y: true}, {p:"Zack", m: 10, y: true}],
                    pagelle: [{p: "Gabri", v: 10}, {p: "Stefano", v: 4}, {p: "Enzo", v: 9}, {p: "Zack", v: -3}, {p: "Fred", v: 2}]
                },
                s2: {
                    t: "Juventuuus", g: 0, 
                    reti: [{p: "Guido", m: 4}, {p: "Stefano", m: 20}, {p: "Davide", m: 57}, {p: "Gianni", m: 6.5}], 
                    cartellini: [{p:"Guido", m: 30, y: false}],
                    pagelle: [{p: "Guido", v: 6}, {p: "Davide", v: 6.5}, {p: "Enzo", v: 9}, {p: "Gianni", v: 7}, {p: "Andrea", v: 6}]
                },
                date: '05/06/2021', time: '15:30', id: 0}//await API.getPartita(props.id);
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
                <Carousel.Item>
                    <BaseCard
                        title = {() => <h5>Reti</h5>}
                        left = {() => <>{partita.s1.reti.map(r => <h6>{r.p} {r.m}'</h6>)}</>}
                        center = {() => <div style={{height: '100%', width: 1, backgroundColor: '#97fb57'}}></div>}
                        right = {() => <>{partita.s2.reti.map(r => <h6>{r.p} {r.m}'</h6>)}</>}
                    />
                </Carousel.Item>
                <Carousel.Item>
                    <BaseCard
                        title = {() => <h5>Cartellini</h5>}
                        left = {() => <>{partita.s1.cartellini.map(r => <h6>{r.p} {r.m}' <AiFillMobile color={r.y? "yellow" : "red"}/></h6>)}</>}
                        center = {() => <div style={{height: '100%', width: 1, backgroundColor: '#97fb57'}}></div>}
                        right = {() => <>{partita.s2.cartellini.map(r => <h6>{r.p} {r.m}' <AiFillMobile color={r.y? "yellow" : "red"}/></h6>)}</>}
                    />
                </Carousel.Item>
                <Carousel.Item>
                    <BaseCard
                        title = {() => <h5>Pagelle</h5>}
                        left = {() => <>{partita.s1.pagelle.map(r => <h6>{r.p}: {r.v}</h6>)}</>}
                        center = {() => <div style={{height: '100%', width: 1, backgroundColor: '#97fb57'}}></div>}
                        right = {() => <>{partita.s2.pagelle.map(r => <h6>{r.p}: {r.v}</h6>)}</>}
                    />
                </Carousel.Item>
            </Carousel>
            
            
            
        </Container>
    );
}

export default Partita;