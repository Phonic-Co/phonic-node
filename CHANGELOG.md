# phonic

## 0.11.0

### Minor Changes

- [`df30388`](https://github.com/Phonic-Co/phonic-node/commit/df30388fc642f753419a192c63e4f15de341f659) Thanks [@moroshko](https://github.com/moroshko)! - Allow setting an external ID for the conversation by calling setExternalId()

## 0.10.0

### Minor Changes

- [`890faaa`](https://github.com/Phonic-Co/phonic-node/commit/890faaa974f8f1fe311e4f4f1af436a378619038) Thanks [@moroshko](https://github.com/moroshko)! - Add ability to pass headers to all requests

## 0.9.0

### Minor Changes

- [`8a3a336`](https://github.com/Phonic-Co/phonic-node/commit/8a3a336ce24a92eab7dbc638e587ae5d547c3904) Thanks [@moroshko](https://github.com/moroshko)! - Allow passing a code to close()

## 0.8.2

### Patch Changes

- [`6fcc1a9`](https://github.com/Phonic-Co/phonic-node/commit/6fcc1a9703e1d6de3c623339cbb4c63377877e2f) Thanks [@moroshko](https://github.com/moroshko)! - Add \_\_downstreamWebSocketUrl for internal use

## 0.8.1

### Patch Changes

- [`bb2755c`](https://github.com/Phonic-Co/phonic-node/commit/bb2755cd51a6b25df651966fada898dec421b1c1) Thanks [@moroshko](https://github.com/moroshko)! - Trim trailing slash from baseUrl

## 0.8.0

### Minor Changes

- [`5ff2df2`](https://github.com/Phonic-Co/phonic-node/commit/5ff2df26bb59a6d3c51fb6027a3ecad341c2acfe) Thanks [@moroshko](https://github.com/moroshko)!
  - Config should be passed now to `await phonic.sts.websocket()`
  - Added retry logic to `await phonic.sts.websocket()`
  - Removed `phonicWebSocket.config()`

## 0.7.0

### Minor Changes

- [`9226c82`](https://github.com/Phonic-Co/phonic-node/commit/9226c821fa4d51b800d2f7239896fa9cfc1d1bbc) Thanks [@moinnadeem](https://github.com/moinnadeem)! - Updating README

## 0.6.1

### Patch Changes

- [`f37e2ce`](https://github.com/Phonic-Co/phonic-node/commit/f37e2cea1faeee7072b71edb38d03f5ad18cca82) Thanks [@moroshko](https://github.com/moroshko)! - TypeScript improvements

## 0.6.0

### Minor Changes

- [`ac7ddbb`](https://github.com/Phonic-Co/phonic-node/commit/ac7ddbbe854db082108962c986bf08ec7811bb26) Thanks [@moroshko](https://github.com/moroshko)! - Remove support for Text-to-speech via WebSocket

## 0.5.0

### Minor Changes

- [`a8a6617`](https://github.com/Phonic-Co/phonic-node/commit/a8a6617b5ced716ba35083e27b0a52366fb7edc8) Thanks [@moroshko](https://github.com/moroshko)! - - Add support for speech-to-speech via WebSocket.
  - Rename `PhonicWebSocket` to `PhonicTTSWebSocket`.

## 0.4.0

### Minor Changes

- [`129fb9a`](https://github.com/Phonic-Co/phonic-node/commit/129fb9a1e8489a22a1e1cce8a923f3f1fefdc628) Thanks [@moroshko](https://github.com/moroshko)! - Require a `model` in phonic.voices.list().

## 0.3.0

### Minor Changes

- [`76e5114`](https://github.com/Phonic-Co/phonic-node/commit/76e51143cdede963254ddfc723f40753e8fd0bd3) Thanks [@moroshko](https://github.com/moroshko)! - Use the new "flush_confirm" and "stop_confirm" messages.

## 0.2.0

### Minor Changes

- [`8bcf818`](https://github.com/Phonic-Co/phonic-node/commit/8bcf8187daa92f59c5b5984bc583fd927f8efd4e) Thanks [@moroshko](https://github.com/moroshko)! - Update to use new buffering API (`generate`, `flush`, and `stop` messages).
  Add `onClose` and `onError` handlers.
  Upgrade dependencies.

## 0.1.3

### Patch Changes

- [`767461a`](https://github.com/Phonic-Co/phonic-node/commit/767461a7ab350bda558fff5e596a705358bd2373) Thanks [@moroshko](https://github.com/moroshko)! - Fix stream closing error

## 0.1.2

### Patch Changes

- b3196d1: Don't require type="generate" in WebSocket message

## 0.1.1

### Patch Changes

- 7cb23c1: Make `baseUrl` a string.
- 07e0265: Improve types and export `PhonicWebSocket` type
