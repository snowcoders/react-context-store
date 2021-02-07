import { ShallowWrapper, shallow } from "enzyme";
import React from "react";

export class ShallowContextHarness<T> {
  private wrapper: ShallowWrapper<any>;
  private dataSnapshot: null | T;

  constructor(Provider: any, Consumer: React.Consumer<T>) {
    this.wrapper = shallow(
      <Provider>
        <Consumer>{this.children}</Consumer>
      </Provider>
    );
    this.dataSnapshot = null;
  }

  private children = (data: T) => {
    this.dataSnapshot = data;
    return null;
  };

  public getContextData() {
    this.wrapper.dive().dive();
    if (this.dataSnapshot == null) {
      throw new Error("Harness failure - Snapshot should never be null");
    }
    return this.dataSnapshot;
  }

  public waitForAsyncTasks() {
    return new Promise((resolve) => {
      setImmediate(resolve);
    });
  }
}
