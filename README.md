# Study Progress Tracker Website

A comprehensive web application for tracking academic progress across four major science subjects: Physics, Physical Chemistry, Organic Chemistry, and Biology. This application provides an intuitive interface for organizing study materials into custom columns and chapters with completion tracking.

## ✨ Features

### 🏠 Homepage
- **Subject Overview**: Visual cards for each subject with progress indicators
- **Real-time Progress**: Shows completion percentage for each subject
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 📚 Subject Pages
- **Custom Columns**: Create unlimited custom columns to organize your study materials
- **Chapter Management**: Add, edit, and delete chapters within each column
- **Progress Tracking**: Visual progress bars and completion statistics
- **Completion Toggle**: Easy checkbox system to mark chapters as complete
- **Local Storage**: All data persists in your browser's local storage

### 🎨 Modern UI/UX
- **Gradient Design**: Beautiful gradient backgrounds and modern styling
- **Smooth Animations**: Hover effects and smooth transitions
- **Modal Dialogs**: Clean modal interfaces for adding content
- **Mobile Responsive**: Optimized for all screen sizes

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional installations required!

### Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/progress-tracker-website.git
   cd progress-tracker-website
   ```

2. **Open the application**:
   - Simply open `src/index.html` in your web browser
   - Or use a local server (recommended):
     ```bash
     npm install -g live-server
     live-server src
     ```

3. **Start tracking your progress**!

## 📁 Project Structure

```
progress-tracker-website/
├── src/
│   ├── index.html                    # Homepage with subject cards
│   ├── css/
│   │   └── main.css                  # Complete styling for all pages
│   ├── js/
│   │   ├── app.js                    # Homepage navigation and progress loading
│   │   ├── components/
│   │   │   ├── progressTracker.js    # Main tracker component with UI management
│   │   │   └── chapterManager.js     # Chapter CRUD operations and utilities
│   │   └── utils/
│   │       └── storage.js            # Local storage management utilities
│   └── pages/
│       ├── physics.html              # Physics subject tracker
│       ├── physical-chemistry.html   # Physical Chemistry tracker
│       ├── organic-chemistry.html    # Organic Chemistry tracker
│       └── biology.html              # Biology tracker
├── package.json                      # Project configuration
└── README.md                         # This file
```

## 🎯 How to Use

### 1. Homepage Navigation
- Click on any subject card to navigate to that subject's tracker
- View overall progress for each subject at a glance

### 2. Managing Columns
- Click **"+ Add Column"** to create a new study category
- Name your columns (e.g., "Mechanics", "Thermodynamics", "Quantum Physics")
- Use the delete button to remove columns you no longer need

### 3. Managing Chapters
- Click **"+ Add Chapter"** within any column
- Add chapter names (e.g., "Newton's Laws", "Energy Conservation")
- Check the box when you complete a chapter
- Delete chapters using the × button

### 4. Tracking Progress
- View real-time progress bars for each column
- See overall subject completion statistics in the header
- Progress automatically updates on the homepage

## 🛠 Technical Features

- **Pure JavaScript**: No external frameworks required
- **Local Storage**: All data persists locally in your browser
- **Responsive CSS Grid**: Adapts to any screen size
- **Modern ES6+**: Uses modern JavaScript features
- **Modular Architecture**: Clean, maintainable code structure

## 🎨 Customization

The application is designed to be easily customizable:

- **Colors**: Modify the CSS gradient variables in `main.css`
- **Icons**: Update subject icons in the JavaScript files
- **Layout**: Adjust grid layouts and spacing in CSS
- **Features**: Add new functionality through the modular component system

## 🔧 Advanced Features

### Data Export/Import
- Export your progress data as JSON files
- Import previously exported data to restore progress
- Perfect for backing up your study progress

### Bulk Operations
- Mark all chapters in a column as complete
- Sort chapters by name, completion status, or date
- Delete all completed chapters at once

### Statistics
- View detailed completion statistics
- Track study patterns and progress over time
- See average completion times for chapters

## 📱 Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow the existing code style
- Test your changes across different browsers
- Update documentation as needed
- Keep commits focused and descriptive

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Icons and design inspiration from modern web design trends
- Built with accessibility and user experience in mind
- Thanks to the educational community for feedback and suggestions

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/progress-tracker-website/issues) page
2. Create a new issue with detailed information
3. Include your browser version and steps to reproduce any problems

---

**Happy Studying! 📚✨**

Transform your study routine with organized progress tracking and never lose sight of your academic goals.