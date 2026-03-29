/**
 * 项目管理工具
 * 保存、加载、删除项目
 */

import { EditorState } from './editorState';

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  updatedAt: number;
  state: EditorState;
}

const STORAGE_KEY = 'guitarlens_projects';

/**
 * 获取所有项目
 */
export function getAllProjects(): Project[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load projects:', error);
    return [];
  }
}

/**
 * 获取单个项目
 */
export function getProject(id: string): Project | null {
  const projects = getAllProjects();
  return projects.find((p) => p.id === id) || null;
}

/**
 * 保存项目
 */
export function saveProject(name: string, description: string, state: EditorState): Project {
  const projects = getAllProjects();
  const now = Date.now();

  // 检查是否已存在同名项目
  const existingProject = projects.find((p) => p.name === name);

  if (existingProject) {
    // 更新现有项目
    existingProject.description = description;
    existingProject.updatedAt = now;
    existingProject.state = state;
  } else {
    // 创建新项目
    const newProject: Project = {
      id: `project-${now}`,
      name,
      description,
      createdAt: now,
      updatedAt: now,
      state,
    };
    projects.push(newProject);
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return existingProject || projects[projects.length - 1];
  } catch (error) {
    console.error('Failed to save project:', error);
    throw error;
  }
}

/**
 * 删除项目
 */
export function deleteProject(id: string): boolean {
  try {
    const projects = getAllProjects();
    const filtered = projects.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Failed to delete project:', error);
    return false;
  }
}

/**
 * 导出项目为 JSON
 */
export function exportProjectAsJSON(project: Project): Blob {
  const json = JSON.stringify(project, null, 2);
  return new Blob([json], { type: 'application/json' });
}

/**
 * 导入项目从 JSON
 */
export function importProjectFromJSON(json: string): Project | null {
  try {
    const project = JSON.parse(json) as Project;
    // 验证项目结构
    if (!project.name || !project.state) {
      throw new Error('Invalid project structure');
    }
    // 生成新 ID
    project.id = `project-${Date.now()}`;
    project.createdAt = Date.now();
    project.updatedAt = Date.now();
    return project;
  } catch (error) {
    console.error('Failed to import project:', error);
    return null;
  }
}

/**
 * 获取项目统计信息
 */
export function getProjectStats(project: Project): {
  noteCount: number;
  chordCount: number;
  duration: number;
} {
  const { state } = project;
  const notes = state.notes || [];
  const chords = state.chords || [];
  const duration = notes.length > 0 ? Math.max(...notes.map((n) => n.endTime)) : 0;

  return {
    noteCount: notes.length,
    chordCount: chords.length,
    duration,
  };
}

/**
 * 搜索项目
 */
export function searchProjects(query: string): Project[] {
  const projects = getAllProjects();
  const lowerQuery = query.toLowerCase();

  return projects.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery)
  );
}

export default {
  getAllProjects,
  getProject,
  saveProject,
  deleteProject,
  exportProjectAsJSON,
  importProjectFromJSON,
  getProjectStats,
  searchProjects,
};
