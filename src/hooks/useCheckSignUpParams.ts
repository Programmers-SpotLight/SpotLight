import { useEffect } from "react";
import { useModalStore } from "@/stores/modalStore";

const useCheckSignUpParams = () => {
  const { openModal } = useModalStore();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const provider = urlParams.get('provider');
    const uid = urlParams.get('uid');

    if (uid && provider) {
      openModal('signup',{uid: uid, provider: provider});
    }
  }, [openModal]);
};

export default useCheckSignUpParams;