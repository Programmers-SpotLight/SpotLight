import { fetchDataForSelectionEdit, fetchDataForSelectionTemporaryEdit } from "@/http/selectionEdit.api";
import { ISelectionSpot, ISelectSelection } from "@/models/selection.model";
import { ISelectSpot } from "@/models/spot.model";
import { useSelectionCreateStore } from "@/stores/selectionCreateStore";
import { useEffect, useState } from "react";
import { useStore } from "zustand";


const useFetchSelectionDetailForEdit = (
  selectionId: number,
  isTemporary: boolean
) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    setId,
    setIsTemporary,
    setTitle,
    setDescription,
    setCategory,
    setLocation,
    setSubLocation,
    setSelectionImage,
    setSpots,
    setHashtags,
    reset
  } = useStore(useSelectionCreateStore);

  const fetchSelectionTemporaryDetail = async () => {
    setLoading(true);
    setError(null);
    reset();

    try {
      if (isTemporary) {
        const data = await fetchDataForSelectionTemporaryEdit(selectionId);
        passDetailToStore(data);
      } else {
        const data = await fetchDataForSelectionEdit(selectionId);
        passDetailToStore(data);
      }
    } catch (error: any) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const passDetailToStore = (data : ISelectSelection) => {
    if (!data) return;

    setId(selectionId);
    setIsTemporary(isTemporary);
    setTitle(data.title);
    setDescription(data.description);
    setCategory({
      id: data.categoryId,
      name: data.categoryName
    });
    setLocation({
      id: data.locationId,
      name: data.locationName
    });
    setSubLocation({
      id: data.subLocationId,
      name: data.subLocationName
    });
    setSelectionImage(data.image);
    setHashtags(data.hashtags);

    prepareSpots(data.spots);
  }

  const prepareSpots = (spots: ISelectSpot[]) => {
    if (!spots) return;

    const spotsToInsert : ISelectionSpot[] = spots.map((spot) => {
      return {
        placeId: spot.gmapId,
        title: spot.title,
        description: spot.description,
        category: spot.categoryId,
        formattedAddress: spot.gmapAddress,
        latitude: spot.gmapLatitude,
        longitude: spot.gmapLongitude,
        images: spot.images,
        hashtags: spot.hashtags
      }
    });

    setSpots(spotsToInsert);
  }

  useEffect(() => {
    if (!selectionId) return;
    fetchSelectionTemporaryDetail();
  }, [selectionId]);

  return { 
    loading, 
    error, 
    fetchDataForSelectionTemporaryEdit
  };
}

export default useFetchSelectionDetailForEdit;