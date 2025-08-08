import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const CombinedWeatherCard = ({ 
  title, 
  data = [] // Array of { icon, label, value, subtitle, trend, color }
}) => {
  const getColorClasses = (color) => {
    const colorClasses = {
      blue: "bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-700",
      orange: "bg-orange-50 dark:bg-orange-900 text-orange-600 dark:text-orange-300 border-orange-200 dark:border-orange-700",
      teal: "bg-teal-50 dark:bg-teal-900 text-teal-600 dark:text-teal-300 border-teal-200 dark:border-teal-700",
      purple: "bg-purple-50 dark:bg-purple-900 text-purple-600 dark:text-purple-300 border-purple-200 dark:border-purple-700",
      green: "bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300 border-green-200 dark:border-green-700",
      gray: "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600",
    };
    return colorClasses[color] || colorClasses.blue;
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 dark:bg-slate-800 dark:border-slate-700">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg text-gray-800 dark:text-white">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-start space-x-4 p-3 rounded-lg bg-gray-50 dark:bg-slate-700/50">
              <div className={`p-2 rounded-lg transition-colors duration-300 ${getColorClasses(item.color)}`}>
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {item.label}
                  </span>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {item.value}
                  </span>
                </div>
                {item.subtitle && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {item.subtitle}
                  </div>
                )}
                {item.trend && (
                  <div className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-1">
                    {item.trend}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CombinedWeatherCard;