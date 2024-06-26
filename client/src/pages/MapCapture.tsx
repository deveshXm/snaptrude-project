import { notification } from "antd";
import html2canvas from "html2canvas";
import { CircleAlert } from "lucide-react";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../store";
import { apiService } from "../services/apiService";
import { setAnnotation, setCapturedImage, setCenter, setZoom } from "../store/mapSlice";

import Button from "../components/ui/Button";
import Banner from "../components/ui/Banner";
import { Text } from "../components/ui/Text";
import MapView from "../components/pages/MapCapture/MapView";
import CuboidViewer from "../components/common/CuboidViewer";

const MapCapture: React.FC = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { capturedImage, center, zoom, annotation } = useSelector((state: RootState) => state.map);
  const mapRef = useRef<HTMLDivElement>(null);

  const handleSaveMap = async () => {
    if (!capturedImage) return;
    try {
      setLoading(true);
      await apiService.saveMapData(center, zoom, capturedImage, annotation);
      notification.success({ message: "Capture saved!" });
    } catch (error) {
      console.error("Failed to save map:", error);
      notification.error({ message: "Something went wrong!" });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveState = async () => {
    try {
      setLoading(true);
      await apiService.saveMapState(center, zoom, annotation);
      notification.success({ message: "State Saved!" });
    } catch (error) {
      console.error("Failed to save map:", error);
      notification.error({ message: "Something went wrong!" });
    } finally {
      setLoading(false);
    }
  };
  const handleLoadState = async () => {
    try {
      setLoading(true);
      const response = await apiService.getMapState();
      const { center, zoom, annotation } = response.data;
      console.log(center, zoom, annotation);
      dispatch(setCenter(center));
      dispatch(setZoom(zoom));
      if (annotation) dispatch(setAnnotation(annotation));
    } catch (error: any) {
      if (error.response.status == 400) notification.error({ message: "No state found!" });
      else notification.error({ message: "Something went wrong!" });
      console.error("Failed to save map:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCapture = async () => {
    if (!mapRef.current) return;
    try {
      setLoading(true);
      const canvas = await html2canvas(mapRef.current);
      const imageUrl = canvas.toDataURL("image/png");
      dispatch(setCapturedImage(imageUrl));
    } catch (error) {
      notification.error({ message: "Couldn't capture image." });
    } finally {
      setLoading(false);
    }
  };

  const handleResetCapture = () => {
    dispatch(setCapturedImage(null));
  };

  return (
    <div className="h-full w-full md:w-[60%]">
      {capturedImage ? (
        <div className="mt-4">
          <Button.Root onClick={handleResetCapture} className="mb-4" variant="soft" disabled={loading}>
            <Button.Label>&larr; Map</Button.Label>
          </Button.Root>
          <CuboidViewer capturedImage={capturedImage} onLoad={() => setLoading(false)} />
          <Button.Root onClick={handleSaveMap} className="mt-2 mx-auto" disabled={loading}>
            <Button.Label>Save Map</Button.Label>
          </Button.Root>
        </div>
      ) : (
        <>
          <div ref={mapRef}>
            <MapView onLoad={() => setLoading(false)} />
          </div>
          <Banner.Root intent="info" className="p-[--toast-padding] mt-4">
            <Banner.Content>
              <CircleAlert className="size-5 text-[--body-text-color]" />
              <div className="space-y-2">
                <Text size="sm">Click on map to annotate the location</Text>
              </div>
            </Banner.Content>
          </Banner.Root>
          <div className="flex justify-between ">
            <Button.Root onClick={handleCapture} className="mx-auto mt-4" disabled={loading}>
              <Button.Label>Capture Map</Button.Label>
            </Button.Root>
            <Button.Root onClick={handleSaveState} className="mx-auto mt-4" disabled={loading}>
              <Button.Label>Save State</Button.Label>
            </Button.Root>
            <Button.Root onClick={handleLoadState} className="mx-auto mt-4" disabled={loading}>
              <Button.Label>Load State</Button.Label>
            </Button.Root>
          </div>
        </>
      )}
    </div>
  );
};

export default MapCapture;
