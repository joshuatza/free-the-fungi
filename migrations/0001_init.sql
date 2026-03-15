-- Users
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Magic links for passwordless auth
CREATE TABLE IF NOT EXISTS magic_links (
  token TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  username TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  used INTEGER NOT NULL DEFAULT 0
);

-- Posts
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  url TEXT,
  body TEXT,
  post_type TEXT NOT NULL CHECK(post_type IN ('new', 'ask', 'scraped')),
  category TEXT NOT NULL DEFAULT 'general',
  score INTEGER NOT NULL DEFAULT 0,
  comment_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  CONSTRAINT valid_category CHECK(category IN (
    'general', 'science', 'legal', 'therapy',
    'south-africa', 'culture', 'harm-reduction', 'growing'
  ))
);

CREATE INDEX IF NOT EXISTS idx_posts_type ON posts(post_type);
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at);
CREATE INDEX IF NOT EXISTS idx_posts_user ON posts(user_id);

-- Comments
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES posts(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  parent_id TEXT REFERENCES comments(id),
  body TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id);

-- Votes (upvote-only, deduplicated)
CREATE TABLE IF NOT EXISTS votes (
  user_id TEXT NOT NULL,
  target_id TEXT NOT NULL,
  target_type TEXT NOT NULL CHECK(target_type IN ('post', 'comment')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, target_id)
);

-- System bot user for scraped posts
INSERT OR IGNORE INTO users (id, username, email)
VALUES ('ftf-bot', 'ftf-bot', 'bot@freethefungi.org');
