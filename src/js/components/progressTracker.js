// Advanced Progress Tracker Component
class ProgressTracker {
    constructor(subject) {
        this.subject = subject;
        this.data = this.loadData();
        this.currentModal = null;
        this.init();
    }

    init() {
        this.renderHeader();
        this.renderColumns();
        this.setupEventListeners();
    }

    loadData() {
        const saved = localStorage.getItem(`${this.subject}-data`);
        return saved ? JSON.parse(saved) : {};
    }

    saveData() {
        localStorage.setItem(`${this.subject}-data`, JSON.stringify(this.data));
    }

    renderHeader() {
        const container = document.querySelector('.tracker-container');
        if (!container) return;

        const header = document.createElement('div');
        header.className = 'tracker-header';
        header.innerHTML = `
            <div>
                <h1 class="subject-title">
                    ${this.getSubjectIcon()} ${this.getSubjectTitle()}
                </h1>
                <div class="subject-stats">
                    <span id="total-progress">Loading...</span>
                </div>
            </div>
            <div class="header-buttons">
                <a href="../index.html" class="back-btn">← Back to Home</a>
                <button class="add-column-btn" onclick="tracker.showAddColumnModal()">
                    + Add Column
                </button>
            </div>
        `;
        
        container.insertBefore(header, container.firstChild);
        this.updateOverallProgress();
    }

    getSubjectIcon() {
        const icons = {
            'physics': '📚',
            'physical-chemistry': '⚛️',
            'organic-chemistry': '🧪',
            'biology': '🔬'
        };
        return icons[this.subject] || '📖';
    }

    getSubjectTitle() {
        const titles = {
            'physics': 'Physics',
            'physical-chemistry': 'Physical Chemistry',
            'organic-chemistry': 'Organic Chemistry',
            'biology': 'Biology'
        };
        return titles[this.subject] || this.subject;
    }

    renderColumns() {
        const container = document.querySelector('.columns-container');
        if (!container) return;

        container.innerHTML = '';
        
        if (Object.keys(this.data).length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>No columns created yet</h3>
                    <p>Click "Add Column" to start organizing your study progress</p>
                </div>
            `;
            return;
        }

        Object.keys(this.data).forEach(columnName => {
            this.renderColumn(columnName, this.data[columnName]);
        });
    }

    renderColumn(columnName, chapters) {
        const container = document.querySelector('.columns-container');
        const column = document.createElement('div');
        column.className = 'column';
        column.dataset.columnName = columnName;

        const completedCount = chapters.filter(ch => ch.completed).length;
        const totalCount = chapters.length;
        const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
        
        // Enhanced progress status
        let progressIcon = '⏳';
        let progressClass = 'not-started';
        
        if (totalCount === 0) {
            progressIcon = '🚀';
        } else if (progressPercentage === 100) {
            progressIcon = '✅';
            progressClass = 'completed';
        } else if (progressPercentage > 0) {
            progressIcon = '📈';
            progressClass = 'in-progress';
        }

        column.innerHTML = `
            <div class="column-header">
                <div>
                    <div class="column-title">${columnName}</div>
                    <div class="column-stats">
                        <span style="font-size: 1.1em; margin-right: 6px;">${progressIcon}</span>
                        <span>${completedCount}/${totalCount} completed</span>
                        ${totalCount > 0 ? `<span style="margin-left: 8px; font-weight: 700; color: #2d3748;">(${Math.round(progressPercentage)}%)</span>` : ''}
                    </div>
                </div>
                <button class="delete-column-btn" onclick="tracker.deleteColumn('${columnName}')">
                    Delete
                </button>
            </div>
            <button class="add-chapter-btn" onclick="tracker.showAddChapterModal('${columnName}')">
                + Add Chapter
            </button>
            <div class="chapters-list">
                ${this.renderChapters(columnName, chapters)}
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progressPercentage}%"></div>
            </div>
        `;

        container.appendChild(column);
    }

    renderChapters(columnName, chapters) {
        if (chapters.length === 0) {
            return '<div class="empty-state">No chapters added yet</div>';
        }

        return chapters.map((chapter, index) => `
            <div class="chapter-item ${chapter.completed ? 'completed' : ''}" onclick="tracker.toggleChapter('${columnName}', ${index})">
                <input type="checkbox" class="chapter-checkbox" 
                       ${chapter.completed ? 'checked' : ''} 
                       readonly>
                <span class="chapter-text ${chapter.completed ? 'completed' : ''}">${chapter.name}</span>
                <button class="delete-chapter-btn" onclick="event.stopPropagation(); tracker.deleteChapter('${columnName}', ${index})" title="Delete chapter">×</button>
            </div>
        `).join('');
    }

    setupEventListeners() {
        // Close modal when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    showAddColumnModal() {
        this.showModal('Add New Column', 'Enter column name:', '', (value) => {
            if (value.trim()) {
                this.addColumn(value.trim());
            }
        });
    }

    showAddChapterModal(columnName) {
        this.showModal('Add New Chapter', 'Enter chapter name:', '', (value) => {
            if (value.trim()) {
                this.addChapter(columnName, value.trim());
            }
        });
    }

    showModal(title, label, defaultValue, onConfirm) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                </div>
                <label for="modal-input">${label}</label>
                <input type="text" id="modal-input" class="modal-input" value="${defaultValue}" placeholder="Enter name...">
                <div class="modal-buttons">
                    <button class="modal-btn btn-secondary" onclick="tracker.closeModal()">Cancel</button>
                    <button class="modal-btn btn-primary" onclick="tracker.confirmModal()">Add</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'block';
        
        const input = modal.querySelector('#modal-input');
        input.focus();
        input.select();

        this.currentModal = {
            element: modal,
            onConfirm: onConfirm
        };

        // Enter key to confirm
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.confirmModal();
            }
        });
    }

    confirmModal() {
        if (!this.currentModal) return;
        
        const input = this.currentModal.element.querySelector('#modal-input');
        const value = input.value.trim();
        
        if (value) {
            this.currentModal.onConfirm(value);
        }
        
        this.closeModal();
    }

    closeModal() {
        if (this.currentModal) {
            document.body.removeChild(this.currentModal.element);
            this.currentModal = null;
        }
    }

    addColumn(name) {
        if (this.data[name]) {
            alert('Column with this name already exists!');
            return;
        }
        
        this.data[name] = [];
        this.saveData();
        this.renderColumns();
        this.updateOverallProgress();
    }

    deleteColumn(columnName) {
        if (confirm(`Are you sure you want to delete the "${columnName}" column and all its chapters?`)) {
            delete this.data[columnName];
            this.saveData();
            this.renderColumns();
            this.updateOverallProgress();
        }
    }

    addChapter(columnName, chapterName) {
        if (!this.data[columnName]) {
            this.data[columnName] = [];
        }
        
        // Check for duplicate chapter names in the same column
        if (this.data[columnName].some(ch => ch.name === chapterName)) {
            alert('Chapter with this name already exists in this column!');
            return;
        }
        
        this.data[columnName].push({
            name: chapterName,
            completed: false,
            createdAt: Date.now()
        });
        
        this.saveData();
        this.renderColumns();
        this.updateOverallProgress();
    }

    deleteChapter(columnName, chapterIndex) {
        const chapter = this.data[columnName][chapterIndex];
        if (confirm(`Are you sure you want to delete "${chapter.name}"?`)) {
            this.data[columnName].splice(chapterIndex, 1);
            this.saveData();
            this.renderColumns();
            this.updateOverallProgress();
        }
    }

    toggleChapter(columnName, chapterIndex) {
        if (this.data[columnName] && this.data[columnName][chapterIndex]) {
            this.data[columnName][chapterIndex].completed = !this.data[columnName][chapterIndex].completed;
            this.saveData();
            this.renderColumns();
            this.updateOverallProgress();
        }
    }

    updateOverallProgress() {
        const progressElement = document.getElementById('total-progress');
        if (!progressElement) return;

        const totalChapters = Object.values(this.data).reduce((total, column) => total + column.length, 0);
        const completedChapters = Object.values(this.data).reduce((total, column) => 
            total + column.filter(chapter => chapter.completed).length, 0);

        if (totalChapters === 0) {
            progressElement.innerHTML = `
                <span style="color: #718096;">
                    <span style="font-size: 1.2em; margin-right: 6px;">🚀</span>
                    Ready to start! Add some columns and chapters.
                </span>
            `;
        } else {
            const percentage = Math.round((completedChapters / totalChapters) * 100);
            let statusIcon = '📈';
            let statusColor = '#3182ce';
            
            if (percentage === 100) {
                statusIcon = '🎉';
                statusColor = '#38a169';
            } else if (percentage >= 75) {
                statusIcon = '🔥';
                statusColor = '#d69e2e';
            } else if (percentage >= 50) {
                statusIcon = '💪';
                statusColor = '#3182ce';
            } else if (percentage >= 25) {
                statusIcon = '📚';
                statusColor = '#805ad5';
            }
            
            progressElement.innerHTML = `
                <span style="color: ${statusColor};">
                    <span style="font-size: 1.2em; margin-right: 6px;">${statusIcon}</span>
                    <strong>${completedChapters}/${totalChapters}</strong> chapters completed 
                    <span style="font-weight: 700; margin-left: 6px;">(${percentage}%)</span>
                </span>
            `;
        }
    }

    // Export functionality
    exportData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${this.subject}-progress.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    // Import functionality
    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                this.data = importedData;
                this.saveData();
                this.renderColumns();
                this.updateOverallProgress();
                alert('Data imported successfully!');
            } catch (error) {
                alert('Error importing data. Please check the file format.');
            }
        };
        reader.readAsText(file);
    }
}