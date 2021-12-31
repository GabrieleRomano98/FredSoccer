import { useState, useEffect } from "react";
import { Card, Spinner, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";

const cardStyle = {color: "#97fb57", backgroundColor: "#151515", "box-shadow": "0 4px 8px 0 rgba(0, 0, 0, 0.7), 0 6px 20px 0 rgba(0, 0, 0, 0.5)"}

function Partita(props) {
    const [classifica, setClassifica] = useState(false);
    useEffect(() => {
		const getClassifica = async () => {
            const p = [
                {Squadra: "Napoli", PT: 21, PG: 10, V: 6, P: 3, S:1, GF: 20, GS: 7},
                {Squadra: "Juve", PT: 14, PG: 10, V: 4, P: 2, S:4, GF: 16, GS: 5},
                {Squadra: "FredSSC", PT: 11, PG: 10, V: 3, P: 2, S:5, GF: 12, GS: 8},
                {Squadra: "Mah", PT: 10, PG: 10, V: 3, P: 1, S:6, GF: 10, GS: 10},
                {Squadra: "OH", PT: 3, PG: 10, V: 1, P: 0, S:9, GF: 8, GS: 14},]//await API.getClassifica();
                setClassifica(p);
		};
		getClassifica().catch((err) => console.log(err));
	}, []);
    return( !classifica ? <Spinner/> : 
        <Container>
            <Card style={cardStyle} className="mt-4 mb-3">
                <Table responsive className="m-1" striped style={{fontSize: 18, color: "#97fb57"}}>
                    <thead>
                        <tr align="center">
                            {Object.keys(classifica[0]).map(k => <th>{k}</th>)}
                        </tr>
                    </thead>
                    <tbody> {classifica.map(e => <tr>
                        {Object.values(e).map((v, i) => <td>
                            {!i ? <Link className="squadra" to={"Squadra/"+v}><u>{v}</u></Link> : v}
                        </td>)
                    }</tr>)} </tbody>
                </Table>
            </Card>
        </Container>
    );
}

export default Partita;