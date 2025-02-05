import { useState, useMemo } from 'react';
import { mockDocuments } from '../mock/data';
import { Document } from '../types';

const Documents = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>([]);
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);

  const allCategories = useMemo(() => 
    Array.from(new Set(mockDocuments.map(doc => doc.category))),
    []
  );

  const fileTypeOptions = [
    { value: 'pdf', label: 'PDF', icon: '📄', color: 'blue' },
    { value: 'word', label: 'Word', icon: '📝', color: 'indigo' },
    { value: 'excel', label: 'Excel', icon: '📊', color: 'green' },
    { value: 'ppt', label: 'PPT', icon: '📑', color: 'orange' },
  ];

  const colorStyleMap = {
    blue: {
      active: 'bg-blue-500 text-white',
      default: 'bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400',
      tag: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    },
    indigo: {
      active: 'bg-indigo-500 text-white',
      default: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400',
      tag: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
    },
    green: {
      active: 'bg-green-500 text-white',
      default: 'bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400',
      tag: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    },
    orange: {
      active: 'bg-orange-500 text-white',
      default: 'bg-orange-50 text-orange-700 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400',
      tag: 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    },
    gray: {
      active: 'bg-blue-500 text-white',
      default: 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300',
      tag: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
    },
  };

  const getColorStyle = (color: keyof typeof colorStyleMap, type: 'active' | 'default' | 'tag') => {
    return colorStyleMap[color]?.[type] || colorStyleMap.gray[type];
  };

  const getFileTypeColor = (fileType: string) => {
    return fileTypeOptions.find(opt => opt.value === fileType)?.color || 'gray';
  };

  const filteredDocuments = useMemo(() => {
    return mockDocuments.filter(doc => {
      const matchesSearch = searchQuery === '' || 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(doc.category);

      const matchesFileType = selectedFileTypes.length === 0 || 
        selectedFileTypes.includes(doc.fileType);

      return matchesSearch && matchesCategory && matchesFileType;
    });
  }, [searchQuery, selectedCategories, selectedFileTypes]);

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

  const formatFileSize = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const getFileTypeIcon = (fileType: string) => {
    return fileTypeOptions.find(opt => opt.value === fileType)?.icon || '📄';
  };

  const handlePreview = (doc: Document) => {
    setPreviewDoc(doc);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">技术文档</h1>

      <div className="mb-8 space-y-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索文档..."
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
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">文档分类</h3>
            <div className="flex flex-wrap gap-2">
              {allCategories.map(category => (
                <button
                  key={category}
                  onClick={() => toggleFilter(category, selectedCategories, setSelectedCategories)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedCategories.includes(category)
                      ? getColorStyle('blue', 'active')
                      : getColorStyle('gray', 'default')
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">文件类型</h3>
            <div className="flex flex-wrap gap-2">
              {fileTypeOptions.map(({ value, label, icon, color }) => (
                <button
                  key={value}
                  onClick={() => toggleFilter(value, selectedFileTypes, setSelectedFileTypes)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
                    selectedFileTypes.includes(value)
                      ? getColorStyle(color as keyof typeof colorStyleMap, 'active')
                      : getColorStyle(color as keyof typeof colorStyleMap, 'default')
                  }`}
                >
                  <span>{icon}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDocuments.map(doc => (
          <div
            key={doc.id}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{getFileTypeIcon(doc.fileType)}</span>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {doc.title}
                  </h2>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatFileSize(doc.size)}
                  </span>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-lg text-sm ${getColorStyle(getFileTypeColor(doc.fileType), 'tag')}`}>
                {doc.category}
              </span>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
              {doc.description}
            </p>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <time className="text-sm text-gray-500 dark:text-gray-400">
                上传于 {new Date(doc.uploadTime).toLocaleDateString()}
              </time>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePreview(doc)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                >
                  预览
                </button>
                <a
                  href={doc.fileUrl}
                  download
                  className="px-3 py-1 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  下载
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 文档预览模态框 */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {previewDoc.title}
              </h3>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <iframe
                src={previewDoc.fileUrl}
                className="w-full h-[70vh] border-0"
                title={previewDoc.title}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents; 