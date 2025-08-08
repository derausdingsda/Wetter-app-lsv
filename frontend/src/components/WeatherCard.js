import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const WeatherCard = ({ 
  title, 
  icon, 
  value, 
  subtitle, 
  trend, 
  color = "blue" 
}) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
    teal: "bg-teal-50 text-teal-600 border-teal-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    green: "bg-green-50 text-green-600 border-green-200",
    gray: "bg-gray-50 text-gray-600 border-gray-200",
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <div className={`p-2 rounded-lg mr-3 ${colorClasses[color]}`}>
            {icon}
          </div>
          <span className="text-gray-800">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-gray-900">
            {value}
          </div>
          {subtitle && (
            <div className="text-sm text-gray-600">
              {subtitle}
            </div>
          )}
          {trend && (
            <div className="text-xs text-gray-500 font-medium">
              {trend}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;