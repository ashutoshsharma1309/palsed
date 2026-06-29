import type { ProjectDomain } from "./types";

export const mobileDevelopment: ProjectDomain = {
  id: "mobile-development",
  title: "Mobile Development",
  icon: "Smartphone",
  accent: "yellow",
  blurb: "Build cross-platform apps for Android and iOS — a skill every product company wants.",
  overview:
    "Mobile development is one of the fastest-growing skill sets in the Indian placement market. Every startup and enterprise product team needs engineers who can ship features on Android and iOS, and cross-platform frameworks like React Native and Flutter let you do both with a single codebase — making you twice as hireable for half the learning curve. Companies like Flipkart, Swiggy, Meesho, PhonePe, and CRED build their consumer-facing apps using these exact stacks.\n\nThe goal of this learning path is to move from understanding how a mobile app is structured to shipping a real app that users can install — ideally via an Expo Go QR link, a TestFlight/APK build, or even a published Play Store listing. A mobile project in your portfolio stands out because most web-focused candidates simply don't have one: you walk into every interview with a live demo on your phone.",
  skillsRequired: [
    "JavaScript or Dart basics (variables, functions, async, classes)",
    "React fundamentals (components, props, state, hooks) if choosing React Native",
    "Comfort with Git & GitHub",
    "Basic command line usage",
    "Understanding of REST APIs (fetch / axios)",
  ],
  learningOrder: [
    "Set up your environment: Node + Expo CLI (React Native) or Flutter SDK + Android Studio",
    "Learn the core UI primitives: View/Text/Image in React Native, or Widget tree in Flutter",
    "Navigation: React Navigation (Stack + Tab) or Flutter Navigator 2.0 / go_router",
    "State management: useState/useContext (React Native) or Provider/Riverpod (Flutter)",
    "Consuming REST APIs with fetch/axios or Dart's http package; loading and error states",
    "Local persistence: AsyncStorage (React Native) or SharedPreferences/Hive (Flutter)",
    "Firebase integration: Authentication (email/Google), Firestore, Cloud Messaging (FCM)",
    "Build & distribute: Expo EAS Build, generating an APK, publishing to Google Play Store",
  ],
  difficulty: "Beginner-friendly → Advanced",
  techStack: [
    "React Native (Expo managed workflow)",
    "Flutter / Dart",
    "Firebase (Auth, Firestore, FCM, Storage)",
    "REST APIs / axios / http",
    "AsyncStorage / Hive / SQLite",
    "Expo EAS Build / Android Studio",
    "React Navigation / go_router",
  ],
  githubResources: [
    {
      label: "Awesome React Native",
      url: "https://github.com/jondot/awesome-react-native",
      kind: "repo",
    },
    {
      label: "Awesome Flutter",
      url: "https://github.com/Solido/awesome-flutter",
      kind: "repo",
    },
    {
      label: "React Native Paper (UI kit)",
      url: "https://github.com/callstack/react-native-paper",
      kind: "repo",
    },
    {
      label: "FlutterFire (official Firebase plugins)",
      url: "https://github.com/firebase/flutterfire",
      kind: "repo",
    },
    {
      label: "Expo examples (official starter templates)",
      url: "https://github.com/expo/examples",
      kind: "repo",
    },
  ],
  learningResources: [
    {
      label: "React Native official docs",
      url: "https://reactnative.dev/docs/getting-started",
      kind: "docs",
    },
    {
      label: "Flutter official docs",
      url: "https://docs.flutter.dev/get-started/codelab",
      kind: "docs",
    },
    {
      label: "roadmap.sh — React Native",
      url: "https://roadmap.sh/react-native",
      kind: "roadmap",
    },
    {
      label: "freeCodeCamp — React Native Full Course (YouTube)",
      url: "https://www.youtube.com/watch?v=obH0Po_RdWk",
      kind: "video",
    },
    {
      label: "The Net Ninja — Flutter Tutorial for Beginners (YouTube)",
      url: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9jLYyp2Aoh6hcWuxFDX6PBJ",
      kind: "video",
    },
  ],
  portfolioTips: [
    "Share an Expo Go QR code in your README so any recruiter can scan and run the app immediately — no build needed.",
    "Publish the release APK as a GitHub Release asset so Android users can sideload it without a Play Store account.",
    "If you publish to the Google Play Store (even the free internal test track), paste the Play Store listing URL in your resume and README — it signals real-world shipping experience.",
    "Record a 60-second screen-capture demo and embed it as a GIF or YouTube link in the README; mobile UX is hard to convey with screenshots alone.",
    "Highlight device-specific features (camera, GPS, push notifications, offline mode) in your project description — these are differentiators that web projects cannot show.",
  ],
  resumeTips: [
    "Lead with the platform and reach: 'Built a cross-platform React Native app for Android & iOS; shared on Expo Go with 50+ installs during campus demos.'",
    "Name the stack explicitly (React Native, Expo, Firebase Firestore, FCN) — ATS systems keyword-match these.",
    "Call out mobile-specific skills: offline storage, push notifications, native navigation, APK build pipeline.",
    "Link the Play Store listing, Expo Snack, or APK download directly in the bullet; reviewers should be one tap away from running it.",
    "Quantify wherever possible: screen count, DAU if any, APK size reduction after optimisation, crash-free rate from Firebase Crashlytics.",
  ],
  interviewRelevance:
    "Mobile projects open discussions that pure web portfolios cannot: **React Native's bridge vs. JSI architecture**, Flutter's **widget tree re-rendering and BuildContext**, offline-first sync patterns, and **Firebase real-time vs. polling trade-offs**. Indian placement interviewers at product companies (Swiggy, PhonePe, Meesho, CRED, Paytm) regularly ask about how you handled slow networks, battery / performance constraints, and push notification delivery — all things you can answer from direct build experience.\n\nPublishing even an internal-track Play Store release shows end-to-end ownership (signing keys, versioning, ProGuard/R8, store listing) that sets you apart from candidates with only GitHub links. Advanced mobile projects also feed naturally into **system design** conversations about client-side caching, background sync queues, CDN-delivered assets, and graceful degradation on 2G/3G — topics that matter deeply in the Indian market.",
  projects: [
    {
      id: "weather-expense-tracker",
      name: "Weather & Expense Tracker",
      level: "Beginner",
      blurb: "A two-in-one utility app that consumes a public API and persists data locally — your first real mobile ship.",
      estimatedTime: "1–2 weekends",
      objective:
        "Build a React Native (Expo) app with two tabs: a live weather screen that calls the OpenWeatherMap API and an expense tracker that lets users log, categorise, and delete daily expenses stored with AsyncStorage. This project proves you can navigate screens, call a REST API, render dynamic data, and persist state across app restarts — the four fundamentals every mobile interview will probe.",
      features: [
        "Location-based current weather fetched from OpenWeatherMap free API (city search + GPS)",
        "5-day forecast rendered in a horizontal scroll list",
        "Expense list with add/delete: amount, category (food/travel/other), date",
        "Total spending summary card with per-category breakdown",
        "All expense data persisted with AsyncStorage (survives app close/restart)",
        "Bottom tab navigation (Weather tab, Expenses tab) via React Navigation",
        "Pull-to-refresh on the weather screen; skeleton loaders and error states",
      ],
      folderStructure: `weather-expense-app/
├── app.json
├── App.tsx                    # entry point, navigation container
├── src/
│   ├── navigation/
│   │   └── TabNavigator.tsx
│   ├── screens/
│   │   ├── WeatherScreen.tsx
│   │   ├── ForecastScreen.tsx
│   │   └── ExpenseScreen.tsx
│   ├── components/
│   │   ├── WeatherCard.tsx
│   │   ├── ForecastItem.tsx
│   │   ├── ExpenseItem.tsx
│   │   └── AddExpenseModal.tsx
│   ├── hooks/
│   │   ├── useWeather.ts      # fetch + caching logic
│   │   └── useExpenses.ts     # AsyncStorage CRUD
│   ├── services/
│   │   └── weatherApi.ts      # axios instance + typed responses
│   ├── types/
│   │   └── index.ts
│   └── constants/
│       └── categories.ts
├── assets/
│   └── icon.png
└── README.md`,
      technologies: [
        "React Native (Expo managed workflow)",
        "TypeScript",
        "React Navigation (Bottom Tabs + Stack)",
        "Axios",
        "AsyncStorage",
        "OpenWeatherMap API (free tier)",
        "Expo Location",
      ],
      skills: [
        "Cross-platform mobile UI with React Native core components",
        "REST API integration with typed responses",
        "Client-side local storage (AsyncStorage)",
        "Tab + stack navigation patterns",
        "Controlled forms and modal sheets on mobile",
      ],
      stretchGoals: [
        "Add weather-based expense suggestions (e.g. 'Looks rainy — add a cab expense?') using a conditional banner",
        "Export expenses as a CSV file and share it via the device share sheet (Expo Sharing)",
        "Add a home-screen widget using Expo Widgets (iOS) or a simple notification summary",
      ],
      futureImprovements: [
        "Replace AsyncStorage with SQLite (expo-sqlite) to support filtering and aggregation queries as the expense list grows",
        "Add a monthly budget cap with push notification alerts when the user is 80% of the way through",
        "Publish to Google Play internal test track to experience the full APK signing and release pipeline",
      ],
    },
    {
      id: "habit-tracker-firebase",
      name: "Habit Tracker with Auth & Push Notifications",
      level: "Intermediate",
      blurb: "A full-featured habit-tracking app with cloud sync, Google sign-in, and daily reminder notifications.",
      estimatedTime: "2–3 weeks",
      objective:
        "Build a production-quality habit tracker where users sign in with Google or email, create daily/weekly habits, mark completions, and receive FCM push notifications as reminders. All data lives in Firestore scoped to the authenticated user. This project demonstrates the complete mobile product loop — auth, cloud data, real-time sync, and push engagement — and directly maps to the architecture of apps like Streaks, Habitica, and Notion.",
      features: [
        "Email/password and Google OAuth sign-in via Firebase Auth",
        "Create, edit, and archive habits with name, icon, target frequency, and reminder time",
        "Daily completion tracking with a streak counter and calendar heatmap view",
        "Real-time Firestore listener so completions sync across devices instantly",
        "FCM push notifications for daily habit reminders (scheduled via cloud Functions trigger)",
        "Progress screen: weekly completion rate per habit rendered as a bar chart",
        "Offline support: Firestore's built-in offline persistence keeps the app usable without connectivity",
      ],
      folderStructure: `habit-tracker/
├── app.json
├── App.tsx
├── src/
│   ├── navigation/
│   │   ├── RootNavigator.tsx   # auth gate (AuthStack vs AppStack)
│   │   ├── AuthStack.tsx
│   │   └── AppTabs.tsx
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── SignUpScreen.tsx
│   │   ├── HabitsScreen.tsx
│   │   ├── AddHabitScreen.tsx
│   │   └── ProgressScreen.tsx
│   ├── components/
│   │   ├── HabitCard.tsx
│   │   ├── StreakBadge.tsx
│   │   ├── CalendarHeatmap.tsx
│   │   └── BarChart.tsx
│   ├── hooks/
│   │   ├── useAuth.ts          # Firebase auth state listener
│   │   ├── useHabits.ts        # Firestore real-time subscription
│   │   └── useNotifications.ts # FCM token registration
│   ├── services/
│   │   ├── firebase.ts         # app init + exports
│   │   ├── authService.ts
│   │   └── habitService.ts     # Firestore CRUD helpers
│   ├── types/
│   │   └── index.ts
│   └── constants/
│       └── icons.ts
├── functions/                  # Firebase Cloud Functions
│   ├── src/
│   │   └── reminders.ts        # scheduled FCM trigger
│   └── package.json
├── assets/
└── README.md`,
      technologies: [
        "React Native (Expo managed workflow)",
        "TypeScript",
        "Firebase Auth (email + Google)",
        "Cloud Firestore (real-time listeners)",
        "Firebase Cloud Messaging (FCM)",
        "Firebase Cloud Functions (Node.js)",
        "Expo Notifications",
        "React Navigation (Auth gate pattern)",
        "Victory Native (charts)",
      ],
      skills: [
        "Firebase Auth with OAuth providers (Google sign-in)",
        "Firestore real-time subscriptions scoped by user ID",
        "Push notification registration and delivery with FCM",
        "Auth-gated navigation (protected routes on mobile)",
        "Offline-first UX leveraging Firestore cache",
        "Scheduled cloud-side triggers with Cloud Functions",
      ],
      stretchGoals: [
        "Add a friend system: users can share streaks and send each other accountability nudges via in-app notifications",
        "Implement a widget (Expo Widgets / react-native-widget-extension) showing today's pending habits on the home screen",
        "Add gamification: XP points and level badges stored in Firestore, with a leaderboard among friends",
      ],
      futureImprovements: [
        "Migrate scheduling from Cloud Functions to Firebase Scheduled Functions with per-user timezone awareness to avoid notification delivery issues across IST and other zones",
        "Add Firestore Security Rules tests using the Firebase Emulator Suite so the data access rules are regression-tested before every deploy",
        "Integrate Firebase Crashlytics and Performance Monitoring to track JS exceptions and screen render times in production",
      ],
    },
    {
      id: "offline-first-social-app",
      name: "Offline-First Social Feed with Maps & Camera",
      level: "Advanced",
      blurb: "A feature-rich app with background sync, device camera, maps, in-app purchases, and a Play Store release.",
      estimatedTime: "4–6 weeks",
      objective:
        "Build a location-tagged social photo feed — users take or upload photos, attach a map pin, add a caption, and post to a shared feed. The app works fully offline: posts are queued in SQLite and synced to Firestore when connectivity resumes using a background sync worker. It integrates the device camera, Google Maps, and optional in-app purchase to unlock a 'Pro' filter pack. The capstone deliverable is a signed APK published to the Google Play internal test track. This project demonstrates architecture-level thinking — offline queue, background work, native device APIs, and store submission — and makes for a compelling advanced interview narrative.",
      features: [
        "Google or phone-number sign-in via Firebase Auth",
        "Camera capture (Expo Camera) and photo library picker; images uploaded to Firebase Storage",
        "Location pin via Expo Location + Google Maps (react-native-maps) embedded in the post composer",
        "Offline-first post creation: posts queued in SQLite when offline, auto-synced to Firestore on reconnect via a background task (Expo Background Fetch / TaskManager)",
        "Infinite-scroll feed with real-time Firestore listener; optimistic UI for new posts",
        "Like and comment system; comments stored as a sub-collection in Firestore",
        "In-app purchase (RevenueCat) to unlock a Pro filter pack applied client-side with Expo GL or react-native-image-filter-kit",
        "Signed APK / AAB build with Expo EAS Build and published to Google Play internal test track",
      ],
      folderStructure: `social-feed-app/
├── app.json                        # Expo config (permissions, plugins)
├── App.tsx
├── src/
│   ├── navigation/
│   │   ├── RootNavigator.tsx
│   │   ├── AuthStack.tsx
│   │   └── MainTabs.tsx            # Feed | Explore | Camera | Profile
│   ├── screens/
│   │   ├── FeedScreen.tsx
│   │   ├── CameraScreen.tsx
│   │   ├── PostComposerScreen.tsx  # caption + map pin + filters
│   │   ├── MapExploreScreen.tsx    # map view of all posts
│   │   ├── PostDetailScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── ProUpgradeScreen.tsx
│   ├── components/
│   │   ├── PostCard.tsx
│   │   ├── MapPin.tsx
│   │   ├── FilterStrip.tsx
│   │   ├── CommentSheet.tsx
│   │   └── OfflineBanner.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useFeed.ts              # Firestore real-time listener
│   │   ├── useOfflineQueue.ts      # SQLite queue + sync
│   │   ├── useCamera.ts
│   │   ├── useLocation.ts
│   │   └── usePurchases.ts         # RevenueCat entitlements
│   ├── services/
│   │   ├── firebase.ts
│   │   ├── storageService.ts       # Firebase Storage upload helpers
│   │   ├── feedService.ts          # Firestore CRUD
│   │   ├── syncWorker.ts           # background fetch + queue drain
│   │   └── db.ts                   # expo-sqlite schema + queries
│   ├── types/
│   │   └── index.ts
│   └── constants/
│       ├── filters.ts
│       └── mapStyle.ts
├── assets/
│   ├── icon.png
│   └── splash.png
└── README.md`,
      technologies: [
        "React Native (Expo managed workflow)",
        "TypeScript",
        "Firebase Auth / Firestore / Storage",
        "expo-sqlite (offline queue)",
        "Expo Background Fetch + TaskManager",
        "Expo Camera + Expo MediaLibrary",
        "react-native-maps + Expo Location",
        "RevenueCat (in-app purchases)",
        "Expo EAS Build (APK / AAB signing)",
        "React Navigation (complex nested navigators)",
      ],
      skills: [
        "Offline-first architecture with SQLite queue and background sync",
        "Native device API integration: camera, photo library, GPS",
        "Google Maps embedded in a React Native app",
        "Firebase Storage for binary asset upload with progress tracking",
        "In-app purchase flow and entitlement checks (RevenueCat)",
        "APK signing, versioning, and Google Play Store submission via EAS",
        "Complex nested navigation with auth gate and deep linking",
      ],
      stretchGoals: [
        "Add real-time typing indicators and read receipts on the comment thread using Firestore presence patterns",
        "Implement content moderation: run uploaded images through the Google Cloud Vision API (Safe Search) in a Cloud Function before making a post public",
        "Add end-to-end encrypted direct messages using the Signal Protocol via a lightweight JS implementation",
      ],
      futureImprovements: [
        "Replace the polling-based background sync with a WorkManager-backed native module (Android) and BGTaskScheduler (iOS) for more reliable wake-ups under Doze mode and iOS background restrictions",
        "Add Firebase Performance Monitoring traces around the image upload flow and SQLite sync to identify bottlenecks on low-end devices (a real concern for the Indian market)",
        "Internationalise the app for Hindi and regional languages using i18n-js or react-native-localize, and set the Play Store listing to target Tier-2 and Tier-3 Indian cities",
      ],
    },
  ],
};
