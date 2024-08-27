import { QUERY_KEY } from "@/constants/queryKey.constants";
import {
  IReCAPTCHAContextType,
  useReCAPTCHA
} from "@/context/ReCAPTCHAProvider";
import {
  submitCompleteSelection,
  submitTemporarySelection
} from "@/http/selectionCreate.api";
import {
  submitSelectionEdit,
  submitTemporarySelectionEdit
} from "@/http/selectionEdit.api";
import { ISelectionSpot } from "@/models/selection.model";
import { useSelectionCreateStore } from "@/stores/selectionCreateStore";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { useStore } from "zustand";

type TTemporarySpotImageStorage = Array<Array<File | string>>;

const useSubmitSelectionCreateForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const { execute } = useReCAPTCHA() as IReCAPTCHAContextType;

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
  const prepareAndSubmitTemporarySelection = async () => {
    if (!isTemporary && id) {
      toast.error("이미 제출된 셀렉션은 임시저장할 수 없습니다.");
      return;
    }

    const isValidationPassed = validateSelection(true);
    if (!isValidationPassed) {
      return;
    }

    const formData = new FormData();

    const token = await execute("submit");
    if (!token) {
      toast.error("ReCAPTCHA 검증에 실패했습니다. 다시 시도해주세요.");
      return;
    }

    formData.append("reCaptchaV3Token", token);
    formData.append("status", "temp");
    formData.append("title", title);

    if (description) {
      formData.append("description", description);
    }

    if (category?.id) {
      formData.append("category", category.id.toString());
    }

    if (location?.id && subLocation?.id) {
      formData.append(
        "location",
        JSON.stringify({
          location: location.id,
          subLocation: subLocation.id
        })
      );
    }

    if (selectionImage) {
      formData.append("img", selectionImage);
    }

    if (hashtags.length > 0) {
      formData.append("hashtags", JSON.stringify(hashtags));
    }

    let spotImages: TTemporarySpotImageStorage = [];
    if (spots.length > 0) {
      spotImages = await separateSpotImages(spots, formData);
      formData.append("spots", JSON.stringify(spots));
    }

    setIsSubmitting(true);
    if (isTemporary && id) {
      handleSubmitTemporarySelectionEdit(formData, spotImages);
    } else {
      handleSubmitTemporarySelection(formData, spotImages);
    }
  };

  const prepareAndSubmitCompleteSelection = async () => {
    const isValidationPassed = validateSelection();
    if (!isValidationPassed) {
      return;
    }

    const formData = new FormData();

    const token = await execute("submit");
    if (!token) {
      toast.error("ReCAPTCHA 검증에 실패했습니다. 다시 시도해주세요.");
      return;
    }

    formData.append("reCaptchaV3Token", token);
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
      formData.append("img", selectionImage);
    }

    formData.append("hashtags", JSON.stringify(hashtags));

    const spotImages: TTemporarySpotImageStorage = await separateSpotImages(
      spots,
      formData
    );
    formData.append("spots", JSON.stringify(spots));

    setIsSubmitting(true);
    if (id && !isTemporary) {
      handleSubmitSelectionEdit(formData, spotImages);
    } else {
      handleSubmitSelection(formData, spotImages);
    }
  };

  // 바이너리인 사진 파일을 FormData에 추가하고, spots 배열에서 사진을 제거하는 함수
  async function separateSpotImages(
    spots: ISelectionSpot[],
    formData: FormData
  ): Promise<TTemporarySpotImageStorage> {
    const spotImages: TTemporarySpotImageStorage = [];
    if (spots.length > 0) {
      const cloneSpots: ISelectionSpot[] = [];

      for (const spot of spots) {
        let images: (string | File)[] = [];

        if (!spot.images || !spot.images.length) {
          images = await getSpotGoogleImages(spot);
        } else {
          images = spot.images;
        }

        for (let j = 0; j < images.length; j++) {
          formData.append(`spots[${spot.placeId}][images][${j}]`, images[j]);
        }

        spotImages.push(images);
        const clone = { ...spot, images: [] };
        cloneSpots.push(clone);
      }
      setSpots(cloneSpots);
    }

    return spotImages;
  }

  // 서브미션 실패시 FormData로 분리한 사진을 다시 spots 배열에 복원하는 함수
  function restoreSpotImages(
    spots: ISelectionSpot[],
    spotImages: TTemporarySpotImageStorage
  ): void {
    const cloneSpots = spots.map((spot, i) => {
      return { ...spot, images: spotImages[i] };
    });

    setSpots(cloneSpots);
  }

  // 셀렉션 추가 함수
  function handleSubmitSelection(
    formData: FormData,
    spotImages: TTemporarySpotImageStorage
  ) {
    if (id && isTemporary) formData.append("temp_id", id.toString());

    submitCompleteSelection(formData)
      .then((res) => {
        toast.success("셀렉션이 성공적으로 등록되었습니다.");
        router.push("/");
        reset();
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.SELECTION],
          exact: false
        });
      })
      .catch((err) => {
        if (err.response?.data?.error) {
          toast.error(err.response.data.error);
        } else {
          toast.error("미리저장에 실패했습니다.");
        }
        setIsSubmitting(false);
        restoreSpotImages(spots, spotImages);
      });
  }

  // 셀렉션 수정 제출 함수
  function handleSubmitSelectionEdit(
    formData: FormData,
    spotImages: TTemporarySpotImageStorage
  ) {
    submitSelectionEdit(id, formData)
      .then((res) => {
        toast.success("셀렉션 수정이 성공적으로 되었습니다.");
        router.push("/");
        reset();
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.SELECTION],
          exact: false
        });
      })
      .catch((err) => {
        if (err.response?.data?.error) {
          toast.error(err.response.data.error);
        } else {
          toast.error("미리저장에 실패했습니다.");
        }
        setIsSubmitting(false);
        restoreSpotImages(spots, spotImages);
      });
  }

  // 미리저장 셀렉션 추가 함수
  function handleSubmitTemporarySelection(
    formData: FormData,
    spotImages: TTemporarySpotImageStorage
  ) {
    submitTemporarySelection(formData)
      .then((res) => {
        toast.success("셀렉션 미리저장이 성공적으로 되었습니다.");
        router.push("/");
        reset();
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.SELECTION],
          exact: false
        });
      })
      .catch((err) => {
        if (err.response?.data?.error) {
          toast.error(err.response.data.error);
        } else {
          toast.error("미리저장에 실패했습니다.");
        }
        setIsSubmitting(false);
        restoreSpotImages(spots, spotImages);
      });
  }

  // 미리저장 셀렉션 수정 제출 함수
  function handleSubmitTemporarySelectionEdit(
    formData: FormData,
    spotImages: TTemporarySpotImageStorage
  ) {
    submitTemporarySelectionEdit(id, formData)
      .then((res) => {
        toast.success("셀렉션 미리저장 수정이 성공적으로 되었습니다.");
        router.push("/");
        reset();
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.SELECTION],
          exact: false
        });
      })
      .catch((err) => {
        if (err.response?.data?.error) {
          toast.error(err.response.data.error);
        } else {
          toast.error("미리저장에 실패했습니다.");
        }
        setIsSubmitting(false);
        restoreSpotImages(spots, spotImages);
      });
  }

  async function getSpotGoogleImages(spot: ISelectionSpot) {
    const { Place } = (await google.maps.importLibrary(
      "places"
    )) as google.maps.PlacesLibrary;

    const place = new Place({ id: spot.placeId });

    await place.fetchFields({ fields: ["photos"] });

    if (place.photos && place.photos.length) {
      const newImages = place.photos.slice(0, 3).map((photo) => photo.getURI());
      return newImages;
    }
    return [];
  }

  return {
    isSubmitting,
    prepareAndSubmitTemporarySelection,
    prepareAndSubmitCompleteSelection
  };
};

export default useSubmitSelectionCreateForm;
