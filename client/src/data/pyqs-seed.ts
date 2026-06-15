// Seeded previous-year questions. Users add more via /pyq/submit (stored in localStorage).
// Schema mirrors the future SQL `PYQ` table for clean migration.

export type PYQRound = "OA" | "Tech" | "HR" | "Managerial" | "Group Discussion" | "Case" | "Bar Raiser";

export interface PYQ {
  id: string;                  // pyq_<slug>_<incr>
  companySlug: string;
  round: PYQRound;
  year: number;
  topic: string;               // "Arrays & Hashing", "OOPs", "System Design"
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  expectedApproach?: string;   // optional hint
  source: "seeded" | "crowd";
  status: "verified" | "pending" | "flagged";
  upvotes: number;
  downvotes: number;
  submittedBy?: string;        // display name (when crowd)
  submittedAt: string;
}

const P = (p: PYQ): PYQ => p;

export const PYQ_SEED: PYQ[] = [
  // TCS NQT (mass-recruiter, always asked)
  P({ id: "pyq_tcs_1", companySlug: "tcs", round: "OA", year: 2025, topic: "Coding", difficulty: "Easy",
      question: "Given a string, find all permutations and print in lexicographical order. (TCS NQT 2025 — coding section, slot 2)",
      expectedApproach: "Backtracking or std lib next_permutation; ensure output sorted.",
      source: "seeded", status: "verified", upvotes: 18, downvotes: 1, submittedAt: "2026-05-21" }),
  P({ id: "pyq_tcs_2", companySlug: "tcs", round: "OA", year: 2024, topic: "Aptitude", difficulty: "Medium",
      question: "Quant: A train 240m long crosses a platform of length P in 24s and a pole in 12s. Find P. (TCS iON sectional)",
      expectedApproach: "Speed = 240/12 = 20 m/s; (240+P)/24 = 20 → P = 240m.",
      source: "seeded", status: "verified", upvotes: 24, downvotes: 0, submittedAt: "2026-05-21" }),
  P({ id: "pyq_tcs_3", companySlug: "tcs", round: "OA", year: 2024, topic: "Coding", difficulty: "Medium",
      question: "Given an array of N integers, find the longest subarray with sum divisible by K. (TCS NQT)",
      expectedApproach: "Prefix sum mod K + hashmap of first-seen index.",
      source: "seeded", status: "verified", upvotes: 31, downvotes: 0, submittedAt: "2026-05-21" }),
  P({ id: "pyq_tcs_4", companySlug: "tcs", round: "HR", year: 2024, topic: "HR", difficulty: "Easy",
      question: "Why TCS over other service-based companies? Walk me through your tier choice (Ninja vs Digital vs Prime).",
      source: "seeded", status: "verified", upvotes: 10, downvotes: 2, submittedAt: "2026-05-21" }),

  // Amazon
  P({ id: "pyq_amazon_1", companySlug: "amazon", round: "OA", year: 2025, topic: "Sliding Window", difficulty: "Medium",
      question: "Find the longest substring with at most K distinct characters. (Amazon SDE OA, Asia campus pool)",
      expectedApproach: "Sliding window with hashmap; shrink when distinct > K.",
      source: "seeded", status: "verified", upvotes: 42, downvotes: 0, submittedAt: "2026-05-21" }),
  P({ id: "pyq_amazon_2", companySlug: "amazon", round: "Tech", year: 2025, topic: "Trees", difficulty: "Medium",
      question: "Vertical order traversal of a binary tree. Print top-to-bottom for each column.",
      expectedApproach: "BFS with col index + treemap by col; ties by row then val.",
      source: "seeded", status: "verified", upvotes: 28, downvotes: 0, submittedAt: "2026-05-21" }),
  P({ id: "pyq_amazon_3", companySlug: "amazon", round: "Bar Raiser", year: 2024, topic: "Behavioral", difficulty: "Hard",
      question: "Tell me about a time you disagreed with your team lead. Walk me through your STAR. Now — what would you do differently?",
      expectedApproach: "Map to Leadership Principle: Have Backbone, Disagree & Commit.",
      source: "seeded", status: "verified", upvotes: 19, downvotes: 0, submittedAt: "2026-05-21" }),
  P({ id: "pyq_amazon_4", companySlug: "amazon", round: "Tech", year: 2024, topic: "Graphs", difficulty: "Medium",
      question: "Number of islands variant: largest island after flipping at most one water cell to land.",
      expectedApproach: "DFS-size each island with id; then for each water cell sum neighbor island sizes.",
      source: "seeded", status: "verified", upvotes: 33, downvotes: 1, submittedAt: "2026-05-21" }),

  // Microsoft
  P({ id: "pyq_microsoft_1", companySlug: "microsoft", round: "OA", year: 2025, topic: "Strings", difficulty: "Medium",
      question: "Given a string s, return the length of the longest substring containing only one distinct character after at most K replacements.",
      expectedApproach: "Sliding window; track max-freq char in window; shrink when window-maxFreq > K.",
      source: "seeded", status: "verified", upvotes: 26, downvotes: 0, submittedAt: "2026-05-21" }),
  P({ id: "pyq_microsoft_2", companySlug: "microsoft", round: "Tech", year: 2024, topic: "OS", difficulty: "Medium",
      question: "Explain the difference between processes and threads with respect to memory layout. When would you choose one over the other?",
      source: "seeded", status: "verified", upvotes: 21, downvotes: 0, submittedAt: "2026-05-21" }),
  P({ id: "pyq_microsoft_3", companySlug: "microsoft", round: "Tech", year: 2024, topic: "DP", difficulty: "Hard",
      question: "Word Break II — return all sentences you can build using a dictionary. Discuss memoization.",
      expectedApproach: "Memoized recursion: map index → all sentences from that index.",
      source: "seeded", status: "verified", upvotes: 24, downvotes: 0, submittedAt: "2026-05-21" }),

  // Google
  P({ id: "pyq_google_1", companySlug: "google", round: "Tech", year: 2025, topic: "DP", difficulty: "Hard",
      question: "Given a string and a list of words, find the minimum number of stickers needed to spell out the string.",
      expectedApproach: "Bitmask DP on which chars of target are covered; BFS layer by layer.",
      source: "seeded", status: "verified", upvotes: 38, downvotes: 0, submittedAt: "2026-05-21" }),
  P({ id: "pyq_google_2", companySlug: "google", round: "Tech", year: 2024, topic: "Graphs", difficulty: "Hard",
      question: "Schedule courses with prerequisites and per-course duration to minimize finish time, with parallel workers W.",
      expectedApproach: "Topo sort + priority queue keyed by earliest available finish time.",
      source: "seeded", status: "verified", upvotes: 22, downvotes: 0, submittedAt: "2026-05-21" }),

  // Goldman Sachs
  P({ id: "pyq_gs_1", companySlug: "goldman-sachs", round: "OA", year: 2025, topic: "Aptitude", difficulty: "Medium",
      question: "MCQ: A fair die is rolled 3 times. What's the probability the sum is exactly 10? (GS Tech OA — MCQ section)",
      expectedApproach: "Coefficient of x^10 in (x+x^2+...+x^6)^3 / 216 = 27/216 = 1/8.",
      source: "seeded", status: "verified", upvotes: 14, downvotes: 1, submittedAt: "2026-05-21" }),
  P({ id: "pyq_gs_2", companySlug: "goldman-sachs", round: "Tech", year: 2025, topic: "DP", difficulty: "Medium",
      question: "Max profit from at most 2 transactions on a stock price array. (Classic LC 123 variant)",
      expectedApproach: "Buy1/sell1/buy2/sell2 state DP O(n).",
      source: "seeded", status: "verified", upvotes: 19, downvotes: 0, submittedAt: "2026-05-21" }),

  // DE Shaw
  P({ id: "pyq_deshaw_1", companySlug: "de-shaw", round: "Tech", year: 2024, topic: "Probability", difficulty: "Hard",
      question: "Puzzle: You have 3 ants on a triangle's corners moving on edges uniformly at random. P(no collision)?",
      expectedApproach: "2 out of 2^3 = 8 outcomes (all CW or all CCW) → 1/4.",
      source: "seeded", status: "verified", upvotes: 35, downvotes: 0, submittedAt: "2026-05-21" }),
  P({ id: "pyq_deshaw_2", companySlug: "de-shaw", round: "Tech", year: 2024, topic: "DSA", difficulty: "Hard",
      question: "Kth smallest in M sorted lists. Discuss heap vs. merge approaches.",
      expectedApproach: "Min-heap of (val, listIdx, valIdx). Pop K times.",
      source: "seeded", status: "verified", upvotes: 18, downvotes: 0, submittedAt: "2026-05-21" }),

  // Flipkart
  P({ id: "pyq_flipkart_1", companySlug: "flipkart", round: "OA", year: 2024, topic: "DP", difficulty: "Medium",
      question: "Min insertions to make a string a palindrome.",
      expectedApproach: "n - LCS(s, reverse(s)) or interval DP.",
      source: "seeded", status: "verified", upvotes: 21, downvotes: 0, submittedAt: "2026-05-21" }),
  P({ id: "pyq_flipkart_2", companySlug: "flipkart", round: "Tech", year: 2024, topic: "Design", difficulty: "Medium",
      question: "Design a thread-safe rate limiter (token bucket). What happens if clock is skewed?",
      source: "seeded", status: "verified", upvotes: 16, downvotes: 0, submittedAt: "2026-05-21" }),

  // Razorpay
  P({ id: "pyq_razorpay_1", companySlug: "razorpay", round: "Tech", year: 2025, topic: "Design", difficulty: "Hard",
      question: "How would you make a payment API idempotent? Walk through the schema and request lifecycle.",
      expectedApproach: "Idempotency-Key header, store key+request-hash+result; on retry return cached result.",
      source: "seeded", status: "verified", upvotes: 30, downvotes: 0, submittedAt: "2026-05-21" }),
  P({ id: "pyq_razorpay_2", companySlug: "razorpay", round: "Tech", year: 2024, topic: "Concurrency", difficulty: "Hard",
      question: "Two concurrent transfers reading the same wallet balance. How do you prevent double-spend?",
      expectedApproach: "DB row lock (SELECT … FOR UPDATE) or optimistic locking with version column.",
      source: "seeded", status: "verified", upvotes: 26, downvotes: 0, submittedAt: "2026-05-21" }),

  // CRED
  P({ id: "pyq_cred_1", companySlug: "cred", round: "Tech", year: 2025, topic: "LLD", difficulty: "Hard",
      question: "Design a loyalty/rewards system: earn rules, redeem rules, expiry. Show class diagram.",
      source: "seeded", status: "verified", upvotes: 19, downvotes: 0, submittedAt: "2026-05-21" }),

  // PhonePe
  P({ id: "pyq_phonepe_1", companySlug: "phonepe", round: "Tech", year: 2024, topic: "DB", difficulty: "Medium",
      question: "Explain B+ tree indexing. Why does it outperform B-tree for range queries on databases?",
      source: "seeded", status: "verified", upvotes: 22, downvotes: 0, submittedAt: "2026-05-21" }),

  // Swiggy
  P({ id: "pyq_swiggy_1", companySlug: "swiggy", round: "Tech", year: 2024, topic: "Design", difficulty: "Medium",
      question: "Design delivery-partner assignment for an order. Goals: minimize ETA, fairness across partners.",
      source: "seeded", status: "verified", upvotes: 25, downvotes: 0, submittedAt: "2026-05-21" }),

  // Uber
  P({ id: "pyq_uber_1", companySlug: "uber", round: "Tech", year: 2024, topic: "Design", difficulty: "Hard",
      question: "Design surge pricing. How do you decide region boundaries, multiplier, and update cadence?",
      source: "seeded", status: "verified", upvotes: 17, downvotes: 0, submittedAt: "2026-05-21" }),

  // Infosys
  P({ id: "pyq_infosys_1", companySlug: "infosys", round: "OA", year: 2025, topic: "Aptitude", difficulty: "Easy",
      question: "Quant: If 30% of A = 60% of B, what is A:B? (Infosys SP OA, slot 1)",
      expectedApproach: "0.3A = 0.6B → A:B = 2:1.",
      source: "seeded", status: "verified", upvotes: 9, downvotes: 0, submittedAt: "2026-05-21" }),

  // Wipro
  P({ id: "pyq_wipro_1", companySlug: "wipro", round: "OA", year: 2024, topic: "Essay", difficulty: "Medium",
      question: "Essay: Do you think social media has done more harm than good to society? Defend in 300 words. (Wipro Elite NLTH)",
      source: "seeded", status: "verified", upvotes: 11, downvotes: 0, submittedAt: "2026-05-21" }),

  // Accenture
  P({ id: "pyq_accenture_1", companySlug: "accenture", round: "OA", year: 2025, topic: "Pseudo-code", difficulty: "Medium",
      question: "Pseudo-code MCQ: Given a recursive function, what does it compute? (Accenture OA — pseudo-code section)",
      source: "seeded", status: "verified", upvotes: 12, downvotes: 1, submittedAt: "2026-05-21" }),

  // Cognizant
  P({ id: "pyq_cognizant_1", companySlug: "cognizant", round: "OA", year: 2024, topic: "Coding", difficulty: "Easy",
      question: "Reverse only the vowels in a string. (Cognizant GenC OA)",
      expectedApproach: "Two pointers; swap when both are vowels.",
      source: "seeded", status: "verified", upvotes: 8, downvotes: 0, submittedAt: "2026-05-21" }),

  // JPMC CodeForGood
  P({ id: "pyq_jpmorgan_1", companySlug: "jpmorgan", round: "OA", year: 2024, topic: "Hackathon", difficulty: "Medium",
      question: "CodeForGood: Build a volunteer-NGO matchmaking dashboard in 24h. (JPMC 2024 cohort theme)",
      source: "seeded", status: "verified", upvotes: 14, downvotes: 0, submittedAt: "2026-05-21" }),

  // Oracle
  P({ id: "pyq_oracle_1", companySlug: "oracle", round: "Tech", year: 2024, topic: "DBMS", difficulty: "Hard",
      question: "Explain how B+ tree indexes affect SELECT vs INSERT performance. What's the trade-off?",
      source: "seeded", status: "verified", upvotes: 20, downvotes: 0, submittedAt: "2026-05-21" }),

  // SAP
  P({ id: "pyq_sap_1", companySlug: "sap", round: "Tech", year: 2024, topic: "OOPs", difficulty: "Medium",
      question: "Explain SOLID. Give an example of how you violated SRP in a project, then refactored.",
      source: "seeded", status: "verified", upvotes: 13, downvotes: 0, submittedAt: "2026-05-21" }),

  // Cisco
  P({ id: "pyq_cisco_1", companySlug: "cisco", round: "Tech", year: 2024, topic: "Networking", difficulty: "Medium",
      question: "Walk through TCP 3-way handshake. How does TCP differ from QUIC at a connection level?",
      source: "seeded", status: "verified", upvotes: 18, downvotes: 0, submittedAt: "2026-05-21" }),

  // VMware
  P({ id: "pyq_vmware_1", companySlug: "vmware", round: "Tech", year: 2024, topic: "OS", difficulty: "Hard",
      question: "Explain virtualization. Compare Type-1 vs Type-2 hypervisors. What does the hardware MMU do?",
      source: "seeded", status: "verified", upvotes: 22, downvotes: 0, submittedAt: "2026-05-21" }),

  // NVIDIA
  P({ id: "pyq_nvidia_1", companySlug: "nvidia", round: "Tech", year: 2024, topic: "Arch", difficulty: "Hard",
      question: "Explain CPU vs GPU at architectural level. Why is a GPU better for matrix multiplications?",
      source: "seeded", status: "verified", upvotes: 25, downvotes: 0, submittedAt: "2026-05-21" }),

  // Qualcomm
  P({ id: "pyq_qualcomm_1", companySlug: "qualcomm", round: "Tech", year: 2024, topic: "C", difficulty: "Medium",
      question: "Output of: int *p = NULL; *p = 5; printf(\"%d\", *p);  What happens and why?",
      source: "seeded", status: "verified", upvotes: 11, downvotes: 0, submittedAt: "2026-05-21" }),

  // Optiver
  P({ id: "pyq_optiver_1", companySlug: "optiver", round: "Case", year: 2024, topic: "Trading Game", difficulty: "Hard",
      question: "Optiver Trading Game: bid/ask on the expected value of rolling 3 dice and taking the sum. Mental math + risk-adjusted pricing.",
      source: "seeded", status: "verified", upvotes: 28, downvotes: 0, submittedAt: "2026-05-21" }),

  // Jane Street
  P({ id: "pyq_jane_street_1", companySlug: "jane-street", round: "Case", year: 2024, topic: "Probability", difficulty: "Hard",
      question: "Estimation: How many barbershops are there in Mumbai? Walk through assumptions, defend each.",
      source: "seeded", status: "verified", upvotes: 17, downvotes: 0, submittedAt: "2026-05-21" }),

  // Salesforce
  P({ id: "pyq_salesforce_1", companySlug: "salesforce", round: "OA", year: 2024, topic: "SQL", difficulty: "Medium",
      question: "Write SQL to find the second-highest salary in each department, without using LIMIT.",
      expectedApproach: "DENSE_RANK() window or correlated subquery.",
      source: "seeded", status: "verified", upvotes: 19, downvotes: 0, submittedAt: "2026-05-21" }),

  // Adobe
  P({ id: "pyq_adobe_1", companySlug: "adobe", round: "Tech", year: 2024, topic: "OOPs", difficulty: "Medium",
      question: "Implement an in-memory file system supporting mkdir, ls, addContent, readContent.",
      expectedApproach: "Trie-of-nodes with content map at leaves.",
      source: "seeded", status: "verified", upvotes: 23, downvotes: 0, submittedAt: "2026-05-21" }),

  // ZS
  P({ id: "pyq_zs_1", companySlug: "zs", round: "Case", year: 2024, topic: "Guesstimate", difficulty: "Medium",
      question: "Estimate annual revenue of a Domino's pizza outlet in Pune. Walk me through your assumptions.",
      source: "seeded", status: "verified", upvotes: 14, downvotes: 0, submittedAt: "2026-05-21" }),

  // McKinsey QB
  P({ id: "pyq_mckinsey_1", companySlug: "mckinsey-qb", round: "Case", year: 2024, topic: "Business Case", difficulty: "Hard",
      question: "QuantumBlack case: A telecom client wants to reduce churn by 20% in 6 months. Walk through your data + intervention plan.",
      source: "seeded", status: "verified", upvotes: 12, downvotes: 0, submittedAt: "2026-05-21" }),

  // Deloitte
  P({ id: "pyq_deloitte_1", companySlug: "deloitte-usi", round: "HR", year: 2024, topic: "HR", difficulty: "Easy",
      question: "Tell me about a time you led a team without authority. What was the outcome?",
      source: "seeded", status: "verified", upvotes: 9, downvotes: 0, submittedAt: "2026-05-21" }),

  // Freshworks
  P({ id: "pyq_freshworks_1", companySlug: "freshworks", round: "OA", year: 2024, topic: "Strings", difficulty: "Medium",
      question: "Group anagrams in O(N·K log K). Discuss optimization to O(N·K) using char-count keys.",
      source: "seeded", status: "verified", upvotes: 16, downvotes: 0, submittedAt: "2026-05-21" }),

  // Zerodha
  P({ id: "pyq_zerodha_1", companySlug: "zerodha", round: "OA", year: 2025, topic: "Take-home", difficulty: "Hard",
      question: "Zerodha take-home: build a small CLI in Go/Python that polls a stock-price endpoint and emits SMA(5)/SMA(20) crossover alerts. Submit GitHub repo + README.",
      source: "seeded", status: "verified", upvotes: 27, downvotes: 0, submittedAt: "2026-05-21" }),

  // Atlassian
  P({ id: "pyq_atlassian_1", companySlug: "atlassian", round: "Tech", year: 2024, topic: "Design", difficulty: "Medium",
      question: "Design a Jira-board real-time collaboration sync (multiple users dragging tickets simultaneously).",
      source: "seeded", status: "verified", upvotes: 18, downvotes: 0, submittedAt: "2026-05-21" }),

  // Ola
  P({ id: "pyq_ola_1", companySlug: "ola", round: "Tech", year: 2024, topic: "Graphs", difficulty: "Medium",
      question: "Given driver locations and rider request, return closest 5 drivers in O(N log K).",
      expectedApproach: "Max-heap of size K keyed by squared distance.",
      source: "seeded", status: "verified", upvotes: 13, downvotes: 0, submittedAt: "2026-05-21" }),

  // Zomato
  P({ id: "pyq_zomato_1", companySlug: "zomato", round: "Tech", year: 2024, topic: "Project", difficulty: "Medium",
      question: "Walk me through your most production-grade project. Where did it break first?",
      source: "seeded", status: "verified", upvotes: 10, downvotes: 0, submittedAt: "2026-05-21" }),
];

export function getPYQsForCompany(slug: string, all: PYQ[]): PYQ[] {
  return all.filter((p) => p.companySlug === slug);
}

export function pyqStatusBadge(p: PYQ): { label: string; color: string } {
  if (p.status === "verified") return { label: "VERIFIED", color: "#c8ff3d" };
  if (p.status === "pending") return { label: "PENDING", color: "#ffe87a" };
  return { label: "FLAGGED", color: "#ff8a7a" };
}
