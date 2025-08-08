type PhonicTool = "send_dtmf_tone" | "end_conversation" | (string & {});

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
