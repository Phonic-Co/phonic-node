type PhonicTool = "send_dtmf_tone" | "end_conversation" | (string & {});
type ISODateTime = `${string}Z`;

type TaskStatus = "pending" | "completed" | "failed";

type TaskResult = {
    name: string;
    description: string;
    status: TaskStatus;
    commentary: string | null;
};

type TaskResults = {
    results: Array<TaskResult>;
};

type ConversationItem =
    | {
        role: "user";
        item_idx: number;
        text: string;
        duration_ms: number;
        started_at: string;
    }
    | {
        role: "assistant";
        item_idx: number;
        text: string;
        voice_id: string;
        system_prompt: string;
        audio_speed: number;
        duration_ms: number;
        started_at: string;
    };

export type Conversation = {
    id: string;
    external_id: string | null;
    workspace: string;
    agent: {
        id: string;
        name: string;
    } | null;
    model: string;
    welcome_message: string | null;
    input_format: "pcm_44100" | "mulaw_8000";
    output_format: "pcm_44100" | "mulaw_8000";
    live_transcript: string;
    post_call_transcript: string | null;
    audio_url: string | null;
    duration_ms: number;
    task_results: TaskResults;
    started_at: ISODateTime;
    ended_at: ISODateTime | null;
    items: Array<ConversationItem>;
};

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