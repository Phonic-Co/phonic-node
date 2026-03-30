import { PhonicClient } from "../Client.js";

/**
 * @deprecated Prefer {@link PhonicClient} with
 * `{ reconnectConversationOnAbnormalDisconnect: true }`. This class remains as a
 * thin alias for backward compatibility.
 */
export class ReconnectablePhonicClient extends PhonicClient {
    constructor(options: PhonicClient.Options = {}) {
        super({ ...options, reconnectConversationOnAbnormalDisconnect: true });
    }
}
