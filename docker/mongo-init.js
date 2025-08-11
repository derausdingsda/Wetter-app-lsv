// MongoDB initialization script
db = db.getSiblingDB('weather_db');

// Create collections
db.createCollection('weather_data');
db.createCollection('stations');

// Insert sample data (optional)
db.weather_data.insertOne({
  station: 'EDUZ',
  timestamp: new Date(),
  temperature: 25,
  humidity: 65,
  pressure: 1013,
  wind_speed: 12,
  wind_direction: 240,
  visibility: 10000
});

// Create indexes for better performance
db.weather_data.createIndex({ "station": 1, "timestamp": -1 });
db.stations.createIndex({ "icao": 1 });

print('Database initialized successfully');