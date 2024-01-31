import { openai } from "..";

export const translateWords = async (
    words: string[],
    language: string,
    targetLanguage: string,
): Promise<{
    [key: string]: {
        translation: string[],
        meaning: string[],
        meaningTranslated: string[],
    },
}> => {
    const prompt = `
    I am a bot that generate translations for words.
    As you can see, I am not very good at it, but I am learning.
    Help me to learn by generating translations.
    Based on the following JSON structure:
    {
        words: string[], // the words in that language
        language: string, // the language 
        targetLanguage: string // the language target to translate
    }
    Generate translations to those words based on that JSON:
    {
        words: ${JSON.stringify(words)},
        language: ${JSON.stringify(language)}, // the language original of the words
        targetLanguage: ${JSON.stringify(targetLanguage)} // the language target to translate
    }
    you need to answer in JSON format, following that structure:
        {
           [word]:{ // the word in the language
                translation: string[], // A list of translations for each word in the language target
                meaning: string[], // A list of meanings for each word in the language original of the words
                meaningTranslated: string[], // A list of meanings for each word in the target language
           }
        }
    please, attempt to generate a translation for each word in the language, and if you can't generate a translation, just leave it empty.
    
    `

    const completion = await openai.chat.completions.create({
        messages: [{
            role: "system",
            content: prompt
        }],

        model: "gpt-3.5-turbo-1106",
        response_format: { type: 'json_object' }
    });
    try {
        return JSON.parse(completion.choices[0].message.content);
    }
    catch {
        return {};
    }

}