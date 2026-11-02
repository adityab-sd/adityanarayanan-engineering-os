const nodes = ["Sports data providers", "Event adapter", "Azure Event Hub", "Azure Functions", "Redis and SignalR", "Web clients and Radio Mode"];

export function ArchitectureFlow() {
  return <div className="systems-flow" aria-label="SportScore event architecture">{nodes.map((node, index) => <div className="flow-node" key={node}><span>0{index + 1}</span><strong>{node}</strong>{index < nodes.length - 1 && <i aria-hidden="true" />}</div>)}</div>;
}
