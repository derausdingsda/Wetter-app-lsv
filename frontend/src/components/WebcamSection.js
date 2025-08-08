import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Camera } from "lucide-react";

const WebcamSection = () => {
  const webcams = [
    {
      id: 1,
      name: "Landebahn Nord",
      placeholder: "https://customer-assets.emergentagent.com/job_pilot-meteo/artifacts/7hkklt0d_IMG_0218.jpeg"
    },
    {
      id: 2,
      name: "West",
      placeholder: "https://customer-assets.emergentagent.com/job_pilot-meteo/artifacts/e3ebykmy_IMG_0221.jpeg"
    },
    {
      id: 3,
      name: "Süd",
      placeholder: "https://customer-assets.emergentagent.com/job_pilot-meteo/artifacts/7qjkvj8w_IMG_0220.jpeg"
    },
    {
      id: 4,
      name: "Ost",
      placeholder: "https://customer-assets.emergentagent.com/job_pilot-meteo/artifacts/j3a7bxmg_IMG_0219.jpeg"
    },
    {
      id: 5,
      name: "Himmel Nord",
      placeholder: "https://customer-assets.emergentagent.com/job_pilot-meteo/artifacts/xkz05fqy_IMG_0222.jpeg"
    }
  ];

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
        <Camera className="mr-3 h-6 w-6" />
        Live Webcams
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {webcams.map((webcam) => (
          <Card key={webcam.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 dark:bg-slate-800 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                <span className="text-gray-800 dark:text-white">{webcam.name}</span>
              </CardTitle>
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default WebcamSection;