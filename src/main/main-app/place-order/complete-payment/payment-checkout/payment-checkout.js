import React from "react";
import CardSection from "./card-section";
import { getMyReciept } from "../../../../../config/index";
import { injectStripe } from "react-stripe-elements";
class CheckoutForm extends React.Component {
  handleSubmit = async (event) => {
    this.props.showTimedToast("Attempting Payment");
    const uId = this.props.orderId;
    let { token } = await this.props.stripe.createToken({ name: uId });
    const amount = this.getRecieptTotal();
    const url =
      "https://us-central1-digital-sales-pos.cloudfunctions.net/createStripeCharge?amount=" +
      amount +
      "&uid=" +
      uId;
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: JSON.stringify(token),
    })
      .then(async () => {
        this.props.closeToast();
        await setTimeout(() => {
          this.props.placeOrder();
        }, 100);
      })
      .catch(async (e) => {
        console.log(e);
        this.props.closeToast();
        await setTimeout(() => {
          this.props.showTimedToast("Payment Failed");
        }, 100);
      });
  };

  getRecieptTotal() {
    var t = 0;
    getMyReciept().forEach((d, i) => {
      t = d.qty * d.price + t;
    });
    return t;
  }
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <CardSection />
          <div
            disabled={!this.props.stripe}
            className="btn-pay"
            onClick={this.handleSubmit}
          >
            Pay {this.getRecieptTotal()}
          </div>
        </form>
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);
