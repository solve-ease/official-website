const BlogSorting = ({ value, onChange }) => {
    const selectedOption = sortOptions.find(option => option.id === value) || sortOptions[0];
  
    return (
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white rounded-md shadow-sm hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
            <span className="flex items-center gap-2">
              {selectedOption.icon}
              <span className="hidden md:inline">{selectedOption.label}</span>
            </span>
            <ChevronDown size={16} />
          </Menu.Button>
        </div>
  
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
            <div className="py-1">
              {sortOptions.map((option) => (
                <Menu.Item key={option.id}>
                  {({ active }) => (
                    <button
                      onClick={() => onChange(option.id)}
                      className={`${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } ${
                        value === option.id ? 'bg-blue-50' : ''
                      } group flex items-center w-full px-4 py-2 text-sm`}
                    >
                      <span className="mr-2">{option.icon}</span>
                      {option.label}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    );
  };
  
  export default BlogSorting;