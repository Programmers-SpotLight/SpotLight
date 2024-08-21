import { submitCompleteSelection, submitTemporarySelection } from "@/http/selectionCreate.api";
import { submitSelectionEdit, submitTemporarySelectionEdit } from "@/http/selectionEdit.api";
import { ISelectionSpot } from "@/models/selection.model";
import { useSelectionCreateStore } from "@/stores/selectionCreateStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { useStore } from "zustand";

type TTemporarySpotImageStorage = Array<Array<File | string>>;

const useSubmitSelectionCreateForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    id,
    isTemporary,
    title, 
    description, 
    category, 
    location, 
    subLocation,
    selectionImage, 
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

    if (!selectionImage && !isTemporary) {
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
  const prepareAndSubmitTemporarySelection = () => {
    if (!isTemporary && id) {
      alert('이미 제출된 셀렉션은 임시저장할 수 없습니다.');
      return;
    }

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

    if (category?.id) {
      formData.append('category', category.id.toString());
    }

    if (location?.id && subLocation?.id) {
      formData.append('location', JSON.stringify({
        location: location.id,
        subLocation: subLocation.id
      }));
    }

    if (selectionImage) {
      formData.append('img', selectionImage);
    }

    if (hashtags.length > 0) {
      formData.append("hashtags", JSON.stringify(hashtags));
    }

    let spotImages: TTemporarySpotImageStorage = [];
    if (spots.length > 0) { 
      spotImages = separateSpotImages(spots, formData);
      formData.append('spots', JSON.stringify(spots));
    }

    setIsSubmitting(true);
    if (isTemporary && id) {
      handleSubmitTemporarySelectionEdit(formData, spotImages);
    } else {
      handleSubmitTemporarySelection(formData, spotImages);
    }
  }

  const prepareAndSubmitCompleteSelection = () => {
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

    if (selectionImage) {
      formData.append('img', selectionImage);
    }

    formData.append("hashtags", JSON.stringify(hashtags));

    const spotImages: TTemporarySpotImageStorage = separateSpotImages(spots, formData);
    formData.append('spots', JSON.stringify(spots));

    if (id && isTemporary)
      formData.append('temp_id', id.toString());

    setIsSubmitting(true);
    if (id && !isTemporary) {
      handleSubmitSelectionEdit(formData, spotImages);
    } else {
      handleSubmitSelection(formData, spotImages);
    }
  }

  // 바이너리인 사진 파일을 FormData에 추가하고, spots 배열에서 사진을 제거하는 함수
  function separateSpotImages(
    spots: ISelectionSpot[], 
    formData: FormData
  ) : TTemporarySpotImageStorage {
    const spotImages: TTemporarySpotImageStorage = [];
    if (spots.length > 0) {
      const cloneSpots: ISelectionSpot[] = [];

      spots.forEach((spot) => {
        const images = spot.images;
        for (let j = 0; j < images.length; j++) {
          formData.append(`spots[${spot.placeId}][images][${j}]`, images[j]);
        }
        
        spotImages.push(images);
        const clone = {...spot, images: []};
        cloneSpots.push(clone);
      });

      setSpots(cloneSpots);
    }

    return spotImages;
  }

  // 서브미션 실패시 FormData로 분리한 사진을 다시 spots 배열에 복원하는 함수
  function restoreSpotImages (
    spots: ISelectionSpot[], 
    spotImages: TTemporarySpotImageStorage
  ) : void {
    const cloneSpots = spots.map((spot, i) => {
      return {...spot, images: spotImages[i]};
    });

    setSpots(cloneSpots);
  }

  function handleSubmitSelection(
    formData: FormData, 
    spotImages: TTemporarySpotImageStorage
  ) {
    submitCompleteSelection(
      formData,
    ).then((res) => {
      toast.success("셀렉션이 성공적으로 등록되었습니다.");
      router.push('/');
      reset();
    }).catch((err) => {
      toast.error('제출에 실패했습니다.');
      setIsSubmitting(false);
      restoreSpotImages(spots, spotImages);
    });
  }

  function handleSubmitSelectionEdit(
    formData: FormData, 
    spotImages: TTemporarySpotImageStorage
  ) {
    submitSelectionEdit(id, formData).then((res) => {
      toast.success('셀렉션 수정이 성공적으로 되었습니다.');
      router.push('/');
      reset();
    }).catch((err) => {
      toast.error('수정에 실패했습니다.');
      setIsSubmitting(false);
      restoreSpotImages(spots, spotImages);
    })
  }

  function handleSubmitTemporarySelection(
    formData: FormData, 
    spotImages: TTemporarySpotImageStorage
  ) {
    submitTemporarySelection(
      formData,
    ).then((res) => {
      toast.success('셀렉션 미리저장이 성공적으로 되었습니다.');
      router.push('/');
      reset();
    }).catch((err) => {
      toast.error('미리저장에 실패했습니다.');
      setIsSubmitting(false);
      restoreSpotImages(spots, spotImages);
    });
  }

  function handleSubmitTemporarySelectionEdit(
    formData: FormData, 
    spotImages: TTemporarySpotImageStorage
  ) {
    submitTemporarySelectionEdit(id, formData).then((res) => {
      toast.success('셀렉션 미리저장 수정이 성공적으로 되었습니다.');
      router.push('/');
      reset();
    }).catch((err) => {
      toast.error('미리저장 수정에 실패했습니다.');
      setIsSubmitting(false);
      restoreSpotImages(spots, spotImages);
    })
  }
    
  return {
    isSubmitting,
    prepareAndSubmitTemporarySelection,
    prepareAndSubmitCompleteSelection
  };
};

export default useSubmitSelectionCreateForm;
