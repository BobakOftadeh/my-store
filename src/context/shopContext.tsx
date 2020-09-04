import React, { Component } from "react";
import Client from "shopify-buy";

const DOMAIN = process.env.REACT_APP_STORE_URL as string;
const ACESSTOKEN = process.env.REACT_APP_STOREFRONT_API as string;

const ShopContext = React.createContext<any>({
  products: [],
  product: {},
  checkout: {},
  isCartOpen: false,
  test: "test",
});

const client = Client.buildClient({
  domain: DOMAIN,
  storefrontAccessToken: ACESSTOKEN,
});

type checkoutResponse = {
  id: string;
};

type product = {
  id: string;
  title: string;
};

interface IState {
  products: product[];
  product: {};
  checkout: { id: string };
  isCartOpen: boolean;
  test: "test";
}

class shopProvider extends Component {
  state: IState = {
    products: [],
    product: {},
    checkout: { id: "" },
    isCartOpen: false,
    test: "test",
  };

  componentDidMount() {
    this.createCheckout();
  }

  createCheckout = async () => {
    const checkout = await client.checkout.create();
    this.setState({ checkout: checkout });
  };

  addItemToCheckout = async (variantId: number, quantity: string) => {
    const lineItemsToAdd = [
      {
        variantId,
        quantity: parseInt(quantity, 10),
      },
    ];

    const checkout = await client.checkout.addLineItems(
      this.state.checkout.id,
      lineItemsToAdd
    );

    this.setState({ checkout: checkout });
  };

  fetchAllProducts = async () => {
    const products = await client.product.fetchAll();
    this.setState({ products: products });
  };

  fetchProductWithId = async (id: string) => {
    const product = await client.product.fetch(id);
    this.setState({ product: product });
  };

  closeCart = async () => {
    this.setState({ isCartOpen: false });
  };

  openCart = async () => {
    this.setState({ isCartOpen: true });
  };

  render() {
    return (
      <ShopContext.Provider
        value={{
          ...this.state,
          fetchAllProducts: this.fetchAllProducts,
          fetchProductWithId: this.fetchProductWithId,
          closeCart: this.closeCart,
          openCart: this.openCart,
          addItemToCheckout: this.addItemToCheckout,
        }}
      >
        {this.props.children}
      </ShopContext.Provider>
    );
  }
}

const ShopConsumer = ShopContext.Consumer;

export { ShopConsumer, ShopContext };

export default shopProvider;