import { jest } from "@snowcoders/renovate-config";

export default {
  ...jest,
  testEnvironment: "jsdom",
};
