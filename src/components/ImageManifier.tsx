import React, { useRef, useState } from "react";

type Props = {
  src: string | undefined;
  zoom?: number;
  size?: number; 
  width?: number; 
  height?: number; 
};

const ImageMagnifier = ({ src, zoom = 3, size = 200, width, height }: Props) => {
  const imgRef = useRef<HTMLDivElement>(null);
  const [magnifierStyle, setMagnifierStyle] = useState<React.CSSProperties>({
    display: "none",
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { left, top, width, height } = imgRef.current!.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    const backgroundX = -(x * zoom - size / 2);
    const backgroundY = -(y * zoom - size / 2);

    setMagnifierStyle({
      display: "block",
      left: x - size / 2,
      top: y - size / 2,
      width: size,
      height: size,
      backgroundImage: `url(${src})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: `${width * zoom}px ${height * zoom}px`,
      backgroundPosition: `${backgroundX}px ${backgroundY}px`,
      borderRadius: "9999px",
      border: "2px solid rgba(0,0,0,0.3)",
      position: "absolute",
      pointerEvents: "none",
      zIndex: 10,
    });
  };

  const handleLeave = () => {
    setMagnifierStyle({ display: "none" });
  };

  return (
    <div
      className="relative overflow-hidden border-2 border-gray-300 rounded-lg shadow-lg transition-transform transform hover:scale-105"
      style={{ 
        width: width ? `${width}px` : '400px', 
        height: height ? `${height}px` : '600px' 
      }}
      ref={imgRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleLeave}
    >
      <img
        src={src || ""}
        alt="Product"
        className="w-full h-full object-contain select-none"
        draggable={false}
      />
      <div style={magnifierStyle} />
    </div>
  );
};

export default ImageMagnifier;
