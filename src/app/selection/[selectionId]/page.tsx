"use client";

import Drawer from "@/components/selection-detail/Drawer";
import ReviewAddModal from "@/components/selection-detail/review/ReviewAddModal";
import ReviewImageModal from "@/components/selection-detail/review/ReviewImageModal";
import { useParams } from "next/navigation";
import React from "react";

const SelectionPage = () => {
  const params = useParams();

  if (!params) {
    return <div>올바르지 않은 selectionId</div>;
  }

  const selectionId = params.selectionId;

  return (
    <div className="flex">
      <Drawer />
      <ReviewAddModal />
      <ReviewImageModal />
    </div>
  );
};

export default SelectionPage;
