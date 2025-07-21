# phonic

## 0.25.4

### Patch Changes

- [`e90fc61`](https://github.com/Phonic-Co/phonic-node/commit/e90fc61e82e84adb22739ea3d91f2a81b22f2c77) Thanks [@moroshko](https://github.com/moroshko)! - Fix `ListAgentsSuccessResponse` and `GetAgentSuccessResponse` types

## 0.25.3

### Patch Changes

- [`60a42f3`](https://github.com/Phonic-Co/phonic-node/commit/60a42f31de2cce0ccc4e16e0a045a16e163c6a64) Thanks [@moroshko](https://github.com/moroshko)! - Add endpoint method to tools (only POST is supported for now)

## 0.25.2

### Patch Changes

- [`a1aba9c`](https://github.com/Phonic-Co/phonic-node/commit/a1aba9cf74053517bee7be66aad6c87bc54dfff5) Thanks [@moroshko](https://github.com/moroshko)! - Add `template_variables` to `PhonicSTSConfigBase`

## 0.25.1

### Patch Changes

- [`b0e1004`](https://github.com/Phonic-Co/phonic-node/commit/b0e10046c7ae159f905e80abb92ca70398933374) Thanks [@moroshko](https://github.com/moroshko)! - Update `output_audio_speed` to `audio_speed` in conversation items

## 0.25.0

### Minor Changes

- [`d59933d`](https://github.com/Phonic-Co/phonic-node/commit/d59933d4836e81489f4729109623366437cf23fc) Thanks [@moroshko](https://github.com/moroshko)! - Update types for "interrupted_response" and "is_user_speaking" messages

## 0.24.2

### Patch Changes

- [`107b628`](https://github.com/Phonic-Co/phonic-node/commit/107b62845163628d4258e0445eb7a0d2d3125c8c) Thanks [@moroshko](https://github.com/moroshko)! - Replace "object" types with more type-safe alternatives

## 0.24.1

### Patch Changes

- [#60](https://github.com/Phonic-Co/phonic-node/pull/60) [`8c92bf3`](https://github.com/Phonic-Co/phonic-node/commit/8c92bf3bb97785032b89adb3d969d23ad4a3af8c) Thanks [@qionghuang6](https://github.com/qionghuang6)! - Add new STS websocket messages to types and README.md

## 0.24.0

### Minor Changes

- [`740496a`](https://github.com/Phonic-Co/phonic-node/commit/740496a7250868f8d288e8966b6c52fe3eeee3cb) Thanks [@moroshko](https://github.com/moroshko)!
  - Change `phonic.sts.outboundCall()` to `phonic.conversations.outboundCall()`
  - Change `phonic.sts.twilio.outboundCall` to `phonic.conversations.twilio.outboundCall`

### Patch Changes

- [#58](https://github.com/Phonic-Co/phonic-node/pull/58) [`8c43676`](https://github.com/Phonic-Co/phonic-node/commit/8c4367657d7c17ead796574296801d011541f796) Thanks [@qionghuang6](https://github.com/qionghuang6)! - Update built-in tool names in `README.md`

## 0.23.0

### Minor Changes

- [`047101e`](https://github.com/Phonic-Co/phonic-node/commit/047101ec8cb49f12880c30273d415770bbd772b7) Thanks [@moroshko](https://github.com/moroshko)! - Add tools management

## 0.22.0

### Minor Changes

- [`19f9d90`](https://github.com/Phonic-Co/phonic-node/commit/19f9d90eb2d5c6f0b5416ab1aa5629ac920889f1) Thanks [@moroshko](https://github.com/moroshko)! - Add timezone to create and update agent

## 0.21.1

### Patch Changes

- [`b0bbed2`](https://github.com/Phonic-Co/phonic-node/commit/b0bbed2d916770f02c1c3b8a4934de0b983acba3) Thanks [@moroshko](https://github.com/moroshko)! - Add `template_variables` to `PhonicConfigurationEndpointResponsePayload`

## 0.21.0

### Minor Changes

- [`33e064e`](https://github.com/Phonic-Co/phonic-node/commit/33e064ec7f752dad6954020de2f0bbeeaf3e0d0c) Thanks [@moroshko](https://github.com/moroshko)! - Add agents management

## 0.20.0

### Minor Changes

- [`5c13953`](https://github.com/Phonic-Co/phonic-node/commit/5c13953f730495f1edfdba7a981bbd470fd78560) Thanks [@moroshko](https://github.com/moroshko)! - Update PhonicSTSConfig type

## 0.19.1

### Patch Changes

- [`49a8088`](https://github.com/Phonic-Co/phonic-node/commit/49a8088dfea56ef2f242a900ad2bfbddaf3331cb) Thanks [@moroshko](https://github.com/moroshko)! - Update PhonicConfigurationEndpointRequestPayload

## 0.19.0

### Minor Changes

- [`f129f74`](https://github.com/Phonic-Co/phonic-node/commit/f129f747b2a13b363485eb7296e0fd3670af2f8f) Thanks [@moroshko](https://github.com/moroshko)! - Add PhonicConfigurationEndpointRequestPayload, PhonicConfigurationEndpointResponsePayload, and upgrade deps

## 0.18.6

### Patch Changes

- [`c1671c5`](https://github.com/Phonic-Co/phonic-node/commit/c1671c54ec9256d72d3927379b14754cfd19dd6d) Thanks [@moroshko](https://github.com/moroshko)! - Update required permissions in README

## 0.18.5

### Patch Changes

- [#48](https://github.com/Phonic-Co/phonic-node/pull/48) [`c7833fd`](https://github.com/Phonic-Co/phonic-node/commit/c7833fdf534e8675144ee6d15ac2d9a3e8b35036) Thanks [@arunwpm-work](https://github.com/arunwpm-work)! - Add `"assistant_ended_conversation"` to `PhonicSTSWebSocketResponseMessage` and update `PhonicSTSConfig["tools"]` type.

## 0.18.4

### Patch Changes

- [#46](https://github.com/Phonic-Co/phonic-node/pull/46) [`b5da836`](https://github.com/Phonic-Co/phonic-node/commit/b5da836d847417c2740efd42c4d0b7b0083fc858) Thanks [@arunwpm-work](https://github.com/arunwpm-work)! - Change default model and voice, as well as add tools to `PhonicSTSConfig`.

## 0.18.3

### Patch Changes

- [#44](https://github.com/Phonic-Co/phonic-node/pull/44) [`621387f`](https://github.com/Phonic-Co/phonic-node/commit/621387fd1659da07f1d3a93413cdbd4196938baf) Thanks [@qionghuang6](https://github.com/qionghuang6)! - Add `experimental_params` to `PhonicSTSConfig`

## 0.18.2

### Patch Changes

- [`ab29f55`](https://github.com/Phonic-Co/phonic-node/commit/ab29f55e9dab2321b206a2ecc8ed627ba153fb3b) Thanks [@moroshko](https://github.com/moroshko)! - Make welcome_message in PhonicSTSOutboundCallConfig optional

## 0.18.1

### Patch Changes

- [`90d6c6a`](https://github.com/Phonic-Co/phonic-node/commit/90d6c6a0d47f59c5fe7b5d0250f25e9ea71ec06e) Thanks [@moroshko](https://github.com/moroshko)! - Update README

## 0.18.0

### Minor Changes

- [`a6d286b`](https://github.com/Phonic-Co/phonic-node/commit/a6d286bf61aafaf7c211eebacd86295d61e0f5a1) Thanks [@moroshko](https://github.com/moroshko)! - Add `phonic.sts.twilio.outboundCall()`

## 0.17.0

### Minor Changes

- [`c48cde4`](https://github.com/Phonic-Co/phonic-node/commit/c48cde4d4d7650e0a1446788587096ef58ffd031) Thanks [@moroshko](https://github.com/moroshko)! - Add phonic.sts.outboundCall()

## 0.16.3

### Patch Changes

- [#38](https://github.com/Phonic-Co/phonic-node/pull/38) [`78798ba`](https://github.com/Phonic-Co/phonic-node/commit/78798ba85e2bd7bcdb3a6d6fa01458ad05254eec) Thanks [@arunwpm-work](https://github.com/arunwpm-work)! - add vad config to PhonicSTSConfig type

## 0.16.2

### Patch Changes

- [#33](https://github.com/Phonic-Co/phonic-node/pull/33) [`5379f1f`](https://github.com/Phonic-Co/phonic-node/commit/5379f1f0a1a169880c6fa60453960a11a8ee4d3e) Thanks [@qionghuang6](https://github.com/qionghuang6)! - Add `enable_silent_audio_fallback` to `PhonicSTSConfig`.

## 0.16.1

### Patch Changes

- [`9ac3b63`](https://github.com/Phonic-Co/phonic-node/commit/9ac3b63ba7e3afc8fdac53cd1212a194ed87ed12) Thanks [@moroshko](https://github.com/moroshko)! - Fix tests

## 0.16.0

### Minor Changes

- [`af213d7`](https://github.com/Phonic-Co/phonic-node/commit/af213d73c7bb77429683330e1b6b8888ff4e9885) Thanks [@moroshko](https://github.com/moroshko)! - Update phonic.sts.websocket() API and remove retry logic

## 0.15.1

### Patch Changes

- [#29](https://github.com/Phonic-Co/phonic-node/pull/29) [`d9df208`](https://github.com/Phonic-Co/phonic-node/commit/d9df208410fb41f854de331abed3a41b07eb02b4) Thanks [@qionghuang6](https://github.com/qionghuang6)! - Add interrupted_response type

## 0.15.0

### Minor Changes

- [`60ada93`](https://github.com/Phonic-Co/phonic-node/commit/60ada933e18ea6a08d6ccf3dac6518fb94446839) Thanks [@moroshko](https://github.com/moroshko)!
  - Change `project_id` to `project` in `PhonicSTSConfig`
  - Update `phonic.conversations.getByExternalId()` to accept an object
  - Improve error handling
  - Upgrade dependencies

## 0.14.0

### Minor Changes

- [`21ee57d`](https://github.com/Phonic-Co/phonic-node/commit/21ee57d8654813d804e2ff42500972f170d49e55) Thanks [@moroshko](https://github.com/moroshko)! - Add project_id to PhonicSTSConfig and upgrade deps

## 0.13.3

### Patch Changes

- [`2a14eee`](https://github.com/Phonic-Co/phonic-node/commit/2a14eeeedf708d382e338633ab6944eeefc37c66) Thanks [@moroshko](https://github.com/moroshko)! - Update param_errors casing in README

## 0.13.2

### Patch Changes

- [`0eff8d7`](https://github.com/Phonic-Co/phonic-node/commit/0eff8d76f516b6dcc1df4557cfba16b6eeb86c7e) Thanks [@moroshko](https://github.com/moroshko)! - Add messages that Phonic sends back to README

## 0.13.1

### Patch Changes

- [`3b9f9c1`](https://github.com/Phonic-Co/phonic-node/commit/3b9f9c1f3df8c6349af97e184fc70bc752554d8e) Thanks [@moroshko](https://github.com/moroshko)! - Fix durationMin and durationMax in README

## 0.13.0

### Minor Changes

- [`29eb9c8`](https://github.com/Phonic-Co/phonic-node/commit/29eb9c8370e65280d8c77685887d074b3ba9e86c) Thanks [@moroshko](https://github.com/moroshko)! - Add phonic.conversations.list()

## 0.12.0

### Minor Changes

- [`f83230f`](https://github.com/Phonic-Co/phonic-node/commit/f83230f689e3a6f07f023fdcb87c18c42cc0d75c) Thanks [@moroshko](https://github.com/moroshko)! - Add ability to fetch a conversation by id or external id

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
