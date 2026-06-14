import type { HubSection } from "./types";

// Section 7 — App Development (Android + Cross-Platform)
export const appdev: HubSection = {
  id: "appdev",
  title: "App Development",
  blurb: "Native Android with Kotlin and cross-platform with Flutter / React Native.",
  icon: "Smartphone",
  accent: "#b5d4ff",
  topics: [
    {
      id: "app-kotlin",
      title: "Kotlin",
      difficulty: "Beginner",
      resources: [
        { title: "Kotlin Docs", type: "notes", url: "https://kotlinlang.org/docs/home.html" },
        { title: "Kotlin Koans", type: "practice", url: "https://play.kotlinlang.org/koans/overview", difficulty: "Beginner" },
      ],
    },
    {
      id: "app-android-fundamentals",
      title: "Android Fundamentals",
      difficulty: "Intermediate",
      resources: [
        { title: "Android Roadmap (roadmap.sh)", type: "roadmap", url: "https://roadmap.sh/android" },
        { title: "Android Basics (Google)", type: "notes", url: "https://developer.android.com/courses/android-basics-compose/course" },
      ],
    },
    {
      id: "app-jetpack-compose",
      title: "Jetpack Compose",
      difficulty: "Intermediate",
      resources: [
        { title: "Compose Pathway", type: "notes", url: "https://developer.android.com/jetpack/compose/documentation" },
        { title: "Compose Samples (GitHub)", type: "repo", url: "https://github.com/android/compose-samples" },
      ],
    },
    {
      id: "app-flutter",
      title: "Flutter",
      difficulty: "Intermediate",
      resources: [
        { title: "Flutter Docs", type: "notes", url: "https://docs.flutter.dev/" },
        { title: "Awesome Flutter (GitHub)", type: "repo", url: "https://github.com/Solido/awesome-flutter" },
      ],
    },
    {
      id: "app-react-native",
      title: "React Native",
      difficulty: "Intermediate",
      resources: [
        { title: "React Native Docs", type: "notes", url: "https://reactnative.dev/docs/getting-started" },
        { title: "Awesome React Native (GitHub)", type: "repo", url: "https://github.com/jondot/awesome-react-native" },
      ],
    },
  ],
};
