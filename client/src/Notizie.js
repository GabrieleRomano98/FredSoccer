import { useState, useEffect } from "react";
import { Card, Container, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import API from "./API";

function Notizie(props) {
    const [notizie, setNotizie] = useState(false);
    useEffect(() => {
		const getNotizie = async () => {
            const n = await API.getNotizie();
                setNotizie(n);
		};
		getNotizie().catch((err) => console.log(err));
	}, []);
    return(
        !notizie ? <Spinner/> :
        <Container>
            {notizie.map(n =>
                <Link key={n.id} to={"/Articolo/"+n.id}>
                    <Card className="mt-3 cardStyle">
                        <h4 className="m-2"><u>{n.t}</u></h4>
                        <t align="right" className="mr-1">{n.data}</t>
                    </Card>
                </Link>
            )}
        </Container>
    );
}

export default Notizie;