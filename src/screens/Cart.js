import React from "react";
import { Card, CardBody, Button, Col, CardTitle } from "reactstrap";
import { useGlobalContext } from "../App";
import { TextField } from "@mui/material";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";

const Cart = () => {
  const { cart, cartFunctions } = useGlobalContext();
  return (
    <div className="p-5">
      <h2>Cart </h2>
      <div className="d-flex flex-wrap gap-2 ">
        {cart.map((item, index) => (
          <Card
            key={item.id}
            style={{
              width: "15%",
            }}
          >
            <CardBody>
              <div style={{ height: "60%" }}>
                <img
                  src={item.imageURL}
                  alt="Product Image"
                  className="w-100 h-100"
                />
              </div>
              <div className="h-25">
                <p>{item.name}</p>

                <div className="d-flex justify-content-between align-items-center text-center ">
                  <p>Quantity:</p>
                  <RemoveCircleOutline
                    onClick={() =>
                      cartFunctions.handleSame(item, "remove", index)
                    }
                  />
                  {item.cartQuantity}
                  <AddCircleOutline
                    onClick={() => cartFunctions.handleSame(item, "add", index)}
                  />
                </div>
              </div>
              <p className="text-danger my-2">{item.error}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Cart;
