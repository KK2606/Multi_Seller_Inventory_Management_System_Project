import { useMemo, useState } from "react";
import { Seller_Context } from "./sellerContext";

function SellerProvider({ children }) {
  const [sellerKey, setSellerKey] = useState("");
  const value = useMemo(
    () => ({
      sellerKey,
      setSellerKey,
    }),
    [sellerKey]
  );

  return (
    <Seller_Context.Provider value={value}>
      {children}
    </Seller_Context.Provider>
  );
}

export default SellerProvider;
