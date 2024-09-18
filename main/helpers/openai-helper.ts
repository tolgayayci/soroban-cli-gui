import { safeStorage } from "electron";
import * as fs from "fs";
import * as path from "path";

const OpenAI = require("openai");
let openai: any;

const API_KEY_FILE = "openai_api_key.enc";

function getEncryptedFilePath() {
  return path.join(
    process.env.APPDATA ||
      (process.platform == "darwin"
        ? process.env.HOME + "/Library/Preferences"
        : process.env.HOME + "/.local/share"),
    API_KEY_FILE
  );
}

export function initializeOpenAI(apiKey: string) {
  openai = new OpenAI({
    apiKey: apiKey,
  });
}

export async function saveApiKey(apiKey: string) {
  try {
    const encryptedKey = safeStorage.encryptString(apiKey);
    fs.writeFileSync(getEncryptedFilePath(), encryptedKey);
    initializeOpenAI(apiKey);
    return true;
  } catch (error) {
    console.error("Error saving API key:", error);
    return false;
  }
}

export async function getApiKey() {
  try {
    const encryptedKey = fs.readFileSync(getEncryptedFilePath());
    return safeStorage.decryptString(encryptedKey);
  } catch (error) {
    console.error("Error retrieving API key:", error);
    return null;
  }
}

export async function deleteApiKey() {
  try {
    fs.unlinkSync(getEncryptedFilePath());
    return true;
  } catch (error) {
    console.error("Error deleting API key:", error);
    return false;
  }
}

async function ensureApiKey() {
  if (!openai) {
    const apiKey = await getApiKey();
    if (!apiKey) {
      throw new Error("API key not set. Please set your OpenAI API key.");
    }
    initializeOpenAI(apiKey);
  }
}

export async function createGeneralAssistant() {
  try {
    await ensureApiKey();
    const generalAssistant = await openai.beta.assistants.create({
      name: "Soroban and Stellar General Assistant",
      instructions:
        "You are an AI assistant specializing in Soroban development and Stellar. Write and run code to answer questions related to these topics.",
      tools: [{ type: "code_interpreter" }],
      model: "gpt-4-1106-preview",
    });
    return generalAssistant;
  } catch (error) {
    console.error("Error creating general assistant:", error);
    throw error;
  }
}

export async function createCliAssistant() {
  try {
    await ensureApiKey();
    const cliAssistant = await openai.beta.assistants.create({
      name: "Stellar Command Assistant",
      instructions: "You are an AI assistant specialized in generating Stellar CLI commands. Your task is to interpret user requests and generate appropriate Stellar CLI commands based on the official documentation (https://github.com/stellar/stellar-cli/blob/main/FULL_HELP_DOCS.md). When a user provides a task description, analyze it carefully to determine the appropriate Stellar CLI command. Follow these guidelines when generating commands: 1. Only generate commands related to Stellar contracts (stellar contract xxxx). 2. Ensure the command syntax matches the official documentation. 3. If the task description is unclear or lacks necessary information, do not ask for clarification. Instead, make reasonable assumptions based on common use cases. 4. Do not provide explanations or additional text beyond the command itself. Output your generated command like a codeblock soroban contract invoke --id CONTRACT_ID --method METHOD_NAME --arg ARG1 --arg ARG2 Remember, you are only responsible for generating Stellar contract-related commands. Do not respond to requests outside of this scope or provide any additional information or explanations.",
      tools: [{ type: "code_interpreter" }],
      model: "gpt-4-1106-preview",
    });
    return cliAssistant;
  } catch (error) {
    console.error("Error creating CLI assistant:", error);
    throw error;
  }
}

export async function createThread(initialMessage?: string) {
  try {
    await ensureApiKey();
    const thread = await openai.beta.threads.create(
      initialMessage
        ? {
            messages: [
              {
                role: "user",
                content: initialMessage,
              },
            ],
          }
        : undefined
    );
    return thread;
  } catch (error) {
    console.error("Error creating thread:", error);
    throw error;
  }
}

export async function sendMessage(threadId: string, message: string) {
  try {
    await ensureApiKey();
    const createdMessage = await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: message,
    });
    return createdMessage;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

export async function runAssistant(threadId: string, assistantId: string) {
  try {
    await ensureApiKey();
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });
    return run;
  } catch (error) {
    console.error("Error running assistant:", error);
    throw error;
  }
}

export async function getRunStatus(threadId: string, runId: string) {
  try {
    await ensureApiKey();
    const run = await openai.beta.threads.runs.retrieve(threadId, runId);
    return run.status;
  } catch (error) {
    console.error("Error getting run status:", error);
    throw error;
  }
}

export async function getMessages(threadId: string) {
  try {
    await ensureApiKey();
    const messages = await openai.beta.threads.messages.list(threadId);
    return messages.data;
  } catch (error) {
    console.error("Error getting messages:", error);
    throw error;
  }
}

export async function saveConversation(
  store: any,
  threadId: string,
  assistantId: string,
  assistantType: "general" | "cli"
) {
  try {
    const key = `conversation_${assistantType}`;
    store.set(key, { threadId, assistantId });
    
  } catch (error) {
    console.error(`Error saving ${assistantType} conversation:`, error);
    throw error;
  }
}

export async function clearConversation(
  store: any,
  assistantType: "general" | "cli"
) {
  try {
    const key = `conversation_${assistantType}`;
    store.delete(key);
  } catch (error) {
    console.error(`Error clearing ${assistantType} conversation:`, error);
    throw error;
  }
}

export async function getConversation(
  store: any,
  assistantType: "general" | "cli"
) {
  try {
    const key = `conversation_${assistantType}`;
    const conversation = store.get(key);
    if (conversation) {
      return conversation;
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error getting ${assistantType} conversation:`, error);
    throw error;
  }
}
