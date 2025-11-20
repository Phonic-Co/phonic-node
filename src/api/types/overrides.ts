import type { Conversation } from "./Conversation";

type PhonicTool = "send_dtmf_tone" | "end_conversation" | (string & {});
type ISODateTime = `${string}Z`;

export type PhonicConfigurationEndpointRequestPayload = {
    project: {
        name: string;
    };
    agent: {
        name: string;
        welcome_message: string;
        system_prompt: string;
        tools: Array<PhonicTool>;
        boosted_keywords: string[];
    };
    from_phone_number?: string;
    to_phone_number?: string;
};

export type PhonicConfigurationEndpointResponsePayload = {
    welcome_message?: string | null;
    system_prompt?: string;
    template_variables?: Record<string, string>;
    tools?: Array<PhonicTool>;
    boosted_keywords?: string[];
    metadata?: unknown;
};

export type ConversationEndedWebhookPayload = {
    event_type: "conversation.ended";
    created_at: ISODateTime;
    data: {
        conversation: Conversation;
        call_info: {
            from_phone_number: string;
            to_phone_number: string;
        } | null;
    };
};

export type ConversationAnalysisWebhookPayload = {
    event_type: "conversation.analysis";
    created_at: ISODateTime;
    data: {
        conversation: {
            latencies_ms: number[];
            interruptions_count: number;
        };
        call_info: {
            from_phone_number: string;
            to_phone_number: string;
        } | null;
    };
};