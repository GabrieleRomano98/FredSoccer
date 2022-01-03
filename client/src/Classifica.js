import { useState, useEffect } from "react";
import { Card, Spinner, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import  API from "./API";

function Partita(props) {
    const [classifica, setClassifica] = useState(false);
    useEffect(() => {
		const getClassifica = async () => {
            const p = await API.getClassifica();
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