import axios from "axios";
import "./App.css";
import { createContext, useContext, useEffect, useState } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import ProductPage from "./screens/ProductPage";
import Cart from "./screens/Cart";

const DATA_URL =
  "https://leaguex.s3.ap-south-1.amazonaws.com/task/shopping/catalogue.json";

const AppContext = createContext();

export function useGlobalContext() {
  return useContext(AppContext);
}

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    axios.get(DATA_URL).then((res) => {
      setProducts(res.data);
    });
  }, []);

  const cartFunctions = {
    add: (product) => {
      if (cart.findIndex((item) => item.id == product.id) < 0) {
        setCart((prev) => [...prev, { ...product, cartQuantity: 1 }]);
      }
    },
    remove: (item) => {
      let state = cart;
      let index = state.findIndex((child) => child.id === item.id);
      if (index > 0) {
        state.splice(index, 1);
      }
      setCart(state);
    },
    handleSame: (item, action, index) => {
      let state = cart;
      let product = state[index];

      if (action === "add") {
        if (product.quantity >= product.cartQuantity + 1) {
          product.cartQuantity = product.cartQuantity + 1;
          product.error = "";
        } else {
          product.error = "Out of stock";
        }
        state[index] = product;
      } else if (action === "remove") {
        if (0 < product.cartQuantity - 1) {
          product.cartQuantity = product.cartQuantity - 1;
          state[index] = product;
          product.error = "";
        } else {
          state.splice(index, 1);
        }
      }

      setCart([...state]);
    },
  };

  return (
    <AppContext.Provider value={{ products, cart, cartFunctions }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProductPage />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
