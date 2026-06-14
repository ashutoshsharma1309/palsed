import type { HubSection } from "./types";

// Section 2 — DSA Preparation (Easy → Medium → Hard progression)
export const dsa: HubSection = {
  id: "dsa",
  title: "DSA Preparation",
  blurb: "Topic-wise roadmaps, curated resources, and practice with Easy → Medium → Hard progression.",
  icon: "Binary",
  accent: "#b5d4ff",
  topics: [
    {
      id: "dsa-arrays",
      title: "Arrays",
      difficulty: "Easy",
      resources: [
        { title: "Arrays Roadmap (Striver A2Z)", type: "roadmap", url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/" },
        { title: "Arrays — GeeksforGeeks", type: "notes", url: "https://www.geeksforgeeks.org/array-data-structure/" },
        { title: "NeetCode Arrays & Hashing", type: "video", url: "https://neetcode.io/roadmap" },
        { title: "Practice — LeetCode Array", type: "practice", url: "https://leetcode.com/tag/array/", difficulty: "Easy" },
      ],
    },
    {
      id: "dsa-strings",
      title: "Strings",
      difficulty: "Easy",
      resources: [
        { title: "Strings Roadmap (Striver)", type: "roadmap", url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/" },
        { title: "Strings — GeeksforGeeks", type: "notes", url: "https://www.geeksforgeeks.org/string-data-structure/" },
        { title: "Practice — LeetCode String", type: "practice", url: "https://leetcode.com/tag/string/", difficulty: "Easy" },
      ],
    },
    {
      id: "dsa-linked-lists",
      title: "Linked Lists",
      difficulty: "Medium",
      resources: [
        { title: "Linked List Roadmap (Striver)", type: "roadmap", url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/" },
        { title: "Linked List — GeeksforGeeks", type: "notes", url: "https://www.geeksforgeeks.org/data-structures/linked-list/" },
        { title: "Practice — LeetCode Linked List", type: "practice", url: "https://leetcode.com/tag/linked-list/", difficulty: "Medium" },
      ],
    },
    {
      id: "dsa-stacks",
      title: "Stacks",
      difficulty: "Medium",
      resources: [
        { title: "Stack — GeeksforGeeks", type: "notes", url: "https://www.geeksforgeeks.org/stack-data-structure/" },
        { title: "NeetCode Stack", type: "video", url: "https://neetcode.io/roadmap" },
        { title: "Practice — LeetCode Stack", type: "practice", url: "https://leetcode.com/tag/stack/", difficulty: "Medium" },
      ],
    },
    {
      id: "dsa-queues",
      title: "Queues",
      difficulty: "Medium",
      resources: [
        { title: "Queue — GeeksforGeeks", type: "notes", url: "https://www.geeksforgeeks.org/queue-data-structure/" },
        { title: "Practice — LeetCode Queue", type: "practice", url: "https://leetcode.com/tag/queue/", difficulty: "Medium" },
      ],
    },
    {
      id: "dsa-trees",
      title: "Trees",
      difficulty: "Medium",
      resources: [
        { title: "Trees Roadmap (Striver)", type: "roadmap", url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/" },
        { title: "Binary Tree — GeeksforGeeks", type: "notes", url: "https://www.geeksforgeeks.org/binary-tree-data-structure/" },
        { title: "NeetCode Trees", type: "video", url: "https://neetcode.io/roadmap" },
        { title: "Practice — LeetCode Tree", type: "practice", url: "https://leetcode.com/tag/tree/", difficulty: "Medium" },
      ],
    },
    {
      id: "dsa-bst",
      title: "Binary Search Trees",
      difficulty: "Medium",
      resources: [
        { title: "BST — GeeksforGeeks", type: "notes", url: "https://www.geeksforgeeks.org/binary-search-tree-data-structure/" },
        { title: "Practice — LeetCode BST", type: "practice", url: "https://leetcode.com/tag/binary-search-tree/", difficulty: "Medium" },
      ],
    },
    {
      id: "dsa-heaps",
      title: "Heaps",
      difficulty: "Medium",
      resources: [
        { title: "Heap — GeeksforGeeks", type: "notes", url: "https://www.geeksforgeeks.org/heap-data-structure/" },
        { title: "NeetCode Heap / Priority Queue", type: "video", url: "https://neetcode.io/roadmap" },
        { title: "Practice — LeetCode Heap", type: "practice", url: "https://leetcode.com/tag/heap-priority-queue/", difficulty: "Medium" },
      ],
    },
    {
      id: "dsa-graphs",
      title: "Graphs",
      difficulty: "Hard",
      resources: [
        { title: "Graph Series (Striver)", type: "roadmap", url: "https://takeuforward.org/graph/strivers-graph-series-top-graph-interview-questions/" },
        { title: "Graph — GeeksforGeeks", type: "notes", url: "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/" },
        { title: "Practice — LeetCode Graph", type: "practice", url: "https://leetcode.com/tag/graph/", difficulty: "Hard" },
      ],
    },
    {
      id: "dsa-greedy",
      title: "Greedy Algorithms",
      difficulty: "Medium",
      resources: [
        { title: "Greedy — GeeksforGeeks", type: "notes", url: "https://www.geeksforgeeks.org/greedy-algorithms/" },
        { title: "Practice — LeetCode Greedy", type: "practice", url: "https://leetcode.com/tag/greedy/", difficulty: "Medium" },
      ],
    },
    {
      id: "dsa-dp",
      title: "Dynamic Programming",
      difficulty: "Hard",
      resources: [
        { title: "DP Series (Striver)", type: "roadmap", url: "https://takeuforward.org/dynamic-programming/strivers-dp-series-dynamic-programming-problems/" },
        { title: "DP for Beginners (LeetCode)", type: "notes", url: "https://leetcode.com/discuss/general-discussion/458695/dynamic-programming-patterns" },
        { title: "Practice — LeetCode DP", type: "practice", url: "https://leetcode.com/tag/dynamic-programming/", difficulty: "Hard" },
      ],
    },
    {
      id: "dsa-recursion",
      title: "Recursion",
      difficulty: "Medium",
      resources: [
        { title: "Recursion — GeeksforGeeks", type: "notes", url: "https://www.geeksforgeeks.org/recursion/" },
        { title: "Recursion Roadmap (Striver)", type: "roadmap", url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/" },
      ],
    },
    {
      id: "dsa-backtracking",
      title: "Backtracking",
      difficulty: "Hard",
      resources: [
        { title: "Backtracking — GeeksforGeeks", type: "notes", url: "https://www.geeksforgeeks.org/backtracking-algorithms/" },
        { title: "Practice — LeetCode Backtracking", type: "practice", url: "https://leetcode.com/tag/backtracking/", difficulty: "Hard" },
      ],
    },
  ],
};
