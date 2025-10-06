'use client';

import { useState } from 'react';

export default function DemoPage() {
  const [count, setCount] = useState(0);
  return (
    <main style={{ padding: 24 }}>
      <h1>Demo</h1>
      <button onClick={() => setCount(c => c + 1)}>Clicked {count} times</button>
    </main>
  );
}


