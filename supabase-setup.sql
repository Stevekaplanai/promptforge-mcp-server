-- Create the prompt_analytics table for PromptForge
CREATE TABLE IF NOT EXISTS prompt_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  original_prompt TEXT NOT NULL,
  optimized_prompt TEXT NOT NULL,
  domain TEXT NOT NULL,
  confidence FLOAT NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  modifications JSONB DEFAULT '[]'::jsonb,
  user_feedback JSONB,
  performance_metrics JSONB,
  context JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_prompt_analytics_created_at ON prompt_analytics(created_at DESC);
CREATE INDEX idx_prompt_analytics_domain ON prompt_analytics(domain);
CREATE INDEX idx_prompt_analytics_confidence ON prompt_analytics(confidence);

-- Create a view for analytics summary
CREATE VIEW prompt_analytics_summary AS
SELECT 
  domain,
  COUNT(*) as total_optimizations,
  AVG(confidence) as avg_confidence,
  MIN(created_at) as first_optimization,
  MAX(created_at) as last_optimization
FROM prompt_analytics
GROUP BY domain;

-- Enable Row Level Security (optional but recommended)
ALTER TABLE prompt_analytics ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (adjust as needed)
CREATE POLICY "Enable all operations for authenticated users" ON prompt_analytics
FOR ALL USING (true);
