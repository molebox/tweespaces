#!/usr/bin/env node

/**
 * tweespaces
 * Lookup Twitter spaces by keyword
 *
 * @author Rich Haines <https://richardhaines.dev>
 */

const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');
const findSpace = require('./utils/find-space');
const findSpaceByHost = require('./utils/find-space-by-host');

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

(async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);

	if (flags.host) {
		await findSpaceByHost({ username: flags.host })
	}

	if (flags.live) {
		await findSpace({ scheduled: false, live: true, query: flags.query });
	} else if (flags.scheduled) {
		await findSpace({ scheduled: true, live: false, query: flags.query });
	}

	debug && log(flags);
})();
