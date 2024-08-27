import React, { useEffect, useState } from "react";
import TextInput from "../../input/TextInput";
import Button from "../../button/Button";
import PictureInput from "../../input/PictureInput";
import { v4 as uuidv4 } from "uuid";
import { requestHandler } from "@/http/http";
import { useStore } from "zustand";
import { useModalStore } from "@/stores/modalStore";
import { useSendFeedback } from "@/hooks/queries/useSendFeedback";
import Spinner from "../../Spinner";
import {
  IReCAPTCHAContextType,
  useReCAPTCHA
} from "@/context/ReCAPTCHAProvider";
import { toast } from "react-toastify";

export interface IFeedbackFormData {
  type: string;
  title: string;
  contents: string;
  pictures: IReviewImage[];
  token: string;
}

const ModalFeedbackForm = () => {
  const { closeModal } = useStore(useModalStore);
  const { execute } = useReCAPTCHA() as IReCAPTCHAContextType;
  const [formData, setFormData] = useState<IFeedbackFormData>({
    type: "",
    title: "",
    contents: "",
    pictures: [],
    token: ""
  });
  const { send, isPending } = useSendFeedback(formData);

  const [errors, setErrors] = useState({
    type: "",
    title: "",
    contents: ""
  });

  useEffect(() => {
    if (formData.token) {
      send();
    }
  }, [formData.token]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePictureAdd = (image: string, index: number, type: string) => {
    setFormData((prevData) => ({
      ...prevData,
      pictures: [
        ...prevData.pictures,
        {
          reviewImgId: uuidv4(),
          reviewImgSrc: image,
          reviewImageOrder: prevData.pictures.length,
          imgType: type
        }
      ]
    }));
  };

  const handlePictureRemove = (index: number) => {
    setFormData((prevData) => ({
      ...prevData,
      pictures: [
        ...prevData.pictures
          .filter((_, i) => i !== index)
          .map((pic, i) => ({ ...pic, reviewImageOrder: i }))
      ]
    }));
  };

  const handlePictureChange = (index: number, newPicture: string) => {
    setFormData((prevData) => ({
      ...prevData,
      ...prevData.pictures.map((pic, i) =>
        i === index ? { ...pic, reviewImgSrc: newPicture } : pic
      )
    }));
  };

  const validate = () => {
    const newErrors: any = {};
    if (!formData.type || formData.type === "문의 유형을 선택해주세요") {
      newErrors.type = "유효한 유형을 선택해주세요.";
    }
    if (!formData.title) {
      newErrors.title = "제목을 입력해주세요.";
    }
    if (!formData.contents) {
      newErrors.contents = "내용을 입력해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const verifyBeforeSubmit = async () => {
    const token = await execute("submit");
    if (!token) {
      toast.error("ReCAPTCHA 검증에 실패했습니다. 다시 시도해주세요.");
      return;
    }
    setFormData((prevFormData) => ({ ...prevFormData, token }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      await verifyBeforeSubmit();
    }
  };

  return (
    <div>
      <p className="mb-5">
        SPOTLIGHT를 이용하면서 불편사항이나 개선사항을 알려주세요.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <fieldset className="flex flex-col gap-2">
          <label className="font-bold text-medium">유형</label>
          <select
            name="type"
            className="w-96 border rounded-lg text-medium p-3 focus:outline-none focus:border-1 resize-none"
            value={formData.type}
            onChange={handleChange}
          >
            <option>문의 유형을 선택해주세요</option>
            <option>서비스 칭찬</option>
            <option>서비스 불편/제안</option>
            <option>시스템 오류 제보</option>
          </select>
          {errors.type && (
            <span className="text-danger mt-1">{errors.type}</span>
          )}
        </fieldset>

        <fieldset className="flex flex-col gap-2">
          <label className="font-bold text-medium">제목</label>
          <TextInput
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="제목을 입력해주세요. (최대 180자)"
            width="medium"
            maxLength={180}
          />
          {errors.title && (
            <span className="text-danger mt-1">{errors.title}</span>
          )}
        </fieldset>

        <fieldset className="flex flex-col gap-2">
          <label className="font-bold text-medium">내용</label>
          <textarea
            name="contents"
            value={formData.contents}
            onChange={handleChange}
            className="border rounded-lg text-medium p-3 focus:outline-none focus:border-2 resize-none w-full h-72"
            placeholder="최소 10자 이상, 최대 1000자 이내로 작성하세요."
            minLength={10}
            maxLength={1000}
          />
          {errors.contents && (
            <span className="text-danger mt-1">{errors.contents}</span>
          )}
        </fieldset>

        <fieldset className="flex flex-col gap-2">
          <label className="font-bold text-medium">
            첨부 파일 (선택사항 최대 3개)
          </label>
          <div className="flex">
            {formData.pictures.length < 3 && (
              <PictureInput
                inputSize="small"
                onPictureChange={handlePictureAdd}
              />
            )}

            {formData.pictures.map((pic, index) => (
              <div key={index} className="px-1 inline-block relative">
                <PictureInput
                  inputSize="small"
                  imgSrc={pic.reviewImgSrc}
                  onPictureChange={(newPicture) =>
                    handlePictureChange(index, newPicture)
                  }
                  index={index}
                />
                <div
                  className="absolute top-2 right-2 cursor-pointer text-extraSmall text-white bg-grey4 rounded-full w-4 h-4 flex items-center justify-center hover:bg-grey3"
                  onClick={() => handlePictureRemove(index)}
                >
                  x
                </div>
              </div>
            ))}
          </div>
        </fieldset>

        <fieldset className="mx-auto">
          <Button
            type="submit"
            disabled={isPending}
            color={`${isPending ? "white" : "primary"}`}
          >
            {isPending ? <Spinner size="extraSmall" /> : "보내기"}
          </Button>
        </fieldset>
      </form>
    </div>
  );
};

export default ModalFeedbackForm;
