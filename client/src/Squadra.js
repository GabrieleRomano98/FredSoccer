import { useState, useEffect } from "react";
import { Spinner, Button } from "react-bootstrap";
import { Container, Row } from "react-bootstrap";
import { Statistiche, Partite, Giocatori } from "./SquadraElements";

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
                {id: 1, nome: "Fred", m: 5.5, p: 120, g: 0, i: "https://cdn.enjore.com/wl/torneicaravaggio_it/img/player/q/2907-P2A7PONr19LfNo4F9trv.jpg"},
                {id: 2, nome: "Davide", m: 6.0, p: 120, g: 8, i: "https://lh3.googleusercontent.com/mdHKjo8isByb96kj3PBvJybXVte9A5AwhvNP1FCIVrbhGaNqBd1oWWf60Y-nSEBXyt8nLfNff901ZiB4N4Nw=w1960-h3112-rw"},
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
            {selected === 0 ? <Statistiche squadra={squadra}/> :
            selected === 1 ? <Partite partite={partite} /> :
            selected === 2 && <Giocatori giocatori={giocatori}/>}
        </Container>
    );
}

export default Squadra;