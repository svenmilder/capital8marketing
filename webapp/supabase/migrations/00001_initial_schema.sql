-- Capital8 Marketing Command Center — Initial Schema
-- Includes all tables from webapp-spec + hardening indexes + multi-user + skill evolution + AI usage

-- ============================================================
-- 1. User profiles (extends Supabase auth.users)
-- ============================================================
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'creator', 'specialist', 'viewer')),
  specialist_domain TEXT CHECK (
    (role = 'specialist' AND specialist_domain IN ('content', 'seo', 'paid_ads', 'email')) OR
    (role != 'specialist' AND specialist_domain IS NULL)
  ),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  invited_by UUID REFERENCES auth.users(id),
  last_active_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_user_profiles_role ON user_profiles(role) WHERE is_active = true;

-- ============================================================
-- 2. Content items
-- ============================================================
CREATE TABLE content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  type VARCHAR NOT NULL CHECK (type IN ('linkedin_post', 'email', 'blog', 'video_script', 'carousel', 'instagram', 'youtube_thumbnail', 'programmatic_page')),
  title TEXT NOT NULL,
  body JSONB NOT NULL,
  body_text TEXT,
  audience VARCHAR NOT NULL CHECK (audience IN ('seller', 'buyer', 'dealmaker')),
  voice_mode VARCHAR CHECK (voice_mode IN ('ADVISOR', 'PEER', 'SALES', 'BRAND')),
  pillar VARCHAR CHECK (pillar IN ('exit_education', 'mistake_diagnosis', 'market_patterns', 'proof_methodology', 'investor_access')),
  status VARCHAR NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'scheduled', 'published', 'rejected')),
  compliance_result JSONB,
  metadata JSONB,
  created_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ
);

CREATE INDEX idx_content_items_status ON content_items(status);
CREATE INDEX idx_content_items_type_status ON content_items(type, status);
CREATE INDEX idx_content_items_audience ON content_items(audience);
CREATE INDEX idx_content_items_created_at ON content_items(created_at DESC);
CREATE INDEX idx_content_items_created_by ON content_items(created_by);

-- ============================================================
-- 3. Content schedules
-- ============================================================
CREATE TABLE content_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  platform VARCHAR NOT NULL CHECK (platform IN ('linkedin', 'instagram', 'email', 'buffer', 'website')),
  scheduled_at TIMESTAMPTZ NOT NULL,
  published_at TIMESTAMPTZ,
  external_id VARCHAR,
  status VARCHAR NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'publishing', 'published', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_content_schedules_scheduled_at ON content_schedules(scheduled_at);
CREATE INDEX idx_content_schedules_status ON content_schedules(status);
CREATE INDEX idx_content_schedules_content_id ON content_schedules(content_id);

-- ============================================================
-- 4. Content performance
-- ============================================================
CREATE TABLE content_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  platform VARCHAR NOT NULL,
  measured_at TIMESTAMPTZ DEFAULT now(),
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  profile_visits INTEGER DEFAULT 0,
  link_clicks INTEGER DEFAULT 0,
  custom_metrics JSONB
);

CREATE INDEX idx_content_performance_content_id ON content_performance(content_id);
CREATE INDEX idx_content_performance_measured_at ON content_performance(measured_at DESC);

-- ============================================================
-- 5. Email sequences
-- ============================================================
CREATE TABLE email_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  audience VARCHAR NOT NULL CHECK (audience IN ('seller', 'buyer', 'dealmaker')),
  trigger_event VARCHAR NOT NULL CHECK (trigger_event IN ('exitfit_complete', 'sprint_complete', 'manual')),
  status VARCHAR NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused')),
  emails JSONB NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 6. Email subscribers
-- ============================================================
CREATE TABLE email_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR NOT NULL UNIQUE,
  name VARCHAR,
  audience VARCHAR NOT NULL CHECK (audience IN ('seller', 'buyer', 'dealmaker')),
  list_segment VARCHAR,
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ,
  source VARCHAR,
  utm_campaign VARCHAR,
  metadata JSONB
);

CREATE INDEX idx_email_subscribers_audience_segment ON email_subscribers(audience, list_segment);
CREATE INDEX idx_email_subscribers_active ON email_subscribers(unsubscribed_at) WHERE unsubscribed_at IS NULL;

-- ============================================================
-- 7. Programmatic pages
-- ============================================================
CREATE TABLE programmatic_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template VARCHAR NOT NULL CHECK (template IN ('exit_planning', 'business_valuation', 'ma_advisory')),
  sector VARCHAR,
  country VARCHAR,
  city VARCHAR,
  slug VARCHAR NOT NULL UNIQUE,
  title TEXT NOT NULL,
  meta_description TEXT,
  content JSONB NOT NULL,
  content_text TEXT,
  unique_content_pct NUMERIC,
  word_count INTEGER,
  schema_markup JSONB,
  status VARCHAR NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'generating', 'draft', 'review', 'published', 'error')),
  priority INTEGER DEFAULT 2 CHECK (priority IN (1, 2, 3)),
  published_at TIMESTAMPTZ,
  indexed_at TIMESTAMPTZ,
  gsc_impressions INTEGER DEFAULT 0,
  gsc_clicks INTEGER DEFAULT 0,
  gsc_avg_position NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_programmatic_pages_template_sector_country ON programmatic_pages(template, sector, country);
CREATE INDEX idx_programmatic_pages_status ON programmatic_pages(status);
CREATE INDEX idx_programmatic_pages_priority ON programmatic_pages(priority);

-- ============================================================
-- 8. SEO keywords
-- ============================================================
CREATE TABLE seo_keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword VARCHAR NOT NULL,
  page_id UUID REFERENCES programmatic_pages(id),
  content_id UUID REFERENCES content_items(id),
  tier INTEGER CHECK (tier IN (1, 2, 3)),
  intent VARCHAR CHECK (intent IN ('seller', 'buyer', 'dealmaker')),
  search_volume INTEGER,
  difficulty NUMERIC,
  current_position NUMERIC,
  target_position NUMERIC,
  impressions_30d INTEGER,
  clicks_30d INTEGER,
  ctr_30d NUMERIC,
  last_checked TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_seo_keywords_page_id ON seo_keywords(page_id);
CREATE INDEX idx_seo_keywords_content_id ON seo_keywords(content_id);
CREATE INDEX idx_seo_keywords_tier ON seo_keywords(tier);

-- ============================================================
-- 9. AI citations
-- ============================================================
CREATE TABLE ai_citations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  tier INTEGER NOT NULL CHECK (tier IN (1, 2, 3)),
  platform VARCHAR NOT NULL CHECK (platform IN ('chatgpt', 'claude', 'perplexity', 'google_ai_overview')),
  status VARCHAR NOT NULL CHECK (status IN ('cited', 'mentioned', 'absent')),
  checked_at TIMESTAMPTZ DEFAULT now(),
  response_excerpt TEXT,
  source_url VARCHAR
);

-- ============================================================
-- 10. Marketing sprints
-- ============================================================
CREATE TABLE marketing_sprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  priority_audience VARCHAR NOT NULL CHECK (priority_audience IN ('seller', 'buyer', 'dealmaker')),
  sprint_goal TEXT,
  current_phase INTEGER DEFAULT 1 CHECK (current_phase BETWEEN 1 AND 8),
  status VARCHAR NOT NULL DEFAULT 'active' CHECK (status IN ('planning', 'active', 'complete')),
  phase_data JSONB,
  goals JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 11. Activity log
-- ============================================================
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ DEFAULT now(),
  category VARCHAR NOT NULL CHECK (category IN ('content', 'seo', 'email', 'data', 'system', 'error')),
  action VARCHAR NOT NULL,
  details JSONB,
  source VARCHAR NOT NULL CHECK (source IN ('inngest', 'make', 'manual', 'cron', 'user')),
  related_id UUID,
  related_type VARCHAR,
  user_id UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_activity_log_timestamp ON activity_log(timestamp DESC);
CREATE INDEX idx_activity_log_category ON activity_log(category);
CREATE INDEX idx_activity_log_source ON activity_log(source);

-- ============================================================
-- 12. Research cache
-- ============================================================
CREATE TABLE research_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  type VARCHAR NOT NULL CHECK (type IN ('competitive', 'topic', 'content_analysis')),
  result JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ
);

CREATE INDEX idx_research_cache_type ON research_cache(type);
CREATE INDEX idx_research_cache_expires_at ON research_cache(expires_at);

-- ============================================================
-- 13. Platform metrics (daily snapshots)
-- ============================================================
CREATE TABLE platform_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  platform VARCHAR NOT NULL,
  metric_name VARCHAR NOT NULL,
  metric_value NUMERIC NOT NULL,
  UNIQUE(date, platform, metric_name)
);

CREATE INDEX idx_platform_metrics_lookup ON platform_metrics(platform, metric_name, date DESC);

-- ============================================================
-- 14. AI usage tracking
-- ============================================================
CREATE TABLE ai_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  task TEXT NOT NULL,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('T1_FLAGSHIP', 'T2_FAST', 'T3_DETERMINISTIC', 'T4_EXTERNAL')),
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  cost_usd NUMERIC NOT NULL DEFAULT 0,
  latency_ms INTEGER,
  job_name TEXT,
  user_id UUID REFERENCES auth.users(id),
  content_item_id UUID REFERENCES content_items(id),
  success BOOLEAN NOT NULL DEFAULT true,
  error_message TEXT
);

CREATE INDEX idx_ai_usage_date ON ai_usage(created_at DESC);
CREATE INDEX idx_ai_usage_task ON ai_usage(task, created_at DESC);
CREATE INDEX idx_ai_usage_cost ON ai_usage(cost_usd DESC) WHERE cost_usd > 0;

-- ============================================================
-- 15. AI model overrides (admin config)
-- ============================================================
CREATE TABLE ai_model_overrides (
  task TEXT PRIMARY KEY,
  tier_override TEXT NOT NULL CHECK (tier_override IN ('T1_FLAGSHIP', 'T2_FAST', 'T4_EXTERNAL')),
  reason TEXT,
  set_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 16. Skill performance tracking
-- ============================================================
CREATE TABLE skill_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_name TEXT NOT NULL,
  metric_type TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  sample_size INTEGER NOT NULL,
  breakdown JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_skill_performance_skill ON skill_performance(skill_name, period_start DESC);
CREATE INDEX idx_skill_performance_type ON skill_performance(metric_type, period_start DESC);

-- ============================================================
-- 17. Skill recommendations
-- ============================================================
CREATE TABLE skill_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_name TEXT NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')),
  recommendation_type TEXT NOT NULL,
  title TEXT NOT NULL,
  rationale TEXT NOT NULL,
  current_value TEXT,
  proposed_value TEXT NOT NULL,
  skill_section TEXT,
  supporting_data JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'auto_applied', 'reverted')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  review_note TEXT,
  applied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_skill_recommendations_status ON skill_recommendations(status, created_at DESC);
CREATE INDEX idx_skill_recommendations_skill ON skill_recommendations(skill_name, status);

-- ============================================================
-- 18. Skill overrides
-- ============================================================
CREATE TABLE skill_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_name TEXT NOT NULL,
  section TEXT NOT NULL,
  override_type TEXT NOT NULL CHECK (override_type IN ('replace', 'append', 'prepend', 'insert_after')),
  original_content TEXT,
  override_content TEXT NOT NULL,
  source_recommendation_id UUID REFERENCES skill_recommendations(id),
  source_type TEXT NOT NULL CHECK (source_type IN ('auto', 'recommendation', 'manual')),
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_skill_overrides_active ON skill_overrides(skill_name, is_active) WHERE is_active = true;

-- ============================================================
-- 19. Skill snapshots
-- ============================================================
CREATE TABLE skill_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_name TEXT NOT NULL,
  snapshot_type TEXT NOT NULL CHECK (snapshot_type IN ('baseline', 'override_applied', 'manual_edit', 'export')),
  full_content TEXT NOT NULL,
  active_overrides JSONB,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_skill_snapshots_skill ON skill_snapshots(skill_name, created_at DESC);

-- ============================================================
-- 20. Audit log
-- ============================================================
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  details JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_audit_log_user ON audit_log(user_id, created_at DESC);
CREATE INDEX idx_audit_log_resource ON audit_log(resource_type, resource_id, created_at DESC);
CREATE INDEX idx_audit_log_action ON audit_log(action, created_at DESC);

-- ============================================================
-- TRIGGERS: updated_at auto-update
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_content_items_updated_at BEFORE UPDATE ON content_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_email_sequences_updated_at BEFORE UPDATE ON email_sequences FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_programmatic_pages_updated_at BEFORE UPDATE ON programmatic_pages FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_marketing_sprints_updated_at BEFORE UPDATE ON marketing_sprints FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_skill_recommendations_updated_at BEFORE UPDATE ON skill_recommendations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_skill_overrides_updated_at BEFORE UPDATE ON skill_overrides FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- Helper functions
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT COALESCE(
    (SELECT role FROM user_profiles WHERE id = auth.uid()),
    'viewer'
  )
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT get_user_role() = 'admin'
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE programmatic_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_citations ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_sprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_model_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Admin: full access to everything
CREATE POLICY "admin_full_access" ON user_profiles FOR ALL USING (is_admin());
CREATE POLICY "admin_full_access" ON content_items FOR ALL USING (is_admin());
CREATE POLICY "admin_full_access" ON content_schedules FOR ALL USING (is_admin());
CREATE POLICY "admin_full_access" ON content_performance FOR ALL USING (is_admin());
CREATE POLICY "admin_full_access" ON email_sequences FOR ALL USING (is_admin());
CREATE POLICY "admin_full_access" ON email_subscribers FOR ALL USING (is_admin());
CREATE POLICY "admin_full_access" ON programmatic_pages FOR ALL USING (is_admin());
CREATE POLICY "admin_full_access" ON seo_keywords FOR ALL USING (is_admin());
CREATE POLICY "admin_full_access" ON ai_citations FOR ALL USING (is_admin());
CREATE POLICY "admin_full_access" ON marketing_sprints FOR ALL USING (is_admin());
CREATE POLICY "admin_full_access" ON activity_log FOR ALL USING (is_admin());
CREATE POLICY "admin_full_access" ON research_cache FOR ALL USING (is_admin());
CREATE POLICY "admin_full_access" ON platform_metrics FOR ALL USING (is_admin());
CREATE POLICY "admin_full_access" ON ai_usage FOR ALL USING (is_admin());
CREATE POLICY "admin_full_access" ON ai_model_overrides FOR ALL USING (is_admin());
CREATE POLICY "admin_full_access" ON skill_performance FOR ALL USING (is_admin());
CREATE POLICY "admin_full_access" ON skill_recommendations FOR ALL USING (is_admin());
CREATE POLICY "admin_full_access" ON skill_overrides FOR ALL USING (is_admin());
CREATE POLICY "admin_full_access" ON skill_snapshots FOR ALL USING (is_admin());
CREATE POLICY "admin_full_access" ON audit_log FOR ALL USING (is_admin());

-- Authenticated users: read dashboard data
CREATE POLICY "auth_read_metrics" ON platform_metrics FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "auth_read_activity" ON activity_log FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "auth_read_sprints" ON marketing_sprints FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "auth_read_performance" ON content_performance FOR SELECT USING (auth.uid() IS NOT NULL);

-- Creators: own content + published
CREATE POLICY "creator_own_content" ON content_items FOR ALL USING (
  get_user_role() IN ('creator', 'specialist')
  AND (created_by = auth.uid() OR status = 'published')
);

-- Viewers: published content only
CREATE POLICY "viewer_published" ON content_items FOR SELECT USING (
  get_user_role() = 'viewer' AND status = 'published'
);

-- Users can read own profile
CREATE POLICY "users_own_profile" ON user_profiles FOR SELECT USING (id = auth.uid());
