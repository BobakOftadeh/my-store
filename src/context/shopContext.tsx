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
    //this.createCheckout();

    // check if local storage has checkout_id

    if (localStorage.checkout_id) {
      this.fetchCheckout(localStorage.checkout_id);
    } else {
      this.createCheckout();
    }

    //if no checkout_id in local storage, create new checkout
  }

  createCheckout = async () => {
    const checkout = await client.checkout.create();
    if (typeof checkout.id === "string") {
      localStorage.setItem("checkout_id", checkout.id);
    }

    this.setState({ checkout: checkout });
  };

  fetchCheckout = async (checkoutId: string) => {
    client.checkout
      .fetch(checkoutId)
      .then((checkout) => {
        this.setState({ checkout: checkout });
      })
      .catch((err) => console.log(err));
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

  removeItemFromCheckout = async (checkoutId: string, lineId: string[]) => {
    await client.checkout
      .removeLineItems(checkoutId, lineId)
      .then((checkout) => {
        this.setState({ checkout: checkout });
      });
  };

  updateItemInCheckout = async (
    checkoutId: string,
    lineItem: [{ id: string; quanitity: number }]
  ) => {
    await client.checkout
      // @ts-ignore
      .updateLineItems(checkoutId, lineItem)
      // @ts-ignore
      .then((checkout) => {
        // Do something with the updated checkout
        this.setState({ checkout: checkout });
      });
  };

  fetchAllProducts = async () => {
    const products = await client.product.fetchAll();
    this.setState({ products: products });
  };

  fetchProductWithId = async (id: string) => {
    const product = await client.product.fetch(id);
    this.setState({ product: product });
  };

  clearProduct = async () => {
    this.setState({ product: {} });
  };

  render() {
    return (
      <ShopContext.Provider
        value={{
          ...this.state,
          fetchAllProducts: this.fetchAllProducts,
          fetchProductWithId: this.fetchProductWithId,
          addItemToCheckout: this.addItemToCheckout,
          removeItemFromCheckout: this.removeItemFromCheckout,
          fetchCheckout: this.fetchCheckout,
          updateItemInCheckout: this.updateItemInCheckout,
          clearProduct: this.clearProduct,
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
