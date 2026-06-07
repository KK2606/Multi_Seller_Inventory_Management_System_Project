import { createContext, useState } from "react";

export const Seller_Context = createContext();

function SellerProvider({ children }) {
    const [sellerKey, setSellerKey] = useState("");

    return (
        <Seller_Context.Provider
            value={{
                sellerKey,
                setSellerKey
            }}
        >
            {children}
        </Seller_Context.Provider>
    );
}

export default SellerProvider;