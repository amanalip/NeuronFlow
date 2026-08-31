# NeuronFlow

**See how machines learn.**

NeuronFlow is a browser-based interactive visual guide to neural networks, transformers, and large language models. It covers 215 concepts across 18 categories, organized as a step-by-step learning path from foundations to modern architectures.

## Key Features

- **215 Interactive Concepts**: Explore standalone interactive visualizations for neural foundations, attention mechanisms, decoding strategies, quantization, RAG, and agent loops.
- **Client-Side Only**: Runs entirely in the browser using toy models, pre-computed data, and client-side math. No API keys or accounts required.
- **Structured Explanations**: Every concept includes concise definitions, technical context, step-by-step breakdowns, and verified literature sources.
- **Theme & Progress Tracking**: Light and dark themes with persistent progress tracking in localStorage.
- **State Sharing**: Share and bookmark any concept state via URL hashes.

## Categories

1. Neural Network Foundations (Concepts 1-15)
2. Text Representation (Concepts 16-27)
3. Tokenization in Detail (Concepts 28-37)
4. Sequence Models, Pre-Transformer (Concepts 38-47)
5. The Transformer (Concepts 48-65)
6. Training LLMs (Concepts 66-81)
7. Text Generation & Decoding (Concepts 82-95)
8. Attention Visualizations (Concepts 96-103)
9. Context & Memory (Concepts 104-113)
10. Alignment & Safety (Concepts 114-125)
11. Efficiency & Optimization (Concepts 126-139)
12. Architecture Variants (Concepts 140-151)
13. RAG, Retrieval-Augmented Generation (Concepts 152-163)
14. Prompting & Usage (Concepts 164-177)
15. Agents & Multi-Step Reasoning (Concepts 178-187)
16. Evaluation & Benchmarks (Concepts 188-197)
17. Infrastructure & Serving (Concepts 198-207)
18. Model Family Tree & History (Concepts 208-215)

## Tech Stack

- **Framework**: React 19, TypeScript (strict), Vite
- **Styling**: CSS Modules
- **State**: Zustand
- **Diagrams & Flow**: @xyflow/react
- **2D Charts**: Recharts, D3
- **3D Visualizations**: Three.js, @react-three/fiber
- **Code & Text**: CodeMirror 6
- **Animation**: Framer Motion
- **Math Rendering**: KaTeX
- **Tokenization**: gpt-tokenizer
- **Testing**: Vitest, Playwright

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run unit tests
npm run test

# Run linter
npm run lint

# Build production bundle
npm run build
```

## License

GPL-3.0 License.
