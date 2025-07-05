import { useEffect, useState } from "react";

export default function useHasPurchases() {
  const [hasPurchases, setHasPurchases] = useState(false);

  useEffect(() => {
    const purchases = JSON.parse(localStorage.getItem("purchases") || "[]");
    setHasPurchases(Array.isArray(purchases) && purchases.length > 0);
  }, []);

  return hasPurchases;
}