import { describe, expect, it } from "vitest";
import { composeKpBodyPreview, kpDefaultsFromDataset } from "../utils/kpDataset.js";

describe("composeKpBodyPreview", () => {
    it("mirrors the server section pattern", () => {
        expect(composeKpBodyPreview("Unpublished", ["Triglyceride to HDL levels"], "A summary."))
            .toBe("<h3>Publication</h3><p>Unpublished</p>" +
                  "<h3>Phenotypes</h3><ul><li>Triglyceride to HDL levels</li></ul>" +
                  "<h3>Experiment summary</h3><p>A summary.</p>");
    });
    it("defaults empty publication to Unpublished and escapes user text", () => {
        const body = composeKpBodyPreview("", ["T2D & obesity"], "a < b");
        expect(body).toContain("<h3>Publication</h3><p>Unpublished</p>");
        expect(body).toContain("T2D &amp; obesity");
        expect(body).toContain("a &lt; b");
    });
});

describe("kpDefaultsFromDataset", () => {
    it("prefills experiment summary from description, empty title", () => {
        expect(kpDefaultsFromDataset({ description: "desc here", name: "X" }))
            .toEqual({ title: "", experimentSummary: "desc here" });
        expect(kpDefaultsFromDataset({})).toEqual({ title: "", experimentSummary: "" });
    });
});
