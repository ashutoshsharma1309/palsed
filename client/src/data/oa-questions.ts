// Curated OA (Online Assessment) question bank.
//
// Each entry has:
//   - full problem statement (LeetCode-style)
//   - examples with input/output/explanation
//   - constraints
//   - target time (so students know if they're slow)
//   - tags + difficulty + topic + companies that ask it
//   - full solution: approach text, working code, complexity, edge cases
//   - LeetCode link for further practice
//
// These are designed to actually teach — much richer than the seeded PYQs which
// are crowd-sourced summaries. The OA Practice mode prefers these when filters
// match, falls back to PYQs otherwise.

export type OACategory = "DSA" | "Aptitude" | "SQL" | "Output" | "Debugging";
export type OAQuestionDifficulty = "Easy" | "Medium" | "Hard";

export interface OAExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface OASolution {
  approach: string;          // Markdown-style explanation
  code: string;              // Working code (most use Python)
  language: "Python" | "JavaScript" | "Java" | "C++";
  timeComplexity: string;
  spaceComplexity: string;
  edgeCases: string[];
  optimizations?: string[];
}

export interface OAQuestion {
  id: string;
  title: string;
  companies: string[];                        // company display names
  companySlug: string;                        // primary company slug (for filter compat)
  round: "OA";
  category: OACategory;
  topic: string;
  difficulty: OAQuestionDifficulty;
  problemStatement: string;
  examples: OAExample[];
  constraints: string[];
  timeAllowedMin: number;
  tags: string[];
  solution: OASolution;
  relatedLeetcode?: { number: number; slug: string; url: string };
  source: "curated";
  yearAdded: number;
}

// Helper that yields a LeetCode URL given the slug.
const lc = (number: number, slug: string) => ({
  number,
  slug,
  url: `https://leetcode.com/problems/${slug}/`,
});

export const OA_QUESTIONS: OAQuestion[] = [
  // ─── EASY ──────────────────────────────────────────────────────────────
  {
    id: "oa-twosum",
    title: "Two Sum",
    companies: ["Google", "Amazon", "Microsoft", "Razorpay", "Flipkart", "Atlassian"],
    companySlug: "google",
    round: "OA",
    category: "DSA",
    topic: "Hashing",
    difficulty: "Easy",
    problemStatement: `Given an array of integers \`nums\` and an integer \`target\`, return the indices of the two numbers such that they add up to \`target\`.

You may assume each input has exactly one solution, and you may not use the same element twice. Return the answer in any order.`,
    examples: [
      { input: "nums = [2, 7, 11, 15], target = 9", output: "[0, 1]", explanation: "nums[0] + nums[1] = 2 + 7 = 9" },
      { input: "nums = [3, 2, 4], target = 6", output: "[1, 2]", explanation: "nums[1] + nums[2] = 2 + 4 = 6" },
      { input: "nums = [3, 3], target = 6", output: "[0, 1]" },
    ],
    constraints: [
      "2 ≤ nums.length ≤ 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "-10⁹ ≤ target ≤ 10⁹",
      "Exactly one valid answer exists",
    ],
    timeAllowedMin: 10,
    tags: ["array", "hash-table", "two-pointer"],
    solution: {
      approach: `**Single-pass hash map.** Walk through the array once. For each number, compute the *complement* (target - current). If we've already seen the complement, we've found our pair — return both indices. Otherwise stash the current number with its index for future lookups.

Why this beats the O(n²) brute force: instead of checking every pair, we use O(1) hash lookup to skip the inner loop.`,
      code: `def twoSum(nums: list[int], target: int) -> list[int]:
    seen = {}                    # value -> index
    for i, n in enumerate(nums):
        complement = target - n
        if complement in seen:
            return [seen[complement], i]
        seen[n] = i
    return []                    # unreachable per problem guarantees`,
      language: "Python",
      timeComplexity: "O(n) — single pass",
      spaceComplexity: "O(n) — hash map can hold up to n entries",
      edgeCases: [
        "Duplicate numbers — the hash stores the latest index, but we check 'in seen' before overwriting",
        "Negative numbers and target — works as-is, no special handling",
        "Smallest array (n=2) — still O(1) extra work",
      ],
      optimizations: [
        "Sort + two-pointer is O(n log n) but loses the original indices — only viable if you can return values not indices",
      ],
    },
    relatedLeetcode: lc(1, "two-sum"),
    source: "curated",
    yearAdded: 2024,
  },
  {
    id: "oa-valid-parens",
    title: "Valid Parentheses",
    companies: ["Microsoft", "Google", "Amazon", "Adobe", "Atlassian", "Razorpay"],
    companySlug: "microsoft",
    round: "OA",
    category: "DSA",
    topic: "Stack",
    difficulty: "Easy",
    problemStatement: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

A string is valid if:
1. Open brackets are closed by the same type of bracket.
2. Open brackets are closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      { input: 's = "()"', output: "true" },
      { input: 's = "()[]{}"', output: "true" },
      { input: 's = "(]"', output: "false", explanation: "Mismatched bracket types" },
      { input: 's = "([)]"', output: "false", explanation: "Closed in wrong order" },
      { input: 's = "{[]}"', output: "true" },
    ],
    constraints: [
      "1 ≤ s.length ≤ 10⁴",
      "s consists of parentheses only: '()[]{}'",
    ],
    timeAllowedMin: 10,
    tags: ["stack", "string"],
    solution: {
      approach: `**Stack of expected closers.** Push the matching closer when you see an opener; pop and compare when you see a closer.

A valid string must end with an empty stack. If at any point the closer doesn't match the top, OR if you see a closer when the stack is empty, return false.`,
      code: `def isValid(s: str) -> bool:
    pairs = {'(': ')', '[': ']', '{': '}'}
    stack = []
    for ch in s:
        if ch in pairs:                  # opener
            stack.append(pairs[ch])
        else:                            # closer
            if not stack or stack.pop() != ch:
                return False
    return not stack                     # must end empty`,
      language: "Python",
      timeComplexity: "O(n) — single pass",
      spaceComplexity: "O(n) — stack grows linearly in worst case '((((...'",
      edgeCases: [
        "Empty string → return True (vacuously valid)",
        "Only closers — first iteration's else branch handles it (stack empty)",
        "Only openers — final 'not stack' catches it",
        "Odd-length string is always invalid (can short-circuit for speed)",
      ],
      optimizations: [
        "Early-return False on odd length: if len(s) % 2: return False — saves ~50% work on negatives",
      ],
    },
    relatedLeetcode: lc(20, "valid-parentheses"),
    source: "curated",
    yearAdded: 2024,
  },
  {
    id: "oa-reverse-linked-list",
    title: "Reverse Linked List",
    companies: ["Amazon", "Microsoft", "Google", "Goldman Sachs", "Adobe", "Flipkart"],
    companySlug: "amazon",
    round: "OA",
    category: "DSA",
    topic: "Linked List",
    difficulty: "Easy",
    problemStatement: `Given the \`head\` of a singly linked list, reverse the list, and return the new head.

A node is defined as:
\`\`\`
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
\`\`\``,
    examples: [
      { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" },
      { input: "head = [1,2]", output: "[2,1]" },
      { input: "head = []", output: "[]", explanation: "Empty list reverses to empty" },
    ],
    constraints: [
      "Number of nodes ≤ 5000",
      "-5000 ≤ Node.val ≤ 5000",
    ],
    timeAllowedMin: 12,
    tags: ["linked-list", "two-pointer"],
    solution: {
      approach: `**Iterative three-pointer rewire.** Walk the list once. At each node, remember the next node (so we don't lose it), point the current node back at the previous node, then advance prev and curr.

The recursive solution is also O(n) time but uses O(n) stack space — iterative is strictly better in production.`,
      code: `def reverseList(head):
    prev, curr = None, head
    while curr:
        nxt = curr.next      # remember next before rewiring
        curr.next = prev     # rewire pointer backwards
        prev = curr          # advance
        curr = nxt
    return prev              # prev is now the new head`,
      language: "Python",
      timeComplexity: "O(n) — touch each node once",
      spaceComplexity: "O(1) — only three pointers",
      edgeCases: [
        "Empty list — loop never executes, returns None correctly",
        "Single node — loop iterates once, returns that node",
        "Cycle in list — would loop forever; problem guarantees no cycle",
      ],
      optimizations: [
        "Recursive variant is elegant but uses stack memory: avoid for very long lists",
      ],
    },
    relatedLeetcode: lc(206, "reverse-linked-list"),
    source: "curated",
    yearAdded: 2024,
  },
  {
    id: "oa-buy-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    companies: ["Amazon", "Goldman Sachs", "Microsoft", "Razorpay", "Stripe"],
    companySlug: "amazon",
    round: "OA",
    category: "DSA",
    topic: "Arrays / Sliding Window",
    difficulty: "Easy",
    problemStatement: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the i-th day.

You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

Return the maximum profit you can achieve. If you cannot achieve any profit, return 0.`,
    examples: [
      { input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy on day 2 (price=1), sell on day 5 (price=6); profit = 6-1 = 5" },
      { input: "prices = [7,6,4,3,1]", output: "0", explanation: "No profitable trade — prices only fall" },
    ],
    constraints: [
      "1 ≤ prices.length ≤ 10⁵",
      "0 ≤ prices[i] ≤ 10⁴",
    ],
    timeAllowedMin: 10,
    tags: ["array", "dp", "greedy", "single-pass"],
    solution: {
      approach: `**Track running minimum + best profit.** Walk left to right. At every day, ask: "If I sold today, what's my profit?" That equals \`today - minSoFar\`. Track both.

This is a textbook DP problem solved in O(1) extra space because the recurrence only depends on the minimum seen so far.`,
      code: `def maxProfit(prices: list[int]) -> int:
    min_price = float('inf')
    best = 0
    for p in prices:
        min_price = min(min_price, p)
        best = max(best, p - min_price)
    return best`,
      language: "Python",
      timeComplexity: "O(n) — single pass",
      spaceComplexity: "O(1) — two scalars",
      edgeCases: [
        "Single day — loop runs once, returns 0 (can't sell without buying first)",
        "All decreasing — best stays 0, correct",
        "All same — profit 0",
      ],
      optimizations: [
        "Loop unroll won't help — already O(n) with constant work per element",
      ],
    },
    relatedLeetcode: lc(121, "best-time-to-buy-and-sell-stock"),
    source: "curated",
    yearAdded: 2024,
  },
  {
    id: "oa-anagram",
    title: "Valid Anagram",
    companies: ["Amazon", "Adobe", "Flipkart", "TCS", "Infosys"],
    companySlug: "amazon",
    round: "OA",
    category: "DSA",
    topic: "Strings / Hashing",
    difficulty: "Easy",
    problemStatement: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.

An anagram is a word formed by rearranging the letters of another word, using all the original letters exactly once.`,
    examples: [
      { input: 's = "anagram", t = "nagaram"', output: "true" },
      { input: 's = "rat", t = "car"', output: "false" },
    ],
    constraints: [
      "1 ≤ s.length, t.length ≤ 5 × 10⁴",
      "s and t consist of lowercase English letters",
    ],
    timeAllowedMin: 8,
    tags: ["string", "hash-table", "sorting"],
    solution: {
      approach: `**Frequency count.** Anagrams have identical letter frequencies. Build a count for one string, decrement for the other; if any count is non-zero at end, not an anagram.

Counter approach is O(n) and beats sort (O(n log n)) for larger inputs.`,
      code: `def isAnagram(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False
    count = {}
    for ch in s:
        count[ch] = count.get(ch, 0) + 1
    for ch in t:
        if ch not in count or count[ch] == 0:
            return False
        count[ch] -= 1
    return True`,
      language: "Python",
      timeComplexity: "O(n) — two passes",
      spaceComplexity: "O(k) — k = unique characters; 26 for lowercase English",
      edgeCases: [
        "Different lengths — fast-fail upfront",
        "Empty strings — vacuously anagrams, returns True",
        "Unicode/non-ASCII — works as-is since dict keys are general",
      ],
      optimizations: [
        "Use collections.Counter for one-liner: return Counter(s) == Counter(t)",
        "Sort-based: return sorted(s) == sorted(t) — simpler but O(n log n)",
      ],
    },
    relatedLeetcode: lc(242, "valid-anagram"),
    source: "curated",
    yearAdded: 2024,
  },
  {
    id: "oa-fizzbuzz",
    title: "FizzBuzz",
    companies: ["TCS", "Infosys", "Wipro", "Cognizant"],
    companySlug: "tcs",
    round: "OA",
    category: "DSA",
    topic: "Math / Strings",
    difficulty: "Easy",
    problemStatement: `Given an integer \`n\`, return a string array \`answer\` (1-indexed) where:

- \`answer[i] == "FizzBuzz"\` if i is divisible by 3 and 5.
- \`answer[i] == "Fizz"\` if i is divisible by 3.
- \`answer[i] == "Buzz"\` if i is divisible by 5.
- \`answer[i] == str(i)\` otherwise.`,
    examples: [
      { input: "n = 3", output: '["1","2","Fizz"]' },
      { input: "n = 5", output: '["1","2","Fizz","4","Buzz"]' },
      { input: "n = 15", output: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]' },
    ],
    constraints: ["1 ≤ n ≤ 10⁴"],
    timeAllowedMin: 5,
    tags: ["math", "string", "warmup"],
    solution: {
      approach: `**Check divisibility by 15 first.** If you check 3 and 5 separately first, you'd double-print "Fizz" then "Buzz". Order matters.

Bonus: concatenation trick avoids the if/elif ladder entirely.`,
      code: `def fizzBuzz(n: int) -> list[str]:
    result = []
    for i in range(1, n + 1):
        s = ""
        if i % 3 == 0:
            s += "Fizz"
        if i % 5 == 0:
            s += "Buzz"
        result.append(s if s else str(i))
    return result`,
      language: "Python",
      timeComplexity: "O(n)",
      spaceComplexity: "O(n) — output array",
      edgeCases: [
        "n = 1 — produces ['1']",
        "Off-by-one: range is 1 to n inclusive, NOT 0 to n",
      ],
      optimizations: [
        "Avoid % operator with a sliding counter — micro-optimization, rarely needed",
      ],
    },
    relatedLeetcode: lc(412, "fizz-buzz"),
    source: "curated",
    yearAdded: 2024,
  },
  {
    id: "oa-palindrome-num",
    title: "Palindrome Number",
    companies: ["Adobe", "Microsoft", "TCS", "Infosys"],
    companySlug: "adobe",
    round: "OA",
    category: "DSA",
    topic: "Math",
    difficulty: "Easy",
    problemStatement: `Given an integer \`x\`, return \`true\` if \`x\` is a palindrome, and \`false\` otherwise.

Could you solve it **without** converting the integer to a string?`,
    examples: [
      { input: "x = 121", output: "true" },
      { input: "x = -121", output: "false", explanation: "From left to right reads -121. From right to left reads 121-. Not a palindrome." },
      { input: "x = 10", output: "false", explanation: "Reads 01 from right to left." },
    ],
    constraints: ["-2³¹ ≤ x ≤ 2³¹ - 1"],
    timeAllowedMin: 10,
    tags: ["math", "two-pointer"],
    solution: {
      approach: `**Reverse half the digits.** Negatives are never palindromes (the '-' has no match). Numbers ending in 0 (except 0 itself) aren't palindromes.

For others: peel off digits from the right into a reversed half. Stop when the reversed half is ≥ the remaining half. Compare them.`,
      code: `def isPalindrome(x: int) -> bool:
    if x < 0 or (x % 10 == 0 and x != 0):
        return False
    reversed_half = 0
    while x > reversed_half:
        reversed_half = reversed_half * 10 + x % 10
        x //= 10
    # If odd digit count, the middle digit doesn't matter; strip it from reversed_half.
    return x == reversed_half or x == reversed_half // 10`,
      language: "Python",
      timeComplexity: "O(log₁₀ n) — half as many digits as full reverse",
      spaceComplexity: "O(1)",
      edgeCases: [
        "0 → palindrome",
        "Negatives → not palindrome",
        "Multiples of 10 (e.g. 10, 100) → not palindrome",
        "Single-digit → palindrome",
      ],
      optimizations: [
        "String-based: str(x) == str(x)[::-1] is much shorter and almost as fast",
      ],
    },
    relatedLeetcode: lc(9, "palindrome-number"),
    source: "curated",
    yearAdded: 2024,
  },
  {
    id: "oa-max-subarray",
    title: "Maximum Subarray Sum (Kadane's)",
    companies: ["Amazon", "Microsoft", "Goldman Sachs", "Razorpay", "Stripe"],
    companySlug: "amazon",
    round: "OA",
    category: "DSA",
    topic: "Dynamic Programming",
    difficulty: "Medium",
    problemStatement: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.

A subarray is a contiguous non-empty sequence of elements.

Follow-up: Can you solve it in O(n)?`,
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "Subarray [4,-1,2,1] has the largest sum 6" },
      { input: "nums = [1]", output: "1" },
      { input: "nums = [5,4,-1,7,8]", output: "23" },
    ],
    constraints: [
      "1 ≤ nums.length ≤ 10⁵",
      "-10⁴ ≤ nums[i] ≤ 10⁴",
    ],
    timeAllowedMin: 12,
    tags: ["array", "dp", "kadane"],
    solution: {
      approach: `**Kadane's Algorithm.** At each index, decide: extend the previous subarray, or start fresh from here?

\`currentMax = max(nums[i], currentMax + nums[i])\`

Track the best ever seen. Brilliant O(1) space because we only care about the immediate previous \`currentMax\`.`,
      code: `def maxSubArray(nums: list[int]) -> int:
    current = best = nums[0]
    for n in nums[1:]:
        current = max(n, current + n)
        best = max(best, current)
    return best`,
      language: "Python",
      timeComplexity: "O(n) — single pass",
      spaceComplexity: "O(1)",
      edgeCases: [
        "All negatives — returns the least-negative single element (not 0)",
        "Single element array",
        "All same value",
      ],
      optimizations: [
        "Divide-and-conquer is O(n log n) — slower but useful when array is on multiple machines",
      ],
    },
    relatedLeetcode: lc(53, "maximum-subarray"),
    source: "curated",
    yearAdded: 2024,
  },

  // ─── MEDIUM ────────────────────────────────────────────────────────────
  {
    id: "oa-longest-no-repeat",
    title: "Longest Substring Without Repeating Characters",
    companies: ["Amazon", "Google", "Microsoft", "Razorpay", "Stripe", "Atlassian"],
    companySlug: "amazon",
    round: "OA",
    category: "DSA",
    topic: "Sliding Window / Hashing",
    difficulty: "Medium",
    problemStatement: `Given a string \`s\`, find the length of the longest substring without duplicate characters.`,
    examples: [
      { input: 's = "abcabcbb"', output: "3", explanation: 'The answer is "abc", length 3' },
      { input: 's = "bbbbb"', output: "1", explanation: 'The answer is "b"' },
      { input: 's = "pwwkew"', output: "3", explanation: 'The answer is "wke" — note "pwke" is a subsequence, not substring' },
    ],
    constraints: [
      "0 ≤ s.length ≤ 5 × 10⁴",
      "s consists of English letters, digits, symbols and spaces",
    ],
    timeAllowedMin: 15,
    tags: ["string", "sliding-window", "hash-table"],
    solution: {
      approach: `**Sliding window with a hashmap.** Maintain a window \`[left, right]\` with no duplicates. Move \`right\` forward. If a duplicate appears, jump \`left\` past the duplicate's last position.

The hashmap stores each character's most recent index. Critical: only move \`left\` forward (don't go back) by taking \`max(left, lastIdx + 1)\`.`,
      code: `def lengthOfLongestSubstring(s: str) -> int:
    last_idx = {}
    left = 0
    best = 0
    for right, ch in enumerate(s):
        if ch in last_idx and last_idx[ch] >= left:
            left = last_idx[ch] + 1
        last_idx[ch] = right
        best = max(best, right - left + 1)
    return best`,
      language: "Python",
      timeComplexity: "O(n) — each char visited at most twice (right + left)",
      spaceComplexity: "O(min(n, k)) — k = charset size (26/128/256)",
      edgeCases: [
        "Empty string → 0",
        "All same character → 1",
        'Repeating pattern like "abcabc" — left pointer jumps multiple times',
      ],
      optimizations: [
        "If ASCII only, use a fixed-size int[128] array instead of a dict for ~2x speedup",
      ],
    },
    relatedLeetcode: lc(3, "longest-substring-without-repeating-characters"),
    source: "curated",
    yearAdded: 2024,
  },
  {
    id: "oa-group-anagrams",
    title: "Group Anagrams",
    companies: ["Amazon", "Microsoft", "Adobe", "Razorpay", "Flipkart"],
    companySlug: "amazon",
    round: "OA",
    category: "DSA",
    topic: "Hashing / Strings",
    difficulty: "Medium",
    problemStatement: `Given an array of strings \`strs\`, group the anagrams together. You can return the answer in any order.`,
    examples: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' },
      { input: 'strs = [""]', output: '[[""]]' },
      { input: 'strs = ["a"]', output: '[["a"]]' },
    ],
    constraints: [
      "1 ≤ strs.length ≤ 10⁴",
      "0 ≤ strs[i].length ≤ 100",
      "strs[i] consists of lowercase English letters",
    ],
    timeAllowedMin: 15,
    tags: ["array", "hash-table", "string", "sorting"],
    solution: {
      approach: `**Use sorted string as a hash key.** Two strings are anagrams iff their sorted character sequences are equal. Group them in a dict keyed by the sorted version.

A faster alternative: use a tuple of character counts (length-26 vector) as the key. Avoids the O(k log k) sort per string.`,
      code: `from collections import defaultdict

def groupAnagrams(strs: list[str]) -> list[list[str]]:
    groups = defaultdict(list)
    for s in strs:
        key = ''.join(sorted(s))   # canonical form
        groups[key].append(s)
    return list(groups.values())`,
      language: "Python",
      timeComplexity: "O(n × k log k) — n strings, sort cost k log k each",
      spaceComplexity: "O(n × k) — store all input strings",
      edgeCases: [
        "Empty string → its own group with key ''",
        "Single string → single group of one",
        "All same string → all in one group",
      ],
      optimizations: [
        "Use tuple(count[26]) as key → O(n × k) total time, no sort overhead",
      ],
    },
    relatedLeetcode: lc(49, "group-anagrams"),
    source: "curated",
    yearAdded: 2024,
  },
  {
    id: "oa-3sum",
    title: "3Sum",
    companies: ["Amazon", "Google", "Microsoft", "Stripe"],
    companySlug: "amazon",
    round: "OA",
    category: "DSA",
    topic: "Arrays / Two Pointers",
    difficulty: "Medium",
    problemStatement: `Given an integer array \`nums\`, return all triplets \`[nums[i], nums[j], nums[k]]\` such that:
- i ≠ j, i ≠ k, j ≠ k
- nums[i] + nums[j] + nums[k] == 0

The solution set must not contain duplicate triplets.`,
    examples: [
      { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" },
      { input: "nums = [0,1,1]", output: "[]" },
      { input: "nums = [0,0,0]", output: "[[0,0,0]]" },
    ],
    constraints: [
      "3 ≤ nums.length ≤ 3000",
      "-10⁵ ≤ nums[i] ≤ 10⁵",
    ],
    timeAllowedMin: 20,
    tags: ["array", "two-pointers", "sorting"],
    solution: {
      approach: `**Sort + two-pointer scan.** Sort the array. Fix each element \`nums[i]\` as the first of the triplet, then run a two-pointer search on the remainder for pairs summing to \`-nums[i]\`.

Duplicate skipping is critical: once you've used a value as a 'first', skip all equal values. Same inside the two-pointer loop.`,
      code: `def threeSum(nums: list[int]) -> list[list[int]]:
    nums.sort()
    n = len(nums)
    result = []
    for i in range(n - 2):
        if nums[i] > 0:                       # impossible to sum to 0 once positive
            break
        if i > 0 and nums[i] == nums[i-1]:    # skip duplicate first
            continue
        left, right = i + 1, n - 1
        target = -nums[i]
        while left < right:
            s = nums[left] + nums[right]
            if s == target:
                result.append([nums[i], nums[left], nums[right]])
                left += 1
                right -= 1
                while left < right and nums[left] == nums[left-1]:
                    left += 1
                while left < right and nums[right] == nums[right+1]:
                    right -= 1
            elif s < target:
                left += 1
            else:
                right -= 1
    return result`,
      language: "Python",
      timeComplexity: "O(n²) — n iterations × O(n) two-pointer scan",
      spaceComplexity: "O(1) excluding output (sort is in-place)",
      edgeCases: [
        "All zeros → [[0,0,0]] once",
        "No valid triplet → return []",
        "Heavy duplicates — skip logic is essential to avoid TLE on adversarial inputs",
      ],
      optimizations: [
        "Hashset-based variant works but is messier with duplicate handling",
      ],
    },
    relatedLeetcode: lc(15, "3sum"),
    source: "curated",
    yearAdded: 2024,
  },
  {
    id: "oa-rotate-array",
    title: "Rotate Array",
    companies: ["Microsoft", "Amazon", "Adobe", "Flipkart"],
    companySlug: "microsoft",
    round: "OA",
    category: "DSA",
    topic: "Arrays",
    difficulty: "Medium",
    problemStatement: `Given an integer array \`nums\`, rotate the array to the right by \`k\` steps, where \`k\` is non-negative.

Can you do it in-place with O(1) extra space?`,
    examples: [
      { input: "nums = [1,2,3,4,5,6,7], k = 3", output: "[5,6,7,1,2,3,4]", explanation: "Rotate right 3 times" },
      { input: "nums = [-1,-100,3,99], k = 2", output: "[3,99,-1,-100]" },
    ],
    constraints: [
      "1 ≤ nums.length ≤ 10⁵",
      "-2³¹ ≤ nums[i] ≤ 2³¹ - 1",
      "0 ≤ k ≤ 10⁵",
    ],
    timeAllowedMin: 12,
    tags: ["array", "math", "two-pointer"],
    solution: {
      approach: `**Triple reverse trick.** Rotating right by k = reverse entire array → reverse first k → reverse remaining n-k.

Always normalize \`k = k % n\` first (in case k > n).`,
      code: `def rotate(nums: list[int], k: int) -> None:
    n = len(nums)
    k = k % n
    def reverse(l: int, r: int):
        while l < r:
            nums[l], nums[r] = nums[r], nums[l]
            l += 1
            r -= 1
    reverse(0, n - 1)
    reverse(0, k - 1)
    reverse(k, n - 1)`,
      language: "Python",
      timeComplexity: "O(n) — three reversals each O(n/2)",
      spaceComplexity: "O(1) — in-place",
      edgeCases: [
        "k > n → mod first",
        "k = 0 → noop, three reverses cancel out (still correct)",
        "Single element → trivially returns",
      ],
      optimizations: [
        "Cyclic replacement uses O(n) work too but is harder to reason about with duplicate cycles",
      ],
    },
    relatedLeetcode: lc(189, "rotate-array"),
    source: "curated",
    yearAdded: 2024,
  },
  {
    id: "oa-product-except-self",
    title: "Product of Array Except Self",
    companies: ["Amazon", "Google", "Microsoft", "Stripe", "Razorpay"],
    companySlug: "amazon",
    round: "OA",
    category: "DSA",
    topic: "Arrays / Prefix Products",
    difficulty: "Medium",
    problemStatement: `Given an integer array \`nums\`, return an array \`answer\` such that \`answer[i]\` is the product of all elements of \`nums\` except \`nums[i]\`.

The product is guaranteed to fit in a 32-bit integer.

You must write an algorithm that runs in O(n) time and **without using the division operation**.`,
    examples: [
      { input: "nums = [1,2,3,4]", output: "[24,12,8,6]" },
      { input: "nums = [-1,1,0,-3,3]", output: "[0,0,9,0,0]" },
    ],
    constraints: [
      "2 ≤ nums.length ≤ 10⁵",
      "-30 ≤ nums[i] ≤ 30",
    ],
    timeAllowedMin: 15,
    tags: ["array", "prefix", "two-pass"],
    solution: {
      approach: `**Two-pass prefix product.** First pass left-to-right: build prefix products into the output array. Second pass right-to-left: multiply by a running 'suffix' accumulator.

This avoids both division (which fails for zero entries) and O(n) extra space.`,
      code: `def productExceptSelf(nums: list[int]) -> list[int]:
    n = len(nums)
    answer = [1] * n
    # left pass: answer[i] = product of nums[0..i-1]
    prefix = 1
    for i in range(n):
        answer[i] = prefix
        prefix *= nums[i]
    # right pass: multiply by product of nums[i+1..n-1]
    suffix = 1
    for i in range(n - 1, -1, -1):
        answer[i] *= suffix
        suffix *= nums[i]
    return answer`,
      language: "Python",
      timeComplexity: "O(n) — two passes",
      spaceComplexity: "O(1) extra (output array doesn't count toward space complexity per problem statement)",
      edgeCases: [
        "Single zero → all other positions get 0 except that index",
        "Two or more zeros → all positions get 0",
        "Negative numbers — works with sign tracking automatically",
      ],
      optimizations: [
        "Division-based (track total product and divide) is O(n) too but fails when zeros are present",
      ],
    },
    relatedLeetcode: lc(238, "product-of-array-except-self"),
    source: "curated",
    yearAdded: 2024,
  },
  {
    id: "oa-coin-change",
    title: "Coin Change",
    companies: ["Amazon", "Microsoft", "Goldman Sachs", "Razorpay"],
    companySlug: "amazon",
    round: "OA",
    category: "DSA",
    topic: "Dynamic Programming",
    difficulty: "Medium",
    problemStatement: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return the fewest number of coins that you need to make up that amount. If that amount cannot be made up by any combination of the coins, return \`-1\`.

You may assume that you have an infinite number of each kind of coin.`,
    examples: [
      { input: "coins = [1,2,5], amount = 11", output: "3", explanation: "11 = 5 + 5 + 1" },
      { input: "coins = [2], amount = 3", output: "-1" },
      { input: "coins = [1], amount = 0", output: "0" },
    ],
    constraints: [
      "1 ≤ coins.length ≤ 12",
      "1 ≤ coins[i] ≤ 2³¹ - 1",
      "0 ≤ amount ≤ 10⁴",
    ],
    timeAllowedMin: 20,
    tags: ["dp", "bfs", "array"],
    solution: {
      approach: `**Bottom-up DP.** Let \`dp[i]\` = min coins to make amount \`i\`. Base: \`dp[0] = 0\`. Recurrence: \`dp[i] = 1 + min(dp[i - coin]) for coin in coins if coin ≤ i\`.

Greedy doesn't work — e.g. coins = [1,3,4], amount = 6: greedy picks 4+1+1 (3 coins), DP finds 3+3 (2 coins).`,
      code: `def coinChange(coins: list[int], amount: int) -> int:
    INF = float('inf')
    dp = [0] + [INF] * amount
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i and dp[i - coin] + 1 < dp[i]:
                dp[i] = dp[i - coin] + 1
    return dp[amount] if dp[amount] != INF else -1`,
      language: "Python",
      timeComplexity: "O(amount × len(coins))",
      spaceComplexity: "O(amount)",
      edgeCases: [
        "amount = 0 → return 0 immediately",
        "No combination possible → return -1 (dp[amount] stays INF)",
        "Single coin denomination — works as expected",
      ],
      optimizations: [
        "BFS-based search is also O(amount × coins) but uses Queue; DP is cleaner",
      ],
    },
    relatedLeetcode: lc(322, "coin-change"),
    source: "curated",
    yearAdded: 2024,
  },
  {
    id: "oa-binary-tree-levelorder",
    title: "Binary Tree Level Order Traversal",
    companies: ["Amazon", "Microsoft", "Google", "Adobe", "Atlassian"],
    companySlug: "amazon",
    round: "OA",
    category: "DSA",
    topic: "Trees / BFS",
    difficulty: "Medium",
    problemStatement: `Given the \`root\` of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).`,
    examples: [
      { input: "root = [3,9,20,null,null,15,7]", output: "[[3],[9,20],[15,7]]" },
      { input: "root = [1]", output: "[[1]]" },
      { input: "root = []", output: "[]" },
    ],
    constraints: [
      "Number of nodes ≤ 2000",
      "-1000 ≤ Node.val ≤ 1000",
    ],
    timeAllowedMin: 15,
    tags: ["tree", "bfs", "queue"],
    solution: {
      approach: `**BFS with level batching.** Use a queue. At each iteration, snapshot the queue size = current level's node count. Drain that many nodes into the current level's output, enqueueing children as you go.`,
      code: `from collections import deque

def levelOrder(root):
    if not root:
        return []
    result = []
    q = deque([root])
    while q:
        level_size = len(q)
        level = []
        for _ in range(level_size):
            node = q.popleft()
            level.append(node.val)
            if node.left: q.append(node.left)
            if node.right: q.append(node.right)
        result.append(level)
    return result`,
      language: "Python",
      timeComplexity: "O(n) — visit each node once",
      spaceComplexity: "O(w) — w = max width of tree",
      edgeCases: [
        "Empty tree → []",
        "Skewed tree (only left/right children) — works, each level has one node",
      ],
      optimizations: [
        "DFS with level tracking also works but is less intuitive for level-by-level output",
      ],
    },
    relatedLeetcode: lc(102, "binary-tree-level-order-traversal"),
    source: "curated",
    yearAdded: 2024,
  },
  {
    id: "oa-lcs",
    title: "Longest Common Subsequence",
    companies: ["Amazon", "Microsoft", "Goldman Sachs"],
    companySlug: "amazon",
    round: "OA",
    category: "DSA",
    topic: "Dynamic Programming",
    difficulty: "Medium",
    problemStatement: `Given two strings \`text1\` and \`text2\`, return the length of their longest common subsequence. If there is no common subsequence, return 0.

A subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order.`,
    examples: [
      { input: 'text1 = "abcde", text2 = "ace"', output: "3", explanation: 'The longest common subsequence is "ace"' },
      { input: 'text1 = "abc", text2 = "abc"', output: "3" },
      { input: 'text1 = "abc", text2 = "def"', output: "0" },
    ],
    constraints: [
      "1 ≤ text1.length, text2.length ≤ 1000",
      "text1 and text2 consist of only lowercase English characters",
    ],
    timeAllowedMin: 20,
    tags: ["dp", "string", "2d-dp"],
    solution: {
      approach: `**2D bottom-up DP.** \`dp[i][j]\` = LCS length of text1[0..i-1] and text2[0..j-1].

Recurrence:
- If chars match: dp[i][j] = dp[i-1][j-1] + 1
- Otherwise: dp[i][j] = max(dp[i-1][j], dp[i][j-1])`,
      code: `def longestCommonSubsequence(text1: str, text2: str) -> int:
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]`,
      language: "Python",
      timeComplexity: "O(m × n)",
      spaceComplexity: "O(m × n) — can be reduced to O(min(m, n)) with rolling rows",
      edgeCases: [
        "Empty string → LCS is 0",
        "Identical strings → LCS = full length",
        "Disjoint character sets → LCS = 0",
      ],
      optimizations: [
        "Rolling 1D array: only need previous row → O(min(m, n)) space",
        "Hirschberg's algorithm gives the LCS in O(m × n) time and O(min(m, n)) space",
      ],
    },
    relatedLeetcode: lc(1143, "longest-common-subsequence"),
    source: "curated",
    yearAdded: 2024,
  },
  {
    id: "oa-search-rotated",
    title: "Search in Rotated Sorted Array",
    companies: ["Amazon", "Microsoft", "Goldman Sachs", "Stripe"],
    companySlug: "amazon",
    round: "OA",
    category: "DSA",
    topic: "Binary Search",
    difficulty: "Medium",
    problemStatement: `There is an integer array \`nums\` sorted in ascending order (with distinct values).

Prior to being passed to your function, \`nums\` is rotated at an unknown pivot index k (e.g. [0,1,2,4,5,6,7] might become [4,5,6,7,0,1,2]).

Given a target, return its index. If not found, return -1.

You must write an algorithm with O(log n) runtime complexity.`,
    examples: [
      { input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4" },
      { input: "nums = [4,5,6,7,0,1,2], target = 3", output: "-1" },
      { input: "nums = [1], target = 0", output: "-1" },
    ],
    constraints: [
      "1 ≤ nums.length ≤ 5000",
      "-10⁴ ≤ nums[i] ≤ 10⁴",
      "All values are unique",
    ],
    timeAllowedMin: 20,
    tags: ["binary-search", "array"],
    solution: {
      approach: `**Modified binary search.** At each midpoint, ONE half is always normally sorted. Check which half contains the target.

If left half is sorted (nums[lo] ≤ nums[mid]): check if target is in [nums[lo], nums[mid]). If yes, search left; else right. Mirror logic for sorted right half.`,
      code: `def search(nums: list[int], target: int) -> int:
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[lo] <= nums[mid]:          # left half sorted
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:                              # right half sorted
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1`,
      language: "Python",
      timeComplexity: "O(log n)",
      spaceComplexity: "O(1)",
      edgeCases: [
        "Array not rotated (sorted) — still works since 'left half sorted' branch always hits",
        "Single element",
        "Target at extreme ends — left/right boundary inclusion matters (< vs ≤)",
      ],
      optimizations: [
        "First find pivot via binary search (O(log n)), then binary search the right half — same complexity, more steps",
      ],
    },
    relatedLeetcode: lc(33, "search-in-rotated-sorted-array"),
    source: "curated",
    yearAdded: 2024,
  },
  {
    id: "oa-merge-intervals",
    title: "Merge Intervals",
    companies: ["Amazon", "Google", "Microsoft", "Razorpay", "Stripe"],
    companySlug: "amazon",
    round: "OA",
    category: "DSA",
    topic: "Sorting / Arrays",
    difficulty: "Medium",
    problemStatement: `Given an array of intervals where \`intervals[i] = [start_i, end_i]\`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.`,
    examples: [
      { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]" },
      { input: "intervals = [[1,4],[4,5]]", output: "[[1,5]]", explanation: "Intervals [1,4] and [4,5] are considered overlapping." },
    ],
    constraints: [
      "1 ≤ intervals.length ≤ 10⁴",
      "intervals[i].length == 2",
      "0 ≤ start_i ≤ end_i ≤ 10⁴",
    ],
    timeAllowedMin: 15,
    tags: ["array", "sorting", "intervals"],
    solution: {
      approach: `**Sort then walk.** Sort intervals by start. Walk through; if the current interval's start ≤ the last merged end, extend the last merged end; otherwise push the new interval as-is.`,
      code: `def merge(intervals: list[list[int]]) -> list[list[int]]:
    intervals.sort(key=lambda x: x[0])
    merged = []
    for interval in intervals:
        if merged and interval[0] <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], interval[1])
        else:
            merged.append(interval)
    return merged`,
      language: "Python",
      timeComplexity: "O(n log n) — dominated by sort",
      spaceComplexity: "O(n) for output (sort can be in-place)",
      edgeCases: [
        "Single interval → return as-is",
        "All intervals identical → merge to one",
        "Touching endpoints [1,4][4,5] → considered overlapping",
      ],
      optimizations: [
        "Already-sorted input → skip sort, O(n) total",
      ],
    },
    relatedLeetcode: lc(56, "merge-intervals"),
    source: "curated",
    yearAdded: 2024,
  },
  {
    id: "oa-num-islands",
    title: "Number of Islands",
    companies: ["Amazon", "Google", "Microsoft", "Adobe", "Razorpay"],
    companySlug: "amazon",
    round: "OA",
    category: "DSA",
    topic: "Graphs / DFS-BFS",
    difficulty: "Medium",
    problemStatement: `Given an m×n 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return the number of islands.

An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are surrounded by water.`,
    examples: [
      { input: 'grid = [\n  ["1","1","1","1","0"],\n  ["1","1","0","1","0"],\n  ["1","1","0","0","0"],\n  ["0","0","0","0","0"]\n]', output: "1" },
      { input: 'grid = [\n  ["1","1","0","0","0"],\n  ["1","1","0","0","0"],\n  ["0","0","1","0","0"],\n  ["0","0","0","1","1"]\n]', output: "3" },
    ],
    constraints: [
      "m == grid.length",
      "n == grid[i].length",
      "1 ≤ m, n ≤ 300",
      "grid[i][j] is '0' or '1'",
    ],
    timeAllowedMin: 20,
    tags: ["graph", "dfs", "bfs", "grid"],
    solution: {
      approach: `**DFS to flood-fill each island.** Scan the grid. When you hit unvisited land ('1'), increment the counter and DFS-sink the entire island by turning all connected '1's to '0' (or use a separate visited matrix).`,
      code: `def numIslands(grid: list[list[str]]) -> int:
    if not grid:
        return 0
    m, n = len(grid), len(grid[0])
    count = 0

    def dfs(r: int, c: int):
        if r < 0 or r >= m or c < 0 or c >= n or grid[r][c] != '1':
            return
        grid[r][c] = '0'  # sink
        dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1)

    for r in range(m):
        for c in range(n):
            if grid[r][c] == '1':
                count += 1
                dfs(r, c)
    return count`,
      language: "Python",
      timeComplexity: "O(m × n) — each cell visited a constant number of times",
      spaceComplexity: "O(m × n) recursion depth in worst case (huge filled island)",
      edgeCases: [
        "All water → 0",
        "All land → 1",
        "Single diagonal touching cells — NOT connected (diagonal isn't adjacent)",
      ],
      optimizations: [
        "Iterative BFS with deque — avoids recursion stack overflow on huge inputs",
        "Union-Find: union land neighbors, count parents",
      ],
    },
    relatedLeetcode: lc(200, "number-of-islands"),
    source: "curated",
    yearAdded: 2024,
  },
  {
    id: "oa-clone-graph",
    title: "Clone Graph",
    companies: ["Razorpay", "Atlassian", "Amazon", "Stripe"],
    companySlug: "razorpay",
    round: "OA",
    category: "DSA",
    topic: "Graphs / DFS-BFS",
    difficulty: "Medium",
    problemStatement: `Given a reference of a node in a connected undirected graph, return a **deep copy** (clone) of the graph.

Each node in the graph contains a value (int) and a list of its neighbors.

\`\`\`
class Node {
    public int val;
    public List<Node> neighbors;
}
\`\`\``,
    examples: [
      { input: "adjList = [[2,4],[1,3],[2,4],[1,3]]", output: "[[2,4],[1,3],[2,4],[1,3]]", explanation: "4 nodes, each connected to 2 others. Clone returns identical adjacency." },
      { input: "adjList = []", output: "[]", explanation: "Empty graph" },
    ],
    constraints: [
      "Number of nodes ≤ 100",
      "1 ≤ Node.val ≤ 100",
      "There are no self-loops or repeated edges",
    ],
    timeAllowedMin: 20,
    tags: ["graph", "dfs", "bfs", "hash-table"],
    solution: {
      approach: `**DFS with hashmap.** Maintain a dict \`{original_node: cloned_node}\`. Recurse; for each neighbor, clone it if not seen, then attach.

This avoids infinite recursion in cycles.`,
      code: `def cloneGraph(node):
    if not node:
        return None
    seen = {}

    def dfs(n):
        if n in seen:
            return seen[n]
        copy = Node(n.val)
        seen[n] = copy
        for nb in n.neighbors:
            copy.neighbors.append(dfs(nb))
        return copy

    return dfs(node)`,
      language: "Python",
      timeComplexity: "O(V + E)",
      spaceComplexity: "O(V) — hashmap + recursion depth",
      edgeCases: [
        "Null input → return None",
        "Single node with no neighbors",
        "Cycle in graph — dict short-circuits revisits",
      ],
      optimizations: [
        "Iterative BFS variant — same complexity but no recursion stack risk",
      ],
    },
    relatedLeetcode: lc(133, "clone-graph"),
    source: "curated",
    yearAdded: 2024,
  },
  {
    id: "oa-permutations",
    title: "Permutations",
    companies: ["Microsoft", "Adobe", "Amazon", "Atlassian"],
    companySlug: "microsoft",
    round: "OA",
    category: "DSA",
    topic: "Backtracking",
    difficulty: "Medium",
    problemStatement: `Given an array \`nums\` of distinct integers, return all the possible permutations. You can return the answer in any order.`,
    examples: [
      { input: "nums = [1,2,3]", output: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]" },
      { input: "nums = [0,1]", output: "[[0,1],[1,0]]" },
      { input: "nums = [1]", output: "[[1]]" },
    ],
    constraints: [
      "1 ≤ nums.length ≤ 6",
      "-10 ≤ nums[i] ≤ 10",
      "All integers are unique",
    ],
    timeAllowedMin: 15,
    tags: ["backtracking", "array"],
    solution: {
      approach: `**Backtracking.** Maintain a current permutation and a 'used' set. At each step, pick any unused element, append it, recurse, then pop and mark unused.

Base case: current permutation has length n.`,
      code: `def permute(nums: list[int]) -> list[list[int]]:
    result = []
    n = len(nums)
    used = [False] * n
    current = []

    def backtrack():
        if len(current) == n:
            result.append(current[:])
            return
        for i in range(n):
            if not used[i]:
                used[i] = True
                current.append(nums[i])
                backtrack()
                current.pop()
                used[i] = False

    backtrack()
    return result`,
      language: "Python",
      timeComplexity: "O(n! × n) — n! permutations, each of length n",
      spaceComplexity: "O(n) recursion depth (excluding output)",
      edgeCases: [
        "Single element → [[that element]]",
        "n = 0 → [[]] (one empty permutation)",
      ],
      optimizations: [
        "In-place swap variant uses O(1) auxiliary space (no 'used' array)",
        "itertools.permutations(nums) is built-in but defeats the practice",
      ],
    },
    relatedLeetcode: lc(46, "permutations"),
    source: "curated",
    yearAdded: 2024,
  },

  // ─── HARD ──────────────────────────────────────────────────────────────
  {
    id: "oa-lru-cache",
    title: "LRU Cache",
    companies: ["Razorpay", "Amazon", "Google", "Microsoft", "Stripe", "Atlassian"],
    companySlug: "razorpay",
    round: "OA",
    category: "DSA",
    topic: "Design / Hashing / Linked List",
    difficulty: "Hard",
    problemStatement: `Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.

Implement the \`LRUCache\` class:
- \`LRUCache(int capacity)\` — initialize with positive size.
- \`int get(int key)\` — return the value if the key exists, else \`-1\`.
- \`void put(int key, int value)\` — update or insert. If the cache exceeds its capacity, evict the least recently used key.

Both \`get\` and \`put\` must run in **O(1) average time**.`,
    examples: [
      {
        input: '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]',
        output: "[null, null, null, 1, null, -1, null, -1, 3, 4]",
        explanation: "Capacity 2. After putting 3, key 2 is evicted. After putting 4, key 1 is evicted.",
      },
    ],
    constraints: [
      "1 ≤ capacity ≤ 3000",
      "0 ≤ key ≤ 10⁴",
      "0 ≤ value ≤ 10⁵",
      "At most 2 × 10⁵ calls",
    ],
    timeAllowedMin: 30,
    tags: ["hash-table", "doubly-linked-list", "design"],
    solution: {
      approach: `**Hashmap + Doubly Linked List.** The hashmap gives O(1) lookup. The doubly linked list gives O(1) reorder and eviction.

Maintain head + tail sentinels. On get/put, move the node to head (most recent). When full, evict the node before tail.

Python's OrderedDict provides this primitive for free; the interview gold standard is to implement it yourself.`,
      code: `class Node:
    __slots__ = ('key', 'val', 'prev', 'next')
    def __init__(self, key=0, val=0):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache: dict[int, Node] = {}
        # Sentinels avoid null checks
        self.head = Node()
        self.tail = Node()
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, n: Node) -> None:
        n.prev.next = n.next
        n.next.prev = n.prev

    def _add_to_head(self, n: Node) -> None:
        n.prev = self.head
        n.next = self.head.next
        self.head.next.prev = n
        self.head.next = n

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        n = self.cache[key]
        self._remove(n)
        self._add_to_head(n)
        return n.val

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            n = self.cache[key]
            n.val = value
            self._remove(n)
            self._add_to_head(n)
        else:
            if len(self.cache) == self.cap:
                lru = self.tail.prev
                self._remove(lru)
                del self.cache[lru.key]
            new_node = Node(key, value)
            self.cache[key] = new_node
            self._add_to_head(new_node)`,
      language: "Python",
      timeComplexity: "O(1) per get and put",
      spaceComplexity: "O(capacity)",
      edgeCases: [
        "Get on non-existent key → -1",
        "Put same key twice → updates value, doesn't change capacity",
        "Capacity 1 → every put evicts",
      ],
      optimizations: [
        "Python: from collections import OrderedDict; one-liner with move_to_end + popitem(last=False)",
      ],
    },
    relatedLeetcode: lc(146, "lru-cache"),
    source: "curated",
    yearAdded: 2024,
  },
  {
    id: "oa-median-sorted",
    title: "Median of Two Sorted Arrays",
    companies: ["Google", "Microsoft", "Amazon", "Stripe"],
    companySlug: "google",
    round: "OA",
    category: "DSA",
    topic: "Binary Search",
    difficulty: "Hard",
    problemStatement: `Given two sorted arrays \`nums1\` and \`nums2\` of size \`m\` and \`n\` respectively, return the median of the two sorted arrays.

The overall run time complexity should be **O(log(min(m, n)))**.`,
    examples: [
      { input: "nums1 = [1,3], nums2 = [2]", output: "2.00000", explanation: "Merged = [1,2,3], median = 2" },
      { input: "nums1 = [1,2], nums2 = [3,4]", output: "2.50000", explanation: "Merged = [1,2,3,4], median = (2+3)/2 = 2.5" },
    ],
    constraints: [
      "nums1.length == m, nums2.length == n",
      "0 ≤ m ≤ 1000, 0 ≤ n ≤ 1000",
      "1 ≤ m + n ≤ 2000",
      "-10⁶ ≤ nums1[i], nums2[i] ≤ 10⁶",
    ],
    timeAllowedMin: 30,
    tags: ["binary-search", "divide-and-conquer", "array"],
    solution: {
      approach: `**Binary search on the smaller array's partition.** Partition both arrays so that left halves combined = right halves combined (or off by one). Binary search the partition point on the smaller array; derive the other partition from totals.

The median is then the max of left halves' last elements, or the average of that and the min of right halves' first elements.`,
      code: `def findMedianSortedArrays(nums1: list[int], nums2: list[int]) -> float:
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1
    m, n = len(nums1), len(nums2)
    half = (m + n + 1) // 2
    lo, hi = 0, m
    while lo <= hi:
        i = (lo + hi) // 2
        j = half - i
        left1  = nums1[i - 1] if i > 0 else float('-inf')
        right1 = nums1[i]     if i < m else float('inf')
        left2  = nums2[j - 1] if j > 0 else float('-inf')
        right2 = nums2[j]     if j < n else float('inf')
        if left1 <= right2 and left2 <= right1:
            if (m + n) % 2:
                return float(max(left1, left2))
            return (max(left1, left2) + min(right1, right2)) / 2.0
        elif left1 > right2:
            hi = i - 1
        else:
            lo = i + 1`,
      language: "Python",
      timeComplexity: "O(log(min(m, n)))",
      spaceComplexity: "O(1)",
      edgeCases: [
        "One array empty → median of the other",
        "All elements of one array smaller than the other — boundary -inf/+inf handles this",
        "Odd vs even total length — separate branches",
      ],
      optimizations: [
        "Merge-based O(m+n) is much simpler and often fast enough for OA constraints",
      ],
    },
    relatedLeetcode: lc(4, "median-of-two-sorted-arrays"),
    source: "curated",
    yearAdded: 2024,
  },
  {
    id: "oa-trap-rain",
    title: "Trapping Rain Water",
    companies: ["Google", "Amazon", "Microsoft", "Goldman Sachs"],
    companySlug: "google",
    round: "OA",
    category: "DSA",
    topic: "Two Pointers / DP",
    difficulty: "Hard",
    problemStatement: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.`,
    examples: [
      { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6", explanation: "The elevation map traps 6 units of water." },
      { input: "height = [4,2,0,3,2,5]", output: "9" },
    ],
    constraints: [
      "n == height.length",
      "1 ≤ n ≤ 2 × 10⁴",
      "0 ≤ height[i] ≤ 10⁵",
    ],
    timeAllowedMin: 25,
    tags: ["array", "two-pointer", "dp", "stack"],
    solution: {
      approach: `**Two-pointer with running max.** Water at position i depends on the SHORTER of: max height to the left of i, max height to the right of i.

Walk both ends inward. At each step, move the pointer with the smaller height (because the other side's max is the limiting factor on its side).`,
      code: `def trap(height: list[int]) -> int:
    left, right = 0, len(height) - 1
    left_max = right_max = 0
    water = 0
    while left < right:
        if height[left] < height[right]:
            if height[left] >= left_max:
                left_max = height[left]
            else:
                water += left_max - height[left]
            left += 1
        else:
            if height[right] >= right_max:
                right_max = height[right]
            else:
                water += right_max - height[right]
            right -= 1
    return water`,
      language: "Python",
      timeComplexity: "O(n) — single two-pointer pass",
      spaceComplexity: "O(1)",
      edgeCases: [
        "Monotonically increasing/decreasing → 0 water trapped",
        "Flat array → 0 water",
        "Single bar → 0",
      ],
      optimizations: [
        "Precompute left_max[] and right_max[] arrays → O(n) time, O(n) space",
        "Stack-based: O(n) time, O(n) space — useful when you also need the trapped-region intervals",
      ],
    },
    relatedLeetcode: lc(42, "trapping-rain-water"),
    source: "curated",
    yearAdded: 2024,
  },
  {
    id: "oa-word-ladder",
    title: "Word Ladder",
    companies: ["Amazon", "Google", "Microsoft"],
    companySlug: "amazon",
    round: "OA",
    category: "DSA",
    topic: "Graphs / BFS",
    difficulty: "Hard",
    problemStatement: `A transformation sequence from word \`beginWord\` to word \`endWord\` using a dictionary \`wordList\` is a sequence \`beginWord -> s₁ -> s₂ -> ... -> sₖ = endWord\` such that:
- Every adjacent pair of words differs by a single letter.
- Every \`sᵢ\` for 1 ≤ i ≤ k is in \`wordList\`. \`beginWord\` does not need to be.

Return the **number of words** in the shortest transformation sequence, or \`0\` if no such sequence exists.`,
    examples: [
      { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]', output: "5", explanation: 'One sequence: "hit" -> "hot" -> "dot" -> "dog" -> "cog"' },
      { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]', output: "0", explanation: "endWord not in wordList" },
    ],
    constraints: [
      "1 ≤ beginWord.length ≤ 10",
      "All words consist of lowercase English letters",
      "1 ≤ wordList.length ≤ 5000",
    ],
    timeAllowedMin: 30,
    tags: ["bfs", "graph", "string"],
    solution: {
      approach: `**BFS with pattern map.** Build a map from generic patterns (e.g. "h*t" → ["hot", "hit"]) to words. Then BFS from beginWord, querying neighbors via the patterns instead of comparing every word pair.

This avoids the O(W²L) word-pair comparison.`,
      code: `from collections import defaultdict, deque

def ladderLength(beginWord: str, endWord: str, wordList: list[str]) -> int:
    if endWord not in wordList:
        return 0
    L = len(beginWord)
    patterns = defaultdict(list)
    for w in wordList:
        for i in range(L):
            patterns[w[:i] + '*' + w[i+1:]].append(w)

    q = deque([(beginWord, 1)])
    visited = {beginWord}
    while q:
        word, steps = q.popleft()
        if word == endWord:
            return steps
        for i in range(L):
            pattern = word[:i] + '*' + word[i+1:]
            for nb in patterns[pattern]:
                if nb not in visited:
                    visited.add(nb)
                    q.append((nb, steps + 1))
            patterns[pattern] = []   # mark pattern as exhausted
    return 0`,
      language: "Python",
      timeComplexity: "O(W × L²) where W = words, L = length per word",
      spaceComplexity: "O(W × L) — pattern map",
      edgeCases: [
        "endWord not in wordList → 0",
        "beginWord == endWord → 1 (problem might or might not allow this; per the spec, sequence must have endWord)",
        "Disconnected words → 0",
      ],
      optimizations: [
        "Bidirectional BFS from both ends → typically ~2x faster",
      ],
    },
    relatedLeetcode: lc(127, "word-ladder"),
    source: "curated",
    yearAdded: 2024,
  },
];

// Convenience exports for filters.
export const OA_TOPICS = Array.from(new Set(OA_QUESTIONS.map((q) => q.topic))).sort();
export const OA_COMPANIES = Array.from(new Set(OA_QUESTIONS.map((q) => q.companySlug))).sort();
