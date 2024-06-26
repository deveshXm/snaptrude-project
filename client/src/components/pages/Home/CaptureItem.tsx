import { useState } from "react";
import { MAPBOX_CONFIG } from "../../../constants/config";

interface CaptureItemProps {
  map: MapTypes.MapData;
  onClick: () => void;
}

const CaptureItem = ({ map, onClick }: CaptureItemProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <button
      className="w-full aspect-w-16 aspect-h-10 border border-black bg-black overflow-hidden xl:aspect-w-16 xl:aspect-h-10 relative group"
      onClick={onClick}
      style={{ height: MAPBOX_CONFIG.MAP_HEIGHT, width: MAPBOX_CONFIG.MAP_WIDTH }}
    >
      {isLoading && <div className="absolute inset-0 bg-black"></div>}
      <img
        src={map.capturedImage}
        alt="Captured Map"
        className={`transform scale-110 object-cover transition duration-200 w-full h-full group-hover:scale-100 ${isLoading ? "hidden" : "block"}`}
        height={"100%"}
        width={"100%"}
        onLoad={handleImageLoad}
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition duration-200"></div>
      <div className="absolute bottom-0 left-0 right-0 p-6 space-y-6 text-sm text-gray-200 opacity-0 group-hover:opacity-100">
        <div className="flex justify-between">
          <p>{new Date(map.createdAt).toLocaleDateString()}</p>
          <p>{new Date(map.createdAt).toLocaleTimeString()}</p>
        </div>
      </div>
    </button>
  );
};

export default CaptureItem;
