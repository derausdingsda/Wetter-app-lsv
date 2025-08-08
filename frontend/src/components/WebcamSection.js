import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Camera, Wifi } from "lucide-react";

const WebcamSection = () => {
  const webcams = [
    {
      id: 1,
      name: "Flugplatz Nord",
      position: "Nordseite",
      status: "Online",
      placeholder: "https://customer-assets.emergentagent.com/job_pilot-meteo/artifacts/xkz05fqy_IMG_0222.jpeg"
    },
    {
      id: 2,
      name: "Wetterstation West",
      position: "Westseite",
      status: "Online",
      placeholder: "https://customer-assets.emergentagent.com/job_pilot-meteo/artifacts/e3ebykmy_IMG_0221.jpeg"
    },
    {
      id: 3,
      name: "Wetterstation Süd",
      position: "Südseite",
      status: "Online",
      placeholder: "https://customer-assets.emergentagent.com/job_pilot-meteo/artifacts/7qjkvj8w_IMG_0220.jpeg"
    },
    {
      id: 4,
      name: "Wetterstation Ost",
      position: "Ostseite",
      status: "Online",
      placeholder: "https://customer-assets.emergentagent.com/job_pilot-meteo/artifacts/j3a7bxmg_IMG_0219.jpeg"
    },
    {
      id: 5,
      name: "Landebahn Nord",
      position: "Vereinsheim",
      status: "Online",
      placeholder: "https://customer-assets.emergentagent.com/job_pilot-meteo/artifacts/7hkklt0d_IMG_0218.jpeg"
    }
  ];

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
        <Camera className="mr-3 h-6 w-6" />
        Live Webcams
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {webcams.map((webcam) => (
          <Card key={webcam.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 dark:bg-slate-800 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="text-gray-800 dark:text-white">{webcam.name}</span>
                <div className="flex items-center space-x-1">
                  <Wifi className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-green-500 font-medium">{webcam.status}</span>
                </div>
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-300">{webcam.position}</p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative">
                <img 
                  src={webcam.placeholder}
                  alt={`Webcam ${webcam.name}`}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    // Fallback to a solid color placeholder if image fails
                    e.target.src = "data:image/svg+xml,%3Csvg width='400' height='250' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='250' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%236b7280' font-size='14' font-family='Arial'%3EWebcam Platzhalter%3C/text%3E%3C/svg%3E";
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <div className="text-white text-xs font-medium">
                    Live • {new Date().toLocaleTimeString('de-DE', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      timeZone: 'UTC'
                    })} UTC
                  </div>
                </div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-slate-700/50">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Aktualisierung alle 30 Sekunden
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default WebcamSection;