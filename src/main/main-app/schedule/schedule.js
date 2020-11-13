import React, { Component } from "react";
import { _database } from "../../../config";
import "./schedule.css";

export default class Schedule extends Component {
  state = {
    schedule: [],
    updatedSchedule: [],
  };
  getSortOrder(prop) {
    return function (a, b) {
      if (parseInt(a[prop]) > parseInt(b[prop])) {
        return 1;
      } else if (parseInt(a[prop]) < parseInt(b[prop])) {
        return -1;
      }
      return 0;
    };
  }

  async componentDidMount() {
    await _database.ref("schedule").on("value", async (as) => {
      const p = [];
      as.forEach((x) => {
        const z = x.val();
        z.vaccineId = x.key;
        p.push(z);
      });
      const _p = p.sort(this.getSortOrder("numOfDays"));
      this.setState({ schedule: _p, updatedSchedule: _p });
    });
  }
  render() {
    return (
      <div className="schedule-body">
        <img
          src={require("../../../assets/drawables/logo.png").default}
          alt=""
          className="logo unselectable"
        />
        <p className="title unselectable">Vaccination Schedule</p>
        <p className="sub-title unselectable">
          Make changes to the vaccination schedule
        </p>
        <div className="sheet">
          <div className="row title">
            <p className="num unselectable"></p>
            <p className="unselectable">Number of Days</p>
            <p className="unselectable">Vaccine Code</p>
            <p className="unselectable">Vaccine Name</p>
            <p className="unselectable"></p>
          </div>
          {this.state.schedule.map((x, i) => {
            return (
              <div className="row" key={i}>
                <p className="num unselectable">{i + 1}</p>
                <input
                  onChange={async (e) => {
                    x.numOfDays = parseInt(e.target.value);
                    const g = this.state.updatedSchedule;
                    const r = g[i];
                    r.numOfDays = x.numOfDays;
                    g[i] = r;
                    this.setState({ updatedSchedule: g, updated: true });
                  }}
                  value={x.numOfDays}
                  name={"Code"}
                  placeholder={"Number Of Days"}
                />
                <input
                  onChange={async (e) => {
                    x.vaccineCode = e.target.value;
                    const g = this.state.updatedSchedule;
                    const r = g[i];
                    r.vaccineCode = x.vaccineCode;
                    g[i] = r;
                    this.setState({ updatedSchedule: g, updated: true });
                  }}
                  value={x.vaccineCode}
                  name={"Code"}
                  placeholder={"Vaccine Code"}
                />
                <input
                  onChange={async (e) => {
                    x.vaccineName = e.target.value;
                    const g = this.state.updatedSchedule;
                    const r = g[i];
                    r.vaccineName = x.vaccineName;
                    g[i] = r;
                    this.setState({ updatedSchedule: g, updated: true });
                  }}
                  value={x.vaccineName}
                  name={"Vaccine"}
                  placeholder={"Vaccine Name"}
                />
                <div
                  className="delete"
                  onClick={async () => {
                    await setTimeout(async () => {
                      await _database
                        .ref("schedule")
                        .child(x.vaccineId)
                        .set(null);
                    }, 100);
                  }}
                >
                  <img
                    className="unselectable"
                    alt=""
                    src={
                      require("../../../assets/drawables/delete.png").default
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="options">
          <p
            className="unselectable"
            onClick={async () => {
              await setTimeout(async () => {
                const id = (await _database.ref("schedule").push()).key;
                const z = {
                  vaccineId: id,
                  vaccineName: "",
                  numOfDays: 0,
                  vaccineCode: "",
                };
                const u = this.state.updatedSchedule;
                u.push(z);
                this.setState({
                  updated: true,
                  updatedSchedule: u,
                  schedule: u,
                });
              }, 100);
            }}
          >
            Add
          </p>
          {this.state.updated === true ? (
            <p
              className="unselectable"
              onClick={async () => {
                await setTimeout(async () => {
                  await this.state.updatedSchedule.forEach(async (x) => {
                    await _database.ref("schedule").child(x.vaccineId).set(x);
                  });
                  this.setState({ updated: undefined });
                }, 100);
              }}
            >
              Save
            </p>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}
