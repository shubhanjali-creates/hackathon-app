const MIN_LIFESPAN_MINUTES = 10;
const MAX_LIFESPAN_MINUTES = 2 * 24 * 60; // 2 days
const DEFAULT_LIFESPAN_MINUTES = 24 * 60; // 24 hours

const HASHTAG_INTENT_MAP = {
  food: "food",
  foodsplit: "food",
  foodorder: "food",
  cab: "cab",
  cabsplit: "cab",
  rideshare: "cab",
  resell: "resell",
  sell: "resell",
  buy: "resell",
  lost: "lost",
  found: "lost",
  lostandfound: "lost",
};

function getImageUrl(file) {
  return file ? `/uploads/${file.filename}` : undefined;
}

function parseHashtags(input) {
  if (!input || typeof input !== "string") return [];
  const tags = input
    .split(/[\s,#]+/)
    .map((t) => t.trim().toLowerCase().replace(/^#/, ""))
    .filter(Boolean);
  return [...new Set(tags)];
}

function classifyIntentFromHashtags(hashtags) {
  for (const tag of hashtags) {
    if (HASHTAG_INTENT_MAP[tag]) return HASHTAG_INTENT_MAP[tag];
  }
  return "general";
}

function validatePostFields({ title, description, hashtags, imageUrl }) {
  if (!title || !title.trim()) return "Title is required.";
  if (!description || !description.trim()) return "Description is required.";
  if (!imageUrl) return "An image is required.";
  if (!hashtags || hashtags.length === 0) return "At least one hashtag is required.";
  return null;
}

function parseLifespanMinutes(input) {
  const parsed = parseInt(input, 10);
  let minutes =
    !isNaN(parsed) && parsed > 0 ? parsed : DEFAULT_LIFESPAN_MINUTES;
  minutes = Math.max(MIN_LIFESPAN_MINUTES, Math.min(MAX_LIFESPAN_MINUTES, minutes));
  return minutes;
}

function computeExpiresAtFromMinutes(lifespanMinutes) {
  const minutes = parseLifespanMinutes(lifespanMinutes);
  return {
    expiresAt: new Date(Date.now() + minutes * 60 * 1000),
    lifespanMinutes: minutes,
  };
}

function activeTimedPostFilter() {
  const now = new Date();
  return {
    $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
  };
}

function extractPostInput(req) {
  const title = (req.body.title || "").trim();
  const description = (
    req.body.description ||
    req.body.details ||
    req.body.content ||
    ""
  ).trim();
  const hashtags = parseHashtags(req.body.hashtags);
  const imageUrl = getImageUrl(req.file);

  return { title, description, hashtags, imageUrl };
}

module.exports = {
  MIN_LIFESPAN_MINUTES,
  MAX_LIFESPAN_MINUTES,
  DEFAULT_LIFESPAN_MINUTES,
  getImageUrl,
  parseHashtags,
  classifyIntentFromHashtags,
  validatePostFields,
  parseLifespanMinutes,
  computeExpiresAtFromMinutes,
  activeTimedPostFilter,
  extractPostInput,
};
