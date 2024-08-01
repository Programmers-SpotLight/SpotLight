'use client';

import { useModalStore } from "@/stores/modalStore";
import { useStore } from "zustand";

export default function Home() {
  const { openModal } = useStore(useModalStore);



  return (
    <main className="flex gap-5">
      <button className="w-20 h-5 bg-slate-500 rounded-md" onClick={() => openModal("temp")}>모달 테스트 </button>
    </main>
  );
}
