// Pure-math salary calculator for Indian CTC.
// Approximates the New Tax Regime (FY 2025-26 with standard deduction).
// Numbers are illustrative — students should verify with a CA before signing.
//
// CTC composition (typical for Indian SDE roles):
//   Fixed Base ≈ 60-70% of CTC
//   Performance Bonus ≈ 10-15%
//   Joining Bonus / RSU / Sign-on (one-time) ≈ 0-15%
//   PF + Gratuity (employer) ≈ 7-10%
//   Insurance / Perks ≈ 2-5%

export interface CtcBreakdown {
  ctcLpa: number;
  basicLpa: number;            // 50% of fixed
  hraLpa: number;              // 40-50% of basic depending on city
  otherAllowanceLpa: number;
  pfEmployerLpa: number;       // 12% of basic
  gratuityLpa: number;         // 4.81% of basic
  bonusLpa: number;            // annual bonus / variable
  oneTimeLpa: number;          // joining bonus / RSU vest year 1
  insuranceLpa: number;
}

export interface TakehomeBreakdown {
  grossInhandAnnualLpa: number;        // what hits your hand (excl employer PF, gratuity, RSU)
  taxAnnualLpa: number;
  netInhandAnnualLpa: number;
  monthlyInhandRupees: number;         // post tax
}

export interface CityHraTier {
  city: string;
  hraPct: number;                       // % of basic
}

export const CITY_HRA: CityHraTier[] = [
  { city: "Bengaluru", hraPct: 50 },
  { city: "Mumbai", hraPct: 50 },
  { city: "Delhi NCR", hraPct: 50 },
  { city: "Hyderabad", hraPct: 50 },
  { city: "Chennai", hraPct: 50 },
  { city: "Pune", hraPct: 40 },
  { city: "Ahmedabad", hraPct: 40 },
  { city: "Kolkata", hraPct: 40 },
  { city: "Other", hraPct: 40 },
];

export function breakdownCtc(ctcLpa: number, city: string, hasJoiningBonus = false, joiningBonusLpa = 0): CtcBreakdown {
  const hraPct = (CITY_HRA.find((c) => c.city === city) || CITY_HRA[CITY_HRA.length - 1]).hraPct;
  const fixedLpa = ctcLpa * 0.70;               // 70% fixed
  const basicLpa = fixedLpa * 0.50;
  const hraLpa = (basicLpa * hraPct) / 100;
  const otherAllowanceLpa = fixedLpa - basicLpa - hraLpa;
  const pfEmployerLpa = basicLpa * 0.12;
  const gratuityLpa = basicLpa * 0.0481;
  const bonusLpa = ctcLpa * 0.12;
  const insuranceLpa = ctcLpa * 0.03;
  const oneTimeLpa = hasJoiningBonus ? joiningBonusLpa : 0;
  return {
    ctcLpa,
    basicLpa,
    hraLpa,
    otherAllowanceLpa,
    pfEmployerLpa,
    gratuityLpa,
    bonusLpa,
    oneTimeLpa,
    insuranceLpa,
  };
}

// New Tax Regime FY 2025-26 slabs (illustrative, simplified).
// Standard deduction 75k.
export function calcIncomeTax(grossAnnualRupees: number): number {
  const taxable = Math.max(0, grossAnnualRupees - 75_000);
  let tax = 0;
  const slabs: Array<[number, number]> = [
    [400_000, 0],     // 0–4L
    [800_000, 0.05],  // 4–8L
    [1_200_000, 0.10],// 8–12L
    [1_600_000, 0.15],// 12–16L
    [2_000_000, 0.20],// 16–20L
    [2_400_000, 0.25],// 20–24L
    [Infinity, 0.30], // 24L+
  ];
  let lastCap = 0;
  for (const [cap, rate] of slabs) {
    if (taxable <= lastCap) break;
    const slice = Math.min(taxable, cap) - lastCap;
    if (slice <= 0) break;
    tax += slice * rate;
    lastCap = cap;
  }
  // Cess 4% on tax
  return Math.round(tax * 1.04);
}

export function takehome(b: CtcBreakdown): TakehomeBreakdown {
  // In-hand annual = fixed + bonus + oneTime (RSU/joining), excluding employer PF + gratuity + insurance
  const grossInhandAnnualLpa =
    b.basicLpa + b.hraLpa + b.otherAllowanceLpa + b.bonusLpa + b.oneTimeLpa;
  const grossInhandRupees = grossInhandAnnualLpa * 100_000;
  const taxRupees = calcIncomeTax(grossInhandRupees);
  const netInhandRupees = grossInhandRupees - taxRupees;
  return {
    grossInhandAnnualLpa,
    taxAnnualLpa: taxRupees / 100_000,
    netInhandAnnualLpa: netInhandRupees / 100_000,
    monthlyInhandRupees: Math.round(netInhandRupees / 12),
  };
}

export function formatINR(n: number): string {
  return n.toLocaleString("en-IN");
}

export function fmtLpa(n: number): string {
  return `₹${n.toFixed(2)} LPA`;
}
