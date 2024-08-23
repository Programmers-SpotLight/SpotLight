import React, { createContext, useContext, useEffect } from 'react';

export interface IReCAPTCHAContextType {
  execute: (action: string) => Promise<string>;
}

interface IReCAPTCHAProviderProps {
  children: React.ReactNode;
  siteKey: string;
}

// TS can't find the grecaptcha object on window, so we need to declare it
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

const ReCAPTCHAContext = createContext<IReCAPTCHAContextType | undefined>(undefined);

export const useReCAPTCHA = () => useContext(ReCAPTCHAContext);

export const ReCAPTCHAProvider : React.FC<IReCAPTCHAProviderProps> = ({ children, siteKey }) => {
  const [grecaptcha, setGrecaptcha] = React.useState<any>();

  const execute = async (action: string) => {
    if (!grecaptcha) {
      throw new Error('reCAPTCHA not ready');
    }
    return await grecaptcha.execute(siteKey, { action });
  }

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.addEventListener('load', () => {
      window.grecaptcha.ready(() => {
        setGrecaptcha(window.grecaptcha);
      })
    });
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [siteKey]);

  return (
    <ReCAPTCHAContext.Provider value={{ execute }}>
      {children}
    </ReCAPTCHAContext.Provider>
  );
};
