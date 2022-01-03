import { useState, useEffect } from "react";
import { Spinner, Button } from "react-bootstrap";
import { Container, Row } from "react-bootstrap";
import { Statistiche, Partite, Giocatori } from "./SquadraElements";
import  API from "./API";

const b1Style = {color: "#97fb57", background: "#151515", "box-shadow": "0 4px 8px 0 rgba(0, 0, 0, 0.7), 0 6px 20px 0 rgba(0, 0, 0, 0.5)"}
const b2Style = {color: "black", background: "#f6f2f2", "box-shadow": "0 4px 8px 0 rgba(0, 0, 0, 0.7), 0 6px 20px 0 rgba(0, 0, 0, 0.5)"}

function Squadra(props) {

    const [squadra, setSquadra] = useState(false);
    const [partite, setPartite] = useState(false);
    const [giocatori, setGiocatori] = useState(false);
    const [selected, setSelected] = useState(0);
    const options = ["Statistiche", "Partite", "Giocatori"];
    useEffect(() => {
		const getSquadra = async () => {
            const s =  await API.getSquadra(props.id);
            setSquadra(s);
            const p = await API.getPartiteSquadra(props.id);
            setPartite(p)
            const g = await API.getGiocatori(props.id);
            setGiocatori(g);
		};
		getSquadra().catch((err) => console.log(err));
	}, []);

    return (
        !(squadra && partite && giocatori) ? <Spinner/> : 
        <Container>
            <h1 className="ml-2 mb-3 nomeSquadra">{squadra.Nome}</h1>
            <Row style= {{justifyContent:"space-around"}}>{options.map((e, i) => 
                <Button className="m-2 mb-4" variant="dark" style={selected !== i ? b1Style : b2Style} onClick={() => setSelected(i)}>
                    {e}
                </Button>
            )}</Row>
            {selected === 0 ? <Statistiche squadra={squadra}/> :
            selected === 1 ? <Partite partite={partite} /> :
            selected === 2 && <Giocatori giocatori={giocatori}/>}
        </Container>
    );
}

export default Squadra;