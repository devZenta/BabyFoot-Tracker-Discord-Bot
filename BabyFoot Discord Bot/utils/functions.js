const Player = require('../models/player');

const fetchEloForPlayers = async (usernames) => {
    try {
        const players = await Player.findAll({
            where: {
                username: usernames
            },
            attributes: ['username', 'elo']
        });
        return players.map(player => ({ username: player.username, elo: player.elo }));
    } catch (error) {
        console.error('Error fetching elo for players:', error);
        return [];
    }
};

const calculateTeamEloTotal = (team) => {
    return team.reduce((acc, player) => acc + player.elo, 0); 
};

const generatePlayerPairs = (players) => {
    const pairs = [];
    for (let i = 0; i < players.length; i++) {
        for (let j = i + 1; j < players.length; j++) {
            pairs.push([players[i], players[j]]);
        }
    }
    return pairs;
};

const generateTeamCombinations = (pairs, numTeams) => {
    const combinations = [];

    const getCombinations = (arr, size) => {
        const result = [];
        const combine = (start, current) => {
            if (current.length === size) {
                result.push(current);
                return;
            }
            for (let i = start; i < arr.length; i++) {
                combine(i + 1, [...current, arr[i]]);
            }
        };
        combine(0, []);
        return result;
    };

    const allCombinations = getCombinations(pairs, numTeams);

    for (let combination of allCombinations) {
        const usedPlayers = new Set();
        let validCombination = true;

        for (let pair of combination) {
            if (usedPlayers.has(pair[0].username) || usedPlayers.has(pair[1].username)) {
                validCombination = false;
                break;
            }
            usedPlayers.add(pair[0].username);
            usedPlayers.add(pair[1].username);
        }

        if (validCombination) {
            combinations.push(combination);
        }
    }

    return combinations;
};

const balanceTeamsByEloBruteForce = async (selectedPlayers) => {
    const playerEloData = await fetchEloForPlayers(selectedPlayers);

    const pairs = generatePlayerPairs(playerEloData);

    const numTeams = selectedPlayers.length / 2;

    const teamCombinations = generateTeamCombinations(pairs, numTeams);

    let bestCombination = [];
    let bestEloDifference = Infinity; 

    for (let combination of teamCombinations) {
        const teamEloTotals = combination.map(team => calculateTeamEloTotal(team));

        const eloDifference = Math.max(...teamEloTotals) - Math.min(...teamEloTotals);

        if (eloDifference < bestEloDifference) {
            bestEloDifference = eloDifference;
            bestCombination = combination;
        }
    }

    return { bestCombination, bestEloDifference };
};

const fetchUsernamesFromDatabase = async () => {
    try {
        const players = await Player.findAll({
            attributes: ['username']
        });
        return players.map(player => player.username);
    } catch (error) {
        console.error('Error fetching usernames:', error);
        return [];
    }
};

async function checkPlayerExists(playerId) {
    const player = await Player.findOne({
        where: {
            id: playerId
        }
    });
    if (player) {
        return true;
    } else {
        return false;
    }
}

async function updatePlayerUsername(playerId, newUsername) {
    const player = await Player.findOne({
        where: {
            id: playerId
        }
    });
    if (player) {
        player.username = newUsername;
        await player.save();
        return true;
    } else {
        return false;
    }
}

async function updatePlayerElo(playerId, newElo) {
    const player = await Player.findOne({
        where: {
            id: playerId
        }
    });
    if (player) {
        player.elo = newElo;
        await player.save();
        return true;
    } else {
        return false;
    }
}

async function updatePlayerGoalsConceded(playerId, newGoalsConceded) {
    const player = await Player.findOne({
        where: {
            id: playerId
        }
    });
    if (player) {
        player.goalsConceded = newGoalsConceded;
        await player.save();
        return true;
    } else {
        return false;
    }
}

async function updatePlayerGoalsScored(playerId, newGoalsScored) {
    const player = await Player.findOne({
        where: {
            id: playerId
        }
    });
    if (player) {
        player.goalsScored = newGoalsScored;
        await player.save();
        return true;
    } else {
        return false;
    }
}

async function updatePlayerWins(playerId, newWins) {
    const player = await Player.findOne({
        where: {
            id: playerId
        }
    });
    if (player) {
        player.wins = newWins;
        await player.save();
        return true;
    } else {
        return false;
    }
}

async function updatePlayerLosses(playerId, newLosses) {
    const player = await Player.findOne({
        where: {
            id: playerId
        }
    });
    if (player) {
        player.losses = newLosses;
        await player.save();
        return true;
    } else {
        return false;
    }
}

async function updatePlayerGamesPlayed(playerId, newGamesPlayed) {
    const player = await Player.findOne({
        where: {
            id: playerId
        }
    });
    if (player) {
        player.games = newGamesPlayed;
        await player.save();
        return true;
    } else {
        return false;
    }
}

module.exports = {
    fetchUsernamesFromDatabase,
    balanceTeamsByEloBruteForce,
    checkPlayerExists,
    updatePlayerUsername,
    updatePlayerElo,
    updatePlayerGoalsConceded,
    updatePlayerGoalsScored,
    updatePlayerWins,
    updatePlayerLosses,
    updatePlayerGamesPlayed
};