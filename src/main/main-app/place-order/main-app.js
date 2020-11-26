import React, { Component } from "react";
import Loader from "../../assets/components/loader/loader";
import { getMyOrder, setMyOrder, _database } from "../../../config";
import "./main-app.css";
import MyOrder from "./my-order/my-order";
const dict = require("collections/_dict").Dict;
export default class OrderApp extends Component {
  constructor() {
    super();
    this.state = {
      activeComponent: AvailableMenu,
      subComponent: false,
      activeTitle: "Point Of Sale",
      backFunction: async () => {},
    };
  }
  render() {
    return (
      <div className="app-body">
        <p className="unselectable app-title" role="img">
          <span role="img" aria-label="burger" style={{ marginTop: "10px" }}>
            {this.state.activeTitle}
          </span>
        </p>

        {this.state.subComponent === false ? (
          ""
        ) : (
          <div className="app-control">
            <div className="control-btn" onClick={this.state.backFunction}>
              <img
                alt=""
                className="unselectable"
                src={require("../../assets/drawables/close.png")}
              />
            </div>
          </div>
        )}
        <div className="content">
          {
            <this.state.activeComponent
              orderId={this.props.orderId}
              tableId={this.props.tableId}
              closeToast={this.props.closeToast}
              showTimedToast={this.props.showTimedToast}
              showUnTimedToast={this.props.showUnTimedToast}
              backFunction={async (x, b, t) => {
                await setTimeout(() => {
                  this.setState({
                    activeComponent: x,
                    subComponent: b,
                    activeTitle: t,
                  });
                }, 100);
              }}
              setBackFunc={(x) => {
                this.setState({ backFunction: x });
              }}
              setActiveComponent={(x, b, t, f) => {
                this.setState({
                  activeComponent: () => {
                    return <div />;
                  },
                });
                setTimeout(() => {
                  this.setState({
                    activeComponent: x,
                    subComponent: b,
                    activeTitle: t,
                    backFunction: f,
                  });
                }, 100);
              }}
            />
          }
        </div>
      </div>
    );
  }
}
const categories = [
  {
    catDp: require("../../assets/drawables/breakfast.png"),
    catId: "0",
    catName: "BreakFast",
  },
  {
    catDp: require("../../assets/drawables/chicken.png"),
    catId: "1",
    catName: "Full Meals",
  },
  {
    catDp: require("../../assets/drawables/fruit.png"),
    catId: "2",
    catName: "Juices and Fruits",
  },
  {
    catDp: require("../../assets/drawables/ice-cream.png"),
    catId: "3",
    catName: "Snacks and Dessert",
  },
];
export class AvailableMenu extends Component {
  constructor() {
    super();
    this.state = {
      menuList: 0,
      loaded: false,
      myOrder: new dict(),
      _0: [],
      _1: [],
      _2: [],
      _3: [],
    };
  }
  async componentDidMount() {
    if (getMyOrder() !== null) {
      this.setState({ myOrder: getMyOrder() });
    }
    await _database.ref("menu").on("value", (data) => {
      var _0 = [];
      data
        .child("menu-cat")
        .child(0)
        .forEach((x) => {
          const i = data.child("menu-items").child(x.key).val();
          _0.push(i);
        });
      var _1 = [];
      data
        .child("menu-cat")
        .child(1)
        .forEach((x) => {
          const i = data.child("menu-items").child(x.key).val();
          _1.push(i);
        });
      var _2 = [];
      data
        .child("menu-cat")
        .child(2)
        .forEach((x) => {
          const i = data.child("menu-items").child(x.key).val();
          _2.push(i);
        });
      var _3 = [];
      data
        .child("menu-cat")
        .child(3)
        .forEach((x) => {
          const i = data.child("menu-items").child(x.key).val();
          _3.push(i);
        });
      this.setState({
        _0: _0,
        _1: _1,
        _2: _2,
        _3: _3,
        loaded: true,
      });
    });
  }
  categoryComponent(d, i) {
    return (
      <div
        className={
          this.state.menuList === i ? "cat-nav-btn selected" : "cat-nav-btn"
        }
        onClick={async () => {
          if (this.state.menuList !== i) {
            this.setState({ menuList: 5 });
            await setTimeout(() => {
              this.setState({ menuList: i });
            }, 100);
          }
        }}
      >
        <img className="unselectable" alt="" src={d.catDp} />
        <p className="unselectable">{d.catName}</p>
      </div>
    );
  }
  menuComponnet(d, i) {
    return (
      <div
        className="menu-item"
        onClick={async () => {
          this.props.closeToast();
          await setTimeout(async () => {
            const x = this.state.myOrder;
            x.set(d.itemId, d);
            this.props.showTimedToast(d.itemName + " added to your order");
            this.setState({ myOrder: x });
          }, 100);
        }}
      >
        <img src={d.itemDp} alt="" className="unselectable" />
        <p className="unselectable">{d.itemName}</p>
        <h4 className="unselectable">{d.price}</h4>
      </div>
    );
  }
  render() {
    return this.state.loaded === false ? (
      <Loader />
    ) : (
      <div className="menu-body">
        <p className="unselectable title">Menu Categories</p>
        <div className="cat-nav-bar">
          {this.categoryComponent(categories[0], 0)}
          {this.categoryComponent(categories[1], 1)}
          {this.categoryComponent(categories[2], 2)}
          {this.categoryComponent(categories[3], 3)}
        </div>
        <p className="unselectable title">Menu Items</p>
        {this.state.menuList === 0 ? (
          <div className="cat-menu-items">
            {this.state._0.map((d, i) => {
              return this.menuComponnet(d, i);
            })}
            <div style={{ marginTop: "50px" }} />
          </div>
        ) : this.state.menuList === 1 ? (
          <div className="cat-menu-items">
            {this.state._1.map((d, i) => {
              return this.menuComponnet(d, i);
            })}
            <div style={{ marginTop: "50px" }} />
          </div>
        ) : this.state.menuList === 2 ? (
          <div className="cat-menu-items">
            {this.state._2.map((d, i) => {
              return this.menuComponnet(d, i);
            })}
            <div style={{ marginTop: "50px" }} />
          </div>
        ) : this.state.menuList === 3 ? (
          <div className="cat-menu-items">
            {this.state._3.map((d, i) => {
              return this.menuComponnet(d, i);
            })}
            <div style={{ marginTop: "50px" }} />
          </div>
        ) : (
          ""
        )}
        <div className="menu-options">
          {this.state.myOrder.length !== 0 ? (
            <div
              className="floating-btn"
              onClick={async () => {
                setMyOrder(this.state.myOrder);
                await setTimeout(async () => {
                  await this.props.setActiveComponent(MyOrder, true, "Order");
                }, 100);
              }}
            >
              <img
                className="unselectable"
                alt=""
                src={require("../../assets/drawables/order.png")}
              />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}
