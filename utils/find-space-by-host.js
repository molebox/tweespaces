const { dim, italic, bold, red, green } = require('chalk');
var Spinner = require('cli-spinner').Spinner;
const merge = require('lodash.merge');
const emoji = require('node-emoji');
const axios = require('axios');
const utils = require('./util-functions')

module.exports = async ({ username }) => {
    const spinner = new Spinner(red('Searching for hosts spaces.....'));

    spinner.start();
    spinner.setSpinnerString('|/-\\');

    const userResponse = await axios.post(
        `https://tweespaces-serverless-function.vercel.app/api/space-by-user`,
        {
            username
        },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    const data = userResponse.data.spaces.data;
    const meta = userResponse.data.spaces.meta;
    const includes = userResponse.data.spaces.includes;

    const hasResult = meta.result_count !== 0 ? true : false;

    spinner.stop(true);

    if (!hasResult) {
        return console.log(emoji.get('scream'), ' ', bold(`This person hasn't scheduled any Twitter spaces yet.`));
    }

    const space = merge(utils.userSpaceInfo(data), utils.creatorInfo(includes.users));

    space.map(({ title, creator, creatorHandle, start, description }) => {
        const scheduledFor = () => {
            return console.log(
                emoji.get('timer_clock'),
                '  ',
                bold('Sheduled for: ', new Date(start).toLocaleTimeString('en-US')),
                dim(italic(' (All times localized)')),
                emoji.get('sunglasses')
            );
        };

        const dateCheck = () => {
            if (start === undefined) {
                return null;
            }
            return console.log(
                emoji.get('calendar'),
                ' ',
                bold('Date: ', new Date(start).toLocaleDateString('en-US'))
            );
        };

        console.log();
        console.log();
        console.log(
            red(
                bold(
                    '-----------------------------------------------------------------------------'
                )
            )
        );
        console.log(red(bold('Space details')));
        console.log();
        console.log(emoji.get('rocket'), ' ', bold('Title: ', title));
        console.log();
        dateCheck();
        console.log();
        scheduledFor();
        console.log(
            green(
                bold(
                    '-----------------------------------------------------------------------------'
                )
            )
        );
        console.log(green(bold('Host details')));
        console.log();
        console.log(emoji.get('writing_hand'), '  ', bold('Name: ', creator));
        console.log();
        console.log(emoji.get('question'), ' ', bold('Bio: ', description));
        console.log();
        console.log(
            emoji.get('baby_chick'),
            ' ',
            bold('Handle: ', utils.twitterHandleLink(creatorHandle))
        );
        console.log(
            green(
                bold(
                    '-----------------------------------------------------------------------------'
                )
            )
        );
        console.log();
        console.log();
    });
}