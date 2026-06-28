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
  /** Concise plain-language explanation (markdown allowed). */
  explanation: string;
  keyConcepts: string[];
  interviewNotes: string[];
  commonMistakes: string[];
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
  { id: "concept", label: "Learned the concept" },
  { id: "easy", label: "Solved an Easy question" },
  { id: "medium", label: "Solved a Medium question" },
  { id: "hard", label: "Solved a Hard question" },
  { id: "revised", label: "Revised today" },
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
      keyConcepts: ["for / while / do-while", "Loop counters & bounds", "Nested loops", "Pattern printing"],
      interviewNotes: ["Off-by-one errors live at the loop bounds — check `<` vs `<=`.", "Nested loops over n elements are usually O(n²)."],
      commonMistakes: ["Infinite loops (forgetting to update the counter).", "Confusing the row vs column index in nested loops."],
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
      keyConcepts: ["O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ)", "Dominant term", "Best/avg/worst case", "Amortized cost"],
      interviewNotes: ["State complexity for every solution you give — interviewers always ask.", "n ≤ 10⁸ ops/sec is the rough budget; use it to pick an algorithm."],
      commonMistakes: ["Counting constants (O(2n) is just O(n)).", "Forgetting recursion stack space."],
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
      keyConcepts: ["O(1) index access", "Two pointers", "Prefix sum", "Sliding window", "Kadane's algorithm"],
      interviewNotes: ["Ask if the array is sorted — it unlocks two-pointer / binary search.", "Watch for integer overflow on sums (use long long)."],
      commonMistakes: ["Out-of-bounds at the last index.", "Mutating the array while iterating.", "Resetting the window sum incorrectly."],
      timeComplexity: "Most techniques O(n)", spaceComplexity: "O(1) in-place",
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
      keyConcepts: ["Frequency arrays/maps", "Two pointers", "Sliding window", "ASCII math (c - 'a')"],
      interviewNotes: ["A fixed 26-int array beats a hash map for lowercase-only inputs.", "Clarify: case-sensitive? unicode? spaces?"],
      commonMistakes: ["Comparing chars with wrong case.", "Window not shrinking from the left correctly."],
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
  // Phase 1 remainder
  stub("io", "Input / Output", "p1", "Reading input and printing output in C++ (cin/cout, fast IO).", "Read input and print output reliably.", "C++ uses `cin >> x` to read and `cout << x` to print. For large inputs, add `ios::sync_with_stdio(false); cin.tie(0);` for fast IO.", ["cin / cout", "Fast IO", "Reading until EOF"]),
  stub("variables", "Variables & Data Types", "p1", "int, long long, double, char, bool and their ranges.", "Pick the right type and avoid overflow.", "Choose `int` for ≤2·10⁹, `long long` beyond that, `double` for decimals. Overflow is silent — size your types to the constraints.", ["Integer ranges", "Overflow", "Type casting"]),
  stub("operators", "Operators", "p1", "Arithmetic, relational, logical and bitwise operators.", "Use operators (incl. modulo & bitwise) correctly.", "Beyond +−×÷, `%` (modulo) and bitwise `& | ^ << >>` are interview staples. Modulo of negatives can be negative in C++.", ["Modulo", "Logical vs bitwise", "Precedence"]),
  stub("conditions", "Conditions", "p1", "if / else / switch and clean branching.", "Write correct, readable branching logic.", "Order conditions from most specific to least (e.g. %15 before %3). Prefer early returns over deep nesting.", ["if/else/switch", "Early return", "Boolean logic"]),
  stub("functions", "Functions & Recursion Intro", "p1", "Parameters, return values, pass-by-reference, scope.", "Decompose code into reusable functions.", "Pass large objects by `const&` to avoid copies. A function that calls itself is recursion — every recursion needs a base case.", ["Pass by value/ref", "Scope", "Base case"]),
  stub("basic-math", "Basic Mathematics", "p1", "GCD, primes, factors, modular arithmetic.", "Apply number-theory basics used across DSA.", "Know the Euclidean GCD, the sieve for primes up to n, and `(a·b)%m` to avoid overflow. These recur in many problems.", ["GCD (Euclid)", "Sieve of Eratosthenes", "Modular arithmetic"]),
  // Phase 4+
  stub("recursion", "Recursion", "p4", "Base cases, the call stack, and recursion trees.", "Solve problems by reducing them to smaller subproblems.", "Define a base case, then assume the function works for smaller inputs and combine. The call stack uses O(depth) memory.", ["Base case", "Recursion tree", "Stack depth"]),
  stub("backtracking", "Backtracking", "p4", "Choose → explore → un-choose: subsets, permutations, N-Queens.", "Enumerate possibilities with pruning.", "Try a choice, recurse, then undo it (backtrack). Prune branches that can't lead to a solution.", ["Choose/un-choose", "Pruning", "State restoration"]),
  stub("searching-sorting", "Searching & Sorting", "p5", "Binary search and the classic sorts + when to use each.", "Use binary search and pick the right sort.", "Binary search needs sorted data and runs O(log n). Know merge/quick sort (O(n log n)) and 'binary search on the answer'.", ["Binary search", "Merge/Quick sort", "Search on answer"]),
  stub("linked-list", "Linked List", "p6", "Pointers, reversal, fast/slow pointers, cycle detection.", "Manipulate nodes with pointers safely.", "A node holds a value + a pointer to the next. Use a dummy head to simplify edge cases and fast/slow pointers for cycles/middle.", ["Dummy node", "Fast/slow pointers", "Reversal"]),
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
  stub("dp", "Dynamic Programming", "p11", "Memoization, tabulation, classic 1-D/2-D patterns.", "Solve overlapping-subproblem problems efficiently.", "DP = recursion + caching. Identify the state, the transition, and the base case; then memoize (top-down) or tabulate (bottom-up).", ["State & transition", "Memoization", "Tabulation"]),
  stub("advanced-dp", "Advanced DP", "p11", "Knapsack variants, DP on subsequences, intervals, bitmask DP.", "Tackle multi-dimensional DP.", "Patterns: 0/1 knapsack, LIS/LCS on subsequences, interval DP (MCM), and bitmask DP for small n.", ["Knapsack", "LCS/LIS", "Bitmask DP"]),
  stub("segment-tree", "Segment Tree", "p12", "Range queries + point/range updates in O(log n).", "Answer range queries with updates.", "A segment tree supports range sum/min/max with point updates in O(log n); lazy propagation enables range updates.", ["Range query", "Point update", "Lazy propagation"]),
  stub("fenwick", "Fenwick Tree (BIT)", "p12", "Prefix sums with updates in O(log n) — compact.", "Use a BIT for prefix-sum-with-updates.", "A Fenwick tree gives O(log n) prefix sums and point updates with very little code — great for inversion counts.", ["Prefix sums", "Point update", "Inversion count"]),
  stub("dsu", "Disjoint Set Union", "p12", "Union-Find with path compression for connectivity.", "Track connected components fast.", "DSU answers 'are these connected?' in near-O(1) with path compression + union by rank — the backbone of Kruskal's MST.", ["Union by rank", "Path compression", "Connectivity"]),
  stub("advanced-graph", "Advanced Graph Algorithms", "p12", "Dijkstra, Bellman-Ford, Floyd-Warshall, MST, SCC.", "Solve weighted/shortest-path and MST problems.", "Dijkstra (non-negative), Bellman-Ford (negative edges), Floyd-Warshall (all-pairs), Kruskal/Prim (MST), Tarjan/Kosaraju (SCC).", ["Shortest paths", "MST", "SCC"]),
  stub("interview-revision", "Interview Revision", "p13", "A focused last-mile checklist across all topics.", "Revise the highest-yield patterns before interviews.", "Re-solve one problem per pattern (two pointers, sliding window, BFS/DFS, DP) and rehearse explaining your approach out loud.", ["Pattern review", "Spaced repetition", "Explain-aloud"]),
  stub("mock-interview", "Mock Interview Prep", "p13", "Simulate the real thing: think aloud, edge cases, complexity.", "Practice the interview format itself.", "Practice: clarify → brute force → optimize → code → test → state complexity. Time yourself to 30–40 minutes.", ["Think aloud", "Edge cases", "Time management"]),
];

export const TOPICS_ALL: Topic[] = [...TOPICS, ...STUB_TOPICS];

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
