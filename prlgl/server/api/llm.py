"""
OpenAI GPT-4 Integration Module

This module handles all communication with OpenAI's GPT-4 API for generating
legal analysis and explanations. It provides a standardized interface for
sending legal questions and receiving AI-powered responses.

The module is configured to use GPT-4 Turbo with specific parameters optimized
for legal analysis tasks.
"""

import os
from dotenv import load_dotenv
from typing import Any, Dict, Iterable, List, Optional
from openai import OpenAI

# Load environment variables to get the OpenAI API key
# This key is required to access GPT-4 services
o = os.path.dirname(os.path.abspath(__file__))
os.chdir(o)

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

if not OPENAI_API_KEY:
    raise ValueError("No OpenAI API key found in environment variables", os.getcwd())

# Configuration settings for GPT-4 optimized for legal analysis
DEFAULT_MODEL = 'gpt-4-turbo-preview'  # Most advanced GPT-4 model
DEFAULT_MAX_TOKENS = 1200              # Maximum length of AI responses
DEFAULT_TEMPERATURE = 0.0              # Low temperature for consistent, factual responses
DEFAULT_TOP_P = 1.0                    # Controls response diversity
DEFAULT_FREQUENCY_PENALTY = 0.0        # Reduces repetitive text
DEFAULT_PRESENCE_PENALTY = 0.0         # Encourages topic diversity
DEFAULT_N_PAST_MESSAGES = 10           # Number of previous messages to remember
DEFAULT_SEED = None                    # For reproducible responses (if needed)

# Initialize the OpenAI client with the API key
client = OpenAI(api_key = OPENAI_API_KEY)

def get_completion(
    messages: List[Dict[str, str]],
    max_tokens: Optional[int] = DEFAULT_MAX_TOKENS,
    temperature: Optional[float] = DEFAULT_TEMPERATURE,
    top_p: Optional[float] = DEFAULT_TOP_P,
    frequency_penalty: Optional[float] = DEFAULT_FREQUENCY_PENALTY,
    presence_penalty: Optional[float] = DEFAULT_PRESENCE_PENALTY,
    seed: Optional[int] = DEFAULT_SEED,
):
    """
    Send a conversation to GPT-4 and get a response.

    This function is the main interface for communicating with OpenAI's GPT-4.
    It takes a conversation (list of messages) and returns the AI's response.

    Args:
        messages: List of conversation messages in format [{"role": "user", "content": "text"}]
        max_tokens: Maximum length of the AI response
        temperature: Controls randomness (0.0 = very consistent, 1.0 = very creative)
        top_p: Controls response diversity
        frequency_penalty: Reduces repetitive phrases
        presence_penalty: Encourages topic diversity
        seed: For reproducible responses (optional)

    Returns:
        response: Complete OpenAI API response object containing the AI's answer

    Raises:
        ValueError: If the AI doesn't provide a response
    """
    # Send the conversation to GPT-4
    response = client.chat.completions.create(
        model=DEFAULT_MODEL,
        messages=messages,  # type: ignore
        max_tokens=max_tokens,
        temperature=temperature,
        top_p=top_p,
        frequency_penalty=frequency_penalty,
        presence_penalty=presence_penalty,
        seed=seed,
        stream=False,  # Get complete response at once (not streaming)
    )

    # Check if we got a valid response
    reply_content = response.choices[0].message.content
    if reply_content:
        return response

    raise ValueError("No reply content from API response!")