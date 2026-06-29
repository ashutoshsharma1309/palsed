import type { ProjectDomain } from "./types";

export const blockchain: ProjectDomain = {
  id: "blockchain",
  title: "Blockchain",
  icon: "Boxes",
  accent: "purple",
  blurb: "Build Web3 dApps and smart contracts — a rare, differentiating skill in Indian placements.",
  overview:
    "Blockchain engineering sits at the intersection of distributed systems, cryptography, and product development. You'll write **Solidity smart contracts** that run on the Ethereum Virtual Machine, connect them to React frontends via **ethers.js**, and deploy them to public testnets — giving you a live, verifiable portfolio that anyone can inspect on Etherscan. The domain rewards programmers who care about correctness: every bug in a deployed contract is potentially irreversible and costly, so you'll internalize test-driven development and audited security patterns (OpenZeppelin) from day one.\n\nIn India's placement landscape, blockchain is still a niche — but that's precisely its advantage. Very few CS graduates can discuss reentrancy guards, the ERC-20 allowance pattern, or IPFS content addressing from direct experience. That rarity makes you memorable at companies with a Web3 division (Polygon, Coinbase India, CoinDCX, WazirX, Consensys) and at startups building on-chain products. Even at traditional product companies, demonstrating that you've shipped to a live blockchain signals strong fundamentals in cryptography, distributed consensus, and adversarial programming.",
  skillsRequired: [
    "Comfortable JavaScript / TypeScript (async/await, modules, fetch)",
    "React basics (hooks, state, component lifecycle)",
    "Familiarity with Git & command line",
    "Basic understanding of public-key cryptography (optional but helpful)",
    "Willingness to read official documentation carefully",
  ],
  learningOrder: [
    "Blockchain fundamentals: how Ethereum works, accounts, transactions, gas, and the EVM",
    "Solidity syntax: types, functions, visibility modifiers, events, mappings, structs",
    "OpenZeppelin contracts: inherit audited ERC-20/ERC-721 base contracts rather than writing from scratch",
    "Local development with Hardhat (or Foundry): compile, test with ethers.js / Chai, deploy to a local node",
    "Writing Solidity tests: unit tests covering happy paths, edge cases, and attack vectors (reentrancy, integer overflow)",
    "Connecting a frontend with ethers.js or viem: wallet connect (MetaMask), read contract state, send transactions",
    "Deploy to a public testnet (Sepolia) and verify the contract on Etherscan",
    "IPFS basics: pin files with Pinata or nft.storage; store and retrieve content-addressed metadata",
  ],
  difficulty: "Intermediate → Advanced",
  techStack: [
    "Solidity (^0.8.x)",
    "Hardhat / Foundry",
    "OpenZeppelin Contracts",
    "ethers.js v6 / viem",
    "React + Vite",
    "IPFS / Pinata",
    "Sepolia / Polygon Mumbai testnet",
    "Etherscan (contract verification)",
  ],
  githubResources: [
    {
      label: "Awesome Solidity",
      url: "https://github.com/bkrem/awesome-solidity",
      kind: "repo",
    },
    {
      label: "OpenZeppelin Contracts",
      url: "https://github.com/OpenZeppelin/openzeppelin-contracts",
      kind: "repo",
    },
    {
      label: "Hardhat — Ethereum development environment",
      url: "https://github.com/NomicFoundation/hardhat",
      kind: "tool",
    },
    {
      label: "scaffold-eth-2 — full-stack dApp starter",
      url: "https://github.com/scaffold-eth/scaffold-eth-2",
      kind: "repo",
    },
    {
      label: "Damn Vulnerable DeFi — security practice",
      url: "https://github.com/tinchoabbate/damn-vulnerable-defi",
      kind: "repo",
    },
  ],
  learningResources: [
    {
      label: "CryptoZombies — interactive Solidity tutorial",
      url: "https://cryptozombies.io/",
      kind: "course",
    },
    {
      label: "Solidity official documentation",
      url: "https://docs.soliditylang.org/",
      kind: "docs",
    },
    {
      label: "ethereum.org — developer documentation",
      url: "https://ethereum.org/en/developers/docs/",
      kind: "docs",
    },
    {
      label: "Patrick Collins — Solidity & Foundry full course (freeCodeCamp, 32 h)",
      url: "https://www.youtube.com/watch?v=umepbfKp5rI",
      kind: "video",
    },
    {
      label: "roadmap.sh — Blockchain Developer Roadmap",
      url: "https://roadmap.sh/blockchain",
      kind: "roadmap",
    },
  ],
  portfolioTips: [
    "Always deploy to a public testnet (Sepolia) and include the Etherscan-verified contract address in your README — it proves the code runs on real infrastructure.",
    "Verify the contract source on Etherscan (npx hardhat verify) so reviewers can read your Solidity directly from the block explorer.",
    "Record a short Loom/GIF showing the MetaMask wallet connecting, a transaction being signed, and the on-chain state updating — recruiters who aren\'t crypto-native will appreciate the demo.",
    "Show your test suite output (test coverage screenshot or CI badge) — it signals you understand that bugs in contracts are irreversible.",
    "Host the React frontend on Vercel with a live testnet URL so anyone can interact without cloning the repo.",
  ],
  resumeTips: [
    "State the network and standard explicitly: \'Deployed ERC-20 token to Ethereum Sepolia testnet; contract verified on Etherscan.\'",
    "Quantify security: \'Achieved 100% unit-test coverage with Hardhat; implemented OpenZeppelin ReentrancyGuard and Ownable patterns.\'",
    "Name the full stack: Solidity 0.8, Hardhat, ethers.js, React — recruiters keyword-match these terms.",
    "Link the Etherscan page and the live dApp URL in the bullet; a verifiable on-chain deployment is stronger proof than a GitHub link alone.",
  ],
  interviewRelevance:
    "Blockchain projects are a strong differentiator in Indian placements because they are genuinely rare. Here\'s how to leverage them:\n\n**What interviewers at Web3 companies ask about:**\n- *How does your ERC-20 token prevent reentrancy attacks?* — walk through the checks-effects-interactions pattern and your use of OpenZeppelin\'s `ReentrancyGuard`.\n- *Why did you choose IPFS for metadata storage instead of storing it on-chain?* — demonstrates awareness of gas costs and on-chain storage limits.\n- *How would you upgrade your smart contract?* — opens a discussion of proxy patterns (UUPS, Transparent Proxy) and immutability trade-offs.\n\n**At general product companies**, blockchain projects signal:\n- Strong security and adversarial thinking (you can\'t patch a deployed contract).\n- Comfort with distributed systems concepts (consensus, finality, Merkle trees).\n- Ability to learn and ship in a rapidly evolving ecosystem.\n\n**India-specific context:** Polygon Labs, CoinDCX, WazirX, Mudrex, and many funded Web3 startups actively recruit from campus. Even if the role is a general SWE position, having a deployed dApp on your resume prompts interviewers to give you harder, more interesting questions — which is your opportunity to stand out.",
  projects: [
    {
      id: "erc20-token-testnet",
      name: "ERC-20 Token with Voting Frontend",
      level: "Beginner",
      blurb: "Deploy your own fungible token to a testnet and let users vote on proposals with it.",
      estimatedTime: "1–2 weekends",
      objective:
        "Write and deploy an ERC-20 token smart contract (inheriting OpenZeppelin\'s audited base) to the Ethereum Sepolia testnet, then build a minimal React frontend where connected wallet holders can cast on-chain votes on simple text proposals. The project proves you can write, test, and deploy a real Solidity contract and wire it to a wallet-connected UI — the foundational skill loop for all Web3 development.",
      features: [
        "ERC-20 token contract inheriting OpenZeppelin\'s ERC20 and Ownable; owner can mint tokens",
        "Separate Voting contract that reads token balances for vote weight (token-weighted voting)",
        "MetaMask wallet connection via ethers.js; display connected address and token balance",
        "Create proposal form (owner only) and vote button (any token holder)",
        "Real-time vote tally fetched from on-chain events",
        "Deployed to Sepolia testnet with source verified on Etherscan",
        "Hardhat test suite covering mint, transfer, and vote edge cases",
      ],
      folderStructure: `erc20-voting/
├── contracts/
│   ├── MyToken.sol          # ERC-20, inherits OZ ERC20 + Ownable
│   └── Voting.sol           # token-weighted proposals + votes
├── test/
│   ├── MyToken.test.js      # mint, transfer, allowance
│   └── Voting.test.js       # propose, vote, double-vote guard
├── scripts/
│   └── deploy.js            # deploy both contracts, log addresses
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ConnectWallet.tsx
│   │   │   ├── ProposalList.tsx
│   │   │   └── VoteButton.tsx
│   │   ├── hooks/
│   │   │   └── useContract.ts   # ethers.js contract instances
│   │   ├── lib/
│   │   │   └── constants.ts     # deployed addresses + ABIs
│   │   └── App.tsx
│   └── package.json
├── hardhat.config.js
├── .env.example             # PRIVATE_KEY, SEPOLIA_RPC_URL, ETHERSCAN_KEY
└── README.md`,
      technologies: [
        "Solidity 0.8.x",
        "OpenZeppelin Contracts (ERC20, Ownable)",
        "Hardhat + ethers.js + Chai",
        "React + Vite + TypeScript",
        "ethers.js v6",
        "MetaMask",
        "Sepolia testnet",
      ],
      skills: [
        "Writing and inheriting OpenZeppelin ERC-20 contracts",
        "Hardhat compile / test / deploy workflow",
        "Wallet connection with ethers.js",
        "Reading and writing contract state from a React frontend",
        "Testnet deployment and Etherscan contract verification",
        "Environment variable management for private keys",
      ],
      stretchGoals: [
        "Add a time-locked voting window (proposals expire after N blocks using block.timestamp)",
        "Emit and index Voted events; display a live feed of recent votes using ethers.js event listeners",
        "Add a faucet endpoint so anyone can claim test tokens without needing the owner wallet",
      ],
      futureImprovements: [
        "Implement a delegation pattern (ERC20Votes) so token holders can delegate their vote weight",
        "Replace manual ABI imports with typechain-generated TypeScript types for compile-time safety",
        "Add a Snapshot integration so off-chain governance signals can be recorded on-chain cheaply",
      ],
    },
    {
      id: "nft-minting-dapp",
      name: "NFT Minting dApp with IPFS Metadata",
      level: "Intermediate",
      blurb: "A full on-chain NFT collection — mint, view, and transfer — with metadata pinned to IPFS.",
      estimatedTime: "2–3 weeks",
      objective:
        "Build an end-to-end NFT minting site: an ERC-721 smart contract (OpenZeppelin) where users pay a mint price in ETH to receive a unique NFT, with metadata (name, description, image) pinned to IPFS via Pinata. The React frontend shows the gallery of minted tokens pulled from on-chain events and IPFS. This project demonstrates the complete Web3 stack — on-chain ownership, decentralized storage, wallet UX, and event-driven data loading — and mirrors real NFT launches in production.",
      features: [
        "ERC-721 contract with a capped supply, per-wallet mint limit, and an ETH mint price set by the owner",
        "Withdraw function (Ownable) so the contract owner can pull collected ETH",
        "Metadata JSON (name, description, image URL) pinned to IPFS with Pinata; tokenURI returns the IPFS gateway URL",
        "React gallery that reads Transfer events to list all minted token IDs and fetches metadata from IPFS",
        "Mint button with live supply counter (X / maxSupply minted) and real-time transaction status toasts",
        "OpenSea testnet link for each minted token (Sepolia is supported by OpenSea\'s testnet)",
        "Hardhat tests covering mint limits, ETH collection, withdrawal, and URI correctness",
      ],
      folderStructure: `nft-minting-dapp/
├── contracts/
│   └── MyNFT.sol            # ERC-721, OZ ERC721URIStorage + Ownable
├── test/
│   └── MyNFT.test.js        # cap, per-wallet limit, price, withdraw
├── scripts/
│   ├── upload-metadata.js   # pin images + JSON to IPFS via Pinata SDK
│   └── deploy.js            # deploy contract with baseURI from IPFS
├── metadata/
│   ├── images/              # source NFT images (1.png, 2.png …)
│   └── json/                # generated JSON metadata files
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MintButton.tsx
│   │   │   ├── SupplyBar.tsx
│   │   │   └── NFTGallery.tsx
│   │   ├── hooks/
│   │   │   ├── useNFTContract.ts
│   │   │   └── useIPFSMetadata.ts
│   │   ├── lib/
│   │   │   └── pinata.ts    # Pinata SDK helpers
│   │   └── App.tsx
│   └── package.json
├── hardhat.config.js
├── .env.example
└── README.md`,
      technologies: [
        "Solidity 0.8.x",
        "OpenZeppelin Contracts (ERC721URIStorage, Ownable, ReentrancyGuard)",
        "Hardhat + Chai",
        "React + Vite + TypeScript",
        "ethers.js v6",
        "IPFS / Pinata SDK",
        "MetaMask / WalletConnect",
        "Sepolia testnet + OpenSea Testnet",
      ],
      skills: [
        "ERC-721 contract design with supply caps and pricing",
        "Decentralized file storage with IPFS and Pinata",
        "Event-driven data loading from the blockchain (Transfer events)",
        "ETH value handling in smart contracts (payable, withdraw pattern)",
        "OpenZeppelin ReentrancyGuard usage",
        "Full dApp deployment: contract on Sepolia + frontend on Vercel",
      ],
      stretchGoals: [
        "Implement a whitelist phase using a Merkle-tree allowlist so early supporters can mint at a lower price before public sale",
        "Add lazy minting (sign off-chain vouchers) so the contract only charges gas when a buyer redeems, not when you create new tokens",
        "Integrate WalletConnect v2 so mobile wallet users can mint without MetaMask",
      ],
      futureImprovements: [
        "Move from Pinata to a self-hosted IPFS node or Filecoin deal to remove the centralized pinning dependency",
        "Add an on-chain royalty standard (ERC-2981) so the creator earns a percentage on secondary sales",
        "Build an admin dashboard for the owner to toggle sale phases, update base URI, and trigger withdrawals",
      ],
    },
    {
      id: "defi-staking-protocol",
      name: "DeFi Staking & Yield Protocol",
      level: "Advanced",
      blurb: "A DeFi staking contract where users lock tokens to earn yield — with thorough tests and security hardening.",
      estimatedTime: "3–5 weeks",
      objective:
        "Design and deploy a DeFi staking protocol: users deposit an ERC-20 token into a Staking contract and earn a separate Reward token over time proportional to their share of the pool. The system mirrors real DeFi protocols (Synthetix-style staking rewards) and requires you to handle complex math (reward-per-token accumulator pattern), multiple security vectors (reentrancy, flash-loan manipulation, precision loss), and a governance withdraw mechanism. This is the project that puts you in serious conversations about DeFi architecture, smart contract security, and protocol design.",
      features: [
        "StakingToken (ERC-20) and RewardToken (ERC-20) — deploy both, fund the staking contract with rewards",
        "Stake and unstake functions with time-locked minimum staking period enforced via block.timestamp",
        "Reward accumulator pattern: rewardPerTokenStored and userRewardPerTokenPaid correctly distribute yield to late joiners without iterating over all stakers",
        "claimReward function with checks-effects-interactions ordering and OpenZeppelin ReentrancyGuard",
        "Emergency pause (OpenZeppelin Pausable) controlled by the owner for circuit-breaker scenarios",
        "React dashboard: connect wallet, display staked balance, pending rewards, APY estimate, and stake/unstake/claim buttons",
        "Comprehensive Hardhat test suite: unit tests for math precision, reentrancy attempt simulation, pause/unpause, and time-warping to test reward accrual",
      ],
      folderStructure: `defi-staking/
├── contracts/
│   ├── StakingToken.sol       # mintable ERC-20 for testing
│   ├── RewardToken.sol        # reward ERC-20, minted by staking contract
│   └── StakingRewards.sol     # core protocol: stake, unstake, claim
├── test/
│   ├── StakingRewards.test.js # reward math, reentrancy, pause, precision
│   └── helpers/
│       └── time.js            # evm_increaseTime helpers
├── scripts/
│   ├── deploy.js              # deploy tokens + staking contract, fund rewards
│   └── seed.js                # stake from test wallets for demo
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── StakingPanel.tsx     # stake / unstake form
│   │   │   ├── RewardDisplay.tsx    # live pending rewards
│   │   │   └── PoolStats.tsx        # TVL, APY, total stakers
│   │   ├── hooks/
│   │   │   ├── useStakingContract.ts
│   │   │   └── useRewardAccrual.ts  # poll rewardPerToken every block
│   │   ├── lib/
│   │   │   └── apy.ts              # off-chain APY estimate helper
│   │   └── App.tsx
│   └── package.json
├── hardhat.config.js
├── .env.example
└── README.md`,
      technologies: [
        "Solidity 0.8.x",
        "OpenZeppelin Contracts (ERC20, Ownable, ReentrancyGuard, Pausable)",
        "Hardhat + ethers.js + Chai + hardhat-network-helpers (time warping)",
        "React + Vite + TypeScript",
        "ethers.js v6",
        "Sepolia testnet",
        "Etherscan contract verification",
      ],
      skills: [
        "DeFi reward accumulator math (rewardPerToken pattern)",
        "Multi-contract system design (token + protocol separation)",
        "Smart contract security: reentrancy, checks-effects-interactions, integer precision",
        "OpenZeppelin Pausable and ReentrancyGuard in production patterns",
        "Time-warp testing with Hardhat network helpers",
        "Reading live chain state and rendering real-time DeFi dashboards",
        "Protocol documentation and architecture decision records",
      ],
      stretchGoals: [
        "Add a multiplier boost: users who lock tokens for 90 days earn 1.5x rewards, incentivizing long-term commitment",
        "Write a Slither static analysis report and resolve all high/medium findings before deploying",
        "Implement a UUPS upgradeable proxy pattern so the reward rate can be updated without migrating user funds",
      ],
      futureImprovements: [
        "Add a governance module (OpenZeppelin Governor) so reward-token holders can vote to change emission rates",
        "Integrate Chainlink price feeds to display USD-denominated TVL and APY on the dashboard",
        "Commission a mock audit using code4rena or Sherlock\'s contest format to practice addressing audit findings",
      ],
    },
  ],
};
