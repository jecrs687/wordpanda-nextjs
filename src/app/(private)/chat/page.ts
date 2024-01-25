import { generatePhrases } from "@infra/openai/Chat";


export default async function openAiTest() {
    const openResponse = await generatePhrases("portuguese", "english", ["oi", "tudo bem", "como vai", "tchau"])
    console.log(openResponse);
    return null;
}