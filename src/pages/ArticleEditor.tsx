import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockArticles } from '../mock/data';
import RichTextEditor from '../components/RichTextEditor';
import type { OutputData } from '@editorjs/editorjs';

const ArticleEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<OutputData>({ blocks: [] });
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [autoSaveStatus, setAutoSaveStatus] = useState<string>('');

  useEffect(() => {
    if (id) {
      const article = mockArticles.find(a => a.id === id);
      if (article) {
        setTitle(article.title);
        setContent(typeof article.content === 'string' 
          ? JSON.parse(article.content) 
          : article.content
        );
        setTags(article.tags);
      }
    }
  }, [id]);

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 在实际应用中，这里会调用 API 保存文章
    console.log({
      title,
      content: JSON.stringify(content), // 保存为字符串
      tags
    });
    navigate('/articles');
  };

  const handleAutoSave = async (content: OutputData) => {
    // 在实际应用中，这里会调用 API 保存文章
    console.log('Auto saving...', {
      title,
      content: JSON.stringify(content),
      tags
    });
    // 模拟 API 调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const handleImageUpload = async (file: File) => {
    // 在实际应用中，这里会上传到服务器
    console.log('Uploading image...', file);
    // 模拟上传
    await new Promise(resolve => setTimeout(resolve, 1000));
    return URL.createObjectURL(file);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
          {id ? '编辑文章' : '写文章'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="文章标题"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:border-transparent"
            />
          </div>

          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-blue-400 hover:text-blue-600"
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
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder="添加标签"
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:border-transparent"
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

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <RichTextEditor
              content={content}
              onChange={setContent}
              onSave={handleAutoSave}
              uploadImage={handleImageUpload}
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/articles')}
              className="px-6 py-2 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              发布
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArticleEditor; 