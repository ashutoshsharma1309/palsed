// ────────────────────────────────────────────────────────────────────────────
//  DSA Learning Roadmap — the curated content layer for PrepPlace's pivot to a
//  DSA Learning OS. Fully data-driven: the UI (dashboard, roadmap, lesson pages)
//  renders entirely from here, so adding a topic/question is a pure data change.
//
//  Curated by combining the strongest ideas from public learning paths (Striver
//  A2Z / takeUforward, NeetCode, Love Babbar, GfG, USACO Guide, CP-Algorithms,
//  CSES, Codeforces EDU) — used only as references; content is original.
//
//  Primary language is C++ (every solution defaults to C++); the schema allows
//  adding Java/Python/C solutions later without UI changes.
// ────────────────────────────────────────────────────────────────────────────

export type Difficulty = "Easy" | "Medium" | "Hard";
export type TopicStatus = "not_started" | "in_progress" | "completed";

export interface Solution {
  /** Default language is C++. */
  cpp: string;
  java?: string;
  python?: string;
  c?: string;
  explanation?: string;
}

export interface Question {
  id: string;
  title: string;
  statement: string;
  difficulty: Difficulty;
  concepts: string[];
  hint: string;
  solution: Solution;
  timeComplexity: string;
  spaceComplexity: string;
  similar?: string[];
}

export interface Lesson {
  objective: string;
  /** Theory — concise plain-language explanation (markdown allowed). */
  explanation: string;
  /** Short formal definition (e.g. "An array is a contiguous block of …"). */
  definition?: string;
  /** Basic C++ syntax (declaration / initialization / traversal). */
  syntax?: string;
  /** A small, beginner-friendly C++ example demonstrating only this concept. */
  example?: { code: string; explanation?: string };
  keyConcepts: string[];
  interviewNotes: string[];
  commonMistakes: string[];
  /** Structured complexity (best / average / worst / space). */
  complexity?: { best?: string; average?: string; worst?: string; space?: string };
  timeComplexity?: string;
  spaceComplexity?: string;
  /** Real-world intuition — why this matters. */
  intuition?: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
}

export interface Topic {
  id: string;
  name: string;
  phaseId: string;
  /** One-line summary shown in the roadmap list. */
  blurb: string;
  lesson?: Lesson;
  questions: Question[];
  /** Defaults to the standard 5-item checklist when omitted. */
  checklist?: ChecklistItem[];
}

export interface Phase {
  id: string;
  name: string;
  summary: string;
  topicIds: string[];
}

// Standard per-lesson checklist (Task 7). Reused unless a topic overrides it.
export const DEFAULT_CHECKLIST: ChecklistItem[] = [
  { id: "theory", label: "Read the theory" },
  { id: "syntax", label: "Understood the syntax" },
  { id: "example", label: "Ran the example code" },
  { id: "easy", label: "Solved Easy problems" },
  { id: "medium", label: "Solved Medium problems" },
  { id: "hard", label: "Solved Hard problems" },
  { id: "revised", label: "Revised" },
];

const cpp = (s: string): Solution => ({ cpp: s });

// ── TOPICS ────────────────────────────────────────────────────────────────────
// Foundational topics are fully fleshed (lesson + questions + C++ solutions).
// Later/advanced topics carry a concise lesson + objective; their question banks
// are designed to be filled in incrementally (pure data additions).

const TOPICS: Topic[] = [
  // ── Phase 1 — Programming Fundamentals ──
  {
    id: "loops", name: "Loops & Patterns", phaseId: "p1",
    blurb: "for/while loops and nested-loop pattern printing — the foundation of iteration.",
    lesson: {
      objective: "Confidently write single and nested loops and reason about how many times they run.",
      explanation:
        "A **loop** repeats a block of code. Use a `for` loop when you know the count, a `while` loop when you loop until a condition changes. **Nested loops** (a loop inside a loop) are how you process grids and print patterns — the inner loop runs fully for each step of the outer loop.",
      definition: "A loop is a control structure that repeats a block of statements while (or until) a condition holds.",
      syntax: `for (int i = 0; i < n; i++) { ... }   // counted\nwhile (cond) { ... }                  // condition-driven\ndo { ... } while (cond);              // runs at least once`,
      example: {
        code: `// Right-angled star triangle of height n\nfor (int i = 1; i <= n; i++) {     // rows\n  for (int j = 1; j <= i; j++)     // stars in this row\n    cout << '*';\n  cout << '\\n';\n}`,
        explanation: "The inner loop runs `i` times for row `i` — total work 1+2+…+n = O(n²).",
      },
      keyConcepts: ["for / while / do-while", "Loop counters & bounds", "Nested loops", "Pattern printing"],
      interviewNotes: ["Off-by-one errors live at the loop bounds — check `<` vs `<=`.", "Nested loops over n elements are usually O(n²)."],
      commonMistakes: ["Infinite loops (forgetting to update the counter).", "Confusing the row vs column index in nested loops.", "Wrong loop bounds (`<=` when you meant `<`)."],
      complexity: { best: "O(n) single", average: "O(n·m) nested", worst: "O(n·m) nested", space: "O(1)" },
      timeComplexity: "Single loop O(n); nested O(n·m)",
      spaceComplexity: "O(1)",
      intuition: "An odometer: the inner wheel spins fully before the outer wheel ticks once.",
    },
    questions: [
      {
        id: "loops-q1", title: "Right-Angled Star Triangle", difficulty: "Easy",
        statement: "Given n, print a right-angled triangle of '*' with i stars on row i (1..n).",
        concepts: ["Nested loops"], hint: "Outer loop for rows 1..n; inner loop prints i stars.",
        timeComplexity: "O(n²)", spaceComplexity: "O(1)", similar: ["Inverted triangle", "Pyramid pattern"],
        solution: cpp(`void triangle(int n){\n  for(int i=1;i<=n;i++){\n    for(int j=1;j<=i;j++) cout << '*';\n    cout << '\\n';\n  }\n}`),
      },
      {
        id: "loops-q2", title: "FizzBuzz", difficulty: "Easy",
        statement: "Print 1..n, but 'Fizz' for multiples of 3, 'Buzz' for 5, 'FizzBuzz' for both.",
        concepts: ["Loops", "Modulo"], hint: "Check %15 first, then %3, then %5.",
        timeComplexity: "O(n)", spaceComplexity: "O(1)", similar: ["Multiples sum"],
        solution: cpp(`void fizzbuzz(int n){\n  for(int i=1;i<=n;i++){\n    if(i%15==0) cout<<"FizzBuzz";\n    else if(i%3==0) cout<<"Fizz";\n    else if(i%5==0) cout<<"Buzz";\n    else cout<<i;\n    cout<<'\\n';\n  }\n}`),
      },
      {
        id: "loops-q3", title: "Number Pyramid", difficulty: "Medium",
        statement: "Print a centered pyramid where row i has spaces then numbers 1..i.",
        concepts: ["Nested loops", "Alignment"], hint: "Print (n-i) spaces, then 1..i.",
        timeComplexity: "O(n²)", spaceComplexity: "O(1)",
        solution: cpp(`void pyramid(int n){\n  for(int i=1;i<=n;i++){\n    for(int s=0;s<n-i;s++) cout<<' ';\n    for(int j=1;j<=i;j++) cout<<j;\n    cout<<'\\n';\n  }\n}`),
      },
    ],
  },
  {
    id: "time-complexity", name: "Time Complexity Basics", phaseId: "p1",
    blurb: "Big-O: how to reason about how fast your code grows — the single most-tested fundamental.",
    lesson: {
      objective: "Estimate the Big-O time and space of a loop or function by inspection.",
      explanation:
        "**Big-O** describes how the work grows as input size n grows, ignoring constants. A single loop over n items is **O(n)**; a loop inside a loop is **O(n²)**; halving the search space each step is **O(log n)**. You care about the *dominant* term as n → ∞.",
      definition: "Big-O is an upper bound on how an algorithm's running time (or space) grows relative to its input size, ignoring constant factors and lower-order terms.",
      example: {
        code: `// O(n): one pass\nfor (int i = 0; i < n; i++) sum += a[i];\n\n// O(n^2): a pass for each element\nfor (int i = 0; i < n; i++)\n  for (int j = 0; j < n; j++) work();\n\n// O(log n): halve the range each step\nwhile (lo < hi) { int m = (lo+hi)/2; ... }`,
        explanation: "Count how many times the innermost line runs as a function of n — that exponent is your Big-O.",
      },
      keyConcepts: ["O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ)", "Dominant term", "Best/avg/worst case", "Amortized cost"],
      interviewNotes: ["State complexity for every solution you give — interviewers always ask.", "n ≤ 10⁸ ops/sec is the rough budget; use it to pick an algorithm."],
      commonMistakes: ["Counting constants (O(2n) is just O(n)).", "Forgetting recursion stack space.", "Quoting best-case when the interviewer wants worst-case."],
      intuition: "Not 'how long does it take' but 'how much worse does it get when the input doubles'.",
    },
    questions: [
      {
        id: "tc-q1", title: "Classify the Loop", difficulty: "Easy",
        statement: "What is the time complexity of two separate (not nested) loops, each over n?",
        concepts: ["Big-O addition"], hint: "Separate loops add; nested loops multiply.",
        timeComplexity: "O(n)", spaceComplexity: "O(1)",
        solution: { cpp: `// O(n) + O(n) = O(2n) = O(n).\n// Sequential loops ADD; only nesting MULTIPLIES.`, explanation: "Drop the constant 2 → O(n)." },
      },
    ],
  },

  // ── Phase 2 — Arrays (fully fleshed) ──
  {
    id: "arrays", name: "Arrays", phaseId: "p2",
    blurb: "Traversal, two-pointer, prefix sums, Kadane, sliding window — the most-asked topic in interviews.",
    lesson: {
      objective: "Master in-place array techniques: two pointers, prefix sums, and the sliding window.",
      explanation:
        "An **array** stores elements in contiguous memory, giving **O(1) random access** by index. Most interview tricks avoid extra passes: **two pointers** (move from both ends or fast/slow), **prefix sums** (precompute running totals for O(1) range queries), and the **sliding window** (grow/shrink a contiguous range instead of re-scanning).",
      definition: "An array is a fixed-size, contiguous block of memory holding elements of the same type, accessed by a 0-based index in O(1).",
      syntax: `int a[5];                 // declaration (size 5)\nint b[] = {1, 2, 3, 4, 5}; // initialization\nfor (int i = 0; i < 5; i++) // traversal\n    cout << b[i] << ' ';\n\nvector<int> v = {1, 2, 3};  // dynamic array (preferred)\nv.push_back(4);`,
      example: {
        code: `// Sum every element of an array\nint sum(vector<int>& a){\n  int total = 0;\n  for(int x : a) total += x;   // range-based for\n  return total;\n}`,
        explanation: "A single pass adds each element — O(n) time, O(1) extra space.",
      },
      keyConcepts: ["O(1) index access", "Two pointers", "Prefix sum", "Sliding window", "Kadane's algorithm"],
      interviewNotes: ["Ask if the array is sorted — it unlocks two-pointer / binary search.", "Watch for integer overflow on sums (use long long)."],
      commonMistakes: ["Out-of-bounds at the last index (`i <= n` instead of `i < n`).", "Mutating the array while iterating.", "Resetting the window sum incorrectly.", "Overflow on a sum/product of ints — use `long long`."],
      complexity: { best: "O(1) access", average: "O(n) scan", worst: "O(n) scan", space: "O(1) in-place" },
      intuition: "A row of numbered lockers — you can jump to any locker instantly, but inserting in the middle shifts everything.",
    },
    questions: [
      {
        id: "arr-q1", title: "Two Sum", difficulty: "Easy",
        statement: "Given an array and a target, return indices of two numbers that add to the target.",
        concepts: ["Hash map", "Complement"], hint: "Store each value's index in a map; for each x look for target − x.",
        timeComplexity: "O(n)", spaceComplexity: "O(n)", similar: ["3Sum", "Two Sum II (sorted)"],
        solution: cpp(`vector<int> twoSum(vector<int>& a, int t){\n  unordered_map<int,int> seen;\n  for(int i=0;i<a.size();i++){\n    int need=t-a[i];\n    if(seen.count(need)) return {seen[need], i};\n    seen[a[i]]=i;\n  }\n  return {};\n}`),
      },
      {
        id: "arr-q2", title: "Best Time to Buy and Sell Stock", difficulty: "Easy",
        statement: "Given daily prices, find the max profit from one buy then one later sell.",
        concepts: ["Single pass", "Running minimum"], hint: "Track the min price so far; profit = price − min.",
        timeComplexity: "O(n)", spaceComplexity: "O(1)", similar: ["Max Subarray"],
        solution: cpp(`int maxProfit(vector<int>& p){\n  int mn=INT_MAX, best=0;\n  for(int x:p){ mn=min(mn,x); best=max(best,x-mn); }\n  return best;\n}`),
      },
      {
        id: "arr-q3", title: "Maximum Subarray (Kadane)", difficulty: "Medium",
        statement: "Find the contiguous subarray with the largest sum.",
        concepts: ["Dynamic programming", "Kadane"], hint: "At each i, either extend the running sum or restart at a[i].",
        timeComplexity: "O(n)", spaceComplexity: "O(1)", similar: ["Maximum Product Subarray"],
        solution: cpp(`int maxSub(vector<int>& a){\n  long cur=a[0], best=a[0];\n  for(int i=1;i<a.size();i++){\n    cur=max((long)a[i], cur+a[i]);\n    best=max(best,cur);\n  }\n  return best;\n}`),
      },
      {
        id: "arr-q4", title: "Product of Array Except Self", difficulty: "Medium",
        statement: "Return an array where out[i] = product of all elements except a[i], no division.",
        concepts: ["Prefix/suffix products"], hint: "Two passes: prefix products left→right, then multiply suffix right→left.",
        timeComplexity: "O(n)", spaceComplexity: "O(1) extra", similar: ["Trapping Rain Water"],
        solution: cpp(`vector<int> productExceptSelf(vector<int>& a){\n  int n=a.size(); vector<int> out(n,1);\n  for(int i=1;i<n;i++) out[i]=out[i-1]*a[i-1];\n  int suf=1;\n  for(int i=n-1;i>=0;i--){ out[i]*=suf; suf*=a[i]; }\n  return out;\n}`),
      },
      {
        id: "arr-q5", title: "Trapping Rain Water", difficulty: "Hard",
        statement: "Given bar heights, compute how much rain water is trapped between them.",
        concepts: ["Two pointers", "Prefix max"], hint: "Water at i = min(maxLeft, maxRight) − height[i]. Use two pointers.",
        timeComplexity: "O(n)", spaceComplexity: "O(1)", similar: ["Container With Most Water"],
        solution: cpp(`int trap(vector<int>& h){\n  int l=0,r=h.size()-1,lm=0,rm=0,res=0;\n  while(l<r){\n    if(h[l]<h[r]){ lm=max(lm,h[l]); res+=lm-h[l]; l++; }\n    else { rm=max(rm,h[r]); res+=rm-h[r]; r--; }\n  }\n  return res;\n}`),
      },
      {
        id: "arr-q6", title: "Maximum Product Subarray", difficulty: "Hard",
        statement: "Find the contiguous subarray with the largest product.",
        concepts: ["DP", "Track min & max"], hint: "A negative can flip min↔max, so track both running products.",
        timeComplexity: "O(n)", spaceComplexity: "O(1)", similar: ["Maximum Subarray"],
        solution: cpp(`int maxProduct(vector<int>& a){\n  int mx=a[0], mn=a[0], res=a[0];\n  for(int i=1;i<a.size();i++){\n    if(a[i]<0) swap(mx,mn);\n    mx=max(a[i], mx*a[i]);\n    mn=min(a[i], mn*a[i]);\n    res=max(res,mx);\n  }\n  return res;\n}`),
      },
    ],
  },

  // ── Phase 3 — Strings (fully fleshed) ──
  {
    id: "strings", name: "Strings", phaseId: "p3",
    blurb: "Frequency maps, two pointers, palindromes, and the sliding window on characters.",
    lesson: {
      objective: "Apply hashing, two pointers and sliding windows to string problems.",
      explanation:
        "A **string** is an array of characters. Most string interview problems reduce to **counting characters** (a 26-size array or hash map), **two pointers** (for palindromes), or a **sliding window** (longest/shortest substring with a property). Immutability in some languages means building results with a buffer.",
      definition: "A string is a sequence of characters stored contiguously; in C++ `std::string` is a dynamic, mutable array of `char`.",
      syntax: `string s = "hello";       // initialization\nint n = s.size();          // length\nchar c = s[0];             // index access ('h')\ns += " world";             // append\nfor (char ch : s) ...      // traversal`,
      example: {
        code: `// Count occurrences of each lowercase letter\nint freq[26] = {0};\nfor (char c : s) freq[c - 'a']++;  // 'a'->0 .. 'z'->25`,
        explanation: "`c - 'a'` maps a letter to an index 0–25 — a fixed-size frequency array, faster than a hash map.",
      },
      keyConcepts: ["Frequency arrays/maps", "Two pointers", "Sliding window", "ASCII math (c - 'a')"],
      interviewNotes: ["A fixed 26-int array beats a hash map for lowercase-only inputs.", "Clarify: case-sensitive? unicode? spaces?"],
      commonMistakes: ["Comparing chars with wrong case.", "Window not shrinking from the left correctly.", "Off-by-one when comparing `s[i]` and `s[n-1-i]` for palindromes."],
      complexity: { best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(1) (26) or O(k)" },
      timeComplexity: "O(n) for most", spaceComplexity: "O(1) (26) or O(k)",
      intuition: "A ticker tape of letters — slide a window across it and keep a tally of what's inside.",
    },
    questions: [
      {
        id: "str-q1", title: "Valid Anagram", difficulty: "Easy",
        statement: "Return true if string t is an anagram of string s.",
        concepts: ["Frequency count"], hint: "Count chars in s (+1), subtract for t; all counts must be 0.",
        timeComplexity: "O(n)", spaceComplexity: "O(1)", similar: ["Group Anagrams"],
        solution: cpp(`bool isAnagram(string s, string t){\n  if(s.size()!=t.size()) return false;\n  int c[26]={0};\n  for(char ch:s) c[ch-'a']++;\n  for(char ch:t) if(--c[ch-'a']<0) return false;\n  return true;\n}`),
      },
      {
        id: "str-q2", title: "Valid Palindrome", difficulty: "Easy",
        statement: "Ignoring non-alphanumerics and case, is the string a palindrome?",
        concepts: ["Two pointers"], hint: "Move l forward and r backward, skipping non-alphanumerics.",
        timeComplexity: "O(n)", spaceComplexity: "O(1)", similar: ["Palindrome Linked List"],
        solution: cpp(`bool isPalindrome(string s){\n  int l=0,r=s.size()-1;\n  while(l<r){\n    while(l<r && !isalnum(s[l])) l++;\n    while(l<r && !isalnum(s[r])) r--;\n    if(tolower(s[l++])!=tolower(s[r--])) return false;\n  }\n  return true;\n}`),
      },
      {
        id: "str-q3", title: "Longest Substring Without Repeating Characters", difficulty: "Medium",
        statement: "Find the length of the longest substring with all distinct characters.",
        concepts: ["Sliding window", "Hash set"], hint: "Grow the window; when a dup appears, shrink from the left past it.",
        timeComplexity: "O(n)", spaceComplexity: "O(min(n,charset))", similar: ["Minimum Window Substring"],
        solution: cpp(`int lengthOfLongest(string s){\n  vector<int> last(256,-1); int l=0, best=0;\n  for(int r=0;r<s.size();r++){\n    if(last[s[r]]>=l) l=last[s[r]]+1;\n    last[s[r]]=r;\n    best=max(best, r-l+1);\n  }\n  return best;\n}`),
      },
      {
        id: "str-q4", title: "Group Anagrams", difficulty: "Medium",
        statement: "Group words that are anagrams of each other.",
        concepts: ["Hashing", "Sorted key"], hint: "Use the sorted string as a map key.",
        timeComplexity: "O(n·k log k)", spaceComplexity: "O(n·k)", similar: ["Valid Anagram"],
        solution: cpp(`vector<vector<string>> groupAnagrams(vector<string>& v){\n  unordered_map<string,vector<string>> m;\n  for(string s:v){ string k=s; sort(k.begin(),k.end()); m[k].push_back(s); }\n  vector<vector<string>> res;\n  for(auto& p:m) res.push_back(p.second);\n  return res;\n}`),
      },
      {
        id: "str-q5", title: "Longest Palindromic Substring", difficulty: "Hard",
        statement: "Return the longest substring that is a palindrome.",
        concepts: ["Expand around center"], hint: "Each index (and gap) is a possible center — expand outward.",
        timeComplexity: "O(n²)", spaceComplexity: "O(1)", similar: ["Palindromic Substrings count"],
        solution: cpp(`string longestPalindrome(string s){\n  int st=0,len=0;\n  auto expand=[&](int l,int r){\n    while(l>=0&&r<s.size()&&s[l]==s[r]){ l--; r++; }\n    if(r-l-1>len){ len=r-l-1; st=l+1; }\n  };\n  for(int i=0;i<s.size();i++){ expand(i,i); expand(i,i+1); }\n  return s.substr(st,len);\n}`),
      },
      {
        id: "str-q6", title: "Minimum Window Substring", difficulty: "Hard",
        statement: "Find the smallest substring of s containing all characters of t.",
        concepts: ["Sliding window", "Counts"], hint: "Expand to satisfy all counts, then shrink to minimize.",
        timeComplexity: "O(n)", spaceComplexity: "O(charset)", similar: ["Longest Substring Without Repeating"],
        solution: cpp(`string minWindow(string s, string t){\n  vector<int> need(128,0); for(char c:t) need[c]++;\n  int missing=t.size(), l=0, start=0, len=INT_MAX;\n  for(int r=0;r<s.size();r++){\n    if(need[s[r]]-->0) missing--;\n    while(missing==0){\n      if(r-l+1<len){ len=r-l+1; start=l; }\n      if(++need[s[l++]]>0) missing++;\n    }\n  }\n  return len==INT_MAX? "" : s.substr(start,len);\n}`),
      },
    ],
  },
];

// Topics that are part of the roadmap structure but whose full lesson/question
// banks are still being curated. They render a concise lesson + checklist + a
// "more problems coming" state — adding content is a pure data edit here.
function stub(id: string, name: string, phaseId: string, blurb: string, objective: string, explanation: string, keyConcepts: string[]): Topic {
  return {
    id, name, phaseId, blurb,
    lesson: { objective, explanation, keyConcepts, interviewNotes: [], commonMistakes: [] },
    questions: [],
  };
}

const STUB_TOPICS: Topic[] = [
  // Phase 4+ (advanced topics — concise lessons; question banks fill in as data)
  stub("backtracking", "Backtracking", "p4", "Choose → explore → un-choose: subsets, permutations, N-Queens.", "Enumerate possibilities with pruning.", "Try a choice, recurse, then undo it (backtrack). Prune branches that can't lead to a solution.", ["Choose/un-choose", "Pruning", "State restoration"]),
  stub("stack", "Stack", "p6", "LIFO, monotonic stacks, expression parsing.", "Use stacks for nesting and 'next greater' problems.", "LIFO structure. The **monotonic stack** solves 'next greater/smaller element' in O(n).", ["LIFO", "Monotonic stack", "Bracket matching"]),
  stub("queue", "Queue & Deque", "p6", "FIFO, deque, sliding-window maximum.", "Use queues/deques for order and windows.", "FIFO structure; a deque allows both ends. The sliding-window maximum uses a monotonic deque.", ["FIFO", "Deque", "Monotonic deque"]),
  stub("hashing", "Hashing", "p7", "Hash maps/sets for O(1) lookup, frequency, dedup.", "Trade space for O(1) average lookups.", "Hash maps give average O(1) insert/lookup — the go-to for counting, dedup, and complement search.", ["Hash map/set", "Collisions", "Frequency counting"]),
  stub("trees", "Binary Trees", "p8", "Traversals (DFS/BFS), height, recursion on trees.", "Traverse and reason about binary trees.", "Each node has ≤2 children. DFS (pre/in/post-order) and BFS (level-order) are the core traversals; most problems are recursive.", ["DFS/BFS", "Traversal orders", "Height/depth"]),
  stub("bst", "Binary Search Tree", "p8", "Ordered trees, search/insert, in-order = sorted.", "Exploit BST ordering for fast search.", "Left < node < right. In-order traversal yields sorted order; search/insert are O(h).", ["BST property", "In-order = sorted", "Validation"]),
  stub("heap", "Heap / Priority Queue", "p8", "Top-K, k-way merge, the heapify operation.", "Use heaps for top-K and scheduling.", "A heap gives O(log n) push/pop of the min/max — ideal for top-K and merging k sorted lists.", ["Min/max heap", "Top-K", "k-way merge"]),
  stub("trie", "Trie", "p8", "Prefix trees for autocomplete and word search.", "Store and query strings by prefix.", "A trie branches by character, giving O(L) insert/search and fast prefix queries.", ["Prefix tree", "Autocomplete", "Word search"]),
  stub("graphs", "Graphs", "p9", "Representations, BFS/DFS, topological sort, shortest paths.", "Model and traverse graphs.", "Adjacency list is the default. BFS finds shortest paths in unweighted graphs; topological sort orders a DAG; Dijkstra handles weights.", ["Adjacency list", "BFS/DFS", "Topological sort", "Dijkstra"]),
  stub("greedy", "Greedy", "p10", "Locally optimal choices that prove globally optimal.", "Recognize when greedy works (and prove it).", "Make the best local choice (e.g. earliest finish time). Greedy needs an exchange-argument proof — it doesn't always work.", ["Exchange argument", "Sorting + greedy", "Interval scheduling"]),
  stub("bit-manipulation", "Bit Manipulation", "p10", "AND/OR/XOR tricks, set bits, power-of-two checks.", "Manipulate numbers at the bit level.", "XOR cancels pairs (find the unique number); `x & (x-1)` clears the lowest set bit; `x & -x` isolates it.", ["XOR tricks", "Bitmask", "Set/clear bits"]),
  stub("advanced-dp", "Advanced DP", "p11", "Knapsack variants, DP on subsequences, intervals, bitmask DP.", "Tackle multi-dimensional DP.", "Patterns: 0/1 knapsack, LIS/LCS on subsequences, interval DP (MCM), and bitmask DP for small n.", ["Knapsack", "LCS/LIS", "Bitmask DP"]),
  stub("segment-tree", "Segment Tree", "p12", "Range queries + point/range updates in O(log n).", "Answer range queries with updates.", "A segment tree supports range sum/min/max with point updates in O(log n); lazy propagation enables range updates.", ["Range query", "Point update", "Lazy propagation"]),
  stub("fenwick", "Fenwick Tree (BIT)", "p12", "Prefix sums with updates in O(log n) — compact.", "Use a BIT for prefix-sum-with-updates.", "A Fenwick tree gives O(log n) prefix sums and point updates with very little code — great for inversion counts.", ["Prefix sums", "Point update", "Inversion count"]),
  stub("dsu", "Disjoint Set Union", "p12", "Union-Find with path compression for connectivity.", "Track connected components fast.", "DSU answers 'are these connected?' in near-O(1) with path compression + union by rank — the backbone of Kruskal's MST.", ["Union by rank", "Path compression", "Connectivity"]),
  stub("advanced-graph", "Advanced Graph Algorithms", "p12", "Dijkstra, Bellman-Ford, Floyd-Warshall, MST, SCC.", "Solve weighted/shortest-path and MST problems.", "Dijkstra (non-negative), Bellman-Ford (negative edges), Floyd-Warshall (all-pairs), Kruskal/Prim (MST), Tarjan/Kosaraju (SCC).", ["Shortest paths", "MST", "SCC"]),
  stub("interview-revision", "Interview Revision", "p13", "A focused last-mile checklist across all topics.", "Revise the highest-yield patterns before interviews.", "Re-solve one problem per pattern (two pointers, sliding window, BFS/DFS, DP) and rehearse explaining your approach out loud.", ["Pattern review", "Spaced repetition", "Explain-aloud"]),
  stub("mock-interview", "Mock Interview Prep", "p13", "Simulate the real thing: think aloud, edge cases, complexity.", "Practice the interview format itself.", "Practice: clarify → brute force → optimize → code → test → state complexity. Time yourself to 30–40 minutes.", ["Think aloud", "Edge cases", "Time management"]),
];

// Phase 1 fundamentals + Recursion — fully fleshed: lesson + Easy/Medium
// questions with C++ solutions (collapsed until the learner reveals them).
const FUNDAMENTALS: Topic[] = [
  {
    id: "io", name: "Input / Output", phaseId: "p1",
    blurb: "Reading input and printing output in C++ (cin/cout, fast IO).",
    lesson: {
      objective: "Read input and print output reliably in C++.",
      explanation: "`cin >> x` reads (skipping whitespace) and `cout << x` prints. For big inputs add `ios::sync_with_stdio(false); cin.tie(0);` for **fast IO**. Use `'\\n'` instead of `endl` to avoid slow flushes.",
      definition: "Standard input/output in C++ uses the stream objects `cin` (read) and `cout` (write) from <iostream>.",
      syntax: `int x; cin >> x;            // read one int\ncout << x << '\\n';          // print + newline\nstring line; getline(cin, line); // read a whole line\nios::sync_with_stdio(false); cin.tie(0); // fast IO`,
      example: {
        code: `int n; cin >> n;\nvector<int> a(n);\nfor (auto& x : a) cin >> x;   // read n numbers\nfor (int x : a) cout << x << ' ';`,
        explanation: "Read the count first, size the container, then loop to read each value.",
      },
      keyConcepts: ["cin / cout", "Fast IO", "Reading until EOF"],
      interviewNotes: ["Add fast IO once n ≥ 10⁵.", "`cin >> x` returns false at EOF — loop on it."],
      commonMistakes: ["Mixing `cin >>` and `getline` without clearing the newline.", "Using `endl` in tight loops (flushes every time)."],
      complexity: { best: "O(n) read", average: "O(n) read", worst: "O(n) read", space: "O(1)" },
      timeComplexity: "O(n) to read n items", spaceComplexity: "O(1)",
    },
    questions: [
      { id: "io-q1", title: "Sum of Two Numbers", difficulty: "Easy", statement: "Read two integers a and b; print a + b.", concepts: ["cin/cout"], hint: "Read into two ints, print their sum.", timeComplexity: "O(1)", spaceComplexity: "O(1)", solution: cpp(`int main(){\n  long long a,b; cin>>a>>b;\n  cout<<a+b<<'\\n';\n}`) },
      { id: "io-q2", title: "Sum of N Numbers", difficulty: "Easy", statement: "Read n, then n integers; print their sum.", concepts: ["Loop", "Accumulate"], hint: "Loop n times adding each into a running total (use long long).", timeComplexity: "O(n)", spaceComplexity: "O(1)", solution: cpp(`int main(){\n  int n; cin>>n;\n  long long s=0,x;\n  for(int i=0;i<n;i++){ cin>>x; s+=x; }\n  cout<<s<<'\\n';\n}`) },
      { id: "io-q3", title: "Read Until EOF", difficulty: "Medium", statement: "Read integers until end-of-input; print how many there were and their sum.", concepts: ["EOF loop"], hint: "`while(cin>>x)` is false at EOF.", timeComplexity: "O(n)", spaceComplexity: "O(1)", solution: cpp(`int main(){\n  long long x,s=0; int cnt=0;\n  while(cin>>x){ s+=x; cnt++; }\n  cout<<cnt<<' '<<s<<'\\n';\n}`) },
    ],
  },
  {
    id: "variables", name: "Variables & Data Types", phaseId: "p1",
    blurb: "int, long long, double, char, bool and their ranges.",
    lesson: {
      objective: "Pick the right type and avoid silent overflow.",
      explanation: "Use `int` for values ≤ ~2·10⁹, `long long` beyond that (up to ~9·10¹⁸), `double` for decimals, `char` for single characters. **Overflow is silent** in C++ — size types to the constraints before you compute.",
      definition: "A variable is a named, typed storage location; the type fixes its size, range, and the operations allowed on it.",
      syntax: `int n = 42;            // 32-bit integer\nlong long big = 1e18;  // 64-bit integer\ndouble d = 3.14;       // floating point\nchar c = 'A';          // single character\nbool ok = true;        // boolean`,
      example: {
        code: `int a = 100000, b = 100000;\nint   bad = a * b;          // overflow! (1e10 > int max)\nlong long good = (long long)a * b;  // 10000000000 ✓`,
        explanation: "Each int fits, but their product doesn't — cast to long long *before* multiplying.",
      },
      keyConcepts: ["Integer ranges", "Overflow", "Type casting"],
      interviewNotes: ["A sum/product of ints can overflow even if each fits — promote to `long long`.", "Compare doubles with an epsilon, not `==`."],
      commonMistakes: ["`int` overflow on `a*b`.", "Integer division `5/2 == 2` (cast to double for 2.5)."],
      complexity: { best: "O(1)", average: "O(1)", worst: "O(1)", space: "O(1)" },
      timeComplexity: "O(1)", spaceComplexity: "O(1)",
    },
    questions: [
      { id: "var-q1", title: "Swap Without a Temp", difficulty: "Easy", statement: "Swap two integers a and b without using a third variable.", concepts: ["Arithmetic/XOR"], hint: "a^=b; b^=a; a^=b; — or use sums.", timeComplexity: "O(1)", spaceComplexity: "O(1)", solution: cpp(`void swapNoTemp(int& a,int& b){\n  a^=b; b^=a; a^=b;   // XOR swap\n}`) },
      { id: "var-q2", title: "Seconds to HH:MM:SS", difficulty: "Easy", statement: "Given total seconds, print hours, minutes, seconds.", concepts: ["Integer division", "Modulo"], hint: "h=s/3600; m=(s%3600)/60; sec=s%60.", timeComplexity: "O(1)", spaceComplexity: "O(1)", solution: cpp(`void toHMS(int s){\n  int h=s/3600, m=(s%3600)/60, sec=s%60;\n  cout<<h<<":"<<m<<":"<<sec<<'\\n';\n}`) },
      { id: "var-q3", title: "Overflow-Safe Sum", difficulty: "Medium", statement: "Two ints near INT_MAX — return their true sum without overflow.", concepts: ["long long"], hint: "Promote operands to long long before adding.", timeComplexity: "O(1)", spaceComplexity: "O(1)", solution: cpp(`long long safeSum(int a,int b){\n  return (long long)a + b;  // promote BEFORE adding\n}`) },
    ],
  },
  {
    id: "operators", name: "Operators", phaseId: "p1",
    blurb: "Arithmetic, relational, logical and bitwise operators.",
    lesson: {
      objective: "Use operators correctly, including modulo and bitwise.",
      explanation: "Beyond `+ − × ÷`, `%` (modulo) gives the remainder and bitwise `& | ^ << >>` operate on bits. **Modulo of a negative** can be negative in C++. Bit tricks: `x<<1` doubles, `x>>1` halves, `x&1` tests the last bit.",
      definition: "Operators are symbols that perform computation on values — arithmetic, relational, logical, and bitwise.",
      syntax: `a + b   a - b   a * b   a / b   a % b   // arithmetic\na == b  a != b  a < b   a >= b          // relational\na && b  a || b  !a                       // logical\na & b   a | b   a ^ b   a << 1  a >> 1   // bitwise`,
      example: {
        code: `bool even = (x & 1) == 0;   // last bit 0 -> even\nint  half = x >> 1;         // divide by 2\nint  twice = x << 1;        // multiply by 2\nint  r = ((x % m) + m) % m; // always-positive modulo`,
        explanation: "`((x % m) + m) % m` fixes C++'s negative-modulo so the result is always in [0, m).",
      },
      keyConcepts: ["Modulo", "Logical vs bitwise", "Precedence"],
      interviewNotes: ["`x & 1` is a fast even/odd test.", "Use parentheses — bitwise has low precedence."],
      commonMistakes: ["Confusing `&&` (logical) with `&` (bitwise).", "Assuming `-7 % 3` is positive."],
      complexity: { best: "O(1)", average: "O(1)", worst: "O(1)", space: "O(1)" },
      timeComplexity: "O(1)", spaceComplexity: "O(1)",
    },
    questions: [
      { id: "op-q1", title: "Even or Odd", difficulty: "Easy", statement: "Return true if n is even.", concepts: ["Bitwise/Modulo"], hint: "`(n & 1) == 0`.", timeComplexity: "O(1)", spaceComplexity: "O(1)", solution: cpp(`bool isEven(int n){ return (n & 1) == 0; }`) },
      { id: "op-q2", title: "First & Last Digit", difficulty: "Easy", statement: "Print the first and last digit of a positive integer n.", concepts: ["Modulo", "Loop"], hint: "Last = n%10; divide by 10 until one digit remains for first.", timeComplexity: "O(log n)", spaceComplexity: "O(1)", solution: cpp(`void firstLast(int n){\n  int last=n%10;\n  while(n>=10) n/=10;\n  cout<<n<<' '<<last<<'\\n'; // first last\n}`) },
      { id: "op-q3", title: "Power of Two", difficulty: "Medium", statement: "Return true if n is a power of two.", concepts: ["Bit trick"], hint: "A power of two has exactly one set bit: `n>0 && (n&(n-1))==0`.", timeComplexity: "O(1)", spaceComplexity: "O(1)", similar: ["Count set bits"], solution: cpp(`bool isPowerOfTwo(long long n){\n  return n>0 && (n & (n-1))==0;\n}`) },
    ],
  },
  {
    id: "conditions", name: "Conditions", phaseId: "p1",
    blurb: "if / else / switch and clean branching.",
    lesson: {
      objective: "Write correct, readable branching logic.",
      explanation: "`if/else` and `switch` choose a path. Order checks **most-specific first** (e.g. check %15 before %3). Prefer **early returns** over deep nesting to keep code flat and readable.",
      definition: "A conditional executes a block only when a boolean expression is true, letting a program branch between paths.",
      syntax: `if (cond) { ... }\nelse if (other) { ... }\nelse { ... }\n\nswitch (x) {\n  case 1: ...; break;   // break stops fall-through\n  default: ...;\n}`,
      example: {
        code: `// FizzBuzz: order matters — check 15 first\nfor (int i = 1; i <= n; i++) {\n  if (i % 15 == 0)      cout << "FizzBuzz";\n  else if (i % 3 == 0)  cout << "Fizz";\n  else if (i % 5 == 0)  cout << "Buzz";\n  else                  cout << i;\n  cout << '\\n';\n}`,
        explanation: "The %15 branch must come first — otherwise %3 would catch multiples of 15 before %15 is ever tested.",
      },
      keyConcepts: ["if/else/switch", "Early return", "Boolean logic"],
      interviewNotes: ["Handle edge cases (empty, equal, negative) explicitly.", "Combine conditions with `&&`/`||` and parentheses."],
      commonMistakes: ["Falling through a `switch` (missing `break`).", "Wrong order of overlapping conditions."],
      complexity: { best: "O(1)", average: "O(1)", worst: "O(1)", space: "O(1)" },
      timeComplexity: "O(1)", spaceComplexity: "O(1)",
    },
    questions: [
      { id: "cond-q1", title: "Largest of Three", difficulty: "Easy", statement: "Return the maximum of three integers.", concepts: ["Comparison"], hint: "`max(a, max(b, c))`.", timeComplexity: "O(1)", spaceComplexity: "O(1)", solution: cpp(`int largest3(int a,int b,int c){\n  return max(a, max(b, c));\n}`) },
      { id: "cond-q2", title: "Leap Year", difficulty: "Easy", statement: "Return true if year y is a leap year.", concepts: ["Modulo logic"], hint: "Divisible by 4 and (not by 100, or by 400).", timeComplexity: "O(1)", spaceComplexity: "O(1)", solution: cpp(`bool isLeap(int y){\n  return (y%4==0 && y%100!=0) || (y%400==0);\n}`) },
      { id: "cond-q3", title: "Marks to Grade", difficulty: "Medium", statement: "Map a mark 0–100 to a grade (A ≥90, B ≥75, C ≥60, D ≥40, else F).", concepts: ["Ordered branching"], hint: "Check the highest threshold first and return early.", timeComplexity: "O(1)", spaceComplexity: "O(1)", solution: cpp(`char grade(int m){\n  if(m>=90) return 'A';\n  if(m>=75) return 'B';\n  if(m>=60) return 'C';\n  if(m>=40) return 'D';\n  return 'F';\n}`) },
    ],
  },
  {
    id: "functions", name: "Functions & Recursion Intro", phaseId: "p1",
    blurb: "Parameters, return values, pass-by-reference, scope.",
    lesson: {
      objective: "Decompose code into small reusable functions.",
      explanation: "A function takes parameters and returns a value. Pass large objects by `const&` to avoid copies; pass by `&` to modify the caller's variable. A function that calls itself is **recursion** — every recursion needs a **base case**.",
      keyConcepts: ["Pass by value/ref", "Scope", "Base case"],
      interviewNotes: ["Prefer pure functions (no side effects) — easier to test.", "Recursion depth = stack memory."],
      commonMistakes: ["Recursion with no base case (stack overflow).", "Modifying a copy and expecting the original to change."],
      timeComplexity: "depends", spaceComplexity: "O(depth) for recursion",
    },
    questions: [
      { id: "fn-q1", title: "Factorial (iterative)", difficulty: "Easy", statement: "Return n! for n ≥ 0.", concepts: ["Loop"], hint: "Multiply 1..n into a long long.", timeComplexity: "O(n)", spaceComplexity: "O(1)", solution: cpp(`long long factorial(int n){\n  long long f=1;\n  for(int i=2;i<=n;i++) f*=i;\n  return f;\n}`) },
      { id: "fn-q2", title: "Is Prime", difficulty: "Easy", statement: "Return true if n is prime.", concepts: ["Trial division"], hint: "Only check divisors up to √n.", timeComplexity: "O(√n)", spaceComplexity: "O(1)", solution: cpp(`bool isPrime(int n){\n  if(n<2) return false;\n  for(long long i=2;i*i<=n;i++)\n    if(n%i==0) return false;\n  return true;\n}`) },
      { id: "fn-q3", title: "Power a^b (fast)", difficulty: "Medium", statement: "Compute a^b efficiently.", concepts: ["Binary exponentiation"], hint: "Square the base, halve the exponent.", timeComplexity: "O(log b)", spaceComplexity: "O(1)", similar: ["Modular exponentiation"], solution: cpp(`long long power(long long a,long long b){\n  long long r=1;\n  while(b>0){ if(b&1) r*=a; a*=a; b>>=1; }\n  return r;\n}`) },
    ],
  },
  {
    id: "basic-math", name: "Basic Mathematics", phaseId: "p1",
    blurb: "GCD, primes, factors, modular arithmetic.",
    lesson: {
      objective: "Apply the number-theory basics that recur across DSA.",
      explanation: "Know the **Euclidean GCD**, the **Sieve of Eratosthenes** (all primes ≤ n in ~O(n log log n)), and modular arithmetic `(a·b)%m` to avoid overflow. These show up in countless problems.",
      keyConcepts: ["GCD (Euclid)", "Sieve of Eratosthenes", "Modular arithmetic"],
      interviewNotes: ["`lcm(a,b) = a/gcd(a,b)*b` (divide first to avoid overflow).", "Take a `long long` product before `%m`."],
      commonMistakes: ["Sieving up to n but forgetting i·i ≤ n bound.", "Overflow in `a*b` before the modulo."],
      timeComplexity: "GCD O(log min)", spaceComplexity: "Sieve O(n)",
    },
    questions: [
      { id: "math-q1", title: "GCD (Euclid)", difficulty: "Easy", statement: "Return gcd(a, b).", concepts: ["Euclid"], hint: "gcd(a,b) = gcd(b, a%b); base case b==0.", timeComplexity: "O(log min)", spaceComplexity: "O(1)", solution: cpp(`int gcd(int a,int b){\n  while(b){ a%=b; swap(a,b); }\n  return a;\n}`) },
      { id: "math-q2", title: "Count Digits", difficulty: "Easy", statement: "Count the digits in a positive integer n.", concepts: ["Loop", "Division"], hint: "Divide by 10 until 0, counting steps.", timeComplexity: "O(log n)", spaceComplexity: "O(1)", solution: cpp(`int countDigits(long long n){\n  int c=0;\n  while(n){ c++; n/=10; }\n  return c?c:1;\n}`) },
      { id: "math-q3", title: "Sieve of Eratosthenes", difficulty: "Medium", statement: "Return all primes ≤ n.", concepts: ["Sieve"], hint: "Mark multiples of each prime starting at i·i.", timeComplexity: "O(n log log n)", spaceComplexity: "O(n)", similar: ["Count primes"], solution: cpp(`vector<int> primesUpto(int n){\n  vector<bool> isP(n+1,true); isP[0]=isP[1]=false;\n  for(long long i=2;i*i<=n;i++)\n    if(isP[i]) for(long long j=i*i;j<=n;j+=i) isP[j]=false;\n  vector<int> res;\n  for(int i=2;i<=n;i++) if(isP[i]) res.push_back(i);\n  return res;\n}`) },
    ],
  },
  {
    id: "recursion", name: "Recursion", phaseId: "p4",
    blurb: "Base cases, the call stack, and recursion trees.",
    lesson: {
      objective: "Solve problems by reducing them to smaller subproblems.",
      explanation: "Define a **base case**, then assume the function already works for smaller inputs and combine the results. Each call adds a frame to the **call stack**, so recursion uses O(depth) memory. Draw the **recursion tree** to find the time complexity.",
      keyConcepts: ["Base case", "Recursion tree", "Stack depth"],
      interviewNotes: ["Every recursion = base case + recursive case.", "Overlapping subproblems → add memoization (that's DP)."],
      commonMistakes: ["Missing/incorrect base case (infinite recursion).", "Recomputing the same subproblem exponentially (e.g. naive Fibonacci)."],
      timeComplexity: "depends on the tree", spaceComplexity: "O(depth)",
    },
    questions: [
      { id: "rec-q1", title: "Sum 1..n (recursive)", difficulty: "Easy", statement: "Return 1 + 2 + … + n using recursion.", concepts: ["Base case"], hint: "sum(n) = n + sum(n-1); base sum(0)=0.", timeComplexity: "O(n)", spaceComplexity: "O(n)", solution: cpp(`long long sumN(int n){\n  if(n==0) return 0;\n  return n + sumN(n-1);\n}`) },
      { id: "rec-q2", title: "Reverse a String (recursive)", difficulty: "Easy", statement: "Reverse string s in place using recursion / two pointers.", concepts: ["Two pointers", "Recursion"], hint: "Swap ends, recurse inward until l>=r.", timeComplexity: "O(n)", spaceComplexity: "O(n) stack", solution: cpp(`void rev(string& s,int l,int r){\n  if(l>=r) return;\n  swap(s[l],s[r]);\n  rev(s,l+1,r-1);\n}`) },
      { id: "rec-q3", title: "All Subsets", difficulty: "Medium", statement: "Generate all 2ⁿ subsets of an array.", concepts: ["Backtracking", "Choose/skip"], hint: "At each index, branch: include it or not.", timeComplexity: "O(2ⁿ·n)", spaceComplexity: "O(n) depth", similar: ["Permutations", "Combination Sum"], solution: cpp(`void gen(vector<int>& a,int i,vector<int>& cur,vector<vector<int>>& out){\n  if(i==a.size()){ out.push_back(cur); return; }\n  gen(a,i+1,cur,out);          // skip\n  cur.push_back(a[i]);\n  gen(a,i+1,cur,out);          // include\n  cur.pop_back();\n}`) },
    ],
  },
];

// Core interview topics — fully fleshed (lesson + C++ question banks).
const MORE_TOPICS: Topic[] = [
  {
    id: "searching-sorting", name: "Searching & Sorting", phaseId: "p5",
    blurb: "Binary search and the classic sorts + when to use each.",
    lesson: {
      objective: "Apply binary search (incl. 'search on the answer') and pick the right sort.",
      explanation: "**Binary search** needs sorted data and runs O(log n): repeatedly halve the range. The mid-computation `lo + (hi-lo)/2` avoids overflow. Know **merge/quick sort** (O(n log n)). A powerful pattern is **binary search on the answer**: binary-search the result value when checking feasibility is monotonic.",
      keyConcepts: ["Binary search", "Lower/upper bound", "Merge/Quick sort", "Search on the answer"],
      interviewNotes: ["Confirm the array is sorted before using binary search.", "`lower_bound`/`upper_bound` in C++ STL solve many variants."],
      commonMistakes: ["Infinite loop from wrong `lo`/`hi` update.", "Overflow in `(lo+hi)/2`."],
      timeComplexity: "Search O(log n); sort O(n log n)", spaceComplexity: "O(1)–O(n)",
      intuition: "Guessing a number 1–100: each guess halves what's left.",
    },
    questions: [
      { id: "ss-q1", title: "Binary Search", difficulty: "Easy", statement: "Return the index of target in a sorted array, or -1.", concepts: ["Binary search"], hint: "Maintain [lo,hi]; compare with a[mid].", timeComplexity: "O(log n)", spaceComplexity: "O(1)", solution: cpp(`int bsearch(vector<int>& a,int t){\n  int lo=0, hi=a.size()-1;\n  while(lo<=hi){\n    int mid=lo+(hi-lo)/2;\n    if(a[mid]==t) return mid;\n    if(a[mid]<t) lo=mid+1; else hi=mid-1;\n  }\n  return -1;\n}`) },
      { id: "ss-q2", title: "Search in Rotated Sorted Array", difficulty: "Medium", statement: "Search target in a rotated sorted array in O(log n).", concepts: ["Binary search", "Halves"], hint: "One half is always sorted — decide which, then narrow.", timeComplexity: "O(log n)", spaceComplexity: "O(1)", similar: ["Find Minimum in Rotated Array"], solution: cpp(`int search(vector<int>& a,int t){\n  int lo=0, hi=a.size()-1;\n  while(lo<=hi){\n    int mid=lo+(hi-lo)/2;\n    if(a[mid]==t) return mid;\n    if(a[lo]<=a[mid]){            // left half sorted\n      if(a[lo]<=t && t<a[mid]) hi=mid-1; else lo=mid+1;\n    } else {                      // right half sorted\n      if(a[mid]<t && t<=a[hi]) lo=mid+1; else hi=mid-1;\n    }\n  }\n  return -1;\n}`) },
      { id: "ss-q3", title: "Koko Eating Bananas", difficulty: "Medium", statement: "Min eating speed k so all piles finish within h hours.", concepts: ["Binary search on answer"], hint: "Binary-search k; feasibility (hours needed) decreases as k grows.", timeComplexity: "O(n log max)", spaceComplexity: "O(1)", solution: cpp(`int minSpeed(vector<int>& p,int h){\n  int lo=1, hi=*max_element(p.begin(),p.end());\n  while(lo<hi){\n    int k=lo+(hi-lo)/2; long need=0;\n    for(int x:p) need+=(x+k-1)/k;   // ceil\n    if(need<=h) hi=k; else lo=k+1;\n  }\n  return lo;\n}`) },
    ],
  },
  {
    id: "linked-list", name: "Linked List", phaseId: "p6",
    blurb: "Pointers, reversal, fast/slow pointers, cycle detection.",
    lesson: {
      objective: "Manipulate nodes safely with pointers, dummy heads, and fast/slow pointers.",
      explanation: "A node holds a value and a **pointer to the next** node. A **dummy head** simplifies insert/delete at the front. **Fast/slow pointers** (one moves 2×) find the middle and detect cycles. Reversal re-points each `next` backward as you walk.",
      keyConcepts: ["Dummy node", "Fast/slow pointers", "In-place reversal", "Cycle detection"],
      interviewNotes: ["Draw the pointers before coding — off-by-one node errors are common.", "A dummy head removes most edge cases."],
      commonMistakes: ["Losing the rest of the list by overwriting `next` too early.", "Null-deref at the tail."],
      timeComplexity: "O(n)", spaceComplexity: "O(1)",
      intuition: "A treasure hunt: each clue points to the next location.",
    },
    questions: [
      { id: "ll-q1", title: "Reverse a Linked List", difficulty: "Easy", statement: "Reverse a singly linked list and return the new head.", concepts: ["Pointer rewiring"], hint: "Track prev/cur/next; flip cur->next to prev.", timeComplexity: "O(n)", spaceComplexity: "O(1)", similar: ["Reverse in groups of k"], solution: cpp(`ListNode* reverse(ListNode* head){\n  ListNode* prev=nullptr;\n  while(head){ ListNode* nxt=head->next; head->next=prev; prev=head; head=nxt; }\n  return prev;\n}`) },
      { id: "ll-q2", title: "Linked List Cycle", difficulty: "Easy", statement: "Detect whether the list has a cycle.", concepts: ["Floyd's fast/slow"], hint: "If fast meets slow, there's a cycle.", timeComplexity: "O(n)", spaceComplexity: "O(1)", solution: cpp(`bool hasCycle(ListNode* head){\n  ListNode *slow=head,*fast=head;\n  while(fast && fast->next){\n    slow=slow->next; fast=fast->next->next;\n    if(slow==fast) return true;\n  }\n  return false;\n}`) },
      { id: "ll-q3", title: "Merge Two Sorted Lists", difficulty: "Medium", statement: "Merge two sorted lists into one sorted list.", concepts: ["Dummy head", "Two pointers"], hint: "Use a dummy node; attach the smaller head each step.", timeComplexity: "O(n+m)", spaceComplexity: "O(1)", solution: cpp(`ListNode* merge(ListNode* a,ListNode* b){\n  ListNode dummy(0), *t=&dummy;\n  while(a && b){\n    if(a->val<=b->val){ t->next=a; a=a->next; }\n    else { t->next=b; b=b->next; }\n    t=t->next;\n  }\n  t->next = a ? a : b;\n  return dummy.next;\n}`) },
    ],
  },
  {
    id: "dp", name: "Dynamic Programming", phaseId: "p11",
    blurb: "Memoization, tabulation, classic 1-D/2-D patterns.",
    lesson: {
      objective: "Recognize overlapping subproblems and solve them with memoization or tabulation.",
      explanation: "**DP = recursion + caching.** Find the *state* (what uniquely describes a subproblem), the *transition* (how states combine), and the *base case*. **Top-down** memoizes a recursion; **bottom-up** fills a table. Most 1-D DP depends on the previous one or two states.",
      keyConcepts: ["State & transition", "Memoization (top-down)", "Tabulation (bottom-up)", "Space optimization"],
      interviewNotes: ["Always write the recurrence first, then add caching.", "Many 1-D DPs need only O(1) rolling variables."],
      commonMistakes: ["Wrong/missing base case.", "Iterating the table in the wrong order."],
      timeComplexity: "O(states · transition)", spaceComplexity: "O(states) → often O(1)",
      intuition: "Don't solve the same subproblem twice — write the answer down the first time.",
    },
    questions: [
      { id: "dp-q1", title: "Climbing Stairs", difficulty: "Easy", statement: "How many distinct ways to climb n stairs taking 1 or 2 steps?", concepts: ["1-D DP", "Fibonacci"], hint: "ways(n) = ways(n-1) + ways(n-2).", timeComplexity: "O(n)", spaceComplexity: "O(1)", solution: cpp(`int climbStairs(int n){\n  int a=1,b=1;\n  for(int i=2;i<=n;i++){ int c=a+b; a=b; b=c; }\n  return b;\n}`) },
      { id: "dp-q2", title: "House Robber", difficulty: "Medium", statement: "Max sum of non-adjacent elements.", concepts: ["1-D DP", "Take/skip"], hint: "dp[i] = max(skip dp[i-1], take a[i]+dp[i-2]).", timeComplexity: "O(n)", spaceComplexity: "O(1)", similar: ["House Robber II"], solution: cpp(`int rob(vector<int>& a){\n  int prev=0, cur=0;\n  for(int x:a){ int t=max(cur, prev+x); prev=cur; cur=t; }\n  return cur;\n}`) },
      { id: "dp-q3", title: "Longest Common Subsequence", difficulty: "Hard", statement: "Length of the LCS of strings a and b.", concepts: ["2-D DP"], hint: "If chars match, 1+diag; else max(up, left).", timeComplexity: "O(n·m)", spaceComplexity: "O(n·m)", similar: ["Edit Distance", "LIS"], solution: cpp(`int lcs(string a,string b){\n  int n=a.size(), m=b.size();\n  vector<vector<int>> dp(n+1, vector<int>(m+1,0));\n  for(int i=1;i<=n;i++)\n    for(int j=1;j<=m;j++)\n      dp[i][j] = a[i-1]==b[j-1] ? dp[i-1][j-1]+1 : max(dp[i-1][j], dp[i][j-1]);\n  return dp[n][m];\n}`) },
    ],
  },
];

export const TOPICS_ALL: Topic[] = [...TOPICS, ...FUNDAMENTALS, ...MORE_TOPICS, ...STUB_TOPICS];

// ── PHASES (ordered) ────────────────────────────────────────────────────────
export const PHASES: Phase[] = [
  { id: "p1", name: "Phase 1 — Programming Fundamentals", summary: "From zero: IO, variables, loops, functions, complexity.", topicIds: ["io", "variables", "operators", "conditions", "loops", "functions", "basic-math", "time-complexity"] },
  { id: "p2", name: "Phase 2 — Arrays", summary: "Two pointers, prefix sums, sliding window, Kadane.", topicIds: ["arrays"] },
  { id: "p3", name: "Phase 3 — Strings", summary: "Frequency maps, two pointers, sliding window.", topicIds: ["strings"] },
  { id: "p4", name: "Phase 4 — Recursion & Backtracking", summary: "Subproblems, the call stack, choose/un-choose.", topicIds: ["recursion", "backtracking"] },
  { id: "p5", name: "Phase 5 — Searching & Sorting", summary: "Binary search and the classic sorts.", topicIds: ["searching-sorting"] },
  { id: "p6", name: "Phase 6 — Linked List, Stack & Queue", summary: "Pointers, LIFO/FIFO, monotonic structures.", topicIds: ["linked-list", "stack", "queue"] },
  { id: "p7", name: "Phase 7 — Hashing", summary: "O(1) lookups, frequency, dedup.", topicIds: ["hashing"] },
  { id: "p8", name: "Phase 8 — Trees, BST, Heap & Trie", summary: "Hieraries, ordered trees, priority queues, prefix trees.", topicIds: ["trees", "bst", "heap", "trie"] },
  { id: "p9", name: "Phase 9 — Graphs", summary: "BFS/DFS, topo sort, shortest paths.", topicIds: ["graphs"] },
  { id: "p10", name: "Phase 10 — Greedy & Bit Manipulation", summary: "Local-optimal choices and bit tricks.", topicIds: ["greedy", "bit-manipulation"] },
  { id: "p11", name: "Phase 11 — Dynamic Programming", summary: "Memoization, tabulation, classic patterns.", topicIds: ["dp", "advanced-dp"] },
  { id: "p12", name: "Phase 12 — Advanced", summary: "Segment/Fenwick trees, DSU, advanced graphs.", topicIds: ["segment-tree", "fenwick", "dsu", "advanced-graph"] },
  { id: "p13", name: "Phase 13 — Interview Prep", summary: "Final revision and mock interviews.", topicIds: ["interview-revision", "mock-interview"] },
];

// ── Lookups + flat order ──────────────────────────────────────────────────────
const BY_ID = new Map(TOPICS_ALL.map((t) => [t.id, t]));
export const getTopic = (id: string): Topic | undefined => BY_ID.get(id);
export const getPhase = (id: string): Phase | undefined => PHASES.find((p) => p.id === id);

/** All topics in roadmap order (phase order, then topic order within phase). */
export const TOPICS_ORDERED: Topic[] = PHASES.flatMap((p) =>
  p.topicIds.map((id) => BY_ID.get(id)).filter((t): t is Topic => Boolean(t))
);

export const TOTAL_TOPICS = TOPICS_ORDERED.length;
export const TOTAL_QUESTIONS = TOPICS_ALL.reduce((n, t) => n + t.questions.length, 0);

export function checklistFor(topic: Topic): ChecklistItem[] {
  return topic.checklist ?? DEFAULT_CHECKLIST;
}
