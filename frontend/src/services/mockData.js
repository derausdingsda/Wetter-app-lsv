// Mock weather data service for airport weather dashboard

const getRandomBetween = (min, max) => {
  return Math.random() * (max - min) + min;
};

const getWindDirectionName = (degrees) => {
  const directions = [
    { name: "Nord", min: 348.75, max: 11.25 },
    { name: "Nordnordost", min: 11.25, max: 33.75 },
    { name: "Nordost", min: 33.75, max: 56.25 },
    { name: "Ostnordost", min: 56.25, max: 78.75 },
    { name: "Ost", min: 78.75, max: 101.25 },
    { name: "Ostsüdost", min: 101.25, max: 123.75 },
    { name: "Südost", min: 123.75, max: 146.25 },
    { name: "Südsüdost", min: 146.25, max: 168.75 },
    { name: "Süd", min: 168.75, max: 191.25 },
    { name: "Südsüdwest", min: 191.25, max: 213.75 },
    { name: "Südwest", min: 213.75, max: 236.25 },
    { name: "Westsüdwest", min: 236.25, max: 258.75 },
    { name: "West", min: 258.75, max: 281.25 },
    { name: "Westnordwest", min: 281.25, max: 303.75 },
    { name: "Nordwest", min: 303.75, max: 326.25 },
    { name: "Nordnordwest", min: 326.25, max: 348.75 }
  ];

  for (const dir of directions) {
    if (degrees >= dir.min && degrees < dir.max) {
      return dir.name;
    }
  }
  return "Nord"; // Default fallback
};

const getBeaufortScale = (speedKnots) => {
  if (speedKnots < 1) return "0 - Windstille";
  if (speedKnots < 4) return "1 - Leiser Zug";
  if (speedKnots < 7) return "2 - Leichte Brise";
  if (speedKnots < 11) return "3 - Schwache Brise";
  if (speedKnots < 17) return "4 - Mäßige Brise";
  if (speedKnots < 22) return "5 - Frische Brise";
  if (speedKnots < 28) return "6 - Starker Wind";
  if (speedKnots < 34) return "7 - Steifer Wind";
  if (speedKnots < 41) return "8 - Stürmischer Wind";
  return "9+ - Sturm";
};

const getActiveRunway = (windDirection) => {
  // Runway 07-25: 070° - 250°
  // Calculate which runway end provides better headwind
  const runway07Heading = 70;
  const runway25Heading = 250;
  
  // Calculate angle differences (headwind component)
  const diff07 = Math.abs(windDirection - runway07Heading);
  const diff25 = Math.abs(windDirection - runway25Heading);
  
  // Handle circular nature of degrees
  const normalizedDiff07 = diff07 > 180 ? 360 - diff07 : diff07;
  const normalizedDiff25 = diff25 > 180 ? 360 - diff25 : diff25;
  
  // Choose runway with smallest angle difference (best headwind)
  return normalizedDiff07 < normalizedDiff25 ? "07" : "25";
};

const getRunwayHeading = (windDirection) => {
  // Return the heading of the active runway
  const activeRunway = getActiveRunway(windDirection);
  return activeRunway === "07" ? 70 : 250;
};

const getVisibilityCondition = (distance) => {
  if (distance >= 10) return "Ausgezeichnet";
  if (distance >= 5) return "Sehr gut";
  if (distance >= 3) return "Gut";
  if (distance >= 1.5) return "Mäßig";
  if (distance >= 0.8) return "Schlecht";
  return "Sehr schlecht";
};

const getCloudCoverage = (coverage) => {
  if (coverage === "SKC") return "Wolkenlos";
  if (coverage === "FEW") return "Gering bewölkt";
  if (coverage === "SCT") return "Aufgelockert";
  if (coverage === "BKN") return "Überwiegend bewölkt";
  if (coverage === "OVC") return "Bedeckt";
  return coverage;
};

const mockWeatherData = {
  getCurrentWeather: () => {
    // Base values that change slightly over time
    const baseWind = {
      direction: 240 + Math.sin(Date.now() / 300000) * 30, // Slowly varying wind direction
      speed: 8 + Math.sin(Date.now() / 200000) * 4, // Wind speed 4-12 kt
    };

    const windDirection = Math.max(0, Math.min(360, baseWind.direction));
    const windSpeed = Math.max(0, Math.round(baseWind.speed));
    const windGusts = windSpeed > 6 ? windSpeed + Math.round(getRandomBetween(2, 6)) : windSpeed;

    // Temperature varies throughout day
    const hour = new Date().getHours();
    const baseTemp = 15 + Math.sin((hour - 6) * Math.PI / 12) * 10; // Temperature curve
    const temperature = Math.round(baseTemp + getRandomBetween(-2, 2));

    // Other weather parameters
    const humidity = Math.round(60 + Math.sin(Date.now() / 400000) * 20);
    const pressure = Math.round(1013 + Math.sin(Date.now() / 600000) * 15);
    const visibility = Math.round((8 + Math.sin(Date.now() / 500000) * 3) * 10) / 10;

    // Cloud conditions
    const cloudTypes = ["SKC", "FEW", "SCT", "BKN"];
    const randomCloudIndex = Math.floor(Date.now() / 900000) % cloudTypes.length;
    const cloudCoverage = cloudTypes[randomCloudIndex];
    
    return {
      airportName: "Zerbst/Anhalt",
      icaoCode: "EDUZ",
      lastUpdate: new Date().toISOString(),
      
      wind: {
        direction: Math.round(windDirection),
        directionName: getWindDirectionName(windDirection),
        speed: windSpeed,
        gusts: windGusts,
        beaufortScale: getBeaufortScale(windSpeed)
      },
      
      temperature: {
        current: temperature,
        feelsLike: temperature + Math.round(getRandomBetween(-2, 2)),
        dewPoint: temperature - Math.round(getRandomBetween(5, 15))
      },
      
      humidity: humidity,
      
      pressure: {
        qnh: pressure,
        qfe: pressure - 3 // Simplified calculation
      },
      
      visibility: {
        distance: visibility,
        condition: getVisibilityCondition(visibility)
      },
      
      clouds: {
        coverage: getCloudCoverage(cloudCoverage),
        base: cloudCoverage === "SKC" ? null : Math.round(1500 + getRandomBetween(0, 2000)),
        type: cloudCoverage === "SKC" ? "Keine" : "Cumulus"
      },
      
      status: {
        vfr: visibility >= 5 && cloudCoverage !== "OVC",
        crosswindOk: windSpeed < 15,
      },
      
      runway: {
        active: getActiveRunway(windDirection),
        crosswind: Math.abs(Math.sin((windDirection - getRunwayHeading(windDirection)) * Math.PI / 180) * windSpeed)
      }
    };
  },

  // Simulate historical data for trends
  getHistoricalData: (hours = 24) => {
    const data = [];
    const now = new Date();
    
    for (let i = hours; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hour = timestamp.getHours();
      
      // Simulate daily temperature pattern
      const baseTemp = 15 + Math.sin((hour - 6) * Math.PI / 12) * 8;
      const windDir = 240 + Math.sin(timestamp.getTime() / 300000) * 30;
      const windSpd = 8 + Math.sin(timestamp.getTime() / 200000) * 4;
      
      data.push({
        timestamp: timestamp.toISOString(),
        temperature: Math.round(baseTemp + getRandomBetween(-1, 1)),
        windDirection: Math.max(0, Math.min(360, windDir)),
        windSpeed: Math.max(0, Math.round(windSpd)),
        pressure: Math.round(1013 + Math.sin(timestamp.getTime() / 600000) * 10),
        humidity: Math.round(65 + Math.sin(timestamp.getTime() / 400000) * 15)
      });
    }
    
    return data;
  }
};

export { mockWeatherData };