import React, { Component } from "react";
import { Redirect, useParams } from "react-router-dom";
import OrderApp from "./main-app";
import "./place-order.css";
import Toast, { toast } from "../../assets/components/toast/toast";
import { _database } from "../../../config";
import Loader from "../../assets/components/loader/loader";

class Order extends Component {
  state = { toast: toast, valid: false, loaded: false, t: [] };
  async componentDidMount() {
    const t = this.props.orderId + "";
    const _t = t.split("&t=");
    if (_t.length === 2) {
      const i = (
        await _database.ref("transactions").child(_t[1]).once("value")
      ).val();
      if (i && _t[0] === i) {
        this.setState({ valid: true, t: _t });
      }
    }
    this.setState({ loaded: true });
  }
  showTimedToast(message) {
    const toast = {
      showToast: true,
      toastMessage: message,
      toastTimed: true,
    };
    this.setState({ toast: toast });
  }
  showUnTimedToast() {
    const toast = {
      showToast: true,
      toastTimed: false,
    };
    this.setState({ toast: toast });
  }
  closeToast() {
    const toast = {
      showToast: false,
      toastMessage: this.state.toast.toastMessage,
      toastTimed: true,
    };
    this.setState({ toast: toast });
  }
  render() {
    return (
      <>
        {this.state.loaded === false ? (
          <Loader />
        ) : this.state.valid === true ? (
          <OrderApp
            orderId={this.state.t[0]}
            tableId={this.state.t[1]}
            closeToast={this.closeToast.bind(this)}
            showTimedToast={this.showTimedToast.bind(this)}
            showUnTimedToast={this.showUnTimedToast.bind(this)}
          />
        ) : (
          <Redirect />
        )}
        {this.state.toast.showToast ? (
          <Toast
            timed={this.state.toast.toastTimed}
            message={this.state.toast.toastMessage}
            closeToast={this.closeToast.bind(this)}
          />
        ) : (
          ""
        )}
      </>
    );
  }
}

export const PlaceOrder = () => {
  let { id } = useParams();
  return <Order orderId={id} />;
};
