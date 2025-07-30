
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { FullAnalysisResult, PersonaConfiguration, DialogueTurn } from '../types';

const constructPrompt = (text: string): string => {
  return `
    You are an expert in Systemic Functional Linguistics (SFL). Your task is to analyze the following source document, map the linguistic features to a persona profile, and generate a detailed persona configuration. Follow these steps precisely and return the output as a single, valid JSON object with no markdown formatting.

    **Source Document:**
    """
    ${text}
    """

    **Step 1: SFL Feature Extraction**
    Analyze the source document based on the following SFL framework.

    **A. Ideational Analysis:**
    1.  **Process Type Identification:** Categorize verbs/predicates and calculate the percentage distribution for:
        *   **Material Processes:** Actions/Events (e.g., develop, implement, construct, occur).
        *   **Mental Processes:** Cognition/Perception (e.g., think, believe, understand, see, suggest).
        *   **Relational Processes:** Being/Having (e.g., is, has, becomes, represents, equals).
        *   **Verbal Processes:** Communication (e.g., say, tell, report, argue, claim).
        *   The sum of these four percentages MUST be 100.
    2.  **Technicality Measurement:** Calculate a lexical density score on a 1-10 scale where 1 is conversational and 10 is highly technical. Provide a brief description for the score.

    **B. Interpersonal Feature Analysis:**
    1.  **Modality Pattern Recognition:** Analyze modal verbs and expressions to summarize the document's modality profile (e.g., high certainty, low obligation).
    2.  **Appraisal System Analysis:** Briefly summarize the use of evaluative language (Affect, Judgement, Appreciation).

    **C. Textual Organization Analysis:**
    1.  **Cohesion Pattern:** Briefly summarize the primary cohesive devices used (e.g., reference chains, lexical repetition, conjunctions).


    **Step 2: Mapping Algorithms**
    Apply the following algorithms to map the SFL analysis to a persona profile.

    **A. Ideational Mapping -> Persona Style:**
    *   IF Relational Processes > 50% -> Style: "Definitional Expert"
    *   ELIF Material Processes > 40% -> Style: "Action-Oriented Practitioner"
    *   ELIF Mental Processes > 35% -> Style: "Reflective Analyst"
    *   ELIF Verbal Processes > 20% -> Style: "Research Communicator"
    *   ELSE -> Style: "Balanced Generalist"

    **B. Use the analysis to determine:**
    *   **Confidence:** (e.g., Highly Certain, Moderately Certain, Cautious)
    *   **Stance:** (e.g., Contemplative and Evaluative, Practical and Systematic)
    *   **Organization:** (e.g., Exploratory Questioning, Sequential Building)

    **Step 3: Generate Persona Configuration**
    Based on the SFL analysis and mapping, generate a detailed persona configuration with specific scores and settings.

    **Output Schema:**
    Return a single, valid JSON object matching this exact structure:
    \`\`\`json
    {
      "sflAnalysis": {
        "processDistribution": {
          "material": <number>,
          "mental": <number>,
          "relational": <number>,
          "verbal": <number>
        },
        "technicality": {
          "score": <number(1-10)>,
          "description": "<string>"
        },
        "modalityProfile": "<string>",
        "appraisalSummary": "<string>",
        "cohesionSummary": "<string>"
      },
      "personaMapping": {
        "style": "<string>",
        "confidence": "<string>",
        "stance": "<string>",
        "organization": "<string>"
      },
      "personaConfiguration": {
        "ideational": {
          "materialProcesses": <number>,
          "mentalProcesses": <number>,
          "relationalProcesses": <number>,
          "verbalProcesses": <number>,
          "technicalityLevel": <number(1-10)>,
          "logicalRelations": "<string e.g., Elaboration + Enhancement preference>"
        },
        "interpersonal": {
          "statements": <number(%)>,
          "questions": <number(%)>,
          "offersCommands": <number(%)>,
          "probabilityModality": <number(1-10)>,
          "usualityModality": <number(1-10)>,
          "questioningFrequency": "<string e.g., High, Medium, Low>",
          "appraisal": "<string e.g., Contemplative + Appreciative + Evaluative>"
        },
        "textual": {
          "lexicalDensity": <number(1-10)>,
          "grammaticalIntricacy": <number(1-10)>,
          "referenceChains": "<string e.g., Enabled (complex conceptual tracking)>",
          "conjunctiveAdverbs": "<string e.g., Enabled (yet, however, therefore)>",
          "thematicProgression": "<string e.g., Split Rheme (question branching)>",
          "questionSequences": "<string e.g., Enabled>"
        }
      }
    }
    \`\`\`
    Do not include any text, explanations, or markdown fences outside of the JSON object itself.
    `;
};

export const analyzeDocument = async (text: string, model: string, thinkingBudget?: number): Promise<FullAnalysisResult> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = constructPrompt(text);
    
    const config: { [key: string]: any } = {
        responseMimeType: "application/json",
        temperature: 0.2,
    };

    if (model === 'gemini-2.5-flash' && typeof thinkingBudget === 'number') {
        config.thinkingConfig = { thinkingBudget };
    }

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model,
            contents: prompt,
            config,
        });
        
        if (!response || !response.text) {
            throw new Error("The API returned an empty response. This may be due to content safety filters or other issues.");
        }

        let jsonStr = response.text.trim();
        
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
          jsonStr = match[2].trim();
        }

        const parsedData: FullAnalysisResult = JSON.parse(jsonStr);
        return parsedData;

    } catch (error) {
        console.error("Error analyzing document:", error);
        if (error instanceof Error) {
           throw new Error(`Failed to analyze document with Gemini API: ${error.message}`);
        }
        throw new Error("An unknown error occurred during analysis.");
    }
};

const constructDialoguePrompt = (
    configs: [PersonaConfiguration, PersonaConfiguration], 
    topic: string,
    context: string,
    length: string
): string => {
  const [configA, configB] = configs;

  return `
You are an expert dialogue writer. Your task is to generate an engaging podcast-style dialogue between two speakers (Speaker A and Speaker B), each with a distinct Systemic Functional Linguistics (SFL) persona configuration.

**Core Instructions:**
1.  **Topic:** The dialogue MUST be about: "${topic}".
2.  **Context:** The dialogue should incorporate and reference the following contextual material: "${context || 'No specific context provided.'}".
3.  **Length:** The dialogue should be of a "${length}" length.
4.  **Adherence:** Strictly adhere to the linguistic specifications for EACH speaker provided below.

---

**SPEAKER A PERSONA PROFILE:**

**1. IDEATIONAL (What Speaker A talks about):**
*   **Process Mix:** Material: ${configA.ideational.materialProcesses}%, Mental: ${configA.ideational.mentalProcesses}%, Relational: ${configA.ideational.relationalProcesses}%, Verbal: ${configA.ideational.verbalProcesses}%.
*   **Technicality Level:** ${configA.ideational.technicalityLevel}/10.
*   **Logical Relations:** Prefers ${configA.ideational.logicalRelations}.

**2. INTERPERSONAL (How Speaker A interacts):**
*   **Speech Functions (Overall Turn Mix):** ${configA.interpersonal.statements}% Statements, ${configA.interpersonal.questions}% Questions, ${configA.interpersonal.offersCommands}% Offers/Commands.
*   **Modality Profile:**
    *   Probability/Certainty Score: ${configA.interpersonal.probabilityModality}/10.
    *   Usuality Score: ${configA.interpersonal.usualityModality}/10.
*   **Appraisal:** Adopts a tone that is ${configA.interpersonal.appraisal}.

**3. TEXTUAL (How Speaker A organizes text):**
*   **Linguistic Style:** Lexical density is ${configA.textual.lexicalDensity}/10; Grammatical intricacy is ${configA.textual.grammaticalIntricacy}/10.
*   **Cohesion:** Uses ${configA.textual.referenceChains} and ${configA.textual.conjunctiveAdverbs}.
*   **Thematic Progression:** Follows a pattern of ${configA.textual.thematicProgression}.

---

**SPEAKER B PERSONA PROFILE:**

**1. IDEATIONAL (What Speaker B talks about):**
*   **Process Mix:** Material: ${configB.ideational.materialProcesses}%, Mental: ${configB.ideational.mentalProcesses}%, Relational: ${configB.ideational.relationalProcesses}%, Verbal: ${configB.ideational.verbalProcesses}%.
*   **Technicality Level:** ${configB.ideational.technicalityLevel}/10.
*   **Logical Relations:** Prefers ${configB.ideational.logicalRelations}.

**2. INTERPERSONAL (How Speaker B interacts):**
*   **Speech Functions (Overall Turn Mix):** ${configB.interpersonal.statements}% Statements, ${configB.interpersonal.questions}% Questions, ${configB.interpersonal.offersCommands}% Offers/Commands.
*   **Modality Profile:**
    *   Probability/Certainty Score: ${configB.interpersonal.probabilityModality}/10.
    *   Usuality Score: ${configB.interpersonal.usualityModality}/10.
*   **Appraisal:** Adopts a tone that is ${configB.interpersonal.appraisal}.

**3. TEXTUAL (How Speaker B organizes text):**
*   **Linguistic Style:** Lexical density is ${configB.textual.lexicalDensity}/10; Grammatical intricacy is ${configB.textual.grammaticalIntricacy}/10.
*   **Cohesion:** Uses ${configB.textual.referenceChains} and ${configB.textual.conjunctiveAdverbs}.
*   **Thematic Progression:** Follows a pattern of ${configB.textual.thematicProgression}.

---

**OUTPUT INSTRUCTIONS:**
*   Generate a dialogue starting with Speaker A.
*   Format the output with "Speaker A:" and "Speaker B:" prefixes for each turn.
*   Ensure each speaker's dialogue strictly adheres to their specified linguistic profile.
*   Do NOT include any other text, explanations, or analysis. Only the dialogue itself.
  `;
};

export const generateDialogue = async (
    configs: [PersonaConfiguration, PersonaConfiguration],
    topic: string,
    context: string,
    length: string,
    model: string,
    thinkingBudget?: number
): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = constructDialoguePrompt(configs, topic, context, length);

    const config: { [key: string]: any } = {
        temperature: 0.75, // More creative for dialogue
    };

    if (model === 'gemini-2.5-flash' && typeof thinkingBudget === 'number') {
        config.thinkingConfig = { thinkingBudget };
    }

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model,
            contents: prompt,
            config,
        });
        
        if (!response || !response.text) {
            throw new Error("The API returned an empty dialogue. This may be due to content safety filters or other issues.");
        }
        
        return response.text;

    } catch (error) {
        console.error("Error generating dialogue:", error);
        if (error instanceof Error) {
           throw new Error(`Failed to generate dialogue with Gemini API: ${error.message}`);
        }
        throw new Error("An unknown error occurred during dialogue generation.");
    }
};


const constructRefinePrompt = (originalText: string, config: PersonaConfiguration, userPrompt: string): string => {
    return `
You are an AI assistant helping a user refine a single line of dialogue.

**Your Persona:**
You must adopt the following SFL persona configuration for your response.
*   **Ideational Profile:** Process Mix (Mat: ${config.ideational.materialProcesses}%, Men: ${config.ideational.mentalProcesses}%, Rel: ${config.ideational.relationalProcesses}%, Ver: ${config.ideational.verbalProcesses}%); Technicality: ${config.ideational.technicalityLevel}/10.
*   **Interpersonal Profile:** Speech Mix (Stmt: ${config.interpersonal.statements}%, Qst: ${config.interpersonal.questions}%, Off/Cmd: ${config.interpersonal.offersCommands}%); Modality (Prob: ${config.interpersonal.probabilityModality}/10, Usu: ${config.interpersonal.usualityModality}/10); Appraisal: ${config.interpersonal.appraisal}.
*   **Textual Profile:** Lexical Density: ${config.textual.lexicalDensity}/10; Grammatical Intricacy: ${config.textual.grammaticalIntricacy}/10.

**Task:**
Rewrite the following line of dialogue based *only* on the user's instruction.

**Original Dialogue Line:**
"${originalText}"

**User's Instruction:**
"${userPrompt}"

**Output Rules:**
1.  Return **only the rewritten dialogue line**.
2.  Do **not** add any prefixes like "Speaker A:" or explanations.
3.  Ensure the rewritten line maintains the core persona defined above.
`;
}


export const refineDialogueTurn = async (originalText: string, personaConfig: PersonaConfiguration, userPrompt: string, model: string, thinkingBudget?: number): Promise<string> => {
     if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = constructRefinePrompt(originalText, personaConfig, userPrompt);
    
    const config: { [key: string]: any } = {
        temperature: 0.6
    };

    if (model === 'gemini-2.5-flash' && typeof thinkingBudget === 'number') {
        config.thinkingConfig = { thinkingBudget };
    }

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config
        });
        if (!response || !response.text) {
            throw new Error("The API returned an empty refinement. Please try a different prompt.");
        }
        return response.text.trim();
    } catch (error) {
        console.error("Error refining dialogue turn:", error);
        if (error instanceof Error) {
           throw new Error(`Refinement failed: ${error.message}`);
        }
        throw new Error("An unknown error occurred during refinement.");
    }
};

const constructNextLinePrompt = (history: DialogueTurn[], nextSpeaker: 'Speaker A' | 'Speaker B', config: PersonaConfiguration): string => {
    const historyText = history.map(turn => `${turn.speaker}: ${turn.text}`).join('\n');

    return `
You are an AI assistant generating the next line in a dialogue.

**Your Persona (for the new line):**
You are ${nextSpeaker}. You must adopt the following SFL persona configuration.
*   **Ideational Profile:** Process Mix (Mat: ${config.ideational.materialProcesses}%, Men: ${config.ideational.mentalProcesses}%, Rel: ${config.ideational.relationalProcesses}%, Ver: ${config.ideational.verbalProcesses}%); Technicality: ${config.ideational.technicalityLevel}/10.
*   **Interpersonal Profile:** Speech Mix (Stmt: ${config.interpersonal.statements}%, Qst: ${config.interpersonal.questions}%, Off/Cmd: ${config.interpersonal.offersCommands}%); Modality (Prob: ${config.interpersonal.probabilityModality}/10, Usu: ${config.interpersonal.usualityModality}/10); Appraisal: ${config.interpersonal.appraisal}.
*   **Textual Profile:** Lexical Density: ${config.textual.lexicalDensity}/10; Grammatical Intricacy: ${config.textual.grammaticalIntricacy}/10.

**Task:**
Based on the dialogue history below, generate a single, logical next line for your character (${nextSpeaker}).

**Dialogue History:**
${historyText}

**Output Rules:**
1.  Return **only the new dialogue line**.
2.  Do **not** add any prefixes like "Speaker A:" or explanations.
3.  Ensure the new line is a natural continuation of the conversation and strictly adheres to your persona.
`;
}

export const generateNextDialogueTurn = async (history: DialogueTurn[], nextSpeaker: 'Speaker A' | 'Speaker B', personaConfig: PersonaConfiguration, model: string, thinkingBudget?: number): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = constructNextLinePrompt(history, nextSpeaker, personaConfig);

    const config: { [key: string]: any } = {
        temperature: 0.7
    };

    if (model === 'gemini-2.5-flash' && typeof thinkingBudget === 'number') {
        config.thinkingConfig = { thinkingBudget };
    }

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config
        });
        if (!response || !response.text) {
            throw new Error("The API failed to generate the next line.");
        }
        return response.text.trim();
    } catch (error) {
        console.error("Error generating next dialogue turn:", error);
        if (error instanceof Error) {
           throw new Error(`Generation failed: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating the next line.");
    }
}
