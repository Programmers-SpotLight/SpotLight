import { useEffect } from "react";
import { useModalStore } from "@/stores/modalStore";

const useAuthMonitoring = (status: string) => {
  const { openModal } = useModalStore();

  useEffect(() => {
    if (status === "unauthenticated") {
      openModal('signin');
    }
  }, [status, openModal]);
};

export default useAuthMonitoring;