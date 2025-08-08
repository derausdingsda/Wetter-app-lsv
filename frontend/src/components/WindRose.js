import React, { useEffect, useRef } from "react";

const WindRose = ({ windData, size = 300 }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.4;

    // Set canvas size with device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    let animationAngle = 0;

    const animate = () => {
      ctx.clearRect(0, 0, size, size);

      // Draw compass rose background
      drawCompassRose(ctx, centerX, centerY, radius);
      
      // Draw runway 07-25
      drawRunway(ctx, centerX, centerY, radius);
      
      // Draw wind direction arrow with animation
      drawWindArrow(ctx, centerX, centerY, radius, windData.direction + animationAngle);
      
      // Draw speed rings
      drawSpeedRings(ctx, centerX, centerY, radius, windData.speed);
      
      // Draw labels and speed text
      drawLabels(ctx, centerX, centerY, radius);
      drawSpeedInfo(ctx, centerX, centerY, windData);

      // Subtle rotation animation
      animationAngle += 0.2;
      if (animationAngle >= 360) animationAngle = 0;

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [windData, size]);

  const drawCompassRose = (ctx, centerX, centerY, radius) => {
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;

    // Draw concentric circles
    for (let i = 1; i <= 4; i++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, (radius * i) / 4, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // Draw cardinal directions
    const directions = [
      { angle: 0, label: 'N', primary: true },
      { angle: 45, label: 'NE', primary: false },
      { angle: 90, label: 'E', primary: true },
      { angle: 135, label: 'SE', primary: false },
      { angle: 180, label: 'S', primary: true },
      { angle: 225, label: 'SW', primary: false },
      { angle: 270, label: 'W', primary: true },
      { angle: 315, label: 'NW', primary: false }
    ];

    directions.forEach(({ angle, label, primary }) => {
      const radian = (angle - 90) * Math.PI / 180;
      const x1 = centerX + Math.cos(radian) * radius * 0.9;
      const y1 = centerY + Math.sin(radian) * radius * 0.9;
      const x2 = centerX + Math.cos(radian) * radius;
      const y2 = centerY + Math.sin(radian) * radius;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = primary ? '#475569' : '#cbd5e1';
      ctx.lineWidth = primary ? 2 : 1;
      ctx.stroke();

      // Draw labels
      const labelX = centerX + Math.cos(radian) * radius * 1.15;
      const labelY = centerY + Math.sin(radian) * radius * 1.15;
      
      ctx.fillStyle = '#374151';
      ctx.font = primary ? 'bold 14px Arial' : '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, labelX, labelY);
    });
  };

  const drawWindArrow = (ctx, centerX, centerY, radius, direction) => {
    const radian = (direction - 90) * Math.PI / 180;
    const arrowLength = radius * 0.7;
    
    // Calculate arrow tip position
    const tipX = centerX + Math.cos(radian) * arrowLength;
    const tipY = centerY + Math.sin(radian) * arrowLength;
    
    // Arrow shaft
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(tipX, tipY);
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Arrow head
    const arrowHeadLength = 20;
    const arrowHeadAngle = Math.PI / 6;
    
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(
      tipX - arrowHeadLength * Math.cos(radian - arrowHeadAngle),
      tipY - arrowHeadLength * Math.sin(radian - arrowHeadAngle)
    );
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(
      tipX - arrowHeadLength * Math.cos(radian + arrowHeadAngle),
      tipY - arrowHeadLength * Math.sin(radian + arrowHeadAngle)
    );
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Center dot
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, 2 * Math.PI);
    ctx.fillStyle = '#dc2626';
    ctx.fill();
  };

  const drawSpeedRings = (ctx, centerX, centerY, radius, speed) => {
    // Speed scale rings (every 5 knots)
    const maxSpeed = 40; // kt
    const rings = Math.ceil(maxSpeed / 10);
    
    for (let i = 1; i <= rings; i++) {
      const ringRadius = (radius * i * 10) / maxSpeed;
      if (ringRadius > radius) break;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, ringRadius, 0, 2 * Math.PI);
      ctx.strokeStyle = speed > i * 10 ? '#3b82f6' : '#e2e8f0';
      ctx.lineWidth = speed > i * 10 ? 2 : 1;
      ctx.stroke();
    }
  };

  const drawLabels = (ctx, centerX, centerY, radius) => {
    // Speed labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    
    for (let speed = 10; speed <= 40; speed += 10) {
      const ringRadius = (radius * speed) / 40;
      if (ringRadius > radius) break;
      ctx.fillText(`${speed}kt`, centerX + ringRadius + 5, centerY);
    }
  };

  const drawSpeedInfo = (ctx, centerX, centerY, windData) => {
    // Current wind speed in center
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${windData.speed} kt`, centerX, centerY + 30);
    
    ctx.font = '12px Arial';
    ctx.fillStyle = '#6b7280';
    ctx.fillText(`${windData.direction}°`, centerX, centerY + 50);
    
    if (windData.gusts > windData.speed) {
      ctx.fillText(`Böen: ${windData.gusts} kt`, centerX, centerY + 65);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <canvas
        ref={canvasRef}
        className="rounded-lg border border-gray-200 shadow-sm bg-white"
      />
      <div className="text-center">
        <div className="text-sm font-medium text-gray-700">
          Wind aus {windData.directionName}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {windData.beaufortScale} Beaufort
        </div>
      </div>
    </div>
  );
};

export default WindRose;