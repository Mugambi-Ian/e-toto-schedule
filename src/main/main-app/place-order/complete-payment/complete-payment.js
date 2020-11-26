import React, { Component } from "react";
import Loader from "../../../assets/components/loader/loader";
import { Elements } from "react-stripe-elements";

import { loadStripe } from "@stripe/stripe-js";
import {
  getDate,
  getMyOrder,
  getMyReciept,
  getTime,
  setMyOrder,
  setMyReciept,
  _database,
} from "../../../../config/index";
import { AvailableMenu } from "../main-app";
import MyOrder from "../my-order/my-order";
import "./complete-payment.css";
import "react-credit-cards/es/styles-compiled.css";
import InjectedCheckoutForm from "./payment-checkout/payment-checkout";
import { StripeProvider } from "react-stripe-elements";
import { Redirect } from "react-router-dom";
export default class CompletePayment extends Component {
  constructor() {
    super();
    this.state = {
      paymentMethod: false,
      activeScreen: "",
    };
  }
  componentDidMount() {
    this.props.setBackFunc(async () => {
      if (getMyOrder() != null) {
        this.props.backFunction(MyOrder, true, "Order");
      } else {
        this.props.backFunction(AvailableMenu, false, "Point of Sale");
      }
    });
  }
  render() {
    return (
      <div className="payment-body">
        {this.state.paymentMethod === null ? (
          ""
        ) : this.state.paymentMethod === false ? (
          <div className="payment-options">
            <div
              className="payment-options-btn"
              onClick={async () => {
                this.setState({ activeScreen: PlaceOrder });
                paymentMethod = "cash";
                await setTimeout(() => {
                  this.setState({ paymentMethod: true });
                }, 100);
              }}
            >
              <img
                alt=""
                src={require("../../../assets/drawables/cash.png")}
                className="unselectable"
              />
              <p className="unselectable">Cash</p>
            </div>
            <div
              className="payment-options-btn"
              onClick={async () => {
                this.setState({ activeScreen: CardPayment });
                paymentMethod = "card";
                await setTimeout(() => {
                  this.setState({ paymentMethod: true });
                }, 100);
              }}
            >
              <img
                alt=""
                src={require("../../../assets/drawables/credit-card.png")}
                className="unselectable"
              />
              <p className="unselectable">Credit Card</p>
            </div>
          </div>
        ) : (
          <this.state.activeScreen
            closeToast={this.props.closeToast}
            showTimedToast={this.props.showTimedToast}
            showUnTimedToast={this.props.showUnTimedToast}
            setBackFunc={this.props.setBackFunc}
            backFunction={this.props.backFunction}
            placeOrder={async () => {
              this.setState({ activeScreen: PlaceOrder, paymentMethod: null });
              await setTimeout(() => {
                this.setState({ paymentMethod: true });
              }, 100);
            }}
            orderId={this.props.orderId}
            tableId={this.props.tableId}
          />
        )}
      </div>
    );
  }
}
var paymentMethod = "";

const stripePromise = loadStripe("pk_test_2QUyZ9VRMe86jm8Gg3oQ1lqt00x1zLiucz");

class CardPayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cvc: "",
      expiry: "",
      focus: "",
      name: "",
      number: "",
      cardName: "",
    };
  }
  render() {
    return (
      <div className="card-payment-body">
        <h2
          className="unselectable"
          style={{ alignSelf: "center", textAlign: "center" }}
        >
          Enter Your Credit Card Info
        </h2>
        <img
          src={require("../../../assets/drawables/card.png")}
          alt=""
          className="unselectable"
          style={{
            width: "250px",
            margin: "20px",
            alignSelf: "center",
            objectFit: "contain",
          }}
        />
        <StripeProvider apiKey="pk_test_51HYSlqFP6hUFx8luXdsweOd4ENYGoFHIYsq4RPzPtBpSYo2pVtCNT40nHBqaHuwaQTZlb6f7PlhZkdo2suAX9Jnu00EHPlqmUp">
          <Elements stripe={stripePromise}>
            <InjectedCheckoutForm
              closeToast={this.props.closeToast}
              showTimedToast={this.props.showTimedToast}
              showUnTimedToast={this.props.showUnTimedToast}
              placeOrder={this.props.placeOrder}
            />
          </Elements>
        </StripeProvider>
      </div>
    );
  }
}

class PlaceOrder extends Component {
  constructor() {
    super();
    this.state = { loading: true };
  }
  async componentDidMount() {
    this.props.setBackFunc(async () => {
      this.props.backFunction(AvailableMenu, false, "Home 🍔");
    });
    const o = getMyReciept();
    const _o = [];
    o.forEach((element) => {
      _o.push(element);
    });
    const r = {
      orderItems: _o,
      date: getDate(),
      time: getTime(),
      orderId: "",
      paymentMethod: paymentMethod,
      status: "Placed",
    };
    r.orderId = this.props.orderId;
    await _database
      .ref("orders")
      .child("active-orders")
      .child(r.orderId)
      .set(r.orderId);
    await _database.ref("orders").child("store-orders").child(r.orderId).set(r);
    const key = (await _database.ref("transactions").push()).key;
    await _database.ref("transactions").child(this.props.tableId).set(key);
    setMyOrder(null);
    setMyReciept(null);
    this.setState({ loading: false });
    this.props.showTimedToast("Order Successfull");
  }
  render() {
    return (
      <div className="place-order-body">
        {this.state.loading === true ? <Loader /> : <Redirect to="/success" />}
      </div>
    );
  }
}
