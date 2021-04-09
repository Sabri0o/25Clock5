import React from "react";
import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { CircularProgress } from "@material-ui/core";
import { Container, Row, Col, Button } from "react-bootstrap";
export default class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      minutes: 25,
      break: 5,
      session: 25,
      seconds: -1,
      runOrStop: false,
      sessionOrBreak: true,
      timerOn: "Session"
    };
    this.resetHandler = this.resetHandler.bind(this);
    this.timerHandler = this.timerHandler.bind(this);
    this.timer = this.timer.bind(this);
    this.timerId = undefined;
    this.incSession = this.incSession.bind(this);
    this.decSession = this.decSession.bind(this);
    this.incBreak = this.incBreak.bind(this);
    this.decBreak = this.decBreak.bind(this);
  }

  resetHandler() {
    clearTimeout(this.timerId);
    document.getElementById("beep").pause();
    document.getElementById("beep").currentTime = 0;
    this.setState({
      minutes: 25,
      break: 5,
      session: 25,
      seconds: -1,
      runOrStop: false,
      sessionOrBreak: true,
      timerOn: "Session"
    });
  }

  timer() {
    if (Number(this.state.seconds) <= 10) {
      if (Number(this.state.seconds) === 0) {
        if (Number(this.state.minutes) === 0) {
          document.getElementById("beep").play();
          this.setState((state) => ({
            seconds: "00",
            minutes: state.sessionOrBreak
              ? "0" + state.break
              : state.session < 10
              ? "0" + String(state.session)
              : state.session,
            sessionOrBreak: !state.sessionOrBreak,
            timerOn: state.sessionOrBreak ? "Break" : "Session"
          }));
        } else {
          this.setState((state) => ({
            seconds: 59,
            minutes:
              Number(state.minutes) <= 10
                ? "0" + String(Number(state.minutes) - 1)
                : Number(state.minutes) - 1
          }));
        }
      } else {
        this.setState((state) => ({
          seconds: "0" + String(Number(Math.abs(this.state.seconds)) - 1)
        }));
      }
    } else {
      this.setState((state) => ({
        seconds: state.seconds - 1
      }));
    }
    this.timerId = setTimeout(this.timer, 1000);
  }

  timerHandler() {
    if (!this.state.runOrStop) {
      this.timer();
      this.setState((state) => ({
        runOrStop: !state.runOrStop
      }));
    } else {
      clearTimeout(this.timerId);
      this.setState((state) => ({
        runOrStop: !state.runOrStop
      }));
    }
  }

  incSession() {
    if (Number(this.state.session) < 60) {
      this.setState((state) => ({
        minutes:
          state.timerOn === "Session"
            ? Number(state.session) < 9
              ? "0" + String(Number(state.session) + 1)
              : Number(state.session) + 1
            : state.minutes,
        session: state.session + 1,
        seconds: state.timerOn === "Session" ? -1 : state.seconds
      }));
    }
  }
  decSession() {
    if (this.state.session > 1) {
      this.setState((state) => ({
        minutes:
          state.timerOn === "Session"
            ? state.session <= 10
              ? "0" + String(state.session - 1)
              : state.session - 1
            : state.minutes,
        session: state.session - 1,
        seconds: state.timerOn === "Session" ? -1 : state.seconds
      }));
    }
  }

  incBreak() {
    if (this.state.break < 60) {
      this.setState((state) => ({
        minutes:
          state.timerOn === "Break"
            ? "0" + String(state.break + 1)
            : state.minutes,
        break: state.break + 1,
        seconds: state.timerOn === "Break" ? -1 : state.seconds
      }));
    }
  }
  decBreak() {
    if (this.state.break > 1) {
      this.setState((state) => ({
        minutes:
          state.timerOn === "Break"
            ? "0" + String(state.break - 1)
            : state.minutes,
        break: state.break - 1,
        seconds: state.timerOn === "Break" ? -1 : state.seconds
      }));
    }
  }

  render() {
    const runStopStyle = this.state.runOrStop
      ? {
          background: "red"
        }
      : {
          background: "green"
        };
    const sessionOrBreak = this.state.sessionOrBreak
      ? this.state.session
      : this.state.break;
    const seconds =
      this.state.seconds === -1 ||
      (this.state.seconds === "00" &&
        Number(this.state.minutes) === Number(sessionOrBreak))
        ? 100
        : Number(this.state.minutes) < Number(sessionOrBreak) &&
          this.state.seconds === "00"
        ? 0
        : (Number(this.state.seconds) * 100) / 60;

    const minutes = sessionOrBreak
      ? this.state.seconds === -1 ||
        (this.state.seconds === "00" &&
          Number(this.state.minutes) === Number(sessionOrBreak))
        ? 100
        : ((Number(this.state.minutes) + 1) * 100) / Number(this.state.session)
      : this.state.seconds === -1 ||
        (this.state.seconds === "00" &&
          Number(this.state.minutes) === Number(sessionOrBreak))
      ? 100
      : ((Number(this.state.minutes) + 1) * 100) / this.state.break;
    return (
      <div >
        <Container style={{ marginTop: "50px" }}>
          <Row className="justify-content-md-center" xs={2} md={2} lg={6}>
            <Col>
              <div id="break-label">Break Length</div>
              <Button
                id="break-increment"
                disabled={this.state.runOrStop}
                onClick={this.incBreak}
              >
                +
              </Button>
              <div id="break-length">{this.state.break}</div>
              <Button
                id="break-decrement"
                disabled={this.state.runOrStop}
                onClick={this.decBreak}
              >
                -
              </Button>
            </Col>

            <Col className="vertical-center">
              <CircularProgress
                size={100}
                variant="determinate"
                value={minutes}
              />
            </Col>

            <Col className="vertical-center">
              <CircularProgress
                size={100}
                variant="determinate"
                value={seconds}
              />
            </Col>

            <Col>
              <div id="session-label">Session Length</div>
              <Button
                id="session-increment"
                disabled={this.state.runOrStop}
                onClick={this.incSession}
              >
                +
              </Button>
              <div id="session-length">{this.state.session}</div>
              <Button
                id="session-decrement"
                disabled={this.state.runOrStop}
                onClick={this.decSession}
              >
                -
              </Button>
            </Col>
          </Row>
          <Row style={{ display: "flex", justifyContent: "center" }}>
            <div id="timer-label">{this.state.timerOn}</div>
          </Row>
          <Row style={{ display: "flex", justifyContent: "center" }}>
            <div id="time-left">
              {this.state.minutes}:
              {this.state.seconds === -1 ? "00" : this.state.seconds}
              <audio
                id="beep"
                src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
              ></audio>
            </div>
          </Row>
          <Row style={{ display: "flex", justifyContent: "center" }}>
            <Button id="reset" onClick={this.resetHandler}>
              Reset
            </Button>
            <Button
              id="start_stop"
              onClick={this.timerHandler}
              style={runStopStyle}
            >
              Run/Stop
            </Button>
          </Row>
        </Container>
      </div>
    );
  }
}
