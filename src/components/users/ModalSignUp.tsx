import { TModalSize, TmodalType } from '@/models/modal.model';
import { useModalStore } from '@/stores/modalStore';
import React, { ReactNode, useRef, useState } from 'react'
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
  const [nickname, setNickname] = useState("");
  const [duplicateMessage, setDuplicateMessage] = useState("");
  const nickNameRef = useRef<HTMLInputElement>(null);
  
  const { isOpen, closeModal, modalType, props } = useStore(useModalStore);
  if (!isOpen) return null;
  
  const findModal = modalDatas.find((modal) => modal.type === modalType);
  if (!findModal) return null;
  
  const { uid, provider} = props as { uid: string; provider: string; };

  const handleSignUp = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // 사용자 정보 DB에 저장 및 로그인 처리
      const response = fetch('/api/users/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_uid: uid,
          user_type: provider,
          user_nickname: nickname,
        }),
      }).then((response)=> {
        response.json().then((res)=> {
          if(res.code ==='Nickname-duplicate'){
            setDuplicateMessage('이미 사용중인 닉네임입니다.')
            if (nickNameRef.current) {
              nickNameRef.current.focus(); // CustomComponent의 focus 메서드 호출
            }
          }
          if(res.error) {
            console.error(res);
          }
          closeModal();
          return signIn(provider, { callbackUrl: '/' });
        })
      })
    } catch (error) {
      console.error("Modal Signup error : "+error)
    }
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
            ref={nickNameRef}
            width="full"
            height='small'
            placeholder='닉네임을 입력해주세요 (최대 12자)'
            value={nickname}
            minLength={1} 
            maxLength={12} 
            onChange={(e)=>{
              setNickname(e.target.value);
              setDuplicateMessage('');
            }}
        />
        </div>
        <div className='h-4 mb-2 text-danger'>
          { duplicateMessage && <span>{duplicateMessage}</span> }
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