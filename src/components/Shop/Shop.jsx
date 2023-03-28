import React, { useEffect, useState } from "react";
import { addToDb, getShoppingCart } from "../../utilities/fakedb";
import Cart from "../Cart/Cart";
import Product from "../Product/Product";
import "./Shop.css";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch(`products.json`)
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  useEffect(() => {
    const storedCart = getShoppingCart();
    const savedCart = [];
    //step 1: get the id
    for (const id in storedCart) {
      //step 2: get the product by using id
      const addedProduct = products.find(product => product.id === id);
      if (addedProduct) {
        //step 3: get quantity of the product
        const quantity = storedCart[id];
        addedProduct.quantity = quantity;
        //step 4: add the added product to the saved cart
        savedCart.push(addedProduct);
      }
      //step 5: set the cart
      setCart(savedCart);
    }
  }, [products]);

  const handleAddToCart = product => {
    // const newCart = [...cart, product];
    let newCart = [];
    //if product doesn't exist in the cart, then set quantity =1;
    //if exist update the quantity by  1
    const exists = cart.find(pd => pd.id === product.id);
    if (!exists) {
      product.quantity = 1;
      newCart = [...cart, product];
    } else {
      exists.quantity = exists.quantity + 1;
      //get all the remaining product and update the one that exists
      const remaining = cart.filter(pd => pd.id !== product.id);
      newCart = [...remaining, exists];
    }
    setCart(newCart);
    addToDb(product.id);
  };

  return (
    <div className="shop-container">
      <div className="products-container">
        {products.map(product => (
          <Product handleAddToCart={handleAddToCart} product={product} key={product.id}></Product>
        ))}
      </div>
      <div className="cart-container">
        <Cart cart={cart}></Cart>
      </div>
    </div>
  );
};

export default Shop;
