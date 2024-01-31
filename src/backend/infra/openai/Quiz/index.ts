import { openai } from "..";

export const generateQuizByWords = async (
    words: string[],
    language: string,
    targetLanguage: string,
): Promise<{
    [key: string]: {
        quiz: string,
        options: string[],
    },
}> => {
    const prompt = `
    I am a bot that generate quiz for you to learn new words.
    My quiz is not very good at it, but I am learning.
    Help me to learn by generating a quiz.

    The quiz are a phrase using a word in the language and you need to translate to the target language.
    And i generate a list of options to choose the correct translation for the word in the target language.
    
    Based on the following JSON structure:
    {
        words: string[], // the words in that language
        language: string, // the language 
        targetLanguage: string // the language target to translate
    }
    
    Generate a quiz to those words based on that JSON:
    {
        words: ${JSON.stringify(words)},
        language: ${JSON.stringify(language)}, // the language original of the words
        targetLanguage: ${JSON.stringify(targetLanguage)} // the language target to translate
    }

    you need to answer in JSON format, following that structure:
        {
           [word]:{ // the word in the language
                quiz: string, // the quiz to translate the word to the target language
                options: string[], // A list of options to choose the correct translation for the word in the target language, the correct translation need to be the first option
           }
        }
    

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
        return {}
    }

}