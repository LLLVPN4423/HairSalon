import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import Shop from "./pages/Shop";
import ItemDetail from "./pages/ItemDetail";
import Cart from "./pages/Cart";

export const router = createBrowserRouter([
  { path: "/", Component: Home },
  { path: "/booking", Component: Booking },
  { path: "/shop", Component: Shop },
  { path: "/item/:type/:id", Component: ItemDetail },
  { path: "/cart", Component: Cart },
]);