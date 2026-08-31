// Curated Glossary and Cross-References for NeuronFlow

export interface GlossaryTerm {
  term: string;
  definition: string;
  conceptNumber: number;
  categoryNumber: number;
}

export interface RelatedConceptLink {
  fromNumber: number;
  relatedNumbers: number[];
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  { term: 'Activation Function', definition: 'Mathematical non-linear transformation applied to neuron weighted sums to model complex non-linear patterns.', conceptNumber: 2, categoryNumber: 1 },
  { term: 'Adaptive Learning Rate (AdamW)', definition: 'Optimization algorithm computing individual learning rates for different parameters using first and second moments of gradients with decoupled weight decay.', conceptNumber: 69, categoryNumber: 6 },
  { term: 'ALiBi (Attention with Linear Biases)', definition: 'Positional encoding method that biases query-key attention scores linearly by token distance instead of adding position vectors.', conceptNumber: 56, categoryNumber: 5 },
  { term: 'Alignment Tax', definition: 'The observed degradation in raw benchmark performance that sometimes occurs when aggressively aligning models for safety.', conceptNumber: 125, categoryNumber: 10 },
  { term: 'Autoregressive Generation', definition: 'Generating text token-by-token where each newly generated token is appended to the input context for the next prediction.', conceptNumber: 82, categoryNumber: 7 },
  { term: 'Backpropagation', definition: 'Algorithm calculating gradients of loss with respect to all model weights using the mathematical chain rule backwards through the computation graph.', conceptNumber: 6, categoryNumber: 1 },
  { term: 'Batch Normalization', definition: 'Technique standardizing layer inputs across mini-batches during training to accelerate convergence.', conceptNumber: 11, categoryNumber: 1 },
  { term: 'Beam Search', definition: 'Heuristic decoding algorithm maintaining the top-B most probable sequence candidates at each step.', conceptNumber: 84, categoryNumber: 7 },
  { term: 'BLEU Score', definition: 'Precision-based evaluation metric measuring exact n-gram overlap between candidate and reference translations with a brevity penalty.', conceptNumber: 189, categoryNumber: 16 },
  { term: 'Byte-Pair Encoding (BPE)', definition: 'Subword tokenization algorithm iteratively merging the most frequent pair of adjacent bytes/characters.', conceptNumber: 30, categoryNumber: 3 },
  { term: 'Calibration (ECE)', definition: 'Metric assessing whether predicted probability confidences accurately reflect empirical accuracy.', conceptNumber: 195, categoryNumber: 16 },
  { term: 'Causal Masking', definition: 'Lower-triangular attention mask preventing tokens from attending to future positions during autoregressive pre-training.', conceptNumber: 101, categoryNumber: 8 },
  { term: 'Chain of Thought (CoT)', definition: 'Prompting technique eliciting step-by-step intermediate reasoning tokens before generating final answers.', conceptNumber: 168, categoryNumber: 14 },
  { term: 'Chinchilla Scaling Laws', definition: 'Empirical scaling laws demonstrating that model parameters and training tokens should scale in equal proportion for compute-optimal pre-training.', conceptNumber: 74, categoryNumber: 6 },
  { term: 'Constitutional AI (RLAIF)', definition: 'Alignment framework where models critique and refine responses using a written set of ethical principles and AI feedback.', conceptNumber: 120, categoryNumber: 10 },
  { term: 'Continuous Batching', definition: 'Serving scheduler dynamically evicting finished sequences and inserting new requests at each token iteration step.', conceptNumber: 201, categoryNumber: 17 },
  { term: 'Cosine Similarity', definition: 'Geometric metric measuring the cosine of the angle between two normalized vectors.', conceptNumber: 23, categoryNumber: 2 },
  { term: 'Cross-Attention', definition: 'Attention mechanism where query vectors originate from decoder tokens while key and value vectors originate from encoder states.', conceptNumber: 52, categoryNumber: 5 },
  { term: 'Cross-Entropy Loss', definition: 'Standard loss function quantifying the difference between true label probabilities and predicted logit distributions.', conceptNumber: 14, categoryNumber: 1 },
  { term: 'Direct Preference Optimization (DPO)', definition: 'Closed-form mathematical alternative to RLHF directly optimizing policy weights on human preference pairs without a separate reward model.', conceptNumber: 118, categoryNumber: 10 },
  { term: 'FlashAttention', definition: 'IO-aware exact self-attention algorithm tiling matrix computation across GPU SRAM cache to eliminate HBM memory traffic.', conceptNumber: 80, categoryNumber: 6 },
  { term: 'Grouped-Query Attention (GQA)', definition: 'Attention design sharing single Key-Value head pairs across clusters of Query heads to slash KV cache memory.', conceptNumber: 108, categoryNumber: 9 },
  { term: 'HNSW (Hierarchical Navigable Small World)', definition: 'Multi-layer proximity graph algorithm enabling logarithmic ANN vector similarity search.', conceptNumber: 158, categoryNumber: 13 },
  { term: 'In-Context Learning', definition: 'Ability of pre-trained models to adapt to tasks using demonstration examples in the prompt without gradient updates.', conceptNumber: 167, categoryNumber: 14 },
  { term: 'KV Cache', definition: 'Inference optimization saving key and value attention tensors across sequence steps to avoid redundant token recomputation.', conceptNumber: 105, categoryNumber: 9 },
  { term: 'LoRA (Low-Rank Adaptation)', definition: 'Parameter-efficient fine-tuning technique freezing model weights and injecting trainable low-rank rank decomposition matrices.', conceptNumber: 132, categoryNumber: 11 },
  { term: 'Mixture of Experts (MoE)', definition: 'Sparse architecture routing each input token dynamically to top-k specialized feed-forward sub-networks.', conceptNumber: 140, categoryNumber: 12 },
  { term: 'MMLU Benchmark', definition: 'Massive Multitask Language Understanding benchmark spanning 57 academic subjects.', conceptNumber: 192, categoryNumber: 16 },
  { term: 'Multi-Head Attention', definition: 'Parallel self-attention mechanism projecting queries, keys, and values into multiple representation subspaces simultaneously.', conceptNumber: 51, categoryNumber: 5 },
  { term: 'Needle in a Haystack (NIAH)', definition: 'Evaluation benchmark stress-testing fact retrieval recall across variable document context depths and lengths.', conceptNumber: 196, categoryNumber: 16 },
  { term: 'PagedAttention', definition: 'Virtual memory paging algorithm storing non-contiguous KV cache blocks to eliminate memory fragmentation.', conceptNumber: 112, categoryNumber: 9 },
  { term: 'Perplexity', definition: 'Exponentiated average negative log-likelihood measuring model prediction surprise.', conceptNumber: 188, categoryNumber: 16 },
  { term: 'Prompt Caching', definition: 'Serving technique reusing pre-computed KV cache states for identical shared prompt prefixes across API queries.', conceptNumber: 177, categoryNumber: 14 },
  { term: 'Quantization (INT8 / INT4)', definition: 'Compressing 16-bit floating point weights into low-bit integers to reduce VRAM footprint and accelerate memory bandwidth.', conceptNumber: 126, categoryNumber: 11 },
  { term: 'RAG (Retrieval-Augmented Generation)', definition: 'Architecture combining external vector store document retrieval with language model prompt generation.', conceptNumber: 152, categoryNumber: 13 },
  { term: 'ReAct (Reasoning + Acting)', definition: 'Agent paradigm interleaving natural language thought steps with external tool execution and observation feedback.', conceptNumber: 170, categoryNumber: 14 },
  { term: 'Reflexion', definition: 'Agent self-correction framework storing verbal critique reflections to iteratively improve reasoning traces.', conceptNumber: 185, categoryNumber: 15 },
  { term: 'Rotary Position Embedding (RoPE)', definition: 'Positional encoding applying a complex coordinate rotation to query and key vectors capturing relative distance.', conceptNumber: 55, categoryNumber: 5 },
  { term: 'Self-Attention', definition: 'Core Transformer layer computing dynamic pairwise similarity weights across all token positions simultaneously.', conceptNumber: 48, categoryNumber: 5 },
  { term: 'Softmax', definition: 'Activation function converting arbitrary real-valued logit scores into a valid probability distribution summing to 1.', conceptNumber: 13, categoryNumber: 1 },
  { term: 'Speculative Decoding', definition: 'Inference acceleration algorithm using a small draft model to propose tokens verified in parallel by the target LLM.', conceptNumber: 93, categoryNumber: 7 },
  { term: 'State Space Models (Mamba / S4)', definition: 'Sub-quadratic recurrent architecture with continuous state equations competing with Transformer attention.', conceptNumber: 144, categoryNumber: 12 },
  { term: 'Supervised Fine-Tuning (SFT)', definition: 'Post-training stage teaching base pre-trained models to follow multi-turn instructional dialogue conventions.', conceptNumber: 114, categoryNumber: 10 },
  { term: 'Temperature', definition: 'Hyperparameter dividing logits before softmax to control randomness and peakiness in probability sampling.', conceptNumber: 85, categoryNumber: 7 },
  { term: 'Tensor Parallelism', definition: 'Multi-GPU model sharding splitting individual weight matrices across GPUs interconnected via high-speed NVLink.', conceptNumber: 76, categoryNumber: 6 },
  { term: 'Time to First Token (TTFT)', definition: 'Latency metric measuring duration from request dispatch until arrival of the first output stream token.', conceptNumber: 203, categoryNumber: 17 },
  { term: 'Word2Vec', definition: 'Pioneering neural algorithm mapping vocabulary words into dense continuous semantic vector embeddings.', conceptNumber: 19, categoryNumber: 2 },
  { term: 'ZeRO (Zero Redundancy Optimizer)', definition: 'Distributed memory optimization partitioning optimizer states, gradients, and parameters across training nodes.', conceptNumber: 79, categoryNumber: 6 },
];

export function getRelatedConceptNumbers(conceptNumber: number): number[] {
  // Returns curated related concepts
  if (conceptNumber >= 48 && conceptNumber <= 65) {
    // Transformer concepts
    return [48, 51, 55, 80, 105].filter((n) => n !== conceptNumber);
  }
  if (conceptNumber >= 114 && conceptNumber <= 125) {
    // Alignment concepts
    return [114, 115, 118, 120, 175].filter((n) => n !== conceptNumber);
  }
  if (conceptNumber >= 152 && conceptNumber <= 163) {
    // RAG concepts
    return [152, 156, 158, 159, 161].filter((n) => n !== conceptNumber);
  }
  if (conceptNumber >= 164 && conceptNumber <= 177) {
    // Prompting concepts
    return [164, 168, 170, 172, 177].filter((n) => n !== conceptNumber);
  }
  if (conceptNumber >= 178 && conceptNumber <= 187) {
    // Agents
    return [178, 180, 183, 184, 185].filter((n) => n !== conceptNumber);
  }
  if (conceptNumber >= 198 && conceptNumber <= 207) {
    // Serving & Infrastructure
    return [198, 199, 201, 203, 205].filter((n) => n !== conceptNumber);
  }
  // Default related
  return [(conceptNumber % 215) + 1, Math.max(1, conceptNumber - 1)];
}
