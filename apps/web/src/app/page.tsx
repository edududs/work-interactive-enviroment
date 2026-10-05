import { WorldView } from '@/components/WorldView';

export default function Home() {
  return (
    <main style={{ height: '100vh' }}>
      <WorldView mapId="office" />
    </main>
  );
}
