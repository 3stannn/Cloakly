export const articles = [
  {
    slug: "what-perturbation-research-shows",
    title: "What perturbation research can—and cannot—show",
    summary: "A plain-language look at PhotoGuard’s targeted image-editing experiments, their stated limits, and what that means for a protection proposal.",
    topicLabel: "Adversarial perturbations",
    topicSlug: "adversarial-perturbations",
    reviewedAt: "2026-10-13",
    sourceIds: ["photoGuard", "nistSyntheticContent", "esafetyConsent"],
    blocks: [
      {
        type: "paragraph",
        parts: [
          { type: "text", text: "Adversarial perturbations are carefully chosen changes to data that can influence a machine-learning model. In image-protection research, the aim is to make a change hard for a person to notice while causing a particular editing system to behave differently. That is a research direction, not a universal safety property." },
          { type: "cite", sourceId: "photoGuard" },
        ],
      },
      { type: "heading", level: 2, text: "What PhotoGuard tested" },
      {
        type: "paragraph",
        parts: [
          { type: "text", text: "Salman, Khaddaj, Leclerc, Ilyas, and Madry’s 2023 paper, “Raising the Cost of Malicious AI-Powered Image Editing,” proposes PhotoGuard methods aimed at disrupting certain latent diffusion image-editing requests. The paper studies whether perturbations can interfere with those selected editing workflows. Its result should be read in that setting: it does not establish that every image editor, all possible edits, or every future model will be stopped." },
          { type: "cite", sourceId: "photoGuard" },
        ],
      },
      {
        type: "paragraph",
        parts: [
          { type: "text", text: "The authors also discuss limits that matter outside a lab test. Transformations such as cropping, filtering, or rotation may remove the perturbation’s effect, and a future model version may respond differently. These are stated research limitations; the paper does not establish a specific outcome for every kind of resizing or recompression." },
          { type: "cite", sourceId: "photoGuard" },
        ],
      },
      { type: "heading", level: 2, text: "How to read a narrow result" },
      {
        type: "paragraph",
        parts: [
          { type: "text", text: "A useful research result answers a defined question under defined conditions. It can help researchers compare methods and find weaknesses. It does not tell a person that a particular file is protected in every context. NIST’s broader review likewise says technical transparency methods vary by use case and do not offer a complete solution on their own." },
          { type: "cite", sourceId: "nistSyntheticContent" },
        ],
      },
      {
        type: "list",
        items: [
          { parts: [{ type: "text", text: "Ask what model, edit, and input conditions were actually evaluated." }, { type: "cite", sourceId: "photoGuard" }] },
          { parts: [{ type: "text", text: "Look for transformations and model changes that the researchers identify as limitations." }, { type: "cite", sourceId: "photoGuard" }] },
          { parts: [{ type: "text", text: "Treat a demo or proposal as an explanation of an idea unless it reports a tested result for the case you care about." }] },
        ],
      },
      { type: "heading", level: 2, text: "What this means for Cloakly" },
      {
        type: "paragraph",
        parts: [
          { type: "text", text: "Cloakly’s current homepage simulation is a static visual concept. It does not process an uploaded image or verify that a photo received protection. The proposal is best understood as a question for ongoing research, not a promise that a person can safely publish any image after applying a cloak." },
        ],
      },
      {
        type: "paragraph",
        parts: [
          { type: "text", text: "If you want to see how the concept is presented, you can " },
          { type: "link", to: "/#simulation", text: "visit the simulation" },
          { type: "text", text: ". Keep making sharing decisions based on consent, audience, and the potential impact if a copy travels further." },
          { type: "cite", sourceId: "esafetyConsent" },
        ],
      },
      { type: "heading", level: 2, text: "References" },
    ],
  },
  {
    slug: "share-with-care",
    title: "A practical guide to sharing with care",
    summary: "A quick framework for asking before sharing, considering creator rights, and managing privacy across ordinary and sensitive imagery.",
    topicLabel: "Responsible sharing & privacy",
    topicSlug: "responsible-sharing",
    reviewedAt: "2026-10-13",
    sourceIds: ["esafetyConsent", "esafetyGuide", "esafetyDigitalReputation", "usCopyrightPhotography"],
    blocks: [
      {
        type: "paragraph",
        parts: [
          { type: "text", text: "A photo does not need to be manipulated to raise a privacy question. A family picture, a work portrait, a public event image, or a sensitive image can all reach a new audience when someone forwards or reposts it. Before sharing, consider who is pictured, who made the image, and what this audience may do with it." },
          { type: "cite", sourceId: "esafetyConsent" },
        ],
      },
      { type: "heading", level: 2, text: "Ask about this share" },
      {
        type: "paragraph",
        parts: [
          { type: "text", text: "Ask before you post or forward someone else’s photo, and explain the audience or context. eSafety describes genuine consent as informed and freely given, and notes that a person can change their mind. An earlier yes to one audience does not answer every later question about reposting, tagging, or adding a new caption." },
          { type: "cite", sourceId: "esafetyConsent" },
        ],
      },
      {
        type: "paragraph",
        parts: [
          { type: "text", text: "Once a post is online, other people may copy it, so removing the original may not remove every copy. If someone asks you to take something down, remove your own post where you can and avoid circulating it further." },
          { type: "cite", sourceId: "esafetyConsent" },
        ],
      },
      { type: "heading", level: 2, text: "Separate the person’s consent from the creator’s rights" },
      {
        type: "paragraph",
        parts: [
          { type: "text", text: "Permission from the person shown and permission to reuse a creator’s work are different questions. The U.S. Copyright Office says a photographer generally owns copyright in their photograph, even where someone else is pictured. Copyright rules and exceptions depend on the jurisdiction and use; this U.S. source is a starting point, not legal advice for every situation." },
          { type: "cite", sourceId: "usCopyrightPhotography" },
        ],
      },
      { type: "heading", level: 2, text: "Use account controls as one layer" },
      {
        type: "paragraph",
        parts: [
          { type: "text", text: "Review who can see your posts, contact you, or tag you. Platform settings can help manage your digital presence, but they cannot guarantee that nobody saves or copies something they can view. Revisit the settings occasionally and consult the service’s own help pages because controls differ by platform." },
          { type: "cite", sourceId: "esafetyGuide" },
          { type: "cite", sourceId: "esafetyDigitalReputation" },
        ],
      },
      {
        type: "list",
        items: [
          { parts: [{ type: "text", text: "Pause before forwarding an image that could embarrass, expose, or misrepresent someone." }] },
          { parts: [{ type: "text", text: "Ask the person and, where relevant, the photographer or creator before reuse." }, { type: "cite", sourceId: "esafetyConsent" }, { type: "cite", sourceId: "usCopyrightPhotography" }] },
          { parts: [{ type: "text", text: "If the image is being shared without consent, use the platform’s reporting and removal tools and seek trusted local support." }, { type: "cite", sourceId: "esafetyGuide" }] },
        ],
      },
      { type: "heading", level: 2, text: "References" },
    ],
  },
  {
    slug: "check-context-before-you-share",
    title: "A careful way to check suspicious media",
    summary: "Slow down, examine the source and context, and keep uncertainty visible instead of treating a checklist or detector as proof.",
    topicLabel: "Deepfake basics",
    topicSlug: "deepfake-basics",
    reviewedAt: "2026-10-13",
    sourceIds: ["nistSyntheticContent", "esafetyConsent"],
    blocks: [
      {
        type: "paragraph",
        parts: [
          { type: "text", text: "A convincing clip may still be edited, and an awkward-looking frame may be genuine. NIST’s review describes automated detection as an evolving area with limits and emphasizes that technical transparency can contribute information without guaranteeing trust. The goal of a careful check is to improve your context, not to produce certainty from appearance alone." },
          { type: "cite", sourceId: "nistSyntheticContent" },
        ],
      },
      { type: "heading", level: 2, text: "Start with the source" },
      {
        type: "paragraph",
        parts: [
          { type: "text", text: "Notice where you found the media and who is making the claim around it. Look for an earlier source or a fuller version, and compare the description with information from the person, organization, or event involved. NIST calls information about a file’s origin and history provenance; provenance can help, but it does not settle whether the content is shown in context." },
          { type: "cite", sourceId: "nistSyntheticContent" },
        ],
      },
      { type: "heading", level: 2, text: "Use visible details as questions" },
      {
        type: "paragraph",
        parts: [
          { type: "text", text: "You might notice an inconsistent reflection, lighting, shadow, or blend. Treat it as a prompt to investigate, not a verdict: everyday recording conditions, editing, and compression can also affect an image. Human judgment varies, and the absence of an obvious flaw does not prove authenticity." },
          { type: "cite", sourceId: "nistSyntheticContent" },
        ],
      },
      {
        type: "list",
        items: [
          { parts: [{ type: "text", text: "Pause before resharing, especially when the claim could affect someone’s safety, reputation, or privacy." }] },
          { parts: [{ type: "text", text: "Separate what the media visibly shows from what a caption says it proves." }, { type: "cite", sourceId: "nistSyntheticContent" }] },
          { parts: [{ type: "text", text: "Seek independent, relevant context; do not treat a single detector, label, or visual checklist as a final answer." }, { type: "cite", sourceId: "nistSyntheticContent" }] },
          { parts: [{ type: "text", text: "If the media depicts a person, consider consent and possible harm even if you cannot tell whether it is synthetic." }, { type: "cite", sourceId: "esafetyConsent" }] },
        ],
      },
      {
        type: "paragraph",
        parts: [
          { type: "text", text: "If you still cannot establish the source or context, say so—or choose not to pass the media along. Uncertainty is a useful reason to slow down, not a gap that needs to be filled with a guess." },
          { type: "cite", sourceId: "nistSyntheticContent" },
        ],
      },
      { type: "heading", level: 2, text: "References" },
    ],
  },
  {
    slug: "responding-to-impersonation",
    title: "Responding when someone impersonates you",
    summary: "A calm set of first steps for preserving evidence, reporting fake accounts, and finding support that fits your location.",
    topicLabel: "Responsible sharing & privacy",
    topicSlug: "responsible-sharing",
    reviewedAt: "2026-10-13",
    sourceIds: ["esafetyGuide", "esafetyImpersonation", "esafetyReport"],
    blocks: [
      {
        type: "paragraph",
        parts: [
          { type: "text", text: "A fake account can use a real person’s name, photo, or other details to mislead people. The first priority is to avoid giving it more reach while keeping enough information to report what happened." },
          { type: "cite", sourceId: "esafetyImpersonation" },
        ],
      },
      { type: "heading", level: 2, text: "Keep a record, then report it" },
      {
        type: "list",
        items: [
          { parts: [{ type: "text", text: "Save the account handle, profile link, dates, and screenshots of relevant posts or messages." }, { type: "cite", sourceId: "esafetyImpersonation" }] },
          { parts: [{ type: "text", text: "Use the platform’s report flow for impersonation or fake accounts; the eSafety Guide links to platform-specific help." }, { type: "cite", sourceId: "esafetyGuide" }, { type: "cite", sourceId: "esafetyImpersonation" }] },
          { parts: [{ type: "text", text: "Tell trusted contacts where appropriate and ask them not to engage with or reshare the account." }] },
        ],
      },
      { type: "heading", level: 2, text: "Choose support for your location" },
      {
        type: "paragraph",
        parts: [
          { type: "text", text: "The eSafety Commissioner is Australia’s online safety regulator, and its formal reporting service is limited to matters within its remit. If you are outside Australia, check the reporting and support services in your own region and use the platform’s report tools. If there is an immediate safety risk, contact local emergency or trusted support services." },
          { type: "cite", sourceId: "esafetyReport" },
          { type: "cite", sourceId: "esafetyGuide" },
        ],
      },
      {
        type: "paragraph",
        parts: [
          { type: "text", text: "The eSafety impersonation resource is part of its LGBTIQ+ Learning Lounge. Its platform-reporting advice may be useful more broadly; its examples and service links reflect that resource’s context." },
          { type: "cite", sourceId: "esafetyImpersonation" },
        ],
      },
      { type: "heading", level: 2, text: "References" },
    ],
  },
];

export function getArticle(slug) {
  return articles.find((article) => article.slug === slug);
}
