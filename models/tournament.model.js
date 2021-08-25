const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autopopulate = require('mongoose-autopopulate');

var schemaOptions = {
    toCourseObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: { createdAt: 'create_date', updatedAt: 'last_updated' }
};

var TeamSchema = new Schema({
    position: { type: Number, default: 0 },
    teamName: { type: String, default: " " },
    matchCount: { type: Number, default: 0 },
    won: { type: Number, default: 0 },
    lost: { type: Number, default: 0 },
    nrr: { type: Number, default: 0 },
    totalRunMade: { type: Number, default: 0 },
    totalRunGive: { type: Number, default: 0 },
    totalOversPlayed: { type: Number, default: 0 },
    totalOversBowled: { type: Number, default: 0 },
    points: { type: Number, default: false },
}, schemaOptions);

TeamSchema.plugin(autopopulate);
TeamSchema.pre('save', function (next) { this.last_updated = new Date(); if (!this.isNew) { return next(); } next(); });

module.exports = mongoose.model('tournament', TeamSchema);