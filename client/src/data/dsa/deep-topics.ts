// PrepNext — Tier-A deep DSA topics (curriculum P0-a).
// Full lessons + practice for the six highest-interview-frequency topics that
// were previously stubs. Aggregated into the roadmap via TOPICS_ALL (roadmap.ts).
import type { Topic, Solution } from "./roadmap";

const cpp = (s: string): Solution => ({ cpp: s });

export const DEEP_TOPICS: Topic[] = [
  // ── Hashing (p7) ────────────────────────────────────────────────────────────
  {
    id: "hashing", name: "Hashing", phaseId: "p7",
    blurb: "Hash maps & sets: O(1) average lookup for counting, dedup, and complement search — the interview workhorse.",
    lesson: {
      objective: "Recognize when a hash map/set turns an O(n²) scan into an O(n) pass, and use unordered_map / unordered_set fluently.",
      explanation: `A **hash map** answers one question extremely fast: *"have I seen this key before, and what did I store with it?"* It does this by running the key through a **hash function** that converts it into an array index. Instead of scanning a list to find something (O(n)), you jump straight to where it should live (O(1) on average). A **hash set** is the same idea minus the value — it only remembers membership.

Why does this matter so much in interviews? Because a huge family of brute-force solutions share the same bottleneck: an inner loop that re-searches data you have already walked past. *"For each element, is there another element that…"* — pairs summing to a target, duplicates, matching frequencies. Every one of those inner loops is a **lookup**, and hashing makes lookups O(1). The pattern is always the same: do one pass, and as you go, store what a *future* element might need to find. This is **complement search** — for Two Sum, when you stand at \`x\` you don't look for a partner; you check whether some earlier element already registered itself as \`target − x\`.

The second big pattern is **frequency counting**. One pass builds a map from element → count; a second pass (or the same one) asks questions of those counts. Anagrams, majority elements, "first unique character", ransom notes — all are frequency problems wearing costumes. When the key space is tiny and known (lowercase letters), a plain \`int freq[26]\` array is a *perfect* hash — same idea, zero overhead.

A third, sneakier pattern: **hashing prefix state**. In Subarray Sum Equals K, you store every running prefix sum you've seen; at index i you ask "how many earlier prefixes equal \`current − k\`?" — each hit is a subarray ending here with sum k. Any time a problem says "count/find subarrays with some cumulative property", think *prefix + hash map*.

**How it works underneath (interview-level intuition).** The hash function maps keys into a fixed number of buckets. Two different keys can land in the same bucket — a **collision** — which the container resolves by chaining entries in that bucket. With a good hash function and enough buckets, chains stay short and operations are O(1) *on average*; in the adversarial worst case everything collides and you degrade to O(n). You will rarely implement this, but you should be able to *explain* it — it's a favorite follow-up.

**\`unordered_map\` vs \`map\` in C++.** \`unordered_map\` is the hash table: average O(1), no ordering. \`std::map\` is a red-black tree: guaranteed O(log n), keys kept **sorted**. Choose \`map\` only when you need order — smallest key, range queries, iterating in sorted order. Otherwise default to \`unordered_map\`. Same split for \`set\` vs \`unordered_set\`.

**When does hashing beat sorting?** Sorting costs O(n log n) and destroys original order but gives you neighbors-are-equal structure. Hashing costs O(n) time and O(n) *space* and preserves order. If the question is purely about existence, counts, or pairing — hash. If the answer depends on sorted structure (closest pair, in-order output, two-pointer sweeps) — sort. Longest Consecutive Sequence is the classic flex: it *sounds* like sorting, but a hash set plus "only start counting at a number whose predecessor is absent" gets O(n).

**Recognition checklist.** Reach for hashing when you see: "have we seen…", "count occurrences", "find a pair/complement", "group things that are equivalent" (map from canonical form → group), or "O(n) required, O(n²) obvious". The cost is memory — always say out loud that you're trading O(n) space for the speed; interviewers reward that awareness.

One last habit: pick the **right key**. Group Anagrams works because the sorted word is a canonical key all anagrams share. Designing the key that makes "equivalent" things collide *on purpose* is the creative step in most hashing problems.`,
      definition: "A hash table stores key→value pairs in an array of buckets, using a hash function to map each key to a bucket, giving average O(1) insert, lookup, and erase.",
      syntax: `unordered_map<string,int> cnt;     // hash map
cnt["apple"]++;                     // insert / update (0-init on first touch)
if (cnt.count("apple")) ...         // membership test
auto it = cnt.find("pear");         // find: iterator or cnt.end()
cnt.erase("apple");

unordered_set<int> seen;            // hash set
seen.insert(42);
bool dup = !seen.insert(42).second; // insert tells you if it was new

map<int,int> ordered;               // tree map: O(log n), keys sorted`,
      example: {
        code: `// Do any two numbers in the array sum to target?  O(n) one pass.
bool hasPairSum(vector<int>& a, int target){
  unordered_set<int> seen;                 // values met so far
  for(int x : a){
    if(seen.count(target - x)) return true; // my complement already appeared
    seen.insert(x);                         // register myself for the future
  }
  return false;
}`,
        explanation: "Each element checks for its complement among *earlier* elements in O(1), then registers itself — one pass replaces the O(n²) pair-checking loop.",
      },
      keyConcepts: ["Hash function & buckets", "Collisions (chaining)", "Frequency counting", "Complement search", "Prefix-sum + hash map", "unordered_map vs map"],
      interviewNotes: [
        "Interviewers probe *why* it's O(1) 'on average' — be ready to explain collisions and the O(n) worst case.",
        "Always state the space trade-off: you're buying O(n) time with O(n) memory.",
        "If keys are lowercase letters or digits, a fixed-size array beats a hash map — mentioning this scores points.",
        "For 'count subarrays with property X', pivot to prefix state stored in a map before trying nested loops.",
      ],
      commonMistakes: [
        "Using `m[key]` just to *check* existence — it inserts a default value; use `count()` or `find()`.",
        "Inserting the current element *before* checking for its complement (Two Sum with x == target/2 breaks).",
        "Forgetting to seed the prefix map with {0 → 1} in Subarray Sum Equals K, missing subarrays that start at index 0.",
        "Assuming `unordered_map` iterates in insertion or sorted order — it doesn't; order is unspecified.",
        "Reaching for `map` by default and paying O(log n) everywhere when no ordering was needed.",
      ],
      complexity: { best: "O(1) per op", average: "O(1) per op", worst: "O(n) per op (all collide)", space: "O(n)" },
      timeComplexity: "Average O(1) insert/lookup/erase",
      spaceComplexity: "O(n)",
      intuition: "A coat check: your ticket number tells the attendant exactly which hook your coat hangs on — no one walks the whole rack.",
    },
    questions: [
      {
        id: "hash-q1", title: "Contains Duplicate", difficulty: "Easy",
        statement: "Given an integer array, return true if any value appears at least twice.",
        concepts: ["Hash set", "Dedup"], hint: "Insert each element into a set; a failed insert means you've seen it.",
        timeComplexity: "O(n)", spaceComplexity: "O(n)", similar: ["Contains Duplicate II", "Valid Anagram"],
        solution: cpp(`bool containsDuplicate(vector<int>& a){\n  unordered_set<int> seen;\n  for(int x : a)\n    if(!seen.insert(x).second) return true; // insert failed -> already there\n  return false;\n}`),
      },
      {
        id: "hash-q2", title: "First Unique Character in a String", difficulty: "Easy",
        statement: "Return the index of the first non-repeating character in a lowercase string, or -1 if none exists.",
        concepts: ["Frequency count", "Two passes"], hint: "Count every character first, then re-scan for the first with count 1.",
        timeComplexity: "O(n)", spaceComplexity: "O(1) (26 counters)", similar: ["Valid Anagram", "Ransom Note"],
        solution: cpp(`int firstUniqChar(string s){\n  int c[26]={0};\n  for(char ch : s) c[ch-'a']++;\n  for(int i=0;i<(int)s.size();i++)\n    if(c[s[i]-'a']==1) return i;\n  return -1;\n}`),
      },
      {
        id: "hash-q3", title: "Two Sum (Hashing Revisit)", difficulty: "Easy",
        statement: "Return indices of two numbers that add to a target — the canonical complement-search problem (first met in Arrays, re-derived here through the hashing lens).",
        concepts: ["Complement search", "Value → index map"], hint: "While scanning, ask the map for target − x before storing x's index.",
        timeComplexity: "O(n)", spaceComplexity: "O(n)", similar: ["3Sum", "4Sum II"],
        solution: cpp(`vector<int> twoSum(vector<int>& a, int t){\n  unordered_map<int,int> idx;           // value -> index seen so far\n  for(int i=0;i<(int)a.size();i++){\n    auto it = idx.find(t - a[i]);\n    if(it != idx.end()) return {it->second, i};\n    idx[a[i]] = i;\n  }\n  return {};\n}`),
      },
      {
        id: "hash-q4", title: "Longest Consecutive Sequence", difficulty: "Medium",
        statement: "Given an unsorted array, find the length of the longest run of consecutive integers (values, not positions) in O(n).",
        concepts: ["Hash set", "Sequence heads"], hint: "Only start counting from a number whose predecessor is not in the set.",
        timeComplexity: "O(n)", spaceComplexity: "O(n)", similar: ["Contains Duplicate"],
        solution: cpp(`int longestConsecutive(vector<int>& a){\n  unordered_set<int> s(a.begin(), a.end());\n  int best=0;\n  for(int x : s){\n    if(s.count(x-1)) continue;          // not a sequence head\n    int len=1;\n    while(s.count(x+len)) len++;\n    best=max(best,len);\n  }\n  return best;\n}`),
      },
      {
        id: "hash-q5", title: "Subarray Sum Equals K", difficulty: "Medium",
        statement: "Count the number of contiguous subarrays whose elements sum to k (negatives allowed).",
        concepts: ["Prefix sum", "Hash map of prefixes"], hint: "A subarray ending at i sums to k exactly when some earlier prefix equals prefix(i) − k.",
        timeComplexity: "O(n)", spaceComplexity: "O(n)", similar: ["Contiguous Array", "Two Sum"],
        solution: cpp(`int subarraySum(vector<int>& a, int k){\n  unordered_map<long long,int> cnt{{0,1}}; // empty prefix\n  long long pre=0; int res=0;\n  for(int x : a){\n    pre += x;\n    auto it = cnt.find(pre - k);\n    if(it != cnt.end()) res += it->second;\n    cnt[pre]++;\n  }\n  return res;\n}`),
      },
      {
        id: "hash-q6", title: "4Sum II", difficulty: "Medium",
        statement: "Given four arrays of equal length n, count tuples (i,j,k,l) with A[i]+B[j]+C[k]+D[l] == 0.",
        concepts: ["Meet in the middle", "Sum → count map"], hint: "Hash all A+B pair sums, then look up −(C+D) for each pair from the other half.",
        timeComplexity: "O(n²)", spaceComplexity: "O(n²)", similar: ["Two Sum", "3Sum"],
        solution: cpp(`int fourSumCount(vector<int>& A, vector<int>& B, vector<int>& C, vector<int>& D){\n  unordered_map<int,int> ab;\n  for(int a : A) for(int b : B) ab[a+b]++;\n  int res=0;\n  for(int c : C) for(int d : D){\n    auto it = ab.find(-(c+d));\n    if(it != ab.end()) res += it->second;\n  }\n  return res;\n}`),
      },
      {
        id: "hash-q7", title: "First Missing Positive", difficulty: "Hard",
        statement: "Given an unsorted array, find the smallest missing positive integer in O(n) time and O(1) extra space.",
        concepts: ["Index as hash", "Cyclic placement"], hint: "The array itself can be the hash table: value v belongs at index v−1 — swap each value home.",
        timeComplexity: "O(n)", spaceComplexity: "O(1)", similar: ["Find All Duplicates in an Array"],
        solution: cpp(`int firstMissingPositive(vector<int>& a){\n  int n=a.size();\n  for(int i=0;i<n;i++)\n    while(a[i]>0 && a[i]<=n && a[a[i]-1]!=a[i])\n      swap(a[i], a[a[i]-1]);          // send value a[i] to its home slot\n  for(int i=0;i<n;i++)\n    if(a[i]!=i+1) return i+1;\n  return n+1;\n}`),
      },
    ],
  },

  // ── Stack (p6) ──────────────────────────────────────────────────────────────
  {
    id: "stack", name: "Stack", phaseId: "p6",
    blurb: "LIFO order, bracket matching, and the monotonic stack — the O(n) answer to every 'next greater element' question.",
    lesson: {
      objective: "Use a stack for nesting problems and master the monotonic stack pattern for next-greater/smaller queries.",
      explanation: `A **stack** is a container with one rule: the last thing you pushed is the first thing you can pop — **LIFO** (Last In, First Out). You can only touch the **top**. That restriction sounds limiting, but it exactly models anything with *nesting* or *"most recent unfinished thing"* semantics.

The most famous stack you never see is the **call stack**. When \`f()\` calls \`g()\`, the machine pushes a frame for \`g\`; when \`g\` returns, that frame pops and control lands back inside \`f\` — the most recently started function is the first to finish. Every recursive solution you write is secretly a stack algorithm, which is why any recursion can be rewritten iteratively with an explicit stack.

**Bracket matching** is the canonical warm-up. Scanning \`([]{})\`, an opening bracket is an *obligation* you'll settle later; a closing bracket must settle the **most recent** unsettled obligation. Push openers; on a closer, pop and check it matches. Valid input ends with an empty stack. Any parser — expressions, HTML tags, undo history, browser back-button — is this pattern scaled up.

**Expression evaluation** is next: in Reverse Polish Notation (\`2 3 + 4 *\`), operands pile up on a stack and each operator pops its two most recent operands, computes, and pushes the result. No parentheses, no precedence table — the stack order *is* the precedence.

Now the pattern interviewers really care about: the **monotonic stack**. Problem shape: *"for each element, find the next element to the right that is greater (or smaller) than it."* Brute force is O(n²). The insight: walk the array keeping a stack of indices whose answer is still unknown, arranged so their values are **decreasing** from bottom to top. When a new element \`x\` arrives, it *is* the "next greater" for every stacked element smaller than \`x\` — pop them all, record answers, then push \`x\`. Every index is pushed once and popped once, so the whole thing is **O(n)** despite the nested-looking while-loop. That amortized argument ("each element pays for its own pop") is exactly what interviewers want to hear.

The same skeleton solves an astonishing range: Daily Temperatures (days until warmer), Next Greater Element, stock spans, and — the boss fight — **Largest Rectangle in Histogram**, where popping a bar means "your rectangle just got closed on the right; your left boundary is the new stack top." A trailing sentinel bar of height 0 flushes the stack cleanly.

**Designing with stacks** shows up too: **Min Stack** asks for \`getMin()\` in O(1) alongside push/pop. The trick is to store, with every element, the *minimum of the stack at the moment it was pushed*. Popping automatically restores the previous minimum — no recomputation, because the stack's own LIFO discipline preserves history for you. That "carry a snapshot of state per node" idea recurs in many design questions.

**Recognition checklist.** Think *stack* when you see: matched/nested pairs; "most recent" anything (undo, back-button); evaluating or parsing expressions; converting recursion to iteration; and think *monotonic stack* the instant you read "next greater", "next smaller", "previous less", "days until", "visible from the left", or "largest rectangle/area under constraint". If your brute force compares each element with everything after it, a monotonic stack is usually the O(n) upgrade.

In C++, use \`std::stack\` (an adapter over \`deque\`) with \`push\`, \`pop\`, \`top\`, \`empty\`. Note \`pop()\` returns \`void\` — read \`top()\` first. Many competitive programmers just use a \`vector\` with \`push_back\`/\`back\`/\`pop_back\`; either is fine in interviews.`,
      definition: "A stack is a LIFO (last-in, first-out) collection supporting push, pop, and top, each in O(1) — only the most recently added element is accessible.",
      syntax: `stack<int> st;
st.push(5);            // add on top
int t = st.top();      // peek (does NOT remove)
st.pop();              // remove top (returns void!)
bool e = st.empty();
int  n = st.size();

// Monotonic stack skeleton: next greater element to the right
stack<int> idx;                        // indices, values decreasing
for (int i = 0; i < n; i++) {
  while (!idx.empty() && a[idx.top()] < a[i]) {
    ans[idx.top()] = i;                // a[i] is their next greater
    idx.pop();
  }
  idx.push(i);
}`,
      example: {
        code: `// Next greater element for each position (-1 if none) — O(n)
vector<int> nextGreater(vector<int>& a){
  int n=a.size();
  vector<int> ans(n,-1);
  stack<int> st;                       // indices with unknown answer
  for(int i=0;i<n;i++){
    while(!st.empty() && a[st.top()] < a[i]){
      ans[st.top()] = a[i];            // found their next greater
      st.pop();
    }
    st.push(i);
  }
  return ans;
}`,
        explanation: "Each index is pushed once and popped at most once, so total work is O(n) — the inner while-loop's cost is amortized across all iterations.",
      },
      keyConcepts: ["LIFO discipline", "Call-stack connection", "Bracket matching", "Monotonic stack", "Amortized O(n) analysis", "Min-stack design"],
      interviewNotes: [
        "For monotonic stack solutions, interviewers ask why the nested while-loop is still O(n) — answer: each element is pushed and popped at most once (amortized).",
        "Be explicit about what your stack *stores* (indices vs values) and its *invariant* (increasing or decreasing) before coding.",
        "Min Stack probes design thinking: the O(1) getMin comes from storing the running min with each entry, not from searching.",
        "Largest Rectangle is the standard hard follow-up to Daily Temperatures — know the sentinel trick.",
      ],
      commonMistakes: [
        "Calling top()/pop() on an empty stack — always guard with empty().",
        "Expecting pop() to return the element (it returns void in C++; read top() first).",
        "Choosing the wrong monotonic direction (decreasing stack finds next *greater*; increasing finds next *smaller*).",
        "Forgetting the sentinel/final flush, leaving elements on the stack with unrecorded answers.",
        "Storing values when the problem needs distances — store indices and compute i − st.top().",
      ],
      complexity: { best: "O(1) per op", average: "O(1) per op", worst: "O(1) per op; O(n) total for monotonic scans", space: "O(n)" },
      timeComplexity: "O(1) push/pop/top; monotonic scan O(n) total",
      spaceComplexity: "O(n)",
      intuition: "A stack of cafeteria trays: you can only take the top one, and the tray buried longest comes out last.",
    },
    questions: [
      {
        id: "stk-q1", title: "Valid Parentheses", difficulty: "Easy",
        statement: "Given a string of the characters ()[]{}, determine whether every bracket is closed in the correct order.",
        concepts: ["Stack", "Matching pairs"], hint: "Push openers; each closer must match the popped top; finish with an empty stack.",
        timeComplexity: "O(n)", spaceComplexity: "O(n)", similar: ["Min Remove to Make Valid Parentheses", "Longest Valid Parentheses"],
        solution: cpp(`bool isValid(string s){\n  stack<char> st;\n  for(char c : s){\n    if(c=='('||c=='['||c=='{') st.push(c);\n    else{\n      if(st.empty()) return false;\n      char o=st.top(); st.pop();\n      if((c==')'&&o!='(')||(c==']'&&o!='[')||(c=='}'&&o!='{')) return false;\n    }\n  }\n  return st.empty();\n}`),
      },
      {
        id: "stk-q2", title: "Next Greater Element I", difficulty: "Easy",
        statement: "For each element of nums1 (a subset of nums2), find the first greater element to its right in nums2, or -1.",
        concepts: ["Monotonic stack", "Hash map"], hint: "One monotonic pass over nums2 builds a value → next-greater map; answer nums1 from it.",
        timeComplexity: "O(n + m)", spaceComplexity: "O(n)", similar: ["Daily Temperatures", "Next Greater Element II"],
        solution: cpp(`vector<int> nextGreaterElement(vector<int>& q, vector<int>& a){\n  unordered_map<int,int> nge;\n  stack<int> st;                     // values, decreasing\n  for(int x : a){\n    while(!st.empty() && st.top()<x){ nge[st.top()]=x; st.pop(); }\n    st.push(x);\n  }\n  vector<int> res;\n  for(int x : q) res.push_back(nge.count(x)? nge[x] : -1);\n  return res;\n}`),
      },
      {
        id: "stk-q3", title: "Min Stack", difficulty: "Medium",
        statement: "Design a stack supporting push, pop, top, and getMin, all in O(1) time.",
        concepts: ["Design", "Auxiliary state per node"], hint: "Store with each element the minimum of the stack at the time it was pushed.",
        timeComplexity: "O(1) per operation", spaceComplexity: "O(n)", similar: ["Max Stack"],
        solution: cpp(`class MinStack {\n  stack<pair<int,int>> st;             // {value, min so far}\npublic:\n  void push(int v){\n    int m = st.empty()? v : min(v, st.top().second);\n    st.push({v, m});\n  }\n  void pop(){ st.pop(); }\n  int top(){ return st.top().first; }\n  int getMin(){ return st.top().second; }\n};`),
      },
      {
        id: "stk-q4", title: "Daily Temperatures", difficulty: "Medium",
        statement: "For each day, output how many days you must wait for a warmer temperature (0 if none).",
        concepts: ["Monotonic stack", "Indices"], hint: "Keep a stack of indices with strictly decreasing temperatures; a warmer day resolves them.",
        timeComplexity: "O(n)", spaceComplexity: "O(n)", similar: ["Next Greater Element I", "Online Stock Span"],
        solution: cpp(`vector<int> dailyTemperatures(vector<int>& t){\n  int n=t.size();\n  vector<int> res(n,0);\n  stack<int> st;                     // indices, temps decreasing\n  for(int i=0;i<n;i++){\n    while(!st.empty() && t[st.top()]<t[i]){\n      res[st.top()] = i - st.top();\n      st.pop();\n    }\n    st.push(i);\n  }\n  return res;\n}`),
      },
      {
        id: "stk-q5", title: "Evaluate Reverse Polish Notation", difficulty: "Medium",
        statement: "Evaluate an arithmetic expression given in postfix (RPN) form, e.g. [\"2\",\"3\",\"+\",\"4\",\"*\"] = 20.",
        concepts: ["Stack evaluation", "Operator/operand"], hint: "Push numbers; each operator pops two operands (mind the order for − and /) and pushes the result.",
        timeComplexity: "O(n)", spaceComplexity: "O(n)", similar: ["Basic Calculator"],
        solution: cpp(`int evalRPN(vector<string>& tok){\n  stack<long long> st;\n  for(string& s : tok){\n    if(s=="+"||s=="-"||s=="*"||s=="/"){\n      long long b=st.top(); st.pop();\n      long long a=st.top(); st.pop();\n      if(s=="+") st.push(a+b);\n      else if(s=="-") st.push(a-b);\n      else if(s=="*") st.push(a*b);\n      else st.push(a/b);\n    } else st.push(stoll(s));\n  }\n  return st.top();\n}`),
      },
      {
        id: "stk-q6", title: "Largest Rectangle in Histogram", difficulty: "Hard",
        statement: "Given bar heights of width 1, find the area of the largest rectangle that fits within the histogram.",
        concepts: ["Monotonic stack", "Sentinel"], hint: "When a bar pops, its rectangle's right edge is the current index and its left edge is the new stack top.",
        timeComplexity: "O(n)", spaceComplexity: "O(n)", similar: ["Maximal Rectangle", "Trapping Rain Water"],
        solution: cpp(`int largestRectangleArea(vector<int>& h){\n  h.push_back(0);                    // sentinel flushes the stack\n  stack<int> st;                     // indices, heights increasing\n  long long best=0;\n  for(int i=0;i<(int)h.size();i++){\n    while(!st.empty() && h[st.top()] >= h[i]){\n      long long ht = h[st.top()]; st.pop();\n      long long w  = st.empty()? i : i - st.top() - 1;\n      best = max(best, ht*w);\n    }\n    st.push(i);\n  }\n  return (int)best;\n}`),
      },
    ],
  },

  // ── Binary Trees (p8) ───────────────────────────────────────────────────────
  {
    id: "trees", name: "Binary Trees", phaseId: "p8",
    blurb: "Traversals, recursion on trees, and BFS by level — learning to 'trust the function' on smaller subtrees.",
    lesson: {
      objective: "Traverse binary trees four ways and solve height/diameter/ancestor problems by recursing on subtrees.",
      explanation: `A **binary tree** is nodes connected by edges, where each node has at most a **left** and a **right** child, and exactly one node — the **root** — has no parent. What makes trees special is that they're **recursively defined**: every node is itself the root of a smaller tree. That single fact powers almost every solution: solve the problem for the left subtree, solve it for the right subtree, combine.

**The four traversals.** DFS (depth-first) comes in three flavors defined by *when you visit the node relative to its children*: **pre-order** (node, left, right — good for copying/serializing, since you meet a parent before its children), **in-order** (left, node, right — magic for BSTs, where it yields sorted order), and **post-order** (left, right, node — good whenever a node's answer *depends on* its children's answers: heights, sizes, deleting a tree safely). The fourth is **level-order** (BFS): visit depth 0, then depth 1, then depth 2, using a **queue**. Push the root; repeatedly pop a node, record it, push its children. To split output *by level*, snapshot \`q.size()\` at the start of each round and pop exactly that many.

**The recursive leap of faith.** The mental skill interviewers are really testing is: *assume the recursive call already works*. To compute a tree's height, don't trace the recursion — just say "suppose \`height(left)\` and \`height(right)\` return correct answers; then my height is \`1 + max\` of them," and nail the base case (\`height(null) = 0\`). This "trust the function" discipline is what makes tree code five lines instead of fifty. Every tree recursion has the same skeleton: a **base case** for \`nullptr\`, recursive calls on children, and a **combine** step.

**Two answers at once.** Many classics (Diameter, Balanced Tree, Max Path Sum) have a subtle twist: the value you *return upward* is not the value you're *looking for*. The diameter through a node is \`leftHeight + rightHeight\`, but what the parent needs from you is your height. Pattern: recurse computing the "service value" (height), and update a shared best-answer variable as a side effect. Recognizing this two-track structure instantly is a strong interview signal.

**Ancestor logic.** Lowest Common Ancestor (general tree, no BST ordering) shows off post-order elegance: ask each subtree "do you contain p or q?" If both left and right report a find, the current node is the split point — the LCA. If only one side reports, forward its answer up. The base case returns the node itself when it *is* p or q.

**When to BFS vs DFS.** If the question mentions *levels*, *depth-by-depth*, *nearest/minimum depth*, or *view from a side* (rightmost node per level), BFS with a queue is natural. If the answer is built from children's answers, DFS/post-order is natural. Both visit every node once — O(n) time. Space differs: DFS holds one root-to-leaf path, O(h) (h = height, which is log n for balanced trees but n for a degenerate chain); BFS holds one level, up to O(n/2) for the bottom of a full tree.

**Recognition checklist.** "Depth/height/count/sum of a tree" → post-order recursion. "By level / zigzag / side view" → BFS with level-size snapshot. "Path between/through nodes" → per-node combine of child contributions, clamped at 0 if negatives can hurt (Max Path Sum). "Ancestor" → post-order search returning found-ness. And whenever you're stuck: write the base case for \`nullptr\` first — half of tree bugs live there.

In interviews you'll use the standard node shape: \`struct TreeNode { int val; TreeNode *left, *right; }\`. Always ask whether the tree can be empty and whether values can repeat — both change edge cases.`,
      definition: "A binary tree is a hierarchical structure of nodes where each node has at most two children (left and right); a single root has no parent, and every other node has exactly one.",
      syntax: `struct TreeNode {
  int val;
  TreeNode *left, *right;
  TreeNode(int v): val(v), left(nullptr), right(nullptr) {}
};

// DFS skeleton (post-order: children first, then combine)
int dfs(TreeNode* n){
  if(!n) return 0;                 // base case FIRST
  int l = dfs(n->left);
  int r = dfs(n->right);
  return combine(l, r, n->val);
}

// BFS skeleton (level order)
queue<TreeNode*> q; q.push(root);
while(!q.empty()){
  int sz = q.size();               // nodes in THIS level
  for(int i=0;i<sz;i++){
    TreeNode* n=q.front(); q.pop();
    if(n->left)  q.push(n->left);
    if(n->right) q.push(n->right);
  }
}`,
      example: {
        code: `// Height of a tree — the archetypal "trust the recursion" solution
int height(TreeNode* n){
  if(!n) return 0;                       // empty tree has height 0
  int l = height(n->left);               // trust: correct left height
  int r = height(n->right);              // trust: correct right height
  return 1 + max(l, r);                  // combine: me + taller child
}`,
        explanation: "Assume the recursive calls are already correct for the smaller subtrees, then the whole function is just base case + combine — no tracing needed.",
      },
      keyConcepts: ["Pre / in / post-order DFS", "Level-order BFS with a queue", "Base case at nullptr", "“Trust the function” recursion", "Return-value vs global-answer pattern", "O(h) vs O(n) space"],
      interviewNotes: [
        "Interviewers listen for the recursive contract: 'this function returns X for any subtree' — state it before coding.",
        "Diameter-style problems test whether you notice the returned value (height) differs from the tracked answer (diameter).",
        "Expect the follow-up 'what's the space complexity?' — recursion is O(h), and h can be n on a skewed tree.",
        "For level-based outputs, the q.size() snapshot per round is the detail they watch for.",
      ],
      commonMistakes: [
        "Missing or wrong nullptr base case — the single most common tree bug.",
        "Confusing depth of a node with height of the tree (off-by-one definitions; state yours).",
        "Computing diameter as a number of nodes when edges were asked (or vice versa).",
        "Re-calling height() inside a diameter recursion, silently turning O(n) into O(n²).",
        "Pushing null children into the BFS queue and then dereferencing them.",
      ],
      complexity: { best: "O(n) traversal", average: "O(n) traversal", worst: "O(n) traversal", space: "O(h) DFS / O(w) BFS" },
      timeComplexity: "O(n) — every node visited once",
      spaceComplexity: "O(h) recursion (h up to n); BFS up to O(n)",
      intuition: "A family tree: to count generations below an ancestor, ask each child how deep their branch goes and take the deeper answer plus one.",
    },
    questions: [
      {
        id: "tree-q1", title: "Maximum Depth of Binary Tree", difficulty: "Easy",
        statement: "Return the number of nodes on the longest root-to-leaf path of a binary tree.",
        concepts: ["Post-order recursion", "Base case"], hint: "Depth of empty tree is 0; otherwise 1 + the deeper child's depth.",
        timeComplexity: "O(n)", spaceComplexity: "O(h)", similar: ["Minimum Depth of Binary Tree", "Balanced Binary Tree"],
        solution: cpp(`int maxDepth(TreeNode* root){\n  if(!root) return 0;\n  return 1 + max(maxDepth(root->left), maxDepth(root->right));\n}`),
      },
      {
        id: "tree-q2", title: "Invert Binary Tree", difficulty: "Easy",
        statement: "Mirror a binary tree: swap the left and right children of every node.",
        concepts: ["Recursion", "Swap"], hint: "Swap the two children of the current node, then recurse into both.",
        timeComplexity: "O(n)", spaceComplexity: "O(h)", similar: ["Symmetric Tree", "Same Tree"],
        solution: cpp(`TreeNode* invertTree(TreeNode* root){\n  if(!root) return nullptr;\n  swap(root->left, root->right);\n  invertTree(root->left);\n  invertTree(root->right);\n  return root;\n}`),
      },
      {
        id: "tree-q3", title: "Binary Tree Level Order Traversal", difficulty: "Medium",
        statement: "Return the values of a binary tree grouped level by level, top to bottom.",
        concepts: ["BFS", "Queue", "Level snapshot"], hint: "Record q.size() before each round — that's exactly how many nodes belong to the current level.",
        timeComplexity: "O(n)", spaceComplexity: "O(n)", similar: ["Zigzag Level Order", "Average of Levels"],
        solution: cpp(`vector<vector<int>> levelOrder(TreeNode* root){\n  vector<vector<int>> res;\n  if(!root) return res;\n  queue<TreeNode*> q; q.push(root);\n  while(!q.empty()){\n    int sz=q.size();\n    res.push_back({});\n    for(int i=0;i<sz;i++){\n      TreeNode* n=q.front(); q.pop();\n      res.back().push_back(n->val);\n      if(n->left)  q.push(n->left);\n      if(n->right) q.push(n->right);\n    }\n  }\n  return res;\n}`),
      },
      {
        id: "tree-q4", title: "Diameter of Binary Tree", difficulty: "Medium",
        statement: "Return the length in edges of the longest path between any two nodes (the path need not pass through the root).",
        concepts: ["Post-order", "Return height, track answer"], hint: "At each node the candidate diameter is leftHeight + rightHeight — but return the height upward.",
        timeComplexity: "O(n)", spaceComplexity: "O(h)", similar: ["Binary Tree Maximum Path Sum", "Balanced Binary Tree"],
        solution: cpp(`int diameterOfBinaryTree(TreeNode* root){\n  int best=0;\n  function<int(TreeNode*)> h = [&](TreeNode* n)->int{\n    if(!n) return 0;\n    int l=h(n->left), r=h(n->right);\n    best = max(best, l + r);        // path through n, in edges\n    return 1 + max(l, r);           // height, for the parent\n  };\n  h(root);\n  return best;\n}`),
      },
      {
        id: "tree-q5", title: "Lowest Common Ancestor of a Binary Tree", difficulty: "Medium",
        statement: "Given two nodes p and q in a binary tree (no BST ordering), return their lowest common ancestor.",
        concepts: ["Post-order search", "Split point"], hint: "If p and q are found in different subtrees of a node, that node is the answer.",
        timeComplexity: "O(n)", spaceComplexity: "O(h)", similar: ["LCA of a BST", "Distance Between Two Nodes"],
        solution: cpp(`TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q){\n  if(!root || root==p || root==q) return root;\n  TreeNode* l = lowestCommonAncestor(root->left,  p, q);\n  TreeNode* r = lowestCommonAncestor(root->right, p, q);\n  if(l && r) return root;           // p and q split here\n  return l ? l : r;                 // forward whichever side found one\n}`),
      },
      {
        id: "tree-q6", title: "Binary Tree Right Side View", difficulty: "Medium",
        statement: "Return the values visible when the tree is viewed from the right — the last node of every level.",
        concepts: ["BFS", "Per-level last"], hint: "Do a level-order traversal and keep only the final node popped in each level.",
        timeComplexity: "O(n)", spaceComplexity: "O(n)", similar: ["Level Order Traversal", "Left Side View"],
        solution: cpp(`vector<int> rightSideView(TreeNode* root){\n  vector<int> res;\n  if(!root) return res;\n  queue<TreeNode*> q; q.push(root);\n  while(!q.empty()){\n    int sz=q.size();\n    for(int i=0;i<sz;i++){\n      TreeNode* n=q.front(); q.pop();\n      if(i==sz-1) res.push_back(n->val);   // rightmost of this level\n      if(n->left)  q.push(n->left);\n      if(n->right) q.push(n->right);\n    }\n  }\n  return res;\n}`),
      },
      {
        id: "tree-q7", title: "Binary Tree Maximum Path Sum", difficulty: "Hard",
        statement: "Find the maximum sum over all paths in the tree (any node to any node, values may be negative).",
        concepts: ["Post-order", "Clamp negatives", "Gain vs answer"], hint: "A node returns its best single-branch gain (clamped at 0); the answer considers both branches joined at the node.",
        timeComplexity: "O(n)", spaceComplexity: "O(h)", similar: ["Diameter of Binary Tree", "Maximum Subarray"],
        solution: cpp(`int maxPathSum(TreeNode* root){\n  int best=INT_MIN;\n  function<int(TreeNode*)> gain = [&](TreeNode* n)->int{\n    if(!n) return 0;\n    int l = max(0, gain(n->left));   // drop branches that hurt\n    int r = max(0, gain(n->right));\n    best = max(best, n->val + l + r); // path bending at n\n    return n->val + max(l, r);        // straight path for the parent\n  };\n  gain(root);\n  return best;\n}`),
      },
    ],
  },

  // ── Binary Search Tree (p8) ─────────────────────────────────────────────────
  {
    id: "bst", name: "Binary Search Tree", phaseId: "p8",
    blurb: "The ordering invariant: O(h) search/insert, in-order = sorted, and validation with min/max bounds.",
    lesson: {
      objective: "Exploit the BST invariant for O(h) search/insert, correct validation with bounds, and order-statistics via in-order traversal.",
      explanation: `A **binary search tree** is a binary tree with one extra promise at every node: everything in the **left subtree is smaller** than the node, and everything in the **right subtree is larger**. Note the wording — the *entire subtree*, not just the immediate child. That distinction is the source of the classic validation bug, and interviewers set that trap deliberately.

**Why the invariant is powerful: search becomes binary search.** Looking for 40 in a BST rooted at 60? It can't be in the right subtree — everything there exceeds 60. One comparison discards an entire subtree, exactly like one comparison discards half a sorted array. So search, insert, and (with care) delete all run in **O(h)**, where h is the tree's height. On a **balanced** tree h ≈ log n; on a degenerate tree (insert 1,2,3,… in order and every node chains right) h = n and the BST decays into a linked list. Always say "O(h), which is O(log n) *if balanced*" — the qualifier is what interviewers listen for. Self-balancing variants (AVL, red-black — the machinery behind C++ \`std::map\`/\`std::set\`) guarantee the log; you rarely implement them, but you should know they exist and why.

**The golden fact: in-order traversal visits keys in sorted order.** Left subtree (all smaller), node, right subtree (all larger) — recursively, that's ascending order. This one fact unlocks a whole problem family: *k-th smallest element* (run an in-order walk and stop at the k-th visit), *validate a BST* (in-order output must be strictly increasing), *convert BST to sorted list*, *find in-order successor*, *two-sum in a BST*. Whenever a BST problem mentions ranks, order, "k-th", or sortedness, in-order traversal should be your first thought.

**Validation done right.** The tempting-but-wrong check is \`node->left->val < node->val < node->right->val\` at each node. It fails on a tree where a grandchild violates a *grandparent's* constraint (e.g. a 6 hiding in the right subtree of the left child of a 5). The correct approach threads **bounds** down the recursion: the root may be anything in (−∞, +∞); recursing left tightens the upper bound to the node's value, recursing right raises the lower bound. Each node checks itself against *its inherited window*. Use \`long long\` sentinels (or pointers/optionals) so INT_MIN/INT_MAX node values don't break the check. The alternative — in-order walk verifying each visit exceeds the previous — is equally acceptable; offer both.

**Insert and build.** Insertion is search-that-falls-off-the-tree: walk down as if searching, and where you hit null, that's the new leaf. Note insertion order *shapes* the tree — sorted input builds the worst case. To build a *balanced* BST from a **sorted array**, recursively pick the middle element as root; both halves have equal size, so height stays logarithmic. That's Convert Sorted Array to BST, and it doubles as intuition for why balance matters.

**LCA gets easier in a BST.** In a general binary tree, LCA needs a two-sided recursive search. In a BST you just walk from the root: if both targets are smaller, go left; both larger, go right; the first node *between* them (or equal to one) is the LCA. One descending path, O(h), no backtracking — a beautiful example of the invariant simplifying an algorithm.

**Recognition checklist.** "Sorted order / k-th / successor / rank" → in-order. "Is this a valid BST" → bounds (or in-order monotonicity). "Search/insert/delete performance" → O(h) with the balance caveat. "Range queries between lo and hi" → prune whole subtrees using the invariant. And when someone says \`std::set\`, \`std::map\`, or "keep items sorted under inserts" — they're describing a balanced BST.`,
      definition: "A binary search tree is a binary tree in which, for every node, all keys in the left subtree are strictly smaller and all keys in the right subtree are strictly larger — making search, insert, and delete O(h).",
      syntax: `// Search: one comparison discards a whole subtree — O(h)
TreeNode* search(TreeNode* n, int target){
  while(n && n->val != target)
    n = target < n->val ? n->left : n->right;
  return n;                          // node or nullptr
}

// Insert: search until you fall off, attach a leaf there
TreeNode* insert(TreeNode* n, int v){
  if(!n) return new TreeNode(v);
  if(v < n->val) n->left  = insert(n->left,  v);
  else           n->right = insert(n->right, v);
  return n;
}

// In-order traversal — visits keys in ascending order
void inorder(TreeNode* n){
  if(!n) return;
  inorder(n->left);  visit(n);  inorder(n->right);
}`,
      example: {
        code: `// Validate a BST by threading (lo, hi) bounds down the tree
bool valid(TreeNode* n, long long lo, long long hi){
  if(!n) return true;
  if(n->val <= lo || n->val >= hi) return false; // violates inherited window
  return valid(n->left,  lo,      n->val)        // left: values < n->val
      && valid(n->right, n->val,  hi);           // right: values > n->val
}
bool isValidBST(TreeNode* root){
  return valid(root, LLONG_MIN, LLONG_MAX);
}`,
        explanation: "Each node is checked against bounds inherited from *all* ancestors, not just its parent — that's what catches the deep-violation case the naive child-comparison misses.",
      },
      keyConcepts: ["BST invariant (whole subtrees)", "O(h) search & insert", "In-order = sorted order", "Validation with min/max bounds", "Balanced vs degenerate height", "BST-shortcut LCA"],
      interviewNotes: [
        "Say 'O(h), O(log n) if balanced, O(n) worst case' — the balance caveat is precisely what's being tested.",
        "The Validate-BST trap is checking only parent-child pairs; interviewers construct a deep-violation example to catch it.",
        "Kth Smallest probes whether you know in-order = sorted and whether you can stop early instead of collecting all nodes.",
        "Know the follow-up: 'what if insertions come in sorted order?' → degenerate tree; mention self-balancing trees / std::map.",
      ],
      commonMistakes: [
        "Validating with only immediate-child comparisons instead of inherited (lo, hi) bounds.",
        "Using int sentinels INT_MIN/INT_MAX for bounds and failing on trees that contain those exact values.",
        "Forgetting duplicates policy — clarify whether equal keys go left, right, or are disallowed.",
        "Claiming O(log n) search unconditionally, ignoring the skewed-tree worst case.",
        "Traversing the whole tree for kth smallest instead of stopping at the k-th in-order visit.",
      ],
      complexity: { best: "O(log n) balanced", average: "O(log n)", worst: "O(n) degenerate", space: "O(h) recursion" },
      timeComplexity: "Search/insert/delete O(h)",
      spaceComplexity: "O(h) recursion (O(1) iterative search)",
      intuition: "A well-organized library: at every shelf a sign says 'smaller titles left, larger right', so each step halves where the book can hide.",
    },
    questions: [
      {
        id: "bst-q1", title: "Search in a Binary Search Tree", difficulty: "Easy",
        statement: "Given the root of a BST and a value, return the node holding that value, or null if absent.",
        concepts: ["BST invariant", "Iterative descent"], hint: "Compare at each node and step left or right — never both.",
        timeComplexity: "O(h)", spaceComplexity: "O(1)", similar: ["Insert into a BST", "Closest BST Value"],
        solution: cpp(`TreeNode* searchBST(TreeNode* root, int val){\n  while(root && root->val != val)\n    root = val < root->val ? root->left : root->right;\n  return root;\n}`),
      },
      {
        id: "bst-q2", title: "Convert Sorted Array to BST", difficulty: "Easy",
        statement: "Build a height-balanced BST from an ascending sorted array.",
        concepts: ["Middle as root", "Divide & conquer"], hint: "The middle element becomes the root; recurse on the two halves.",
        timeComplexity: "O(n)", spaceComplexity: "O(log n)", similar: ["Convert Sorted List to BST", "Balance a BST"],
        solution: cpp(`TreeNode* build(vector<int>& a, int l, int r){\n  if(l > r) return nullptr;\n  int m = l + (r-l)/2;\n  TreeNode* n = new TreeNode(a[m]);\n  n->left  = build(a, l,   m-1);\n  n->right = build(a, m+1, r);\n  return n;\n}\nTreeNode* sortedArrayToBST(vector<int>& a){\n  return build(a, 0, (int)a.size()-1);\n}`),
      },
      {
        id: "bst-q3", title: "Insert into a Binary Search Tree", difficulty: "Medium",
        statement: "Insert a value into a BST and return the root; the value is guaranteed not to exist in the tree.",
        concepts: ["Search to null", "Leaf attachment"], hint: "Walk down as if searching; the null you fall off at is where the new leaf belongs.",
        timeComplexity: "O(h)", spaceComplexity: "O(h)", similar: ["Delete Node in a BST", "Search in a BST"],
        solution: cpp(`TreeNode* insertIntoBST(TreeNode* root, int val){\n  if(!root) return new TreeNode(val);\n  if(val < root->val) root->left  = insertIntoBST(root->left,  val);\n  else                root->right = insertIntoBST(root->right, val);\n  return root;\n}`),
      },
      {
        id: "bst-q4", title: "Validate Binary Search Tree", difficulty: "Medium",
        statement: "Determine whether a binary tree satisfies the BST property (strict ordering, whole subtrees).",
        concepts: ["Min/max bounds", "Inherited constraints"], hint: "Pass down the window each subtree must fit in; comparing only with the parent is not enough.",
        timeComplexity: "O(n)", spaceComplexity: "O(h)", similar: ["Recover BST", "Kth Smallest in a BST"],
        solution: cpp(`bool valid(TreeNode* n, long long lo, long long hi){\n  if(!n) return true;\n  if(n->val <= lo || n->val >= hi) return false;\n  return valid(n->left, lo, n->val) && valid(n->right, n->val, hi);\n}\nbool isValidBST(TreeNode* root){\n  return valid(root, LLONG_MIN, LLONG_MAX);\n}`),
      },
      {
        id: "bst-q5", title: "Kth Smallest Element in a BST", difficulty: "Medium",
        statement: "Return the k-th smallest value (1-indexed) in a BST.",
        concepts: ["In-order = sorted", "Early stop"], hint: "An in-order traversal visits values ascending — stop at the k-th visit instead of collecting them all.",
        timeComplexity: "O(h + k)", spaceComplexity: "O(h)", similar: ["Inorder Successor in BST", "Validate BST"],
        solution: cpp(`int kthSmallest(TreeNode* root, int k){\n  stack<TreeNode*> st;\n  TreeNode* cur = root;\n  while(cur || !st.empty()){\n    while(cur){ st.push(cur); cur = cur->left; }\n    cur = st.top(); st.pop();\n    if(--k == 0) return cur->val;      // k-th in-order visit\n    cur = cur->right;\n  }\n  return -1;\n}`),
      },
      {
        id: "bst-q6", title: "Lowest Common Ancestor of a BST", difficulty: "Medium",
        statement: "Return the lowest common ancestor of two nodes p and q in a BST.",
        concepts: ["BST invariant", "Single descent"], hint: "Walk from the root: both values smaller → go left; both larger → go right; otherwise you're standing on the answer.",
        timeComplexity: "O(h)", spaceComplexity: "O(1)", similar: ["LCA of a Binary Tree"],
        solution: cpp(`TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q){\n  while(root){\n    if(p->val < root->val && q->val < root->val)      root = root->left;\n    else if(p->val > root->val && q->val > root->val) root = root->right;\n    else return root;                 // split point (or equals one of them)\n  }\n  return nullptr;\n}`),
      },
      {
        id: "bst-q7", title: "Recover Binary Search Tree", difficulty: "Hard",
        statement: "Exactly two nodes of a BST were swapped by mistake; restore the tree without changing its structure.",
        concepts: ["In-order monotonicity", "Inversion detection"], hint: "In-order should be ascending — the two swapped nodes create one or two 'descents'; note both offenders and swap their values.",
        timeComplexity: "O(n)", spaceComplexity: "O(h)", similar: ["Validate BST", "Kth Smallest in a BST"],
        solution: cpp(`void recoverTree(TreeNode* root){\n  TreeNode *first=nullptr, *second=nullptr, *prev=nullptr;\n  function<void(TreeNode*)> inorder = [&](TreeNode* n){\n    if(!n) return;\n    inorder(n->left);\n    if(prev && prev->val > n->val){    // a descent in sorted order\n      if(!first) first = prev;\n      second = n;\n    }\n    prev = n;\n    inorder(n->right);\n  };\n  inorder(root);\n  swap(first->val, second->val);\n}`),
      },
    ],
  },

  // ── Heap / Priority Queue (p8) ──────────────────────────────────────────────
  {
    id: "heap", name: "Heap / Priority Queue", phaseId: "p8",
    blurb: "A complete tree living in an array: O(log n) push/pop of the extreme — the engine behind top-K and k-way merge.",
    lesson: {
      objective: "Understand the array-backed heap, drive C++ priority_queue (max and min), and apply the top-K and k-way-merge patterns.",
      explanation: `A **heap** answers one question repeatedly and fast: *"what's the current largest (or smallest) element?"* It is a **complete binary tree** — every level full except possibly the last, filled left to right — satisfying the **heap property**: each parent ≥ its children (max-heap) or ≤ them (min-heap). Note what it does *not* promise: siblings have no order, and the heap is *not* sorted. Only the root is special.

**The array trick.** Because the tree is complete, it needs no pointers at all: store it level-by-level in an array, and the children of index \`i\` live at \`2i+1\` and \`2i+2\`, its parent at \`(i−1)/2\`. Contiguous memory, zero overhead, cache-friendly — this is why heaps are the standard priority queue implementation, and it's a favorite "how does it actually work?" interview probe.

**The two repair moves.** Every heap operation is one of two fixes. **Push**: append at the end (keeping completeness), then *sift up* — swap with the parent while you beat it. **Pop**: remove the root, move the last element into its place, then *sift down* — swap with the better child while a child beats you. Both walk one root-to-leaf path, so both are **O(log n)**. **Heapify** — building a heap from n arbitrary items — looks like O(n log n) but is actually **O(n)**: sift-down cost depends on a node's height, and the vast majority of nodes sit near the bottom with tiny heights; summing the series gives O(n). Knowing (and being able to sketch) that argument is a genuine differentiator.

**C++ specifics you must have cold.** \`std::priority_queue<int>\` is a **max-heap by default**. For a min-heap: \`priority_queue<int, vector<int>, greater<int>>\`. The API is \`push\`, \`top\`, \`pop\` (void — read \`top()\` first), \`size\`, \`empty\`. For pairs, ordering is lexicographic, so \`{priority, payload}\` pairs work naturally. Custom orders take a comparator — remember C++ comparators mean "goes lower in the heap", so \`a->val > b->val\` yields a *min*-heap. \`make_heap\`/\`push_heap\`/\`pop_heap\` expose the raw algorithms over a vector when you need in-place control.

**Pattern 1 — Top-K.** "Find the k largest / k most frequent / k closest." Keep a heap of size k of the *opposite* polarity: for the k **largest**, use a **min**-heap — its root is the weakest current member, i.e. the bouncer at the door. Stream every element in; whenever size exceeds k, pop. Whatever survives is the answer, in **O(n log k)** time and **O(k)** space — strictly better than sorting (O(n log n)) when k ≪ n, and it works on infinite streams. The polarity inversion (min-heap for largest) trips people up; internalize the bouncer image.

**Pattern 2 — k-way merge.** Merging k sorted lists: the next output element must be one of the k current heads, so keep those k heads in a min-heap. Pop the smallest, output it, push its successor from the same list. Total: **O(N log k)** for N total elements. This is Merge K Sorted Lists, external-sort merging, and "smallest range covering k lists" — one pattern, many costumes.

**Pattern 3 — two heaps.** Find Median from Data Stream: a max-heap holds the smaller half, a min-heap the larger half; keep sizes within one of each other, and the median is a root (or the average of both). Whenever a problem wants a running "middle" or balance point under inserts, think two heaps facing each other.

**Recognition checklist.** "k largest / smallest / most frequent / closest" → size-k heap. "Merge sorted things" → k-way merge. "Repeatedly take the extreme, modify, reinsert" (Last Stone Weight, task schedulers, Dijkstra) → plain heap loop. "Running median" → two heaps. If you need *arbitrary* order statistics or full sorting, a heap alone is the wrong tool — that's the boundary of the pattern.`,
      definition: "A heap is a complete binary tree stored in an array where every parent outranks its children (max-heap ≥, min-heap ≤), giving O(1) access to the extreme and O(log n) insert and extract.",
      syntax: `priority_queue<int> mx;                              // MAX-heap (default)
priority_queue<int, vector<int>, greater<int>> mn;   // MIN-heap
mx.push(5);  int biggest  = mx.top();  mx.pop();
mn.push(5);  int smallest = mn.top();  mn.pop();

// Pairs order lexicographically: {priority, payload}
priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> byFreq;

// Array indexing of the implicit tree
// children of i: 2*i+1, 2*i+2      parent of i: (i-1)/2

// O(n) heapify over an existing vector
vector<int> v = {5,1,9,3};
make_heap(v.begin(), v.end());       // max-heap in place`,
      example: {
        code: `// Top-K pattern: k largest elements in O(n log k)
vector<int> kLargest(vector<int>& a, int k){
  priority_queue<int, vector<int>, greater<int>> door; // MIN-heap = bouncer
  for(int x : a){
    door.push(x);
    if((int)door.size() > k) door.pop();  // evict the weakest member
  }
  vector<int> res;
  while(!door.empty()){ res.push_back(door.top()); door.pop(); }
  return res;                              // ascending order
}`,
        explanation: "The min-heap's root is always the weakest of the current best k — any newcomer only stays by beating it. n pushes/pops on a size-k heap: O(n log k).",
      },
      keyConcepts: ["Complete tree in an array (2i+1 / 2i+2)", "Sift up / sift down", "O(n) heapify", "Max vs min priority_queue", "Top-K with an opposite-polarity heap", "k-way merge"],
      interviewNotes: [
        "'Why min-heap for the k largest?' is the classic probe — the root is the weakest survivor, the eviction candidate.",
        "Expect 'why is heapify O(n) and not O(n log n)?' — most nodes are near the leaves with O(1) sift-down cost.",
        "State O(n log k) vs sorting's O(n log n) and note the heap works on streams — that trade-off is the point of top-K questions.",
        "For Median-from-Stream, they check the rebalancing invariant: sizes differ by at most one, every element in lo ≤ every element in hi.",
      ],
      commonMistakes: [
        "Assuming C++ priority_queue is a min-heap (it's max by default — the opposite of many other languages).",
        "Writing the comparator backwards — `a > b` in the comparator produces a MIN-heap, not a max-heap.",
        "Letting the top-K heap grow to n instead of capping at k, losing the whole complexity win.",
        "Calling top() on an empty heap, or expecting pop() to return the value.",
        "Believing a heap is sorted — only the root is guaranteed; popping everything is how you extract order.",
      ],
      complexity: { best: "O(1) peek", average: "O(log n) push/pop", worst: "O(log n) push/pop; O(n) build", space: "O(n)" },
      timeComplexity: "Push/pop O(log n); build (heapify) O(n); top-K O(n log k)",
      spaceComplexity: "O(n) (O(k) for top-K)",
      intuition: "A championship bracket: the winner sits on top and beats everyone below, but the tournament tells you nothing about who came third versus fourth.",
    },
    questions: [
      {
        id: "heap-q1", title: "Last Stone Weight", difficulty: "Easy",
        statement: "Repeatedly smash the two heaviest stones together (equal → both vanish; else the difference remains) and return the last stone's weight, or 0.",
        concepts: ["Max-heap", "Extract-modify-reinsert"], hint: "A max-heap hands you the two heaviest in O(log n) each round.",
        timeComplexity: "O(n log n)", spaceComplexity: "O(n)", similar: ["Kth Largest Element in a Stream"],
        solution: cpp(`int lastStoneWeight(vector<int>& s){\n  priority_queue<int> pq(s.begin(), s.end());\n  while(pq.size() > 1){\n    int a=pq.top(); pq.pop();\n    int b=pq.top(); pq.pop();\n    if(a > b) pq.push(a - b);\n  }\n  return pq.empty()? 0 : pq.top();\n}`),
      },
      {
        id: "heap-q2", title: "Kth Largest Element in a Stream", difficulty: "Easy",
        statement: "Design a class that, after each new number is added, returns the k-th largest element seen so far.",
        concepts: ["Min-heap of size k", "Streaming"], hint: "Keep only the k largest in a min-heap; its root is exactly the k-th largest.",
        timeComplexity: "O(log k) per add", spaceComplexity: "O(k)", similar: ["Kth Largest Element in an Array", "Top K Frequent Elements"],
        solution: cpp(`class KthLargest {\n  priority_queue<int, vector<int>, greater<int>> pq; // k largest so far\n  int k;\npublic:\n  KthLargest(int k, vector<int>& nums) : k(k){\n    for(int x : nums) add(x);\n  }\n  int add(int v){\n    pq.push(v);\n    if((int)pq.size() > k) pq.pop();\n    return pq.top();                   // root = kth largest\n  }\n};`),
      },
      {
        id: "heap-q3", title: "Kth Largest Element in an Array", difficulty: "Medium",
        statement: "Return the k-th largest element of an unsorted array (not the k-th distinct).",
        concepts: ["Top-K", "Min-heap"], hint: "Stream everything through a size-k min-heap; the survivor at the root is your answer.",
        timeComplexity: "O(n log k)", spaceComplexity: "O(k)", similar: ["Top K Frequent Elements", "Quickselect"],
        solution: cpp(`int findKthLargest(vector<int>& a, int k){\n  priority_queue<int, vector<int>, greater<int>> pq; // min-heap, size k\n  for(int x : a){\n    pq.push(x);\n    if((int)pq.size() > k) pq.pop();\n  }\n  return pq.top();\n}`),
      },
      {
        id: "heap-q4", title: "Top K Frequent Elements", difficulty: "Medium",
        statement: "Return the k most frequently occurring values in an array.",
        concepts: ["Frequency map", "Top-K heap"], hint: "Count with a hash map, then run the size-k min-heap over {frequency, value} pairs.",
        timeComplexity: "O(n log k)", spaceComplexity: "O(n)", similar: ["Kth Largest Element in an Array", "Sort Characters by Frequency"],
        solution: cpp(`vector<int> topKFrequent(vector<int>& a, int k){\n  unordered_map<int,int> cnt;\n  for(int x : a) cnt[x]++;\n  priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq; // {freq,val}\n  for(auto& [v,c] : cnt){\n    pq.push({c, v});\n    if((int)pq.size() > k) pq.pop();\n  }\n  vector<int> res;\n  while(!pq.empty()){ res.push_back(pq.top().second); pq.pop(); }\n  return res;\n}`),
      },
      {
        id: "heap-q5", title: "K Closest Points to Origin", difficulty: "Medium",
        statement: "Given points on a plane, return the k points nearest the origin.",
        concepts: ["Top-K (inverted)", "Max-heap of size k"], hint: "For the k *smallest* distances, the bouncer is a *max*-heap — evict the farthest; skip the sqrt.",
        timeComplexity: "O(n log k)", spaceComplexity: "O(k)", similar: ["Kth Largest Element in an Array"],
        solution: cpp(`vector<vector<int>> kClosest(vector<vector<int>>& pts, int k){\n  auto d = [](vector<int>& p){ return (long long)p[0]*p[0] + (long long)p[1]*p[1]; };\n  priority_queue<pair<long long,int>> pq;   // max-heap: {dist, index}\n  for(int i=0;i<(int)pts.size();i++){\n    pq.push({d(pts[i]), i});\n    if((int)pq.size() > k) pq.pop();        // evict the farthest\n  }\n  vector<vector<int>> res;\n  while(!pq.empty()){ res.push_back(pts[pq.top().second]); pq.pop(); }\n  return res;\n}`),
      },
      {
        id: "heap-q6", title: "Merge K Sorted Lists", difficulty: "Hard",
        statement: "Merge k sorted linked lists into one sorted list.",
        concepts: ["k-way merge", "Min-heap of heads"], hint: "The next output node is always the smallest of the k current heads — keep exactly those in a min-heap.",
        timeComplexity: "O(N log k)", spaceComplexity: "O(k)", similar: ["Merge Two Sorted Lists", "Smallest Range Covering K Lists"],
        solution: cpp(`// ListNode: LeetCode's list node { int val; ListNode* next; }\nListNode* mergeKLists(vector<ListNode*>& lists){\n  auto cmp = [](ListNode* a, ListNode* b){ return a->val > b->val; }; // min-heap\n  priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> pq(cmp);\n  for(ListNode* l : lists) if(l) pq.push(l);\n  ListNode dummy(0), *tail=&dummy;\n  while(!pq.empty()){\n    ListNode* n = pq.top(); pq.pop();\n    tail->next = n; tail = n;\n    if(n->next) pq.push(n->next);      // successor from the same list\n  }\n  return dummy.next;\n}`),
      },
      {
        id: "heap-q7", title: "Find Median from Data Stream", difficulty: "Hard",
        statement: "Design a structure that supports adding numbers and returning the median of all numbers added so far.",
        concepts: ["Two heaps", "Balance invariant"], hint: "A max-heap for the lower half faces a min-heap for the upper half; keep their sizes within one.",
        timeComplexity: "O(log n) add, O(1) median", spaceComplexity: "O(n)", similar: ["Sliding Window Median"],
        solution: cpp(`class MedianFinder {\n  priority_queue<int> lo;                                  // max-heap: lower half\n  priority_queue<int, vector<int>, greater<int>> hi;       // min-heap: upper half\npublic:\n  void addNum(int n){\n    lo.push(n);\n    hi.push(lo.top()); lo.pop();                           // route through, rebalance\n    if(hi.size() > lo.size()){ lo.push(hi.top()); hi.pop(); }\n  }\n  double findMedian(){\n    if(lo.size() > hi.size()) return lo.top();\n    return (lo.top() + hi.top()) / 2.0;\n  }\n};`),
      },
    ],
  },

  // ── Graphs (p9) ─────────────────────────────────────────────────────────────
  {
    id: "graphs", name: "Graphs", phaseId: "p9",
    blurb: "Adjacency lists, the BFS/DFS templates, islands on grids, cycle detection, and why BFS finds shortest paths.",
    lesson: {
      objective: "Represent graphs as adjacency lists, wield the BFS and DFS templates (including on grids), detect cycles, and know when BFS gives shortest paths.",
      explanation: `A **graph** is just *things* (**vertices**) and *relationships* (**edges**) — friendships, road maps, course prerequisites, states of a puzzle. Once you see a problem as a graph, a tiny toolbox of traversals solves it. Most graph interview questions are one of two templates plus a costume.

**Representation.** The default is the **adjacency list**: \`vector<vector<int>> adj(n)\`, where \`adj[u]\` lists u's neighbors. It costs O(V + E) space and lets you iterate a node's neighbors in degree time — perfect for the sparse graphs interviews use. An adjacency *matrix* (O(V²) space, O(1) edge lookup) only wins on dense graphs or tiny V. For undirected graphs, add each edge both ways. Problems rarely hand you an adjacency list — they give edge pairs, prerequisite pairs, or a grid, and building \`adj\` is step one.

**DFS: go deep, backtrack.** Depth-first search follows one path as far as possible, then backs up. Recursively: mark the node visited, recurse into each unvisited neighbor. It's the natural tool for *reachability* ("is there any path?"), *connected components* (loop over all vertices; every time you find an unvisited one, that's a new component — flood it), and *structural* questions. The **visited** set is non-negotiable: graphs have cycles, and without it you recurse forever. That's the key difference from trees, which gave you acyclicity for free.

**BFS: expand in rings.** Breadth-first search uses a **queue** to explore all nodes at distance 1, then distance 2, and so on. This ring-by-ring expansion is exactly why **BFS finds shortest paths in unweighted graphs**: the first time you reach a node, you got there via a minimum number of edges — you cannot reach it later by a shorter route, because shorter routes were exhausted in earlier rings. The moment a problem says *"minimum number of steps/moves/mutations"*, it's a BFS problem, even when nothing looks like a graph (word ladders, lock combinations, knight moves — the states are vertices, the moves are edges). Mark visited **when enqueuing**, not when popping, or you'll enqueue duplicates. Weighted graphs break the ring argument — that's where Dijkstra (a priority-queue BFS) takes over, a topic for later.

**Grids are graphs in disguise.** A matrix cell is a vertex; its 4 neighbors (up/down/left/right) are edges. Number of Islands is literally "count connected components": scan every cell, and each unvisited land cell starts a DFS/BFS *flood fill* that sinks the whole island. A tidy trick: mutate the grid itself (\`'1'\` → \`'0'\`) as your visited marker. **Multi-source BFS** (Rotting Oranges) starts with *all* sources in the queue at time 0 — the rings then represent simultaneous spread, and the number of rings is the total time. Walls-and-gates and "distance to nearest X" problems are the same idea.

**Cycles and ordering.** In a *directed* graph (say, course prerequisites), "can you finish?" means "is there a cycle?" The cleanest tool is **Kahn's algorithm / topological sort**: compute each node's **in-degree** (incoming edge count), enqueue all zero-in-degree nodes, and repeatedly pop one, "removing" its outgoing edges by decrementing neighbors' in-degrees, enqueuing any that hit zero. If you process all V nodes, the pop order is a valid topological order; if you process fewer, the leftovers form a cycle. DFS with three colors (white/gray/black — a gray→gray edge means a cycle) is the equivalent recursive tool; know at least one cold.

**Recognition checklist.** "Connected / reachable / groups" → DFS or BFS components. "Minimum steps, unweighted" → BFS. "Spreads from several places at once" → multi-source BFS. "Order tasks with dependencies / detect deadlock" → topological sort. "Grid of cells with regions" → flood fill. Complexities are uniform: **O(V + E)** time, O(V) auxiliary space — state them without being asked.`,
      definition: "A graph G = (V, E) is a set of vertices connected by edges (directed or undirected, weighted or not); stored as an adjacency list it supports traversal in O(V + E).",
      syntax: `// Build an adjacency list from an edge list (undirected)
int n;                                   // number of vertices
vector<vector<int>> adj(n);
for(auto& e : edges){
  adj[e[0]].push_back(e[1]);
  adj[e[1]].push_back(e[0]);             // omit for a directed graph
}

// DFS template
vector<bool> vis(n, false);
function<void(int)> dfs = [&](int u){
  vis[u] = true;
  for(int v : adj[u]) if(!vis[v]) dfs(v);
};

// BFS template — first arrival = shortest path (unweighted)
queue<int> q;
q.push(src); vis[src] = true;            // mark when ENQUEUING
while(!q.empty()){
  int u = q.front(); q.pop();
  for(int v : adj[u])
    if(!vis[v]){ vis[v] = true; q.push(v); }
}`,
      example: {
        code: `// Connected components — the core traversal pattern
int countComponents(int n, vector<vector<int>>& edges){
  vector<vector<int>> adj(n);
  for(auto& e : edges){
    adj[e[0]].push_back(e[1]);
    adj[e[1]].push_back(e[0]);
  }
  vector<bool> vis(n, false);
  function<void(int)> dfs = [&](int u){
    vis[u] = true;
    for(int v : adj[u]) if(!vis[v]) dfs(v);
  };
  int comps = 0;
  for(int u = 0; u < n; u++)
    if(!vis[u]){ comps++; dfs(u); }      // each unvisited start = new island
  return comps;
}`,
        explanation: "Every vertex the outer loop finds unvisited starts a fresh component; the DFS floods and marks everything reachable from it. Total work O(V + E).",
      },
      keyConcepts: ["Adjacency list (V + E)", "DFS with a visited set", "BFS rings = shortest path (unweighted)", "Connected components / flood fill", "Multi-source BFS", "Topological sort & cycle detection (Kahn's)"],
      interviewNotes: [
        "'Why does BFS give shortest paths?' — because nodes are discovered in non-decreasing distance order; be ready to argue it, and to note it breaks with weights (→ Dijkstra).",
        "Grid problems test whether you translate cells→vertices and 4-neighbors→edges instantly, and whether you avoid revisits.",
        "Course Schedule probes cycle detection: Kahn's counter (processed < V ⇒ cycle) or DFS gray/black coloring — know one crisply.",
        "Always state O(V + E) and mention recursion depth: a long path can overflow the stack, and iterative DFS/BFS is the fix.",
      ],
      commonMistakes: [
        "Forgetting the visited set (infinite loops on cycles) — trees forgive this, graphs don't.",
        "Marking visited when *popping* from the BFS queue instead of when enqueuing, causing duplicate entries and blown complexity.",
        "Adding an undirected edge in only one direction while building the adjacency list.",
        "Starting the traversal from a single vertex and assuming it covers a possibly-disconnected graph.",
        "In multi-source BFS, seeding only one source or counting the time/level off by one.",
      ],
      complexity: { best: "O(V + E)", average: "O(V + E)", worst: "O(V + E)", space: "O(V + E) list + O(V) visited" },
      timeComplexity: "BFS/DFS O(V + E)",
      spaceComplexity: "O(V + E) for the graph, O(V) auxiliary",
      intuition: "Dropping dye into still water: BFS is the ripple spreading ring by ring — whatever the ripple touches first is, by definition, closest.",
    },
    questions: [
      {
        id: "gph-q1", title: "Flood Fill", difficulty: "Easy",
        statement: "Starting from a pixel, recolor it and every 4-directionally connected pixel of the same original color.",
        concepts: ["DFS on a grid", "Base cases"], hint: "Recurse into the four neighbors, stopping at bounds or a different color; guard the no-op case (new color == old).",
        timeComplexity: "O(m·n)", spaceComplexity: "O(m·n) recursion", similar: ["Number of Islands", "Max Area of Island"],
        solution: cpp(`void paint(vector<vector<int>>& img, int r, int c, int from, int to){\n  if(r<0 || c<0 || r>=(int)img.size() || c>=(int)img[0].size()) return;\n  if(img[r][c] != from) return;\n  img[r][c] = to;\n  paint(img,r+1,c,from,to); paint(img,r-1,c,from,to);\n  paint(img,r,c+1,from,to); paint(img,r,c-1,from,to);\n}\nvector<vector<int>> floodFill(vector<vector<int>>& img, int sr, int sc, int color){\n  if(img[sr][sc] != color) paint(img, sr, sc, img[sr][sc], color);\n  return img;\n}`),
      },
      {
        id: "gph-q2", title: "Find if Path Exists in Graph", difficulty: "Easy",
        statement: "Given n vertices and an undirected edge list, determine whether any path connects a source vertex to a destination vertex.",
        concepts: ["Adjacency list", "BFS reachability"], hint: "Build the adjacency list (both directions), then BFS from the source until you meet the destination or run out.",
        timeComplexity: "O(V + E)", spaceComplexity: "O(V + E)", similar: ["Number of Connected Components", "Clone Graph"],
        solution: cpp(`bool validPath(int n, vector<vector<int>>& edges, int src, int dst){\n  vector<vector<int>> adj(n);\n  for(auto& e : edges){\n    adj[e[0]].push_back(e[1]);\n    adj[e[1]].push_back(e[0]);\n  }\n  vector<bool> vis(n,false);\n  queue<int> q; q.push(src); vis[src]=true;\n  while(!q.empty()){\n    int u=q.front(); q.pop();\n    if(u==dst) return true;\n    for(int v : adj[u]) if(!vis[v]){ vis[v]=true; q.push(v); }\n  }\n  return false;\n}`),
      },
      {
        id: "gph-q3", title: "Number of Islands", difficulty: "Medium",
        statement: "Count the islands (4-directionally connected groups of '1's) in a grid of '1' (land) and '0' (water).",
        concepts: ["Connected components", "Flood fill", "Grid as graph"], hint: "Each unvisited land cell you scan starts a new island — sink the whole thing before scanning on.",
        timeComplexity: "O(m·n)", spaceComplexity: "O(m·n) worst-case recursion", similar: ["Max Area of Island", "Number of Connected Components"],
        solution: cpp(`int numIslands(vector<vector<char>>& g){\n  int m=g.size(), n=g[0].size(), cnt=0;\n  function<void(int,int)> sink = [&](int r,int c){\n    if(r<0 || c<0 || r>=m || c>=n || g[r][c]!='1') return;\n    g[r][c]='0';                     // grid doubles as the visited set\n    sink(r+1,c); sink(r-1,c); sink(r,c+1); sink(r,c-1);\n  };\n  for(int r=0;r<m;r++)\n    for(int c=0;c<n;c++)\n      if(g[r][c]=='1'){ cnt++; sink(r,c); }\n  return cnt;\n}`),
      },
      {
        id: "gph-q4", title: "Rotting Oranges", difficulty: "Medium",
        statement: "Every minute, fresh oranges adjacent to rotten ones rot; return the minutes until no fresh orange remains, or -1 if some can never rot.",
        concepts: ["Multi-source BFS", "Levels = time"], hint: "Seed the queue with every rotten orange at minute 0 — each BFS ring is one simultaneous minute of spread.",
        timeComplexity: "O(m·n)", spaceComplexity: "O(m·n)", similar: ["Walls and Gates", "01 Matrix"],
        solution: cpp(`int orangesRotting(vector<vector<int>>& g){\n  int m=g.size(), n=g[0].size(), fresh=0;\n  queue<pair<int,int>> q;\n  for(int r=0;r<m;r++) for(int c=0;c<n;c++){\n    if(g[r][c]==2) q.push({r,c});\n    else if(g[r][c]==1) fresh++;\n  }\n  int mins=0;\n  int dr[]={1,-1,0,0}, dc[]={0,0,1,-1};\n  while(!q.empty() && fresh>0){\n    int sz=q.size(); mins++;\n    for(int i=0;i<sz;i++){\n      auto [r,c]=q.front(); q.pop();\n      for(int d=0;d<4;d++){\n        int nr=r+dr[d], nc=c+dc[d];\n        if(nr<0||nc<0||nr>=m||nc>=n||g[nr][nc]!=1) continue;\n        g[nr][nc]=2; fresh--; q.push({nr,nc});\n      }\n    }\n  }\n  return fresh? -1 : mins;\n}`),
      },
      {
        id: "gph-q5", title: "Course Schedule", difficulty: "Medium",
        statement: "Given numCourses and prerequisite pairs [a, b] meaning b must precede a, determine whether all courses can be finished.",
        concepts: ["Topological sort", "Cycle detection", "Kahn's algorithm"], hint: "Repeatedly take courses with zero remaining prerequisites; if you can't take all of them, a cycle blocks the rest.",
        timeComplexity: "O(V + E)", spaceComplexity: "O(V + E)", similar: ["Course Schedule II", "Alien Dictionary"],
        solution: cpp(`bool canFinish(int n, vector<vector<int>>& pre){\n  vector<vector<int>> adj(n);\n  vector<int> indeg(n,0);\n  for(auto& p : pre){ adj[p[1]].push_back(p[0]); indeg[p[0]]++; }\n  queue<int> q;\n  for(int i=0;i<n;i++) if(indeg[i]==0) q.push(i);\n  int done=0;\n  while(!q.empty()){\n    int u=q.front(); q.pop(); done++;\n    for(int v : adj[u])\n      if(--indeg[v]==0) q.push(v);\n  }\n  return done==n;                    // fewer than n processed => cycle\n}`),
      },
      {
        id: "gph-q6", title: "Clone Graph", difficulty: "Medium",
        statement: "Return a deep copy of a connected undirected graph given a reference to one of its nodes.",
        concepts: ["DFS", "Original → copy map"], hint: "A hash map from original node to its clone is both your visited set and your way to wire up neighbor edges.",
        timeComplexity: "O(V + E)", spaceComplexity: "O(V)", similar: ["Copy List with Random Pointer"],
        solution: cpp(`// Node: LeetCode's { int val; vector<Node*> neighbors; }\nNode* cloneGraph(Node* node){\n  if(!node) return nullptr;\n  unordered_map<Node*, Node*> copy;  // original -> clone (also: visited)\n  function<Node*(Node*)> dfs = [&](Node* n)->Node*{\n    if(copy.count(n)) return copy[n];\n    Node* c = new Node(n->val);\n    copy[n] = c;                     // register BEFORE recursing (cycles!)\n    for(Node* nb : n->neighbors) c->neighbors.push_back(dfs(nb));\n    return c;\n  };\n  return dfs(node);\n}`),
      },
      {
        id: "gph-q7", title: "Word Ladder", difficulty: "Hard",
        statement: "Given beginWord, endWord, and a word list, return the length of the shortest transformation sequence changing one letter at a time (each intermediate word must be in the list), or 0.",
        concepts: ["Implicit graph", "BFS shortest path"], hint: "Words are vertices and one-letter edits are edges — BFS level count is the answer; erase words from the set as you enqueue them.",
        timeComplexity: "O(N · L · 26)", spaceComplexity: "O(N · L)", similar: ["Open the Lock", "Minimum Genetic Mutation"],
        solution: cpp(`int ladderLength(string beginWord, string endWord, vector<string>& wordList){\n  unordered_set<string> dict(wordList.begin(), wordList.end());\n  if(!dict.count(endWord)) return 0;\n  queue<string> q; q.push(beginWord);\n  int steps=1;\n  while(!q.empty()){\n    int sz=q.size();\n    for(int i=0;i<sz;i++){\n      string w=q.front(); q.pop();\n      if(w==endWord) return steps;\n      for(int j=0;j<(int)w.size();j++){\n        char old=w[j];\n        for(char c='a'; c<='z'; c++){\n          w[j]=c;\n          if(dict.count(w)){ dict.erase(w); q.push(w); } // erase = visited\n        }\n        w[j]=old;\n      }\n    }\n    steps++;\n  }\n  return 0;\n}`),
      },
    ],
  },
];
