import { Agent, StdioServerParameters } from "@huggingface/tiny-agents";

import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

async function main() {
    // Check for Hugging Face Token
    if (!process.env.HF_TOKEN) {
        console.error("ERROR: The HF_TOKEN environment variable is not set.");
        console.log("Please set your Hugging Face API token as HF_TOKEN.");
        console.log("Example (Linux/macOS): export HF_TOKEN='your_token_here'");
        console.log("Example (Windows PowerShell): $env:HF_TOKEN='your_token_here'");
        process.exit(1);
    }

    // Determine Provider and Model more explicitly
    const effectiveProvider = process.env.PROVIDER || "nous";
    const effectiveModelId = process.env.MODEL_ID || "Qwen/Qwen2.5-72B-Instruct";

    // Prepare STDIN/STDOUT based servers for the Agent constructor
    // Prepare STDIN/STDOUT based servers for the Agent constructor
    const stdioServers: StdioServerParameters[] = [
        // Filesystem server removed for now as its executable path is unknown.
        // {
        //     command: "node",
        //     args: ["path/to/fs/server.js"] // Placeholder if we find it later
        {
            command: "npx",
            args: ["@playwright/mcp@latest"]
        }
    ];

    // Agent Configuration
    const agent = new Agent({
        apiKey: process.env.HF_TOKEN,
        provider: effectiveProvider,
        model: effectiveModelId,
        servers: stdioServers, // Pass the STDIN/STDOUT servers here
    });

    console.log("Tiny Agent initialized.");
    console.log("Loading tools from stdio servers...");
    await agent.loadTools(); // This will load tools from stdioServers passed to constructor

    // Now, add the URL-based sentiment server if available
    if (process.env.SENTIMENT_SERVER_URL) {
        console.log(`Adding sentiment server via URL: ${process.env.SENTIMENT_SERVER_URL}`);
        try {
            await agent.addMcpServer({ type: "sse", config: { url: process.env.SENTIMENT_SERVER_URL } }); // Add URL server
            console.log("Sentiment server added.");
        } catch (error) {
            console.error("Failed to add sentiment server:", error);
        }
    }
    
    console.log("All tools attempted to load.");
    // Log the available tools to understand what the agent has registered
    // console.log("Available tools:", JSON.stringify(agent.availableTools, null, 2)); // Keep this commented out for potential future debugging
    console.log("Type your prompts to interact with the agent. Type 'exit' or 'quit' to stop.");
    console.log("---");
    console.log("IMPORTANT: Ensure your remote sentiment server is running and accessible.");
    console.log("If using the placeholder URL for the sentiment_analyzer, update it in agent.ts or set the SENTIMENT_SERVER_URL environment variable to your actual Gradio server's MCP endpoint.");
    console.log("---");

    const rl = readline.createInterface({ input, output });

    while (true) {
        const userInput = await rl.question('User: ');
        if (userInput.toLowerCase() === 'exit' || userInput.toLowerCase() === 'quit') {
            console.log('Exiting agent...');
            break;
        }

        if (userInput.trim() === "") {
            continue;
        }

        try {
            for await (const { type, content } of agent.run(userInput)) {
                if (type === "agent") {
                    process.stdout.write("Agent: ");
                }
                if (content === null || content === undefined) {
                    // Do not write anything if content is null or undefined,
                    // as process.stdout.write expects a string or buffer.
                    // Alternatively, print a placeholder like process.stdout.write('[NO CONTENT]');
                } else if (typeof content === 'object') {
                    process.stdout.write(JSON.stringify(content, null, 2));
                } else {
                    // Ensure content is a string for process.stdout.write
                    process.stdout.write(String(content));
                }
                process.stdout.write("\n");
            }
        } catch (error) {
            console.error("\nError during agent execution:", error);
        }
    }
    rl.close();
}

main().catch(error => {
    console.error("Unhandled error in main:", error);
    process.exit(1);
});
