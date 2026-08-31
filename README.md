# NeuronFlow

**See how machines learn.**

NeuronFlow is a browser-based interactive educational platform for understanding neural networks, Transformers, and Large Language Models from mathematical foundations to production infrastructure.

It features **215 interactive concept visualizers** across **18 categories**, accompanied by structured technical breakdowns, formulas rendered with KaTeX, verified academic literature sources, guided learning tracks, and an AI glossary.

Live Demo: [https://amanalip.github.io/NeuronFlow/](https://amanalip.github.io/NeuronFlow/)

---

## Core Capabilities

- **215 Interactive Concept Visualizers**: Explore live interactive simulations for neural foundations, attention mechanisms, decoding strategies, quantization, RAG pipelines, and autonomous agent loops.
- **Client-Side Computation**: Runs entirely in modern browsers using client-side JavaScript, WebGL, SVG, and local math routines. No server setup, accounts, or API keys required.
- **Prerequisite DAG & Guided Tracks**: Follow structured prerequisite sequences or curated tracks (Foundations, Transformer Architecture Track, Alignment & Safety, Production Systems).
- **Search & AI Glossary**: Quick jump across all 215 concepts, formulas, and 48+ indexed AI terms with `Ctrl+K` / `⌘+K`.
- **Keyboard Navigation**: Traverse concepts seamlessly with Arrow keys (`←` / `→`) and view the cheat sheet with `?`.
- **Light & Dark Theming**: Adaptive high-contrast dark and light themes with progress persistence in `localStorage`.

---

## Curriculum Categories

1. **Neural Network Foundations** (Concepts 1 to 15): Perceptrons, activation functions, forward pass, backpropagation, and optimizers.
2. **Text Representation** (Concepts 16 to 27): One-hot encoding, Bag of Words, TF-IDF, Word2Vec, GloVe, and embeddings.
3. **Tokenization in Detail** (Concepts 28 to 37): Byte-Pair Encoding (BPE), WordPiece, SentencePiece, and token vocabularies.
4. **Sequence Models (Pre-Transformer)** (Concepts 38 to 47): RNNs, vanishing gradients, LSTM, GRU, seq2seq, and Bahdanau attention.
5. **The Transformer** (Concepts 48 to 65): Scaled dot-product attention, multi-head attention, RoPE, ALiBi, and LayerNorm variants.
6. **Training LLMs** (Concepts 66 to 81): Pre-training objectives, AdamW, scaling laws, ZeRO optimization, and FlashAttention.
7. **Text Generation & Decoding** (Concepts 82 to 95): Autoregressive decoding, temperature, top-k, top-p (nucleus), min-p, and speculative decoding.
8. **Attention Visualizations** (Concepts 96 to 103): Multi-head attention maps, causal masking, cross-attention, and rollout.
9. **Context & Memory** (Concepts 104 to 113): KV cache calculation, Grouped-Query Attention (GQA), PagedAttention, and YaRN context scaling.
10. **Alignment & Safety** (Concepts 114 to 125): SFT, RLHF, DPO, KTO, ORPO, SimPO, Constitutional AI, and red-teaming.
11. **Efficiency & Optimization** (Concepts 126 to 139): INT8/INT4 quantization, AWQ, GPTQ, LoRA, QLoRA, and knowledge distillation.
12. **Architecture Variants** (Concepts 140 to 151): Mixture of Experts (MoE), Mamba (SSM), RWKV, Vision Transformers (ViT), and Diffusion Transformers (DiT).
13. **RAG (Retrieval-Augmented Generation)** (Concepts 152 to 163): Document chunking, vector stores, HNSW graph search, hybrid search, and RAGAS evaluation.
14. **Prompting & Usage** (Concepts 164 to 177): System prompts, Few-Shot, Chain-of-Thought, ReAct, prompt caching, and needle-in-a-haystack tests.
15. **Agents & Multi-Step Reasoning** (Concepts 178 to 187): Autonomous agent loops, tool use pipelines, DAG task decomposition, and Reflexion.
16. **Evaluation & Benchmarks** (Concepts 188 to 197): Perplexity, BLEU/ROUGE, LMSYS Chatbot Arena ELO, ECE calibration, and MT-Bench.
17. **Infrastructure & Serving** (Concepts 198 to 207): GPU VRAM memory hierarchy, continuous batching schedulers, TTFT/TPOT latency breakdowns, and multi-GPU tensor parallelism.
18. **Model Family Tree & History** (Concepts 208 to 215): Historical evolution timelines (2013 to 2024), family lineages, parameter scaling, and inference cost deflation.

---

## Tech Stack

- **Frontend Framework**: React 19, TypeScript (strict mode), Vite
- **State Management**: Zustand
- **Mathematics Rendering**: KaTeX
- **Charts & Matrix Heatmaps**: Recharts, D3
- **Flow Diagrams & Graphs**: @xyflow/react
- **3D Graphics**: Three.js, @react-three/fiber
- **Tokenization Engine**: gpt-tokenizer (cl100k_base)
- **Automated Testing**: Vitest (100 unit tests), Playwright (E2E)

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/amanalip/NeuronFlow.git
cd NeuronFlow

# Install dependencies
npm install

# Start development server
npm run dev

# Run full unit test suite
npm run test

# Run code linter
npm run lint

# Build production bundle
npm run build
```

---

## Keyboard Shortcuts

| Shortcut | Description |
|---|---|
| `Ctrl + K` / `⌘ + K` | Open global search modal for concepts and AI glossary |
| `←` (Left Arrow) | Navigate to previous concept |
| `→` (Right Arrow) | Navigate to next concept |
| `?` / `Shift + /` | Open keyboard shortcuts help modal |

---

## License

GPL-3.0 License.
