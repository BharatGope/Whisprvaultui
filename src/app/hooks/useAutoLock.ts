import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { useAppContext } from "../context/AppContext";

export function useAutoLock() {
  const {
    autoLockTimer,
    setAutoLockTimer,
    setIsUnlocked,
    autoLockDisplay,
  } = useAppContext();
  const navigate = useNavigate();

  const handleLock = useCallback(() => {
    setIsUnlocked(false);
    navigate("/unlock", { replace: true });
  }, [setIsUnlocked, navigate]);

  useEffect(() => {
    if (autoLockTimer <= 0) {
      return;
    }

    const id = setInterval(() => {
      setAutoLockTimer(autoLockTimer > 0 ? autoLockTimer - 1 : 0);

      if (autoLockTimer === 1) {
        handleLock();
      }
    }, 1000);

    return () => clearInterval(id);
  }, [autoLockTimer, handleLock]);

  return {
    timer: autoLockTimer,
    display: autoLockDisplay,
  };
}
