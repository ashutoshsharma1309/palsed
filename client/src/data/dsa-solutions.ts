// In-platform DSA solutions. Content is shown directly in the website — users
// never leave to read solutions. `githubRaw` is an optional source: when no
// inline `code` is present, the Solution panel fetches and displays that raw
// file's contents in-place (raw.githubusercontent.com sends permissive CORS).

export interface DSASolution {
  approach: string; // markdown explanation
  code?: string; // inline sample solution
  language?: string; // for the fenced code block (default: python)
  time: string; // time complexity, e.g. "O(n)"
  space: string; // space complexity
  notes?: string; // markdown — "Important Notes"
  githubRaw?: string; // optional raw GitHub URL fetched on demand if no inline code
}

export const SOLUTIONS: Record<string, DSASolution> = {
  "two-sum": {
    approach:
      "Use a hash map of `value → index`. For each number `x` at index `i`, check whether the complement `target − x` already exists in the map. If it does, you found the pair; otherwise store `x`. One pass is enough.",
    language: "python",
    code: `def twoSum(nums, target):
    seen = {}
    for i, x in enumerate(nums):
        if target - x in seen:
            return [seen[target - x], i]
        seen[x] = i`,
    time: "O(n)",
    space: "O(n)",
    notes: "The brute-force double loop is O(n²). The hash map trades space for time to get a single pass.",
  },
  "contains-duplicate": {
    approach: "Insert elements into a set as you scan. If a value is already present, there's a duplicate. Comparing `len(set) != len(nums)` works too.",
    language: "python",
    code: `def containsDuplicate(nums):
    seen = set()
    for x in nums:
        if x in seen:
            return True
        seen.add(x)
    return False`,
    time: "O(n)",
    space: "O(n)",
  },
  "valid-anagram": {
    approach: "Two strings are anagrams iff they have identical character counts. Count characters of `s`, decrement for `t`, and verify all counts are zero. (Or simply compare sorted strings for O(n log n).)",
    language: "python",
    code: `from collections import Counter

def isAnagram(s, t):
    return Counter(s) == Counter(t)`,
    time: "O(n)",
    space: "O(1)",
    notes: "O(1) space because the alphabet is fixed-size (26 lowercase letters).",
  },
  "group-anagrams": {
    approach: "Anagrams share the same sorted form (or the same character-count signature). Group strings into a dictionary keyed by that signature.",
    language: "python",
    code: `from collections import defaultdict

def groupAnagrams(strs):
    groups = defaultdict(list)
    for s in strs:
        key = tuple(sorted(s))
        groups[key].append(s)
    return list(groups.values())`,
    time: "O(n · k log k)",
    space: "O(n · k)",
    notes: "k is the max string length. Using a 26-length count tuple as the key gives O(n·k).",
  },
  "top-k-frequent-elements": {
    approach: "Count frequencies, then bucket-sort by frequency (index = count). Walk buckets from high to low and collect the first k elements — O(n) overall, beating a heap's O(n log k).",
    language: "python",
    code: `from collections import Counter

def topKFrequent(nums, k):
    count = Counter(nums)
    buckets = [[] for _ in range(len(nums) + 1)]
    for num, freq in count.items():
        buckets[freq].append(num)
    res = []
    for freq in range(len(buckets) - 1, 0, -1):
        for num in buckets[freq]:
            res.append(num)
            if len(res) == k:
                return res`,
    time: "O(n)",
    space: "O(n)",
  },
  "product-of-array-except-self": {
    approach: "Compute prefix products left→right, then multiply by suffix products right→left in a second pass. No division, O(1) extra space (output array aside).",
    language: "python",
    code: `def productExceptSelf(nums):
    n = len(nums)
    res = [1] * n
    prefix = 1
    for i in range(n):
        res[i] = prefix
        prefix *= nums[i]
    suffix = 1
    for i in range(n - 1, -1, -1):
        res[i] *= suffix
        suffix *= nums[i]
    return res`,
    time: "O(n)",
    space: "O(1)",
    notes: "Output array doesn't count toward extra space by convention.",
  },
  "maximum-subarray": {
    approach: "Kadane's algorithm: track the best subarray ending at each index. Reset the running sum to the current element whenever it would otherwise go negative.",
    language: "python",
    code: `def maxSubArray(nums):
    best = cur = nums[0]
    for x in nums[1:]:
        cur = max(x, cur + x)
        best = max(best, cur)
    return best`,
    time: "O(n)",
    space: "O(1)",
  },
  "best-time-to-buy-and-sell-stock": {
    approach: "Track the minimum price seen so far; at each day compute profit if you sold today, keeping the maximum. Single pass.",
    language: "python",
    code: `def maxProfit(prices):
    min_price = float('inf')
    profit = 0
    for p in prices:
        min_price = min(min_price, p)
        profit = max(profit, p - min_price)
    return profit`,
    time: "O(n)",
    space: "O(1)",
  },
  "valid-palindrome": {
    approach: "Two pointers from both ends. Skip non-alphanumeric characters and compare lowercased characters as you converge.",
    language: "python",
    code: `def isPalindrome(s):
    l, r = 0, len(s) - 1
    while l < r:
        while l < r and not s[l].isalnum():
            l += 1
        while l < r and not s[r].isalnum():
            r -= 1
        if s[l].lower() != s[r].lower():
            return False
        l += 1; r -= 1
    return True`,
    time: "O(n)",
    space: "O(1)",
  },
  "3sum": {
    approach: "Sort the array. Fix each number and two-pointer the rest to find pairs summing to its negation. Skip duplicates to keep results unique.",
    language: "python",
    code: `def threeSum(nums):
    nums.sort()
    res = []
    for i in range(len(nums)):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        l, r = i + 1, len(nums) - 1
        while l < r:
            s = nums[i] + nums[l] + nums[r]
            if s < 0: l += 1
            elif s > 0: r -= 1
            else:
                res.append([nums[i], nums[l], nums[r]])
                l += 1
                while l < r and nums[l] == nums[l - 1]:
                    l += 1
    return res`,
    time: "O(n²)",
    space: "O(1)",
    notes: "Sorting enables the two-pointer sweep and makes duplicate-skipping easy.",
  },
  "container-with-most-water": {
    approach: "Two pointers at both ends. Area is limited by the shorter line, so move the shorter pointer inward each step — that's the only way the area can grow.",
    language: "python",
    code: `def maxArea(height):
    l, r = 0, len(height) - 1
    best = 0
    while l < r:
        best = max(best, (r - l) * min(height[l], height[r]))
        if height[l] < height[r]:
            l += 1
        else:
            r -= 1
    return best`,
    time: "O(n)",
    space: "O(1)",
  },
  "longest-substring-without-repeating-characters": {
    approach: "Sliding window with a set of current characters. Expand the right edge; when a duplicate appears, shrink from the left until it's gone. Track the max window size.",
    language: "python",
    code: `def lengthOfLongestSubstring(s):
    seen = set()
    l = best = 0
    for r in range(len(s)):
        while s[r] in seen:
            seen.remove(s[l])
            l += 1
        seen.add(s[r])
        best = max(best, r - l + 1)
    return best`,
    time: "O(n)",
    space: "O(min(n, charset))",
  },
};

export function getSolution(slug: string): DSASolution | undefined {
  return SOLUTIONS[slug];
}
