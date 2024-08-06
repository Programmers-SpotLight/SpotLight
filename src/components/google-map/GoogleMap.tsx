import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { SPOTINFOWITHCATEGORY } from "../selection-detail/spot-selection-contents/SpotHeader";
import { ISpotInfoForMarking } from "@/models/spot";

interface IGoogleMapProps {
  width: string;
  height: string;
  lat: number;
  lng: number;
  spots: ISpotInfoForMarking[];
  spotClickHandler: (spotId: string) => void;
  setMap: React.Dispatch<React.SetStateAction<google.maps.Map | null>>;
}

const GoogleMap = ({
  width,
  height,
  lat,
  lng,
  spots,
  spotClickHandler,
  setMap
}: IGoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        version: "weekly"
      });

      const { Map } = (await loader.importLibrary(
        "maps"
      )) as google.maps.MapsLibrary;

      const locationMap = {
        lat: lat,
        lng: lng
      };

      //marker
      const { Marker } = (await loader.importLibrary(
        "marker"
      )) as google.maps.MarkerLibrary;

      const options: google.maps.MapOptions = {
        center: locationMap,
        zoom: 15,
        mapId: process.env.NEXT_PUBLIC_MAPS_ID
      };

      const map = new Map(mapRef.current as HTMLDivElement, options);
      setMap(map);

      //add marker on map
      spots.forEach((spot) => {
        const markerContent = document.createElement("img");
        markerContent.src = SPOTINFOWITHCATEGORY[spot.categoryName].mapPin;
        markerContent.style.width = "100px";
        markerContent.style.height = "100px";

        const marker = new google.maps.marker.AdvancedMarkerElement({
          map: map,
          position: {
            lat: spot.lat,
            lng: spot.lng
          },
          content: markerContent,
          gmpClickable: true
        });

        marker.addListener("click", () => {
          map.panTo({ lat: spot.lat, lng: spot.lng });
          spotClickHandler(spot.id);
        });
      });
    };
    initializeMap();
  }, [lat, lng, spots]);
  return <div ref={mapRef} style={{ width: width, height: height }}></div>;
};

export default GoogleMap;
