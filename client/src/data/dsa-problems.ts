export type Difficulty = "Easy" | "Medium" | "Hard";
export type Source = "Blind 75" | "NeetCode 150" | "Striver SDE" | "Grind 75";

export const TOPICS = [
  "Arrays & Hashing",
  "Two Pointers",
  "Sliding Window",
  "Stack",
  "Binary Search",
  "Linked List",
  "Trees",
  "Tries",
  "Heap",
  "Backtracking",
  "Graphs",
  "Advanced Graphs",
  "1-D DP",
  "2-D DP",
  "Greedy",
  "Intervals",
  "Math & Geometry",
  "Bit Manipulation",
] as const;
export type Topic = (typeof TOPICS)[number];

export interface DSAProblem {
  id: number;
  leetcodeNumber: number;
  title: string;
  slug: string;
  difficulty: Difficulty;
  topic: Topic;
  companies: string[];
  frequency: 1 | 2 | 3 | 4 | 5;
  sources: Source[];
}

const M = (
  id: number,
  ln: number,
  title: string,
  slug: string,
  difficulty: Difficulty,
  topic: Topic,
  companies: string[],
  frequency: 1 | 2 | 3 | 4 | 5,
  sources: Source[]
): DSAProblem => ({ id, leetcodeNumber: ln, title, slug, difficulty, topic, companies, frequency, sources });

export const PROBLEMS: DSAProblem[] = [
  // Arrays & Hashing
  M(1, 1, "Two Sum", "two-sum", "Easy", "Arrays & Hashing", ["Amazon", "Google", "Microsoft", "Apple"], 5, ["Blind 75", "NeetCode 150", "Grind 75"]),
  M(2, 217, "Contains Duplicate", "contains-duplicate", "Easy", "Arrays & Hashing", ["Amazon", "Apple"], 4, ["Blind 75", "NeetCode 150"]),
  M(3, 242, "Valid Anagram", "valid-anagram", "Easy", "Arrays & Hashing", ["Amazon", "Bloomberg"], 4, ["Blind 75", "NeetCode 150"]),
  M(4, 49, "Group Anagrams", "group-anagrams", "Medium", "Arrays & Hashing", ["Amazon", "Uber", "Google"], 5, ["Blind 75", "NeetCode 150"]),
  M(5, 347, "Top K Frequent Elements", "top-k-frequent-elements", "Medium", "Arrays & Hashing", ["Amazon", "Facebook"], 5, ["Blind 75", "NeetCode 150"]),
  M(6, 238, "Product of Array Except Self", "product-of-array-except-self", "Medium", "Arrays & Hashing", ["Amazon", "Facebook", "Apple"], 5, ["Blind 75", "NeetCode 150"]),
  M(7, 36, "Valid Sudoku", "valid-sudoku", "Medium", "Arrays & Hashing", ["Apple", "Snapchat"], 3, ["NeetCode 150"]),
  M(8, 128, "Longest Consecutive Sequence", "longest-consecutive-sequence", "Medium", "Arrays & Hashing", ["Google", "Microsoft"], 4, ["Blind 75", "NeetCode 150"]),
  M(9, 271, "Encode and Decode Strings", "encode-and-decode-strings", "Medium", "Arrays & Hashing", ["Google", "Square"], 3, ["Blind 75", "NeetCode 150"]),
  M(10, 53, "Maximum Subarray", "maximum-subarray", "Medium", "Arrays & Hashing", ["Amazon", "LinkedIn", "Microsoft"], 5, ["Blind 75", "Grind 75"]),

  // Two Pointers
  M(11, 125, "Valid Palindrome", "valid-palindrome", "Easy", "Two Pointers", ["Facebook", "Microsoft"], 4, ["NeetCode 150", "Grind 75"]),
  M(12, 167, "Two Sum II - Sorted", "two-sum-ii-input-array-is-sorted", "Medium", "Two Pointers", ["Amazon"], 3, ["NeetCode 150"]),
  M(13, 15, "3Sum", "3sum", "Medium", "Two Pointers", ["Amazon", "Facebook", "Microsoft"], 5, ["Blind 75", "NeetCode 150", "Grind 75"]),
  M(14, 11, "Container With Most Water", "container-with-most-water", "Medium", "Two Pointers", ["Amazon", "Facebook", "Goldman Sachs"], 5, ["Blind 75", "NeetCode 150"]),
  M(15, 42, "Trapping Rain Water", "trapping-rain-water", "Hard", "Two Pointers", ["Amazon", "Google", "Goldman Sachs"], 5, ["Blind 75", "NeetCode 150"]),
  M(16, 26, "Remove Duplicates from Sorted Array", "remove-duplicates-from-sorted-array", "Easy", "Two Pointers", ["Microsoft", "Facebook"], 3, ["Striver SDE"]),
  M(17, 88, "Merge Sorted Array", "merge-sorted-array", "Easy", "Two Pointers", ["Microsoft", "Bloomberg"], 4, ["Grind 75"]),
  M(18, 283, "Move Zeroes", "move-zeroes", "Easy", "Two Pointers", ["Facebook", "Apple"], 4, ["Grind 75"]),

  // Sliding Window
  M(19, 121, "Best Time to Buy and Sell Stock", "best-time-to-buy-and-sell-stock", "Easy", "Sliding Window", ["Amazon", "Facebook"], 5, ["Blind 75", "NeetCode 150"]),
  M(20, 3, "Longest Substring Without Repeating Characters", "longest-substring-without-repeating-characters", "Medium", "Sliding Window", ["Amazon", "Bloomberg", "Apple"], 5, ["Blind 75", "NeetCode 150", "Grind 75"]),
  M(21, 424, "Longest Repeating Character Replacement", "longest-repeating-character-replacement", "Medium", "Sliding Window", ["Google"], 3, ["Blind 75", "NeetCode 150"]),
  M(22, 567, "Permutation in String", "permutation-in-string", "Medium", "Sliding Window", ["Microsoft"], 3, ["NeetCode 150"]),
  M(23, 76, "Minimum Window Substring", "minimum-window-substring", "Hard", "Sliding Window", ["Amazon", "Facebook", "LinkedIn"], 5, ["Blind 75", "NeetCode 150"]),
  M(24, 239, "Sliding Window Maximum", "sliding-window-maximum", "Hard", "Sliding Window", ["Amazon", "Google"], 4, ["NeetCode 150"]),

  // Stack
  M(25, 20, "Valid Parentheses", "valid-parentheses", "Easy", "Stack", ["Amazon", "Microsoft", "Facebook"], 5, ["Blind 75", "NeetCode 150", "Grind 75"]),
  M(26, 155, "Min Stack", "min-stack", "Medium", "Stack", ["Amazon", "Google"], 4, ["NeetCode 150", "Grind 75"]),
  M(27, 150, "Evaluate Reverse Polish Notation", "evaluate-reverse-polish-notation", "Medium", "Stack", ["Amazon", "LinkedIn"], 3, ["NeetCode 150"]),
  M(28, 22, "Generate Parentheses", "generate-parentheses", "Medium", "Stack", ["Amazon", "Google", "Uber"], 5, ["NeetCode 150", "Grind 75"]),
  M(29, 739, "Daily Temperatures", "daily-temperatures", "Medium", "Stack", ["Facebook", "Amazon"], 3, ["NeetCode 150"]),
  M(30, 853, "Car Fleet", "car-fleet", "Medium", "Stack", ["Google"], 2, ["NeetCode 150"]),
  M(31, 84, "Largest Rectangle in Histogram", "largest-rectangle-in-histogram", "Hard", "Stack", ["Amazon", "Google"], 4, ["NeetCode 150"]),

  // Binary Search
  M(32, 704, "Binary Search", "binary-search", "Easy", "Binary Search", ["Amazon"], 4, ["NeetCode 150", "Grind 75"]),
  M(33, 74, "Search a 2D Matrix", "search-a-2d-matrix", "Medium", "Binary Search", ["Amazon", "Apple"], 3, ["NeetCode 150"]),
  M(34, 875, "Koko Eating Bananas", "koko-eating-bananas", "Medium", "Binary Search", ["Google", "Amazon"], 4, ["NeetCode 150"]),
  M(35, 153, "Find Minimum in Rotated Sorted Array", "find-minimum-in-rotated-sorted-array", "Medium", "Binary Search", ["Amazon", "Facebook"], 4, ["Blind 75", "NeetCode 150"]),
  M(36, 33, "Search in Rotated Sorted Array", "search-in-rotated-sorted-array", "Medium", "Binary Search", ["Amazon", "Apple", "Microsoft"], 5, ["Blind 75", "NeetCode 150", "Grind 75"]),
  M(37, 981, "Time Based Key-Value Store", "time-based-key-value-store", "Medium", "Binary Search", ["Google"], 3, ["NeetCode 150"]),
  M(38, 4, "Median of Two Sorted Arrays", "median-of-two-sorted-arrays", "Hard", "Binary Search", ["Amazon", "Google", "Goldman Sachs"], 4, ["NeetCode 150"]),

  // Linked List
  M(39, 206, "Reverse Linked List", "reverse-linked-list", "Easy", "Linked List", ["Amazon", "Microsoft", "Apple", "Facebook"], 5, ["Blind 75", "NeetCode 150", "Grind 75"]),
  M(40, 21, "Merge Two Sorted Lists", "merge-two-sorted-lists", "Easy", "Linked List", ["Amazon", "Microsoft"], 5, ["Blind 75", "NeetCode 150", "Grind 75"]),
  M(41, 141, "Linked List Cycle", "linked-list-cycle", "Easy", "Linked List", ["Amazon", "Microsoft"], 4, ["Blind 75", "NeetCode 150", "Grind 75"]),
  M(42, 143, "Reorder List", "reorder-list", "Medium", "Linked List", ["Microsoft"], 3, ["Blind 75", "NeetCode 150"]),
  M(43, 19, "Remove Nth Node From End of List", "remove-nth-node-from-end-of-list", "Medium", "Linked List", ["Facebook", "Amazon"], 4, ["Blind 75", "NeetCode 150"]),
  M(44, 138, "Copy List with Random Pointer", "copy-list-with-random-pointer", "Medium", "Linked List", ["Amazon", "Microsoft"], 4, ["NeetCode 150"]),
  M(45, 2, "Add Two Numbers", "add-two-numbers", "Medium", "Linked List", ["Amazon", "Microsoft", "Bloomberg"], 5, ["NeetCode 150", "Grind 75"]),
  M(46, 287, "Find the Duplicate Number", "find-the-duplicate-number", "Medium", "Linked List", ["Amazon", "Google"], 3, ["NeetCode 150"]),
  M(47, 146, "LRU Cache", "lru-cache", "Medium", "Linked List", ["Amazon", "Facebook", "Microsoft", "Google"], 5, ["Blind 75", "NeetCode 150", "Grind 75"]),
  M(48, 23, "Merge K Sorted Lists", "merge-k-sorted-lists", "Hard", "Linked List", ["Amazon", "Facebook", "Google"], 5, ["Blind 75", "NeetCode 150"]),
  M(49, 25, "Reverse Nodes in K-Group", "reverse-nodes-in-k-group", "Hard", "Linked List", ["Amazon", "Microsoft"], 3, ["NeetCode 150"]),

  // Trees
  M(50, 226, "Invert Binary Tree", "invert-binary-tree", "Easy", "Trees", ["Google", "Amazon"], 5, ["Blind 75", "NeetCode 150", "Grind 75"]),
  M(51, 104, "Maximum Depth of Binary Tree", "maximum-depth-of-binary-tree", "Easy", "Trees", ["Amazon", "Microsoft"], 4, ["Blind 75", "NeetCode 150", "Grind 75"]),
  M(52, 543, "Diameter of Binary Tree", "diameter-of-binary-tree", "Easy", "Trees", ["Facebook"], 3, ["NeetCode 150"]),
  M(53, 110, "Balanced Binary Tree", "balanced-binary-tree", "Easy", "Trees", ["Amazon"], 3, ["NeetCode 150"]),
  M(54, 100, "Same Tree", "same-tree", "Easy", "Trees", ["Amazon"], 3, ["NeetCode 150"]),
  M(55, 572, "Subtree of Another Tree", "subtree-of-another-tree", "Easy", "Trees", ["Amazon"], 3, ["NeetCode 150"]),
  M(56, 235, "Lowest Common Ancestor of a BST", "lowest-common-ancestor-of-a-binary-search-tree", "Medium", "Trees", ["Amazon", "Facebook"], 4, ["NeetCode 150"]),
  M(57, 102, "Binary Tree Level Order Traversal", "binary-tree-level-order-traversal", "Medium", "Trees", ["Amazon", "Facebook", "LinkedIn"], 5, ["Blind 75", "NeetCode 150", "Grind 75"]),
  M(58, 199, "Binary Tree Right Side View", "binary-tree-right-side-view", "Medium", "Trees", ["Amazon", "Facebook"], 3, ["NeetCode 150"]),
  M(59, 1448, "Count Good Nodes in Binary Tree", "count-good-nodes-in-binary-tree", "Medium", "Trees", ["Microsoft"], 2, ["NeetCode 150"]),
  M(60, 98, "Validate Binary Search Tree", "validate-binary-search-tree", "Medium", "Trees", ["Amazon", "Microsoft", "Facebook"], 5, ["Blind 75", "NeetCode 150", "Grind 75"]),
  M(61, 230, "Kth Smallest Element in a BST", "kth-smallest-element-in-a-bst", "Medium", "Trees", ["Facebook", "Amazon"], 4, ["Blind 75", "NeetCode 150"]),
  M(62, 105, "Construct Tree from Preorder & Inorder", "construct-binary-tree-from-preorder-and-inorder-traversal", "Medium", "Trees", ["Amazon", "Bloomberg"], 4, ["Blind 75", "NeetCode 150"]),
  M(63, 124, "Binary Tree Maximum Path Sum", "binary-tree-maximum-path-sum", "Hard", "Trees", ["Amazon", "Microsoft"], 4, ["Blind 75", "NeetCode 150"]),
  M(64, 297, "Serialize and Deserialize Binary Tree", "serialize-and-deserialize-binary-tree", "Hard", "Trees", ["Amazon", "Facebook", "LinkedIn"], 5, ["Blind 75", "NeetCode 150", "Grind 75"]),

  // Tries
  M(65, 208, "Implement Trie (Prefix Tree)", "implement-trie-prefix-tree", "Medium", "Tries", ["Amazon", "Microsoft", "Google"], 4, ["Blind 75", "NeetCode 150"]),
  M(66, 211, "Design Add and Search Words Data Structure", "design-add-and-search-words-data-structure", "Medium", "Tries", ["Facebook"], 3, ["Blind 75", "NeetCode 150"]),
  M(67, 212, "Word Search II", "word-search-ii", "Hard", "Tries", ["Amazon", "Google"], 4, ["Blind 75", "NeetCode 150"]),

  // Heap
  M(68, 703, "Kth Largest Element in a Stream", "kth-largest-element-in-a-stream", "Easy", "Heap", ["Amazon"], 3, ["NeetCode 150"]),
  M(69, 1046, "Last Stone Weight", "last-stone-weight", "Easy", "Heap", ["Amazon"], 2, ["NeetCode 150"]),
  M(70, 973, "K Closest Points to Origin", "k-closest-points-to-origin", "Medium", "Heap", ["Amazon", "Facebook", "Uber"], 5, ["NeetCode 150", "Grind 75"]),
  M(71, 215, "Kth Largest Element in an Array", "kth-largest-element-in-an-array", "Medium", "Heap", ["Amazon", "Facebook"], 5, ["NeetCode 150"]),
  M(72, 621, "Task Scheduler", "task-scheduler", "Medium", "Heap", ["Facebook", "Amazon"], 4, ["NeetCode 150"]),
  M(73, 355, "Design Twitter", "design-twitter", "Medium", "Heap", ["Twitter", "Amazon"], 3, ["NeetCode 150"]),
  M(74, 295, "Find Median from Data Stream", "find-median-from-data-stream", "Hard", "Heap", ["Amazon", "Google", "Microsoft"], 4, ["NeetCode 150"]),

  // Backtracking
  M(75, 78, "Subsets", "subsets", "Medium", "Backtracking", ["Amazon", "Facebook"], 5, ["NeetCode 150", "Grind 75"]),
  M(76, 39, "Combination Sum", "combination-sum", "Medium", "Backtracking", ["Amazon", "Microsoft"], 4, ["Blind 75", "NeetCode 150"]),
  M(77, 46, "Permutations", "permutations", "Medium", "Backtracking", ["Amazon", "LinkedIn"], 4, ["NeetCode 150"]),
  M(78, 90, "Subsets II", "subsets-ii", "Medium", "Backtracking", ["Amazon"], 3, ["NeetCode 150"]),
  M(79, 40, "Combination Sum II", "combination-sum-ii", "Medium", "Backtracking", ["Amazon"], 3, ["NeetCode 150"]),
  M(80, 79, "Word Search", "word-search", "Medium", "Backtracking", ["Amazon", "Bloomberg", "Microsoft"], 4, ["NeetCode 150"]),
  M(81, 131, "Palindrome Partitioning", "palindrome-partitioning", "Medium", "Backtracking", ["Amazon"], 3, ["NeetCode 150"]),
  M(82, 17, "Letter Combinations of a Phone Number", "letter-combinations-of-a-phone-number", "Medium", "Backtracking", ["Amazon", "Facebook"], 4, ["NeetCode 150"]),
  M(83, 51, "N-Queens", "n-queens", "Hard", "Backtracking", ["Amazon"], 2, ["NeetCode 150"]),

  // Graphs
  M(84, 200, "Number of Islands", "number-of-islands", "Medium", "Graphs", ["Amazon", "Facebook", "Google", "Microsoft"], 5, ["Blind 75", "NeetCode 150", "Grind 75"]),
  M(85, 695, "Max Area of Island", "max-area-of-island", "Medium", "Graphs", ["Amazon"], 3, ["NeetCode 150"]),
  M(86, 133, "Clone Graph", "clone-graph", "Medium", "Graphs", ["Facebook"], 4, ["Blind 75", "NeetCode 150"]),
  M(87, 286, "Walls and Gates", "walls-and-gates", "Medium", "Graphs", ["Facebook"], 3, ["NeetCode 150"]),
  M(88, 994, "Rotting Oranges", "rotting-oranges", "Medium", "Graphs", ["Amazon"], 4, ["NeetCode 150"]),
  M(89, 417, "Pacific Atlantic Water Flow", "pacific-atlantic-water-flow", "Medium", "Graphs", ["Amazon"], 3, ["Blind 75", "NeetCode 150"]),
  M(90, 130, "Surrounded Regions", "surrounded-regions", "Medium", "Graphs", ["Amazon"], 2, ["NeetCode 150"]),
  M(91, 207, "Course Schedule", "course-schedule", "Medium", "Graphs", ["Amazon", "Apple"], 4, ["Blind 75", "NeetCode 150", "Grind 75"]),
  M(92, 210, "Course Schedule II", "course-schedule-ii", "Medium", "Graphs", ["Amazon"], 3, ["NeetCode 150"]),
  M(93, 684, "Redundant Connection", "redundant-connection", "Medium", "Graphs", ["Google"], 3, ["NeetCode 150"]),
  M(94, 323, "Number of Connected Components", "number-of-connected-components-in-an-undirected-graph", "Medium", "Graphs", ["Amazon"], 3, ["NeetCode 150"]),
  M(95, 261, "Graph Valid Tree", "graph-valid-tree", "Medium", "Graphs", ["Facebook"], 3, ["NeetCode 150"]),
  M(96, 127, "Word Ladder", "word-ladder", "Hard", "Graphs", ["Amazon", "Google"], 4, ["Blind 75", "NeetCode 150"]),

  // Advanced Graphs
  M(97, 332, "Reconstruct Itinerary", "reconstruct-itinerary", "Hard", "Advanced Graphs", ["Google"], 3, ["NeetCode 150"]),
  M(98, 1584, "Min Cost to Connect All Points", "min-cost-to-connect-all-points", "Medium", "Advanced Graphs", ["Amazon"], 3, ["NeetCode 150"]),
  M(99, 743, "Network Delay Time", "network-delay-time", "Medium", "Advanced Graphs", ["Amazon"], 3, ["NeetCode 150"]),
  M(100, 778, "Swim in Rising Water", "swim-in-rising-water", "Hard", "Advanced Graphs", ["Amazon"], 2, ["NeetCode 150"]),
  M(101, 269, "Alien Dictionary", "alien-dictionary", "Hard", "Advanced Graphs", ["Amazon", "Facebook"], 4, ["Blind 75", "NeetCode 150"]),
  M(102, 787, "Cheapest Flights Within K Stops", "cheapest-flights-within-k-stops", "Medium", "Advanced Graphs", ["Amazon"], 3, ["NeetCode 150"]),

  // 1-D DP
  M(103, 70, "Climbing Stairs", "climbing-stairs", "Easy", "1-D DP", ["Amazon", "Adobe"], 5, ["Blind 75", "NeetCode 150", "Grind 75"]),
  M(104, 746, "Min Cost Climbing Stairs", "min-cost-climbing-stairs", "Easy", "1-D DP", ["Amazon"], 3, ["NeetCode 150"]),
  M(105, 198, "House Robber", "house-robber", "Medium", "1-D DP", ["Amazon", "LinkedIn"], 4, ["Blind 75", "NeetCode 150"]),
  M(106, 213, "House Robber II", "house-robber-ii", "Medium", "1-D DP", ["Amazon"], 3, ["Blind 75", "NeetCode 150"]),
  M(107, 5, "Longest Palindromic Substring", "longest-palindromic-substring", "Medium", "1-D DP", ["Amazon", "Microsoft"], 5, ["Blind 75", "NeetCode 150"]),
  M(108, 647, "Palindromic Substrings", "palindromic-substrings", "Medium", "1-D DP", ["Amazon", "Facebook"], 3, ["Blind 75", "NeetCode 150"]),
  M(109, 91, "Decode Ways", "decode-ways", "Medium", "1-D DP", ["Facebook", "Microsoft"], 4, ["Blind 75", "NeetCode 150"]),
  M(110, 322, "Coin Change", "coin-change", "Medium", "1-D DP", ["Amazon", "Microsoft"], 5, ["Blind 75", "NeetCode 150"]),
  M(111, 152, "Maximum Product Subarray", "maximum-product-subarray", "Medium", "1-D DP", ["Amazon", "LinkedIn"], 4, ["Blind 75", "NeetCode 150"]),
  M(112, 139, "Word Break", "word-break", "Medium", "1-D DP", ["Amazon", "Facebook", "Google"], 5, ["Blind 75", "NeetCode 150"]),
  M(113, 300, "Longest Increasing Subsequence", "longest-increasing-subsequence", "Medium", "1-D DP", ["Amazon", "Microsoft"], 5, ["Blind 75", "NeetCode 150"]),
  M(114, 416, "Partition Equal Subset Sum", "partition-equal-subset-sum", "Medium", "1-D DP", ["Amazon"], 3, ["NeetCode 150"]),

  // 2-D DP
  M(115, 62, "Unique Paths", "unique-paths", "Medium", "2-D DP", ["Amazon", "Bloomberg"], 4, ["Blind 75", "NeetCode 150"]),
  M(116, 1143, "Longest Common Subsequence", "longest-common-subsequence", "Medium", "2-D DP", ["Amazon", "Google"], 4, ["Blind 75", "NeetCode 150"]),
  M(117, 309, "Best Time to Buy and Sell Stock with Cooldown", "best-time-to-buy-and-sell-stock-with-cooldown", "Medium", "2-D DP", ["Bloomberg"], 3, ["NeetCode 150"]),
  M(118, 518, "Coin Change II", "coin-change-ii", "Medium", "2-D DP", ["Amazon"], 3, ["NeetCode 150"]),
  M(119, 494, "Target Sum", "target-sum", "Medium", "2-D DP", ["Facebook", "Amazon"], 3, ["NeetCode 150"]),
  M(120, 97, "Interleaving String", "interleaving-string", "Medium", "2-D DP", ["Microsoft"], 2, ["NeetCode 150"]),
  M(121, 329, "Longest Increasing Path in a Matrix", "longest-increasing-path-in-a-matrix", "Hard", "2-D DP", ["Google", "Amazon"], 3, ["NeetCode 150"]),
  M(122, 115, "Distinct Subsequences", "distinct-subsequences", "Hard", "2-D DP", ["Amazon"], 2, ["NeetCode 150"]),
  M(123, 72, "Edit Distance", "edit-distance", "Hard", "2-D DP", ["Amazon", "Google", "Microsoft"], 4, ["Blind 75", "NeetCode 150"]),
  M(124, 312, "Burst Balloons", "burst-balloons", "Hard", "2-D DP", ["Amazon"], 2, ["NeetCode 150"]),
  M(125, 10, "Regular Expression Matching", "regular-expression-matching", "Hard", "2-D DP", ["Facebook", "Google"], 3, ["Blind 75", "NeetCode 150"]),

  // Greedy
  M(126, 53, "Maximum Subarray (Kadane)", "maximum-subarray", "Medium", "Greedy", ["Amazon"], 5, ["NeetCode 150"]),
  M(127, 55, "Jump Game", "jump-game", "Medium", "Greedy", ["Amazon", "Microsoft"], 4, ["Blind 75", "NeetCode 150"]),
  M(128, 45, "Jump Game II", "jump-game-ii", "Medium", "Greedy", ["Amazon"], 3, ["NeetCode 150"]),
  M(129, 134, "Gas Station", "gas-station", "Medium", "Greedy", ["Amazon"], 3, ["NeetCode 150"]),
  M(130, 846, "Hand of Straights", "hand-of-straights", "Medium", "Greedy", ["Google"], 2, ["NeetCode 150"]),
  M(131, 1899, "Merge Triplets to Form Target Triplet", "merge-triplets-to-form-target-triplet", "Medium", "Greedy", ["Bloomberg"], 1, ["NeetCode 150"]),

  // Intervals
  M(132, 57, "Insert Interval", "insert-interval", "Medium", "Intervals", ["Google", "Facebook"], 4, ["Blind 75", "NeetCode 150"]),
  M(133, 56, "Merge Intervals", "merge-intervals", "Medium", "Intervals", ["Amazon", "Facebook", "Google", "Bloomberg"], 5, ["Blind 75", "NeetCode 150", "Grind 75"]),
  M(134, 435, "Non-overlapping Intervals", "non-overlapping-intervals", "Medium", "Intervals", ["Amazon"], 3, ["Blind 75", "NeetCode 150"]),
  M(135, 252, "Meeting Rooms", "meeting-rooms", "Easy", "Intervals", ["Facebook", "Microsoft"], 4, ["Blind 75", "NeetCode 150"]),
  M(136, 253, "Meeting Rooms II", "meeting-rooms-ii", "Medium", "Intervals", ["Facebook", "Amazon", "Google"], 5, ["Blind 75", "NeetCode 150"]),
  M(137, 1851, "Minimum Interval to Include Each Query", "minimum-interval-to-include-each-query", "Hard", "Intervals", ["Snapchat"], 1, ["NeetCode 150"]),

  // Math & Geometry
  M(138, 48, "Rotate Image", "rotate-image", "Medium", "Math & Geometry", ["Amazon", "Microsoft"], 4, ["Blind 75", "NeetCode 150"]),
  M(139, 54, "Spiral Matrix", "spiral-matrix", "Medium", "Math & Geometry", ["Amazon", "Microsoft", "Uber"], 5, ["NeetCode 150"]),
  M(140, 73, "Set Matrix Zeroes", "set-matrix-zeroes", "Medium", "Math & Geometry", ["Amazon", "Facebook"], 3, ["NeetCode 150"]),
  M(141, 202, "Happy Number", "happy-number", "Easy", "Math & Geometry", ["Amazon"], 2, ["NeetCode 150"]),
  M(142, 66, "Plus One", "plus-one", "Easy", "Math & Geometry", ["Google"], 3, ["NeetCode 150"]),
  M(143, 50, "Pow(x, n)", "powx-n", "Medium", "Math & Geometry", ["Facebook"], 3, ["NeetCode 150"]),

  // Bit Manipulation
  M(144, 136, "Single Number", "single-number", "Easy", "Bit Manipulation", ["Amazon"], 4, ["NeetCode 150"]),
  M(145, 191, "Number of 1 Bits", "number-of-1-bits", "Easy", "Bit Manipulation", ["Apple"], 3, ["Blind 75", "NeetCode 150"]),
  M(146, 338, "Counting Bits", "counting-bits", "Easy", "Bit Manipulation", ["Amazon"], 3, ["Blind 75", "NeetCode 150"]),
  M(147, 190, "Reverse Bits", "reverse-bits", "Easy", "Bit Manipulation", ["Apple", "Airbnb"], 3, ["Blind 75", "NeetCode 150"]),
  M(148, 268, "Missing Number", "missing-number", "Easy", "Bit Manipulation", ["Amazon", "Microsoft"], 4, ["Blind 75", "NeetCode 150"]),
  M(149, 371, "Sum of Two Integers", "sum-of-two-integers", "Medium", "Bit Manipulation", ["Apple"], 2, ["Blind 75", "NeetCode 150"]),
  M(150, 7, "Reverse Integer", "reverse-integer", "Medium", "Bit Manipulation", ["Amazon", "Apple", "Bloomberg"], 3, ["NeetCode 150"]),
];

export const COMPANY_LIST = Array.from(
  new Set(PROBLEMS.flatMap((p) => p.companies))
).sort();

export const SOURCE_LIST: Source[] = ["Blind 75", "NeetCode 150", "Striver SDE", "Grind 75"];
