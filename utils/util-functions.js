
function spaceInfo(data) {
    return data.map(
        ({ participant_count, scheduled_start, title, creator_id }) => {
            return {
                creator_id,
                participants: participant_count,
                start: scheduled_start,
                title
            };
        }
    );
}

function userSpaceInfo(data) {
    return data.map(
        ({ scheduled_start, title, creator_id }) => {
            return {
                creator_id,
                start: scheduled_start,
                title
            };
        }
    );
}

function creatorInfo(data) {
    return data.map(
        ({ name, username, description, id }) => {
            return {
                id,
                creatorHandle: username,
                creator: name,
                description
            };
        }
    );
}

function twitterHandleLink(handle) {
    return `https://twitter.com/${handle}`;
}

exports.spaceInfo = spaceInfo;
exports.userSpaceInfo = userSpaceInfo;
exports.creatorInfo = creatorInfo;
exports.twitterHandleLink = twitterHandleLink;