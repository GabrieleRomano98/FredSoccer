import { useEffect, useState } from "react";
import { Card, Carousel, Col, Row, Spinner } from "react-bootstrap";

function AdsFooter(props) {

    const [ads, setAds] = useState(false);
    useEffect(() => {
		const getAds = async () => {
            const a = [
                {t: "Questa è la pubblicità dei campi caravaggio", i: "https://www.caravaggiosv.com/wp-content/uploads/elementor/thumbs/calcio-caravaggio-4-oyb3qklv3s0ww1wg4wfswgdbp1hn74nrm2lut5fycs.jpg"},
                {t: "Questo invece è proprio Freddy", i: "https://cdn.enjore.com/wl/torneicaravaggio_it/img/player/q/2907-P2A7PONr19LfNo4F9trv.jpg"}
            ]//await API.getAds();
                setAds(a);
		};
		getAds().catch((err) => console.log(err));
	}, []);

    return (
        !ads ? <Spinner /> :
        <Carousel className="" controls={false} fade={true} indicators={false} interval={3000}>
            {ads.map(e =>
                !ads ? <Spinner /> :
                <Carousel.Item>
                    <Card className="m2 cardStyle"><Row>
                        <Col align="center"><img className="m-1" style={{height: "80px"}} src={e.i} /></Col>
                        <Col>{e.t}</Col>	
                    </Row></Card>
                </Carousel.Item>
            )}
		</Carousel>
    );
}

export default AdsFooter;