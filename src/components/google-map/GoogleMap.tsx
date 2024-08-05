import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import {
  SpotCategory,
  SPOTINFOWITHCATEGORY
} from "../selection-detail/spot-selection-contents/SpotHeader";

interface IGoogleMapProps {
  width: string;
  height: string;
  lat: number;
  lng: number;
}

const sampleSpots = [
  {
    lat: 39,
    lng: -6,
    category: "맛집" as SpotCategory
  },
  {
    lat: 39.01,
    lng: -6,
    category: "쇼핑" as SpotCategory
  },
  {
    lat: 39.02,
    lng: -6,
    category: "카페" as SpotCategory
  },
  {
    lat: 39.03,
    lng: -6,
    category: "관광지" as SpotCategory
  },
  {
    lat: 39.04,
    lng: -6,
    category: "기타" as SpotCategory
  }
];

const GoogleMap = ({ width, height, lat, lng }: IGoogleMapProps) => {
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

      //add marker on map
      sampleSpots.forEach((spot) => {
        const markerContent = document.createElement("img");
        markerContent.src = SPOTINFOWITHCATEGORY[spot.category].mapPin;
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
          //setSelectedSpot
        });
      });
    };
    initializeMap();
  }, [lat, lng]);
  return <div ref={mapRef} style={{ width: width, height: height }}></div>;
};

export default GoogleMap;
