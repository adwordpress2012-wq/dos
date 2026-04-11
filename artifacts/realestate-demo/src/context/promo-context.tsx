import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface PromoCtxValue {
  promoVisible: boolean;
  dismissPromo: () => void;
}

const PromoCtx = createContext<PromoCtxValue>({ promoVisible: true, dismissPromo: () => {} });

export function PromoProvider({ children }: { children: ReactNode }) {
  const [promoVisible, setPromoVisible] = useState(true);

  useEffect(() => {
    const h = promoVisible ? "40px" : "0px";
    document.documentElement.style.setProperty("--promo-h", h);
  }, [promoVisible]);

  return (
    <PromoCtx.Provider value={{ promoVisible, dismissPromo: () => setPromoVisible(false) }}>
      {children}
    </PromoCtx.Provider>
  );
}

export function usePromo() {
  return useContext(PromoCtx);
}
