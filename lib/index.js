'use strict';

const fs = require('fs');
const _ = require('lodash');

console.time('entire process');

function rankedData(args) {
  console.time('Read in data');
  var dataString = getDataString(args.filename);
  var headers =  _.first(dataString);
  var recordStrings = _.rest(dataString);
  console.timeEnd('Read in data');

  var records = getRecords(recordStrings, headers);

  console.time("getGroupedIncidents");
  var groupedIncidents = getGroupedIncidents(records, args.header);
  console.timeEnd("getGroupedIncidents");

  console.time("getGroupedIncidentCounts");
  var groupedIncidentCounts = getGroupedIncidentCounts(groupedIncidents);
  console.timeEnd("getGroupedIncidentCounts");

  console.time("formatCounts");
  var formattedCounts = formatCounts(groupedIncidentCounts);
  console.timeEnd("formatCounts");
  return formattedCounts.sort(function(a,b) {
     return b[1] - a[1];
   }).slice(0,5);
}

function getRecords(recordStrings, headers) {
  console.time('getRecords');
  var incidents = _.map(recordStrings, function(line) {
    var incident = {};
    _.each(headers, function(head, index){
      incident[head] = line[index];
    });
    return incident;
  });
  console.timeEnd('getRecords');
  return incidents;
}

function getDataString(filename) {
  return fs.readFileSync(filename)
  .toString()
  .split("\r\n")
  .map(row => row.split(","));
}

function getGroupedIncidents(records, header) {
  return _.groupBy(records, function(record) {
    return record[header];
  });
}

function getGroupedIncidentCounts(groupedIncidents) {
  var incidentCounts = {};
  _.each(Object.keys(groupedIncidents), function(key){
    incidentCounts[key] = groupedIncidents[key].length;
  });
  return incidentCounts;
}

function formatCounts(groupedIncidentCounts) {
  var formattedCounts = [];

  for(var categoryGrouping in groupedIncidentCounts) {
    formattedCounts.push([categoryGrouping, groupedIncidentCounts[categoryGrouping]]);
  }
  return formattedCounts;
}

console.log("Most Crime by neigborhood: ");
console.log(rankedData({filename:'./data/crime.csv', header: "NEIGHBORHOOD_ID"}));

console.log("Most accidents by corner: ");
console.log(rankedData({filename:'./data/traffic-accidents.csv', header: "INCIDENT_ADDRESS"}));



console.timeEnd('entire process');
