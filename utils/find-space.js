require('dotenv').config();
const { dim, italic, bold, red } = require('chalk');
const Spinner = require('cli-spinner').Spinner;
const fetch = require('node-fetch')
const merge = require('lodash.merge');
const emoji = require('node-emoji')



const SPACES_URL = 'https://api.twitter.com/2/spaces/search?query=';

module.exports = async ({
  scheduled,
  live,
  query
}) => {

  const state = scheduled ? 'scheduled' : live ? 'live' : 'live'

  const url = `${SPACES_URL}${query}&state=${state}&space.fields=participant_count,scheduled_start,title&expansions=creator_id&user.fields=name,description,username`;

  const spinner = new Spinner('Searching for spaces....');

  spinner.start(dim('Searching for spaces.....'));

  const response = await fetch(url, { 
    method: 'GET', 
    headers: {
      'Authorization': 'Bearer ' + process.env.BEARER, 
      'Content-Type': 'application/json'
    },
  });

  const result = await response.json();
  const hasResult = result.meta.result_count !== 0 ? true : false;

  spinner.stop(true);

  if (!hasResult) {
    if (query !== undefined && scheduled) {
      return console.log(emoji.get('scream'), ' ', bold('No results found! Try a different query or search for live spaces...'))
    } else if (query !== undefined && live) {
    return console.log(emoji.get('scream'), ' ', bold('No results found! Try a different query or search for scheduled spaces...'))
    } else if(query === undefined) {
      return console.log(emoji.get('scream'), ' ', bold('No results found! Try adding a query...'))
    }
    return console.log(emoji.get('scream'), ' ', bold('No results found!'))
  }

  const spaceInfo = result.data.map(({      
    participant_count,
    scheduled_start,
    title,
    creator_id
  }) => {
    return {
      creator_id,
      participants: participant_count,
      start: scheduled_start,
      title,
    };
  })

  const creatorInfo = result.includes.users.map(({      
    name,
    username,
    description,
    id
  }) => {
    return {
      id,
      creatorHandle: username,
      creator: name,
      description
    };
  })

  const spaces = merge(spaceInfo, creatorInfo)

  function twitterHandleLink(handle) {
    return `https://twitter.com/${handle}`
  }
  spaces.map(({title, creator, creatorHandle, start, description}) => {

    console.log(red(bold('-----------------------------------------------------------------------------')));
    console.log();
    console.log(emoji.get('rocket'), ' ', bold(title));
    console.log();
    console.log(emoji.get('calendar'), ' ', bold(new Date(start).toLocaleDateString('en-US')))
    console.log();
    console.log(emoji.get('timer_clock'), '  ', bold(new Date(start).toLocaleTimeString('en-US')), dim(italic(' (All times PTZ)')))
    console.log();
    console.log(emoji.get('question'), ' ', dim(description))
    console.log();
    console.log(emoji.get('writing_hand'), '  ', bold(creator))
    console.log()
    console.log(emoji.get('baby_chick'), ' ', dim(bold(twitterHandleLink(creatorHandle))))
    console.log();
  });

}