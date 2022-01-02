import { useState, useEffect } from "react";
import { Card, Spinner, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";

function Partita(props) {
    const [classifica, setClassifica] = useState(false);
    useEffect(() => {
		const getClassifica = async () => {
            const p = [
                {id: 1, Squadra: "Napoli", PT: 21, PG: 10, V: 6, P: 3, S:1, GF: 20, GS: 7},
                {id: 2, Squadra: "Juve", PT: 14, PG: 10, V: 4, P: 2, S:4, GF: 16, GS: 5},
                {id: 3, Squadra: "FredSSC", PT: 11, PG: 10, V: 3, P: 2, S:5, GF: 12, GS: 8},
                {id: 4, Squadra: "Mah", PT: 10, PG: 10, V: 3, P: 1, S:6, GF: 10, GS: 10},
                {id: 5, Squadra: "OH", PT: 3, PG: 10, V: 1, P: 0, S:9, GF: 8, GS: 14},]//await API.getClassifica();
                setClassifica(p);
		};
		getClassifica().catch((err) => console.log(err));
	}, []);
    return( !classifica ? <Spinner/> : 
        <Container>
            <Card className="cardStyle mt-4 mb-3">
                <Table responsive className="m-1" striped style={{fontSize: 18, color: "#97fb57"}}>
                    <thead>
                        <tr align="center">
                            {Object.keys(classifica[0]).slice(1).map(k => <th>{k}</th>)}
                        </tr>
                    </thead>
                    <tbody> {classifica.map(e => <tr>
                        {Object.values(e).slice(1).map((v, i) => <td>
                            {!i ? <Link className="squadra" to={"Squadra/"+e.id}><u>{v}</u></Link> : v}
                        </td>)
                    }</tr>)} </tbody>
                </Table>
            </Card>
        </Container>
    );
}

export default Partita;