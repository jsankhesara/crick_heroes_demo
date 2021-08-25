const TournamentModel = require('../../models/tournament.model');
var resHandlerService = require('../../services/resHandler.service');
const config = require('../../utils/config');

exports.updatePosition = async function (req, res) {
    let team_bowl = req.body.team_id_bowl;
    let team_bat = req.body.team_id_bat;
    let runs = req.body.runs;
    let ballPlayed = req.body.ballPlayed / 6;
    let minBowling = (runs / 6 + config.bowl_played) / 2;
    let quotient = Math.floor(minBowling / 6);
    let remainder = minBowling % 6;
    let convertOver = parseFloat(quotient + "." + remainder);

    if (req.body.selectedTeamBat) {
        let fetchBattingTeamData = await TournamentModel.findOne({ _id: team_bat });
        fetchBattingTeamData.totalRunMade = fetchBattingTeamData.totalRunMade + runs;
        fetchBattingTeamData.totalOversPlayed = fetchBattingTeamData.totalOversPlayed + ballPlayed;
        fetchBattingTeamData.totalOversBowled = fetchBattingTeamData.totalOversBowled + convertOver;
        fetchBattingTeamData.won = fetchBattingTeamData.won + 1;
        fetchBattingTeamData.points = fetchBattingTeamData.points + 2;
        fetchBattingTeamData.matchCount = fetchBattingTeamData.matchCount + 1;
        fetchBattingTeamData.save();

        let fetchBowlingTeamData = await TournamentModel.findOne({ _id: team_bowl });
        fetchBowlingTeamData.totalRunGive = fetchBowlingTeamData.totalRunGive + runs;
        fetchBowlingTeamData.totalOversBowled = fetchBowlingTeamData.totalOversBowled + ballPlayed;
        fetchBowlingTeamData.totalOversPlayed = fetchBowlingTeamData.totalOversPlayed + convertOver;
        fetchBowlingTeamData.lost = fetchBowlingTeamData.lost + 1;
        fetchBowlingTeamData.matchCount = fetchBowlingTeamData.matchCount + 1;
        fetchBowlingTeamData.save();

        var runsNumber = config.run_number;
        let finalObj = {}

        for (var i = 1; i <= runsNumber; i++) {
            let fetchBattingTeamDataLoop = await TournamentModel.findOne({ _id: team_bat });
            let fetchBowlingTeamDataLoop = await TournamentModel.findOne({ _id: team_bowl });

            TournamentModel.updateOne({ _id: team_bat }, { $set: { "totalRunGive": fetchBattingTeamDataLoop.totalRunGive + i } }).exec();
            TournamentModel.updateOne({ _id: team_bowl }, { $set: { "totalRunMade": fetchBowlingTeamDataLoop.totalRunMade + i } }).exec();

            let fetchBattingTeamDataLoopAfterRun = await TournamentModel.findOne({ _id: team_bat });
            let fetchBowlingTeamDataLoopAfterRun = await TournamentModel.findOne({ _id: team_bowl });

            TournamentModel.updateOne({ _id: team_bat }, {
                $set: {
                    "nrr": (fetchBattingTeamDataLoopAfterRun.totalRunMade / fetchBattingTeamDataLoopAfterRun.totalOversPlayed) -
                        (fetchBattingTeamDataLoopAfterRun.totalRunGive / fetchBattingTeamDataLoopAfterRun.totalOversBowled)
                }
            }).exec();

            TournamentModel.updateOne({ _id: team_bowl }, {
                $set: {
                    "nrr": (fetchBowlingTeamDataLoopAfterRun.totalRunMade / fetchBowlingTeamDataLoopAfterRun.totalOversPlayed) -
                        (fetchBowlingTeamDataLoopAfterRun.totalRunGive / fetchBowlingTeamDataLoopAfterRun.totalOversBowled)
                }
            }).exec();

            let fetchBattingTeamDataUpdate = await TournamentModel.findOne({ _id: team_bat });
            let fetchBowlingTeamDataUpdate = await TournamentModel.findOne({ _id: team_bowl });

            if (fetchBattingTeamDataUpdate.nrr > fetchBowlingTeamDataUpdate.nrr) {
                finalObj.runEnd = i;
                finalObj.runStart = 1;
                finalObj.battingTeamNrr = fetchBattingTeamDataUpdate;
                finalObj.bowlingTeamNrr = fetchBowlingTeamDataUpdate;
                resHandlerService.handleResult(res, finalObj, "Position updated");
                break;
            }
        }
    } else {
        let fetchBattingTeamData = await TournamentModel.findOne({ _id: team_bat });
        fetchBattingTeamData.totalRunMade = fetchBattingTeamData.totalRunMade + runs;
        fetchBattingTeamData.totalOversPlayed = fetchBattingTeamData.totalOversPlayed + ballPlayed;
        fetchBattingTeamData.totalRunGive = fetchBattingTeamData.totalRunGive + runs + 1;
        fetchBattingTeamData.lost = fetchBattingTeamData.lost + 1;
        fetchBattingTeamData.matchCount = fetchBattingTeamData.matchCount + 1;
        fetchBattingTeamData.save();

        let fetchBowlingTeamData = await TournamentModel.findOne({ _id: team_bowl });
        fetchBowlingTeamData.totalRunGive = fetchBowlingTeamData.totalRunGive + runs;
        fetchBowlingTeamData.totalOversBowled = fetchBowlingTeamData.totalOversBowled + ballPlayed;
        fetchBowlingTeamData.totalRunMade = fetchBowlingTeamData.totalRunMade + runs + 1;
        fetchBowlingTeamData.won = fetchBowlingTeamData.won + 1;
        fetchBowlingTeamData.points = fetchBowlingTeamData.points + 2;
        fetchBowlingTeamData.matchCount = fetchBowlingTeamData.matchCount + 1;
        fetchBowlingTeamData.save();

        var overNumber = config.bowl_played;
        let finalObj = {}

        for (var i = 1; i <= overNumber; i++) {
            let fetchBattingTeamDataLoop = await TournamentModel.findOne({ _id: team_bat });
            let fetchBowlingTeamDataLoop = await TournamentModel.findOne({ _id: team_bowl });

            TournamentModel.updateOne({ _id: team_bat }, { $set: { "totalOversPlayed": fetchBattingTeamDataLoop.totalRunGive + i } }).exec();
            TournamentModel.updateOne({ _id: team_bowl }, { $set: { "totalOversBowled": fetchBowlingTeamDataLoop.totalRunMade + i } }).exec();

            let fetchBattingTeamDataLoopAfterRun = await TournamentModel.findOne({ _id: team_bat });
            let fetchBowlingTeamDataLoopAfterRun = await TournamentModel.findOne({ _id: team_bowl });

            TournamentModel.updateOne({ _id: team_bat }, {
                $set: {
                    "nrr": (fetchBattingTeamDataLoopAfterRun.totalRunMade / fetchBattingTeamDataLoopAfterRun.totalOversPlayed) -
                        (fetchBattingTeamDataLoopAfterRun.totalRunGive / fetchBattingTeamDataLoopAfterRun.totalOversBowled)
                }
            }).exec();

            TournamentModel.updateOne({ _id: team_bowl }, {
                $set: {
                    "nrr": (fetchBowlingTeamDataLoopAfterRun.totalRunMade / fetchBowlingTeamDataLoopAfterRun.totalOversPlayed) -
                        (fetchBowlingTeamDataLoopAfterRun.totalRunGive / fetchBowlingTeamDataLoopAfterRun.totalOversBowled)
                }
            }).exec();

            let fetchBattingTeamDataUpdate = await TournamentModel.findOne({ _id: team_bat });
            let fetchBowlingTeamDataUpdate = await TournamentModel.findOne({ _id: team_bowl });

            if (fetchBowlingTeamDataUpdate.nrr > fetchBattingTeamDataUpdate.nrr) {
                let quotientBowl = Math.floor(i / 6);
                let remainderBowl = i % 6;
                let convertOverBowl = parseFloat(quotientBowl + "." + remainderBowl);
                finalObj.overEnd = convertOverBowl
                finalObj.overStart = 1;
                finalObj.battingTeamNrr = fetchBattingTeamDataUpdate;
                finalObj.bowlingTeamNrr = fetchBowlingTeamDataUpdate;
                resHandlerService.handleResult(res, finalObj, "Position updated");
                break;
            }
        }
    }
}

exports.getTournamentTeamsList = async function (req, res) {
    let fetchTeamData = await TournamentModel.find();
    resHandlerService.handleResult(res, fetchTeamData, "Tournament Team list");
}