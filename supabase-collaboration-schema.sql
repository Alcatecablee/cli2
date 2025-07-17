-- Real-time Collaboration Schema for NeuroLint Pro
-- Supabase tables and RLS policies for collaborative code editing

-- Enable real-time for the schema
ALTER PUBLICATION supabase_realtime ADD TABLE collaboration_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE collaboration_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE collaboration_operations;
ALTER PUBLICATION supabase_realtime ADD TABLE collaboration_cursors;
ALTER PUBLICATION supabase_realtime ADD TABLE collaboration_comments;

-- Collaboration Sessions
CREATE TABLE collaboration_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  document_content TEXT NOT NULL DEFAULT '',
  document_filename TEXT NOT NULL DEFAULT 'untitled.tsx',
  document_language TEXT NOT NULL DEFAULT 'typescript',
  host_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_locked BOOLEAN DEFAULT FALSE,
  max_participants INTEGER DEFAULT 10,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours')
);

-- Collaboration Participants
CREATE TABLE collaboration_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES collaboration_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_color TEXT NOT NULL,
  user_avatar TEXT,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  is_host BOOLEAN DEFAULT FALSE,
  UNIQUE(session_id, user_id)
);

-- Collaborative Operations (for operational transform)
CREATE TABLE collaboration_operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES collaboration_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  operation_type TEXT NOT NULL CHECK (operation_type IN ('insert', 'delete', 'replace')),
  position INTEGER NOT NULL,
  content TEXT,
  length INTEGER,
  old_length INTEGER,
  base_revision INTEGER NOT NULL,
  revision INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Live Cursors and Selections
CREATE TABLE collaboration_cursors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES collaboration_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  cursor_line INTEGER NOT NULL DEFAULT 0,
  cursor_column INTEGER NOT NULL DEFAULT 0,
  selection_start_line INTEGER,
  selection_start_column INTEGER,
  selection_end_line INTEGER,
  selection_end_column INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, user_id)
);

-- Comments and Chat
CREATE TABLE collaboration_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES collaboration_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  line_number INTEGER NOT NULL,
  column_number INTEGER NOT NULL DEFAULT 0,
  is_resolved BOOLEAN DEFAULT FALSE,
  comment_type TEXT DEFAULT 'comment' CHECK (comment_type IN ('comment', 'chat', 'system')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES auth.users(id)
);

-- NeuroLint Analysis Results (shared in session)
CREATE TABLE collaboration_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES collaboration_sessions(id) ON DELETE CASCADE,
  triggered_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  input_code TEXT NOT NULL,
  output_code TEXT,
  layers_executed INTEGER[] NOT NULL,
  dry_run BOOLEAN NOT NULL DEFAULT TRUE,
  success BOOLEAN NOT NULL DEFAULT FALSE,
  execution_time INTEGER NOT NULL DEFAULT 0,
  detected_issues JSONB DEFAULT '[]'::jsonb,
  analysis_results JSONB DEFAULT '{}'::jsonb,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_collaboration_sessions_host ON collaboration_sessions(host_user_id);
CREATE INDEX idx_collaboration_sessions_active ON collaboration_sessions(last_activity DESC) WHERE expires_at > NOW();
CREATE INDEX idx_collaboration_participants_session ON collaboration_participants(session_id);
CREATE INDEX idx_collaboration_participants_active ON collaboration_participants(session_id, is_active) WHERE is_active = TRUE;
CREATE INDEX idx_collaboration_operations_session ON collaboration_operations(session_id, revision);
CREATE INDEX idx_collaboration_cursors_session ON collaboration_cursors(session_id);
CREATE INDEX idx_collaboration_comments_session ON collaboration_comments(session_id, created_at DESC);
CREATE INDEX idx_collaboration_analysis_session ON collaboration_analysis(session_id, created_at DESC);

-- Update triggers
CREATE OR REPLACE FUNCTION update_collaboration_session_activity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE collaboration_sessions 
  SET last_activity = NOW(), updated_at = NOW()
  WHERE id = NEW.session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_session_activity_operations
  AFTER INSERT ON collaboration_operations
  FOR EACH ROW EXECUTE FUNCTION update_collaboration_session_activity();

CREATE TRIGGER trigger_update_session_activity_cursors
  AFTER INSERT OR UPDATE ON collaboration_cursors
  FOR EACH ROW EXECUTE FUNCTION update_collaboration_session_activity();

CREATE TRIGGER trigger_update_session_activity_comments
  AFTER INSERT ON collaboration_comments
  FOR EACH ROW EXECUTE FUNCTION update_collaboration_session_activity();

-- Cleanup expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM collaboration_sessions 
  WHERE expires_at < NOW() OR (last_activity < NOW() - INTERVAL '30 minutes');
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies
ALTER TABLE collaboration_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaboration_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaboration_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaboration_cursors ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaboration_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaboration_analysis ENABLE ROW LEVEL SECURITY;

-- Sessions: Can view if participant, can modify if host
CREATE POLICY "Users can view sessions they participate in" ON collaboration_sessions
  FOR SELECT USING (
    id IN (
      SELECT session_id FROM collaboration_participants 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Hosts can modify their sessions" ON collaboration_sessions
  FOR ALL USING (host_user_id = auth.uid());

CREATE POLICY "Anyone can create sessions" ON collaboration_sessions
  FOR INSERT WITH CHECK (host_user_id = auth.uid());

-- Participants: Can view session participants, can modify own participation
CREATE POLICY "Users can view session participants" ON collaboration_participants
  FOR SELECT USING (
    session_id IN (
      SELECT session_id FROM collaboration_participants 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own participation" ON collaboration_participants
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Session hosts can manage participants" ON collaboration_participants
  FOR ALL USING (
    session_id IN (
      SELECT id FROM collaboration_sessions 
      WHERE host_user_id = auth.uid()
    )
  );

-- Operations: Can view/create if participant
CREATE POLICY "Participants can view session operations" ON collaboration_operations
  FOR SELECT USING (
    session_id IN (
      SELECT session_id FROM collaboration_participants 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Participants can create operations" ON collaboration_operations
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    session_id IN (
      SELECT session_id FROM collaboration_participants 
      WHERE user_id = auth.uid() AND is_active = TRUE
    )
  );

-- Cursors: Can view/modify if participant
CREATE POLICY "Participants can view session cursors" ON collaboration_cursors
  FOR SELECT USING (
    session_id IN (
      SELECT session_id FROM collaboration_participants 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own cursor" ON collaboration_cursors
  FOR ALL USING (user_id = auth.uid());

-- Comments: Can view if participant, can modify own comments
CREATE POLICY "Participants can view session comments" ON collaboration_comments
  FOR SELECT USING (
    session_id IN (
      SELECT session_id FROM collaboration_participants 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create comments in their sessions" ON collaboration_comments
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    session_id IN (
      SELECT session_id FROM collaboration_participants 
      WHERE user_id = auth.uid() AND is_active = TRUE
    )
  );

CREATE POLICY "Users can modify their own comments" ON collaboration_comments
  FOR UPDATE USING (user_id = auth.uid());

-- Analysis: Can view if participant, can create if participant
CREATE POLICY "Participants can view session analysis" ON collaboration_analysis
  FOR SELECT USING (
    session_id IN (
      SELECT session_id FROM collaboration_participants 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Participants can create analysis" ON collaboration_analysis
  FOR INSERT WITH CHECK (
    triggered_by = auth.uid() AND
    session_id IN (
      SELECT session_id FROM collaboration_participants 
      WHERE user_id = auth.uid() AND is_active = TRUE
    )
  );

-- Grant permissions
GRANT ALL ON collaboration_sessions TO authenticated;
GRANT ALL ON collaboration_participants TO authenticated;
GRANT ALL ON collaboration_operations TO authenticated;
GRANT ALL ON collaboration_cursors TO authenticated;
GRANT ALL ON collaboration_comments TO authenticated;
GRANT ALL ON collaboration_analysis TO authenticated;
