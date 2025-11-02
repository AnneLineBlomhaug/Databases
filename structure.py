import os

def print_structure(root_dir, prefix="", level=0, max_level=2):
    if level > max_level:
        return

    exclude = {'__pycache__', '.git', 'migrations', 'venv', 'env', 'node_modules',}
    
    items = sorted(os.listdir(root_dir))
    dirs = [item for item in items if os.path.isdir(os.path.join(root_dir, item)) and item not in exclude]
    files = [item for item in items if os.path.isfile(os.path.join(root_dir, item))]

    items = dirs + files  # List directories first

    for index, item in enumerate(items):
        path = os.path.join(root_dir, item)
        connector = "├── " if index < len(items) - 1 else "└── "
        print(prefix + connector + item)
        
        if os.path.isdir(path):
            next_prefix = prefix + ("│   " if index < len(items) - 1 else "    ")
            print_structure(path, next_prefix, level + 1, max_level)

if __name__ == "__main__":
    print_structure('.')
