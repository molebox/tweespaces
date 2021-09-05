const { dim, italic, bold, red, green } = require('chalk');
const Spinner = require('cli-spinner').Spinner;
const merge = require('lodash.merge');
const emoji = require('node-emoji');
const axios = require('axios');

module.exports = async ({ scheduled, live, query, username }) => {
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

  const spinner = new Spinner(dim('Searching for spaces.....'));

  spinner.start();

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

  const spaceInfo = data.map(
    ({ participant_count, scheduled_start, title, creator_id }) => {
      return {
        creator_id,
        participants: participant_count,
        start: scheduled_start,
        title
      };
    }
  );

  const creatorInfo = includes.users.map(
    ({ name, username, description, id }) => {
      return {
        id,
        creatorHandle: username,
        creator: name,
        description
      };
    }
  );

  const space = merge(spaceInfo, creatorInfo);

  function twitterHandleLink(handle) {
    return `https://twitter.com/${handle}`;
  }
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
      bold('Handle: ', twitterHandleLink(creatorHandle))
    );
    console.log(
      green(
        bold(
          '-----------------------------------------------------------------------------'
        )
      )
    );
  });
};
