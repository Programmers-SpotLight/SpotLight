import { TModalSize, TmodalType } from '@/models/modal.model';
import { useModalStore } from '@/stores/modalStore';
import React, { ReactNode, useState } from 'react'
import { useStore } from 'zustand';
import TextInput from '../common/input/TextInput';
import Button from '../common/button/Button';
import { signIn } from 'next-auth/react';

interface ImodalDatas {
  type: TmodalType;
  title: string;
  size: TModalSize;
  overlayClose: boolean;
}

const modalDatas: ImodalDatas[] = [
  {
    type: "signup",
    title: "",
    size: "small",
    overlayClose: false,
  }
];
const ModalSignUp = () => {
  const { isOpen, closeModal, modalType, props } = useStore(useModalStore);
  if (!isOpen) return null;

  const findModal = modalDatas.find((modal) => modal.type === modalType);
  if (!findModal) return null;

  const { title, size, overlayClose } = findModal;
  const { uid, provider} = props as { uid: string; provider: string; };
  const [nickname, setNickname] = useState("");

  // const handleOverlayClick = () => {
  //   closeModal();
  // };
  
  const handleSignUp = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 사용자 정보 DB에 저장
    const response = fetch('/api/users/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_uid: uid,
        user_type: provider,
        user_nickname: nickname,
      })
    }).then((response) => {
      if (response.ok) {
        // 회원가입 완료 후 로그인
        const providerString = Array.isArray(provider) ? provider[0] : provider;
        response.json().then(successData => {
          // console.log('회원가입 성공:', successData);
        });
        return signIn(providerString, { callbackUrl: '/' });
      } else {
        response.json().then(errorData => {
          // console.error('회원가입 실패:', errorData);
          throw new Error(errorData.error); // 에러를 던져서 아래에서 처리 가능
        });
      }
    })
    .catch((error) => {
      // console.error('오류 발생:', error);
    });
  };

  return (
    <div className="text-center">
      <div className='modal-title mb-4'>
        <h3 className="text-primary text-large font-bold mb-2.5">Spotlight</h3>
        <span className='text-lg text-center text-medium pb-3 font-bold'>스포트라이트가 처음이신가요?</span>
      </div>
      <form onSubmit={handleSignUp}>
        <div className='mb-2'>
          <TextInput 
            width="full"
            height='small'
            placeholder='닉네임을 입력해주세요 (최대 12자)'
            value={nickname}
            onChange={(e)=>{
              setNickname(e.target.value)
            }}
        />
        </div>
        <div className='h-4 mb-2'>
          
        </div>
        <Button 
          type="submit"
          color='primary'
          size='small'
        >등록</Button>
      </form>
    </div>
  )
}

export default ModalSignUp;