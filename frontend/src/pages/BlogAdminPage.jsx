import React, { useState, useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { useDropzone } from 'react-dropzone';
import { useNavigate, useParams } from 'react-router-dom';
import slugify from 'slugify';
import api from '../services/loginService';


  
const BlogAdminPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    status: 'draft',
    meta_title: '',
    meta_description: '',
    reading_time: 5,
    tags: []
  });
  const [newTag, setNewTag] = useState({ name: '', slug: '', description: '' });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Initialize the TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Youtube,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: formData.content,
    onUpdate: ({ editor }) => {
      setFormData(prev => ({ ...prev, content: editor.getHTML() }));
    },
  });

  // Fetch all tags when component mounts
  useEffect(() => {
    fetchTags();
    if (id) {
      fetchPost(id);
    }
  }, [id]);

  const fetchTags = async () => {
    try {
      const response = await api.get('/blog/tags');
      setTags(response.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const fetchPost = async (postId) => {
    try {
      setIsLoading(true);
      const response = await api.get(`/blog/posts/${postId}`);
      const post = response.data;
      setFormData({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || '',
        content: post.content,
        featured_image: post.featured_image || '',
        status: post.status,
        meta_title: post.meta_title || '',
        meta_description: post.meta_description || '',
        reading_time: post.reading_time || 5,
        tags: post.tags.map(tag => tag.id)
      });
      
      if (editor) {
        editor.commands.setContent(post.content);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate slug from title
    if (name === 'title' && !formData.slug) {
      const slug = slugify(value, { lower: true, strict: true });
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  // Handle tag selection
  const handleTagChange = (e) => {
    const tagId = e.target.value;
    const isChecked = e.target.checked;
    
    setFormData(prev => {
      if (isChecked) {
        return { ...prev, tags: [...prev.tags, tagId] };
      } else {
        return { ...prev, tags: prev.tags.filter(id => id !== tagId) };
      }
    });
  };

  // Handle new tag form changes
  const handleNewTagChange = (e) => {
    const { name, value } = e.target;
    setNewTag(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate slug for new tag
    if (name === 'name' && !newTag.slug) {
      const slug = slugify(value, { lower: true, strict: true });
      setNewTag(prev => ({ ...prev, slug }));
    }
  };

  // Create a new tag
  const createTag = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/blog/tags', newTag);
      setTags(prev => [...prev, response.data]);
      setNewTag({ name: '', slug: '', description: '' });
      setSuccessMessage('Tag created successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error creating tag:', error);
      setErrors(prev => ({ ...prev, tag: error.response?.data?.error || 'Failed to create tag' }));
    }
  };

  // Handle image uploads
  const onDrop = useCallback(async (acceptedFiles) => {
    // Normally, you'd upload this to your server or a storage service
    // For this example, we'll use a placeholder approach
    try {
      // Simulate uploading to backend/storage
      // In a real app, you'd use FormData and send to your backend or S3/etc.
      console.log('Uploading files:', acceptedFiles);
      
      // Assuming your backend returns a URL to the uploaded image
      const imageUrl = URL.createObjectURL(acceptedFiles[0]);
      
      // Insert the image into the editor
      if (editor) {
        editor.chain().focus().setImage({ src: imageUrl }).run();
      }
      
      // For featured image
      if (acceptedFiles[0].type.includes('image')) {
        setFormData(prev => ({ ...prev, featured_image: imageUrl }));
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }, [editor]);

  const { getRootProps, getInputProps } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': []
    }
  });

  // Submit the form to create/update a blog post
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    try {
      setIsLoading(true);
      
      // Create or update the post
      let response;
      if (id) {
        response = await api.put(`/blog/posts/${id}`, formData);
      } else {
        response = await api.post('/blog/posts', formData);
      }
      
      setSuccessMessage(id ? 'Post updated successfully!' : 'Post created successfully!');
      setTimeout(() => {
        setSuccessMessage('');
        navigate(`/blog/${response.data.slug}`);
      }, 2000);
    } catch (error) {
      console.error('Error saving post:', error);
      setErrors(error.response?.data?.error || { form: 'Failed to save post' });
    } finally {
      setIsLoading(false);
    }
  };

  // Editor menu buttons
  const EditorMenu = () => {
    if (!editor) return null;
    
    return (
      <div className="border-b border-gray-200 pb-2 mb-4 flex flex-wrap gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded ${editor.isActive('bold') ? 'bg-gray-200' : 'bg-white'}`}
          type="button"
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded ${editor.isActive('italic') ? 'bg-gray-200' : 'bg-white'}`}
          type="button"
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-2 py-1 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : 'bg-white'}`}
          type="button"
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : 'bg-white'}`}
          type="button"
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-2 py-1 rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : 'bg-white'}`}
          type="button"
        >
          H3
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 rounded ${editor.isActive('bulletList') ? 'bg-gray-200' : 'bg-white'}`}
          type="button"
        >
          Bullet List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 rounded ${editor.isActive('orderedList') ? 'bg-gray-200' : 'bg-white'}`}
          type="button"
        >
          Ordered List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`px-2 py-1 rounded ${editor.isActive('codeBlock') ? 'bg-gray-200' : 'bg-white'}`}
          type="button"
        >
          Code Block
        </button>
        <button
          onClick={() => {
            const url = prompt('Enter YouTube URL');
            if (url) {
              editor.chain().focus().setYoutubeVideo({ src: url }).run();
            }
          }}
          className="px-2 py-1 rounded bg-white"
          type="button"
        >
          YouTube
        </button>
        <button
          onClick={() => {
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
          }}
          className="px-2 py-1 rounded bg-white"
          type="button"
        >
          Insert Table
        </button>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 font-inter">
        {id ? 'Edit Blog Post' : 'Create New Blog Post'}
      </h1>
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      
      {errors.form && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errors.form}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
              Slug *
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
            {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
          </div>
        </div>
        
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Featured Image
          </label>
          <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer">
            <input {...getInputProps()} />
            {formData.featured_image ? (
              <div>
                <img src={formData.featured_image} alt="Featured" className="h-40 mx-auto object-cover" />
                <p className="mt-2 text-sm text-gray-500">Click or drag to replace image</p>
              </div>
            ) : (
              <p className="text-gray-500">Drag 'n' drop an image here, or click to select one</p>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content *
          </label>
          <div className="border border-gray-300 rounded-md overflow-hidden">
            <EditorMenu />
            <EditorContent editor={editor} className="min-h-[400px] prose max-w-none p-4" />
          </div>
          <div {...getRootProps()} className="mt-2 border border-gray-300 rounded-md p-2 text-center cursor-pointer">
            <input {...getInputProps()} />
            <p className="text-sm text-gray-500">Drag & drop images here to add them to your content</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="reading_time" className="block text-sm font-medium text-gray-700 mb-1">
              Reading Time (minutes)
            </label>
            <input
              type="number"
              id="reading_time"
              name="reading_time"
              value={formData.reading_time}
              onChange={handleChange}
              min="1"
              max="60"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <h2 className="text-lg font-medium mb-2">SEO Settings</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="meta_title" className="block text-sm font-medium text-gray-700 mb-1">
                Meta Title
              </label>
              <input
                type="text"
                id="meta_title"
                name="meta_title"
                value={formData.meta_title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="meta_description" className="block text-sm font-medium text-gray-700 mb-1">
                Meta Description
              </label>
              <textarea
                id="meta_description"
                name="meta_description"
                value={formData.meta_description}
                onChange={handleChange}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <h2 className="text-lg font-medium mb-2">Tags</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Select Tags</h3>
              <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md p-3">
                {/* {tags.length > 0 ? (
                  tags.map(tag => (
                    <div key={tag.id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={`tag-${tag.id}`}
                        value={tag.id}
                        checked={formData.tags.includes(tag.id)}
                        onChange={handleTagChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label htmlFor={`tag-${tag.id}`} className="ml-2 text-sm text-gray-700">
                        {tag.name}
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No tags available. Create one!</p>
                )} */}

                <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md p-3">
                {Array.isArray(tags) && tags.length > 0 ? (
                    tags.map(tag => (
                    <div key={tag.id} className="flex items-center mb-2">
                        <input
                        type="checkbox"
                        id={`tag-${tag.id}`}
                        value={tag.id}
                        checked={formData.tags.includes(tag.id)}
                        onChange={handleTagChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <label htmlFor={`tag-${tag.id}`} className="ml-2 text-sm text-gray-700">
                        {tag.name}
                        </label>
                    </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500">No tags available. Create one!</p>
                )}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Create New Tag</h3>
              <div className="space-y-3">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={newTag.name}
                    onChange={handleNewTagChange}
                    placeholder="Tag Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="slug"
                    value={newTag.slug}
                    onChange={handleNewTagChange}
                    placeholder="Tag Slug"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="description"
                    value={newTag.description}
                    onChange={handleNewTagChange}
                    placeholder="Tag Description (optional)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <button
                  type="button"
                  onClick={createTag}
                  className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                  disabled={!newTag.name || !newTag.slug}
                >
                  Add Tag
                </button>
                {errors.tag && <p className="text-red-500 text-sm mt-1">{errors.tag}</p>}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/blog')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : id ? 'Update Post' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogAdminPage;