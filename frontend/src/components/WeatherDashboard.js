import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import WindRose from "./WindRose";
import WeatherCard from "./WeatherCard";
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
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Plane className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Flugwetter EDUZ
              </h1>
              <p className="text-gray-600">
                {weatherData.airportName} - {weatherData.icaoCode}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-900">
              {currentTime.toLocaleTimeString('de-DE')}
            </div>
            <div className="text-sm text-gray-600">
              {currentTime.toLocaleDateString('de-DE')}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Current Conditions */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Wind className="mr-3 h-6 w-6" />
            Aktuelle Wetterbedingungen
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Wind Rose */}
            <Card className="p-6 hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-xl">
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

            {/* Weather Overview */}
            <div className="space-y-4">
              <WeatherCard
                title="Wind"
                icon={<Wind className="h-6 w-6" />}
                value={`${weatherData.wind.speed} kt`}
                subtitle={`aus ${weatherData.wind.direction}° (${weatherData.wind.directionName})`}
                trend={weatherData.wind.gusts > weatherData.wind.speed ? "Böen bis " + weatherData.wind.gusts + " kt" : "Gleichmäßig"}
                color="blue"
              />
              
              <WeatherCard
                title="Temperatur"
                icon={<Thermometer className="h-6 w-6" />}
                value={`${weatherData.temperature.current}°C`}
                subtitle={`Gefühlt ${weatherData.temperature.feelsLike}°C`}
                trend={`Taupunkt: ${weatherData.temperature.dewPoint}°C`}
                color="orange"
              />
            </div>
          </div>
        </section>

        {/* Additional Weather Data */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Weitere Messwerte
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <WeatherCard
              title="Luftfeuchtigkeit"
              icon={<Droplets className="h-6 w-6" />}
              value={`${weatherData.humidity}%`}
              subtitle="Relative Feuchtigkeit"
              color="teal"
            />
            
            <WeatherCard
              title="Luftdruck"
              icon={<Gauge className="h-6 w-6" />}
              value={`${weatherData.pressure.qnh} hPa`}
              subtitle={`QNH: ${weatherData.pressure.qnh} hPa`}
              trend={`QFE: ${weatherData.pressure.qfe} hPa`}
              color="purple"
            />
            
            <WeatherCard
              title="Sichtweite"
              icon={<Eye className="h-6 w-6" />}
              value={`${weatherData.visibility.distance} km`}
              subtitle={weatherData.visibility.condition}
              color="green"
            />
            
            <WeatherCard
              title="Wolken"
              icon={<Cloud className="h-6 w-6" />}
              value={weatherData.clouds.coverage}
              subtitle={`Basis: ${weatherData.clouds.base} ft`}
              trend={weatherData.clouds.type}
              color="gray"
            />
          </div>
        </section>

        {/* Status Indicators */}
        <section>
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Flugbetrieb Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Badge 
                  variant={weatherData.status.vfr ? "default" : "secondary"}
                  className={`px-4 py-2 text-sm font-medium ${
                    weatherData.status.vfr 
                      ? "bg-green-100 text-green-800 border-green-200" 
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {weatherData.status.vfr ? "VFR" : "IFR"}
                </Badge>
                <Badge 
                  variant={weatherData.status.crosswindOk ? "default" : "destructive"}
                  className={`px-4 py-2 text-sm font-medium ${
                    weatherData.status.crosswindOk 
                      ? "bg-blue-100 text-blue-800 border-blue-200" 
                      : "bg-red-100 text-red-800 border-red-200"
                  }`}
                >
                  {weatherData.status.crosswindOk ? "Seitenwind OK" : "Seitenwind Warnung"}
                </Badge>
                <Badge 
                  variant="outline"
                  className="px-4 py-2 text-sm font-medium bg-yellow-50 text-yellow-800 border-yellow-200"
                >
                  Runway: {weatherData.runway.active}
                </Badge>
              </div>
              <div className="mt-4 text-sm text-gray-600">
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