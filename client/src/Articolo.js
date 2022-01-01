import { useEffect, useState } from "react";
import { Container, Spinner, Card } from "react-bootstrap";

function Articolo(props) {

    const [articolo, setArticolo] = useState(false);
    useEffect(() => {    
        const getNotizie = async () => {
            const a = {t: "È morto Fred", date: "05/06/2021",
                text: "Ci lascia Fred. \n\nBuon amico, pessimo atleta. Chi lo avrebbe mai detto che sarebbe diventato il più veloce dell'atletica virgiliano? Non io, e a quanto pare avevo ragione."}//await API.getArticolo(props.id);
                setArticolo(a);
        };
        getNotizie().catch((err) => console.log(err));
    }, []);
    
    return (
        !articolo ? <Spinner/> :
        <Container>
            <h1 className="ml-2 mb-3 nomeSquadra">{articolo.t}</h1>
            <Card className="mt-3 cardStyle">
                <t className="m-2 ml-3">{articolo.text}</t>
                <t className="mr-3 mb-1" align="right">{articolo.date}</t>
            </Card>
        </Container>
    );
}

export default Articolo;