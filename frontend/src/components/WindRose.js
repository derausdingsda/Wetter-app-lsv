import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";

const WindRose = ({ windData }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState(300);
  const { isDarkMode } = useTheme();

  // Update canvas size based on container size
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const rect = container.getBoundingClientRect();
        const containerWidth = rect.width;
        const containerHeight = rect.height;
        
        // Use 90% of the smaller dimension to maximize space usage
        const availableSize = Math.min(containerWidth, containerHeight) * 0.9;
        const size = Math.max(250, Math.min(availableSize, 600)); // Min 250px, max 600px
        
        setCanvasSize(size);
      }
    };

    // Initial size calculation with delay to ensure container is rendered
    const initialUpdate = () => {
      setTimeout(updateSize, 100);
    };
    
    initialUpdate();

    // Update size on window resize
    const handleResize = () => {
      setTimeout(updateSize, 150); // Debounce resize events
    };

    window.addEventListener('resize', handleResize);

    // Use ResizeObserver if available for more precise container size changes
    let resizeObserver = null;
    if (window.ResizeObserver && containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        setTimeout(updateSize, 50);
      });
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || canvasSize <= 0) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvasSize / 2;
    const centerY = canvasSize / 2;
    const radius = canvasSize * 0.35;

    // Set canvas size with device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasSize * dpr;
    canvas.height = canvasSize * dpr;
    canvas.style.width = `${canvasSize}px`;
    canvas.style.height = `${canvasSize}px`;
    ctx.scale(dpr, dpr);

    let animationAngle = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvasSize, canvasSize);

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
  }, [windData, canvasSize, isDarkMode]);

  const drawCompassRose = (ctx, centerX, centerY, radius) => {
    const strokeColor = isDarkMode ? '#475569' : '#e2e8f0';
    const primaryStroke = isDarkMode ? '#cbd5e1' : '#475569';
    const secondaryStroke = isDarkMode ? '#64748b' : '#cbd5e1';
    const textColor = isDarkMode ? '#e2e8f0' : '#374151';
    
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1;

    // Draw concentric circles
    for (let i = 1; i <= 4; i++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, (radius * i) / 4, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // Draw cardinal directions with degree values
    const directions = [
      { angle: 0, label: '360°', primary: true },
      { angle: 45, label: '045°', primary: false },
      { angle: 90, label: '090°', primary: true },
      { angle: 135, label: '135°', primary: false },
      { angle: 180, label: '180°', primary: true },
      { angle: 225, label: '225°', primary: false },
      { angle: 270, label: '270°', primary: true },
      { angle: 315, label: '315°', primary: false }
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
      ctx.strokeStyle = primary ? primaryStroke : secondaryStroke;
      ctx.lineWidth = primary ? 2 : 1;
      ctx.stroke();

      // Draw labels
      const labelX = centerX + Math.cos(radian) * radius * 1.15; // Reduced from 1.25 to 1.15 for optimal spacing
      const labelY = centerY + Math.sin(radian) * radius * 1.15; // Reduced from 1.25 to 1.15 for optimal spacing
      
      ctx.fillStyle = textColor;
      ctx.font = primary ? 'bold 14px Arial' : '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, labelX, labelY);
    });
  };

  const drawRunway = (ctx, centerX, centerY, radius) => {
    // Runway 07-25: 070° to 250° (70° - 250°)
    const runway07Angle = 70; // Runway 07 heading
    const runway25Angle = 250; // Runway 25 heading (opposite direction)
    
    // Convert to radians (subtract 90° to align with canvas coordinate system)
    const runway07Radian = (runway07Angle - 90) * Math.PI / 180;
    const runway25Radian = (runway25Angle - 90) * Math.PI / 180;
    
    // Calculate runway endpoints
    const runwayLength = radius * 0.8; // Make runway span most of the wind rose
    const runway07X = centerX + Math.cos(runway07Radian) * runwayLength;
    const runway07Y = centerY + Math.sin(runway07Radian) * runwayLength;
    const runway25X = centerX + Math.cos(runway25Radian) * runwayLength;
    const runway25Y = centerY + Math.sin(runway25Radian) * runwayLength;
    
    // Draw runway line
    ctx.beginPath();
    ctx.moveTo(runway25X, runway25Y);
    ctx.lineTo(runway07X, runway07Y);
    ctx.strokeStyle = '#059669'; // Green color for runway
    ctx.lineWidth = 6;
    ctx.stroke();
    
    // Draw runway end markers
    const markerLength = 8;
    const perpAngle07 = runway07Radian + Math.PI / 2;
    const perpAngle25 = runway25Radian + Math.PI / 2;
    
    // Runway 07 marker
    ctx.beginPath();
    ctx.moveTo(
      runway07X + Math.cos(perpAngle07) * markerLength,
      runway07Y + Math.sin(perpAngle07) * markerLength
    );
    ctx.lineTo(
      runway07X - Math.cos(perpAngle07) * markerLength,
      runway07Y - Math.sin(perpAngle07) * markerLength
    );
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // Runway 25 marker
    ctx.beginPath();
    ctx.moveTo(
      runway25X + Math.cos(perpAngle25) * markerLength,
      runway25Y + Math.sin(perpAngle25) * markerLength
    );
    ctx.lineTo(
      runway25X - Math.cos(perpAngle25) * markerLength,
      runway25Y - Math.sin(perpAngle25) * markerLength
    );
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // Draw runway labels
    const labelOffset = 25;
    
    // Label for 07
    const label07X = runway07X + Math.cos(runway07Radian) * labelOffset;
    const label07Y = runway07Y + Math.sin(runway07Radian) * labelOffset;
    ctx.fillStyle = '#059669';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('07', label07X, label07Y);
    
    // Label for 25
    const label25X = runway25X + Math.cos(runway25Radian) * labelOffset;
    const label25Y = runway25Y + Math.sin(runway25Radian) * labelOffset;
    ctx.fillText('25', label25X, label25Y);
    
    // Add runway info in legend - REMOVED
    // ctx.fillStyle = isDarkMode ? '#94a3b8' : '#6b7280';
    // ctx.font = '11px Arial';
    // ctx.textAlign = 'center';
    // ctx.fillText('Runway 07-25', centerX, centerY - 80);
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
    // Speed labels at 120 degrees instead of 90 degrees
    const labelAngle = 120; // degrees
    const labelRadian = (labelAngle - 90) * Math.PI / 180;
    
    ctx.fillStyle = isDarkMode ? '#94a3b8' : '#6b7280';
    ctx.font = '10px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    
    for (let speed = 10; speed <= 40; speed += 10) {
      const ringRadius = (radius * speed) / 40;
      if (ringRadius > radius) break;
      
      // Calculate position at 120 degrees
      const labelX = centerX + Math.cos(labelRadian) * ringRadius + 5;
      const labelY = centerY + Math.sin(labelRadian) * ringRadius;
      
      ctx.fillText(`${speed}kt`, labelX, labelY);
    }
  };

  const drawSpeedInfo = (ctx, centerX, centerY, windData) => {
    const textColor = isDarkMode ? '#f1f5f9' : '#1f2937';
    const subtextColor = isDarkMode ? '#94a3b8' : '#6b7280';
    
    // Current wind speed in center
    ctx.fillStyle = textColor;
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${windData.speed} kt`, centerX, centerY + 30);
    
    ctx.font = '12px Arial';
    ctx.fillStyle = subtextColor;
    ctx.fillText(`${windData.direction}°`, centerX, centerY + 50);
    
    if (windData.gusts > windData.speed) {
      ctx.fillText(`Böen: ${windData.gusts} kt`, centerX, centerY + 65);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="flex justify-center items-center w-full h-full p-2"
    >
      <canvas
        ref={canvasRef}
        className="rounded-lg border border-gray-200 dark:border-slate-600 shadow-sm bg-white dark:bg-slate-700 transition-colors duration-300"
        style={{ maxWidth: '100%', maxHeight: '100%' }}
      />
    </div>
  );
};

export default WindRose;