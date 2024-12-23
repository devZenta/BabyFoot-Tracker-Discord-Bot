const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Player = sequelize.define('player', {
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        primaryKey: true,
    },
    username: Sequelize.STRING,
    elo: {
        type: Sequelize.INTEGER,
        defaultValue: 1500,
        allowNull: false,
    },
    wins: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    losses: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    games: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    goalsScored: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    goalsConceded: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
}, {
    getterMethods: {
        winrate() {
            return ((this.wins / (this.games || 1)) * 100).toFixed(2);
        },
        goalRatio() {
            return (this.goalsScored / (this.goalsConceded || 1)).toFixed(2);
        }
    }
});

module.exports = Player;