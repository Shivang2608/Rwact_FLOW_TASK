// src/App.js
import React, { useCallback, useState } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
} from "reactflow";
import "reactflow/dist/style.css";

import "./App.css";

let id = 0;
const getId = () => `node_${id++}`;

const App = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      const position = reactFlowInstance.project({
        x: event.clientX - 250,
        y: event.clientY - 50,
      });

      const newNode = {
        id: getId(),
        type: "default",
        position,
        data: {
          label: (
            <div onContextMenu={(e) => handleRightClick(e)}>
              {type === "blockA" ? "Block A" : "Block B"}
            </div>
          ),
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleRightClick = (event) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY });
  };

  const closeContextMenu = () => setContextMenu(null);

  return (
    <div className="app" onClick={closeContextMenu}>
      <ReactFlowProvider>
        <div className="sidebar">
          <div
            className="dndnode block-a"
            onDragStart={(e) => onDragStart(e, "blockA")}
            draggable
          >
            Block A
          </div>
          <div
            className="dndnode block-b"
            onDragStart={(e) => onDragStart(e, "blockB")}
            draggable
          >
            Block B
          </div>
        </div>

        <div className="flow-wrapper">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>

        {contextMenu && (
          <div
            className="context-menu"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            Hello World
          </div>
        )}
      </ReactFlowProvider>
    </div>
  );
};

export default App;
