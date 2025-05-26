# Local AI Agent with Hugging Face Tiny Agents

This project demonstrates a custom-built local AI agent capable of performing web searches and sentiment analysis.

## Features

- **Web Browsing:** Utilizes Playwright to perform web searches and retrieve information from web pages.
- **Sentiment Analysis:** Connects to a remote Gradio-based Hugging Face Space to analyze the sentiment of provided text.

## Technologies Used

- **@huggingface/tiny-agents:** The core library for building the AI agent.
- **TypeScript:** For robust and type-safe JavaScript development.
- **Model Context Protocol (MCP):** Enables communication and integration of different tools and services.
- **Playwright:** For browser automation and web interaction.
- **Gradio/Hugging Face Spaces:** Hosts the sentiment analysis model.
- **LLM:** Configured to use `Qwen/Qwen2.5-72B-Instruct` (via the `nebius` provider) through Hugging Face Inference, but can be adapted for other models.

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/mwill20/mcp-tiny-agent.git
    cd mcp-tiny-agent
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the project root or set the following environment variables in your shell:

    *   `HF_TOKEN`: Your Hugging Face API token with at least 'read' permissions. Obtainable from [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens).
    *   `SENTIMENT_SERVER_URL`: The URL of your deployed Gradio sentiment analysis MCP server. For example, `https://YOUR_SPACE_NAME.hf.space/gradio_api/mcp/sse`.
    *   `PROVIDER` (Optional): The LLM provider. Defaults to `nebius`. Example: `nebius`.
    *   `MODEL_ID` (Optional): The LLM model ID. Defaults to `Qwen/Qwen2.5-72B-Instruct`. Example: `Qwen/Qwen2.5-72B-Instruct`.

    *Example for PowerShell:*
    ```powershell
    $env:HF_TOKEN="your_hf_token_here"
    $env:SENTIMENT_SERVER_URL="your_gradio_mcp_sse_url_here"
    $env:PROVIDER="nebius"
    $env:MODEL_ID="Qwen/Qwen2.5-72B-Instruct"
    ```

## How to Run

Ensure your environment variables are set correctly.

1.  Start the agent:
    ```bash
    npx tsx agent.ts
    ```

2.  The agent will initialize, load tools, and then present a `User:` prompt.

## Example Usage

Once the agent is running, you can type prompts like:

*   **Web Search:**
    `Search Google for "latest AI breakthroughs"`

*   **Sentiment Analysis:**
    `What is the sentiment of the phrase "Tiny Agents are incredibly versatile!"?`

To exit the agent, type `exit` or `quit`.
