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
    const strokeColor = isDarkMode ? '#64748b' : '#374151';
    const primaryStroke = isDarkMode ? '#e2e8f0' : '#1f2937';
    const textColor = isDarkMode ? '#f1f5f9' : '#1f2937';
    
    // Draw outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = primaryStroke;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw degree marks around the circle
    for (let i = 0; i < 360; i += 5) {
      const angle = (i - 90) * Math.PI / 180;
      const isMainDirection = i % 90 === 0;
      const isMidDirection = i % 45 === 0 && i % 90 !== 0;
      const is10DegMark = i % 10 === 0;
      
      let outerRadius = radius;
      let innerRadius;
      
      if (isMainDirection) {
        innerRadius = radius * 0.85; // Long marks for main directions
        ctx.lineWidth = 2;
      } else if (isMidDirection) {
        innerRadius = radius * 0.9; // Medium marks for 45° directions
        ctx.lineWidth = 1.5;
      } else if (is10DegMark) {
        innerRadius = radius * 0.93; // Short marks for 10° marks
        ctx.lineWidth = 1;
      } else {
        innerRadius = radius * 0.95; // Very short marks for 5° marks
        ctx.lineWidth = 0.5;
      }
      
      const x1 = centerX + Math.cos(angle) * innerRadius;
      const y1 = centerY + Math.sin(angle) * innerRadius;
      const x2 = centerX + Math.cos(angle) * outerRadius;
      const y2 = centerY + Math.sin(angle) * outerRadius;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = strokeColor;
      ctx.stroke();
    }

    // Draw main cardinal directions with letters
    const directions = [
      { angle: 0, label: 'N' },
      { angle: 45, label: 'NO' },
      { angle: 90, label: 'O' },
      { angle: 135, label: 'SO' },
      { angle: 180, label: 'S' },
      { angle: 225, label: 'SW' },
      { angle: 270, label: 'W' },
      { angle: 315, label: 'NW' }
    ];

    directions.forEach(({ angle, label }) => {
      const radian = (angle - 90) * Math.PI / 180;
      const labelX = centerX + Math.cos(radian) * radius * 1.2;
      const labelY = centerY + Math.sin(radian) * radius * 1.2;
      
      ctx.fillStyle = textColor;
      ctx.font = 'bold 16px Arial';
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
    
    // Calculate runway endpoints - make it span most of the compass
    const runwayLength = radius * 0.9;
    const runway07X = centerX + Math.cos(runway07Radian) * runwayLength;
    const runway07Y = centerY + Math.sin(runway07Radian) * runwayLength;
    const runway25X = centerX + Math.cos(runway25Radian) * runwayLength;
    const runway25Y = centerY + Math.sin(runway25Radian) * runwayLength;
    
    // Draw main runway strip (black with dashed centerline like in the image)
    const runwayWidth = 20;
    
    // Save context for clipping
    ctx.save();
    
    // Create runway shape
    const perpAngle = runway07Radian + Math.PI / 2;
    const halfWidth = runwayWidth / 2;
    
    ctx.beginPath();
    ctx.moveTo(runway25X + Math.cos(perpAngle) * halfWidth, runway25Y + Math.sin(perpAngle) * halfWidth);
    ctx.lineTo(runway07X + Math.cos(perpAngle) * halfWidth, runway07Y + Math.sin(perpAngle) * halfWidth);
    ctx.lineTo(runway07X - Math.cos(perpAngle) * halfWidth, runway07Y - Math.sin(perpAngle) * halfWidth);
    ctx.lineTo(runway25X - Math.cos(perpAngle) * halfWidth, runway25Y - Math.sin(perpAngle) * halfWidth);
    ctx.closePath();
    
    // Fill runway with dark color
    ctx.fillStyle = isDarkMode ? '#1f2937' : '#374151';
    ctx.fill();
    
    // Add runway border
    ctx.strokeStyle = isDarkMode ? '#4b5563' : '#1f2937';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw dashed centerline
    ctx.beginPath();
    ctx.moveTo(runway25X, runway25Y);
    ctx.lineTo(runway07X, runway07Y);
    ctx.strokeStyle = isDarkMode ? '#9ca3af' : '#d1d5db';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 4]);
    ctx.stroke();
    ctx.setLineDash([]); // Reset line dash
    
    // Draw runway threshold markings
    const thresholdLength = 12;
    const thresholdSpacing = 6;
    
    // 07 threshold
    for (let i = -2; i <= 2; i++) {
      const offsetX = Math.cos(perpAngle) * i * thresholdSpacing;
      const offsetY = Math.sin(perpAngle) * i * thresholdSpacing;
      const startX = runway07X + offsetX - Math.cos(runway07Radian) * thresholdLength/2;
      const startY = runway07Y + offsetY - Math.sin(runway07Radian) * thresholdLength/2;
      const endX = runway07X + offsetX + Math.cos(runway07Radian) * thresholdLength/2;
      const endY = runway07Y + offsetY + Math.sin(runway07Radian) * thresholdLength/2;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = isDarkMode ? '#f9fafb' : '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    
    // 25 threshold
    for (let i = -2; i <= 2; i++) {
      const offsetX = Math.cos(perpAngle) * i * thresholdSpacing;
      const offsetY = Math.sin(perpAngle) * i * thresholdSpacing;
      const startX = runway25X + offsetX - Math.cos(runway25Radian) * thresholdLength/2;
      const startY = runway25Y + offsetY - Math.sin(runway25Radian) * thresholdLength/2;
      const endX = runway25X + offsetX + Math.cos(runway25Radian) * thresholdLength/2;
      const endY = runway25Y + offsetY + Math.sin(runway25Radian) * thresholdLength/2;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = isDarkMode ? '#f9fafb' : '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    
    ctx.restore();
    
    // Draw runway numbers
    const labelOffset = 30;
    
    // Label for 07
    const label07X = runway07X + Math.cos(runway07Radian) * labelOffset;
    const label07Y = runway07Y + Math.sin(runway07Radian) * labelOffset;
    ctx.fillStyle = isDarkMode ? '#f1f5f9' : '#1f2937';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('07', label07X, label07Y);
    
    // Label for 25
    const label25X = runway25X + Math.cos(runway25Radian) * labelOffset;
    const label25Y = runway25Y + Math.sin(runway25Radian) * labelOffset;
    ctx.fillText('25', label25X, label25Y);
  };

  const drawWindArrow = (ctx, centerX, centerY, radius, direction) => {
    const radian = (direction - 90) * Math.PI / 180;
    const arrowLength = radius * 0.6;
    const arrowWidth = 8;
    
    // Calculate arrow tip position
    const tipX = centerX + Math.cos(radian) * arrowLength;
    const tipY = centerY + Math.sin(radian) * arrowLength;
    
    // Calculate arrow base position (from center, not opposite direction)
    const baseLength = arrowLength * 0.3;
    const baseX = centerX + Math.cos(radian) * baseLength;
    const baseY = centerY + Math.sin(radian) * baseLength;
    
    // Arrow shaft - thicker and black like in the image
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(tipX, tipY);
    ctx.strokeStyle = isDarkMode ? '#1f2937' : '#000000';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Arrow head - triangular like in the example
    const arrowHeadLength = 15;
    const arrowHeadAngle = Math.PI / 6;
    
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(
      tipX - arrowHeadLength * Math.cos(radian - arrowHeadAngle),
      tipY - arrowHeadLength * Math.sin(radian - arrowHeadAngle)
    );
    ctx.lineTo(
      tipX - arrowHeadLength * Math.cos(radian + arrowHeadAngle),
      tipY - arrowHeadLength * Math.sin(radian + arrowHeadAngle)
    );
    ctx.closePath();
    ctx.fillStyle = isDarkMode ? '#1f2937' : '#000000';
    ctx.fill();

    // Center dot
    ctx.beginPath();
    ctx.arc(centerX, centerY, 3, 0, 2 * Math.PI);
    ctx.fillStyle = isDarkMode ? '#1f2937' : '#000000';
    ctx.fill();
  };

  const drawSpeedRings = (ctx, centerX, centerY, radius, speed) => {
    // Remove the speed rings completely for a cleaner look like in the example
    // The speed rings were cluttering the professional appearance
  };

  const drawLabels = (ctx, centerX, centerY, radius) => {
    // Remove speed labels for cleaner appearance like in the example
    // Speed information is shown in the weather data card
  };

  const drawSpeedInfo = (ctx, centerX, centerY, windData) => {
    // Wind speed and direction info in center - REMOVED
    // const textColor = isDarkMode ? '#f1f5f9' : '#1f2937';
    // const subtextColor = isDarkMode ? '#94a3b8' : '#6b7280';
    
    // Current wind speed in center
    // ctx.fillStyle = textColor;
    // ctx.font = 'bold 16px Arial';
    // ctx.textAlign = 'center';
    // ctx.textBaseline = 'middle';
    // ctx.fillText(`${windData.speed} kt`, centerX, centerY + 30);
    
    // ctx.font = '12px Arial';
    // ctx.fillStyle = subtextColor;
    // ctx.fillText(`${windData.direction}°`, centerX, centerY + 50);
    
    // if (windData.gusts > windData.speed) {
    //   ctx.fillText(`Böen: ${windData.gusts} kt`, centerX, centerY + 65);
    // }
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