export interface Candidate {
  uid: string;
  country: string;
  gender: 'male' | 'female';
  interests: string[];
  fcmToken: string | null;
}

export interface MatchPair {
  userA: Candidate;
  userB: Candidate;
  sharedInterests: string[];
  score: number;
}

export function buildMatchPairs(candidates: Candidate[]): MatchPair[] {
  const pairs: MatchPair[] = [];

  for (let i = 0; i < candidates.length; i++) {
    for (let j = i + 1; j < candidates.length; j++) {
      const a = candidates[i];
      const b = candidates[j];

      // HARD FILTER 1: must be opposite gender
      if (a.gender === b.gender) continue;

      // HARD FILTER 2: prefer different countries (soft — won't exclude if needed)
      const sameCountry = a.country === b.country;

      // Score: shared interests (0-5) + country bonus
      const sharedInterests = a.interests.filter((i) => b.interests.includes(i));
      const score = sharedInterests.length + (sameCountry ? 0 : 1);

      pairs.push({ userA: a, userB: b, sharedInterests, score });
    }
  }

  // Sort by score descending (best matches first)
  pairs.sort((a, b) => b.score - a.score);
  return pairs;
}

export function greedyMatch(candidates: Candidate[]): MatchPair[] {
  const pairs = buildMatchPairs(candidates);
  const matched = new Set<string>();
  const result: MatchPair[] = [];

  for (const pair of pairs) {
    if (matched.has(pair.userA.uid) || matched.has(pair.userB.uid)) continue;
    result.push(pair);
    matched.add(pair.userA.uid);
    matched.add(pair.userB.uid);
  }

  return result;
}
