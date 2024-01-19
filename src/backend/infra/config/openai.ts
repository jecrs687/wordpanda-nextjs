
type OpenAIConfig = {
    apiKey: string;
    engine: string;
};

export function getOpenAIConfig(): OpenAIConfig {
    return {
        apiKey: process.env.OPENAI_API_KEY,
        engine: process.env.OPENAI_ENGINE,
    };
}

