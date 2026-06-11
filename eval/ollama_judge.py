"""Ollama-backed judge model for DeepEval."""
from __future__ import annotations

import json
from typing import Optional

import requests
from deepeval.models import DeepEvalBaseLLM


class OllamaJudge(DeepEvalBaseLLM):
    """Wraps a local Ollama model as a DeepEval judge.

    Usage:
        judge = OllamaJudge(model="qwen3:14b")          # text/code criteria
        vision_judge = OllamaJudge(model="qwen2.5vl:7b") # screenshot analysis
    """

    BASE_URL = "http://localhost:11434"

    def __init__(self, model: str = "qwen3:14b", temperature: float = 0.0):
        self.model = model
        self.temperature = temperature

    def get_model_name(self) -> str:
        return self.model

    def load_model(self):
        return self

    @staticmethod
    def _strip_think_tags(text: str) -> str:
        """Remove <think>...</think> reasoning blocks emitted by qwen3 models."""
        import re
        return re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL).strip()

    def generate(self, prompt: str, schema: Optional[type] = None) -> str:
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
            "options": {"temperature": self.temperature},
        }
        response = requests.post(
            f"{self.BASE_URL}/api/generate",
            json=payload,
            timeout=600,
        )
        response.raise_for_status()
        return self._strip_think_tags(response.json()["response"])

    async def a_generate(self, prompt: str, schema: Optional[type] = None) -> str:
        return self.generate(prompt, schema)

    def generate_with_image(self, prompt: str, image_path: str) -> str:
        """Send a prompt alongside a base64-encoded image (for qwen2.5vl)."""
        import base64
        with open(image_path, "rb") as f:
            image_b64 = base64.b64encode(f.read()).decode()

        payload = {
            "model": self.model,
            "prompt": prompt,
            "images": [image_b64],
            "stream": False,
            "options": {"temperature": self.temperature},
        }
        response = requests.post(
            f"{self.BASE_URL}/api/generate",
            json=payload,
            timeout=600,
        )
        response.raise_for_status()
        return self._strip_think_tags(response.json()["response"])
