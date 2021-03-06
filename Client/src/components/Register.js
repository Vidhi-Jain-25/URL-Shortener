import React, { Component } from "react";
import { register } from "./UserFunctions";
import "../style/Css.css";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      error: '',
      errorOccur: false,
      color: 'red'
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  onSubmit(e) {
    e.preventDefault();

    const newUser = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
      password: this.state.password,
    };

    register(newUser)
      .then((res) => {
        if (res.data.msg === 'User Created Successfully') {
          this.setState({ errorOccur: true });
          this.setState({ color: 'green' });
          this.setState({ error: "User Created Successfully!!" });
        }
        else if (res === "Error: Request failed with status code 400") {
          this.setState({ error: "Verify your email account a link is sent to it!!" });
          this.setState({ errorOccur: true });
        }
        else {
          this.setState({ error: res.data.error });
          this.setState({ errorOccur: true });
        }
      })
      .catch(err => {
        this.setState({ error: "Server Error!!" });
        this.setState({ errorOccur: true });
      })
  }

  componentDidMount() {
    //redirect
    localStorage.usertoken ? this.props.history.push(`/shorten`) : console.log("false");
  }


  render() {
    return (
      <div className="contain">
        <div className="container">
          <div className="row">
            <div className="col-md-6 mt-5 mx-auto">
              <form noValidate onSubmit={this.onSubmit} autoComplete="off">
                <div className="heading" style={{ textAlign: "center", marginBottom: "1vh" }}>USER SIGN UP</div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    name="first_name"
                    placeholder="First Name"
                    value={this.state.first_name}
                    onChange={this.onChange}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    name="last_name"
                    placeholder="Last Name"
                    value={this.state.last_name}
                    onChange={this.onChange}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="Email"
                    value={this.state.email}
                    onChange={this.onChange}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="Password"
                    value={this.state.password}
                    onChange={this.onChange}
                  />
                </div>
                {this.state.errorOccur && (
                  <div style={{ color: this.state.color, margin: "5px" }}>{this.state.error}</div>
                )}
                 <div style={{textAlign:"center"}}><button
                  class="btn btn-outline-light"
                  type="submit"
                >
                  REGISTER
                </button></div>
               <button
                  type="button"
                  class="btn btn-outline-light"
                  onClick={() => {
                    this.props.history.push(`/login`);
                  }}
                >
                  Back
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
