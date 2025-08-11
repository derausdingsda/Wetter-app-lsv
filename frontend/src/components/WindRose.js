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

    // Draw main cardinal directions with degree numbers every 30°
    const directions = [
      { angle: 0, label: '360°' },
      { angle: 30, label: '030°' },
      { angle: 60, label: '060°' },
      { angle: 90, label: '090°' },
      { angle: 120, label: '120°' },
      { angle: 150, label: '150°' },
      { angle: 180, label: '180°' },
      { angle: 210, label: '210°' },
      { angle: 240, label: '240°' },
      { angle: 270, label: '270°' },
      { angle: 300, label: '300°' },
      { angle: 330, label: '330°' }
    ];

    directions.forEach(({ angle, label }) => {
      const radian = (angle - 90) * Math.PI / 180;
      const labelX = centerX + Math.cos(radian) * radius * 1.15;
      const labelY = centerY + Math.sin(radian) * radius * 1.15;
      
      ctx.fillStyle = textColor;
      ctx.font = 'bold 12px Arial';
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
    
    // Draw runway threshold markings - SHORTENED to stay within runway
    const thresholdLength = 8; // Reduced from 12 to 8 to stay within runway bounds
    const thresholdSpacing = 4;
    const runwayHalfWidth = runwayWidth / 2 - 2; // Keep markings inside runway bounds
    
    // 07 threshold - only within runway bounds
    for (let i = -3; i <= 3; i++) {
      const offsetDistance = i * thresholdSpacing;
      if (Math.abs(offsetDistance) > runwayHalfWidth) continue; // Skip if outside runway
      
      const offsetX = Math.cos(perpAngle) * offsetDistance;
      const offsetY = Math.sin(perpAngle) * offsetDistance;
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
    
    // 25 threshold - only within runway bounds
    for (let i = -3; i <= 3; i++) {
      const offsetDistance = i * thresholdSpacing;
      if (Math.abs(offsetDistance) > runwayHalfWidth) continue; // Skip if outside runway
      
      const offsetX = Math.cos(perpAngle) * offsetDistance;
      const offsetY = Math.sin(perpAngle) * offsetDistance;
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
    
    // Draw runway numbers INSIDE the runway like real runways
    ctx.fillStyle = isDarkMode ? '#ffffff' : '#ffffff'; // Always white text on dark runway
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Calculate positions closer to center of runway for realistic placement
    const numberOffset = runwayLength * 0.7; // Position numbers towards runway ends but not at extreme ends
    
    // 07 number - positioned on the 250° side (where you start to go towards 070°)
    const number07X = centerX + Math.cos(runway25Radian) * numberOffset;
    const number07Y = centerY + Math.sin(runway25Radian) * numberOffset;
    
    // Save context for text rotation - rotate 180° to point in start direction
    ctx.save();
    ctx.translate(number07X, number07Y);
    ctx.rotate(runway25Radian + Math.PI / 2 + Math.PI); // Add 180° rotation
    ctx.fillText('07', 0, 0);
    ctx.restore();
    
    // 25 number - positioned on the 070° side (where you start to go towards 250°)
    const number25X = centerX + Math.cos(runway07Radian) * numberOffset;
    const number25Y = centerY + Math.sin(runway07Radian) * numberOffset;
    
    ctx.save();
    ctx.translate(number25X, number25Y);
    ctx.rotate(runway07Radian + Math.PI / 2 + Math.PI); // Add 180° rotation
    ctx.fillText('25', 0, 0);
    ctx.restore();
  };

  const drawWindArrow = (ctx, centerX, centerY, radius, direction) => {
    const radian = (direction - 90) * Math.PI / 180;
    
    // Move arrow closer to center
    const arrowDistance = radius * 0.95; // Moved closer: from 1.1 to 0.95
    const arrowLength = 60; // Even larger: increased from 45 to 60
    
    // Calculate arrow base position
    const arrowBaseX = centerX + Math.cos(radian) * arrowDistance;
    const arrowBaseY = centerY + Math.sin(radian) * arrowDistance;
    
    // Calculate arrow tip position (pointing toward center)
    const arrowTipX = arrowBaseX - Math.cos(radian) * arrowLength;
    const arrowTipY = arrowBaseY - Math.sin(radian) * arrowLength;
    
    // Draw arrow head FIRST (so it's not covered by the shaft)
    const arrowHeadLength = 25; // Even larger: increased from 20 to 25
    const arrowHeadAngle = Math.PI / 5;
    
    ctx.beginPath();
    ctx.moveTo(arrowTipX, arrowTipY);
    ctx.lineTo(
      arrowTipX + arrowHeadLength * Math.cos(radian - arrowHeadAngle),
      arrowTipY + arrowHeadLength * Math.sin(radian - arrowHeadAngle)
    );
    ctx.lineTo(
      arrowTipX + arrowHeadLength * Math.cos(radian + arrowHeadAngle),
      arrowTipY + arrowHeadLength * Math.sin(radian + arrowHeadAngle)
    );
    ctx.closePath();
    ctx.fillStyle = isDarkMode ? '#666666' : '#666666';
    ctx.fill();
    
    // Draw arrow shaft AFTER the head (so head stays visible and sharp)
    // Make shaft slightly shorter so it doesn't overlap the head
    const shaftEndX = arrowTipX + Math.cos(radian) * 10; // Increased gap from 8 to 10
    const shaftEndY = arrowTipY + Math.sin(radian) * 10;
    
    ctx.beginPath();
    ctx.moveTo(arrowBaseX, arrowBaseY);
    ctx.lineTo(shaftEndX, shaftEndY);
    ctx.strokeStyle = isDarkMode ? '#666666' : '#666666';
    ctx.lineWidth = 10; // Even thicker: increased from 8 to 10
    ctx.stroke();
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