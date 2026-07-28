// ────────────────────────────────────────────────────────────────────────────
//  Web Development domain — the Vision 3.0 reference curriculum.
//  Original content synthesised from MDN / React / Node docs used as references
//  only (no copied text). Module 1 (Foundations) is authored to full depth as
//  the template every other lesson/module follows — see docs/CONTENT_AUTHORING.md.
// ────────────────────────────────────────────────────────────────────────────
import type { Module } from "../types";
import { foundations } from "./foundations";
import { coreSkills } from "./core-skills";
import { stylingLayout } from "./styling-layout";
import { jsDeepDive } from "./js-deep-dive";

export const modules: Module[] = [foundations, coreSkills, stylingLayout, jsDeepDive];
