import { useContext } from "react"

import { ShopContext } from "../components/Shop"

function useShop() {
    return useContext(ShopContext)
}

export default useShop
