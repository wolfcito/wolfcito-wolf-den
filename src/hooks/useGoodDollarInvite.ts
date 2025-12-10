import { useEffect } from "react";

const INVITER_STORAGE_KEY = "gd_inviter_address";

export const useGoodDollarInvite = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const inviter = params.get("invite");

    if (inviter) {
      localStorage.setItem(INVITER_STORAGE_KEY, inviter);
    }
  }, []);

  const getInviter = () => {
    if (typeof window === "undefined") return null;
    return (
      localStorage.getItem(INVITER_STORAGE_KEY) ??
      "0x0000000000000000000000000000000000000000"
    );
  };

  return { getInviter, INVITER_STORAGE_KEY };
};
