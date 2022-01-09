import { useState, useEffect } from "react";
import { Button, Card, Carousel, Spinner } from "react-bootstrap";
import { Container, Row, Col } from "react-bootstrap";
import { AiFillMobile } from "react-icons/ai";
import { Link } from "react-router-dom";
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
    {t: "Cartellini", k: "cartellini", m: true, i: true},
    {t: "Pagelle", k: "pagelle", c: true}
];

function Partita(props) {

    const [partita, setPartita] = useState(false);
    useEffect(() => {
		const getPartita = async () => {
            const p =  await API.getPartita(props.id);
            setPartita(p);console.log(p);
		};
		getPartita().catch((err) => console.log(err));
	}, []);

    
    return( !partita ? <div align="center"><Spinner animation="border" /></div> :
        <Container className="justify-content-center">
            { !props.admin && <Link to = {"/Partita/admin/" + props.id}>
                <Button className="cardStyle m-3 w-75" size="lg" variant="dark">Gestisci partita</Button>
            </Link> }
            <BaseCard
                title={() => <h6>{partita.date} {partita.time}</h6>}
                left={() => <PartitaRow id={partita.s1.id} t={partita.s1.t} g={partita.s1.g} />}
                center = {() => <h1 className="mt-2">-</h1>}
                right = {() => <PartitaRow id={partita.s2.id} t={partita.s2.t} g={partita.s2.g} />}
            />
            <Carousel controls={false}>
                {partita.s1.g !== null && cardElements.map(e =>
                    <Carousel.Item>
                        <BaseCard
                            title = {() => <h5>{e.t}</h5>}
                            left = {() => <>{partita.s1[e.k].map(r => <h6>{r.k}{e.c && ":"} {r.v}{e.m && "'"} {e.i && <AiFillMobile color={r.y? "yellow" : "red"}/>}</h6>)}</>}
                            center = {() => <div style={{height: '100%', width: 1, backgroundColor: '#97fb57'}}></div>}
                            right = {() => <>{partita.s2[e.k].map(r => <h6>{r.k} {r.v}{e.m && "'"} {e.i && <AiFillMobile color={r.y? "yellow" : "red"}/>}</h6>)}</>}
                        />
                    </Carousel.Item>
                )}
            </Carousel>
            
            
            
        </Container>
    );
}

export default Partita;