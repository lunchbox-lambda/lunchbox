import config from 'config';
import * as firmata from 'firmata';

/* eslint-disable-next-line no-new */
new firmata.Board(config.board.port, () => process.exit(0));
setTimeout(() => process.exit(1), 10000);
