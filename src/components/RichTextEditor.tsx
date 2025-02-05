import { useEffect, useRef, useState } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Image from '@editorjs/image';
import Link from '@editorjs/link';
import Code from '@editorjs/code';
import Table from '@editorjs/table';

interface RichTextEditorProps {
  content: OutputData | string;
  onChange: (content: OutputData) => void;
  readOnly?: boolean;
}

const RichTextEditor = ({ content, onChange, readOnly = false }: RichTextEditorProps) => {
  const editorRef = useRef<EditorJS | null>(null);
  const holderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!holderRef.current || editorRef.current) return;

    const editor = new EditorJS({
      holder: holderRef.current,
      tools: {
        header: {
          class: Header,
          config: {
            levels: [1, 2, 3],
            defaultLevel: 2
          }
        },
        list: {
          class: List,
          inlineToolbar: true,
        },
        image: {
          class: Image,
          config: {
            uploader: {
              uploadByFile(file: File) {
                return new Promise((resolve) => {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    resolve({
                      success: 1,
                      file: {
                        url: e.target?.result as string
                      }
                    });
                  };
                  reader.readAsDataURL(file);
                });
              }
            }
          }
        },
        link: {
          class: Link,
        },
        code: Code,
        table: Table,
      },
      data: typeof content === 'string' ? { blocks: [] } : content,
      readOnly,
      onChange: async () => {
        const outputData = await editor.save();
        onChange(outputData);
      },
      placeholder: '开始写作...',
      i18n: {
        messages: {
          ui: {
            blockTunes: {
              toggler: {
                'Click to tune': '点击设置',
              },
            },
            inlineToolbar: {
              converter: {
                'Convert to': '转换为'
              }
            },
            toolbar: {
              toolbox: {
                Add: '添加'
              }
            }
          },
          toolNames: {
            Text: '文本',
            Heading: '标题',
            List: '列表',
            Link: '链接',
            Image: '图片',
            Code: '代码',
            Table: '表格',
          },
          tools: {
            link: {
              'Add a link': '添加链接'
            },
            image: {
              'Select an Image': '选择图片'
            },
            list: {
              Unordered: '无序列表',
              Ordered: '有序列表'
            },
            code: {
              'Enter a code': '输入代码'
            }
          },
          blockTunes: {
            delete: {
              Delete: '删除'
            },
            moveUp: {
              'Move up': '上移'
            },
            moveDown: {
              'Move down': '下移'
            }
          }
        }
      }
    });

    editorRef.current = editor;

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [readOnly]);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
      <div ref={holderRef} className="prose dark:prose-invert max-w-none min-h-[300px] p-4" />
    </div>
  );
};

export default RichTextEditor; 