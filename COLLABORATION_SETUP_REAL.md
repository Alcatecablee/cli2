# NeuroLint Pro Real-time Collaboration Setup

## 🚀 Quick Start

The collaboration system is now fully integrated with **Supabase** for real-time features and uses **real API routes** instead of mock data.

### 1. Database Setup

Run the SQL schema to create the collaboration tables:

```bash
# Connect to your Supabase database and run:
psql "postgresql://postgres:[YOUR_PASSWORD]@db.jetwhffgmohdqkuegtjh.supabase.co:5432/postgres" -f supabase-collaboration-schema.sql
```

Or use the Supabase dashboard SQL editor to run the contents of `supabase-collaboration-schema.sql`.

### 2. Environment Variables

The environment variables are already configured in `.env.local`:

```bash
# Supabase Configuration
SUPABASE_URL=https://jetwhffgmohdqkuegtjh.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Public keys for browser
NEXT_PUBLIC_SUPABASE_URL=https://jetwhffgmohdqkuegtjh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Install Dependencies

```bash
npm install @supabase/supabase-js
# or
yarn add @supabase/supabase-js
```

### 4. Start the Application

```bash
npm run dev
# or
yarn dev
```

### 5. Access Collaboration

Navigate to `/collaborate` to start collaborating!

## ✨ Features Implemented

### Real-time Collaboration

- **Session Management**: Create and join sessions with real Supabase storage
- **Live Document Sync**: Real-time document updates via Supabase realtime
- **Participant Management**: Track active users with presence indicators
- **Chat System**: Real-time messaging between collaborators

### NeuroLint Pro Integration

- **Live Analysis**: Run NeuroLint Pro analysis shared across all participants
- **Layer Selection**: Choose specific layers or auto-detect issues
- **Results Sharing**: Analysis results are broadcast to all session members
- **Code Transformation**: Apply fixes in real-time (if not dry-run mode)

### Advanced Features

- **Operational Transform**: Basic conflict resolution for concurrent edits
- **User Persistence**: User preferences saved in localStorage
- **Session URLs**: Shareable session links for easy collaboration
- **Responsive Design**: Works on desktop and mobile following the site theme

## 🔧 API Routes

### Real API Endpoints

- `POST /api/collaboration/sessions` - Create new session
- `GET /api/collaboration/sessions` - Get user's sessions
- `POST /api/collaboration/join` - Join existing session
- `DELETE /api/collaboration/join` - Leave session
- `POST /api/collaboration/analyze` - Run NeuroLint Pro analysis
- `GET /api/collaboration/analyze` - Get analysis history
- `POST /api/collaboration/comments` - Add chat messages
- `POST /api/collaboration/operations` - Apply code operations

### Supabase Tables

- `collaboration_sessions` - Session metadata and document content
- `collaboration_participants` - Active users in sessions
- `collaboration_operations` - Code change operations for sync
- `collaboration_cursors` - Live cursor positions (future feature)
- `collaboration_comments` - Chat messages and code comments
- `collaboration_analysis` - Shared NeuroLint Pro analysis results

## 🛡️ Security & Performance

### Row Level Security (RLS)

- Users can only access sessions they participate in
- Hosts have additional privileges for session management
- All sensitive operations require authentication

### Performance Optimizations

- Real-time subscriptions only for active sessions
- Efficient message batching and filtering
- Automatic session cleanup after 24 hours
- Memory-efficient operation handling

### Data Privacy

- No persistent storage of sensitive code (expires with session)
- User-controlled session participation
- Secure WebSocket connections via Supabase

## 🎨 Design System Integration

The collaboration interface follows the established NeuroLint Pro design system:

### Theme Consistency

- **Dark theme**: #000000 background with subtle glass morphism
- **Blue accents**: #2196f3 for primary actions and focus states
- **Status colors**: Green (#4caf50) for success, Red (#e53e3e) for errors
- **Typography**: Inter for UI, JetBrains Mono for code

### Component Styling

- **Glass morphism**: `rgba(255, 255, 255, 0.05)` backgrounds
- **Glowing effects**: `0 0 12px rgba(33, 150, 243, 0.2)` for focus
- **Smooth transitions**: `0.2s ease` for all interactions
- **Responsive design**: Mobile-first with touch-friendly elements

## 📊 Usage Analytics

### Session Metrics

- Track active sessions and participants
- Monitor analysis usage across teams
- Performance metrics for optimization

### User Experience

- Real-time presence indicators
- Typing indicators (future feature)
- Connection status with auto-reconnect
- Error recovery with user feedback

## 🔄 Real-time Features

### Supabase Realtime Integration

```javascript
// Subscribe to session changes
const channel = supabase
  .channel("collaboration")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "collaboration_sessions",
    },
    handleSessionUpdate,
  )
  .on(
    "postgres_changes",
    {
      event: "INSERT",
      schema: "public",
      table: "collaboration_analysis",
    },
    handleNewAnalysis,
  )
  .subscribe();
```

### Live Updates

- **Document changes**: Instant sync via database triggers
- **New participants**: Real-time participant list updates
- **Analysis results**: Broadcast analysis completion to all users
- **Chat messages**: Instant message delivery
- **Session events**: Join/leave notifications

## 🚀 Deployment Notes

### Environment Setup

- Ensure all Supabase environment variables are configured
- Set up RLS policies for production security
- Configure Supabase realtime for live updates

### Production Considerations

- Set up proper database indexing for performance
- Configure connection pooling for high traffic
- Monitor Supabase usage and quotas
- Set up error tracking and monitoring

## 🤝 Contributing

The collaboration system is built with extensibility in mind:

### Adding Features

- New API routes follow the existing pattern
- Database schema is designed for future enhancements
- UI components use the established design system
- Real-time subscriptions are easily extendable

### Code Organization

- `/app/api/collaboration/` - All collaboration API routes
- `/app/collaborate/` - Main collaboration interface
- `supabase-collaboration-schema.sql` - Database schema
- Real-time logic integrated into React components

## 🐛 Troubleshooting

### Common Issues

**Connection Failed**

- Check Supabase URL and keys in environment variables
- Verify network connectivity to Supabase
- Check browser console for detailed error messages

**Real-time Not Working**

- Ensure Supabase realtime is enabled for your project
- Check if the tables are added to the realtime publication
- Verify RLS policies allow the current user to access data

**Analysis Not Running**

- Check if NeuroLint Pro files are accessible
- Verify the analysis API route is working
- Check console for detailed error messages

### Debug Commands

```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL

# Test Supabase connection
curl -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
     -H "apikey: $SUPABASE_ANON_KEY" \
     "$SUPABASE_URL/rest/v1/collaboration_sessions"

# Check real-time functionality
# Open browser dev tools and check WebSocket connections
```

## 📈 Future Enhancements

### Planned Features

- **Advanced Operational Transform**: Full OT implementation for complex edits
- **Voice/Video Chat**: WebRTC integration for audio/video communication
- **Code Review Workflow**: Formal code review and approval processes
- **Integration APIs**: Connect with external development tools
- **Advanced Analytics**: Detailed collaboration and productivity metrics

The collaboration system is now production-ready with real Supabase integration, following all established patterns and design systems!
