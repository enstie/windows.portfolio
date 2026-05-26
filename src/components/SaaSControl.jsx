import React, { useState, useEffect, useRef } from 'react';

export default function SaaSControl() {
  const [servers, setServers] = useState([
    { id: 1, name: 'apigw-us-east-1', role: 'API Gateway', status: 'healthy', load: 15 },
    { id: 2, name: 'web-srv-01', role: 'Frontend App', status: 'healthy', load: 12 },
    { id: 3, name: 'db-postgres-primary', role: 'PostgreSQL DB', status: 'healthy', load: 22 }
  ]);
  const [trafficScale, setTrafficScale] = useState(1); // 1 = low, 5 = normal, 10 = extreme
  const [cpuHistory, setCpuHistory] = useState(Array(20).fill(15));
  const [reqHistory, setReqHistory] = useState(Array(20).fill(25));
  const [terminalLogs, setTerminalLogs] = useState([
    'System: Connected to Cloud Manager v4.1...',
    'System: Database connection established.',
    'System: Multi-tenant tenant router initialized.'
  ]);
  const [cmdInput, setCmdInput] = useState('');
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [provisionProgress, setProvisionProgress] = useState(0);
  const [provisionLog, setProvisionLog] = useState('');

  const terminalEndRef = useRef(null);

  // Auto-scroll terminal logs
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  // Traffic & metrics loop
  useEffect(() => {
    const interval = setInterval(() => {
      // Calculate active metrics
      const reqsPerSec = Math.floor(trafficScale * 15 + Math.random() * 8);

      // Calculate server loads based on trafficScale
      setServers(prev =>
        prev.map(srv => {
          if (srv.status !== 'healthy') return srv;
          let baseLoad = 5;
          if (srv.role === 'API Gateway') baseLoad = trafficScale * 8;
          if (srv.role === 'Frontend App') baseLoad = trafficScale * 6;
          if (srv.role === 'PostgreSQL DB') baseLoad = trafficScale * 10;

          const randomJitter = Math.floor(Math.random() * 6) - 3;
          const targetLoad = Math.min(Math.max(baseLoad + randomJitter, 2), 100);

          let newStatus = 'healthy';
          if (targetLoad > 85) newStatus = 'danger';
          else if (targetLoad > 60) newStatus = 'warning';

          return { ...srv, load: targetLoad, status: newStatus };
        })
      );

      // Auto-scale check: if database load is critical (>80) and we are not provisioning, spin up replica!
      const dbServer = servers.find(s => s.role === 'PostgreSQL DB');
      const replicaCount = servers.filter(s => s.name.startsWith('db-postgres-replica')).length;
      if (dbServer && dbServer.load > 80 && replicaCount === 0 && !isProvisioning) {
        triggerAutoScaleReplica();
      }

      // Update charts history
      setCpuHistory(prev => {
        const copy = [...prev.slice(1)];
        // Get average load of healthy servers
        const avg = Math.floor(servers.reduce((sum, s) => sum + (s.status === 'healthy' || s.status === 'warning' || s.status === 'danger' ? s.load : 0), 0) / servers.length);
        copy.push(avg);
        return copy;
      });

      setReqHistory(prev => {
        const copy = [...prev.slice(1)];
        copy.push(reqsPerSec);
        return copy;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [trafficScale, servers, isProvisioning]);

  const triggerAutoScaleReplica = () => {
    setIsProvisioning(true);
    setProvisionProgress(0);
    setProvisionLog('Triggering Auto-scale policy: High DB Load detected.');
    setTerminalLogs(prev => [...prev, 'AutoScaler: Load threshold exceeded. Booting DB Replica...']);
  };

  // Handle server provisioning state
  useEffect(() => {
    if (!isProvisioning) return;

    const interval = setInterval(() => {
      setProvisionProgress(prev => {
        const next = prev + 10;
        if (next === 20) {
          setProvisionLog('Provisioning EC2 AWS Node in us-east-1...');
        } else if (next === 50) {
          setProvisionLog('Dockerizing postgres-replica-01...');
        } else if (next === 80) {
          setProvisionLog('Syncing primary-db database replication streams...');
        } else if (next >= 100) {
          clearInterval(interval);
          setIsProvisioning(false);
          setServers(prevS => [
            ...prevS,
            { id: prevS.length + 1, name: `db-postgres-replica-${prevS.length - 2}`, role: 'PostgreSQL DB Replica', status: 'healthy', load: 10 }
          ]);
          setTerminalLogs(prevL => [...prevL, 'AutoScaler: db-postgres-replica-01 registered and synced successfully.']);
          return 100;
        }
        return next;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isProvisioning]);

  const handleAddServerManually = () => {
    if (isProvisioning) return;
    setIsProvisioning(true);
    setProvisionProgress(0);
    setProvisionLog('Initializing manual node spin up...');
    setTerminalLogs(prev => [...prev, 'System: Launching server setup wizard...']);
  };

  const handleKillReplica = () => {
    setServers(prev => {
      const replicaIdx = prev.findIndex(s => s.name.startsWith('db-postgres-replica'));
      if (replicaIdx === -1) {
        setTerminalLogs(prevL => [...prevL, 'Error: No active replicas to de-provision.']);
        return prev;
      }
      const copy = [...prev];
      const killed = copy.splice(replicaIdx, 1)[0];
      setTerminalLogs(prevL => [...prevL, `System: De-provisioned ${killed.name} successfully.`]);
      return copy;
    });
  };

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    if (!cmdInput.trim()) return;

    const cmd = cmdInput.trim();
    setTerminalLogs(prev => [...prev, `Guest@XP-SaaS-Cloud:~$ ${cmd}`]);
    setCmdInput('');

    const parts = cmd.toLowerCase().split(' ');
    const primaryCmd = parts[0];

    setTimeout(() => {
      switch (primaryCmd) {
        case 'help':
          setTerminalLogs(prev => [
            ...prev,
            'Available CLI commands:',
            '  help               - Displays this instruction screen',
            '  api get-users      - Simulates fetching user data rows from PostgreSQL',
            '  api create-user [n]- Simulates creating a user with a given name',
            '  api stats          - Returns global cloud health indicators',
            '  api scale-down     - De-provisions a database replica node',
            '  clear              - Clears the terminal screen'
          ]);
          break;
        case 'clear':
          setTerminalLogs([]);
          break;
        case 'api':
          const action = parts[1];
          if (action === 'get-users') {
            setTerminalLogs(prev => [
              ...prev,
              'HTTP/1.1 200 OK - content-type: application/json',
              JSON.stringify([
                { id: 101, name: 'Alice Cooper', tenantId: 'tenant-abc', active: true },
                { id: 102, name: 'Bob Marley', tenantId: 'tenant-xyz', active: false },
                { id: 103, name: 'Charlie Chaplin', tenantId: 'tenant-abc', active: true }
              ], null, 2)
            ]);
          } else if (action === 'create-user') {
            const name = parts.slice(2).join(' ') || 'john doe';
            setTerminalLogs(prev => [
              ...prev,
              `POST /api/v1/users - Payload: { name: "${name}" }`,
              'HTTP/1.1 210 CREATED',
              `{"status":"success", "user":{"id":${Math.floor(Math.random() * 900) + 100},"name":"${name}","created_at":"2026-05-26T10:41Z"}}`,
              'System: Database records updated. DB write log flushed.'
            ]);
          } else if (action === 'stats') {
            const healthyCount = servers.filter(s => s.status === 'healthy').length;
            setTerminalLogs(prev => [
              ...prev,
              `Global Health Status: ${healthyCount === servers.length ? 'GREEN' : 'AMBER'}`,
              `Active Workers: ${servers.length} VMs`,
              `Traffic Speed: ${trafficScale * 15} reqs/sec`,
              `Redis Cache Hit Ratio: 94.2%`
            ]);
          } else if (action === 'scale-down') {
            handleKillReplica();
          } else {
            setTerminalLogs(prev => [...prev, 'Error: Unknown API action. Use: get-users, create-user [name], stats, scale-down']);
          }
          break;
        default:
          setTerminalLogs(prev => [...prev, `bash: command not found: ${primaryCmd}. Type "help" for a list of commands.`]);
      }
    }, 200);
  };

  // Convert histories into points for SVG rendering
  const makeSvgPoints = (history, maxVal = 100, height = 80) => {
    const step = 200 / (history.length - 1);
    return history.map((val, idx) => {
      const x = idx * step;
      const percentage = Math.min(val / maxVal, 1);
      const y = height - percentage * height + 2; // leave a margin
      return `${x},${y}`;
    }).join(' ');
  };

  return (
    <div className="xp-saas-control">
      {/* Control panel title bar inside app */}
      <div className="xp-saas-banner">
        <h2>SaaS & Infrastructure Real-Time Operations</h2>
        <p>Monitor your simulated multi-tenant infrastructure, trigger auto-scaling, and execute API endpoints live.</p>
      </div>

      {/* Main layout */}
      <div className="xp-saas-content">
        {/* Left Side: Server list & provisioning */}
        <div className="xp-saas-panel left-panel">
          <div className="panel-header">Active Cloud Nodes (VMs)</div>
          <div className="server-list">
            {servers.map(srv => (
              <div key={srv.id} className={`server-card status-${srv.status}`}>
                <div className="server-info">
                  <div className="server-name-row">
                    <span className="server-name">{srv.name}</span>
                    <span className={`status-badge badge-${srv.status}`}>{srv.status.toUpperCase()}</span>
                  </div>
                  <div className="server-role">{srv.role}</div>
                </div>
                <div className="server-metrics">
                  <span className="metric-label">CPU:</span>
                  <div className="progress-bar-container mini">
                    <div className="progress-bar-fill" style={{ width: `${srv.load}%` }} />
                  </div>
                  <span className="metric-value">{srv.load}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="provision-actions">
            <button className="xp-btn" onClick={handleAddServerManually} disabled={isProvisioning}>
              + Provision DB Replica
            </button>
            <button className="xp-btn" onClick={handleKillReplica} disabled={isProvisioning || !servers.some(s => s.name.startsWith('db-postgres-replica'))}>
              - De-provision Replica
            </button>
          </div>

          {isProvisioning && (
            <div className="provisioning-status border-3d">
              <div className="status-header">Node Boot Wizard</div>
              <div className="log-line">{provisionLog}</div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill animated" style={{ width: `${provisionProgress}%` }} />
              </div>
              <div className="percentage-text">{provisionProgress}% complete</div>
            </div>
          )}
        </div>

        {/* Right Side: Charts and API Terminal */}
        <div className="xp-saas-panel right-panel">
          {/* Charts Row */}
          <div className="charts-row">
            <div className="chart-box border-3d">
              <div className="chart-title">CPU Utilization History (AVG %)</div>
              <div className="chart-canvas-container">
                <svg viewBox="0 0 200 80" className="chart-svg">
                  {/* Grid Lines */}
                  <line x1="0" y1="20" x2="200" y2="20" stroke="#1d4015" strokeDasharray="3" />
                  <line x1="0" y1="40" x2="200" y2="40" stroke="#1d4015" strokeDasharray="3" />
                  <line x1="0" y1="60" x2="200" y2="60" stroke="#1d4015" strokeDasharray="3" />
                  {/* Line Plot */}
                  <polyline
                    fill="none"
                    stroke="#00ff00"
                    strokeWidth="1.5"
                    points={makeSvgPoints(cpuHistory, 100, 80)}
                  />
                </svg>
                <div className="current-value-overlay">{cpuHistory[cpuHistory.length - 1]}%</div>
              </div>
            </div>

            <div className="chart-box border-3d">
              <div className="chart-title">API Requests / Sec</div>
              <div className="chart-canvas-container">
                <svg viewBox="0 0 200 80" className="chart-svg">
                  <line x1="0" y1="20" x2="200" y2="20" stroke="#1d4015" strokeDasharray="3" />
                  <line x1="0" y1="40" x2="200" y2="40" stroke="#1d4015" strokeDasharray="3" />
                  <line x1="0" y1="60" x2="200" y2="60" stroke="#1d4015" strokeDasharray="3" />
                  <polyline
                    fill="none"
                    stroke="#00ffff"
                    strokeWidth="1.5"
                    points={makeSvgPoints(reqHistory, 200, 80)}
                  />
                </svg>
                <div className="current-value-overlay">{reqHistory[reqHistory.length - 1]} req/s</div>
              </div>
            </div>
          </div>

          {/* Traffic Scale Simulator */}
          <div className="traffic-slider-box border-3d">
            <label className="slider-label">
              <span>Traffic Load Simulator:</span>
              <span className="slider-value">
                {trafficScale === 1 && 'Low (10 req/s)'}
                {trafficScale > 1 && trafficScale < 4 && 'Normal (30-50 req/s)'}
                {trafficScale >= 4 && trafficScale < 7 && 'High (80-110 req/s)'}
                {trafficScale >= 7 && trafficScale < 10 && 'Extreme (120-140 req/s)'}
                {trafficScale === 10 && 'REDDIT EFFECT / DDOS (160+ req/s!)'}
              </span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={trafficScale}
              onChange={(e) => setTrafficScale(Number(e.target.value))}
              className="xp-range-slider"
            />
          </div>

          {/* Terminal Console */}
          <div className="terminal-box border-3d">
            <div className="terminal-header">SaaS Cloud Backend Console</div>
            <div className="terminal-body">
              {terminalLogs.map((log, idx) => (
                <pre key={idx} className="terminal-line">{log}</pre>
              ))}
              <div ref={terminalEndRef} />
            </div>
            <form onSubmit={handleCommandSubmit} className="terminal-input-row">
              <span className="terminal-prompt">Guest@XP-SaaS-Cloud:~$</span>
              <input
                type="text"
                className="terminal-input-element"
                value={cmdInput}
                onChange={(e) => setCmdInput(e.target.value)}
                placeholder="Type 'help' for cloud terminal commands..."
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
