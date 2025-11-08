import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  statusBarItem.text = '$(sync~spin) Neon Agent Monitor: Ready';
  statusBarItem.show();

  // Watch for agent.md changes
  const agentWatcher = vscode.workspace.createFileSystemWatcher('**/agent*.md');
  const updateStatus = async () => {
    const files = await vscode.workspace.findFiles('**/agent*.md');
    if (files.length === 0) {
      statusBarItem.text = '$(sync~spin) Neon Agent Monitor: No agent.md';
      return;
    }
    const fileUri = files[0];
    const content = (await vscode.workspace.fs.readFile(fileUri)).toString();
    const match = content.match(/Progress:\s*(\d+)%/);
    const progress = match ? parseInt(match[1], 10) : 0;
    statusBarItem.text = `$(sync~spin) Agent: ${progress}% ${'█'.repeat(progress/10)}${'░'.repeat(10-progress/10)}`;
  };
  agentWatcher.onDidChange(updateStatus);
  agentWatcher.onDidCreate(updateStatus);
  agentWatcher.onDidDelete(updateStatus);
  updateStatus();

  context.subscriptions.push(statusBarItem, agentWatcher);
}

export function deactivate() {}
