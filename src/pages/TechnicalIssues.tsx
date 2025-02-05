import { useState, useMemo } from 'react';
import { mockIssues } from '../mock/data';
import { TechnicalIssue } from '../types';
import * as XLSX from 'xlsx';

const TechnicalIssues = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedPriority, setSelectedPriority] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<TechnicalIssue | null>(null);
  const [newIssue, setNewIssue] = useState({
    title: '',
    description: '',
    solution: '',
    tags: [] as string[],
    status: 'open' as const,
    priority: 'medium' as const,
  });
  const [tagInput, setTagInput] = useState('');

  const allTags = useMemo(() => 
    Array.from(new Set(mockIssues.flatMap(issue => issue.tags))),
    []
  );

  const statusOptions = [
    { value: 'open', label: '待处理', color: 'yellow' },
    { value: 'in-progress', label: '处理中', color: 'blue' },
    { value: 'resolved', label: '已解决', color: 'green' },
  ];

  const priorityOptions = [
    { value: 'low', label: '低', color: 'gray' },
    { value: 'medium', label: '中', color: 'yellow' },
    { value: 'high', label: '高', color: 'red' },
  ];

  const columns = [
    { key: 'title', label: '标题', width: '20%' },
    { key: 'status', label: '状态', width: '10%' },
    { key: 'priority', label: 'priority', label: '优先级', width: '10%' },
    { key: 'description', label: '描述', width: '20%' },
    { key: 'solution', label: '解决方案', width: '20%' },
    { key: 'tags', label: '标签', width: '10%' },
    { key: 'createTime', label: '创建时间', width: '10%' },
  ];

  const filteredIssues = useMemo(() => {
    return mockIssues.filter(issue => {
      const matchesSearch = searchQuery === '' || 
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = selectedStatus.length === 0 || 
        selectedStatus.includes(issue.status);

      const matchesPriority = selectedPriority.length === 0 || 
        selectedPriority.includes(issue.priority);

      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tag => issue.tags.includes(tag));

      return matchesSearch && matchesStatus && matchesPriority && matchesTags;
    });
  }, [searchQuery, selectedStatus, selectedPriority, selectedTags]);

  const toggleFilter = (
    value: string,
    currentSelection: string[],
    setSelection: (value: string[]) => void
  ) => {
    setSelection(
      currentSelection.includes(value)
        ? currentSelection.filter(item => item !== value)
        : [...currentSelection, value]
    );
  };

  const statusStyleMap = {
    open: {
      default: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      active: 'bg-yellow-500 text-white',
    },
    'in-progress': {
      default: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      active: 'bg-blue-500 text-white',
    },
    resolved: {
      default: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      active: 'bg-green-500 text-white',
    },
  };

  const priorityStyleMap = {
    low: {
      default: 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
      active: 'bg-gray-500 text-white',
    },
    medium: {
      default: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      active: 'bg-yellow-500 text-white',
    },
    high: {
      default: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      active: 'bg-red-500 text-white',
    },
  };

  const getStatusColor = (status: string) => {
    return statusStyleMap[status as keyof typeof statusStyleMap]?.default || statusStyleMap.open.default;
  };

  const getPriorityColor = (priority: string) => {
    return priorityStyleMap[priority as keyof typeof priorityStyleMap]?.default || priorityStyleMap.medium.default;
  };

  const getStatusActiveColor = (status: string) => {
    return statusStyleMap[status as keyof typeof statusStyleMap]?.active || statusStyleMap.open.active;
  };

  const getPriorityActiveColor = (priority: string) => {
    return priorityStyleMap[priority as keyof typeof priorityStyleMap]?.active || priorityStyleMap.medium.active;
  };

  const renderViewToggle = () => (
    <div className="flex items-center gap-2 mb-6">
      <button
        onClick={() => setViewMode('card')}
        className={`p-2 rounded-lg transition-colors ${
          viewMode === 'card'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
        }`}
        aria-label="卡片视图"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      </button>
      <button
        onClick={() => setViewMode('table')}
        className={`p-2 rounded-lg transition-colors ${
          viewMode === 'table'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
        }`}
        aria-label="表格视图"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </button>
    </div>
  );

  const exportToExcel = () => {
    const data = filteredIssues.map(issue => ({
      标题: issue.title,
      描述: issue.description,
      解决方案: issue.solution,
      状态: statusOptions.find(opt => opt.value === issue.status)?.label,
      优先级: priorityOptions.find(opt => opt.value === issue.priority)?.label,
      标签: issue.tags.join(', '),
      创建时间: new Date(issue.createTime).toLocaleString(),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '技术问题');
    XLSX.writeFile(wb, '技术问题列表.xlsx');
  };

  const handleAddIssue = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('新问题：', newIssue);
    setIsAddModalOpen(false);
    setNewIssue({
      title: '',
      description: '',
      solution: '',
      tags: [],
      status: 'open',
      priority: 'medium',
    });
  };

  const handleDoubleClick = (issue: TechnicalIssue) => {
    setSelectedIssue(issue);
  };

  const handleAddTag = () => {
    if (tagInput && !newIssue.tags.includes(tagInput)) {
      setNewIssue({
        ...newIssue,
        tags: [...newIssue.tags, tagInput]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewIssue({
      ...newIssue,
      tags: newIssue.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const renderTableView = () => (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800">
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300"
                style={{ width: column.width }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredIssues.map((issue) => (
            <tr
              key={issue.id}
              onDoubleClick={() => handleDoubleClick(issue)}
              className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                <div className="font-medium">{issue.title}</div>
              </td>
              <td className="px-4 py-4 text-sm">
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(issue.status)}`}>
                  {statusOptions.find(opt => opt.value === issue.status)?.label}
                </span>
              </td>
              <td className="px-4 py-4 text-sm">
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${getPriorityColor(issue.priority)}`}>
                  {priorityOptions.find(opt => opt.value === issue.priority)?.label}
                </span>
              </td>
              <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="line-clamp-2">{issue.description}</div>
              </td>
              <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="line-clamp-2">{issue.solution}</div>
              </td>
              <td className="px-4 py-4 text-sm">
                <div className="flex flex-wrap gap-1">
                  {issue.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                {new Date(issue.createTime).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderCardView = () => (
    <div className="grid gap-6">
      {filteredIssues.map(issue => (
        <div
          key={issue.id}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
          onClick={() => handleDoubleClick(issue)}
        >
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {issue.title}
            </h2>
            <div className="flex gap-2">
              <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(issue.status)}`}>
                {statusOptions.find(opt => opt.value === issue.status)?.label}
              </span>
              <span className={`px-2 py-1 rounded-full text-sm font-medium ${getPriorityColor(issue.priority)}`}>
                {priorityOptions.find(opt => opt.value === issue.priority)?.label}优先级
              </span>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {issue.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {issue.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">解决方案</h3>
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
              {issue.solution}
            </p>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            创建于 {new Date(issue.createTime).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">技术问题</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            添加问题
          </button>
          {viewMode === 'table' && (
            <button
              onClick={exportToExcel}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              导出 Excel
            </button>
          )}
          {renderViewToggle()}
        </div>
      </div>

      <div className="mb-8 space-y-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索问题..."
            className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/40"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="flex flex-wrap gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">状态</h3>
            <div className="flex gap-2">
              {statusOptions.map(({ value, label, color }) => (
                <button
                  key={value}
                  onClick={() => toggleFilter(value, selectedStatus, setSelectedStatus)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedStatus.includes(value)
                      ? getStatusActiveColor(value)
                      : getStatusColor(value)
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">优先级</h3>
            <div className="flex gap-2">
              {priorityOptions.map(({ value, label, color }) => (
                <button
                  key={value}
                  onClick={() => toggleFilter(value, selectedPriority, setSelectedPriority)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedPriority.includes(value)
                      ? getPriorityActiveColor(value)
                      : getPriorityColor(value)
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">标签</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleFilter(tag, selectedTags, setSelectedTags)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-500 text-white'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'table' ? renderTableView() : renderCardView()}

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                添加技术问题
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddIssue} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  标题
                </label>
                <input
                  type="text"
                  value={newIssue.title}
                  onChange={e => setNewIssue({ ...newIssue, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/40"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    状态
                  </label>
                  <select
                    value={newIssue.status}
                    onChange={e => setNewIssue({ ...newIssue, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/40"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    优先级
                  </label>
                  <select
                    value={newIssue.priority}
                    onChange={e => setNewIssue({ ...newIssue, priority: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/40"
                  >
                    {priorityOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  描述
                </label>
                <textarea
                  value={newIssue.description}
                  onChange={e => setNewIssue({ ...newIssue, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/40"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  解决方案
                </label>
                <textarea
                  value={newIssue.solution}
                  onChange={e => setNewIssue({ ...newIssue, solution: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  标签
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {newIssue.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="输入标签"
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/40"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    添加
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedIssue && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-3xl p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedIssue.title}
              </h3>
              <button
                onClick={() => setSelectedIssue(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">描述</h4>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                  {selectedIssue.description}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">解决方案</h4>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                  {selectedIssue.solution}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicalIssues; 