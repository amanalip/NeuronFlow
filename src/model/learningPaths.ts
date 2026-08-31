// Prerequisite relationships and guided learning tracks for NeuronFlow

export interface LearningTrack {
  id: string;
  title: string;
  description: string;
  conceptNumbers: number[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

// Prerequisites map: concept number -> array of prerequisite concept numbers
export const PREREQUISITES_MAP: Record<number, number[]> = {
  // Category 1: Neural Network Foundations
  2: [1],      // Activation Functions -> Perceptron
  3: [1, 2],   // MLP -> Perceptron, Activation Functions
  4: [3],      // Forward Pass -> MLP
  5: [4],      // Loss Functions -> Forward Pass
  6: [4, 5],   // Backpropagation -> Forward Pass, Loss Functions
  7: [6],      // Gradient Descent -> Backpropagation
  8: [7],      // Learning Rate -> Gradient Descent
  9: [7],      // Overfitting -> Gradient Descent
  10: [9],     // Regularization -> Overfitting
  11: [4],     // Batch Norm -> Forward Pass
  12: [4, 6],  // Weight Initialization -> Forward Pass, Backprop
  13: [2],     // Softmax -> Activation Functions
  14: [5, 13], // Cross-Entropy -> Loss Functions, Softmax
  15: [6],     // Computation Graphs -> Backpropagation

  // Category 2: Text Representation
  17: [16],    // BoW -> One-Hot
  18: [17],    // TF-IDF -> BoW
  19: [16, 4], // Word2Vec CBOW -> One-Hot, Forward Pass
  20: [19],    // Skip-Gram -> CBOW
  21: [19],    // GloVe -> CBOW
  22: [19],    // Word Analogies -> Word2Vec
  23: [22],    // Cosine Similarity -> Word Analogies
  24: [23],    // Embedding Dimensions -> Cosine Similarity
  25: [24],    // Sentence Embeddings -> Embedding Dimensions
  26: [16],    // Embedding Lookup -> One-Hot
  27: [24, 26],// Embedding Space Explorer -> Dimensions, Lookup

  // Category 3: Tokenization
  29: [28],    // Word-Level -> Character-Level
  30: [28],    // BPE -> Character-Level
  31: [30],    // WordPiece -> BPE
  32: [30],    // SentencePiece -> BPE
  33: [30, 31, 32], // Tokenizer Comparison -> BPE, WordPiece, SentencePiece
  34: [33],    // Special Tokens -> Tokenizer Comparison
  35: [26, 33],// Vocab & Token IDs -> Embedding Lookup, Tokenizer Comparison
  36: [35],    // Detokenization -> Vocab & Token IDs
  37: [33],    // Multilingual -> Tokenizer Comparison

  // Category 4: Sequence Models
  39: [38],    // Vanishing Gradients -> RNN
  40: [39],    // Exploding Gradients -> Vanishing Gradients
  41: [39],    // LSTM -> Vanishing Gradients
  42: [41],    // GRU -> LSTM
  43: [38],    // Bi-RNN -> RNN
  44: [41],    // Seq2Seq -> LSTM
  45: [44],    // Attention (Bahdanau) -> Seq2Seq
  46: [44],    // Teacher Forcing -> Seq2Seq
  47: [38, 45],// Why Transformers Won -> RNN, Bahdanau

  // Category 5: The Transformer
  48: [13, 45],// Self-Attention -> Softmax, Bahdanau
  49: [48],    // Q, K, V Matrices -> Self-Attention
  50: [49],    // Scaled Dot-Product -> QKV
  51: [50],    // Multi-Head Attention -> Scaled Dot-Product
  52: [51],    // Cross-Attention -> Multi-Head
  53: [48],    // Positional Encoding -> Self-Attention
  54: [53],    // Learned Positional -> Positional Encoding
  55: [53],    // RoPE -> Positional Encoding
  56: [53],    // ALiBi -> Positional Encoding
  57: [51],    // Feed-Forward Layer -> Multi-Head
  58: [11],    // Layer Normalization -> Batch Norm
  59: [58],    // RMSNorm -> LayerNorm
  60: [4],     // Residual Connections -> Forward Pass
  61: [58, 60],// Pre-LN vs Post-LN -> LayerNorm, Residuals
  62: [48, 51],// Encoder Architecture -> Self-Attention, Multi-Head
  63: [52],    // Decoder Architecture -> Cross-Attention
  64: [62, 63],// Full Transformer -> Encoder, Decoder
  65: [64],    // Transformer Math Step-by-Step -> Full Transformer

  // Category 6: Training LLMs
  67: [66],    // Next-Token Prediction -> Pre-Training
  68: [66],    // Masked Language Modeling -> Pre-Training
  69: [7, 66], // AdamW Optimizer -> Gradient Descent, Pre-Training
  70: [8],     // Learning Rate Schedules -> Learning Rate
  71: [7],     // Gradient Clipping -> Gradient Descent
  72: [7],     // Mixed Precision -> Gradient Descent
  73: [67],    // Loss Curves -> Next-Token Prediction
  74: [66],    // Scaling Laws (Chinchilla) -> Pre-Training
  75: [72],    // Distributed Data Parallel -> Mixed Precision
  76: [75],    // Tensor Parallelism -> DDP
  77: [76],    // Pipeline Parallelism -> Tensor Parallelism
  78: [75],    // 3D Parallelism -> DDP
  79: [75],    // ZeRO Memory Optimization -> DDP
  80: [48, 72],// FlashAttention -> Self-Attention, Mixed Precision
  81: [66],    // Data Curation -> Pre-Training

  // Category 7: Generation & Decoding
  83: [82],    // Greedy Decoding -> Autoregressive Loop
  84: [83],    // Beam Search -> Greedy
  85: [82, 13],// Temperature -> Autoregressive, Softmax
  86: [85],    // Top-k Sampling -> Temperature
  87: [85],    // Top-p (Nucleus) -> Temperature
  88: [85],    // Min-p Sampling -> Temperature
  89: [82],    // Repetition Penalty -> Autoregressive
  90: [82],    // Frequency/Presence Penalty -> Autoregressive
  91: [82],    // Length Penalty -> Autoregressive
  92: [82],    // Stop Tokens -> Autoregressive
  93: [82],    // Speculative Decoding -> Autoregressive
  94: [85, 86, 87], // Sampling Strategy Comparison -> Temperature, Top-k, Top-p
  95: [82],    // Hallucination in Generation -> Autoregressive

  // Category 8: Attention Visualizations
  97: [96],    // Self-Attention Heatmap -> Attention Map
  98: [96],    // Multi-Head Attention Map -> Attention Map
  99: [96],    // Layer-by-Layer Attention -> Attention Map
  100: [96],   // Cross-Attention Map -> Attention Map
  101: [96],   // Causal Mask Visualization -> Attention Map
  102: [96],   // Attention Rollout -> Attention Map
  103: [96],   // Attention Patterns -> Attention Map

  // Category 9: Context & Memory
  105: [104],  // KV Cache -> Context Window
  106: [105],  // KV Cache Memory -> KV Cache
  107: [105],  // Multi-Query Attention (MQA) -> KV Cache
  108: [107],  // Grouped-Query Attention (GQA) -> MQA
  109: [104],  // Sliding Window Attention -> Context Window
  110: [104],  // Long-Context Challenges -> Context Window
  111: [55, 110], // RoPE Scaling (YaRN) -> RoPE, Long-Context
  112: [105],  // PagedAttention -> KV Cache
  113: [104, 111], // Context Compression -> Context Window, RoPE Scaling

  // Category 10: Alignment & Safety
  115: [114],  // RLHF -> SFT
  116: [115],  // Reward Modeling -> RLHF
  117: [115],  // PPO -> RLHF
  118: [115],  // DPO -> RLHF
  119: [118],  // KTO, ORPO, SimPO -> DPO
  120: [114],  // Constitutional AI -> SFT
  121: [114],  // Red Teaming -> SFT
  122: [114],  // System Prompts & Guardrails -> SFT
  123: [114],  // Harmful Output Mitigation -> SFT
  124: [114],  // Unlearning & Editing -> SFT
  125: [114],  // Alignment Tax -> SFT

  // Category 11: Efficiency & Optimization
  127: [126],  // Post-Training Quantization -> Quantization
  128: [126],  // Quantization-Aware Training -> Quantization
  129: [126],  // INT8 / INT4 -> Quantization
  130: [129],  // AWQ & GPTQ -> INT8/INT4
  131: [114],  // Parameter-Efficient Fine-Tuning (PEFT) -> SFT
  132: [131],  // LoRA -> PEFT
  133: [130, 132], // QLoRA -> AWQ, LoRA
  134: [131],  // Adapters -> PEFT
  135: [131],  // Prefix & Prompt Tuning -> PEFT
  136: [131],  // (IA)3 -> PEFT
  137: [66],   // Knowledge Distillation -> Pre-Training
  138: [66],   // Model Pruning -> Pre-Training
  139: [6],    // Activation Checkpointing -> Backprop

  // Category 12: Architecture Variants
  141: [140],  // Routing Mechanisms -> MoE
  142: [140],  // Expert Specialization -> MoE
  143: [38],   // State Space Models (SSM) -> RNN
  144: [143],  // Mamba -> SSM
  145: [38],   // RWKV -> RNN
  146: [62],   // Vision Transformer (ViT) -> Encoder
  147: [146],  // Multimodal (Text + Image) -> ViT
  148: [147],  // Multimodal Audio -> Multimodal (Text+Image)
  149: [147],  // Multimodal Video -> Multimodal (Text+Image)
  150: [4],    // Diffusion Transformers (DiT) -> Forward Pass
  151: [48, 143], // Architecture Comparisons -> Self-Attention, SSM

  // Category 13: RAG
  153: [152],  // Document Chunking -> RAG Pipeline
  154: [153],  // Chunk Overlap -> Document Chunking
  155: [25, 152], // Embedding Documents -> Sentence Embeddings, RAG
  156: [155],  // Vector Store -> Embedding Documents
  157: [23, 156], // Similarity Search -> Cosine Similarity, Vector Store
  158: [156],  // HNSW -> Vector Store
  159: [18, 157], // Hybrid Search -> TF-IDF, Similarity Search
  160: [157],  // Re-Ranking -> Similarity Search
  161: [152],  // Prompt Assembly for RAG -> RAG Pipeline
  162: [152],  // RAG Evaluation (RAGAS) -> RAG Pipeline
  163: [114, 152], // RAG vs Fine-Tuning -> SFT, RAG Pipeline

  // Category 14: Prompting & Usage
  165: [164],  // System Prompts -> Prompt Structure
  166: [164],  // Zero-Shot -> Prompt Structure
  167: [166],  // Few-Shot -> Zero-Shot
  168: [167],  // Chain of Thought -> Few-Shot
  169: [168],  // Tree of Thought -> Chain of Thought
  170: [168],  // ReAct -> Chain of Thought
  171: [168],  // Self-Consistency -> Chain of Thought
  172: [164],  // Tool Use -> Prompt Structure
  173: [172],  // Structured Output -> Tool Use
  174: [35],   // Token Counting & Pricing -> Vocab & Token IDs
  175: [165],  // Prompt Injection -> System Prompts
  176: [104],  // Context Stuffing & NIAH -> Context Window
  177: [105],  // Prompt Caching -> KV Cache

  // Category 15: Agents
  179: [178],  // Tool Use Pipeline -> Agent Loop
  180: [178],  // Task Decomposition -> Agent Loop
  181: [178],  // Short-Term Memory -> Agent Loop
  182: [156, 178], // Long-Term Memory -> Vector Store, Agent Loop
  183: [178],  // Multi-Agent Systems -> Agent Loop
  184: [179],  // Code Execution Agents -> Tool Use Pipeline
  185: [178],  // Reflection & Self-Correction -> Agent Loop
  186: [180, 182], // Autonomous Agents -> Task Decomposition, Long-Term Memory
  187: [183],  // Orchestration Patterns -> Multi-Agent Systems

  // Category 16: Evaluation & Benchmarks
  189: [188],  // BLEU -> Perplexity
  190: [189],  // ROUGE -> BLEU
  191: [188],  // Human Evaluation -> Perplexity
  192: [188],  // Benchmark Leaderboards -> Perplexity
  193: [192],  // Evaluation Contamination -> Benchmark Leaderboards
  194: [191],  // ELO Ratings -> Human Evaluation
  195: [188],  // Calibration & Uncertainty -> Perplexity
  196: [176],  // Needle in a Haystack Test -> Context Stuffing
  197: [191],  // Multi-Turn Evaluation -> Human Evaluation

  // Category 17: Infrastructure & Serving
  199: [198],  // GPU Memory Breakdown -> GPU Architecture
  200: [198],  // Batch Processing -> GPU Architecture
  201: [200],  // Continuous Batching -> Batch Processing
  202: [201],  // Model Serving Architecture -> Continuous Batching
  203: [202],  // Latency Breakdown (TTFT/TPOT) -> Model Serving
  204: [203],  // Throughput vs Latency -> Latency Breakdown
  205: [76, 198], // Multi-GPU Inference -> Tensor Parallelism, GPU Architecture
  206: [129],  // Edge Deployment -> INT8/INT4
  207: [203],  // Prefill vs Decode -> Latency Breakdown

  // Category 18: History & Evolution
  209: [208],  // Model Family Tree -> Evolution Timeline
  210: [208],  // Parameter Count Evolution -> Evolution Timeline
  211: [209],  // Open vs Closed Models -> Model Family Tree
  212: [192, 208], // Benchmark Progress -> Benchmark Leaderboards, Evolution Timeline
  213: [174, 208], // Cost Per Token History -> Token Pricing, Evolution Timeline
  214: [74, 208],  // Training Compute Trends -> Scaling Laws, Evolution Timeline
  215: [74, 208],  // Emergent Abilities -> Scaling Laws, Evolution Timeline
};

export const GUIDED_LEARNING_TRACKS: LearningTrack[] = [
  {
    id: 'foundations-track',
    title: 'Track 1: Neural & Sequence Foundations',
    description: 'Master core deep learning mathematics from single perceptrons to recurrent sequence models.',
    conceptNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 23, 28, 30, 38, 41, 45, 47],
    difficulty: 'Beginner',
  },
  {
    id: 'transformer-deep-dive',
    title: 'Track 2: Transformer Architecture & Training',
    description: 'Understand the mathematical engine powering modern LLMs: attention, RoPE, scaling laws, and distributed pre-training.',
    conceptNumbers: [48, 49, 50, 51, 52, 53, 55, 57, 58, 60, 64, 65, 66, 67, 69, 74, 76, 79, 80],
    difficulty: 'Intermediate',
  },
  {
    id: 'alignment-safety-track',
    title: 'Track 3: Alignment, Safety & Post-Training',
    description: 'Learn how raw base foundation models are steered and aligned via SFT, RLHF, DPO, and guardrails.',
    conceptNumbers: [114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 175],
    difficulty: 'Intermediate',
  },
  {
    id: 'production-rag-agents-track',
    title: 'Track 4: Production RAG, Agents & Systems',
    description: 'Architect real-world intelligent systems using vector retrieval, autonomous agent loops, and high-throughput GPU serving.',
    conceptNumbers: [152, 153, 156, 158, 159, 160, 161, 168, 170, 172, 178, 180, 183, 184, 185, 198, 199, 201, 203, 205],
    difficulty: 'Advanced',
  },
];

export function getEstimatedReadMinutes(difficulty: 'Beginner' | 'Intermediate' | 'Advanced'): number {
  switch (difficulty) {
    case 'Beginner':
      return 3;
    case 'Intermediate':
      return 6;
    case 'Advanced':
      return 10;
  }
}
