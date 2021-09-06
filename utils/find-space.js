const { dim, italic, bold, red, green } = require('chalk');
const Spinner = require('cli-spinner').Spinner;
const merge = require('lodash.merge');
const emoji = require('node-emoji');
const axios = require('axios');
const utils = require('./util-functions')

module.exports = async ({ scheduled, live, query, username }) => {
  const spinner = new Spinner(red('Searching for spaces.....'));

  spinner.start();
  spinner.setSpinnerString('|/-\\');

  const state = scheduled ? 'scheduled' : live ? 'live' : 'live';

  const spaceResponse = await axios.post(
    `https://tweespaces-serverless-function.vercel.app/api/spaces`,
    {
      state,
      query,
      username
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  const data = spaceResponse.data.spaces.data;
  const meta = spaceResponse.data.spaces.meta;
  const includes = spaceResponse.data.spaces.includes;

  const hasResult = meta.result_count !== 0 ? true : false;

  spinner.stop(true);

  if (!hasResult) {
    if (query !== undefined && scheduled) {
      return console.log(
        emoji.get('scream'),
        ' ',
        bold(
          'No results found! Try a different query or search for live spaces...'
        )
      );
    } else if (query !== undefined && live) {
      return console.log(
        emoji.get('scream'),
        ' ',
        bold(
          'No results found! Try a different query or search for scheduled spaces...'
        )
      );
    } else if (query === undefined) {
      return console.log(
        emoji.get('scream'),
        ' ',
        bold('No results found! Try adding a query...')
      );
    }
    return console.log(emoji.get('scream'), ' ', bold('No results found!'));
  }

  const space = merge(utils.spaceInfo(data), utils.creatorInfo(includes.users));

  space.map(({ title, creator, creatorHandle, start, description }) => {
    const timingCheck = () => {
      if (start === undefined) {
        return console.log(
          emoji.get('timer_clock'),
          '  ',
          bold('Live now!')
        );
      }
      return console.log(
        emoji.get('timer_clock'),
        '  ',
        bold('Time: ', new Date(start).toLocaleTimeString('en-US')),
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
    timingCheck();
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
};
