// src/repositories/interface/node-scope.repository.interface.ts

export interface INodeScopeRepository {
  getAccessibleNodeIds(nodeId: string): Promise<string[]>;
}
