require 'pry'
require 'CSV'


def getDataString(filename)
  return CSV.readlines(filename)
end

def rankedData(args)
  dataString = getDataString(args[:filename])
  headers =  dataString.first
  recordStrings = dataString[1..-1]

  records = getRecords(recordStrings, headers); # => this will produce our array of objects

  groupedIncidents = getGroupedIncidents(records, args[:header]);

  groupedIncidentCounts = getGroupedIncidentCounts(groupedIncidents);
  formattedCounts = formatCounts(groupedIncidentCounts);

  formattedCounts.sort_by do |obj|
    obj[1]
  end.reverse[0..5]
end

def getRecords(recordStrings, headers)
  incidents = recordStrings.map do |line|
    incident = Hash.new()
    headers.each_with_index do |head, index|
      incident[head] = line[index]
    end
    incident
  end
  incidents
end


def getGroupedIncidents(records, header)
  records.group_by do |record|
    record[header]
  end
end

def getGroupedIncidentCounts(groupedIncidents)
  incidentCounts = Hash.new()
  groupedIncidents.each do |key, value|
    incidentCounts[key] = groupedIncidents[key].length
  end
  incidentCounts
end

def formatCounts(groupedIncidentCounts)
  formattedCounts = []
  groupedIncidentCounts.map do |key, value|
    [key, value]
  end
end

print "Most Crime by neigborhood: "
puts ""
print rankedData({filename:'./data/crime.csv', header: "NEIGHBORHOOD_ID"})
puts ""

print "Most accidents by corner: "
puts ""
print rankedData({filename:'./data/traffic-accidents.csv', header: "INCIDENT_ADDRESS"})
puts ""
