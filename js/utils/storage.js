// Storage utility for managing progress tracker data
class StorageManager {
    constructor() {
        this.storageKey = 'progress-tracker-data';
    }

    // Save data for a specific subject
    saveSubjectData(subject, data) {
        try {
            localStorage.setItem(`${subject}-data`, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving data:', error);
            return false;
        }
    }

    // Load data for a specific subject
    loadSubjectData(subject) {
        try {
            const data = localStorage.getItem(`${subject}-data`);
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error('Error loading data:', error);
            return {};
        }
    }

    // Clear all data for a subject
    clearSubjectData(subject) {
        try {
            localStorage.removeItem(`${subject}-data`);
            return true;
        } catch (error) {
            console.error('Error clearing data:', error);
            return false;
        }
    }

    // Export all data as JSON
    exportAllData() {
        const subjects = ['physics', 'physical-chemistry', 'organic-chemistry', 'biology'];
        const allData = {};
        
        subjects.forEach(subject => {
            allData[subject] = this.loadSubjectData(subject);
        });
        
        return JSON.stringify(allData, null, 2);
    }

    // Import data from JSON
    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            Object.keys(data).forEach(subject => {
                this.saveSubjectData(subject, data[subject]);
            });
            
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }

    // Get storage usage statistics
    getStorageStats() {
        let totalSize = 0;
        const subjects = ['physics', 'physical-chemistry', 'organic-chemistry', 'biology'];
        const stats = {};
        
        subjects.forEach(subject => {
            const data = localStorage.getItem(`${subject}-data`);
            const size = data ? data.length : 0;
            totalSize += size;
            stats[subject] = {
                size: size,
                chapters: data ? Object.values(JSON.parse(data)).reduce((total, column) => total + column.length, 0) : 0
            };
        });
        
        return {
            totalSize,
            subjects: stats
        };
    }
}

// Create global instance
const storageManager = new StorageManager();

// Legacy functions for backward compatibility
function saveProgress(subject, chapters) {
    return storageManager.saveSubjectData(subject, chapters);
}

function loadProgress(subject) {
    return storageManager.loadSubjectData(subject);
}

function clearProgress(subject) {
    return storageManager.clearSubjectData(subject);
}