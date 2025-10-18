// Chapter Manager Component for handling individual chapters
class ChapterManager {
    constructor(subject, columnName) {
        this.subject = subject;
        this.columnName = columnName;
        this.chapters = this.loadChapters();
    }

    loadChapters() {
        try {
            const subjectData = localStorage.getItem(`${this.subject}-data`);
            if (subjectData) {
                const data = JSON.parse(subjectData);
                return data[this.columnName] || [];
            }
            return [];
        } catch (error) {
            console.error('Error loading chapters:', error);
            return [];
        }
    }

    saveChapters() {
        try {
            const subjectData = localStorage.getItem(`${this.subject}-data`);
            const data = subjectData ? JSON.parse(subjectData) : {};
            data[this.columnName] = this.chapters;
            localStorage.setItem(`${this.subject}-data`, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving chapters:', error);
            return false;
        }
    }

    addChapter(chapterName) {
        if (!chapterName || chapterName.trim() === '') {
            throw new Error('Chapter name cannot be empty');
        }

        // Check for duplicate names
        if (this.chapters.some(chapter => chapter.name === chapterName.trim())) {
            throw new Error('Chapter with this name already exists');
        }

        const chapter = {
            id: this.generateId(),
            name: chapterName.trim(),
            completed: false,
            createdAt: Date.now(),
            completedAt: null,
            notes: ''
        };

        this.chapters.push(chapter);
        this.saveChapters();
        return chapter;
    }

    removeChapter(chapterId) {
        const index = this.chapters.findIndex(chapter => chapter.id === chapterId);
        if (index === -1) {
            throw new Error('Chapter not found');
        }

        const removedChapter = this.chapters.splice(index, 1)[0];
        this.saveChapters();
        return removedChapter;
    }

    updateChapter(chapterId, updates) {
        const chapter = this.chapters.find(ch => ch.id === chapterId);
        if (!chapter) {
            throw new Error('Chapter not found');
        }

        // Validate updates
        if (updates.name && updates.name.trim() === '') {
            throw new Error('Chapter name cannot be empty');
        }

        if (updates.name && updates.name !== chapter.name) {
            // Check for duplicate names
            if (this.chapters.some(ch => ch.id !== chapterId && ch.name === updates.name.trim())) {
                throw new Error('Chapter with this name already exists');
            }
        }

        // Apply updates
        Object.keys(updates).forEach(key => {
            if (key === 'name') {
                chapter[key] = updates[key].trim();
            } else {
                chapter[key] = updates[key];
            }
        });

        this.saveChapters();
        return chapter;
    }

    toggleCompletion(chapterId) {
        const chapter = this.chapters.find(ch => ch.id === chapterId);
        if (!chapter) {
            throw new Error('Chapter not found');
        }

        chapter.completed = !chapter.completed;
        chapter.completedAt = chapter.completed ? Date.now() : null;
        
        this.saveChapters();
        return chapter;
    }

    getChapters() {
        return [...this.chapters]; // Return a copy to prevent external modifications
    }

    getChapterById(chapterId) {
        return this.chapters.find(chapter => chapter.id === chapterId);
    }

    getCompletedChapters() {
        return this.chapters.filter(chapter => chapter.completed);
    }

    getPendingChapters() {
        return this.chapters.filter(chapter => !chapter.completed);
    }

    getProgress() {
        const total = this.chapters.length;
        const completed = this.getCompletedChapters().length;
        return {
            total,
            completed,
            pending: total - completed,
            percentage: total > 0 ? Math.round((completed / total) * 100) : 0
        };
    }

    reorderChapters(fromIndex, toIndex) {
        if (fromIndex < 0 || fromIndex >= this.chapters.length ||
            toIndex < 0 || toIndex >= this.chapters.length) {
            throw new Error('Invalid chapter indices');
        }

        const chapter = this.chapters.splice(fromIndex, 1)[0];
        this.chapters.splice(toIndex, 0, chapter);
        this.saveChapters();
        return this.chapters;
    }

    searchChapters(query) {
        if (!query || query.trim() === '') {
            return this.chapters;
        }

        const searchTerm = query.toLowerCase().trim();
        return this.chapters.filter(chapter => 
            chapter.name.toLowerCase().includes(searchTerm) ||
            chapter.notes.toLowerCase().includes(searchTerm)
        );
    }

    getStatistics() {
        const progress = this.getProgress();
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        const oneWeek = 7 * oneDay;

        const recentlyCompleted = this.chapters.filter(chapter => 
            chapter.completed && 
            chapter.completedAt && 
            (now - chapter.completedAt) <= oneWeek
        ).length;

        const averageCompletionTime = this.calculateAverageCompletionTime();

        return {
            ...progress,
            recentlyCompleted,
            averageCompletionTime,
            oldestChapter: this.getOldestChapter(),
            newestChapter: this.getNewestChapter()
        };
    }

    calculateAverageCompletionTime() {
        const completedChapters = this.getCompletedChapters().filter(ch => ch.completedAt);
        if (completedChapters.length === 0) return null;

        const totalTime = completedChapters.reduce((sum, chapter) => {
            return sum + (chapter.completedAt - chapter.createdAt);
        }, 0);

        return Math.round(totalTime / completedChapters.length);
    }

    getOldestChapter() {
        if (this.chapters.length === 0) return null;
        return this.chapters.reduce((oldest, current) => 
            current.createdAt < oldest.createdAt ? current : oldest
        );
    }

    getNewestChapter() {
        if (this.chapters.length === 0) return null;
        return this.chapters.reduce((newest, current) => 
            current.createdAt > newest.createdAt ? current : newest
        );
    }

    exportChapters() {
        return {
            subject: this.subject,
            columnName: this.columnName,
            chapters: this.chapters,
            exportedAt: Date.now(),
            statistics: this.getStatistics()
        };
    }

    importChapters(importData) {
        if (!importData.chapters || !Array.isArray(importData.chapters)) {
            throw new Error('Invalid import data format');
        }

        // Validate chapter structure
        const validChapters = importData.chapters.filter(chapter => 
            chapter.name && typeof chapter.name === 'string' &&
            typeof chapter.completed === 'boolean'
        );

        if (validChapters.length === 0) {
            throw new Error('No valid chapters found in import data');
        }

        // Ensure each chapter has required fields
        const processedChapters = validChapters.map(chapter => ({
            id: chapter.id || this.generateId(),
            name: chapter.name.trim(),
            completed: chapter.completed,
            createdAt: chapter.createdAt || Date.now(),
            completedAt: chapter.completedAt || null,
            notes: chapter.notes || ''
        }));

        this.chapters = processedChapters;
        this.saveChapters();
        return this.chapters;
    }

    clearAllChapters() {
        this.chapters = [];
        this.saveChapters();
        return true;
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

// Utility functions for bulk operations
class ChapterBulkOperations {
    static markAllCompleted(chapterManager) {
        chapterManager.chapters.forEach(chapter => {
            if (!chapter.completed) {
                chapter.completed = true;
                chapter.completedAt = Date.now();
            }
        });
        chapterManager.saveChapters();
        return chapterManager.chapters;
    }

    static markAllPending(chapterManager) {
        chapterManager.chapters.forEach(chapter => {
            chapter.completed = false;
            chapter.completedAt = null;
        });
        chapterManager.saveChapters();
        return chapterManager.chapters;
    }

    static deleteCompleted(chapterManager) {
        const originalCount = chapterManager.chapters.length;
        chapterManager.chapters = chapterManager.chapters.filter(chapter => !chapter.completed);
        chapterManager.saveChapters();
        return originalCount - chapterManager.chapters.length;
    }

    static sortByName(chapterManager, ascending = true) {
        chapterManager.chapters.sort((a, b) => {
            const comparison = a.name.localeCompare(b.name);
            return ascending ? comparison : -comparison;
        });
        chapterManager.saveChapters();
        return chapterManager.chapters;
    }

    static sortByCompletion(chapterManager, completedFirst = false) {
        chapterManager.chapters.sort((a, b) => {
            if (completedFirst) {
                return b.completed - a.completed;
            } else {
                return a.completed - b.completed;
            }
        });
        chapterManager.saveChapters();
        return chapterManager.chapters;
    }

    static sortByDate(chapterManager, newestFirst = true) {
        chapterManager.chapters.sort((a, b) => {
            const comparison = a.createdAt - b.createdAt;
            return newestFirst ? -comparison : comparison;
        });
        chapterManager.saveChapters();
        return chapterManager.chapters;
    }
}