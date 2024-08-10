import { useState } from "react";


const useHashtagSuggestion = (text : string) => {
  // 나중에 API로 hook으로 분리 필요
  const [ hashtags, setHashtags ] = useState<string[]>([]);
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const [ success, setSuccess ] = useState<boolean | null>(null);
  const [ error, setError ] = useState<boolean | null>(null);

  const suggestHashtags = async () => {
    setIsLoading(true);
    setSuccess(false);
    setError(null);

    await new Promise((resolve) => setTimeout(resolve, 3000));
    // setHashtags([
    //   '해시태그1', '해시태그2', '해시태그3', '해시태그4', '해시태그5', '해시태그6', '해시태그7', '해시태그8',
    // ]);
    // setSuccess(true);

    setError(true);
    setIsLoading(false);
  };

  const deleteHashtag = (hashtag: string) => {
    setHashtags(hashtags => hashtags.filter((h) => h !== hashtag));
  }

  return {
    hashtags,
    isLoading,
    success,
    error,
    suggestHashtags,
    deleteHashtag,
  };
};

export default useHashtagSuggestion;