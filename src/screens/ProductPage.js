import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, Col, Row } from "reactstrap";
import { Autocomplete, Select, Slider, TextField } from "@mui/material";
import { useGlobalContext } from "../App";
import { ShoppingCart } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const StateInit = {
  recoverProducts: [],
  products: [],
  colors: [],
  types: [],
  genders: ["Women", "Men"],
};

const ProductPage = () => {
  const navigate = useNavigate();
  const { products, cart, cartFunctions } = useGlobalContext();

  const [productState, setProductState] = useState({
    ...StateInit,
  });

  const [filters, setFilters] = useState({
    search: "",
    color: "",
    type: "",
    gender: "",
    priceRange: [0, 1000],
  });

  const pageFunctions = {
    onSearch: (event) => {
      let { value } = event.target;
      if (value) {
        setProductState((prev) => ({
          ...prev,
          products: prev.recoverProducts.filter((item) =>
            item.name.toLowerCase().includes(value.toLowerCase())
          ),
        }));
      }
    },
    onFilterSelect: (name, value) => {
      setFilters((prev) => ({
        ...prev,
        [name]: value || "",
      }));
    },
  };

  useEffect(() => {
    let colors = [];
    let types = [];

    products.forEach((item) => {
      if (!colors.includes(item.color)) colors.push(item.color);

      if (!types.includes(item.type)) types.push(item.type);
    });

    setProductState((prev) => ({
      ...prev,
      recoverProducts: products,
      colors,
      products,
      types,
    }));
  }, [products]);

  useEffect(() => {
    const range = filters.priceRange;
    const products = productState.recoverProducts;

    const { search, color, type, gender } = filters;
    if (search || color || type || gender) {
      let filtered = products.filter(
        (item) =>
          item.name.toLowerCase().includes(filters.search.toLowerCase()) &&
          item.color.toLowerCase().includes(filters.color.toLowerCase()) &&
          item.type.toLowerCase().includes(filters.type.toLowerCase()) &&
          item.gender.toLowerCase().includes(filters.gender.toLowerCase()) &&
          item.price > range[0] &&
          item.price < range[1]
      );

      setProductState((prev) => ({
        ...prev,
        products: filtered,
      }));
    }
  }, [filters]);

  return (
    <Row className="p-4">
      <div className="d-flex gap-3 flex-column ">
        <Row>
          <Col lg={3}>
            <TextField
              size="small"
              placeholder="Search products"
              className="w-100"
              onChange={(e) =>
                pageFunctions.onFilterSelect("search", e.target.value)
              }
            />
          </Col>
          <Col lg={2}>
            <Autocomplete
              size="small"
              onChange={(e, value) =>
                pageFunctions.onFilterSelect("color", value)
              }
              options={productState.colors}
              renderInput={(params) => <TextField {...params} label="Colors" />}
            />
          </Col>
          <Col lg={2}>
            <Autocomplete
              size="small"
              onChange={(e, value) =>
                pageFunctions.onFilterSelect("type", value)
              }
              options={productState.types}
              renderInput={(params) => <TextField {...params} label="Type" />}
            />
          </Col>
          <Col lg={2}>
            <Autocomplete
              size="small"
              onChange={(e, value) =>
                pageFunctions.onFilterSelect("gender", value)
              }
              options={productState.genders}
              renderInput={(params) => <TextField {...params} label="Gender" />}
            />
          </Col>
          <Col>
            <label>Price Range</label>
            <Slider
              getAriaLabel={() => "Price range"}
              value={filters.priceRange}
              onChange={(e, data) => {
                pageFunctions.onFilterSelect("priceRange", data);
              }}
              max={1000}
              valueLabelDisplay="auto"
              getAriaValueText={() => "Price range"}
            />
          </Col>
          <Col lg={1}>
            <ShoppingCart onClick={() => navigate("/cart")} />
          </Col>
        </Row>
        <div className="d-flex flex-wrap gap-3">
          {productState.products.map((item) => (
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
                <p>{item.name}</p>

                {cart.filter((prod) => prod.id === item.id).length === 0 ? (
                  <Button
                    className="ms-auto my-2"
                    onClick={() => cartFunctions.add(item)}
                  >
                    Add
                  </Button>
                ) : (
                  <p>Product Added to Cart</p>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </Row>
  );
};

export default ProductPage;
