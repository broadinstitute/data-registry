// Client-side mirror of dataregistry/api/kp_datasets_body.compose_body --
// preview only; the server composes the authoritative body on save.
function esc(s) {
    return String(s ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}

export function composeKpBodyPreview(publication, phenotypeNames, experimentSummary) {
    const pub = publication ? esc(publication) : "Unpublished";
    const items = (phenotypeNames || []).map((p) => `<li>${esc(p)}</li>`).join("");
    return `<h3>Publication</h3><p>${pub}</p>` +
        `<h3>Phenotypes</h3><ul>${items}</ul>` +
        `<h3>Experiment summary</h3><p>${esc(experimentSummary)}</p>`;
}

export function kpDefaultsFromDataset(dataset) {
    return { title: "", experimentSummary: dataset?.description || "" };
}
