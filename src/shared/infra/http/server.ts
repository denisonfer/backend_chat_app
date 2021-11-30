import { serverHTTP } from '.';
import './websocket';

serverHTTP.listen(3000, () => console.log('✅ SERVER ON!'));
