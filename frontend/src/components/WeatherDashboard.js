import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import WindRose from "./WindRose";
import CombinedWeatherCard from "./CombinedWeatherCard";
import ThemeToggle from "./ThemeToggle";
import { mockWeatherData } from "../services/mockData";
import { 
  Plane, 
  Wind, 
  Thermometer, 
  Droplets, 
  Gauge, 
  Eye,
  Cloud,
  Navigation
} from "lucide-react";

const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Simulate real-time data updates
    const fetchData = () => {
      setWeatherData(mockWeatherData.getCurrentWeather());
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds

    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timeInterval);
    };
  }, []);

  if (!weatherData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  // Format date as DD.MM.YYYY
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // Prepare combined weather data
  const windTemperatureData = [
    {
      icon: <Wind className="h-5 w-5" />,
      label: "Wind",
      value: `${weatherData.wind.speed} kt`,
      subtitle: `aus ${weatherData.wind.direction}° (${weatherData.wind.directionName})`,
      trend: weatherData.wind.gusts > weatherData.wind.speed ? `Böen bis ${weatherData.wind.gusts} kt` : "Gleichmäßig",
      color: "blue"
    },
    {
      icon: <Thermometer className="h-5 w-5" />,
      label: "Temperatur",
      value: `${weatherData.temperature.current}°C`,
      subtitle: `Gefühlt ${weatherData.temperature.feelsLike}°C`,
      trend: `Taupunkt: ${weatherData.temperature.dewPoint}°C`,
      color: "orange"
    }
  ];

  const humidityPressureData = [
    {
      icon: <Droplets className="h-5 w-5" />,
      label: "Luftfeuchtigkeit",
      value: `${weatherData.humidity}%`,
      subtitle: "Relative Feuchtigkeit",
      color: "teal"
    },
    {
      icon: <Gauge className="h-5 w-5" />,
      label: "Luftdruck",
      value: `${weatherData.pressure.qnh} hPa`,
      subtitle: `QNH: ${weatherData.pressure.qnh} hPa`,
      trend: `QFE: ${weatherData.pressure.qfe} hPa`,
      color: "purple"
    }
  ];

  const visibilityCloudsData = [
    {
      icon: <Eye className="h-5 w-5" />,
      label: "Sichtweite",
      value: `${weatherData.visibility.distance} km`,
      subtitle: weatherData.visibility.condition,
      color: "green"
    },
    {
      icon: <Cloud className="h-5 w-5" />,
      label: "Wolken",
      value: weatherData.clouds.coverage,
      subtitle: weatherData.clouds.base ? `Basis: ${weatherData.clouds.base} ft` : "Keine Wolken",
      trend: weatherData.clouds.type,
      color: "gray"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300 p-4">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700 p-6 transition-colors duration-300">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg transition-colors duration-300">
              <Plane className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Flugwetter EDUZ
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {weatherData.airportName} - {weatherData.icaoCode}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {currentTime.toLocaleTimeString('en-GB', { timeZone: 'UTC', hour12: false })} UTC
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {formatDate(currentTime)}
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Current Conditions */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Wind className="mr-3 h-6 w-6" />
            Aktuelle Wetterbedingungen
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Wind Rose */}
            <Card className="p-6 hover:shadow-lg transition-all duration-300 dark:bg-slate-800 dark:border-slate-700">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-xl dark:text-white">
                  <Navigation className="mr-2 h-5 w-5" />
                  Windrose
                </CardTitle>
              </CardHeader>
              <CardContent>
                <WindRose 
                  windData={weatherData.wind}
                  size={300}
                />
              </CardContent>
            </Card>

            {/* Weather Overview - Only Windrose */}
            <div className="space-y-4">
              {/* This space is now used for the windrose only */}
            </div>
          </div>
        </section>

        {/* Additional Weather Data */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Weitere Messwerte
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <CombinedWeatherCard
              title="Luftfeuchtigkeit & Luftdruck"
              data={humidityPressureData}
            />
            
            <CombinedWeatherCard
              title="Sichtweite & Wolken"
              data={visibilityCloudsData}
            />
            
            <CombinedWeatherCard
              title="Wind & Temperatur"
              data={windTemperatureData}
            />
          </div>
        </section>

        {/* Status Indicators */}
        <section>
          <Card className="p-6 dark:bg-slate-800 dark:border-slate-700 transition-colors duration-300">
            <CardHeader>
              <CardTitle className="dark:text-white">Flugbetrieb Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Badge 
                  variant={weatherData.status.vfr ? "default" : "secondary"}
                  className={`px-4 py-2 text-sm font-medium ${
                    weatherData.status.vfr 
                      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700" 
                      : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {weatherData.status.vfr ? "VFR" : "IFR"}
                </Badge>
                <Badge 
                  variant={weatherData.status.crosswindOk ? "default" : "destructive"}
                  className={`px-4 py-2 text-sm font-medium ${
                    weatherData.status.crosswindOk 
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700" 
                      : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700"
                  }`}
                >
                  {weatherData.status.crosswindOk ? "Seitenwind OK" : "Seitenwind Warnung"}
                </Badge>
                <Badge 
                  variant="outline"
                  className="px-4 py-2 text-sm font-medium bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700"
                >
                  Runway: {weatherData.runway.active}
                </Badge>
              </div>
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                Letzte Aktualisierung: {new Date(weatherData.lastUpdate).toLocaleString('de-DE')}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default WeatherDashboard;