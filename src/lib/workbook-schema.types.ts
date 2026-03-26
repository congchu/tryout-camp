export interface SchemaField {
  id: string;
  type: "text" | "textarea" | "number" | "single-choice" | "multi-choice";
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

export interface SchemaSection {
  id: string;
  after: string; // e.g. "## Step 1"
  fields: SchemaField[];
}

export interface ChecklistItem {
  id: string;
  label: string;
}

export interface WorkbookSchema {
  version: number;
  sections: SchemaSection[];
  checklist?: ChecklistItem[];
}
