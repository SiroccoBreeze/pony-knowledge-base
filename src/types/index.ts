import { OutputData } from '@editorjs/editorjs';

// 文章类型
export interface Article {
  id: string;
  title: string;
  content: OutputData | string;
  author: string;
  tags: string[];
  createTime: string;
  updateTime: string;
  views: number;
}

// 技术问题类型
export interface TechnicalIssue {
  id: string;
  title: string;
  description: string;
  solution: string;
  tags: string[];
  createTime: string;
  status: 'open' | 'resolved' | 'in-progress';
  priority: 'low' | 'medium' | 'high';
}

// 文档类型
export interface Document {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: 'pdf' | 'word' | 'excel' | 'ppt';
  size: number;
  uploadTime: string;
  category: string;
}

// 事件类型
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'milestone' | 'release' | 'meeting' | 'other';
  importance: 'normal' | 'important' | 'critical';
} 