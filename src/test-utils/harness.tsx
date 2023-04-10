import { render } from "@testing-library/react";
import React from "react";

export class ShallowContextHarness<T> {
  private dataSnapshot: null | T;

  constructor(Provider: any, Consumer: React.Consumer<T>) {
    this.dataSnapshot = null;
    render(
      <Provider>
        <Consumer>{this.children}</Consumer>
      </Provider>
    );
  }

  private children = (data: T) => {
    this.dataSnapshot = data;
    return null;
  };

  public getContextData() {
    if (this.dataSnapshot == null) {
      throw new Error("Harness failure - Snapshot should never be null");
    }
    return this.dataSnapshot;
  }

  public waitForAsyncTasks() {
    return new Promise((resolve) => {
      setTimeout(resolve, 1);
    });
  }
}
