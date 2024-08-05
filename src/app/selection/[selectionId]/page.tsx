"use client";

import GoogleMap from "@/components/google-map/GoogleMap";
import Drawer from "@/components/selection-detail/Drawer";
import { useParams } from "next/navigation";
import React from "react";

const SelectionPage = () => {
  const params = useParams();

  if (!params) {
    return <div>올바르지 않은 selectionId</div>;
  }

  const selectionId = params.selectionId;

  return (
    <div>
      <GoogleMap width="100vw" height="calc(100vh - 74px)" lat={39} lng={-6} />
      <Drawer />
    </div>
  );
};

export default SelectionPage;
