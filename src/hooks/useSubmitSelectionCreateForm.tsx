import { submitSelection } from "@/http/selectionCreate.api";
import { ISelectionSpot } from "@/models/selection.model";
import { useSelectionCreateStore } from "@/stores/selectionCreateStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { useStore } from "zustand";

type TTemporarySpotPhotoStorage = Array<Array<File | string>>;

const useSubmitSelectionCreateForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    title,
    description,
    category,
    location,
    subLocation,
    selectionPhoto,
    hashtags,
    spots,
    setSpots,
    reset
  } = useStore(useSelectionCreateStore);

  const validateSelection = (isTemporary = false) => {
    if (!title) {
      toast.error("제목을 입력해주세요.");
      return false;
    }

    if (!description && !isTemporary) {
      toast.error("설명을 입력해주세요.");
      return false;
    }

    if (!category && !isTemporary) {
      toast.error("카테고리를 선택해주세요.");
      return false;
    }

    if ((!location || !subLocation) && !isTemporary) {
      toast.error("지역을 선택해주세요.");
      return false;
    }

    if (!selectionPhoto && !isTemporary) {
      toast.error("썸네일을 등록해주세요.");
      return false;
    }

    if (hashtags.length === 0 && !isTemporary) {
      toast.error("태그를 등록해주세요.");
      return false;
    }

    if (spots.length === 0 && !isTemporary) {
      toast.error("스팟을 등록해주세요.");
      return false;
    }

    return true;
  };

  // 임시저장 버튼 클릭시 제출 로직
  const submitTemporarySelection = () => {
    const isValidationPassed = validateSelection(true);
    if (!isValidationPassed) {
      return;
    }

    const formData = new FormData();
    formData.append("status", "temp");
    formData.append("title", title);

    if (description) {
      formData.append("description", description);
    }

    if (category) {
      formData.append("category", category.id.toString());
    }

    if (location && subLocation) {
      formData.append(
        "location",
        JSON.stringify({
          location: location.id,
          subLocation: subLocation.id
        })
      );
    }

    if (selectionPhoto) {
      formData.append("img", selectionPhoto);
    }

    if (hashtags.length > 0) {
      formData.append("hashtags", JSON.stringify(hashtags));
    }

    const spotsPhotos: TTemporarySpotPhotoStorage = separateSpotPhotos(
      spots,
      formData
    );
    formData.append("spots", JSON.stringify(spots));

    setIsSubmitting(true);
    submitSelection(formData)
      .then((res) => {
        toast.success("셀렉션 미리저장이 성공적으로 되었습니다.");
        router.push("/");
        reset();
      })
      .catch((err) => {
        toast.error("미리저장에 실패했습니다.");
        setIsSubmitting(false);
        restoreSpotPhotos(spots, spotsPhotos);
      });
  };

  const submitCompleteSelection = () => {
    const isValidationPassed = validateSelection();
    if (!isValidationPassed) {
      return;
    }

    const formData = new FormData();
    formData.append("status", "public");
    formData.append("title", title);
    formData.append("description", description);

    if (category) {
      formData.append("category", category.id.toString());
    }

    if (location && subLocation) {
      formData.append(
        "location",
        JSON.stringify({
          location: location.id,
          subLocation: subLocation.id
        })
      );
    }

    if (selectionPhoto) {
      formData.append("img", selectionPhoto);
    }

    formData.append("hashtags", JSON.stringify(hashtags));

    const spotsPhotos: TTemporarySpotPhotoStorage = separateSpotPhotos(
      spots,
      formData
    );
    formData.append("spots", JSON.stringify(spots));

    setIsSubmitting(true);
    submitSelection(formData)
      .then((res) => {
        toast.success("셀렉션이 성공적으로 등록되었습니다.");
        router.push("/");
        reset();
      })
      .catch((err) => {
        toast.error("제출에 실패했습니다.");
        setIsSubmitting(false);
        restoreSpotPhotos(spots, spotsPhotos);
      });
  };

  // 바이너리인 사진 파일을 FormData에 추가하고, spots 배열에서 사진을 제거하는 함수
  function separateSpotPhotos(
    spots: ISelectionSpot[],
    formData: FormData
  ): TTemporarySpotPhotoStorage {
    const spotsPhotos: TTemporarySpotPhotoStorage = [];

    if (spots.length > 0) {
      const cloneSpots: ISelectionSpot[] = [];

      spots.forEach((spot) => {
        const images = spot.photos;
        for (let j = 0; j < images.length; j++) {
          formData.append(`spots[${spot.placeId}][photos][${j}]`, images[j]);
        }
        spotsPhotos.push(images);
        const clone = { ...spot, photos: [] };
        cloneSpots.push(clone);
      });

      setSpots(cloneSpots);
    }

    return spotsPhotos;
  }

  // 서브미션 실패시 FormData로 분리한 사진을 다시 spots 배열에 복원하는 함수
  function restoreSpotPhotos(
    spots: ISelectionSpot[],
    spotsPhotos: TTemporarySpotPhotoStorage
  ): void {
    const cloneSpots = spots.map((spot, i) => {
      return { ...spot, photos: spotsPhotos[i] };
    });

    setSpots(cloneSpots);
  }

  return {
    isSubmitting,
    submitCompleteSelection,
    submitTemporarySelection
  };
};

export default useSubmitSelectionCreateForm;
