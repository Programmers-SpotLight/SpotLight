import { fetchHashtagSuggestions } from "@/http/selectionCreate.api";
import { useState } from "react";
import { toast } from "react-toastify";


const useHashtagSuggestion = () => {
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [error, setError] = useState<boolean | null>(null);

  const suggestHashtags = async (text: string) => {
    if (!text) {
      toast.error("프롬프트를 입력해주세요.");
      return;
    }

    if (text.length > 128) {
      toast.error("프롬프트는 128자 이하로 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setHashtags([]);
    setSuccess(false);
    setError(null);

    const formData = new FormData();
    formData.append("prompt", text);

    try {
      const responseData = await fetchHashtagSuggestions(formData);
      if (responseData && Array.isArray(responseData)) {
        setHashtags(responseData);
        setSuccess(true);
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.error("관련 해시태그를 불러오기 실패했습니다.");
      setError(true);
    }

    setIsLoading(false);
  };

  const deleteHashtag = (hashtag: string) => {
    setHashtags((hashtags) => hashtags.filter((h) => h !== hashtag));
  };

  return {
    hashtags,
    isLoading,
    success,
    error,
    suggestHashtags,
    deleteHashtag
  };
};

export default useHashtagSuggestion;
