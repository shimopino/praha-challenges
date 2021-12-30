import { Component } from "react";

type ClassComponentProps = {
  initial: number;
  min: number;
  max: number;
};

type ClassComponentState = {
  count: number;
};

export class ClassComponent extends Component<
  ClassComponentProps,
  ClassComponentState
> {
  state: ClassComponentState = {
    count: this.props.initial,
  };

  increment = () => {
    if (this.state.count < this.props.max) {
      this.setState({ count: this.state.count + 1 });
    }
  };

  decrement = () => {
    if (this.state.count > this.props.min) {
      this.setState({ count: this.state.count - 1 });
    }
  };

  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.increment}>increment</button>
        <button onClick={this.decrement}>decrement</button>
      </div>
    );
  }
}
