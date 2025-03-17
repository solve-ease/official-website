import React, { useState } from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import { useQuery } from 'react-query';
import { Tag, X } from 'lucide-react';
import { fetchAllTags } from '../../services/blogService';

const BlogTagsFilter = ({ selectedTags, onChange }) => {
  const [suggestions, setSuggestions] = useState([]);
  
  // Fetch all available tags
  const { data: allTags, isLoading } = useQuery('blogTags', fetchAllTags, {
    onSuccess: (data) => {
      setSuggestions(data.map(tag => ({
        id: tag.id,
        text: tag.name
      })));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const handleDelete = (i) => {
    onChange(selectedTags.filter((tag, index) => index !== i));
  };

  const handleAddition = (tag) => {
    onChange([...selectedTags, tag]);
  };

  const handleTagClick = (index) => {
    console.log('Tag clicked:', index);
  };

  // Convert selectedTags to format required by ReactTags
  const tags = selectedTags.map(tag => ({
    id: tag.id || tag,
    text: tag.name || tag
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-gray-700 mb-2">
        <Tag size={18} />
        <h3 className="font-medium">Filter by Tags</h3>
      </div>
      
      <div className="react-tags-wrapper">
        <ReactTags
          tags={tags}
          suggestions={suggestions}
          handleDelete={handleDelete}
          handleAddition={handleAddition}
          handleTagClick={handleTagClick}
          delimiters={[188, 13]} // comma and enter
          placeholder="Add tags to filter posts..."
          minQueryLength={1}
          maxLength={20}
          autofocus={false}
          classNames={{
            tags: 'ReactTags__tags',
            tagInput: 'ReactTags__tagInput',
            tagInputField: 'ReactTags__tagInputField w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            selected: 'ReactTags__selected flex flex-wrap gap-2 mb-2',
            tag: 'ReactTags__tag bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-1 text-sm',
            remove: 'ReactTags__remove cursor-pointer',
            suggestions: 'ReactTags__suggestions absolute z-10 bg-white mt-1 max-h-60 overflow-auto rounded-md shadow-lg py-1',
            activeSuggestion: 'ReactTags__activeSuggestion bg-blue-50'
          }}
        />
      </div>
      
      {selectedTags.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={() => onChange([])}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <X size={14} />
            Clear all tags
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogTagsFilter;
