import { useState } from 'react';
import { mockArticles } from '../mock/data';
import { Article } from '../types';
import { Link } from 'react-router-dom';

const Articles = () => {
  const [articles] = useState<Article[]>(mockArticles);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = Array.from(
    new Set(articles.flatMap(article => article.tags))
  );

  const filteredArticles = selectedTags.length > 0
    ? articles.filter(article =>
        selectedTags.some(tag => article.tags.includes(tag))
      )
    : articles;

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">技术文章</h1>
        <Link to="/articles/new" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors">
          写文章
        </Link>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">标签筛选</h2>
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedTags.includes(tag)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6">
        {filteredArticles.map(article => (
          <Link to={`/articles/${article.id}`} key={article.id}>
            <article className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
              <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                {article.title}
              </h2>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span className="mr-4">作者: {article.author}</span>
                <span className="mr-4">
                  发布于: {new Date(article.createTime).toLocaleDateString()}
                </span>
                <span>阅读: {article.views}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {article.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                {article.content.replace(/[#*]/g, '')}
              </p>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Articles; 