import { Article, TechnicalIssue, Document, Event } from '../types';

export const mockArticles: Article[] = [
  {
    id: '1',
    title: 'React 18 新特性详解',
    content: '# React 18 新特性\n\nReact 18 带来了许多激动人心的新特性...',
    author: '张三',
    tags: ['React', 'Frontend', 'JavaScript'],
    createTime: '2024-03-15T08:00:00Z',
    updateTime: '2024-03-15T08:00:00Z',
    views: 1234,
  },
  // ... 更多文章
];

export const mockIssues: TechnicalIssue[] = [
  {
    id: '1',
    title: 'Next.js 项目构建失败',
    description: '在使用 Next.js 13 进行构建时遇到内存溢出问题...',
    solution: '通过增加 Node.js 内存限制解决此问题：\n1. 设置 NODE_OPTIONS=--max-old-space-size=4096\n2. 优化构建配置\n3. 减少不必要的依赖',
    tags: ['Next.js', 'Build', 'Performance'],
    createTime: '2024-03-14T10:30:00Z',
    status: 'resolved',
    priority: 'high',
  },
  {
    id: '2',
    title: 'React Context 性能优化',
    description: '使用 Context 导致不相关组件重新渲染',
    solution: '1. 使用 useMemo 优化 Context value\n2. 拆分 Context\n3. 使用 React.memo 包装消费组件',
    tags: ['React', 'Performance', 'Context'],
    createTime: '2024-03-13T08:20:00Z',
    status: 'resolved',
    priority: 'medium',
  },
  {
    id: '3',
    title: 'TypeScript 类型报错',
    description: '泛型组件类型推导失败',
    solution: '使用 extends 约束泛型参数，确保类型安全',
    tags: ['TypeScript', 'Generic'],
    createTime: '2024-03-12T15:45:00Z',
    status: 'in-progress',
    priority: 'low',
  }
];

export const mockDocuments: Document[] = [
  {
    id: '1',
    title: '系统架构设计文档',
    description: '详细的系统架构设计说明文档，包含系统整体架构、模块划分、数据流转等内容',
    fileUrl: '/docs/architecture.pdf',
    fileType: 'pdf',
    size: 2048576, // 2MB
    uploadTime: '2024-03-13T14:20:00Z',
    category: '架构设计',
  },
  {
    id: '2',
    title: '项目开发规范',
    description: '前端开发规范，包含代码风格、命名规范、最佳实践等',
    fileUrl: '/docs/frontend-spec.pdf',
    fileType: 'pdf',
    size: 1048576, // 1MB
    uploadTime: '2024-03-12T09:15:00Z',
    category: '开发规范',
  },
  {
    id: '3',
    title: '接口文档',
    description: 'RESTful API 接口文档，包含所有接口的详细说明',
    fileUrl: '/docs/api-doc.word',
    fileType: 'word',
    size: 3145728, // 3MB
    uploadTime: '2024-03-11T16:40:00Z',
    category: '接口文档',
  },
  {
    id: '4',
    title: '数据库设计',
    description: '数据库表结构设计文档',
    fileUrl: '/docs/database.excel',
    fileType: 'excel',
    size: 512000, // 500KB
    uploadTime: '2024-03-10T11:30:00Z',
    category: '数据库',
  },
  {
    id: '5',
    title: '产品需求说明',
    description: '产品功能需求和非功能需求说明文档',
    fileUrl: '/docs/requirements.ppt',
    fileType: 'ppt',
    size: 4194304, // 4MB
    uploadTime: '2024-03-09T15:20:00Z',
    category: '产品文档',
  }
];

export const mockEvents: Event[] = [
  {
    id: '1',
    title: '系统 2.0 版本发布',
    description: '包含重大功能更新和性能优化：\n- 新增文档管理系统\n- 优化搜索功能\n- 提升整体性能',
    date: '2024-03-20T00:00:00Z',
    type: 'release',
    importance: 'critical',
  },
  {
    id: '2',
    title: '完成数据库迁移',
    description: '成功将数据库从 MySQL 迁移到 PostgreSQL，提升了数据处理能力',
    date: '2024-03-15T00:00:00Z',
    type: 'milestone',
    importance: 'important',
  },
  {
    id: '3',
    title: '项目进度评审会议',
    description: '讨论第二季度项目进度和技术方案调整',
    date: '2024-03-10T14:30:00Z',
    type: 'meeting',
    importance: 'normal',
  },
  {
    id: '4',
    title: '系统安全升级',
    description: '修复关键安全漏洞，升级加密算法',
    date: '2024-03-05T00:00:00Z',
    type: 'other',
    importance: 'critical',
  },
  {
    id: '5',
    title: '新功能预览会',
    description: '向团队展示即将发布的新功能演示',
    date: '2024-03-01T10:00:00Z',
    type: 'meeting',
    importance: 'normal',
  }
]; 