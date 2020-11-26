import React, { Component } from "react";
import { getMyOrder, setMyReciept } from "../../../../config";
import CompletePayment from "../complete-payment/complete-payment";
import { AvailableMenu } from "../main-app";
import "./my-order.css";

const Dict = require("collections/_dict").Dict;

export default class MyOrder extends Component {
  constructor() {
    super();
    this.state = {
      reciept: new Dict(),
      myOrder: new Dict(),
    };
  }
  componentDidMount() {
    this.props.setBackFunc(async () => {
      this.setState({ myOrder: getMyOrder() });
      this.props.backFunction(AvailableMenu, false, "Point Of Sale");
    });
    const r = new Dict();
    getMyOrder().forEach((x) => {
      r.set(x.itemId, { qty: 1, price: x.price, itemId: x.itemId });
    });
    this.setState({ reciept: r, myOrder: getMyOrder() });
  }
  getRecieptTotal() {
    var t = 0;
    this.state.reciept.forEach((d, i) => {
      t = d.qty * d.price + t;
    });
    return t;
  }
  render() {
    return (
      <div className="order-body">
        {this.orderList()}
        <div className="footer">
          <p className="unselectable">Total: {this.getRecieptTotal()}</p>
          <p
            className="unselectable btn"
            onClick={async () => {
              setMyReciept(this.state.reciept);
              await this.props.setActiveComponent(
                CompletePayment,
                true,
                "Payment"
              );
            }}
          >
            Complete
          </p>
        </div>
      </div>
    );
  }
  orderList() {
    var x = [];
    this.state.myOrder.forEach((j, i) => {
      x.push(j);
    });
    return x.map((d, i) => {
      return this.orderItem(d, i);
    });
  }
  orderItem = (d, i) => {
    return (
      <div className="order-item">
        <div style={{ display: "flex" }}>
          <img src={d.itemDp} className="unselectable" alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p className="unselectable">{d.itemName}</p>
            <p style={{ marginTop: "-30px" }} className="unselectable">
              Price: {d.price}
            </p>
            <p style={{ marginTop: "-20px" }} className="unselectable">
              Qty: {this.state.reciept.get(d.itemId).qty}
            </p>
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <p
            className="unselectable btn minus"
            onClick={async () => {
              await setTimeout(() => {
                const x = this.state.reciept;
                const r = x.get(d.itemId);
                if (r.qty > 1) {
                  r.qty = r.qty - 1;
                } else {
                  const o = this.state.myOrder;
                  o.delete(d.itemId);
                  x.delete(d.itemId);
                  this.setState({
                    myOrder: o,
                  });
                  this.props.showTimedToast("Removed " + d.itemName);
                }
                x.set(d.itemId, r);
                this.setState({
                  reciept: x,
                });
              }, 100);
            }}
          >
            -
          </p>
          <div style={{ flex: "1", display: "flex", alignSelf: "center" }}>
            <p
              style={{ alignSelf: "center", textAlign: "center", margin: "0" }}
              className="unselectable"
            >
              Total:{" "}
              {this.state.reciept.get(d.itemId).qty *
                this.state.reciept.get(d.itemId).price}
            </p>
          </div>
          <p
            className="unselectable btn plus"
            onClick={async () => {
              await setTimeout(() => {
                const x = this.state.reciept;
                const r = x.get(d.itemId);
                r.qty = r.qty + 1;
                x.set(d.itemId, r);
                this.setState({
                  reciept: x,
                });
              }, 100);
            }}
          >
            +
          </p>
        </div>
      </div>
    );
  };
}
