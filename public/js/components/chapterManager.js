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
}
