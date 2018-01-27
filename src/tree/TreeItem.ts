import * as vscode from "vscode";
import * as TreeItemIconProvider from "./TreeItemIconProvider";
import { TreeItemContext } from "./TreeItemContext";
import { SolutionFile } from "../model/Solutions";
import { Project } from "../model/Projects";

export { TreeItemCollapsibleState, Command } from "vscode";

export abstract class TreeItem extends vscode.TreeItem {
	protected children: TreeItem[] = null;

	constructor(
		protected context: TreeItemContext,
		public label: string,
        public collapsibleState: vscode.TreeItemCollapsibleState,
		public contextValue: string,
		public path?: string,
		public command?: vscode.Command
	) {
		super(label, collapsibleState);
		this.iconPath = TreeItemIconProvider.findIconPath(label, path, contextValue);
	}

	public get parent(): TreeItem {
		return this.context.parent;
	}

	public get solution(): SolutionFile {
		return this.context.solution;
	}

	public get project(): Project {
		return this.context.project;
	}

	public async getChildren(): Promise<TreeItem[]> {
        if (!this.children) {
			let childContext = this.context.copy(null, this);
			this.children = await this.createChildren(childContext);
        }
		
		return this.children;
    }

	public refresh(): void {
		if (this.children) this.children.forEach(c => c.dispose());
        this.children = null;
		this.context.provider.refresh(this);
	}

	public dispose(): void {
		if (this.children) this.children.forEach(c => c.dispose());
        this.children = null;
	}

	protected createChildren(childContext: TreeItemContext): Promise<TreeItem[]> {
		return Promise.resolve([]);
	}

	protected addContextValueSuffix(): void {
		this.contextValue += this.project && this.project.type ? '-' + this.project.type : '';
	}
}
