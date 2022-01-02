import { Button, Image, Row, Col} from 'react-bootstrap'
import AdsFooter from "./AdsFooter";
import { Link } from 'react-router-dom';

function HomePage(props) {
    return (<>
        <div class="wrapper">
          <h1 className="m-2">Fred Soccer</h1>
          <Image/>
        </div> 
		      <AdsFooter className="footer"/>  
        </>)
}

export default HomePage;