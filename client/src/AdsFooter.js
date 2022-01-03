import { useEffect, useState } from "react";
import { Card, Carousel, Col, Row, Spinner } from "react-bootstrap";
import  API from "./API";

function AdsFooter(props) {

    const [ads, setAds] = useState(false);
    useEffect(() => {
		const getAds = async () => {
            const a = await API.getAds();
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