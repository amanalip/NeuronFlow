import json
import os

# Categories table
categories = [
    (1, 'Neural Network Foundations', 'neural-foundations'),
    (2, 'Text Representation', 'text-representation'),
    (3, 'Tokenization in Detail', 'tokenization'),
    (4, 'Sequence Models (Pre-Transformer)', 'sequence-models'),
    (5, 'The Transformer', 'transformer'),
    (6, 'Training LLMs', 'training'),
    (7, 'Text Generation & Decoding', 'text-generation'),
    (8, 'Attention Visualizations', 'attention-viz'),
    (9, 'Context & Memory', 'context-memory'),
    (10, 'Alignment & Safety', 'alignment-safety'),
    (11, 'Efficiency & Optimization', 'efficiency-optimization'),
    (12, 'Architecture Variants', 'architecture-variants'),
    (13, 'RAG (Retrieval-Augmented Generation)', 'rag'),
    (14, 'Prompting & Usage', 'prompting'),
    (15, 'Agents & Multi-Step Reasoning', 'agents'),
    (16, 'Evaluation & Benchmarks', 'evaluation-benchmarks'),
    (17, 'Infrastructure & Serving', 'infrastructure-serving'),
    (18, 'Model Family Tree & History', 'history'),
]

cat_map = {c[0]: c for c in categories}

# Load the comprehensive dictionary of all 215 concepts
