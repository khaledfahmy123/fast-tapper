import { Component } from "react";

class ErrorBoundary extends Component {
  constructor() {
    super(); // this to inherit all the porperties of the class Component
    this.state = { errorLol: false }; //here you store all the states of the component
  }

  componentDidCatch(error) {
    // this is the method which works as try catch but the jsx version of try catch :)
    this.setStat({ errorLol: true });
  }

  render() {
    if (this.state.errorLol) {
      return <h1>Something went wrong</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
