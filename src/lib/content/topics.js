// src/lib/content/topics.js
// Topic queue for the daily article generator (scripts/generate-article.js).
// Topics are consumed in order; a topic is "done" when a generated article
// carries its id in `topicId`. Add new topics to the end.
//
// STRICT SCOPE: every topic is educational — science, law, policy, history,
// harm-reduction *context*, and culture. Topics NEVER ask for cultivation
// ("growing") instructions, dosing/consumption guidance, or sourcing advice.
// The generator's system prompt enforces the same hard limits.

export const TOPICS = [
  // Law, policy & reform
  { id: 'global-decrim-landscape', title: 'The global psilocybin decriminalisation landscape', angle: 'Where personal-use decriminalisation and regulated-access laws stand around the world (Oregon, Colorado, Australia, parts of Europe), and how approaches differ. Policy overview, no how-to.' },
  { id: 'oregon-psilocybin-services', title: 'Oregon’s regulated psilocybin services model', angle: 'How Oregon built a licensed, supervised psilocybin services framework after Measure 109 — licensing, facilitators, safeguards. Policy/regulatory explainer only.' },
  { id: 'australia-rescheduling', title: 'Australia’s rescheduling of psilocybin for medical use', angle: 'How the TGA moved psilocybin to allow authorised prescribing for treatment-resistant depression, the conditions attached, and the debate around it. No dosing.' },
  { id: 'sa-cannabis-precedent', title: 'How the cannabis judgment reshaped South African drug policy', angle: 'The 2018 Constitutional Court cannabis ruling, the privacy reasoning, and why reform advocates see it as a template for other substances. Legal context.' },
  { id: 'un-drug-conventions', title: 'The UN drug conventions and how psychedelics are scheduled internationally', angle: 'The 1971 Convention on Psychotropic Substances, how it classifies psilocybin, and the tension with emerging research. Neutral policy explainer.' },
  { id: 'decrim-vs-legalisation', title: 'Decriminalisation vs legalisation vs medical access: what the terms mean', angle: 'Plain-language distinctions between these policy models, with examples, so readers can follow the reform debate accurately.' },
  { id: 'cognitive-liberty', title: 'Cognitive liberty: the idea behind many reform arguments', angle: 'The concept of cognitive liberty / freedom of thought as it appears in drug-policy and human-rights debates. Ideas and history, not advocacy of use.' },
  { id: 'right-to-privacy-drug-law', title: 'Privacy rights and drug law: a recurring constitutional theme', angle: 'How privacy arguments have featured in drug-law challenges across jurisdictions, including South Africa. Legal-context overview.' },
  { id: 'harm-of-criminalisation', title: 'What the evidence says about criminalising personal drug use', angle: 'Research and policy analysis on the public-health effects of criminalisation vs decriminalisation. Evidence overview, neutral.' },
  { id: 'portugal-decrim-model', title: 'Portugal’s decriminalisation model, two decades on', angle: 'How Portugal decriminalised personal possession of all drugs in 2001, what the data show, and its relevance to psychedelic-policy debates.' },

  // Science & research
  { id: 'what-is-psilocybin', title: 'What is psilocybin? The basic pharmacology', angle: 'What psilocybin and psilocin are, that psilocybin is a prodrug, and how it acts on 5-HT2A receptors. Pharmacology overview — strictly no dosing.' },
  { id: 'serotonin-2a-receptor', title: 'The serotonin 2A receptor and classic psychedelics', angle: 'Why the 5-HT2A receptor is central to how classic psychedelics work, in plain language. Neuroscience explainer.' },
  { id: 'default-mode-network', title: 'The default mode network and what psychedelics do to it', angle: 'What the default mode network is and what neuroimaging suggests psychedelics do to brain connectivity. Science overview, careful about uncertainty.' },
  { id: 'breakthrough-therapy-designation', title: 'What "breakthrough therapy" designation means for psilocybin', angle: 'What the FDA designation is, why psilocybin therapies received it, and why it is a signal of promise rather than approval.' },
  { id: 'clinical-trial-phases-psychedelics', title: 'How psychedelic medicines move through clinical trials', angle: 'Phases I–III explained in the psychedelic context, why blinding is hard, and what regulators require before approval. No treatment advice.' },
  { id: 'set-and-setting', title: '"Set and setting": why context matters in psychedelic research', angle: 'The research concept of mindset and environment shaping experiences, and why trials control for it. Explains a research idea, not instructions for use.' },
  { id: 'psilocybin-depression-research', title: 'Psilocybin and depression: what the trials have reported', angle: 'A careful summary of published depression trials, effect sizes, and limitations. Research overview only — no dosing, no treatment advice.' },
  { id: 'psilocybin-end-of-life-distress', title: 'Psilocybin research in end-of-life and cancer-related distress', angle: 'What studies with terminally ill patients have examined and found, within supervised clinical settings. Research summary.' },
  { id: 'placebo-problem-psychedelics', title: 'The placebo and blinding problem in psychedelic trials', angle: 'Why it is methodologically hard to blind psychedelic studies and what researchers do about it. Methodology explainer.' },
  { id: 'microdosing-evidence', title: 'Microdosing: what the current evidence actually shows', angle: 'A neutral review of what controlled studies (including placebo-controlled ones) have found about low-dose claims — emphasising uncertainty. No protocols, no dosing guidance.' },
  { id: 'safety-and-contraindications', title: 'Psilocybin safety: risks and contraindications in the research', angle: 'What trials report about acute risks and who is screened out and why. Safety-context overview, explicitly not medical advice.' },
  { id: 'tolerance-and-non-addictiveness', title: 'Why researchers describe classic psychedelics as non-addictive', angle: 'The pharmacological basis for low dependence potential and rapid tolerance. Science explainer, no encouragement of use.' },
  { id: 'entheogens-vs-recreational', title: 'How researchers distinguish therapeutic, ceremonial and recreational use', angle: 'The framing distinctions used in the literature and policy. Conceptual overview.' },
  { id: 'psilocybin-vs-other-psychedelics', title: 'Psilocybin compared with LSD, DMT and mescaline', angle: 'How the classic serotonergic psychedelics differ in duration and origin, at a high level. Comparative science overview — no dosing.' },

  // History & culture
  { id: 'history-western-psychedelic-research', title: 'A short history of Western psychedelic research', angle: 'From the 1950s–60s wave of research, through prohibition, to the modern renaissance. Historical overview.' },
  { id: 'wasson-mexico-1957', title: 'How the West "rediscovered" psilocybin mushrooms', angle: 'The 1950s account that popularised psilocybin mushrooms in the West and the ethical questions it raised about indigenous knowledge. History.' },
  { id: 'indigenous-mushroom-traditions', title: 'Indigenous and traditional uses of psilocybin mushrooms', angle: 'Respectful historical overview of traditional ceremonial use, especially in Mesoamerica, and questions of cultural appropriation. History and ethics, not a how-to.' },
  { id: 'albert-hofmann-psilocybin', title: 'Albert Hofmann and the isolation of psilocybin', angle: 'How the compound was first isolated and synthesised in the 1950s. History of science.' },
  { id: 'why-research-stopped', title: 'Why psychedelic research stopped for decades', angle: 'The political and regulatory forces that halted research after the 1960s, and what changed. Policy history.' },
  { id: 'psychedelic-renaissance', title: 'The "psychedelic renaissance": how research came back', angle: 'The institutions, funding and cultural shifts behind renewed research since the 2000s. Overview.' },

  // Harm-reduction context (principles, not instructions)
  { id: 'harm-reduction-principles', title: 'What harm reduction means as a public-health philosophy', angle: 'The principles of harm reduction as a policy and public-health approach, historically and today. Conceptual — not instructions for using any substance.' },
  { id: 'drug-checking-services', title: 'Drug-checking services and why they exist', angle: 'How drug-checking / reagent services function as a public-health measure in various countries, and the policy debate. Context, not a how-to.' },
  { id: 'misidentification-risks', title: 'Why mushroom misidentification is a serious safety issue', angle: 'The general danger of confusing wild mushrooms with toxic look-alikes, framed as a safety warning. No foraging or identification instructions.' },
  { id: 'integration-in-therapy', title: 'What "integration" means in psychedelic-assisted therapy', angle: 'The therapeutic concept of integrating an experience afterwards, as used by clinicians. Explains a clinical concept, not self-help instructions.' },

  // Movement, ethics & economics
  { id: 'who-is-behind-reform', title: 'Who is driving psychedelic-policy reform', angle: 'The mix of researchers, veterans’ groups, patients, and advocacy organisations shaping the debate. Overview of the movement.' },
  { id: 'veterans-and-ptsd-advocacy', title: 'Why veterans’ groups became prominent in psychedelic advocacy', angle: 'How PTSD and veteran advocacy pushed psychedelic research into mainstream policy conversations. Social overview.' },
  { id: 'commercialisation-of-psychedelics', title: 'The commercialisation of psychedelics: patents and startups', angle: 'The debate over patenting psychedelic therapies and the rise of for-profit companies. Ethics and economics overview.' },
  { id: 'equity-and-access', title: 'Equity and access in the psychedelic-therapy debate', angle: 'Concerns that regulated psychedelic therapy could be expensive and inaccessible, and proposals to address it. Policy discussion.' },
  { id: 'religious-freedom-psychedelics', title: 'Religious-freedom arguments and psychedelic sacraments', angle: 'How some legal cases have used freedom-of-religion protections, e.g. for ceremonial use. Legal-context overview.' },
  { id: 'decrim-nature-movements', title: 'City and local "decriminalise nature" movements', angle: 'How municipal resolutions in some US cities de-prioritised enforcement for natural psychedelics, and their limits. Policy overview.' },
  { id: 'media-framing-psychedelics', title: 'How media coverage of psychedelics has shifted', angle: 'From "drug scare" framing to "promising medicine" framing, and the risks of hype. Media and science-communication analysis.' },
  { id: 'measuring-public-opinion', title: 'What public-opinion data show about psychedelic reform', angle: 'Survey trends on support for decriminalisation and medical access. Data overview.' },
  { id: 'south-africa-reform-outlook', title: 'The outlook for psilocybin reform in South Africa', angle: 'Where the South African debate stands, the actors involved, and possible paths forward. Neutral policy analysis.' },
  { id: 'terminology-guide', title: 'A glossary of psychedelic-policy terms', angle: 'Clear definitions of scheduling, decriminalisation, prohibition, rescheduling, prodrug, and related terms, so readers can follow the debate.' },
];
