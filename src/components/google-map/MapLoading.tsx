import React from "react";
import { FaMap, FaMapMarkerAlt } from "react-icons/fa";

const MapLoading = () => {
  return (
    <div className="relative">
      <FaMap size={60} className="animate-fill" />
      <FaMapMarkerAlt
        size={60}
        className="absolute -top-14 animate-fill-and-bounce"
      />
    </div>
  );
};

export default MapLoading;
