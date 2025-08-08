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
    blue: "bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-700",
    orange: "bg-orange-50 dark:bg-orange-900 text-orange-600 dark:text-orange-300 border-orange-200 dark:border-orange-700",
    teal: "bg-teal-50 dark:bg-teal-900 text-teal-600 dark:text-teal-300 border-teal-200 dark:border-teal-700",
    purple: "bg-purple-50 dark:bg-purple-900 text-purple-600 dark:text-purple-300 border-purple-200 dark:border-purple-700",
    green: "bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300 border-green-200 dark:border-green-700",
    gray: "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600",
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 dark:bg-slate-800 dark:border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <div className={`p-2 rounded-lg mr-3 transition-colors duration-300 ${colorClasses[color]}`}>
            {icon}
          </div>
          <span className="text-gray-800 dark:text-white">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </div>
          {subtitle && (
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {subtitle}
            </div>
          )}
          {trend && (
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              {trend}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;