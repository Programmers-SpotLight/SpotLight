"use client";

import Drawer from "@/components/selection-detail/Drawer";
import ReviewModal from "@/components/selection-detail/review/ReviewModal";
import ReviewDeleteModal from "@/components/selection-detail/review/ReviewDeleteModal";
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
      <ReviewModal />
      <ReviewDeleteModal />
      <ReviewImageModal />
    </div>
  );
};

export default SelectionPage;
