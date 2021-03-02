# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- Fixed react peer dependency range

## [1.0.0-beta.6] - 2021-03-01

- Fixed simultaneous create for IndexableContextStore and StatefulIndexableContextStore

## [1.0.0-beta.5] - 2021-02-28

- Fixed createOne overwriting existing indexes for arrays instead of inserting

## [1.0.0-beta.4] - 2021-02-23

- Fixed typing issues with useIndexableStatefulContextStore

## [1.0.0-beta.3] - 2021-02-21

- Fixed console warnings

## [1.0.0-beta.2] - 2021-02-16

## [1.0.0-beta.1] - 2021-02-16

- Renamed `preaction` to `preload`
- Defaulted Params to be void
- Refactor and reorganization of code
- Added `useStatefulIndexableContextStore`
  - For any methods that update all items, the base `state` will be modified
  - For any methods that update a single item, the individual item's `state` will be modified and the base state will be unchanged
  - TODO: Need to add documentation for the above

## [1.0.0-beta.0] - 2021-02-05

- First release
