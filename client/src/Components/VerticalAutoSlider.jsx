import React from "react";

export default function VerticalAutoSlider({
  images = [],
  width = "w-80",
  height = "h-[500px]",
  speed = 12,
  direction = "up", // up albo down
}) {
  const loopImages = [...images, ...images];

  const animationName =
    direction === "down" ? "vertical-scroll-down" : "vertical-scroll-up";

  return (
    <>
      <style>{`
        @keyframes vertical-scroll-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }

        @keyframes vertical-scroll-down {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }

        .auto-slide-up {
          animation: vertical-scroll-up linear infinite;
        }

        .auto-slide-down {
          animation: vertical-scroll-down linear infinite;
        }
      `}</style>

      <div className={`${width} ${height} overflow-hidden rounded-xl relative`}>
        <div
          className={`flex flex-col ${
            direction === "down" ? "auto-slide-down" : "auto-slide-up"
          }`}
          style={{ animationDuration: `${speed}s` }}
        >
          {loopImages.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className="w-full h-auto object-cover select-none pointer-events-none"
              draggable="false"
            />
          ))}
        </div>
      </div>
    </>
  );
}
