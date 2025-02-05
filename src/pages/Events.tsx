import { useState, useMemo } from 'react';
import { mockEvents } from '../mock/data';
import { Event } from '../types';

const Events = () => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedImportance, setSelectedImportance] = useState<string[]>([]);

  const typeOptions = [
    { value: 'release', label: '版本发布', icon: '🚀' },
    { value: 'milestone', label: '里程碑', icon: '🏆' },
    { value: 'meeting', label: '会议', icon: '📅' },
    { value: 'other', label: '其他', icon: '📌' },
  ];

  const importanceOptions = [
    { value: 'normal', label: '普通', color: 'bg-gray-500 text-white' },
    { value: 'important', label: '重要', color: 'bg-yellow-500 text-white' },
    { value: 'critical', label: '关键', color: 'bg-red-500 text-white' },
  ];

  const importanceStyleMap = {
    normal: {
      active: 'bg-gray-500 text-white',
      default: 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300',
      dot: 'border-gray-500',
      badge: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    },
    important: {
      active: 'bg-yellow-500 text-white',
      default: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400',
      dot: 'border-yellow-500',
      badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    },
    critical: {
      active: 'bg-red-500 text-white',
      default: 'bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400',
      dot: 'border-red-500',
      badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    },
  };

  const filteredEvents = useMemo(() => {
    return mockEvents
      .filter(event => {
        const matchesType = selectedTypes.length === 0 || 
          selectedTypes.includes(event.type);
        const matchesImportance = selectedImportance.length === 0 || 
          selectedImportance.includes(event.importance);
        return matchesType && matchesImportance;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [selectedTypes, selectedImportance]);

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

  const getImportanceStyle = (importance: string, type: 'active' | 'default' | 'dot' | 'badge') => {
    return importanceStyleMap[importance as keyof typeof importanceStyleMap]?.[type] || importanceStyleMap.normal[type];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">重要事件</h1>

      <div className="mb-8 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">事件类型</h3>
          <div className="flex flex-wrap gap-2">
            {typeOptions.map(({ value, label, icon }) => (
              <button
                key={value}
                onClick={() => toggleFilter(value, selectedTypes, setSelectedTypes)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
                  selectedTypes.includes(value)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                <span>{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">重要程度</h3>
          <div className="flex flex-wrap gap-2">
            {importanceOptions.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => toggleFilter(value, selectedImportance, setSelectedImportance)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedImportance.includes(value)
                    ? getImportanceStyle(value, 'active')
                    : getImportanceStyle(value, 'default')
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative">
        {/* 时间线轴线 */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

        <div className="space-y-8">
          {filteredEvents.map((event, index) => (
            <div key={event.id} className="relative pl-20">
              {/* 时间线圆点 */}
              <div className={`absolute left-7 w-3 h-3 rounded-full border-2 ${getImportanceStyle(event.importance, 'dot')} bg-white dark:bg-gray-800 -translate-x-1/2`} />

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <span>
                        {typeOptions.find(opt => opt.value === event.type)?.icon}
                      </span>
                      {event.title}
                    </h2>
                    <time className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(event.date)}
                    </time>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${getImportanceStyle(event.importance, 'badge')}`}>
                    {importanceOptions.find(opt => opt.value === event.importance)?.label}
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events; 