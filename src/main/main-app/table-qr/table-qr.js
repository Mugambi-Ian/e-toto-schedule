import React, { Component } from "react";
import { useParams } from "react-router-dom";
import { _database } from "../../../config";
import Loader from "../../assets/components/loader/loader";
import "./table-qr.css";

var QRCode = require("qrcode.react");
class Table extends Component {
  constructor() {
    super();
    this.state = {
      urlLoaded: false,
      urlLink: "https://digital-sales-pos.web.app",
      updateView: false,
    };
  }
  async componentDidMount() {
    await _database.ref("transactions").on("value", async (d) => {
      await _database.ref("tables").once("value", async (ds) => {
        if (ds.hasChild(this.props.tableId)) {
          if (this.state.urlLoaded === false) {
            const key = (await _database.ref("transactions").push()).key;
            await _database
              .ref("transactions")
              .child(this.props.tableId)
              .set(key);
            this.setState({
              urlLoaded: true,
              urlLink:
                "https://digital-sales-pos.web.app/order=" +
                key +
                "&t=" +
                this.props.tableId,
            });
          } else {
            const key = d.child(this.props.tableId).val();
            var urlLink =
              "https://digital-sales-pos.web.app/order=" +
              key +
              "&t=" +
              this.props.tableId;
            this.setState({ updateView: true, urlLink: urlLink });
            await setTimeout(() => {
              this.setState({ updateView: false });
            }, 200);
          }
        }
      });
    });
  }
  render() {
    return (
      <div className="qr-body">
        {this.state.urlLoaded === false ? (
          <Loader />
        ) : this.state.updateView === true ? (
          ""
        ) : (
          <>
            <p>Scan the qr code to place your order.</p>
            <QRCode
              value={this.state.urlLink}
              style={{
                height: "50%",
                alignSelf: "center",
                width: "70%",
                marginTop: "20px",
                objectFit: "contain",
              }}
            />
          </>
        )}
      </div>
    );
  }
}

export const TableQr = () => {
  let { id } = useParams();
  return <Table tableId={id} />;
};
