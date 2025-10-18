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
                <a href="../index.html" class="back-btn">504 Back to Home</a>
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
            'physics': '4da',
            'physical-chemistry': '69be0f',
            'organic-chemistry': '9ea',
            'biology': '52c'
        };
        return icons[this.subject] || '4d6';
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
    }
}
