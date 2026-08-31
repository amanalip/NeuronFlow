import json
import re
import sys
from concepts_part1 import part1_concepts
from concepts_part2 import part2_concepts
from concepts_part3 import part3_concepts

all_concepts = part1_concepts + part2_concepts + part3_concepts

print(f"Total concepts combined: {len(all_concepts)}")

# Verification checks
assert len(all_concepts) == 215, f"Expected exactly 215 concepts, got {len(all_concepts)}"

cat_dict = {
    1: ("Neural Network Foundations", "neural-foundations"),
    2: ("Text Representation", "text-representation"),
    3: ("Tokenization in Detail", "tokenization"),
    4: ("Sequence Models (Pre-Transformer)", "sequence-models"),
    5: ("The Transformer", "transformer"),
    6: ("Training LLMs", "training"),
    7: ("Text Generation & Decoding", "text-generation"),
    8: ("Attention Visualizations", "attention-viz"),
    9: ("Context & Memory", "context-memory"),
    10: ("Alignment & Safety", "alignment-safety"),
    11: ("Efficiency & Optimization", "efficiency-optimization"),
    12: ("Architecture Variants", "architecture-variants"),
    13: ("RAG (Retrieval-Augmented Generation)", "rag"),
    14: ("Prompting & Usage", "prompting"),
    15: ("Agents & Multi-Step Reasoning", "agents"),
    16: ("Evaluation & Benchmarks", "evaluation-benchmarks"),
    17: ("Infrastructure & Serving", "infrastructure-serving"),
    18: ("Model Family Tree & History", "history"),
}

slug_set = set()
id_set = set()

for idx, item in enumerate(all_concepts):
    num, cat_num, title, slug, diff, summary, what, why, how, takeaway, src_title, src_url, src_year, src_authors = item
    
    assert num == idx + 1, f"Expected concept #{idx + 1}, found #{num}"
    assert cat_num in cat_dict, f"Invalid category {cat_num} for #{num}"
    assert diff in ('Beginner', 'Intermediate', 'Advanced'), f"Invalid difficulty {diff} for #{num}"
    assert slug not in slug_set, f"Duplicate slug: {slug} at #{num}"
    slug_set.add(slug)
    
    padded_num = f"{num:02d}" if num < 100 else f"{num}"
    cid = f"{padded_num}-{slug}"
    assert cid not in id_set, f"Duplicate id: {cid}"
    id_set.add(cid)

ts_lines = [
    "import { Concept } from './types';",
    "",
    "export const CONCEPTS: Concept[] = ["
]

for item in all_concepts:
    num, cat_num, title, slug, diff, summary, what, why, how, takeaway, src_title, src_url, src_year, src_authors = item
    cat_name, cat_slug = cat_dict[cat_num]
    
    padded_num = f"{num:02d}" if num < 100 else f"{num}"
    cid = f"{padded_num}-{slug}"
    how_json = json.dumps(how)
    
    ts_lines.append("  {")
    ts_lines.append(f"    id: {json.dumps(cid)},")
    ts_lines.append(f"    number: {num},")
    ts_lines.append(f"    title: {json.dumps(title)},")
    ts_lines.append(f"    slug: {json.dumps(slug)},")
    ts_lines.append(f"    category: {json.dumps(cat_name)},")
    ts_lines.append(f"    categorySlug: {json.dumps(cat_slug)},")
    ts_lines.append(f"    categoryNumber: {cat_num},")
    ts_lines.append(f"    difficulty: {json.dumps(diff)},")
    ts_lines.append(f"    summary: {json.dumps(summary)},")
    ts_lines.append("    explanation: {")
    ts_lines.append(f"      what: {json.dumps(what)},")
    ts_lines.append(f"      why: {json.dumps(why)},")
    ts_lines.append(f"      how: {how_json},")
    ts_lines.append(f"      keyTakeaway: {json.dumps(takeaway)},")
    ts_lines.append("      sources: [")
    ts_lines.append("        {")
    ts_lines.append(f"          title: {json.dumps(src_title)},")
    ts_lines.append(f"          url: {json.dumps(src_url)},")
    ts_lines.append(f"          year: {src_year},")
    ts_lines.append(f"          authors: {json.dumps(src_authors)},")
    ts_lines.append("        },")
    ts_lines.append("      ],")
    ts_lines.append("    },")
    ts_lines.append("  },")

ts_lines.append("];")
ts_lines.append("")
ts_lines.append("export const CONCEPT_MAP = new Map<string, Concept>(")
ts_lines.append("  CONCEPTS.map((c) => [c.id, c])")
ts_lines.append(");")
ts_lines.append("")
ts_lines.append("export const CONCEPT_SLUG_MAP = new Map<string, Concept>(")
ts_lines.append("  CONCEPTS.map((c) => [`${c.categorySlug}/${c.slug}`, c])")
ts_lines.append(");")
ts_lines.append("")
ts_lines.append("export function getConceptById(id: string): Concept | undefined {")
ts_lines.append("  return CONCEPT_MAP.get(id);")
ts_lines.append("}")
ts_lines.append("")
ts_lines.append("export function getConceptBySlug(categorySlug: string, conceptSlug: string): Concept | undefined {")
ts_lines.append("  return CONCEPT_SLUG_MAP.get(`${categorySlug}/${conceptSlug}`) || CONCEPTS.find(c => c.slug === conceptSlug);")
ts_lines.append("}")
ts_lines.append("")

output_code = "\n".join(ts_lines)

# Check for em dashes
if "\u2014" in output_code:
    print("ERROR: Found em dash in generated code!")
    sys.exit(1)

# Check for AI telltales
telltales = ["delve", "utilize", "leverage", "streamline", "harness", "revolutionize", "cutting-edge", "game-changer", "elevate", "empower", "unlock", "supercharge", "deep dive", "at the end of the day", "it's worth noting", "in terms of", "it should be noted", "in today's world", "a myriad of"]
for tt in telltales:
    if re.search(r'\b' + re.escape(tt) + r'\b', output_code, re.IGNORECASE):
        print(f"ERROR: Found AI telltale '{tt}' in generated code!")
        sys.exit(1)

with open('src/model/concept-registry.ts', 'w') as f:
    f.write(output_code)

print("SUCCESS: Generated src/model/concept-registry.ts with all 215 concepts.")
