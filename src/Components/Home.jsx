export const Home = () => {
  return (
    <div>
      <main className="flex-1 p-6">
       

        {/* Dashboard Section */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-green-600 p-4 rounded-lg">
            <h2>Clicks</h2>
            <p>Current Value: $203.65</p>
          </div>
          <div className="bg-purple-600 p-4 rounded-lg">
            <h2>Meta</h2>
            <p>Current Value: $151.74</p>
          </div>
          <div className="bg-yellow-600 p-4 rounded-lg">
            <h2>Tesla</h2>
            <p>Current Value: $177.90</p>
          </div>
          <div className="bg-blue-600 p-4 rounded-lg">
            <h2>Apple Inc</h2>
            <p>Current Value: $145.93</p>
          </div>
        </div>

        {/* Balance and Portfolio Section */}
        <div className="grid grid-cols-3 gap-6">
          {/* Balance Card */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3>Balance</h3>
            <p className="text-3xl">$14,032.56</p>
            <span className="text-green-500">+5.63%</span>
          </div>

          {/* Snapshot Card */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3>Snapshot</h3>
            <p>Prev Close: $12,051.48</p>
            <p>Open: $12,000.21</p>
            <p>Day High: $12,248.15</p>
          </div>

          {/* Portfolio Analytics */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3>Portfolio Analytics</h3>
            <p>Invested: $7,532.21</p>
            <p>Top Stock: Tesla Inc</p>
          </div>
        </div>
      </main>
    </div>
  );
}