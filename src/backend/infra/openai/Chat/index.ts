import { openai } from "..";

export const verifyPhrases = async (
    phrases: string[],
    language: string,
    translations: string[],
    targetLanguage
) => {
    const prompt = `
    I am a bot that verifies translations.
    As you can see, I am not very good at it, but I am learning.
    Help me to learn by verifying the translations I make.

    Based on the following JSON structure:
    {
        language: string, // the language 
        phrases: string[], // the phrases in that language
        targetLanguage: string // the language target to translate
        translations: string[], // my translations of the phrases in the target language
    }

    Verify if the translations are correct to that JSON:
    {
        phrases: ${JSON.stringify(phrases)},
        language: ${JSON.stringify(language)},
        targetLanguage: ${JSON.stringify(targetLanguage)},
        translations: ${JSON.stringify(translations)}
    }    
    you need to answer in JSON format, following that structure:
        {
            phrases: string[],
            translation: string[],
            correctTranslation: string[],
            isCorrect: boolean[],
            percentage: number[],
            additionalComments: string[]
        }
    that is, the phrases you want to translate, the translation that i sent to you, the correct translation you think is correct, the boolean array that indicates if the translation is correct or not, and the percentage of correctness of each translation.

    The correctness percentage is calculated based on the meaning of the phrase, words and context. Words that are not correct are marked with a pair of asterisks (**).
    In the additional comments you can write why you think the translation is correct or not and how to improve it.
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
        return completion.choices[0].message.content;
    }
}

export const generatePhrases = async (
    language: string,
    targetLanguage: string,
    words: string[],
) => {
    const prompt = `
    I am a bot that generates long phrases (more than 20 characters) using a list of words or short phrases.
    As you can see, I am not very good at it, but I am learning.
    Help me to learn by generating phrases.

    Based on the following JSON structure:
    {
        language: string, // the language 
        words: string[], // the words in that language
        targetLanguage: string // the language target to translate
    }

    Generate phrases and translations to those phrases based on that JSON:
    {
        words: ${JSON.stringify(words)},
        language: ${JSON.stringify(language)},
        targetLanguage: ${JSON.stringify(targetLanguage)}
    }

    you need to answer in JSON format, following that structure:
        {
            phrases: string[], // One long phrases in the target language for each words or short phrases in the target language, the phrases are more than 20 characters
            translation: string[], // the translation for each phrases generated in the array phrases in the language
        }
    phrases are generated based on the words or short phrases in the target language, the phrases are more than 20 characters.
    translation is the translation for each phrases generated in the array phrases to the language.
    Remember that the phrases must be more than 20 characters and need to be in the target language.
    Also, the phrases must be different from each other, that is, the phrases cannot be the same.
    And the pontuation is necessary.
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
        return completion.choices[0].message.content;
    }

}


