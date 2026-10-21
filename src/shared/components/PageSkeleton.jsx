import Skeleton from './Skeleton';

export default function PageSkeleton() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f8f8' }}>
      {/* Fake Sidebar (hidden on mobile) */}
      <aside style={{ width: '260px', background: '#ffffff', borderRight: '1px solid #eee', padding: '24px 12px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', padding: '0 12px' }}>
          <Skeleton variant="rounded" width="32px" height="32px" />
          <Skeleton width="100px" height="24px" />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} variant="rounded" width="100%" height="48px" />
        ))}
      </aside>

      {/* Fake Main Content Area */}
      <main style={{ flex: 1, padding: '20px 24px 32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Fake Topbar */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Skeleton width="200px" height="32px" style={{ marginBottom: '8px' }} />
            <Skeleton width="150px" height="16px" />
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Skeleton variant="circular" width="36px" height="36px" />
            <Skeleton variant="circular" width="36px" height="36px" />
            <Skeleton variant="circular" width="36px" height="36px" />
          </div>
        </header>

        {/* Fake Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" width="100%" height="120px" />
          ))}
        </div>

        {/* Fake Main Dashboard Area */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', flex: 1 }}>
          <Skeleton variant="rounded" width="100%" height="100%" />
          <Skeleton variant="rounded" width="100%" height="100%" />
        </div>
      </main>
    </div>
  );
}