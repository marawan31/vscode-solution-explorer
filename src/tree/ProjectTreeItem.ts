import { TreeItem, TreeItemCollapsibleState } from "./TreeItem";
import { ContextValues } from "./ContextValues";
import { ProjectInSolution } from "../model/Solutions";
import { Project } from "../model/Projects";
import { ProjectReferencesTreeItem } from "./ProjectReferencesTreeItem";
import * as TreeItemFactory from "./TreeItemFactory";

export class ProjectTreeItem extends TreeItem {
    private children: TreeItem[] = null;

    constructor(private readonly project: Project, private readonly projectInSolution: ProjectInSolution, parent: TreeItem) {
        super(projectInSolution.ProjectName, TreeItemCollapsibleState.Collapsed, ContextValues.Project, parent, projectInSolution.FullPath);
    }

    public getChildren(): Thenable<TreeItem[]> {
        if (this.children) {
            return Promise.resolve(this.children);
        }

        return this.createChildren();
    }

    public refresh(): void {
        this.children = null;
    }
    
    public createFile(name: string): Promise<string> {
        return this.project.createFile('', name);
    }

    public createFolder(name: string): Promise<void> {
        return this.project.createFolder(name);
    }

    private async createChildren(): Promise<TreeItem[]> {
        this.children = [];

        if (this.project.HasReferences) {
            this.children.push(new ProjectReferencesTreeItem(this.project, this));
        }

        let items = await TreeItemFactory.CreateItemsFromProject(this, this.project);
        items.forEach(item => this.children.push(item));
        
        return this.children;
    }
}