export const sourceRoot = "https://github.com/AnouarMohamed/Ftrace-Flight-Recorder";

export const pages = [
  {
    slug: "contents",
    title: "Welcome to the FDR Operator Guide",
    description: "The complete operational guide to Flight Data Recorder.",
    html: `
      <h1>Welcome to the FDR Operator Guide</h1>
      <p>Flight Data Recorder (FDR) continuously preserves a bounded history of selected Linux kernel tracepoints. It starts tracing before a failure occurs, keeps each capture isolated, and makes evidence loss visible. This guide covers the complete path from a first host capture to production operations, Kubernetes deployment, incident preservation, and kernel-by-kernel validation.</p>

      <div class="box-warning">
        <p><strong>A running recorder does not prove a complete capture.</strong> Always read <code>/readyz</code> and the loss counters together. Any reported overrun, dropped event, write error, or storage drop means the available evidence is incomplete.</p>
      </div>

      <table class="contents-table" aria-label="Guide contents"><tbody>
        <tr><td><a href="#/concepts">Architecture and concepts</a><ul><li>Parent, workers, collectors</li><li>tracefs isolation</li><li>Bounded evidence model</li></ul></td><td><p>Understand what FDR owns, what it preserves, and what its integrity signals can and cannot prove.</p></td></tr>
        <tr><td><a href="#/getting-started">Getting started</a><ul><li>Host prerequisites</li><li>Build and install</li><li>First verified capture</li></ul></td><td><p>Install one scheduler recorder under systemd and verify its file, process, endpoints, and metrics.</p></td></tr>
        <tr><td><a href="#/walkthroughs">Practical walkthroughs</a><ul><li>Host and evidence collection</li><li>Helm and Kustomize</li><li>Kind and VM validation</li></ul></td><td><p>Follow copyable end-to-end procedures with explicit safety boundaries and expected results.</p></td></tr>
        <tr><td><a href="#/configuration">Configuration reference</a><ul><li>All directives</li><li>Filters and modules</li><li>Memory and storage sizing</li></ul></td><td><p>Design valid, bounded recorder instances and activate changes without partially applying invalid syntax.</p></td></tr>
        <tr><td><a href="#/command-line">Command-line reference</a></td><td><p>Every daemon option, default, and production invocation pattern.</p></td></tr>
        <tr><td><a href="#/systemd">Host operations</a><ul><li>Service lifecycle</li><li>Reloads and signals</li><li>Rotation and retention</li></ul></td><td><p>Operate FDR safely on a Linux host, including transitions that can create a capture gap.</p></td></tr>
        <tr><td><a href="#/kubernetes">Kubernetes and Helm</a><ul><li>Privilege boundary</li><li>DaemonSet topology</li><li>Preflight and rollout</li></ul></td><td><p>Run one recorder on each selected node with explicit scheduling, storage, monitoring, and network controls.</p></td></tr>
        <tr><td><a href="#/deployment-reference">Deployment values reference</a><ul><li>Every Helm value</li><li>Probes and alert rules</li><li>Kustomize invariants</li></ul></td><td><p>Review defaults, schema constraints, generated workload behavior, and production override requirements.</p></td></tr>
        <tr><td><a href="#/kind-lab">Kind observability lab</a></td><td><p>Run the complete local cluster lifecycle safely against the host kernel and retain diagnostic artifacts.</p></td></tr>
        <tr><td><a href="#/vm-validation">Disposable VM validation</a></td><td><p>Qualify systemd, controlled loss, performance, Ubuntu LTS, and single-node k3s without changing host tracefs.</p></td></tr>
        <tr><td><a href="#/observability">Health and observability</a><ul><li>Endpoint semantics</li><li>Metric reference</li><li>Prometheus alerts</li></ul></td><td><p>Interpret liveness, readiness, worker count, file activity, and integrity counters correctly.</p></td></tr>
        <tr><td><a href="#/incident-response">Incident evidence workflow</a></td><td><p>Preserve volatile captures and their provenance before a reload, restart, cleanup, or configuration change.</p></td></tr>
        <tr><td><a href="#/troubleshooting">Troubleshooting</a><ul><li>Startup and probe failures</li><li>Trace loss</li><li>Storage and collector faults</li></ul></td><td><p>Diagnose failures by symptom and avoid destroying evidence during recovery.</p></td></tr>
        <tr><td><a href="#/security">Security model</a></td><td><p>Harden the host and cluster boundary around a component that controls kernel tracing and handles sensitive evidence.</p></td></tr>
        <tr><td><a href="#/performance">Performance engineering</a></td><td><p>Estimate per-CPU memory, qualify an event set, measure collector headroom, and interpret loss under load.</p></td></tr>
        <tr><td><a href="#/benchmark-catalog">Benchmark catalog</a></td><td><p>Read every recorded performance result together with its environment, decision, and explicit claim boundary.</p></td></tr>
        <tr><td><a href="#/validation">Validation evidence</a></td><td><p>See what has been demonstrated on real kernels and which production gates remain open.</p></td></tr>
        <tr><td><a href="#/development">Development and contribution</a></td><td><p>Build, test, validate, document, and submit changes with the evidence appropriate to their claims.</p></td></tr>
        <tr><td><a href="#/packaging">Packaging and distribution</a></td><td><p>Produce install trees, source archives, RPMs, container images, and deployment artifacts.</p></td></tr>
        <tr><td><a href="#/roadmap">Project roadmap</a></td><td><p>Understand milestone order, completed hardening, open performance work, and the future incident-triggered recorder.</p></td></tr>
        <tr><td><a href="#/release-notes">Release notes and compatibility</a></td><td><p>Review the v1.4 baseline, compatibility expectations, and upgrade checklist.</p></td></tr>
      </tbody></table>

      <h2 id="choose-a-path">Choose a path</h2>
      <table>
        <thead><tr><th>Your goal</th><th>Start here</th><th>Then verify</th></tr></thead>
        <tbody>
          <tr><td>Try FDR on one approved host</td><td><a href="#/getting-started">Getting started</a></td><td>One real event, readiness, and zero increasing loss counters</td></tr>
          <tr><td>Prepare a production host service</td><td><a href="#/configuration">Configuration</a> and <a href="#/systemd">host operations</a></td><td>Retention, permissions, restart behavior, and workload-specific event rate</td></tr>
          <tr><td>Deploy a Kubernetes node recorder</td><td><a href="#/kubernetes">Kubernetes and Helm</a></td><td>tracefs preflight, privilege boundary, alerts, and evidence storage</td></tr>
          <tr><td>Respond to an unready recorder</td><td><a href="#/incident-response">Incident workflow</a></td><td>Preserve evidence first, then use <a href="#/troubleshooting">troubleshooting</a></td></tr>
          <tr><td>Approve a new tracepoint set</td><td><a href="#/performance">Performance engineering</a></td><td>Every supported kernel under representative peak load</td></tr>
        </tbody>
      </table>

      <h2 id="operating-principle">The operating principle</h2>
      <p>FDR is an always-on collection layer, not a profiler, query engine, visualization system, or long-term trace store. Its value is the recent evidence that already exists when an intermittent kernel-level failure becomes visible. The operator remains responsible for choosing probes, sizing buffers and files, protecting captures, and proving the selected configuration on each supported kernel.</p>
    `,
  },
  {
    slug: "concepts",
    title: "Architecture and concepts",
    description: "How FDR turns tracefs events into bounded, integrity-aware capture files.",
    toc: [["system-map", "System map"], ["execution-model", "Execution model"], ["evidence-path", "Evidence path"], ["bounded-capture", "Bounded capture"], ["integrity", "Evidence integrity"], ["ownership", "Ownership boundary"]],
    html: `
      <h1>Architecture and concepts</h1>
      <p>FDR is a small supervisory daemon around the Linux kernel's ftrace interface. It isolates event sets in tracefs instances, starts one worker for each configuration file, and optionally drains each instance into a bounded file. The design deliberately avoids a database, remote control plane, and kernel instrumentation of its own.</p>

      <h2 id="system-map">System at a glance</h2>
      <table>
        <thead><tr><th>Stage</th><th>What it does</th><th>What the operator gets</th></tr></thead>
        <tbody>
          <tr><td>Linux tracepoint</td><td>The kernel emits a record when a selected event occurs.</td><td>A timestamped kernel event from the CPU that handled it.</td></tr>
          <tr><td>tracefs instance</td><td>FDR keeps each configuration's events and per-CPU ring buffers separate.</td><td>An isolated stream plus kernel loss statistics.</td></tr>
          <tr><td>Collector worker</td><td>The worker reads <code>trace_pipe</code>, checks storage policy, and writes records continuously.</td><td>A live capture process for one configured instance.</td></tr>
          <tr><td>Bounded capture</td><td>The current file and one retained generation limit disk use.</td><td>Recent evidence in a protected mode-0600 file.</td></tr>
          <tr><td>HTTP status</td><td>Health, readiness, and metrics report process state and known evidence loss.</td><td>A way to distinguish a running process from a trustworthy recorder.</td></tr>
        </tbody>
      </table>
      <p>Trace data moves from the kernel to the capture file. Integrity state moves separately into readiness and metrics. A file can still be growing after FDR has detected that some evidence was lost, so file growth alone does not prove a complete recording.</p>

      <h2 id="execution-model">Execution model</h2>
      <table>
        <thead><tr><th>Component</th><th>Responsibility</th><th>Failure meaning</th></tr></thead>
        <tbody>
          <tr><td>Parent process</td><td>Parses the complete configuration, creates and removes owned instances, starts workers, samples tracefs statistics, exposes HTTP, and handles signals.</td><td>If absent, no supervisor remains to maintain a consistent recorder set.</td></tr>
          <tr><td>Worker</td><td>Applies one configuration in file order. It loads approved modules, installs filters, enables events, and starts a collector when <code>saveto</code> is present.</td><td>A setup failure is a probe failure. An unexpected persistent worker exit causes the parent to exit for clean reconstruction by the service manager.</td></tr>
          <tr><td>Collector</td><td>Continuously reads an instance's <code>trace_pipe</code> and appends records to its mode-0600 capture file.</td><td>A write or read failure compromises persistence. Preserve logs, storage state, and remaining trace data before recovery.</td></tr>
          <tr><td>Service manager</td><td>Starts FDR, restarts a failed process tree, applies resource policy, and records lifecycle logs.</td><td>A restart may restore collection, but it cannot recover records lost before or during the transition.</td></tr>
        </tbody>
      </table>

      <h2 id="evidence-path">Evidence path</h2>
      <ol>
        <li>A kernel tracepoint emits a record on the CPU where the event occurs.</li>
        <li>ftrace appends it to that CPU's ring buffer inside the selected tracefs instance.</li>
        <li>The collector reads merged text records from <code>trace_pipe</code>.</li>
        <li>FDR checks destination free-space policy and bounded-file rotation state.</li>
        <li>The collector appends bytes to the capture and advances cumulative metrics.</li>
        <li>The parent samples per-CPU tracefs statistics every five seconds and latches readiness false if the kernel reports loss.</li>
      </ol>
      <div class="box-info"><p>Each <code>*.conf</code> file creates its own tracefs instance. Isolation prevents unrelated event sets from sharing global tracing state, but every instance still consumes host memory and I/O.</p></div>

      <h2 id="bounded-capture">Bounded capture</h2>
      <ul>
        <li><strong>Trace buffer size</strong> bounds recent in-kernel history per CPU. The configured size is not a host total.</li>
        <li><strong>Maximum capture size</strong> triggers rotation before an append would cross the file limit.</li>
        <li><strong><code>minfree</code></strong> protects the destination filesystem by discarding output below the configured free percentage.</li>
      </ul>
      <p>A bounded file protects availability, not completeness. Rotation intentionally discards older history. Free-space protection discards new output and increments <code>fdr_bytes_dropped_total</code>. Pick limits from event rate, incident response time, CPU count, and the host storage budget.</p>

      <h2 id="integrity">Evidence integrity</h2>
      <table>
        <thead><tr><th>Signal</th><th>What it establishes</th><th>What it does not establish</th></tr></thead>
        <tbody>
          <tr><td><code>/healthz</code> is 200</td><td>The parent event loop responds.</td><td>Workers, probes, storage, and kernel buffers may still be degraded.</td></tr>
          <tr><td><code>/readyz</code> is 200</td><td>No known integrity failure has latched in the current parent lifetime.</td><td>There was no unobserved loss, or earlier generations are complete.</td></tr>
          <tr><td>Loss counters are stable</td><td>No new sampled loss was reported in the comparison window.</td><td>The event set has enough headroom for a different workload.</td></tr>
          <tr><td>Capture file grows</td><td>The collector persists some records.</td><td>All emitted records reached the file.</td></tr>
        </tbody>
      </table>
      <div class="box-warning"><p>Readiness is sticky. Reloading or restarting creates a fresh state, but does not repair a capture that was already incomplete. Save old metrics and files before resetting it.</p></div>

      <h2 id="ownership">Ownership boundary</h2>
      <p>FDR normally runs as root because tracefs controls host-kernel tracing. A Kubernetes pod needs the same effective power through privileged execution and a host tracefs mount. Treat control of the binary, image, configuration, enabled events, filters, module tree, and output path as administrative access.</p>
      <p>FDR owns only the instances it creates from active configuration. Never remove an unfamiliar instance during cleanup. Another tracing tool may own it.</p>
    `,
  },
  {
    slug: "getting-started",
    title: "Getting started on a Linux host",
    description: "Build, install, start, and verify one bounded scheduler capture.",
    toc: [["requirements", "Requirements"], ["build", "Build and test"], ["install", "Install"], ["configure", "Configure"], ["verify", "Verify"], ["first-change", "First change"]],
    html: `
      <h1>Getting started on a Linux host</h1>
      <p>This procedure creates one scheduler recorder under systemd, proves that real kernel events reach disk, and verifies the integrity endpoints. Run it on an approved Linux host where tracing and root access are acceptable.</p>

      <h2 id="requirements">1. Check the host</h2>
      <pre><code>findmnt -T /sys/kernel/tracing
test -d /sys/kernel/tracing/instances
test -d /sys/kernel/tracing/events/sched/sched_switch
test -d /sys/kernel/tracing/events/sched/sched_wakeup</code></pre>
      <p>The mount type should be <code>tracefs</code>. If absent, review the machine's boot and security policy first. On an approved disposable or development host:</p>
      <pre><code>sudo mount -t tracefs tracefs /sys/kernel/tracing</code></pre>
      <p>Install a C11 compiler and GNU Make. Install <code>kmod</code> only when a configuration uses <code>modprobe</code>, and <code>logrotate</code> only when external rotation is part of policy.</p>

      <h2 id="build">2. Build and test</h2>
      <pre class="terminal"><code>make check
make
./fdrd -V</code></pre>
      <p><code>make check</code> exercises parser, lifecycle, HTTP, metrics, reload, rotation, and failure behavior against a temporary fake tracefs tree. It does not change the host kernel. Optional sanitizer checks require Clang:</p>
      <pre><code>make sanitize</code></pre>

      <h2 id="install">3. Install</h2>
      <pre><code>sudo make install
sudo install -d -m 0700 /var/log/fdr
sudo install -m 0644 deploy/kubernetes/fdr.conf /etc/fdr.d/node.conf</code></pre>
      <p>The install target adds <code>fdrd</code>, the systemd unit, the section 8 manual, samples, and an empty <code>/etc/fdr.d</code>. It does not overwrite existing configuration.</p>

      <h2 id="configure">4. Review and validate</h2>
      <pre><code>instance node
enable sched/sched_switch
enable sched/sched_wakeup
minfree 5
saveto /var/log/fdr/node.log 64m</code></pre>
      <pre class="terminal"><code>sudo fdrd -n -c /etc/fdr.d</code></pre>
      <div class="box-info"><p>Parse-only validation proves grammar and value rules. It cannot prove that an event or filter exists on this kernel, a module can load, tracefs is writable, or the destination has enough space.</p></div>
      <pre><code>sudo systemctl daemon-reload
sudo systemctl enable --now fdr
systemctl status --no-pager fdr
journalctl -u fdr -f</code></pre>

      <h2 id="verify">5. Verify the recorder</h2>
      <pre><code>for i in 1 2 3 4 5; do sh -c :; done
sudo test -s /var/log/fdr/node.log
sudo grep -m 1 sched_switch /var/log/fdr/node.log
curl --fail http://127.0.0.1:9119/healthz
curl --fail http://127.0.0.1:9119/readyz
curl --silent http://127.0.0.1:9119/metrics</code></pre>
      <table>
        <thead><tr><th>Check</th><th>Expected first-run state</th></tr></thead>
        <tbody>
          <tr><td><code>/healthz</code></td><td>HTTP 200 with <code>ok</code></td></tr>
          <tr><td><code>/readyz</code></td><td>HTTP 200 with <code>ready</code></td></tr>
          <tr><td><code>fdr_ready</code></td><td><code>1</code></td></tr>
          <tr><td>Trace-loss counters</td><td>All zero and not increasing</td></tr>
          <tr><td><code>fdr_workers_alive</code></td><td>Equal to <code>fdr_instances</code> for persistent <code>saveto</code> configurations</td></tr>
          <tr><td>Capture file</td><td>Non-empty, regular, mode 0600, and growing under activity</td></tr>
        </tbody>
      </table>

      <h2 id="first-change">6. Make the first safe change</h2>
      <pre><code>sudo fdrd -n -c /etc/fdr.d
sudo systemctl reload fdr
journalctl -u fdr --since '-2 minutes' --no-pager
curl --fail http://127.0.0.1:9119/readyz</code></pre>
      <div class="box-warning"><p>A valid reload replaces workers and trace instances. There is a brief capture transition. Preserve incident evidence before reloading, even when syntax validation succeeds.</p></div>
    `,
  },
  {
    slug: "configuration",
    title: "Configuration reference",
    description: "Complete syntax, directive behavior, sizing, filters, rotation, and reload semantics.",
    toc: [["discovery", "Discovery and parsing"], ["directives", "Directive summary"], ["instance", "instance"], ["enable", "enable and disable"], ["modprobe", "modprobe"], ["minfree", "minfree"], ["saveto", "saveto"], ["examples", "Examples"], ["activation", "Activation"]],
    html: `
      <h1>Configuration reference</h1>
      <p>FDR reads one instance definition from each regular <code>*.conf</code> file directly inside its configuration directory. The default is <code>/etc/fdr.d</code>.</p>

      <h2 id="discovery">File discovery and parsing</h2>
      <ul>
        <li>Files are read in lexical path order.</li>
        <li>Only regular files directly under the directory are accepted.</li>
        <li>At least one <code>*.conf</code> file is required.</li>
        <li>Instance names must be unique; at most 64 may be active.</li>
        <li>The first non-comment directive in each file must be <code>instance</code>.</li>
        <li>Blank lines and lines whose first non-space character is <code>#</code> are ignored.</li>
        <li>Inline comments are unsupported because event filters may contain spaces.</li>
        <li>Directives are applied in file order.</li>
      </ul>
      <pre><code>fdrd -n -c /etc/fdr.d</code></pre>

      <h2 id="directives">Directive summary</h2>
      <table><thead><tr><th>Directive</th><th>Required</th><th>Purpose</th></tr></thead><tbody>
        <tr><td><code>instance name [buffer-size]</code></td><td>First</td><td>Create an isolated tracefs instance and optionally set its per-CPU buffer.</td></tr>
        <tr><td><code>modprobe module-name</code></td><td>No</td><td>Load one kernel module directly, without shell interpolation.</td></tr>
        <tr><td><code>enable subsystem/event [filter]</code></td><td>No</td><td>Install an optional filter and enable an event.</td></tr>
        <tr><td><code>disable subsystem/event</code></td><td>No</td><td>Disable one event or a complete subsystem.</td></tr>
        <tr><td><code>minfree percentage</code></td><td>No</td><td>Discard output below the free-space threshold.</td></tr>
        <tr><td><code>saveto absolute-path [maximum-size]</code></td><td>No</td><td>Persist <code>trace_pipe</code> to a bounded file.</td></tr>
      </tbody></table>

      <h2 id="instance"><code>instance name [buffer-size]</code></h2>
      <p>The instance appears under <code>/sys/kernel/tracing/instances/&lt;name&gt;</code>, or the selected legacy debugfs trace root. Names may contain letters, digits, period, underscore, and hyphen. <code>.</code> and <code>..</code> are rejected.</p>
      <p>Sizes are positive integer byte values with binary suffixes: <code>64k</code>, <code>16MB</code>, and <code>1GiB</code>. Fractions such as <code>1.5m</code> are invalid. The kernel may round the request.</p>
      <div class="box-warning"><p>The trace buffer is allocated per CPU. <code>16m</code> on a 64-CPU host requests roughly 1 GiB for one instance before kernel overhead.</p></div>

      <h2 id="enable"><code>enable</code> and <code>disable</code></h2>
      <pre><code>enable sched/sched_switch
enable sched/sched_wakeup target_cpu == 0
disable irq/irq_handler_entry
disable sched</code></pre>
      <p>Everything after a specific event name becomes its filter expression before enablement. Validate filters against the event's <code>format</code> and <code>filter</code> files on every supported kernel. Event fields are kernel interfaces and can differ between releases. Ordering is significant.</p>

      <h2 id="modprobe"><code>modprobe module-name</code></h2>
      <p>FDR executes <code>modprobe -- &lt;module-name&gt;</code> directly. Module names may contain letters, digits, period, underscore, hyphen, and colon. No shell processes the value.</p>
      <div class="box-stop"><p>Loading a module changes the host kernel. Use this only for a reviewed event set. Kubernetes host module access must be explicitly enabled.</p></div>

      <h2 id="minfree"><code>minfree percentage</code></h2>
      <p>Before writing, the collector checks free space on the destination filesystem. Below the threshold it discards bytes and increments <code>fdr_bytes_dropped_total</code>. Any increase means the file is incomplete. Include journal growth, images, package updates, crash dumps, and other writers in the capacity plan.</p>

      <h2 id="saveto"><code>saveto absolute-path [maximum-size]</code></h2>
      <pre><code>saveto /var/log/fdr/scheduler.log 128m</code></pre>
      <ul>
        <li>The path must be absolute and may not contain parent traversal.</li>
        <li>The parent directory must already exist with appropriate ownership and mode.</li>
        <li>Capture files are regular files opened with mode 0600.</li>
        <li>FDR rotates before a write would cross the maximum.</li>
        <li>A matching regular <code>/etc/logrotate.d/&lt;instance&gt;</code> can participate in rotation.</li>
        <li>Otherwise the fallback retains the current file and one <code>.1</code> generation.</li>
      </ul>
      <p>Without <code>saveto</code>, setup completes and the worker exits while the instance remains available to an external reader. In that model, a lower worker count is expected and the bundled worker alert must be adjusted.</p>

      <h2 id="examples">Complete examples</h2>
      <h3>Bounded scheduler history</h3>
      <pre><code>instance scheduler 16m
enable sched/sched_switch
enable sched/sched_wakeup
minfree 10
saveto /var/log/fdr/scheduler.log 128m</code></pre>
      <h3>Filtered wakeups</h3>
      <pre><code>instance wakeups 8m
enable sched/sched_wakeup target_cpu == 0
minfree 5
saveto /var/log/fdr/wakeups.log 32m</code></pre>
      <h3>Module-dependent probes</h3>
      <pre><code>instance nfs 16m
modprobe nfsv4
enable nfs4/nfs4_open_expired
enable sunrpc/rpc_socket_error
minfree 10
saveto /var/log/fdr/nfs.log 128m</code></pre>

      <h3>Setup-only instance for an external reader</h3>
      <pre><code>instance live-debug 8m
enable sched/sched_switch prev_state != 0
enable sched/sched_wakeup</code></pre>
      <p>Without <code>saveto</code>, setup completes and the worker exits successfully. An approved external tool can read <code>/sys/kernel/tracing/instances/live-debug/trace_pipe</code>. Adjust worker-parity alerts because this instance intentionally has no persistent collector.</p>

      <h3>Multiple isolated recorders</h3>
      <p>Create two files so each event set has independent buffers, filtering, storage, and loss statistics:</p>
      <pre><code># /etc/fdr.d/10-scheduler.conf
instance scheduler 16m
enable sched/sched_switch
enable sched/sched_wakeup
minfree 10
saveto /var/log/fdr/scheduler.log 128m

# /etc/fdr.d/20-network.conf
instance network 8m
enable net/net_dev_queue
enable net/netif_receive_skb
minfree 10
saveto /var/log/fdr/network.log 64m</code></pre>
      <div class="box-warning"><p>Buffer memory scales across both CPU count and instance count. Verify that every named network tracepoint exists on each supported kernel before activation.</p></div>

      <h2 id="activation">Activating changes</h2>
      <pre><code>sudo fdrd -n -c /etc/fdr.d
sudo systemctl reload fdr</code></pre>
      <p>Invalid syntax is rejected before current workers stop. Runtime activation can still fail because events, filters, modules, permissions, and free space are checked only against the running host.</p>
    `,
  },
  {
    slug: "command-line",
    title: "Command-line reference",
    description: "Options, defaults, foreground execution, validation, and common invocations.",
    toc: [["synopsis", "Synopsis"], ["options", "Options"], ["patterns", "Invocation patterns"], ["exit", "Exit behavior"]],
    html: `
      <h1>Command-line reference</h1>
      <h2 id="synopsis">Synopsis</h2>
      <pre class="terminal"><code>fdrd [-fjnvV] [-a address] [-p port] [-c config-directory] [-d tracefs-root]</code></pre>
      <h2 id="options">Options</h2>
      <table><thead><tr><th>Option</th><th>Meaning</th><th>Default</th></tr></thead><tbody>
        <tr><td><code>-a address</code></td><td>IPv4 bind address for health and metrics</td><td><code>127.0.0.1</code></td></tr>
        <tr><td><code>-p port</code></td><td>HTTP port; <code>0</code> disables HTTP</td><td><code>9119</code></td></tr>
        <tr><td><code>-c directory</code></td><td>Directory containing <code>*.conf</code></td><td><code>/etc/fdr.d</code></td></tr>
        <tr><td><code>-d directory</code></td><td>Tracefs root; FDR appends <code>instances</code></td><td>Auto-detected</td></tr>
        <tr><td><code>-f</code></td><td>Stay in the foreground</td><td>Daemonize</td></tr>
        <tr><td><code>-j</code></td><td>Write one JSON log object per line</td><td>Plain text</td></tr>
        <tr><td><code>-n</code></td><td>Parse and validate, then exit</td><td>Run</td></tr>
        <tr><td><code>-v</code></td><td>Increase verbosity</td><td>Normal</td></tr>
        <tr><td><code>-V</code></td><td>Print version and exit</td><td>Not applicable</td></tr>
      </tbody></table>
      <p>Without <code>-d</code>, FDR prefers <code>/sys/kernel/tracing</code> and falls back to <code>/sys/kernel/debug/tracing</code>. Service-manager and container deployments use foreground mode.</p>
      <h2 id="patterns">Invocation patterns</h2>
      <pre><code># Validate a candidate
fdrd -n -c ./candidate-config

# Service manager with JSON logs
fdrd -f -j -c /etc/fdr.d -a 127.0.0.1 -p 9119

# Protected pod network
fdrd -f -j -a 0.0.0.0 -p 9119

# Alternate test trace root
fdrd -f -d /tmp/fake-tracefs -c ./fixtures</code></pre>
      <div class="box-warning"><p>The listener has no TLS or authentication. Do not bind to a reachable address without a trusted proxy, network controls, and explicit access policy.</p></div>
      <h2 id="exit">Exit and supervision behavior</h2>
      <p>A persistent collector that exits unexpectedly causes the parent to exit so the service manager can reconstruct a consistent instance set. Inspect the recorded exit status and final logs. The installed manual is available as <code>man 8 fdrd</code>.</p>
    `,
  },
  {
    slug: "systemd",
    title: "Host operations with systemd",
    description: "Lifecycle, logs, reloads, signals, capture rotation, and decommissioning.",
    toc: [["routine", "Routine checks"], ["logs", "Logs"], ["reload", "Reload"], ["signals", "Signals"], ["rotation", "Rotation"], ["remove", "Stop and remove"]],
    html: `
      <h1>Host operations with systemd</h1>
      <h2 id="routine">Routine checks</h2>
      <pre><code>systemctl is-active fdr
systemctl status --no-pager fdr
journalctl -u fdr --since '15 minutes ago' --no-pager
curl --fail http://127.0.0.1:9119/healthz
curl --fail http://127.0.0.1:9119/readyz
curl --silent http://127.0.0.1:9119/metrics</code></pre>
      <p>For each persistent instance, verify the process, readiness, stable integrity counters, non-empty capture file, correct file ownership, and expected worker count. A green service state alone is insufficient.</p>

      <h2 id="logs">Logs</h2>
      <p>FDR writes to standard error. Plain lines include RFC 3339 time, severity, and message:</p>
      <pre class="terminal"><code>2026-08-29T12:00:00Z [info] saving instance node to /var/log/fdr/node.log</code></pre>
      <p>With <code>-j</code>, each line is a JSON object containing <code>ts</code>, <code>level</code>, <code>msg</code>, and <code>pid</code>. <code>-v</code> adds successful per-probe changes and setup-only completion. Human log text is not a stable API; alerts should use metrics.</p>

      <h2 id="reload">Reload behavior</h2>
      <p>Validation and replacement are separate parts of a reload. Invalid configuration is rejected before the running workers change. Valid configuration replaces the current workers and tracefs instances, which creates a short interval in which the old recorder has stopped and the new recorder is not yet fully active.</p>
      <pre><code>sudo fdrd -n -c /etc/fdr.d
sudo systemctl reload fdr
journalctl -u fdr --since '-2 minutes' --no-pager</code></pre>
      <ol>
        <li>Parse the complete candidate directory into memory.</li>
        <li>Reject invalid syntax while current workers remain active.</li>
        <li>For a valid candidate, stop workers and remove owned instances.</li>
        <li>Create new instances and workers.</li>
        <li>Increment <code>fdr_reloads_total</code> and begin a fresh readiness state.</li>
      </ol>
      <div class="box-warning"><p>Reload is atomic for syntax, but not capture-gap-free. It also resets sticky readiness. Preserve incident evidence first.</p></div>

      <h2 id="signals">Signals</h2>
      <table><thead><tr><th>Signal</th><th>Behavior</th><th>Operational use</th></tr></thead><tbody>
        <tr><td><code>SIGHUP</code></td><td>Validate and replace configuration</td><td>Use <code>systemctl reload fdr</code>.</td></tr>
        <tr><td><code>SIGUSR1</code></td><td>Collectors reopen output files</td><td>Use after an external process moves the current file.</td></tr>
        <tr><td><code>SIGTERM</code>, <code>SIGINT</code></td><td>Stop workers, remove owned instances, exit</td><td>Send through systemd.</td></tr>
      </tbody></table>

      <h2 id="rotation">File rotation</h2>
      <p>FDR rotates before the next write would cross the configured maximum. For external rotation, move the file first, then signal the complete process tree:</p>
      <pre><code>sudo systemctl kill --kill-who=all --signal=SIGUSR1 fdr</code></pre>
      <p>Collectors own open file descriptors, so do not signal only the parent. Confirm the reopened path is regular, protected, and receiving data.</p>

      <h2 id="remove">Stop and remove</h2>
      <pre><code>sudo systemctl disable --now fdr
sudo make uninstall</code></pre>
      <p>Graceful shutdown removes FDR-owned instances. Captures and <code>/etc/fdr.d</code> remain for deliberate retention or removal.</p>
    `,
  },
  {
    slug: "kubernetes",
    title: "Kubernetes and Helm",
    description: "Production topology, privilege boundary, scheduling, preflight, monitoring, and upgrades.",
    toc: [["topology", "Topology"], ["model", "Deployment model"], ["requirements", "Requirements"], ["kustomize", "Kustomize"], ["helm", "Helm"], ["preflight", "Preflight"], ["rollout", "Rollout"], ["hardening", "Hardening"]],
    html: `
      <h1>Kubernetes and Helm</h1>
      <p>FDR runs as a DaemonSet because every pod records the kernel of its node. The pod is privileged, mounts host tracefs, and normally writes captures to host storage. This is node administration packaged as a workload, not an ordinary application pod.</p>
      <h2 id="topology">Deployment topology</h2>
      <ol>
        <li>Kubernetes schedules one privileged FDR pod on each selected Linux node.</li>
        <li>The pod mounts that node's tracefs and capture directory. It records only the kernel of that node.</li>
        <li>A ConfigMap supplies the instance configuration. A checksum change rolls the pod when configuration changes.</li>
        <li>Prometheus scrapes the pod's HTTP metrics endpoint. Grafana displays those metrics.</li>
        <li>The actual evidence remains in the node-local capture files. Prometheus and Grafana report recorder state but do not contain the trace records.</li>
      </ol>
      <h2 id="model">Deployment model</h2>
      <table><thead><tr><th>Concern</th><th>Model</th></tr></thead><tbody>
        <tr><td>Cardinality</td><td>One pod per selected Linux node.</td></tr>
        <tr><td>Kernel view</td><td>The host kernel and host tracefs.</td></tr>
        <tr><td>Configuration</td><td>ConfigMap-backed files, one instance per <code>*.conf</code>.</td></tr>
        <tr><td>Storage</td><td>Host path by default; retention and node-disk protection remain operator duties.</td></tr>
        <tr><td>Monitoring</td><td>Port 9119, optional PodMonitor, alerts, dashboard, and NetworkPolicy.</td></tr>
        <tr><td>Rollout</td><td>A configuration checksum changes the pod template.</td></tr>
      </tbody></table>
      <h2 id="requirements">Requirements</h2>
      <ul><li>Linux nodes with tracefs at <code>/sys/kernel/tracing</code>.</li><li>Permission for privileged pods.</li><li>Selected tracepoints on every targeted kernel.</li><li>A pinned trusted image.</li><li>A reviewed host path, free-space threshold, size, and retention plan.</li></ul>

      <h2 id="kustomize">Plain manifests</h2>
      <pre><code>kubectl apply -k deploy/kubernetes
kubectl -n fdr-system get daemonset,pods -o wide
kubectl -n fdr-system logs -l app=fdr -c tracefs-preflight
kubectl -n fdr-system logs -l app=fdr -c fdrd --tail=200</code></pre>
      <p>Review namespace, service account, ConfigMap, DaemonSet, host paths, image, node selector, and tolerations. Base scheduling selects Linux nodes and does not silently tolerate arbitrary taints.</p>

      <h2 id="helm">Helm installation</h2>
      <pre><code>helm lint ./deploy/helm/fdr --strict
helm template fdr ./deploy/helm/fdr -n fdr-system -f production-values.yaml
helm upgrade --install fdr ./deploy/helm/fdr \
  --namespace fdr-system --create-namespace
kubectl -n fdr-system rollout status daemonset/fdr</code></pre>
      <p>Use reviewed values for image pinning, recorder configuration, capture path, resources, scheduling, module access, PodMonitor, alerts, dashboard, and NetworkPolicy.</p>

      <h2 id="preflight">Tracefs preflight</h2>
      <p>The init container verifies mount type, the <code>instances</code> directory, and required write access. A failure is a node setup or security-policy problem, not a reason to remove the check.</p>
      <pre><code>kubectl -n fdr-system logs POD_NAME -c tracefs-preflight
findmnt -T /sys/kernel/tracing</code></pre>

      <h2 id="rollout">Configuration rollout</h2>
      <ol><li>Render and review effective privilege, mounts, configuration, and scheduling.</li><li>Validate the same configuration with the target binary.</li><li>Preserve incident evidence.</li><li>Apply and watch by node.</li><li>Check preflight, previous logs, readiness, counters, workers, and one real record.</li><li>Confirm only expected instance names exist.</li></ol>

      <h2 id="hardening">Hardening checklist</h2>
      <div class="box-stop"><p>A privileged FDR pod can control host tracing. Treat compromise as potential node compromise.</p></div>
      <ul>
        <li>Pin an immutable image digest and restrict RBAC for changes.</li>
        <li>Target approved Linux node pools and add tolerations explicitly.</li>
        <li>Keep host <code>/lib/modules</code> disabled unless required.</li>
        <li>Restrict port 9119 with NetworkPolicy and infrastructure controls.</li>
        <li>Protect host captures and define secure collection and deletion.</li>
        <li>Test SELinux, AppArmor, admission policy, and the actual network plugin.</li>
      </ul>
    `,
  },
  {
    slug: "observability",
    title: "Health, readiness, and observability",
    description: "Endpoint semantics, complete metric reference, alerts, and readiness interpretation.",
    toc: [["endpoints", "Endpoints"], ["metrics", "Metrics"], ["queries", "PromQL"], ["states", "State interpretation"], ["recorded-states", "Recorded states"], ["alerts", "Alert response"]],
    html: `
      <h1>Health, readiness, and observability</h1>
      <p>The listener accepts unauthenticated IPv4 GET requests and binds to <code>127.0.0.1:9119</code> by default. It provides no TLS, authentication, mutation, or remote configuration.</p>
      <h2 id="endpoints">HTTP endpoints</h2>
      <table><thead><tr><th>Endpoint</th><th>Response</th><th>Meaning</th></tr></thead><tbody>
        <tr><td><code>/healthz</code></td><td><code>200 ok</code></td><td>The parent event loop is alive.</td></tr>
        <tr><td><code>/readyz</code></td><td><code>200 ready</code></td><td>No known integrity failure has latched.</td></tr>
        <tr><td><code>/readyz</code></td><td><code>503 not ready</code></td><td>A probe, collector, write, rotation, storage, or trace-loss failure was observed.</td></tr>
        <tr><td><code>/metrics</code></td><td><code>200</code></td><td>Prometheus text exposition.</td></tr>
        <tr><td>Other</td><td><code>404</code></td><td>Unknown endpoint.</td></tr>
      </tbody></table>
      <h2 id="metrics">Metric reference</h2>
      <table><thead><tr><th>Metric</th><th>Type</th><th>Interpretation</th></tr></thead><tbody>
        <tr><td><code>fdr_bytes_written_total</code></td><td>Counter</td><td>Successful bytes. Volume is not proof of completeness.</td></tr>
        <tr><td><code>fdr_bytes_dropped_total</code></td><td>Counter</td><td>Bytes discarded by free-space protection or failed rotation.</td></tr>
        <tr><td><code>fdr_rotations_total</code></td><td>Counter</td><td>Successful bounded-file rotations.</td></tr>
        <tr><td><code>fdr_rotation_failures_total</code></td><td>Counter</td><td>Rotation failures before paced retry; makes readiness false.</td></tr>
        <tr><td><code>fdr_probe_failures_total</code></td><td>Counter</td><td>Event, filter, or module setup failures; makes readiness false.</td></tr>
        <tr><td><code>fdr_write_errors_total</code></td><td>Counter</td><td>Capture write or collector errors.</td></tr>
        <tr><td><code>fdr_reloads_total</code></td><td>Counter</td><td>Accepted SIGHUP reloads; rejected syntax is not counted.</td></tr>
        <tr><td><code>fdr_trace_overruns_total</code></td><td>Counter</td><td>Kernel ring-buffer overruns across instances and CPUs.</td></tr>
        <tr><td><code>fdr_trace_dropped_events_total</code></td><td>Counter</td><td>Events the kernel reports as dropped.</td></tr>
        <tr><td><code>fdr_trace_commit_overruns_total</code></td><td>Counter</td><td>Kernel commit overruns found in tracefs statistics.</td></tr>
        <tr><td><code>fdr_instances</code></td><td>Gauge</td><td>Configured instances owned by the parent.</td></tr>
        <tr><td><code>fdr_workers_alive</code></td><td>Gauge</td><td>Currently live workers.</td></tr>
        <tr><td><code>fdr_ready</code></td><td>Gauge</td><td><code>1</code> when ready, <code>0</code> after known failure.</td></tr>
      </tbody></table>
      <h2 id="queries">Useful PromQL</h2>
      <pre><code>fdr_ready == 0
fdr_workers_alive &lt; fdr_instances
increase(fdr_bytes_dropped_total[5m]) &gt; 0
increase(fdr_rotation_failures_total[5m]) &gt; 0
increase(fdr_write_errors_total[5m]) &gt; 0
increase(fdr_probe_failures_total[5m]) &gt; 0
increase(fdr_trace_overruns_total[5m])
  + increase(fdr_trace_dropped_events_total[5m])
  + increase(fdr_trace_commit_overruns_total[5m]) &gt; 0</code></pre>
      <h2 id="states">Reading state correctly</h2>
      <table><thead><tr><th>State</th><th>Meaning</th><th>Action</th></tr></thead><tbody>
        <tr><td><span class="status-word">Ready</span></td><td>No known failure and counters are stable.</td><td>Continue monitoring; this is not proof against unobserved loss.</td></tr>
        <tr><td><span class="status-word">Unready</span></td><td>Parent lives but evidence is degraded.</td><td>Preserve files, metrics, and logs; identify the changing counter.</td></tr>
        <tr><td><span class="status-word">Absent</span></td><td>No working supervisor.</td><td>Inspect service or pod exit and previous logs.</td></tr>
        <tr><td><span class="status-word">Dropping</span></td><td>Storage protection discards output.</td><td>Treat capture as incomplete and repair storage.</td></tr>
      </tbody></table>

      <h2 id="recorded-states">Recorded observability states</h2>
      <div class="screenshot-pair">
        <figure class="doc-figure">
          <a href="/assets/validation-grafana-healthy.png" target="_blank" rel="noopener"><img src="/assets/validation-grafana-healthy.png" alt="Grafana FDR dashboard showing READY, zero kernel trace loss, zero storage drops, live worker coverage, throughput, and rotations." loading="lazy" /></a>
          <figcaption><strong>Healthy recorded state.</strong> Read readiness together with zero loss, zero storage drops, worker parity, active throughput, and expected rotations. Click for the full captured resolution.</figcaption>
        </figure>
        <figure class="doc-figure">
          <a href="/assets/validation-grafana-degraded.png" target="_blank" rel="noopener"><img src="/assets/validation-grafana-degraded.png" alt="Grafana FDR dashboard showing NOT READY after an intentionally unavailable tracepoint while loss and storage counters remain zero." loading="lazy" /></a>
          <figcaption><strong>Degraded probe state.</strong> The recorder remains live but shows NOT READY after the lab installs an unavailable tracepoint. Zero loss counters do not cancel the explicit probe failure.</figcaption>
        </figure>
      </div>
      <figure class="doc-figure">
        <a href="/assets/validation-prometheus-target.png" target="_blank" rel="noopener"><img src="/assets/validation-prometheus-target.png" alt="Prometheus target health page showing the FDR PodMonitor target up on port 9119 metrics." loading="lazy" /></a>
        <figcaption><strong>Prometheus discovery.</strong> The PodMonitor selects the FDR pod directly, without a Service. The green target proves scrape reachability, not capture completeness.</figcaption>
      </figure>
      <figure class="doc-figure">
        <a href="/assets/validation-trace-integrity.png" target="_blank" rel="noopener"><img src="/assets/validation-trace-integrity.png" alt="Grafana trace integrity panel showing overwritten, dropped, and commit overrun counters at zero." loading="lazy" /></a>
        <figcaption><strong>Integrity panel detail.</strong> The three kernel loss series remain separately visible. Their zero values are meaningful only for the displayed target, interval, and recorded workload.</figcaption>
      </figure>
      <h2 id="alerts">Alert response order</h2>
      <ol><li>Record alert time, node, and instance.</li><li>Save metrics before restart.</li><li>Preserve capture generations and logs.</li><li>Identify the first changing counter.</li><li>Classify kernel, probe, collector, rotation, filesystem, or supervision failure.</li><li>Recover, then verify with a real event.</li></ol>
    `,
  },
  {
    slug: "incident-response",
    title: "Incident evidence workflow",
    description: "Preserve volatile tracing evidence and provenance before changing recorder state.",
    toc: [["workflow", "Workflow"], ["principle", "Preserve first"], ["manifest", "Evidence manifest"], ["host", "Host collection"], ["cluster", "Kubernetes collection"], ["custody", "Handling"], ["recovery", "Recovery"]],
    html: `
      <h1>Incident evidence workflow</h1>
      <h2 id="workflow">Response workflow</h2>
      <ol>
        <li><strong>Record the alert.</strong> Save the time, node, instance, and observed readiness state.</li>
        <li><strong>Preserve volatile evidence.</strong> Copy metrics, configuration, logs, tracefs statistics, and capture generations before changing the recorder.</li>
        <li><strong>Find the first changed signal.</strong> Use timestamps and cumulative counters to order the failure.</li>
        <li><strong>Classify the boundary.</strong> Decide whether the first failure is in the kernel buffer, probe setup, storage, collector, or service supervision.</li>
        <li><strong>Change one boundary.</strong> Make the narrowest corrective change, then reload or restart through the normal owner.</li>
        <li><strong>Verify the new state.</strong> Generate a real event, confirm workers and readiness, and ensure integrity counters remain stable.</li>
      </ol>
      <p>Reload and restart come after evidence collection because they replace buffers and reset process-lifetime readiness and counters. If the failure returns, preserve a new evidence generation before making another change.</p>
      <h2 id="principle">Preserve first</h2>
      <div class="box-stop"><p>Do not reload, restart, rotate manually, edit probes, or delete tracefs instances until volatile evidence and context are saved. Those actions reset counters, replace buffers, close files, and can erase the failure sequence.</p></div>
      <h2 id="manifest">Evidence manifest</h2>
      <ol>
        <li>UTC collection and alert start times.</li><li>Hostname or node, kernel, boot ID, and FDR version.</li>
        <li>Source revision, package version, or image digest.</li><li>Exact active configuration and arguments.</li>
        <li>Current metrics, health, and readiness responses.</li><li>Current capture, rotations, mode, owner, and filesystem state.</li>
        <li>Service logs or current and previous pod logs.</li><li>Host or Kubernetes events and restart history.</li>
        <li>Owned instance <code>per_cpu/*/stats</code>, when safe.</li><li>Artifact hashes when chain of custody matters.</li>
      </ol>
      <h2 id="host">Host collection</h2>
      <pre><code>mkdir -m 0700 fdr-evidence
cd fdr-evidence
date --utc --iso-8601=seconds &gt; collected-at.txt
uname -a &gt; uname.txt
cat /proc/sys/kernel/random/boot_id &gt; boot-id.txt
fdrd -V &gt; fdr-version.txt
curl --silent http://127.0.0.1:9119/metrics &gt; fdr-metrics.txt
curl --silent http://127.0.0.1:9119/healthz &gt; healthz.txt
curl --silent http://127.0.0.1:9119/readyz &gt; readyz.txt
sudo cp -a /etc/fdr.d ./fdr-config
sudo cp -a /var/log/fdr ./fdr-captures
journalctl -u fdr --since '2 hours ago' --no-pager &gt; fdr-journal.txt
sha256sum fdr-metrics.txt fdr-journal.txt &gt; SHA256SUMS</code></pre>
      <h2 id="cluster">Kubernetes collection</h2>
      <pre><code>kubectl -n fdr-system get pod POD -o yaml &gt; pod.yaml
kubectl get node NODE -o yaml &gt; node.yaml
kubectl -n fdr-system logs POD -c fdrd &gt; fdr-current.log
kubectl -n fdr-system logs POD -c fdrd --previous &gt; fdr-previous.log
kubectl -n fdr-system logs POD -c tracefs-preflight &gt; preflight.log
kubectl -n fdr-system get events --sort-by=.lastTimestamp &gt; events.txt
kubectl -n fdr-system get configmap -o yaml &gt; configmaps.yaml</code></pre>
      <p>Preserve the running pod specification because it records the actual image, mounts, arguments, node, resources, and security context.</p>
      <h2 id="custody">Sensitive-data handling</h2>
      <p>Kernel traces can contain process names, paths, identifiers, and workload timing. Store evidence in a protected directory, limit recipients, record transfers, and apply retention policy. Never attach raw captures or credentials to a public issue.</p>
      <h2 id="recovery">Recovery after preservation</h2>
      <ol><li>Classify the first integrity failure.</li><li>Change one relevant boundary.</li><li>Validate before activation.</li><li>Reload through the service manager.</li><li>Verify a real event, workers, readiness, and stable counters.</li><li>Keep pre-recovery and post-recovery evidence separate.</li></ol>
    `,
  },
  {
    slug: "troubleshooting",
    title: "Troubleshooting",
    description: "Symptom-led diagnosis for tracefs, probes, workers, storage, HTTP, and Kubernetes.",
    toc: [["matrix", "Symptom matrix"], ["unready", "Unready recorder"], ["loss", "Trace loss"], ["storage", "Storage"], ["cluster", "Kubernetes"], ["cleanup", "Cleanup safety"]],
    html: `
      <h1>Troubleshooting</h1>
      <p>Preserve incident evidence before fixing. Start with the first changing integrity signal, then inspect the narrowest boundary that can explain it.</p>
      <h2 id="matrix">Symptom matrix</h2>
      <table><thead><tr><th>Symptom</th><th>Likely boundary</th><th>Checks</th></tr></thead><tbody>
        <tr><td><code>no configuration files</code></td><td>Discovery</td><td>Check <code>-c</code>, suffix, directory depth, file type, and permissions.</td></tr>
        <tr><td>tracefs or <code>instances</code> missing</td><td>Host mount</td><td>Run <code>findmnt</code>; inspect <code>-d</code>; review host policy.</td></tr>
        <tr><td><code>/readyz</code> returns 503</td><td>Integrity latch</td><td>Compare counters and logs; preserve evidence before reset.</td></tr>
        <tr><td>Probe failures increase</td><td>Kernel interface</td><td>Check event, <code>format</code>, filter, module, and access.</td></tr>
        <tr><td>Trace-loss counters increase</td><td>Buffer or drain capacity</td><td>Correlate instance, workload, CPU, buffer, throttling, and storage.</td></tr>
        <tr><td>Storage drops increase</td><td>Filesystem protection</td><td>Check free percentage, inodes, filesystem, rotation, and competing writers.</td></tr>
        <tr><td>Write errors increase</td><td>Output path or I/O</td><td>Check mount, permission, file type, capacity, and kernel errors.</td></tr>
        <tr><td>Worker count is low</td><td>Collector or setup-only config</td><td>Missing persistent workers are faults; no-<code>saveto</code> workers exit by design.</td></tr>
        <tr><td>HTTP refused</td><td>Listener or process</td><td>Check process, address, port, namespace, firewall, and port-forward.</td></tr>
        <tr><td>Instance remains after crash</td><td>Ungraceful cleanup</td><td>Stop confirmed FDR processes and remove only verified owned names.</td></tr>
      </tbody></table>
      <h2 id="unready">A live but unready recorder</h2>
      <pre><code>curl -i http://127.0.0.1:9119/readyz
curl -s http://127.0.0.1:9119/metrics | grep '^fdr_'
journalctl -u fdr --since '30 minutes ago' --no-pager</code></pre>
      <p>Determine which counter moved first. Readiness remains false after an immediate condition stops, so the evidence timeline matters more than the current symptom.</p>
      <h2 id="loss">Kernel trace loss</h2>
      <ol><li>Save metrics and per-CPU stats.</li><li>Identify instance, CPUs, workload, and event set.</li><li>Check throttling, storage blocking, and restarts.</li><li>Measure event rate.</li><li>Narrow unnecessary probes.</li><li>Calculate total memory before enlarging per-CPU buffers.</li><li>Repeat peak load on every supported kernel.</li></ol>
      <div class="box-warning"><p>Loss is irreversible. A larger buffer absorbs bursts but cannot compensate indefinitely when sustained drain rate is below event rate.</p></div>
      <h2 id="storage">Storage and rotation</h2>
      <pre><code>df -h /var/log/fdr
df -i /var/log/fdr
namei -l /var/log/fdr/node.log
stat /var/log/fdr/node.log /var/log/fdr/node.log.1
journalctl -k --since '30 minutes ago' --no-pager</code></pre>
      <h2 id="cluster">Kubernetes restart loops</h2>
      <pre><code>kubectl -n fdr-system describe pod POD
kubectl -n fdr-system logs POD -c tracefs-preflight
kubectl -n fdr-system logs POD -c fdrd --previous
kubectl -n fdr-system get events --sort-by=.lastTimestamp</code></pre>
      <p>Separate init failure from main-container failure. Then check node placement, mount type, host-path access, privileged admission, image architecture, configuration, kernel events, and collector exit.</p>
      <h2 id="cleanup">Cleanup safety</h2>
      <div class="box-stop"><p>Never recursively delete tracefs instances or an unfamiliar host directory. Resolve exact configured names and paths first. Another observability tool may share tracefs.</p></div>
    `,
  },
  {
    slug: "security",
    title: "Security model and hardening",
    description: "Privilege boundary, sensitive data, network exposure, configuration trust, and controls.",
    toc: [["boundary", "Privilege boundary"], ["configuration", "Configuration trust"], ["network", "HTTP exposure"], ["data", "Capture data"], ["host", "Host controls"], ["cluster", "Cluster controls"], ["report", "Reporting"]],
    html: `
      <h1>Security model and hardening</h1>
      <h2 id="boundary">Privilege boundary</h2>
      <p>FDR controls host-kernel tracing and normally runs as root. Its Kubernetes deployment is privileged. A compromise of the daemon, its configuration authority, or its pod can affect the host. Do not treat container isolation as a security boundary for this workload.</p>
      <h2 id="configuration">Configuration is executable policy</h2>
      <ul><li>Restrict writes to configuration, ConfigMaps, Helm values, units, and manifests.</li><li>Review every tracepoint and filter for performance and exposure.</li><li>Allow <code>modprobe</code> only for approved modules.</li><li>Validate complete directories and record reviewed revisions.</li><li>Use protected change control because valid syntax can still be unsafe.</li></ul>
      <h2 id="network">HTTP exposure</h2>
      <p>The HTTP server has no application authentication or TLS. Keep loopback on hosts. In Kubernetes, expose it only to monitoring and enforce access with NetworkPolicy plus infrastructure controls. Test enforcement with the actual network plugin.</p>
      <h2 id="data">Capture confidentiality and integrity</h2>
      <p>Trace records may reveal process names, paths, identifiers, timing, topology, and failures. Capture files use mode 0600, but directory, volume, backup, collection, and deletion policy remain external responsibilities.</p>
      <table><thead><tr><th>Control</th><th>Purpose</th></tr></thead><tbody>
        <tr><td>Protected directory</td><td>Prevent reading by unrelated services.</td></tr>
        <tr><td>Bounded retention</td><td>Limit storage and sensitive-history lifetime.</td></tr>
        <tr><td>Evidence checksums</td><td>Detect modification after preservation.</td></tr>
        <tr><td>Restricted issue attachments</td><td>Prevent publication of raw workload context.</td></tr>
        <tr><td>Secure deletion</td><td>Apply data-handling policy to captures and backups.</td></tr>
      </tbody></table>
      <h2 id="host">Host hardening</h2>
      <ul><li>Use verified packages.</li><li>Restrict binary, unit, config, output, and rotation changes.</li><li>Keep HTTP on loopback.</li><li>Use the smallest useful event set.</li><li>Monitor space, writes, rotation, and loss.</li><li>Qualify mandatory-access-control policy.</li></ul>
      <h2 id="cluster">Kubernetes hardening</h2>
      <ul><li>Pin images and restrict changes.</li><li>Limit scheduling and tolerations.</li><li>Disable module-tree access by default.</li><li>Protect namespace and configuration with narrow RBAC.</li><li>Restrict monitoring ingress.</li><li>Audit privileged admission and hostPath exceptions.</li></ul>
      <h2 id="report">Reporting vulnerabilities</h2>
      <p>Do not open a public issue for an undisclosed vulnerability. Follow the repository's <a href="https://github.com/AnouarMohamed/Ftrace-Flight-Recorder/blob/main/SECURITY.md">security policy</a> and include affected version, environment, impact, minimal reproduction, and safe diagnostics.</p>
    `,
  },
  {
    slug: "performance",
    title: "Performance engineering",
    description: "Capacity planning, event qualification, buffer sizing, collector headroom, and benchmarking.",
    toc: [["model", "Capacity model"], ["memory", "Memory"], ["throughput", "Throughput"], ["qualification", "Qualification"], ["loss-test", "Controlled loss"], ["interpretation", "Interpretation"]],
    html: `
      <h1>Performance engineering</h1>
      <p>FDR performance is a property of the whole system: kernel, CPU count, events, filters, workload, buffers, collector scheduling, formatting, filesystem, rotation, and resource policy. A benchmark of one layer cannot certify the full path.</p>
      <h2 id="model">Capacity model</h2>
      <pre><code>required drain rate &gt; sustained formatted event rate
burst capacity ≈ usable per-CPU buffer bytes / peak event bytes per second
retention window ≈ usable capture bytes / average persisted bytes per second</code></pre>
      <p>These are planning approximations. Kernel overhead, record size, merge behavior, writeback, rotation, and burst shape affect measurement.</p>
      <h2 id="memory">Per-CPU buffer memory</h2>
      <pre><code>trace memory ≈ instance buffer size × online CPU count × instance count</code></pre>
      <p>Two <code>16m</code> instances on a 64-CPU host request roughly 2 GiB before metadata. Confirm actual allocation and never transfer a size blindly from a low-core host.</p>
      <h2 id="throughput">Collector and storage throughput</h2>
      <ul><li>Measure real tracefs text reads, not only regular-file copies.</li><li>Include formatting and actual fields.</li><li>Observe throttling, scheduling delay, I/O latency, and writeback.</li><li>Exercise rotation at realistic sizes.</li><li>Test low-free-space behavior.</li><li>Separate average rate from bursts.</li></ul>
      <p>The compatible collector uses an 8 KiB minimum read selected through real tracefs profiling. Experimental raw or per-CPU backends are not equivalent unless they preserve text semantics, ordering, lifecycle, and integrity reporting.</p>
      <h2 id="qualification">Event-set qualification</h2>
      <ol><li>Write the incident question for each event.</li><li>Remove broad and redundant probes.</li><li>Confirm fields on every kernel.</li><li>Measure idle, normal, peak, and pathological workloads.</li><li>Record CPU, topology, kernel, config, buffers, storage, and revision.</li><li>Track volume, rotations, resources, and every loss counter.</li><li>Run through writeback and rotation cycles.</li><li>Set thresholds with production margin.</li></ol>
      <h2 id="loss-test">Controlled-loss testing</h2>
      <div class="box-stop"><p>Deliberate overload belongs only in a disposable VM or approved isolated environment. It can consume CPU, memory, I/O, and tracing capacity.</p></div>
      <p>A valid test proves the complete signal path: overload, tracefs loss, FDR sampling, counter increase, unready state, and identification of the affected interval.</p>
      <h2 id="interpretation">Interpreting results</h2>
      <table><thead><tr><th>Observation</th><th>Likely conclusion</th><th>Next test</th></tr></thead><tbody>
        <tr><td>Loss only during bursts</td><td>Ring-buffer burst capacity is insufficient.</td><td>Compare narrower probes and calculated buffer increase.</td></tr>
        <tr><td>Loss grows under sustained load</td><td>Drain rate is insufficient.</td><td>Inspect CPU, throttling, event rate, and I/O.</td></tr>
        <tr><td>No kernel loss, storage drops grow</td><td>Filesystem protection discards bytes.</td><td>Test capacity, retention, isolation, and rotation.</td></tr>
        <tr><td>Microbenchmark improves, real path does not</td><td>That layer is not dominant.</td><td>Profile actual tracefs text reads.</td></tr>
        <tr><td>One kernel passes, another loses</td><td>Kernel or event behavior differs.</td><td>Qualify each separately.</td></tr>
      </tbody></table>
    `,
  },
  {
    slug: "validation",
    title: "Validation evidence",
    description: "Test layers, recorded real-kernel runs, demonstrated behavior, and remaining limits.",
    toc: [["layers", "Validation layers"], ["recorded", "Recorded runs"], ["matrix-visual", "Matrix visual"], ["proven", "Demonstrated"], ["limits", "Open limits"], ["reproduce", "Reproduce"]],
    html: `
      <h1>Validation evidence</h1>
      <p>Validation is layered. Fake tracefs proves deterministic daemon behavior. Real-kernel and Kubernetes runs prove integration only for the named kernel, environment, configuration, workload, and revision.</p>
      <h2 id="layers">Validation layers</h2>
      <table><thead><tr><th>Layer</th><th>Covers</th><th>Does not cover</th></tr></thead><tbody>
        <tr><td><code>make check</code></td><td>Parser, lifecycle, HTTP, metrics, reload, rotation, failure paths.</td><td>Real kernel event production.</td></tr>
        <tr><td><code>make sanitize</code></td><td>Instrumented memory and undefined behavior.</td><td>Production timing.</td></tr>
        <tr><td>Kind lab</td><td>Real host capture, Helm, Prometheus, alerts, Grafana.</td><td>Independent kernels per node.</td></tr>
        <tr><td>KVM matrix</td><td>Systemd and controlled loss on named kernels.</td><td>Untested distributions and workloads.</td></tr>
        <tr><td>Ubuntu and k3s</td><td>Jammy, Noble, and single-node k3s recorded path.</td><td>General multi-node behavior.</td></tr>
        <tr><td>Benchmarks</td><td>Copy correctness, real tracefs reads, backend experiments.</td><td>Approval of incompatible faster backends.</td></tr>
      </tbody></table>
      <h2 id="recorded">Recorded reference runs</h2>
      <ul><li>Kind on Linux 7.1.8 with Prometheus and Grafana.</li><li>KVM systemd and controlled loss on Linux 7.0.12 and 7.1.8.</li><li>Ubuntu Jammy, Noble, and Noble single-node k3s.</li><li>Real tracefs text-reader profiling and collector-copy benchmarks.</li><li>Experimental per-CPU/raw backend work.</li><li>High-core loss sampling and topology-cache measurements.</li></ul>
      <h2 id="matrix-visual">Recorded kernel matrix</h2>
      <figure class="doc-figure">
        <a href="/assets/validation-vm-matrix.png" target="_blank" rel="noopener"><img src="/assets/validation-vm-matrix.png" alt="Technical summary of the Linux 7.0.12 and 7.1.8 VM validation matrix showing systemd lifecycle, normal zero-loss capture, controlled loss detection, and evidence retention." loading="lazy" /></a>
        <figcaption><strong>Disposable VM evidence summary.</strong> Both recorded kernels passed systemd lifecycle and nominal zero-loss capture, then detected deliberately induced loss and degraded readiness. The visual is a summary; the linked reports retain exact environment and raw artifacts.</figcaption>
      </figure>
      <h2 id="proven">What has been demonstrated</h2>
      <ul><li>Scheduler probes produce real records.</li><li>Normal recorded load had no reported loss.</li><li>Controlled overload produced overrun and unready state.</li><li>Bad probes preserved liveness while readiness degraded.</li><li>Config changes rolled pods by checksum.</li><li>Persistent collector failure caused recovery.</li><li>Rotation preserved non-empty mode-0600 files.</li><li>Prometheus and Grafana displayed integrity signals.</li><li>Graceful teardown removed owned instances.</li></ul>
      <h2 id="limits">What remains open</h2>
      <div class="box-warning"><p>Recorded evidence is not universal certification. Production approval needs target workload, storage, policy, and kernel testing.</p></div>
      <ul><li>Representative curves by event set, CPU count, and rate.</li><li>Production disk pressure and extended rotation.</li><li>SELinux and AppArmor qualification.</li><li>Genuine multi-node behavior.</li><li>NetworkPolicy enforcement across plugins.</li></ul>
      <h2 id="reproduce">Reproduce the checks</h2>
      <pre><code>make check
make sanitize
deploy/kind/lab.sh smoke</code></pre>
      <p>Use VM harnesses only in disposable guests. See the source <a href="https://github.com/AnouarMohamed/Ftrace-Flight-Recorder/tree/main/docs/validation">validation index</a> for committed reports and raw artifacts.</p>
    `,
  },
  {
    slug: "release-notes",
    title: "Release notes and compatibility",
    description: "Current v1.4 baseline, additions, upgrade checks, and kernel compatibility contract.",
    toc: [["baseline", "v1.4 baseline"], ["current", "Current additions"], ["compatibility", "Compatibility"], ["upgrade", "Upgrade checklist"], ["support", "Support bundle"]],
    html: `
      <h1>Release notes and compatibility</h1>
      <h2 id="baseline">v1.4 baseline</h2>
      <p>The production baseline includes isolated instances and workers, strict validation, transactional reloads, free-space protection, bounded rotation, supervision, signals, health and readiness, Prometheus metrics, systemd and RPM packaging, OCI image, Kustomize, Helm, unit tests, fake-tracefs tests, sanitizers, and static analysis.</p>
      <h2 id="current">Current documented additions</h2>
      <ul><li>Five-second sampling of tracefs loss counters.</li><li>Sticky readiness degradation for known kernel loss.</li><li>PodMonitor, six alerts, Grafana dashboard, and ingress NetworkPolicy.</li><li>Tracefs preflight with mount diagnostics.</li><li>Linux node scheduling and explicit tolerations.</li><li>Opt-in module-tree access.</li><li>Kind, KVM, Ubuntu, and k3s evidence.</li><li>Real tracefs and high-core benchmarks.</li></ul>
      <h2 id="compatibility">Kernel compatibility contract</h2>
      <p>FDR depends on tracefs instances plus operator-selected event names and fields. Grammar validation cannot prove a runtime kernel interface. Only testing on the target kernel can.</p>
      <table><thead><tr><th>Change</th><th>Required review</th></tr></thead><tbody>
        <tr><td>Kernel upgrade</td><td>Events, fields, statistics, normal load, controlled loss, teardown.</td></tr>
        <tr><td>CPU-count change</td><td>Total trace memory, high-core sampling, event rate, headroom.</td></tr>
        <tr><td>New event set</td><td>Question, sensitivity, rate, filters, loss, storage, retention.</td></tr>
        <tr><td>Runtime or policy change</td><td>Privilege, hostPath, mounts, write access, shutdown.</td></tr>
        <tr><td>Storage change</td><td>Permissions, latency, free space, rotation, durability, collection.</td></tr>
      </tbody></table>
      <h2 id="upgrade">Upgrade checklist</h2>
      <ol><li>Read the <a href="https://github.com/AnouarMohamed/Ftrace-Flight-Recorder/blob/main/CHANGELOG.md">changelog</a>.</li><li>Back up configuration and preserve current evidence.</li><li>Run tests and parse validation with the new binary.</li><li>Render and inspect deployment manifests.</li><li>Upgrade a representative non-production node.</li><li>Verify lifecycle, a real event, rotation, HTTP, metrics, and loss.</li><li>Roll by controlled batches with rollback artifacts.</li></ol>
      <h2 id="support">Minimum support bundle</h2>
      <p>Include FDR version, kernel, distribution, CPU count, exact configuration, service or pod specification, logs, full metrics, capture metadata, tracefs mount information, and the shortest safe reproduction. Redact secrets, but retain timestamps and integrity counters.</p>
    `,
  },
  {
    slug: "deployment-reference",
    title: "Deployment values reference",
    description: "Every Helm value, Kustomize invariant, probe, alert, volume, and production override.",
    toc: [["values", "Helm values"], ["workload", "Generated workload"], ["probes", "Probes"], ["alerts", "Alert rules"], ["network", "Network policy"], ["kustomize", "Kustomize base"], ["production", "Production review"]],
    html: `
      <h1>Deployment values reference</h1>
      <p>The Helm chart installs one privileged FDR pod on every selected Linux node. The chart namespace is the Helm release namespace; it does not create or own a Namespace. Defaults favor a reviewable first deployment and leave environment-specific controls disabled until explicitly configured.</p>

      <h2 id="values">Complete Helm values</h2>
      <table><thead><tr><th>Value</th><th>Default</th><th>Contract and effect</th></tr></thead><tbody>
        <tr><td><code>nameOverride</code></td><td>Empty</td><td>Overrides the chart name component used by generated resource names.</td></tr>
        <tr><td><code>fullnameOverride</code></td><td>Empty</td><td>Replaces the computed full resource name.</td></tr>
        <tr><td><code>image.repository</code></td><td><code>ghcr.io/anouarmohamed/fdr-k8s</code></td><td>Non-empty image repository. Pin a reviewed registry path in production.</td></tr>
        <tr><td><code>image.tag</code></td><td><code>v1.4.0</code></td><td>Non-empty application tag. Prefer an immutable digest through the reviewed image workflow where supported.</td></tr>
        <tr><td><code>image.pullPolicy</code></td><td><code>IfNotPresent</code></td><td>One of <code>Always</code>, <code>IfNotPresent</code>, or <code>Never</code>.</td></tr>
        <tr><td><code>http.enabled</code></td><td><code>true</code></td><td>Adds port, startup, liveness, and readiness probes. When false, FDR receives <code>-p 0</code>.</td></tr>
        <tr><td><code>http.address</code></td><td><code>0.0.0.0</code></td><td>IPv4 address matching dotted-decimal schema. Used only when HTTP is enabled.</td></tr>
        <tr><td><code>http.port</code></td><td><code>9119</code></td><td>Integer from 1 through 65535.</td></tr>
        <tr><td><code>terminationGracePeriodSeconds</code></td><td><code>30</code></td><td>Positive shutdown budget for worker termination and owned-instance cleanup.</td></tr>
        <tr><td><code>securityContext.privileged</code></td><td><code>true</code></td><td>Required by the supported host-kernel tracing model.</td></tr>
        <tr><td><code>securityContext.runAsUser</code></td><td><code>0</code></td><td>Runs FDR as root inside the privileged pod.</td></tr>
        <tr><td><code>securityContext.readOnlyRootFilesystem</code></td><td><code>true</code></td><td>Keeps the image filesystem read-only; only declared mounts are writable.</td></tr>
        <tr><td><code>preflight.enabled</code></td><td><code>true</code></td><td>Runs the tracefs type, directory, and write-access checks before FDR.</td></tr>
        <tr><td><code>nodeSelector</code></td><td><code>kubernetes.io/os: linux</code></td><td>String map selecting eligible nodes. Narrow it for approved pools.</td></tr>
        <tr><td><code>tolerations</code></td><td>Empty list</td><td>No taints are tolerated implicitly. Add only reviewed taints.</td></tr>
        <tr><td><code>affinity</code></td><td>Empty object</td><td>Optional Kubernetes affinity structure.</td></tr>
        <tr><td><code>priorityClassName</code></td><td>Empty</td><td>Optional existing PriorityClass. Evaluate eviction and workload impact before setting it.</td></tr>
        <tr><td><code>resources.requests.cpu</code></td><td><code>50m</code></td><td>Scheduling request, not a qualified capacity recommendation for every event set.</td></tr>
        <tr><td><code>resources.requests.memory</code></td><td><code>64Mi</code></td><td>Userspace request. Kernel trace buffers are outside the container memory estimate.</td></tr>
        <tr><td><code>resources.limits.memory</code></td><td><code>256Mi</code></td><td>Userspace memory limit. There is intentionally no default CPU limit.</td></tr>
        <tr><td><code>tracefs.hostPath</code></td><td><code>/sys/kernel/tracing</code></td><td>Absolute host tracefs path. Use the debugfs path only on hosts intentionally configured that way.</td></tr>
        <tr><td><code>modules.enabled</code></td><td><code>false</code></td><td>Controls whether host modules are exposed read-only.</td></tr>
        <tr><td><code>modules.hostPath</code></td><td><code>/lib/modules</code></td><td>Absolute module-tree host path, mounted only when enabled.</td></tr>
        <tr><td><code>logs.hostPath</code></td><td><code>/var/log/fdr</code></td><td>Absolute capture directory, created as a hostPath when absent.</td></tr>
        <tr><td><code>config</code></td><td>One <code>node.conf</code></td><td>At least one string-valued entry. Every key becomes one configuration file.</td></tr>
        <tr><td><code>extraArgs</code></td><td>Empty list</td><td>Additional daemon arguments appended after chart-managed arguments. Avoid contradicting managed path and HTTP settings.</td></tr>
        <tr><td><code>podAnnotations</code></td><td>Empty object</td><td>Additional pod-template annotations. The chart always adds a configuration checksum.</td></tr>
        <tr><td><code>podLabels</code></td><td>Empty object</td><td>Additional pod labels; do not override selectors inconsistently.</td></tr>
        <tr><td><code>updateStrategy</code></td><td>Empty object</td><td>Optional DaemonSet update strategy. Kubernetes defaults apply when empty.</td></tr>
        <tr><td><code>monitoring.podMonitor.enabled</code></td><td><code>false</code></td><td>Creates a direct pod-discovery PodMonitor when Prometheus Operator CRDs exist.</td></tr>
        <tr><td><code>monitoring.podMonitor.namespace</code></td><td>Release namespace</td><td>Target namespace; it must already exist when different.</td></tr>
        <tr><td><code>monitoring.podMonitor.interval</code></td><td><code>30s</code></td><td>Duration matching integer plus <code>ms</code>, <code>s</code>, <code>m</code>, or <code>h</code>.</td></tr>
        <tr><td><code>monitoring.podMonitor.scrapeTimeout</code></td><td><code>10s</code></td><td>Prometheus scrape timeout using the same duration grammar.</td></tr>
        <tr><td><code>monitoring.podMonitor.additionalLabels</code></td><td>Empty object</td><td>Typically includes the monitoring stack release selector.</td></tr>
        <tr><td><code>monitoring.prometheusRule.*</code></td><td>Disabled, release namespace</td><td>Creates the six bundled alert rules with optional additional labels.</td></tr>
        <tr><td><code>monitoring.grafanaDashboard.*</code></td><td>Disabled, label <code>grafana_dashboard: \"1\"</code></td><td>Creates the dashboard ConfigMap for Grafana sidecar discovery. Labels must not be empty.</td></tr>
        <tr><td><code>networkPolicy.enabled</code></td><td><code>false</code></td><td>Creates an HTTP ingress policy only when HTTP is also enabled.</td></tr>
        <tr><td><code>networkPolicy.ingress.namespaceSelector</code></td><td>Namespace named <code>monitoring</code></td><td>Selects namespaces allowed to reach the HTTP port.</td></tr>
        <tr><td><code>networkPolicy.ingress.podSelector</code></td><td>Empty object</td><td>An empty selector permits every pod in selected namespaces; narrow it for production.</td></tr>
      </tbody></table>

      <h2 id="workload">Generated workload invariants</h2>
      <ul>
        <li><code>automountServiceAccountToken: false</code>; FDR does not need Kubernetes API credentials.</li>
        <li>The ConfigMap is mounted mode 0440 at <code>/etc/fdr.d</code>.</li>
        <li>Tracefs is mounted read-write at <code>/sys/kernel/tracing</code>.</li>
        <li>Captures use the configured host path at <code>/var/log/fdr</code>.</li>
        <li>Logrotate state and <code>/tmp</code> use pod-local <code>emptyDir</code> volumes.</li>
        <li>The module tree is absent unless <code>modules.enabled</code> is true.</li>
        <li>The checksum of rendered configuration is part of the pod template, so config changes roll the DaemonSet.</li>
        <li>The preflight container requests 5m CPU and 8Mi memory, with a 32Mi memory limit.</li>
      </ul>

      <h2 id="probes">Kubernetes probes</h2>
      <table><thead><tr><th>Probe</th><th>Endpoint</th><th>Timing</th><th>Purpose</th></tr></thead><tbody>
        <tr><td>Startup</td><td><code>/healthz</code></td><td>Every 2s, 30 failures</td><td>Allows up to roughly 60 seconds for parent startup before liveness begins.</td></tr>
        <tr><td>Liveness</td><td><code>/healthz</code></td><td>Every 10s, 2s timeout</td><td>Restarts an unresponsive parent.</td></tr>
        <tr><td>Readiness</td><td><code>/readyz</code></td><td>Every 5s, 2s timeout</td><td>Marks known-incomplete recorder state unready without conflating it with process death.</td></tr>
      </tbody></table>

      <h2 id="alerts">Bundled alert rules</h2>
      <table><thead><tr><th>Alert</th><th>Expression and delay</th><th>Severity</th><th>Operator meaning</th></tr></thead><tbody>
        <tr><td><code>FDRNotReady</code></td><td><code>fdr_ready == 0</code> for 2m</td><td>Warning</td><td>Inspect probe, loss, storage, rotation, and worker signals.</td></tr>
        <tr><td><code>FDRWorkerMissing</code></td><td><code>fdr_workers_alive &lt; fdr_instances</code> for 1m</td><td>Critical</td><td>A persistent collector is missing. Adjust this rule for intentional setup-only instances.</td></tr>
        <tr><td><code>FDRTraceDataLoss</code></td><td>Any five-minute increase across three kernel loss counters</td><td>Critical</td><td>The capture is incomplete and lost kernel events cannot be recovered.</td></tr>
        <tr><td><code>FDRWriteError</code></td><td>Five-minute write-error increase</td><td>Critical</td><td>Inspect filesystem, permissions, mount state, and pod logs.</td></tr>
        <tr><td><code>FDRStorageProtectionDrop</code></td><td>Five-minute dropped-byte increase</td><td>Warning</td><td>Free-space protection or failed rotation discarded evidence.</td></tr>
        <tr><td><code>FDRProbeFailure</code></td><td>Five-minute probe-failure increase</td><td>Warning</td><td>Confirm the event, filter, or module on the selected node kernel.</td></tr>
      </tbody></table>

      <h2 id="network">Network policy semantics</h2>
      <p>The optional policy selects FDR pods and permits TCP ingress only to the configured HTTP port from the configured namespace and optional pod selectors. It is not authentication. Enforcement depends on the cluster network plugin, and node-originated kubelet probe handling differs across implementations. Verify both unauthorized denial and continued startup, liveness, and readiness probing.</p>

      <h2 id="kustomize">Kustomize base invariants</h2>
      <p>The plain base mirrors the safe Helm defaults: Linux-only selection, no tolerations, image <code>fdr:v1.4.0</code>, no host module tree, no CPU limit, read-only root filesystem, no service-account token, tracefs preflight, ConfigMap checksum rollout, loop-free pod HTTP exposure, and capture storage at <code>/var/log/fdr</code>. Use private overlays for registry, node-pool, toleration, module, policy, or environment-specific changes.</p>

      <h2 id="production">Production review checklist</h2>
      <ol>
        <li>Pin the image and record its digest.</li><li>Narrow node selection and tolerations.</li><li>Calculate per-CPU trace memory.</li>
        <li>Qualify CPU headroom before adding a limit.</li><li>Review tracefs and capture host paths.</li><li>Keep modules off unless required.</li>
        <li>Validate every event and filter on each node kernel.</li><li>Enable monitoring CRDs only after their namespaces exist.</li>
        <li>Test NetworkPolicy enforcement and kubelet probes.</li><li>Render with strict Helm lint and inspect the effective DaemonSet before applying.</li>
      </ol>
    `,
  },
  {
    slug: "kind-lab",
    title: "Local Kind observability lab",
    description: "Complete host-kernel safety boundary, pinned stack, commands, lifecycle checks, evidence, and teardown.",
    toc: [["boundary", "Safety boundary"], ["components", "Pinned components"], ["prerequisites", "Prerequisites"], ["run", "Complete run"], ["inspect", "Inspect"], ["commands", "Command modes"], ["artifacts", "Artifacts"], ["teardown", "Teardown"], ["limits", "Limits"]],
    html: `
      <h1>Local Kind observability lab</h1>
      <p>The lab creates a dedicated Kind cluster, builds and loads the local FDR image, installs a focused monitoring stack, deploys one FDR recorder, and exercises healthy, degraded, recovery, rotation, and cleanup paths.</p>

      <h2 id="boundary">Safety boundary</h2>
      <div class="box-stop"><p>Kind nodes share the host kernel. The worker receives the host's writable <code>/sys/kernel/tracing</code>, so FDR changes real host tracefs state. The disposable cluster is not a kernel isolation boundary.</p></div>
      <p>The automation limits ownership to one worker and the <code>fdr-lab</code> instance. It refuses to create or delete until <code>FDR_LAB_ACKNOWLEDGE_HOST_KERNEL=yes</code> is set. It records cluster ownership and will not delete a same-named pre-existing cluster without separate <code>FDR_LAB_DELETE_EXISTING=yes</code> authorization.</p>

      <h2 id="components">Pinned components</h2>
      <table><thead><tr><th>Component</th><th>Version or source</th></tr></thead><tbody>
        <tr><td>Kind</td><td>Locally installed; validated with 0.31.0</td></tr>
        <tr><td>kube-prometheus-stack</td><td>Helm chart 88.5.4</td></tr>
        <tr><td>Grafana</td><td>11.5.2</td></tr>
        <tr><td>Prometheus</td><td>3.5.0</td></tr>
        <tr><td>FDR image</td><td>Local <code>fdr-lab:dev</code></td></tr>
        <tr><td>FDR chart</td><td>Working tree under <code>deploy/helm/fdr</code></td></tr>
      </tbody></table>
      <p>The focused monitoring profile disables unrelated dashboards, default rules, Alertmanager, node exporter, kube-state-metrics, and the disposable admission webhook. Prometheus still evaluates every FDR rule.</p>

      <h2 id="prerequisites">Prerequisites</h2>
      <ul>
        <li>Linux with read-write tracefs at <code>/sys/kernel/tracing</code>.</li>
        <li>Docker Engine, Kind, Helm, kubectl, curl, jq, findmnt, Git, and Playwright Chromium.</li>
        <li>At least 4 CPU cores, 8 GiB available memory, and 15 GiB free disk.</li>
        <li>Network access to the Kind node image, Alpine packages, and official Prometheus Community chart repository.</li>
      </ul>
      <pre><code>findmnt -T /sys/kernel/tracing
docker info
kind version
helm version
playwright install chromium</code></pre>
      <p>The script caches the pinned chart and loads only the cluster CPU architecture. Pulls are bounded to 15 minutes with three attempts. Override with <code>FDR_LAB_IMAGE_PULL_TIMEOUT=30m</code>. Monitoring readiness defaults to 10 minutes; override with <code>FDR_LAB_MONITORING_TIMEOUT=20m</code>.</p>

      <h2 id="run">Complete smoke workflow</h2>
      <pre class="terminal"><code>export FDR_LAB_ACKNOWLEDGE_HOST_KERNEL=yes
deploy/kind/lab.sh run</code></pre>
      <ol>
        <li>Build and load <code>fdr-lab:dev</code>.</li><li>Create the dedicated control-plane and worker cluster.</li>
        <li>Cache and load pinned monitoring images.</li><li>Install the focused Prometheus and Grafana stack.</li>
        <li>Install FDR with PodMonitor, PrometheusRule, dashboard, and NetworkPolicy.</li>
        <li>Check probes, every metric family, a real scheduler capture, Prometheus discovery, and Grafana provisioning.</li>
        <li>Capture healthy dashboard and Prometheus target screenshots.</li><li>Change configuration and require checksum rollout.</li>
        <li>Install an unavailable tracepoint and prove healthy liveness with degraded readiness.</li>
        <li>Restore configuration, terminate the collector, and require container restart and recovery.</li>
        <li>Require bounded rotation with non-empty mode-0600 current and previous files.</li>
        <li>Collect diagnostics, uninstall FDR, verify tracefs cleanup, and delete only the owned cluster.</li>
      </ol>
      <pre class="terminal"><code>FULL LAB PASS: lifecycle completed and evidence retained at ...</code></pre>

      <h2 id="inspect">Interactive inspection</h2>
      <pre><code>export FDR_LAB_ACKNOWLEDGE_HOST_KERNEL=yes
deploy/kind/lab.sh up
kubectl --context kind-fdr-lab get pods -A
kubectl --context kind-fdr-lab -n fdr-lab logs daemonset/fdr-lab -c fdrd
kubectl --context kind-fdr-lab -n fdr-lab exec daemonset/fdr-lab -c fdrd -- \
  curl --silent http://127.0.0.1:9119/metrics
deploy/kind/lab.sh grafana</code></pre>
      <p>Grafana is forwarded to <code>http://127.0.0.1:13000</code>. The lab credentials are <code>admin</code> and <code>fdr-lab</code>. Anonymous Viewer access exists only for automated screenshots and must not be copied into production.</p>

      <h2 id="commands">Command modes</h2>
      <table><thead><tr><th>Command</th><th>Behavior</th></tr></thead><tbody>
        <tr><td><code>up</code></td><td>Builds, installs, verifies nominal capture and observability, then leaves the cluster running.</td></tr>
        <tr><td><code>verify</code></td><td>Repeats non-disruptive capture and observability checks.</td></tr>
        <tr><td><code>smoke</code></td><td>Runs rollout, degradation, collector recovery, rotation, and screenshots without deletion.</td></tr>
        <tr><td><code>collect</code></td><td>Writes a fresh timestamped evidence bundle from the retained cluster.</td></tr>
        <tr><td><code>run</code></td><td>Runs the complete disruptive lifecycle and safe teardown.</td></tr>
        <tr><td><code>down</code></td><td>Uninstalls FDR, verifies instance removal, then deletes the owned cluster.</td></tr>
      </tbody></table>

      <h2 id="artifacts">Evidence and failure retention</h2>
      <p>Every full run writes a report, environment, cluster state, events, tracefs diagnostics, FDR and preflight logs, rendered monitoring resources, metrics, capture sample, Kind logs, and screenshots under <code>.build/fdr-lab-artifacts/runs/&lt;UTC timestamp&gt;</code>. A failed command or operator interrupt retains the cluster for diagnosis.</p>

      <h2 id="teardown">Safe teardown</h2>
      <pre><code>export FDR_LAB_ACKNOWLEDGE_HOST_KERNEL=yes
deploy/kind/lab.sh down</code></pre>
      <p>Teardown uninstalls FDR and waits for <code>/sys/kernel/tracing/instances/fdr-lab</code> to disappear before deleting the cluster. Cleanup failure stops deletion and retains the environment.</p>

      <h2 id="limits">What Kind does not prove</h2>
      <ul><li>Production performance or CPU limits.</li><li>Independent kernels or real per-node tracefs isolation.</li><li>Compatibility beyond the recorded host kernel.</li><li>SELinux, AppArmor, or distribution-specific behavior.</li><li>NetworkPolicy enforcement by Kind's default plugin.</li><li>High-volume, disk-pressure, or destructive failure behavior.</li></ul>
    `,
  },
  {
    slug: "vm-validation",
    title: "Disposable VM validation",
    description: "Real-kernel systemd, controlled-loss, performance, Ubuntu LTS, and k3s qualification.",
    toc: [["boundary", "Isolation model"], ["requirements", "Requirements"], ["kernel-matrix", "Installed kernels"], ["performance", "Performance matrix"], ["ubuntu", "Ubuntu and k3s"], ["loss", "Controlled loss"], ["artifacts", "Artifacts"], ["interpret", "Interpretation"]],
    html: `
      <h1>Disposable VM validation</h1>
      <p>The KVM harnesses boot disposable guests for real-kernel systemd, trace-loss, performance, Ubuntu LTS, and single-node k3s checks. Unlike Kind, they do not mount or change host tracefs.</p>

      <h2 id="boundary">Isolation model</h2>
      <div class="box-info"><p>Every test writes into a disposable copy-on-write guest disk. Deliberate overload changes only the guest kernel. A successful run transfers evidence and deletes its overlay; a failed run retains the overlay and line-numbered log.</p></div>
      <p>Installed-kernel tests boot the host's kernel image and matching modules against a disposable ext4 root derived from cached <code>kindest/node:v1.35.0</code>. Release LTS profiles use checksum-verified official Ubuntu minimal cloud images.</p>

      <h2 id="requirements">Host requirements</h2>
      <ul>
        <li>Linux with readable and writable <code>/dev/kvm</code>.</li>
        <li>QEMU, <code>qemu-img</code>, <code>mke2fs</code>, <code>genisoimage</code>, OpenSSH, curl, Docker, and Helm.</li>
        <li>Installed kernel images and matching modules for local-kernel modes.</li>
        <li>At least 4 available CPU cores, 8 GiB memory, and 20 GiB disk.</li>
        <li>Network access for Ubuntu images, packages, and pinned k3s when running the release matrix.</li>
      </ul>
      <pre><code>test -r /dev/kvm
test -w /dev/kvm
qemu-system-x86_64 --version
docker info
helm version</code></pre>

      <h2 id="kernel-matrix">Fast installed-kernel regression</h2>
      <pre class="terminal"><code>tests/vm/local-kernel-matrix.sh</code></pre>
      <p>The matrix boots each supported installed kernel directly. For every kernel it validates clean build, systemd lifecycle, normal real capture with zero reported loss, reload behavior, worker recovery, a controlled overrun, degraded readiness, and graceful instance cleanup. Kernel arguments select individual installed versions when needed.</p>

      <h2 id="performance">Local performance qualification</h2>
      <pre><code># Complete global-text allocation matrix
tests/vm/local-performance.sh

# Additive per-CPU capability probe only
FDR_PERF_MODE=backend tests/vm/local-performance.sh</code></pre>
      <p>The complete matrix compares the pre-optimization baseline with 4, 8, 16, and 64 KiB minimum read allocations across three rotated rounds. It records worker user and system CPU, process I/O, peak memory, output bytes, workload progress, and every integrity counter. Candidates are built in pinned Debian 12 so their glibc is compatible with the guest root.</p>
      <p>Backend mode checks CPU-local text readers and raw <code>splice()</code> extraction without changing production FDR. Its raw bundle is experimental and is not a qualified <code>trace.dat</code>.</p>

      <h2 id="ubuntu">Ubuntu LTS and k3s release matrix</h2>
      <pre><code># Both profiles
tests/vm/matrix.sh

# One profile while developing
tests/vm/matrix.sh jammy
tests/vm/matrix.sh noble</code></pre>
      <table><thead><tr><th>Profile</th><th>Qualification</th></tr></thead><tbody>
        <tr><td>Jammy</td><td>Clean native build, systemd lifecycle, nominal capture, reload, worker recovery, and controlled trace loss.</td></tr>
        <tr><td>Noble</td><td>All host checks plus a single-node k3s deployment using <code>v1.35.5+k3s1</code>, DaemonSet capture, metrics, and cleanup.</td></tr>
      </tbody></table>
      <p>The source transfer excludes host build products and <code>.vm-lab</code>, so every guest performs a clean native build. Any failed command stops the matrix and writes a failed report rather than continuing.</p>

      <h2 id="loss">Controlled-loss scenario</h2>
      <div class="box-stop"><p>The scenario intentionally limits FDR to 1% of one CPU and enables scheduler events with a 64 KiB per-CPU buffer. Run it only inside the disposable guest.</p></div>
      <p>The test must observe a kernel overrun, increment the matching metric, and make readiness false. Nominal integrity is checked before and after reload and worker-recovery boundaries, ensuring that the degraded result belongs to the controlled interval.</p>

      <h2 id="artifacts">Caches and result retention</h2>
      <table><thead><tr><th>Path</th><th>Contents</th></tr></thead><tbody>
        <tr><td><code>.vm-lab/cache</code></td><td>Verified base images and the ephemeral SSH key used by the harness.</td></tr>
        <tr><td><code>.vm-lab/runs/&lt;UTC timestamp&gt;</code></td><td>Environment, configuration, guest logs, metrics, capture facts, validation summary, and failure diagnostics.</td></tr>
        <tr><td>Failed overlay</td><td>Retained copy-on-write guest disk for detailed diagnosis.</td></tr>
      </tbody></table>

      <h2 id="interpret">Interpreting a pass</h2>
      <p>A VM pass proves the named source revision, guest image, kernel, CPU topology, configuration, workload, and harness criteria. It does not prove all hardware, event sets, filesystems, security policies, or production rates. Keep results scoped and preserve the generated manifest with any compatibility claim.</p>
    `,
  },
  {
    slug: "benchmark-catalog",
    title: "Benchmark and evidence catalog",
    description: "Recorded performance decisions, raw-data links, reproduction commands, and strict claim boundaries.",
    toc: [["contract", "Preservation contract"], ["collector-copy", "Collector copy"], ["real-tracefs", "Real tracefs"], ["backend", "Per-CPU backend"], ["loss-sampler", "Loss sampler"], ["topology", "Topology cache"], ["open", "Open work"], ["artifacts", "Raw artifacts"]],
    html: `
      <h1>Benchmark and evidence catalog</h1>
      <p>Every benchmark answers a narrow question. Results are promoted only when their environment and evidence contract match the production behavior being changed. Raw measurements remain linked source artifacts.</p>

      <h2 id="contract">Performance preservation contract</h2>
      <ul>
        <li>Keep every configured event and filter; never sample or silently disable probes.</li>
        <li>Preserve every byte delivered by <code>trace_pipe</code>; do not introduce recorder loss for a CPU target.</li>
        <li>Keep text format, order, permissions, append behavior, rotation, and <code>minfree</code> semantics in compatible mode.</li>
        <li>Keep configuration, signals, endpoints, metrics, readiness, and failure behavior backward compatible.</li>
        <li>Expose kernel loss, storage drops, and write failures as integrity failures.</li>
        <li>Detect optional kernel capabilities and retain a tested fallback.</li>
        <li>Make claims reproducible in a disposable environment.</li>
      </ul>

      <h2 id="collector-copy">Userspace collector-copy microbenchmark</h2>
      <table><thead><tr><th>Property</th><th>Recorded result</th></tr></thead><tbody>
        <tr><td>Environment</td><td>Linux 7.1.8, x86-64, Intel i7-8650U, 64 MiB deterministic regular-file input, five rounds.</td></tr>
        <tr><td>Baseline</td><td>Median 135.9 ms process CPU and 453.4 MiB/s.</td></tr>
        <tr><td>Optimized</td><td>Median 63.5 ms process CPU and 777.3 MiB/s.</td></tr>
        <tr><td>Observed change</td><td>53.3% lower process CPU with exact output and zero dropped bytes.</td></tr>
        <tr><td>Decision</td><td>Keep cached bounded-output size and fewer copy iterations as valid userspace improvements.</td></tr>
        <tr><td>Claim boundary</td><td>The input is a regular file. This is not a real ftrace CPU claim and does not exercise kernel merge or text formatting.</td></tr>
      </tbody></table>
      <pre><code>make benchmark</code></pre>

      <h2 id="real-tracefs">Real-tracefs text collector profile</h2>
      <table><thead><tr><th>Candidate</th><th>Captured</th><th>CPU s/GiB</th><th>Mean bytes/read</th><th>Loss</th></tr></thead><tbody>
        <tr><td>Baseline</td><td>416.25 MiB</td><td>36.557</td><td>1,064.7</td><td>0</td></tr>
        <tr><td>4 KiB</td><td>420.22 MiB</td><td>32.970</td><td>976.6</td><td>0</td></tr>
        <tr><td><strong>8 KiB</strong></td><td><strong>452.08 MiB</strong></td><td><strong>31.123</strong></td><td><strong>1,101.6</strong></td><td><strong>0</strong></td></tr>
        <tr><td>16 KiB</td><td>441.01 MiB</td><td>31.671</td><td>1,100.3</td><td>0</td></tr>
        <tr><td>64 KiB</td><td>467.46 MiB</td><td>30.975</td><td>1,129.7</td><td>0</td></tr>
      </tbody></table>
      <p><strong>Decision:</strong> use an 8 KiB minimum allocation. It reduced normalized collector CPU 14.9% from baseline; 64 KiB improved only another 0.5%, within variation, and required eight times the allocation. The result covers one Linux 7.1.8 scheduler workload and remains below the plan's 25% broad-promotion gate.</p>
      <pre><code>tests/vm/local-performance.sh</code></pre>

      <h2 id="backend">Per-CPU text and raw backend probe</h2>
      <table><thead><tr><th>Mode</th><th>CPU files</th><th>Captured</th><th>Collector CPU</th><th>Loss</th></tr></thead><tbody>
        <tr><td>Per-CPU text</td><td>4</td><td>66,588,697 bytes</td><td>1.65 s</td><td>0</td></tr>
        <tr><td>Per-CPU raw</td><td>4</td><td>24,530,944 bytes</td><td>0.09 s</td><td>0</td></tr>
      </tbody></table>
      <p>Raw pages moved through a kernel pipe with two-stage <code>splice()</code>. The bundle preserved page and event headers, event formats, trace clock, printk formats, command lines, and CPU-local streams.</p>
      <div class="box-warning"><p>The raw bundle is not a standard <code>trace.dat</code>, and separate focused runs make byte and CPU ratios unsuitable as a general percentage claim. Decoder equivalence, endianness, hotplug, correlation, rotation, fallback, and incident workflow remain unproven.</p></div>
      <pre><code>FDR_PERF_MODE=backend tests/vm/local-performance.sh</code></pre>

      <h2 id="loss-sampler">Synthetic 256-CPU loss sampler</h2>
      <table><thead><tr><th>Candidate</th><th>Median CPU for 50 topologies</th><th>Per CPU stats file</th></tr></thead><tbody>
        <tr><td>Formatted stdio baseline</td><td>238.83 ms</td><td>18,659 ns</td></tr>
        <tr><td>Bounded direct-read parser</td><td>160.23 ms</td><td>12,518 ns</td></tr>
      </tbody></table>
      <p>The direct parser reduced median process CPU 32.9% while reading every stats file and preserving exact counters. One complete 256-CPU sample fell from about 4.78 ms to 3.20 ms. Because FDR samples every five seconds, the absolute cost is small.</p>
      <pre><code>make benchmark-loss</code></pre>

      <h2 id="topology">Synthetic topology-cache comparison</h2>
      <p>Across 15 alternating 256-CPU pairs, caching discovered <code>per_cpu/cpuN/stats</code> paths reduced median CPU for 50 topologies from 134.07 ms to 128.33 ms, an additional 4.3%. The cache refreshes when online CPU count changes, a path disappears, or after 12 samples.</p>
      <p>This bounds repeated directory traversal while still reading every loss file. The synthetic result does not model tracefs latency, real hotplug, NUMA, or a high-core kernel.</p>

      <h2 id="open">Open performance phases</h2>
      <ol>
        <li>Complete the real-kernel workload and CPU-count matrix.</li><li>Decouple slow retention work from capture rotation.</li>
        <li>Add bounded-time shared metric batching without stale low-rate metrics.</li><li>Publish self-observation counters only when they drive decisions.</li>
        <li>Produce a standard interoperable raw archive and prove decoder equivalence.</li><li>Prototype additive snapshot-triggered pre-event and post-event capture.</li>
      </ol>

      <h2 id="artifacts">Reports and raw data</h2>
      <table><thead><tr><th>Report</th><th>Raw data</th></tr></thead><tbody>
        <tr><td><a href="https://github.com/AnouarMohamed/Ftrace-Flight-Recorder/blob/main/docs/benchmarks/2026-08-29-text-collector.md">Collector-copy report</a></td><td>Measurements embedded in the report.</td></tr>
        <tr><td><a href="https://github.com/AnouarMohamed/Ftrace-Flight-Recorder/blob/main/docs/benchmarks/2026-08-30-real-tracefs-text.md">Real tracefs report</a></td><td><a href="https://github.com/AnouarMohamed/Ftrace-Flight-Recorder/blob/main/docs/benchmarks/2026-08-30-real-tracefs-text.tsv">TSV</a></td></tr>
        <tr><td><a href="https://github.com/AnouarMohamed/Ftrace-Flight-Recorder/blob/main/docs/benchmarks/2026-08-30-per-cpu-backend.md">Per-CPU backend report</a></td><td><a href="https://github.com/AnouarMohamed/Ftrace-Flight-Recorder/blob/main/docs/benchmarks/2026-08-30-per-cpu-backend.tsv">TSV</a></td></tr>
        <tr><td><a href="https://github.com/AnouarMohamed/Ftrace-Flight-Recorder/blob/main/docs/benchmarks/2026-08-30-loss-sampling.md">Loss-sampling report</a></td><td>Measurements embedded in the report.</td></tr>
        <tr><td><a href="https://github.com/AnouarMohamed/Ftrace-Flight-Recorder/blob/main/docs/benchmarks/2026-08-31-loss-topology-cache.md">Topology-cache report</a></td><td>Measurements embedded in the report.</td></tr>
      </tbody></table>
    `,
  },
  {
    slug: "development",
    title: "Development and contribution guide",
    description: "Source layout, build targets, test layers, contribution workflow, evidence expectations, and review checklist.",
    toc: [["layout", "Source layout"], ["build", "Build targets"], ["tests", "Test layers"], ["workflow", "Contribution workflow"], ["claims", "Evidence for claims"], ["review", "Review checklist"], ["conduct", "Conduct and security"]],
    html: `
      <h1>Development and contribution guide</h1>
      <p>Changes should remain focused, preserve evidence integrity, and carry the validation appropriate to their claim. Begin with the roadmap, open one scoped issue, and keep unrelated refactoring separate.</p>

      <h2 id="layout">Source layout</h2>
      <table><thead><tr><th>Path</th><th>Responsibility</th></tr></thead><tbody>
        <tr><td><code>src/main.c</code></td><td>CLI entry, process startup, and top-level daemon wiring.</td></tr>
        <tr><td><code>src/config.c</code></td><td>Configuration discovery, parsing, validation, and directive representation.</td></tr>
        <tr><td><code>src/trace.c</code></td><td>tracefs instance lifecycle, probes, filters, and loss-stat sampling.</td></tr>
        <tr><td><code>src/harvest.c</code></td><td>Trace-pipe collection, storage protection, output writes, reopen, and rotation.</td></tr>
        <tr><td><code>src/process.c</code></td><td>Worker creation, supervision, and process lifecycle.</td></tr>
        <tr><td><code>src/http.c</code></td><td>Health, readiness, and Prometheus HTTP responses.</td></tr>
        <tr><td><code>src/runtime.c</code></td><td>Shared runtime state, counters, and readiness coordination.</td></tr>
        <tr><td><code>src/util.c</code></td><td>Checked utility operations and logging support.</td></tr>
        <tr><td><code>src/fdr.h</code></td><td>Shared types, constants, and internal interfaces.</td></tr>
        <tr><td><code>tests/</code></td><td>Unit, fake-tracefs runtime, failure fixtures, benchmarks, and disposable VM harnesses.</td></tr>
        <tr><td><code>deploy/</code></td><td>OCI, Kustomize, Helm, Kind, monitoring, and cluster validation assets.</td></tr>
        <tr><td><code>docs/validation</code></td><td>Recorded environments, reports, logs, metrics, and screenshots.</td></tr>
      </tbody></table>

      <h2 id="build">Build and Make targets</h2>
      <table><thead><tr><th>Target</th><th>Purpose</th></tr></thead><tbody>
        <tr><td><code>make</code></td><td>Compile the C11 <code>fdrd</code> binary with GCC or the selected <code>CC</code>.</td></tr>
        <tr><td><code>make check</code></td><td>Build daemon and tests, validate good and bad configurations, then run config, harvest, trace, and runtime suites.</td></tr>
        <tr><td><code>make sanitize</code></td><td>Build daemon and unit paths with Clang AddressSanitizer and UndefinedBehaviorSanitizer, including leak detection.</td></tr>
        <tr><td><code>make benchmark</code></td><td>Run deterministic collector correctness and userspace-copy measurements.</td></tr>
        <tr><td><code>make benchmark-loss</code></td><td>Run the synthetic per-CPU trace-loss sampler benchmark.</td></tr>
        <tr><td><code>make performance-binaries</code></td><td>Build 4, 8, 16, and 64 KiB daemon candidates, scheduler load, and per-CPU capture probe.</td></tr>
        <tr><td><code>make install</code></td><td>Install daemon, man page, service, configuration directory, README, and samples under configurable prefixes.</td></tr>
        <tr><td><code>make uninstall</code></td><td>Remove installed program-owned files, leaving administrator configuration and captures.</td></tr>
        <tr><td><code>make tarball</code></td><td>Create a versioned Git archive compressed with xz under the RPM build tree.</td></tr>
        <tr><td><code>make rpm</code></td><td>Build a binary RPM from the v1.4 specification.</td></tr>
        <tr><td><code>make srpm</code></td><td>Build the corresponding source RPM.</td></tr>
        <tr><td><code>make clean</code></td><td>Remove compiled daemon objects and the project build directory.</td></tr>
      </tbody></table>
      <p>Useful overrides include <code>VERSION</code>, <code>CC</code>, <code>CFLAGS</code>, <code>PREFIX</code>, <code>DESTDIR</code>, <code>UNITDIR</code>, <code>SYSCONFDIR</code>, <code>RPMBUILD_DIR</code>, and <code>TEST_CONFIG</code>.</p>

      <h2 id="tests">Validation layers for a change</h2>
      <table><thead><tr><th>Change type</th><th>Minimum validation</th></tr></thead><tbody>
        <tr><td>Parser or value rule</td><td>Positive and negative unit fixtures plus <code>make check</code>.</td></tr>
        <tr><td>Collector, rotation, or metrics</td><td>Harvest tests, runtime tests, sanitizers, deterministic byte accounting, and failure-path coverage.</td></tr>
        <tr><td>tracefs lifecycle or loss</td><td>Trace unit tests, fake-tracefs runtime, and a disposable real-kernel check.</td></tr>
        <tr><td>Helm or Kustomize</td><td><code>helm lint --strict</code>, rendered manifest review, <code>kubectl kustomize</code>, and the relevant Kind lifecycle.</td></tr>
        <tr><td>Performance claim</td><td>Before-and-after report with environment, revision, raw results, integrity counters, variance, and claim limits.</td></tr>
        <tr><td>Kernel compatibility claim</td><td>Recorded disposable VM run on every named kernel.</td></tr>
        <tr><td>Security boundary</td><td>Threat analysis, negative tests, deployment review, and private reporting when it concerns a vulnerability.</td></tr>
      </tbody></table>

      <h2 id="workflow">Contribution workflow</h2>
      <ol>
        <li>Review the roadmap and open one focused issue.</li>
        <li>Fork the repository and create a topic branch.</li>
        <li>Implement the smallest coherent change with tests.</li>
        <li>Update user, operator, deployment, and security documentation when behavior changes.</li>
        <li>Add user-visible changes under <code>Unreleased</code> in the changelog.</li>
        <li>Run the local validation set.</li>
        <li>Commit clearly. Signed-off commits are appreciated, not required.</li>
        <li>Open a pull request explaining what changed, why it changed, how it was tested, and what remains unproven.</li>
      </ol>
      <pre><code>make check
make sanitize
helm lint --strict deploy/helm/fdr
kubectl kustomize deploy/kubernetes</code></pre>

      <h2 id="claims">Evidence requirements</h2>
      <p>Real-kernel and Kubernetes claims must name environment, source revision, configuration, workload, pass criteria, metrics, and known limits. Deliberate overload belongs only in disposable VMs. A fast microbenchmark cannot be promoted into a production claim unless it exercises the production path.</p>

      <h2 id="review">Pull-request review checklist</h2>
      <ul>
        <li>No configured event or delivered byte is silently removed.</li><li>Failures remain visible in readiness, metrics, and logs.</li>
        <li>Configuration remains transactional at the documented boundary.</li><li>Paths, symlinks, file types, integer ranges, and partial I/O are handled.</li>
        <li>Signals and shutdown preserve process-tree and instance ownership.</li><li>New metrics answer a concrete operational question.</li>
        <li>Documentation states what validation proves and what it does not.</li><li>Deployment defaults do not claim unmeasured safety.</li>
      </ul>

      <h2 id="conduct">Conduct and security reports</h2>
      <p>Be respectful and constructive, using the Contributor Covenant as the behavioral reference. Do not report a suspected vulnerability publicly. Use the repository's private GitHub security-advisory workflow or contact maintainers directly.</p>
    `,
  },
  {
    slug: "packaging",
    title: "Packaging and distribution",
    description: "Install layout, build variables, RPM workflow, container image, release artifacts, and deployment verification.",
    toc: [["install-tree", "Install tree"], ["staged", "Staged install"], ["rpm", "RPM"], ["container", "Container image"], ["deploy-assets", "Deployment assets"], ["release", "Release checklist"], ["uninstall", "Uninstall semantics"]],
    html: `
      <h1>Packaging and distribution</h1>
      <h2 id="install-tree">Installed files</h2>
      <table><thead><tr><th>Default path</th><th>Mode or ownership</th><th>Purpose</th></tr></thead><tbody>
        <tr><td><code>/usr/sbin/fdrd</code></td><td>0755</td><td>Daemon executable.</td></tr>
        <tr><td><code>/usr/share/man/man8/fdrd.8</code></td><td>0644</td><td>System-administration manual.</td></tr>
        <tr><td><code>/usr/lib/systemd/system/fdr.service</code></td><td>0644</td><td>Foreground, loopback HTTP, process-group signals, and restart-on-failure service.</td></tr>
        <tr><td><code>/etc/fdr.d</code></td><td>Administrator controlled</td><td>Configuration directory, created but never overwritten.</td></tr>
        <tr><td><code>/usr/share/fdr/README</code></td><td>0644</td><td>Installed overview.</td></tr>
        <tr><td><code>/usr/share/fdr/samples/nfs.conf</code></td><td>0644</td><td>Example module-dependent NFS tracepoint set.</td></tr>
        <tr><td><code>/usr/share/fdr/samples/nfs.logrotate</code></td><td>0644</td><td>Example external retention policy.</td></tr>
      </tbody></table>

      <h2 id="staged">Staged and custom-prefix installation</h2>
      <pre><code># Normal installation
sudo make install

# Package staging root
make install DESTDIR=/tmp/fdr-package-root

# Alternate prefix and service location
make install PREFIX=/opt/fdr UNITDIR=/etc/systemd/system</code></pre>
      <p>The Makefile exposes <code>SBINDIR</code>, <code>DATADIR</code>, <code>MANDIR8</code>, <code>UNITDIR</code>, <code>SYSCONFDIR</code>, and <code>INSTALL</code> for packagers. Build-time version is compiled through <code>FDR_VERSION</code>.</p>

      <h2 id="rpm">RPM and source RPM</h2>
      <pre><code>make rpm VERSION=1.4.0
make srpm VERSION=1.4.0</code></pre>
      <p>The source archive is produced from Git HEAD with prefix <code>fdr-&lt;version&gt;/</code> and stored under the RPM build tree. The v1.4 spec runs the project build and <code>make check</code>, installs through the configurable Makefile paths, registers the systemd unit, and packages documentation and the UPL-1.0 license.</p>
      <table><thead><tr><th>RPM dependency</th><th>Reason</th></tr></thead><tbody>
        <tr><td>GCC and Make</td><td>Build requirements.</td></tr><tr><td>systemd RPM macros</td><td>Unit lifecycle integration.</td></tr>
        <tr><td><code>kmod</code></td><td>Supports reviewed <code>modprobe</code> directives.</td></tr><tr><td><code>logrotate</code></td><td>Supports configured external rotation policies.</td></tr>
      </tbody></table>

      <h2 id="container">OCI image</h2>
      <p>The multi-stage image builds and tests FDR on a digest-pinned Alpine 3.24 base. The runtime installs curl, kmod, and logrotate; creates configuration, state, and capture directories; exposes port 9119; and uses SIGTERM for shutdown.</p>
      <pre><code>docker build -f deploy/kubernetes/Dockerfile -t fdr:v1.4.0 .
docker run --rm fdr:v1.4.0 -V</code></pre>
      <p>The entrypoint is <code>/usr/sbin/fdrd</code>. Default arguments keep it in the foreground, bind pod HTTP, and use <code>/sys/kernel/tracing</code>. A container healthcheck calls loopback <code>/healthz</code> every 30 seconds after a 10-second start period.</p>
      <div class="box-warning"><p>The image alone is not a working or isolated tracing environment. Runtime deployment still requires privileged host tracefs access, configuration, capture storage, and a reviewed security boundary.</p></div>

      <h2 id="deploy-assets">Deployment artifact validation</h2>
      <pre><code>helm lint --strict deploy/helm/fdr
helm template fdr deploy/helm/fdr --namespace fdr-system
kubectl kustomize deploy/kubernetes
docker build -f deploy/kubernetes/Dockerfile .</code></pre>
      <p>Review rendered images, namespace, selectors, tolerations, privilege, mounts, HTTP, configuration checksum, resources, and monitoring CRDs. Test optional combinations, especially HTTP disabled, modules enabled, monitoring enabled, and NetworkPolicy enabled.</p>

      <h2 id="release">Release checklist</h2>
      <ol>
        <li>Set and verify the semantic version across build, chart, image, specs, and documentation.</li>
        <li>Run unit, runtime, sanitizer, Helm, Kustomize, container, and packaging checks.</li>
        <li>Complete the required disposable real-kernel matrix and preserve reports.</li>
        <li>Verify configuration migration and rollback with the previous immutable release.</li>
        <li>Build source, binary, RPM, container, chart, and checksum artifacts from the release revision.</li>
        <li>Record the image digest and artifact checksums.</li>
        <li>Update changelog links, validation status, compatibility statement, and known limitations.</li>
        <li>Install from released artifacts on a clean representative environment, capture one real event, and uninstall cleanly.</li>
      </ol>

      <h2 id="uninstall">Uninstall and retained state</h2>
      <p><code>make uninstall</code> removes the binary, manual, unit, and shared data. It does not delete <code>/etc/fdr.d</code> or capture files. Helm uninstall waits on ordinary Kubernetes termination and leaves the configured host log directory. Retained evidence and administrator policy are never removed implicitly.</p>
    `,
  },
  {
    slug: "roadmap",
    title: "Project roadmap",
    description: "Ordered product direction, completed hardening, open performance work, incident-triggered capture, and interoperability.",
    toc: [["direction", "Product direction"], ["status", "Current status"], ["m1", "Kubernetes hardening"], ["m2", "Real-kernel validation"], ["m3", "Performance"], ["m4", "Triggered capture"], ["m5", "Interoperability"], ["deferred", "Explicit deferrals"]],
    html: `
      <h1>Project roadmap</h1>
      <p>The roadmap is intentionally ordered: prove and harden the existing recorder before adding a control plane, broader interface, or second implementation language.</p>

      <h2 id="direction">Product direction</h2>
      <ol>
        <li>Never destabilize the observed node.</li><li>Make data loss and degraded operation visible.</li>
        <li>Preserve useful evidence before and after an incident.</li><li>Remain straightforward to deploy and remove.</li>
        <li>Produce captures that established tracing tools can inspect.</li>
      </ol>
      <p>The C daemon remains the kernel-facing data plane. Go is appropriate only for a future fleet control plane that needs reconciliation or remote orchestration. Rust would be a deliberate daemon replacement, not a casual mixed-language addition.</p>

      <h2 id="status">Milestone status</h2>
      <table><thead><tr><th>Order</th><th>Milestone</th><th>Status</th><th>Outcome</th></tr></thead><tbody>
        <tr><td>1</td><td>Kubernetes hardening</td><td><span class="status-word">Complete</span></td><td>Version-pinned, intentionally scheduled, preflighted, observable deployment defaults.</td></tr>
        <tr><td>2</td><td>Real-kernel validation</td><td><span class="status-word">Baseline met</span></td><td>Kind, installed-kernel KVM, Ubuntu LTS, controlled loss, and Noble k3s evidence.</td></tr>
        <tr><td>3</td><td>Performance characterization</td><td><span class="status-word">In progress</span></td><td>Compatible text improvements measured; broader workload and high-core qualification open.</td></tr>
        <tr><td>4</td><td>Incident-triggered capture</td><td><span class="status-word">Planned</span></td><td>Bounded pre-trigger and post-trigger sealed evidence bundles.</td></tr>
        <tr><td>5</td><td>Interoperability and demonstration</td><td><span class="status-word">Planned</span></td><td>Captures opened in established tools through a reproducible incident demo.</td></tr>
      </tbody></table>

      <h2 id="m1">Milestone 1: Kubernetes hardening</h2>
      <ul>
        <li>Pin base Helm and Kustomize images to v1.4.0.</li><li>Select Linux nodes and require explicit tolerations.</li>
        <li>Remove the unproven CPU limit.</li><li>Add tracefs type, directory, and write-access preflight.</li>
        <li>Make module-tree exposure opt-in.</li><li>Add optional PodMonitor, alerts, dashboard, and ingress policy.</li>
        <li>Document privileged access as a node-compromise boundary.</li><li>Validate the lifecycle in the Kind lab.</li>
      </ul>

      <h2 id="m2">Milestone 2: real-kernel validation</h2>
      <p>The recorded release baseline covers Fedora kernels 7.0.12 and 7.1.8, Ubuntu Jammy and Noble, controlled loss, systemd lifecycle, and Noble single-node k3s. It closes the current release matrix while leaving multi-node, security-policy, and broad performance claims open.</p>
      <p>Ordinary pull requests keep deterministic fake-tracefs checks. Privileged tests belong on isolated or disposable infrastructure, run nightly or as a release gate when they cannot safely execute for every change.</p>

      <h2 id="m3">Milestone 3: performance and event-loss characterization</h2>
      <p>The goal is a reliability envelope, not one impressive number. Remaining work includes scheduler, fork/exec, block I/O, rotation, low-space, high-volume, throttling, 2/8/32/high-core CPU topologies, workload impact, and real storage. Results must record events, bytes, kernel loss, drops, CPU, memory, kernel buffer allocation, I/O, rotation duration, and time to degraded readiness.</p>
      <div class="box-info"><p>Text mode remains the compatible default. The 8 KiB read decision and topology caching are implemented; rotation decoupling, broad qualification, standard raw archives, and snapshot mode remain open.</p></div>

      <h2 id="m4">Milestone 4: incident-triggered capture</h2>
      <pre><code>ARMED → TRIGGERED → CAPTURING_POST_WINDOW → SEALED → ARMED</code></pre>
      <p>The planned mode retains a bounded rolling window, seals configurable pre-trigger and post-trigger evidence, and produces a transactional self-describing bundle containing trace data, UTC times, trigger source, node identity, kernel and CPU facts, effective configuration, integrity counters, FDR and format versions, and checksums.</p>
      <p>Design must define simultaneous triggers, low space during the post window, sealed-capture retention, restart and reload behavior, and visible representation of partial or lossy data. SIGUSR1 remains reserved for file reopen.</p>

      <h2 id="m5">Milestone 5: interoperability and demonstration</h2>
      <p>Before choosing a format, compare ftrace text, <code>trace-cmd</code>/<code>trace.dat</code>, and a Perfetto-compatible path. The selected format must preserve required metadata and open with pinned established tooling. A reproducible scheduler-latency or I/O-stall demonstration should deploy, disturb, trigger, download, open, and explain real evidence.</p>

      <h2 id="deferred">Explicitly deferred</h2>
      <ul>
        <li>A Kubernetes operator or broad product UI before recorder reliability milestones are complete.</li>
        <li>Automatic event sampling, probe disabling, or silent buffer reduction.</li>
        <li>Default CPU quotas, idle scheduling, or compression in the capture hot path.</li>
        <li>A mandatory private binary format.</li>
        <li><code>io_uring</code> or complex multi-threaded merging before simpler measured changes.</li>
        <li>Performance defaults inferred from a single workstation or storage device.</li>
      </ul>
    `,
  },
  {
    slug: "walkthroughs",
    title: "Practical walkthroughs",
    description: "Copyable host, Helm, Kustomize, Kind, VM, and incident-evidence procedures with expected results.",
    toc: [["host", "Linux host"], ["kustomize", "Kustomize"], ["helm", "Helm"], ["kind", "Kind lab"], ["vm", "VM validation"], ["evidence", "Evidence collection"]],
    html: `
      <h1>Practical walkthroughs</h1>
      <p>Each procedure is designed to be copied from the repository root. Read its safety note first, run one block at a time, and compare the recorded result before continuing.</p>

      <h2 id="host">First verified Linux host capture</h2>
      <pre><code>findmnt -T /sys/kernel/tracing
make check
make
sudo make install
sudo install -d -m 0700 /var/log/fdr
sudo install -m 0644 deploy/kubernetes/fdr.conf /etc/fdr.d/node.conf
sudo fdrd -n -c /etc/fdr.d
sudo systemctl enable --now fdr
for i in 1 2 3 4 5; do sh -c :; done
sudo grep -m 1 sched_switch /var/log/fdr/node.log
curl --fail http://127.0.0.1:9119/healthz
curl --fail http://127.0.0.1:9119/readyz
curl --silent http://127.0.0.1:9119/metrics | grep '^fdr_'</code></pre>
      <span class="expected-label">Expected result</span>
      <pre class="terminal"><code>... sched_switch: ...
ok
ready
fdr_ready 1
fdr_instances 1
fdr_workers_alive 1</code></pre>
      <p>All loss, write-error, rotation-failure, probe-failure, and dropped-byte counters should remain zero for this first nominal check.</p>

      <h2 id="kustomize">Kustomize deployment</h2>
      <div class="box-warning"><p>The DaemonSet is privileged and mounts host tracefs. Review the rendered image, configuration, node selection, host paths, and security context before applying.</p></div>
      <pre><code>kubectl kustomize deploy/kubernetes &gt; /tmp/fdr-rendered.yaml
kubectl apply -k deploy/kubernetes
kubectl -n fdr-system rollout status daemonset/fdr
kubectl -n fdr-system get pods -o wide
kubectl -n fdr-system logs -l app=fdr -c tracefs-preflight
kubectl -n fdr-system logs -l app=fdr -c fdrd --tail=50</code></pre>
      <span class="expected-label">Expected result</span>
      <pre class="terminal"><code>daemon set \"fdr\" successfully rolled out
NAME        READY   STATUS    NODE
fdr-...     1/1     Running   ...
... HTTP listener active on 0.0.0.0:9119</code></pre>
      <p>The preflight container may have no output on success. Confirm the pod is on an intended Linux node and the image is the reviewed version.</p>

      <h2 id="helm">Helm with observability</h2>
      <pre><code>helm lint --strict deploy/helm/fdr
helm template fdr deploy/helm/fdr \
  --namespace fdr-system \
  --set monitoring.podMonitor.enabled=true \
  --set monitoring.prometheusRule.enabled=true \
  --set monitoring.grafanaDashboard.enabled=true \
  &gt; /tmp/fdr-helm-rendered.yaml

helm upgrade --install fdr deploy/helm/fdr \
  --namespace fdr-system \
  --create-namespace \
  --set monitoring.podMonitor.enabled=true \
  --set monitoring.prometheusRule.enabled=true \
  --set monitoring.grafanaDashboard.enabled=true

kubectl -n fdr-system rollout status daemonset/fdr
kubectl -n fdr-system get podmonitor,prometheusrule,configmap</code></pre>
      <span class="expected-label">Expected result</span>
      <pre class="terminal"><code>1 chart(s) linted, 0 chart(s) failed
Release \"fdr\" has been upgraded. Happy Helming!
daemon set \"fdr\" successfully rolled out</code></pre>
      <div class="box-info"><p>PodMonitor and PrometheusRule require Prometheus Operator CRDs. Dashboard discovery requires a Grafana sidecar configured for the selected labels and namespace.</p></div>

      <h2 id="kind">Complete Kind observability lab</h2>
      <div class="box-stop"><p>Kind shares the host kernel and receives writable host tracefs. Run this only on an approved Linux workstation or, preferably, inside a disposable VM.</p></div>
      <pre><code>findmnt -T /sys/kernel/tracing
docker info
kind version
helm version
export FDR_LAB_ACKNOWLEDGE_HOST_KERNEL=yes
deploy/kind/lab.sh run</code></pre>
      <span class="expected-label">Expected result</span>
      <pre class="terminal"><code>FULL LAB PASS: lifecycle completed and evidence retained at
.build/fdr-lab-artifacts/runs/&lt;UTC timestamp&gt;</code></pre>
      <p>A successful run proves real capture, metrics discovery, Grafana provisioning, checksum rollout, degraded readiness, worker recovery, bounded rotation, evidence retention, and owned-instance cleanup for the recorded host kernel.</p>

      <h2 id="vm">Disposable VM release validation</h2>
      <pre><code>test -r /dev/kvm
test -w /dev/kvm

# Installed host-kernel regression
tests/vm/local-kernel-matrix.sh

# Ubuntu Jammy, Noble, and Noble k3s
tests/vm/matrix.sh</code></pre>
      <span class="expected-label">Expected result</span>
      <pre class="terminal"><code>PASS: normal capture completed with zero reported loss
PASS: controlled overload produced trace overrun and unready state
PASS: evidence transferred to .vm-lab/runs/&lt;UTC timestamp&gt;</code></pre>
      <p>Exact progress messages are recorded in the generated report. A failed run stops immediately and retains its overlay and line-numbered log.</p>

      <h2 id="evidence">Incident evidence collection</h2>
      <div class="box-stop"><p>Collect before reload or restart. The commands below preserve current process-lifetime metrics, capture generations, configuration, and service history.</p></div>
      <pre><code>install -d -m 0700 ./fdr-evidence
date --utc --iso-8601=seconds &gt; ./fdr-evidence/collected-at.txt
uname -a &gt; ./fdr-evidence/uname.txt
cat /proc/sys/kernel/random/boot_id &gt; ./fdr-evidence/boot-id.txt
fdrd -V &gt; ./fdr-evidence/fdr-version.txt
curl --silent http://127.0.0.1:9119/metrics \
  &gt; ./fdr-evidence/fdr-metrics.txt
curl --silent http://127.0.0.1:9119/healthz \
  &gt; ./fdr-evidence/healthz.txt
curl --silent http://127.0.0.1:9119/readyz \
  &gt; ./fdr-evidence/readyz.txt
sudo cp -a /etc/fdr.d ./fdr-evidence/fdr-config
sudo cp -a /var/log/fdr ./fdr-evidence/fdr-captures
journalctl -u fdr --since '2 hours ago' --no-pager \
  &gt; ./fdr-evidence/fdr-journal.txt
find ./fdr-evidence -type f ! -name SHA256SUMS -print0 | sort -z | xargs -0 sha256sum \
  &gt; ./fdr-evidence/SHA256SUMS</code></pre>
      <span class="expected-label">Expected result</span>
      <pre class="terminal"><code>fdr-evidence/
├── SHA256SUMS
├── boot-id.txt
├── collected-at.txt
├── fdr-captures/
├── fdr-config/
├── fdr-journal.txt
├── fdr-metrics.txt
├── fdr-version.txt
├── healthz.txt
├── readyz.txt
└── uname.txt</code></pre>
      <p>Protect the directory as sensitive incident evidence. Do not publish raw captures or credentials in a public issue.</p>
    `,
  },
];
