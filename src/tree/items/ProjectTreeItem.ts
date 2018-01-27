import { TreeItem, TreeItemCollapsibleState } from "../";
import { TreeItemContext } from "../TreeItemContext";
import { ContextValues } from "../ContextValues";
import { ProjectInSolution } from "../../model/Solutions";
import { Project } from "../../model/Projects";
import { ProjectReferencesTreeItem } from "./ProjectReferencesTreeItem";
import * as TreeItemFactory from "../TreeItemFactory";
import * as path from 'path';
import { resolve } from "url";

export class ProjectTreeItem extends TreeItem {
    constructor(context: TreeItemContext, protected readonly projectInSolution: ProjectInSolution) {
        super(context, projectInSolution.projectName, TreeItemCollapsibleState.Collapsed, ContextValues.Project, projectInSolution.fullPath);
        this.addContextValueSuffix();
    }

    protected async createChildren(childContext: TreeItemContext): Promise<TreeItem[]> {  
        let result: TreeItem[] = [];
        if (this.project.hasReferences) {
            let references = await this.createReferenceItems(childContext);
            references.forEach(i => result.push(i));
        }

        let items = await TreeItemFactory.CreateItemsFromProject(childContext, this.project);
        items.forEach(item => result.push(item));
        
        return result;
    }

    protected createReferenceItems(childContext: TreeItemContext): Promise<TreeItem[]> {
        return Promise.resolve([ new ProjectReferencesTreeItem(childContext) ]);
    }
}