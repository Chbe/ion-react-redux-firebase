export const prepareAlertForBustResult = (players, bustData, completedGame = {}) => {
    let instructions;
    const { wordDefintions, prevPlayerUid } = bustData;
    const prevDisplayName = players
        .find(player => player.uid === prevPlayerUid)
        .displayName;

    if (completedGame.winner) {
        instructions = wordDefintions.success
            ? `${prevDisplayName} got a mark and you won the game!`
            : instructions = `You got a mark and ${prevDisplayName} won the game!`;
    } else {
        instructions = wordDefintions.success
            ? `${prevDisplayName} got a mark and you will start the new round`
            : instructions = `You got a mark and ${prevDisplayName} will start the new round`;
    }

    return {
        title: wordDefintions.success
            ? `"${wordDefintions.word}" is a word`
            : `"${wordDefintions.word}" is not a word`,
        subHeader: wordDefintions.success
            ? `${wordDefintions.word}: ${wordDefintions.definition}`
            : wordDefintions.message,
        instructions,
        buttons: [`${wordDefintions.success ? 'I knew it!' : 'Darn it...'}`]
    };
}

export const prepareAlertForTimesUp = (players, completedGame = {}) => {
    const winner = completedGame.winner
        ? players
            .find(player => player.uid === completedGame.winner)
            .displayName
        : null;
    return {
        title: `Time's up!`,
        subHeader: `Try to bluff next time`,
        instructions: `${winner
            ? `${winner} wins the game!`
            : `You got a mark, better luck next round`}`,
        buttons: [`I'll be faster`]
    };
}

export const prepareResultAlert = (players, completedGame = {}) => {
    const winner = completedGame.winner
        ? players
            .find(player => player.uid === completedGame.winner)
            .displayName
        : null;
    return {
        title: `You're not even trying!`,
        subHeader: `You know you can try bluffing?`,
        instructions: `${winner
            ? `${winner} wins the game!`
            : `Well that's a mark for you, better luck next round`}`,
        buttons: [`Alright`]
    };
}