import React from "react";
import { CardElement } from "react-stripe-elements";

const CARD_ELEMENT_OPTIONS = {
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "#c4f0ff",
      color: "#fff",
      fontWeight: 500,
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": { color: "#fce883" },
      "::placeholder": { color: "#87bbfd" },
    },
    invalid: {
      iconColor: "#ffc7ee",
      color: "#ffc7ee",
    },
  },
};

function CardSection() {
  return (
    <label>
      <p> Card details</p>
      <fieldset className="FormGroup">
        <div className="FormRow">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </fieldset>
    </label>
  );
}

export default CardSection;
