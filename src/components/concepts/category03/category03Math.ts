// Mathematical and algorithmic helpers for Category 3: Tokenization in Detail

export interface BpeMergeStep {
  pair: [string, string];
  merged: string;
  count: number;
}

export function simulateBpeMerges(
  wordsWithFreq: Record<string, number>,
  numMerges = 5
): { vocabulary: string[]; merges: BpeMergeStep[]; finalWords: Record<string, number> } {
  // Initialize splits: e.g. "low": ["l", "o", "w", "</w>"]
  const currentTokens: Record<string, string[]> = {};
  const vocabSet = new Set<string>();

  Object.keys(wordsWithFreq).forEach((word) => {
    const chars = word.split('').concat('</w>');
    currentTokens[word] = chars;
    chars.forEach((c) => vocabSet.add(c));
  });

  const merges: BpeMergeStep[] = [];

  for (let step = 0; step < numMerges; step++) {
    // Count adjacent pairs
    const pairCounts: Record<string, number> = {};

    Object.entries(currentTokens).forEach(([word, tokens]) => {
      const freq = wordsWithFreq[word] || 1;
      for (let i = 0; i < tokens.length - 1; i++) {
        const pairKey = `${tokens[i]}::${tokens[i + 1]}`;
        pairCounts[pairKey] = (pairCounts[pairKey] || 0) + freq;
      }
    });

    if (Object.keys(pairCounts).length === 0) break;

    // Find pair with max count
    let bestPair = '';
    let maxCount = -1;
    Object.entries(pairCounts).forEach(([pair, count]) => {
      if (count > maxCount) {
        maxCount = count;
        bestPair = pair;
      }
    });

    if (maxCount <= 0) break;

    const [first, second] = bestPair.split('::');
    const mergedToken = `${first}${second}`;
    merges.push({ pair: [first, second], merged: mergedToken, count: maxCount });
    vocabSet.add(mergedToken);

    // Apply merge across all words
    Object.keys(currentTokens).forEach((word) => {
      const tokens = currentTokens[word];
      const newTokens: string[] = [];
      let i = 0;
      while (i < tokens.length) {
        if (i < tokens.length - 1 && tokens[i] === first && tokens[i + 1] === second) {
          newTokens.push(mergedToken);
          i += 2;
        } else {
          newTokens.push(tokens[i]);
          i += 1;
        }
      }
      currentTokens[word] = newTokens;
    });
  }

  return {
    vocabulary: Array.from(vocabSet),
    merges,
    finalWords: wordsWithFreq,
  };
}

export interface MultilingualSentence {
  language: string;
  code: string;
  text: string;
  tokens: number;
  chars: number;
  ratio: number;
}

export const MULTILINGUAL_BENCHMARK: MultilingualSentence[] = [
  { language: 'English', code: 'en', text: 'Large language models process natural language.', tokens: 7, chars: 46, ratio: 1.0 },
  { language: 'Spanish', code: 'es', text: 'Los modelos de lenguaje grandes procesan el lenguaje natural.', tokens: 11, chars: 62, ratio: 1.57 },
  { language: 'French', code: 'fr', text: 'Les grands modèles linguistiques traitent le langage naturel.', tokens: 12, chars: 62, ratio: 1.71 },
  { language: 'German', code: 'de', text: 'Große Sprachmodelle verarbeiten natürliche Sprache.', tokens: 10, chars: 51, ratio: 1.43 },
  { language: 'Russian', code: 'ru', text: 'Большие языковые модели обрабатывают естественный язык.', tokens: 18, chars: 55, ratio: 2.57 },
  { language: 'Arabic', code: 'ar', text: 'تعالج النماذج اللغوية الكبيرة اللغة الطبيعية.', tokens: 19, chars: 45, ratio: 2.71 },
  { language: 'Hindi', code: 'hi', text: 'बड़े भाषा मॉडल प्राकृतिक भाषा को संसाधित करते हैं।', tokens: 24, chars: 51, ratio: 3.43 },
  { language: 'Chinese (Simplified)', code: 'zh', text: '大型语言模型处理自然语言。', tokens: 12, chars: 13, ratio: 1.71 },
  { language: 'Japanese', code: 'ja', text: '大規模言語モデルは自然言語を処理します。', tokens: 16, chars: 21, ratio: 2.29 },
  { language: 'Korean', code: 'ko', text: '대형 언어 모델은 자연어를 처리합니다.', tokens: 15, chars: 22, ratio: 2.14 },
];
